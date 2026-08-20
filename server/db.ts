import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  BlepharoplastyLead,
  ClinicAsset,
  InsertBlepharoplastyLead,
  InsertClinicAsset,
  InsertLead,
  InsertUser,
  blepharoplastyLeads,
  clinicAssets,
  leads,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Clinic Assets ──────────────────────────────────────────────────────────

export async function insertClinicAsset(
  asset: InsertClinicAsset
): Promise<ClinicAsset> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clinicAssets).values(asset);
  const rows = await db
    .select()
    .from(clinicAssets)
    .where(eq(clinicAssets.fileKey, asset.fileKey))
    .limit(1);
  return rows[0]!;
}

export async function getClinicAssets(): Promise<ClinicAsset[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clinicAssets).orderBy(desc(clinicAssets.createdAt));
}

export async function getActiveAssetByCategory(
  category: ClinicAsset["category"]
): Promise<ClinicAsset | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(clinicAssets)
    .where(eq(clinicAssets.category, category))
    .orderBy(desc(clinicAssets.createdAt))
    .limit(1);
  return rows[0];
}

export async function deactivateAsset(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(clinicAssets)
    .set({ active: "no" })
    .where(eq(clinicAssets.id, id));
}

// ── Leads ──────────────────────────────────────────────────────────────────

export async function insertLead(lead: InsertLead): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leads).values(lead);
}

export async function getLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(
  id: number,
  status: "new" | "contacted" | "closed"
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

// ── Blepharoplasty leads ────────────────────────────────────────────────────

export async function insertBlepharoplastyLead(
  lead: InsertBlepharoplastyLead
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(blepharoplastyLeads).values(lead);
}

export async function getBlepharoplastyLeads(): Promise<BlepharoplastyLead[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blepharoplastyLeads).orderBy(desc(blepharoplastyLeads.createdAt));
}
