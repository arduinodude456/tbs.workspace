import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = (user: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("TBS settings access", () => {
  it("requires authentication for profile updates", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.settings.updateProfile({ name: "Test", email: "test@example.com" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects invalid contact email addresses", async () => {
    const caller = appRouter.createCaller(context({
      id: 9,
      openId: "settings-test-user",
      name: "Settings Test",
      email: "old@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.settings.updateProfile({ name: "Settings Test", email: "not-an-email" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
