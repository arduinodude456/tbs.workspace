import { and, asc, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { apps, InsertApp, users, InsertUser, mailMessages, InsertMailMessage, User } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
export async function getUserByEmail(email: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.email, email)).limit(1); return result[0]; }
export async function getUserById(id: number) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.id, id)).limit(1); return result[0]; }
export function tbsMailAddress(userId: number) { return `u${userId}@tbs.workspace`; }
export async function getActiveApps() { const db = await getDb(); if (!db) return []; return db.select().from(apps).where(eq(apps.isActive, 1)).orderBy(asc(apps.sortOrder), desc(apps.createdAt)); }
export async function getAllApps() { const db = await getDb(); if (!db) return []; return db.select().from(apps).orderBy(asc(apps.sortOrder), desc(apps.createdAt)); }
export async function createApp(app: InsertApp) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.insert(apps).values(app); }
export async function archiveApp(id: number) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.update(apps).set({ isActive: 0 }).where(eq(apps.id, id)); }
export async function getUsersForAdmin() { const db = await getDb(); if (!db) return []; return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn, loginMethod: users.loginMethod }).from(users).orderBy(desc(users.lastSignedIn)); }

export async function getMailboxMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mailMessages).where(or(eq(mailMessages.senderId, userId), eq(mailMessages.recipientId, userId))).orderBy(desc(mailMessages.sentAt));
}

export async function markMailRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(mailMessages).set({ readAt: new Date() }).where(and(eq(mailMessages.id, id), eq(mailMessages.recipientId, userId)));
}

export async function toggleMailStar(id: number, userId: number, starred: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(mailMessages).set({ isStarred: starred ? 1 : 0 }).where(and(eq(mailMessages.id, id), or(eq(mailMessages.senderId, userId), eq(mailMessages.recipientId, userId))));
}

export async function sendInternalMail(sender: User, recipient: User, input: Pick<InsertMailMessage, "subject" | "body">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const message: InsertMailMessage = { senderId: sender.id, recipientId: recipient.id, senderName: sender.name || sender.email || "TBS Nutzer", senderEmail: tbsMailAddress(sender.id), recipientName: recipient.name || recipient.email || "TBS Nutzer", recipientEmail: tbsMailAddress(recipient.id), subject: input.subject, body: input.body };
  await db.insert(mailMessages).values(message);
}
