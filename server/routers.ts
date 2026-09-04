import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { archiveApp, createApp, getActiveApps, getAllApps, getUsersForAdmin } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  apps: router({
    list: protectedProcedure.query(() => getActiveApps()),
    adminList: adminProcedure.query(() => getAllApps()),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(120),
          url: z.string().url().max(2048),
          description: z.string().trim().max(500).optional(),
          category: z.string().trim().max(40).default("custom"),
          icon: z.string().trim().max(40).default("grid"),
          accent: z.string().trim().max(24).default("teal"),
          sortOrder: z.number().int().min(0).max(999).default(0),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await createApp({ ...input, createdBy: ctx.user.id });
        return { success: true } as const;
      }),
    archive: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await archiveApp(input.id);
        return { success: true } as const;
      }),
  }),

  admin: router({
    users: adminProcedure.query(() => getUsersForAdmin()),
  }),
});

export type AppRouter = typeof appRouter;

// Kept near the router as a visible policy boundary for future procedures.
export const assertAdmin = (role: string) => {
  if (role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
};
