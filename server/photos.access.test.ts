import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = (user: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("TBS Photos access", () => {
  it("requires an authenticated account to list photos", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.photos.list({ albumId: null })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects non-image uploads at the API boundary", async () => {
    const caller = appRouter.createCaller(context({
      id: 4,
      openId: "photos-test-user",
      name: "Photos Test",
      email: "photos@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.photos.upload({
      fileName: "not-a-photo.txt",
      contentType: "text/plain",
      data: "dGVzdA==",
      byteSize: 4,
      albumId: null,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
