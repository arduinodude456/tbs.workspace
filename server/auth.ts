import crypto from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_PREFIX = "scrypt";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${SCRYPT_PREFIX}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false;
  const [prefix, salt, expectedHex] = stored.split("$");
  if (prefix !== SCRYPT_PREFIX || !salt || !expectedHex) return false;
  try {
    const actual = crypto.scryptSync(password, salt, KEY_LENGTH);
    const expected = Buffer.from(expectedHex, "hex");
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
