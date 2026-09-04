import { describe, expect, it } from "vitest";
import { createSessionToken, hashPassword, hashSessionToken, verifyPassword } from "./auth";

describe("local TBS auth crypto", () => {
  it("hashes and verifies passwords without storing plaintext", () => {
    const password = "correct horse battery staple";
    const stored = hashPassword(password);
    expect(stored).not.toContain(password);
    expect(verifyPassword(password, stored)).toBe(true);
    expect(verifyPassword("wrong password", stored)).toBe(false);
  });

  it("creates opaque tokens and deterministic token hashes", () => {
    const token = createSessionToken();
    expect(token.length).toBeGreaterThan(30);
    expect(hashSessionToken(token)).toHaveLength(64);
    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });
});
