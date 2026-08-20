import { createHmac } from "node:crypto";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no está disponible.");
console.log(createHmac("sha256", process.env.JWT_SECRET).update("blefaroplastia-preview-editor-code").digest("hex").slice(0, 12));
