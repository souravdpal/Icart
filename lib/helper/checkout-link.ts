import crypto from "crypto";

export type Medium = "c" | "p";

export type LinkCheck =
  | { ok: true; userid: string; exp: number; medium: Medium; productId: string | null }
  | { ok: false; reason: "missing" | "expired" | "invalid" };

export const isMedium = (v: unknown): v is Medium => v === "c" || v === "p";

// Restrict the charset so the "." separator can never be injected via the id
export const isProductId = (v: unknown): v is string =>
  typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v);

function secret(): string {
  const s = process.env.api_salt_key;
  if (!s) throw new Error("api_salt_key is not set");
  return s;
}

function sign(userid: string, exp: number | string, medium: Medium, productId: string | null) {
  const payload =
    medium === "p" ? `${userid}.${exp}.p.${productId}` : `${userid}.${exp}.c`;
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createCheckoutLink(
  userid: string,
  medium: Medium,
  productId?: string,
  ttlSeconds = 60,
): string {
  if (medium === "p" && !isProductId(productId)) throw new Error("productId required for medium p");

  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const pid = medium === "p" ? (productId as string) : null;

  const qs = new URLSearchParams({
    userid,
    exp: String(exp),
    medium,
    ...(pid && { pid }),
    sig: sign(userid, exp, medium, pid),
  });
  return `/pay/c?${qs.toString()}`;
}

export function verifyCheckoutLink(input: {
  userid?: string | null;
  exp?: string | null;
  medium?: string | null;
  pid?: string | null;
  sig?: string | null;
}): LinkCheck {
  const { userid, exp, medium, pid, sig } = input;

  if (!userid || !exp || !medium || !sig) return { ok: false, reason: "missing" };
  if (medium === "p" && !pid) return { ok: false, reason: "missing" };

  const expiresAt = Number(exp);
  if (
    !Number.isFinite(expiresAt) ||
    !isMedium(medium) ||
    !/^[0-9a-f]{64}$/i.test(sig) ||
    (medium === "p" && !isProductId(pid))
  )
    return { ok: false, reason: "invalid" };

  if (Math.floor(Date.now() / 1000) > expiresAt) return { ok: false, reason: "expired" };

  const productId = medium === "p" ? (pid as string) : null;

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(sign(userid, exp, medium, productId), "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return { ok: false, reason: "invalid" };

  return { ok: true, userid, exp: expiresAt, medium, productId };
}