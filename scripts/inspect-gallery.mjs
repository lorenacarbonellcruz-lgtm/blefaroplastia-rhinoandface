import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const content = await client.fetch(`*[_id == "blefaroplastiaLanding"][0]{_id, cases}`);
console.log(JSON.stringify(content, null, 2));
