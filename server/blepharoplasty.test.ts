import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  insertBlepharoplastyLead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./sanity", () => ({
  getBlepharoplastyContent: vi.fn().mockResolvedValue(null),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "blefaroplastia/hero/123.jpg",
    url: "/manus-storage/blefaroplastia/hero/123.jpg",
  }),
}));

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    ...makeCtx(),
    user: {
      id: 1,
      openId: "owner",
      name: "Owner",
      email: "owner@example.com",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

function makePreviewEditorCtx(code: string): TrpcContext {
  const ctx = makeCtx();
  ctx.req = { ...ctx.req, headers: { "x-preview-editor-code": code } } as TrpcContext["req"];
  return ctx;
}

const originalNodeEnv = process.env.NODE_ENV;
const originalJwtSecret = process.env.JWT_SECRET;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  process.env.JWT_SECRET = originalJwtSecret;
});

describe("blepharoplasty.leads.submit", () => {
  it("stores a valid contact in the independent blepharoplasty flow", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.leads.submit({
      nombre: "María López",
      telefono: "+34 600 123 456",
      email: "maria@example.com",
      mensaje: "Me gustaría solicitar una valoración.",
    })).resolves.toEqual({ success: true });
  });

  it("rejects a contact with an invalid phone number", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.leads.submit({
      nombre: "María López",
      telefono: "123",
    })).rejects.toThrow();
  });
});

describe("blepharoplasty.assets.upload", () => {
  it("accepts an authenticated administrator image upload for every editable position", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    for (const slot of ["hero", "specialist", "gallery-1", "gallery-2", "gallery-3"] as const) {
      await expect(caller.assets.upload({
        slot,
        filename: "mirada.jpg",
        mimeType: "image/jpeg",
        base64: "aGVsbG8=",
      })).resolves.toMatchObject({
        url: "/manus-storage/blefaroplastia/hero/123.jpg",
      });
    }
  });

  it("accepts the stable preview editor code only in development", async () => {
    process.env.NODE_ENV = "development";
    process.env.JWT_SECRET = "preview-test-secret";
    const code = createHmac("sha256", process.env.JWT_SECRET).update("blefaroplastia-preview-editor-code").digest("hex").slice(0, 12);
    const caller = appRouter.createCaller(makePreviewEditorCtx(code));
    await expect(caller.assets.upload({
      slot: "gallery-1",
      filename: "caso.jpg",
      mimeType: "image/jpeg",
      base64: "aGVsbG8=",
    })).resolves.toMatchObject({ url: "/manus-storage/blefaroplastia/hero/123.jpg" });
  });
});
