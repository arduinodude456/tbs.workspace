import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const apps = mysqlTable("apps", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 2048 }).notNull(),
  category: varchar("category", { length: 40 }).default("custom").notNull(),
  icon: varchar("icon", { length: 40 }).default("grid").notNull(),
  accent: varchar("accent", { length: 24 }).default("teal").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AppLink = typeof apps.$inferSelect;
export type InsertApp = typeof apps.$inferInsert;

export const mailMessages = mysqlTable("mailMessages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  senderName: varchar("senderName", { length: 160 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 160 }).notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 240 }).notNull(),
  body: text("body").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  isStarred: int("isStarred").default(0).notNull(),
});
export type MailMessage = typeof mailMessages.$inferSelect;
export type InsertMailMessage = typeof mailMessages.$inferInsert;

export const textDocuments = mysqlTable("textDocuments", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TextDocument = typeof textDocuments.$inferSelect;
export type InsertTextDocument = typeof textDocuments.$inferInsert;
