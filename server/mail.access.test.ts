import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { tbsMailAddress } from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "mail-test-user",
      email: "tester@example.com",
      name: "Mail Test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("internal TBS mail", () => {
  it("creates deterministic internal addresses", () => {
    expect(tbsMailAddress(7)).toBe("u7@tbs.workspace");
  });

  it("rejects external recipients at the API boundary", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.mail.send({
      recipientAddress: "friend@gmail.com",
      subject: "External test",
      body: "This must stay inside TBS.",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
