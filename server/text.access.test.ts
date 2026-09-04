import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const baseContext = (user: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("TBS Text access", () => {
  it("requires an authenticated TBS account", async () => {
    const caller = appRouter.createCaller(baseContext(null));
    await expect(caller.text.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects an empty document title before persistence", async () => {
    const caller = appRouter.createCaller(baseContext({
      id: 1,
      openId: "text-test-user",
      name: "Text Test",
      email: "text@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.text.create({ title: "", content: "# Inhalt" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
