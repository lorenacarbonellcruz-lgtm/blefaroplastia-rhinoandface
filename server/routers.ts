import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "node:crypto";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getBlepharoplastyContent, sanityClient } from "./sanity";
import { insertBlepharoplastyLead } from "./db";
import { storagePut } from "./storage";

const contentCache: {
  data: Awaited<ReturnType<typeof getBlepharoplastyContent>> | null;
  ts: number;
} = { data: null, ts: 0 };

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso restringido a administradores." });
  }
  return next({ ctx });
});

function hasValidPreviewEditorCode(headers: Record<string, string | string[] | undefined>) {
  if (process.env.NODE_ENV !== "development" || !process.env.JWT_SECRET) return false;
  const rawCode = headers["x-preview-editor-code"];
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
  const expected = createHmac("sha256", process.env.JWT_SECRET).update("blefaroplastia-preview-editor-code").digest("hex").slice(0, 12);
  return Boolean(code && code.length === expected.length && timingSafeEqual(Buffer.from(code), Buffer.from(expected)));
}

const previewEditorProcedure = publicProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role === "admin" || hasValidPreviewEditorCode(ctx.req.headers)) return next({ ctx });
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Acceso de edición requerido." });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  content: router({
    getBlepharoplasty: publicProcedure.query(async () => {
      const now = Date.now();
      const TTL_MS = 5 * 60 * 1000;
      if (contentCache.data && now - contentCache.ts < TTL_MS) return contentCache.data;

      const data = await getBlepharoplastyContent();
      if (data) {
        contentCache.data = data;
        contentCache.ts = now;
      }
      return data ?? null;
    }),

    updateBlepharoplasty: previewEditorProcedure
      .input(z.object({ patch: z.record(z.string(), z.unknown()) }))
      .mutation(async ({ input }) => {
        contentCache.data = null;
        contentCache.ts = 0;
        await sanityClient.patch("blefaroplastiaLanding").set(input.patch).commit();
        return { success: true };
      }),
  }),

  assets: router({
    upload: previewEditorProcedure
      .input(z.object({
        slot: z.enum(["hero", "specialist", "gallery-1", "gallery-2", "gallery-3"]),
        filename: z.string().min(1),
        mimeType: z.string().regex(/^image\//),
        base64: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const extension = input.filename.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
        const key = `blefaroplastia/${input.slot}/${Date.now()}.${extension}`;
        const buffer = Buffer.from(input.base64, "base64");
        return storagePut(key, buffer, input.mimeType);
      }),
  }),

  leads: router({
    submit: publicProcedure
      .input(z.object({
        nombre: z.string().min(2),
        telefono: z.string().min(6),
        email: z.string().email().optional().or(z.literal("")),
        mensaje: z.string().max(3000).optional(),
      }))
      .mutation(async ({ input }) => {
        await insertBlepharoplastyLead({
          nombre: input.nombre,
          telefono: input.telefono,
          email: input.email || undefined,
          mensaje: input.mensaje || undefined,
        });

        await notifyOwner({
          title: `Nuevo lead de blefaroplastia: ${input.nombre}`,
          content: `Teléfono: ${input.telefono}\nEmail: ${input.email || "—"}\nMensaje: ${input.mensaje || "—"}`,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
