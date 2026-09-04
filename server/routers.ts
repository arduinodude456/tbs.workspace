import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { archiveApp, createApp, createTextDocument, deleteTextDocument, getActiveApps, getAllApps, getMailboxMessages, getTextDocuments, getUserById, getUsersForAdmin, markMailRead, sendInternalMail, tbsMailAddress, toggleMailStar, updateTextDocument } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  apps: router({
    list: protectedProcedure.query(() => getActiveApps()),
    adminList: adminProcedure.query(() => getAllApps()),
    create: adminProcedure.input(z.object({ name: z.string().trim().min(2).max(120), url: z.string().url().max(2048), description: z.string().trim().max(500).optional(), category: z.string().trim().max(40).default("custom"), icon: z.string().trim().max(40).default("grid"), accent: z.string().trim().max(24).default("teal"), sortOrder: z.number().int().min(0).max(999).default(0) })).mutation(async ({ ctx, input }) => { await createApp({ ...input, createdBy: ctx.user.id }); return { success: true } as const; }),
    archive: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await archiveApp(input.id); return { success: true } as const; }),
  }),
  admin: router({ users: adminProcedure.query(() => getUsersForAdmin()) }),
  mail: router({
    list: protectedProcedure.query(({ ctx }) => getMailboxMessages(ctx.user.id)),
    markRead: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await markMailRead(input.id, ctx.user.id); return { success: true } as const; }),
    toggleStar: protectedProcedure.input(z.object({ id: z.number().int().positive(), starred: z.boolean() })).mutation(async ({ ctx, input }) => { await toggleMailStar(input.id, ctx.user.id, input.starred); return { success: true } as const; }),
    send: protectedProcedure.input(z.object({ recipientAddress: z.string().trim().regex(/^u[1-9][0-9]*@tbs\.workspace$/, "Bitte eine interne TBS-Adresse wie u2@tbs.workspace verwenden."), subject: z.string().trim().min(1).max(240), body: z.string().trim().min(1).max(10000) })).mutation(async ({ ctx, input }) => { const recipientId = Number(input.recipientAddress.match(/^u([1-9][0-9]*)@tbs\.workspace$/)?.[1]); const recipient = await getUserById(recipientId); if (!recipient || tbsMailAddress(recipient.id) !== input.recipientAddress) throw new TRPCError({ code: "NOT_FOUND", message: "Diese Adresse gehört keinem registrierten TBS-Nutzer. Externe Empfänger sind nicht möglich." }); await sendInternalMail(ctx.user, recipient, input); return { success: true } as const; }),
  }),
  text: router({
    list: protectedProcedure.query(({ ctx }) => getTextDocuments(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().trim().min(1).max(240), content: z.string().max(100000) })).mutation(async ({ ctx, input }) => { await createTextDocument(ctx.user.id, input); return { success: true } as const; }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().trim().min(1).max(240), content: z.string().max(100000) })).mutation(async ({ ctx, input }) => { await updateTextDocument(ctx.user.id, input.id, { title: input.title, content: input.content }); return { success: true } as const; }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await deleteTextDocument(ctx.user.id, input.id); return { success: true } as const; }),
  }),
});

export type AppRouter = typeof appRouter;
