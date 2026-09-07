import { env } from "cloudflare:workers";

const SESSION_COOKIE = "alma_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const PBKDF2_ITERATIONS = 100_000;
const CODE_TTL = 10 * 60;

function db(): any { return (env as any).ALMA_DB; }

export async function ensureAuthSchema() {
  const database = db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      gender TEXT NOT NULL DEFAULT 'unspecified',
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      marketing_sms INTEGER NOT NULL DEFAULT 0,
      phone_verified INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL,
      place_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, place_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS auth_rate_limits (
      scope TEXT NOT NULL,
      subject_hash TEXT NOT NULL,
      window_started_at INTEGER NOT NULL,
      hits INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY(scope, subject_hash)
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS phone_codes (
      phone TEXT NOT NULL,
      purpose TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      PRIMARY KEY(phone, purpose)
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS route_photos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      place_id INTEGER NOT NULL,
      place_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      image_base64 TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      reviewed_at INTEGER,
      reviewed_by TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_phone_codes_expires_at ON phone_codes(expires_at)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_route_photos_place_status ON route_photos(place_id, status)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_route_photos_status_created ON route_photos(status, created_at)")
  ]);

  const columns = await database.prepare("PRAGMA table_info(users)").all();
  const hasVerified = (columns?.results || []).some((row: any) => row.name === "phone_verified");
  if (!hasVerified) await database.prepare("ALTER TABLE users ADD COLUMN phone_verified INTEGER NOT NULL DEFAULT 0").run();
}

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/\D/g, "");
  return plus + digits;
}

function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(""); }
function hexToBytes(hex: string) { const bytes = new Uint8Array(hex.length / 2); for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16); return bytes; }
async function sha256(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return bytesToHex(new Uint8Array(digest)); }

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const { hash } = await hashPassword(password, salt);
  if (hash.length !== expectedHash.length) return false;
  let diff = 0; for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  return diff === 0;
}

async function hashSessionToken(token: string) { return sha256(token); }

export async function consumeAuthRateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "";
  if (!ip) return { allowed: true, retryAfter: 0 };
  const subjectHash = await sha256(ip);
  const now = Math.floor(Date.now() / 1000);
  const row = await db().prepare("SELECT window_started_at, hits FROM auth_rate_limits WHERE scope = ? AND subject_hash = ?").bind(scope, subjectHash).first();
  if (!row || now - Number(row.window_started_at) >= windowSeconds) {
    await db().prepare(`INSERT INTO auth_rate_limits (scope, subject_hash, window_started_at, hits) VALUES (?, ?, ?, 1)
      ON CONFLICT(scope, subject_hash) DO UPDATE SET window_started_at = excluded.window_started_at, hits = 1`).bind(scope, subjectHash, now).run();
    return { allowed: true, retryAfter: 0 };
  }
  const hits = Number(row.hits);
  if (hits >= limit) return { allowed: false, retryAfter: Math.max(1, windowSeconds - (now - Number(row.window_started_at))) };
  await db().prepare("UPDATE auth_rate_limits SET hits = hits + 1 WHERE scope = ? AND subject_hash = ?").bind(scope, subjectHash).run();
  return { allowed: true, retryAfter: 0 };
}

export async function issuePhoneCode(phone: string, purpose: "verify" | "reset") {
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  const codeHash = await sha256(`${phone}:${purpose}:${code}`);
  const now = Math.floor(Date.now() / 1000);
  await db().prepare(`INSERT INTO phone_codes (phone, purpose, code_hash, expires_at, attempts, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
    ON CONFLICT(phone, purpose) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, created_at = excluded.created_at`)
    .bind(phone, purpose, codeHash, now + CODE_TTL, now).run();
  return code;
}

export async function verifyPhoneCode(phone: string, purpose: "verify" | "reset", code: string) {
  const row = await db().prepare("SELECT code_hash, expires_at, attempts FROM phone_codes WHERE phone = ? AND purpose = ?").bind(phone, purpose).first();
  const now = Math.floor(Date.now() / 1000);
  if (!row || Number(row.expires_at) < now || Number(row.attempts) >= 5) return false;
  const candidate = await sha256(`${phone}:${purpose}:${code}`);
  if (candidate !== row.code_hash) {
    await db().prepare("UPDATE phone_codes SET attempts = attempts + 1 WHERE phone = ? AND purpose = ?").bind(phone, purpose).run();
    return false;
  }
  await db().prepare("DELETE FROM phone_codes WHERE phone = ? AND purpose = ?").bind(phone, purpose).run();
  return true;
}

export async function sendSmsCode(phone: string, code: string, purpose: "verify" | "reset") {
  const apiUrl = String((env as any).SMS_API_URL || "").trim();
  const apiToken = String((env as any).SMS_API_TOKEN || "").trim();
  if (!apiUrl) throw new Error("SMS_PROVIDER_NOT_CONFIGURED");
  const message = purpose === "verify" ? `ALMA: код подтверждения ${code}. Он действует 10 минут.` : `ALMA: код восстановления ${code}. Он действует 10 минут.`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}) },
    body: JSON.stringify({ phone, message, code, purpose })
  });
  if (!response.ok) throw new Error("SMS_SEND_FAILED");
}

export async function createSession(userId: string) {
  const raw = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const id = await hashSessionToken(raw);
  const now = Math.floor(Date.now() / 1000);
  await db().prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now).run();
  await db().prepare("INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)").bind(id, userId, now, now + SESSION_MAX_AGE).run();
  return raw;
}

export function sessionCookie(token: string) { return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`; }
export function clearSessionCookie() { return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export function readCookie(request: Request, name: string) { const raw = request.headers.get("cookie") || ""; const item = raw.split(";").map(v => v.trim()).find(v => v.startsWith(`${name}=`)); return item ? decodeURIComponent(item.slice(name.length + 1)) : null; }

export async function getCurrentUser(request: Request) {
  await ensureAuthSchema();
  const token = readCookie(request, SESSION_COOKIE); if (!token) return null;
  const id = await hashSessionToken(token); const now = Math.floor(Date.now() / 1000);
  const row = await db().prepare(`SELECT users.id, users.name, users.phone, users.gender, users.marketing_sms, users.phone_verified, users.created_at
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > ?`).bind(id, now).first();
  return row || null;
}

export async function deleteCurrentSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE); if (!token) return;
  const id = await hashSessionToken(token); await db().prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}

export function isPhotoModerator(user: any) { return normalizePhone(String(user?.phone || "")) === "+79990000001"; }
export function authDb(): any { return db(); }
