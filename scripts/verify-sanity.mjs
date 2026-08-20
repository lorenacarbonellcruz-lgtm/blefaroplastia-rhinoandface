import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const data = await client.fetch(`*[_type == "landingPage"][0]`);
console.log("✓ Sanity data keys:", Object.keys(data || {}));
console.log("✓ Hero title:", data?.hero?.title);
console.log("✓ TrustBar items:", data?.trustBar?.length);
console.log("✓ Process steps:", data?.process?.steps?.length);
console.log("✓ Testimonials:", data?.testimonials?.items?.length);
