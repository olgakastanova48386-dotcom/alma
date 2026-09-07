import { env } from "cloudflare:workers";

const SESSION_COOKIE = "alma_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const PBKDF2_ITERATIONS = 210_000;

function db(): any {
  return (env as any).ALMA_DB;
}

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
      created_at INTEGER NOT NULL
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)")
  ]);
}

export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/\D/g, "");
  return plus + digits;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITERATIONS }, key, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const { hash } = await hashPassword(password, salt);
  if (hash.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  return diff === 0;
}

async function hashSessionToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return bytesToHex(new Uint8Array(digest));
}

export async function createSession(userId: string) {
  const raw = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const id = await hashSessionToken(raw);
  const now = Math.floor(Date.now() / 1000);
  await db().prepare("INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(id, userId, now, now + SESSION_MAX_AGE).run();
  return raw;
}

export function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie") || "";
  const item = raw.split(";").map(v => v.trim()).find(v => v.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

export async function getCurrentUser(request: Request) {
  await ensureAuthSchema();
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const id = await hashSessionToken(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await db().prepare(`SELECT users.id, users.name, users.phone, users.gender, users.marketing_sms, users.created_at
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > ?`).bind(id, now).first();
  return row || null;
}

export async function deleteCurrentSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return;
  const id = await hashSessionToken(token);
  await db().prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}

export function authDb(): any {
  return db();
}
