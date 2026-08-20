import { createHmac } from "node:crypto";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET no está disponible.");

const payload = Buffer.from(JSON.stringify({
  scope: "blefaroplastia-preview-editor",
  exp: Date.now() + 24 * 60 * 60 * 1000,
})).toString("base64url");
const signature = createHmac("sha256", secret).update(payload).digest("base64url");
console.log(`https://3001-i4355jkw4bk54aztc9gib-889c0b01.us2.manus.computer/admin?editor=${signature}.${payload}`);
