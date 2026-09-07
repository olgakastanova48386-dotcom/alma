import { env } from "cloudflare:workers";
import { authDb } from "@/lib/auth";

export const ROUTE_PRODUCT = "route-199";
export const ROUTE_PRICE = 199;

export async function ensurePaymentSchema() {
  const database = authDb();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS payment_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
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
      granted_at INTEGER NOT NULL,
      source_request_id TEXT,
      PRIMARY KEY(user_id, product),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS saved_routes (
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      route_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, product),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_payment_requests_user_product ON payment_requests(user_id, product)"),
    database.prepare("CREATE INDEX IF NOT EXISTS idx_payment_requests_reference ON payment_requests(reference)")
  ]);
}

function referenceCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `ALMA-${Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export async function saveRouteDraft(userId: string, route: unknown) {
  await ensurePaymentSchema();
  const routeJson = JSON.stringify(route);
  if (routeJson.length > 20_000) throw new Error("route_too_large");
  const now = Math.floor(Date.now() / 1000);
  await authDb().prepare(`INSERT INTO saved_routes (user_id, product, route_json, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, product) DO UPDATE SET route_json = excluded.route_json, updated_at = excluded.updated_at`)
    .bind(userId, ROUTE_PRODUCT, routeJson, now).run();
  return { ok: true, updatedAt: now };
}

export async function getSavedRouteDraft(userId: string) {
  await ensurePaymentSchema();
  const row = await authDb().prepare("SELECT route_json, updated_at FROM saved_routes WHERE user_id = ? AND product = ?")
    .bind(userId, ROUTE_PRODUCT).first();
  if (!row) return null;
  try { return { route: JSON.parse(String(row.route_json)), updatedAt: row.updated_at }; }
  catch { return null; }
}

export async function createOrGetPendingRequest(userId: string) {
  await ensurePaymentSchema();
  const existing = await authDb().prepare(`SELECT id, reference, status, created_at FROM payment_requests
    WHERE user_id = ? AND product = ? AND status IN ('awaiting_transfer','awaiting_manual_confirmation')
    ORDER BY created_at DESC LIMIT 1`).bind(userId, ROUTE_PRODUCT).first();
  if (existing) return existing;

  const id = crypto.randomUUID();
  const reference = referenceCode();
  const now = Math.floor(Date.now() / 1000);
  await authDb().prepare(`INSERT INTO payment_requests (id, user_id, product, amount, currency, reference, status, created_at)
    VALUES (?, ?, ?, ?, 'RUB', ?, 'awaiting_transfer', ?)`)
    .bind(id, userId, ROUTE_PRODUCT, ROUTE_PRICE, reference, now).run();
  return { id, reference, status: "awaiting_transfer", created_at: now };
}

export async function markTransferSent(userId: string, reference: string) {
  await ensurePaymentSchema();
  await authDb().prepare(`UPDATE payment_requests SET status = 'awaiting_manual_confirmation'
    WHERE user_id = ? AND product = ? AND reference = ? AND status = 'awaiting_transfer'`)
    .bind(userId, ROUTE_PRODUCT, reference).run();
  return authDb().prepare(`SELECT id, reference, status, created_at, confirmed_at FROM payment_requests
    WHERE user_id = ? AND product = ? AND reference = ? LIMIT 1`).bind(userId, ROUTE_PRODUCT, reference).first();
}

export async function getRoutePurchaseStatus(userId: string) {
  await ensurePaymentSchema();
  const entitlement = await authDb().prepare("SELECT granted_at, source_request_id FROM entitlements WHERE user_id = ? AND product = ?")
    .bind(userId, ROUTE_PRODUCT).first();
  if (entitlement) return { entitled: true, status: "paid", grantedAt: entitlement.granted_at };
  const request = await authDb().prepare(`SELECT reference, status, created_at FROM payment_requests
    WHERE user_id = ? AND product = ? ORDER BY created_at DESC LIMIT 1`).bind(userId, ROUTE_PRODUCT).first();
  return { entitled: false, status: request?.status || "none", reference: request?.reference || null };
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
  const payment = await authDb().prepare(`SELECT id, user_id, product, status FROM payment_requests WHERE reference = ? LIMIT 1`).bind(reference).first();
  if (!payment) return null;
  const now = Math.floor(Date.now() / 1000);
  await authDb().batch([
    authDb().prepare("UPDATE payment_requests SET status = 'paid', confirmed_at = ? WHERE id = ?").bind(now, payment.id),
    authDb().prepare(`INSERT INTO entitlements (user_id, product, granted_at, source_request_id) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, product) DO UPDATE SET granted_at = excluded.granted_at, source_request_id = excluded.source_request_id`)
      .bind(payment.user_id, payment.product, now, payment.id)
  ]);
  return { ok: true, reference, userId: payment.user_id, product: payment.product, confirmedAt: now };
}
