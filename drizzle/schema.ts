import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
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

/**
 * App links shown in the private TBS launchpad.
 * URLs are kept as references; authentication remains with the linked service.
 */
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
