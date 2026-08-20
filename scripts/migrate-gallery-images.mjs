import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const documentId = "blefaroplastiaLanding";
const current = await client.fetch(`*[_id == $id][0]{cases}`, { id: documentId });
const items = Array.isArray(current?.cases?.items) ? current.cases.items : [];
const migrated = items.map((item, index) => ({
  label: item.label || `Imagen ${index + 1}`,
  imageUrl: item.imageUrl || item.beforeUrl || item.afterUrl || "",
  imageAlt: item.imageAlt || item.label || `Imagen ${index + 1}`,
}));

await client.patch(documentId).set({
  cases: { ...(current?.cases ?? {}), items: migrated },
}).commit();

console.log(`Galería migrada: ${migrated.length} imágenes individuales.`);
