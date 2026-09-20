import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity project configuration
// In Vite, environment variables are accessed via import.meta.env
export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Disable CDN - use direct API for better reliability in development
  token: import.meta.env.VITE_SANITY_TOKEN, // Optional token for authentication
  perspective: 'published', // Only fetch published documents
};

// Create the Sanity client
export const sanityClient = createClient(sanityConfig);

// Helper function to build image URLs
const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: any) {
  return builder.image(source);
}
