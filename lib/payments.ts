import { env } from "cloudflare:workers";
import { authDb } from "@/lib/auth";

export const ROUTE_PRODUCT = "route-199";
export const ROUTE_PRICE = 199;

export async function ensurePaymentSchema() {
  const database = authDb();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS saved_routes (
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      route_key TEXT NOT NULL,
      route_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, product),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS payment_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      route_key TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      reference TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      confirmed_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS entitlements (
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      route_key TEXT NOT NULL,
      granted_at INTEGER NOT NULL,
      source_request_id TEXT,
      PRIMARY KEY(user_id, product, route_key),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_payment_requests_user_product ON payment_requests(user_id, product)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_payment_requests_reference ON payment_requests(reference)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_entitlements_route ON entitlements(user_id, product, route_key)")
  ]);
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

async function routeKey(routeJson: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(routeJson));
  return bytesToHex(new Uint8Array(digest)).slice(0, 32);
}

function referenceCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `ALMA-${bytesToHex(bytes).toUpperCase()}`;
}

export async function saveRouteDraft(userId: string, route: unknown) {
  await ensurePaymentSchema();
  const routeJson = JSON.stringify(route);
  if (routeJson.length > 20_000) throw new Error("route_too_large");
  const key = await routeKey(routeJson);
  const now = Math.floor(Date.now() / 1000);
  await authDb().prepare(`INSERT INTO saved_routes (user_id, product, route_key, route_json, updated_at) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, product) DO UPDATE SET route_key = excluded.route_key, route_json = excluded.route_json, updated_at = excluded.updated_at`)
    .bind(userId, ROUTE_PRODUCT, key, routeJson, now).run();
  return { ok: true, routeKey: key, updatedAt: now };
}

export async function getSavedRouteDraft(userId: string) {
  await ensurePaymentSchema();
  const row = await authDb().prepare("SELECT route_key, route_json, updated_at FROM saved_routes WHERE user_id = ? AND product = ?")
    .bind(userId, ROUTE_PRODUCT).first();
  if (!row) return null;
  try { return { routeKey: row.route_key, route: JSON.parse(String(row.route_json)), updatedAt: row.updated_at }; }
  catch { return null; }
}

export async function createOrGetPendingRequest(userId: string) {
  await ensurePaymentSchema();
  const saved = await authDb().prepare("SELECT route_key FROM saved_routes WHERE user_id = ? AND product = ?").bind(userId, ROUTE_PRODUCT).first();
  if (!saved?.route_key) throw new Error("route_not_saved");
  const key = String(saved.route_key);
  const existing = await authDb().prepare(`SELECT id, reference, status, created_at, route_key FROM payment_requests
    WHERE user_id = ? AND product = ? AND route_key = ? AND status IN ('awaiting_transfer','awaiting_manual_confirmation')
    ORDER BY created_at DESC LIMIT 1`).bind(userId, ROUTE_PRODUCT, key).first();
  if (existing) return existing;

  const id = crypto.randomUUID();
  const reference = referenceCode();
  const now = Math.floor(Date.now() / 1000);
  await authDb().prepare(`INSERT INTO payment_requests (id, user_id, product, route_key, amount, currency, reference, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'RUB', ?, 'awaiting_transfer', ?)`)
    .bind(id, userId, ROUTE_PRODUCT, key, ROUTE_PRICE, reference, now).run();
  return { id, reference, route_key: key, status: "awaiting_transfer", created_at: now };
}

export async function markTransferSent(userId: string, reference: string) {
  await ensurePaymentSchema();
  await authDb().prepare(`UPDATE payment_requests SET status = 'awaiting_manual_confirmation'
    WHERE user_id = ? AND product = ? AND reference = ? AND status = 'awaiting_transfer'`)
    .bind(userId, ROUTE_PRODUCT, reference).run();
  return authDb().prepare(`SELECT id, reference, status, route_key, created_at, confirmed_at FROM payment_requests
    WHERE user_id = ? AND product = ? AND reference = ? LIMIT 1`).bind(userId, ROUTE_PRODUCT, reference).first();
}

export async function getRoutePurchaseStatus(userId: string) {
  await ensurePaymentSchema();
  const saved = await authDb().prepare("SELECT route_key FROM saved_routes WHERE user_id = ? AND product = ?").bind(userId, ROUTE_PRODUCT).first();
  const key = saved?.route_key ? String(saved.route_key) : null;
  if (!key) return { entitled: false, status: "none", routeKey: null };
  const entitlement = await authDb().prepare("SELECT granted_at, source_request_id FROM entitlements WHERE user_id = ? AND product = ? AND route_key = ?")
    .bind(userId, ROUTE_PRODUCT, key).first();
  if (entitlement) return { entitled: true, status: "paid", routeKey: key, grantedAt: entitlement.granted_at };
  const request = await authDb().prepare(`SELECT reference, status, created_at FROM payment_requests
    WHERE user_id = ? AND product = ? AND route_key = ? ORDER BY created_at DESC LIMIT 1`).bind(userId, ROUTE_PRODUCT, key).first();
  return { entitled: false, status: request?.status || "none", routeKey: key, reference: request?.reference || null };
}

function secretsMatch(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isAdminRequest(request: Request) {
  const expected = String((env as any).ALMA_ADMIN_SECRET || "");
  const supplied = request.headers.get("x-alma-admin-secret") || "";
  return secretsMatch(expected, supplied);
}

export async function confirmPaymentByReference(reference: string) {
  await ensurePaymentSchema();
  const payment = await authDb().prepare(`SELECT id, user_id, product, route_key, status FROM payment_requests WHERE reference = ? LIMIT 1`).bind(reference).first();
  if (!payment) return null;
  const now = Math.floor(Date.now() / 1000);
  await authDb().batch([
    authDb().prepare("UPDATE payment_requests SET status = 'paid', confirmed_at = ? WHERE id = ?").bind(now, payment.id),
    authDb().prepare(`INSERT INTO entitlements (user_id, product, route_key, granted_at, source_request_id) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, product, route_key) DO UPDATE SET granted_at = excluded.granted_at, source_request_id = excluded.source_request_id`)
      .bind(payment.user_id, payment.product, payment.route_key, now, payment.id)
  ]);
  return { ok: true, reference, userId: payment.user_id, product: payment.product, routeKey: payment.route_key, confirmedAt: now };
}
