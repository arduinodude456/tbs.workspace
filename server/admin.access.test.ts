import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : 2,
      openId: `${role}-open-id`,
      email: `${role}@example.com`,
      name: role === "admin" ? "TBS Admin" : "TBS Nutzer",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access", () => {
  it("rejects non-admin users before exposing admin data", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.users()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows an admin caller through the role boundary", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.admin.users()).resolves.toBeDefined();
  });
});
