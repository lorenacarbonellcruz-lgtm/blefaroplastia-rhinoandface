import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const source = await client.fetch(`*[_id == "blepharoplastyPage"][0]`);
  if (!source) throw new Error("No se encontró el contenido inicial de blefaroplastia.");

  const { _id, _rev, _createdAt, _updatedAt, ...content } = source;
  await client.createIfNotExists({
    ...content,
    _id: "blefaroplastiaLanding",
    _type: "blepharoplastyPage",
  });

  console.log("CMS exclusivo de blefaroplastia inicializado.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
