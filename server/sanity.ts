import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Fetch content from the document owned exclusively by this landing.
export async function getBlepharoplastyContent() {
  return sanityClient.fetch(`*[_id == "blefaroplastiaLanding"][0]`);
}

// Create or update this landing's own CMS document.
export async function upsertBlepharoplastyContent(content: Record<string, unknown>) {
  return sanityClient.createOrReplace({
    _type: "blepharoplastyPage",
    _id: "blefaroplastiaLanding",
    ...content,
  });
}
