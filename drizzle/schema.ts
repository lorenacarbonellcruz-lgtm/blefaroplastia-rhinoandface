import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
 * Clinic media assets — images uploaded by the admin to replace AI placeholders.
 * category: hero | doctor | clinic | texture | gallery
 */
export const clinicAssets = mysqlTable("clinic_assets", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", [
    "hero",
    "doctor",
    "clinic",
    "texture",
    "gallery",
  ]).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  filename: varchar("filename", { length: 255 }),
  mimeType: varchar("mimeType", { length: 64 }),
  sizeBytes: int("sizeBytes"),
  active: mysqlEnum("active", ["yes", "no"]).default("yes").notNull(),
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClinicAsset = typeof clinicAssets.$inferSelect;
export type InsertClinicAsset = typeof clinicAssets.$inferInsert;

/**
 * Contact form leads — submissions from the landing page.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }),
  consulta: varchar("consulta", { length: 64 }),
  source: mysqlEnum("source", ["rhinoplasty", "blepharoplasty"])
    .default("rhinoplasty")
    .notNull(),
  status: mysqlEnum("status", ["new", "contacted", "closed"])
    .default("new")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Leads exclusivos de la landing de blefaroplastia.
 * Esta tabla evita mezclar contactos con la landing de rinoplastia.
 */
export const blepharoplastyLeads = mysqlTable("blepharoplasty_leads", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }),
  mensaje: text("mensaje"),
  status: mysqlEnum("status", ["new", "contacted", "closed"])
    .default("new")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlepharoplastyLead = typeof blepharoplastyLeads.$inferSelect;
export type InsertBlepharoplastyLead = typeof blepharoplastyLeads.$inferInsert;
