import { sanityClient } from "./config";
import type { Post, Category, Author } from "@/types/sanity";

// Helper function to fetch data with error handling
async function fetchData<T>(query: string, params: Record<string, any> = {}): Promise<T> {
  try {
    const data = await sanityClient.fetch<T>(query, params);
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    throw error;
  }
}

// Fetch featured post for hero section
export async function getFeaturedPost(): Promise<Post | null> {
  const query = `
    *[_type == "post" && featured == true && defined(category) && defined(author)] | order(publishedAt desc)[0] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post | null>(query);
}

// Fetch latest posts for sidebar
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  const query = `
    *[_type == "post" && defined(category) && defined(author)] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query);
}

// Fetch trending posts
export async function getTrendingPosts(limit: number = 4): Promise<Post[]> {
  const query = `
    *[_type == "post" && trending == true && defined(category) && defined(author)] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query);
}

// Fetch recent posts for grid section
export async function getRecentPosts(limit: number = 9): Promise<Post[]> {
  const query = `
    *[_type == "post" && defined(category) && defined(author)] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query);
}

// Fetch single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    *[_type == "post" && slug.current == $slug && defined(category) && defined(author)][0] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{
        name,
        slug,
        bio,
        "image": image.asset->url
      },
      publishedAt,
      readTime,
      body,
      "seoTitle": seo.metaTitle,
      "seoDescription": seo.metaDescription
    }
  `;
  return fetchData<Post | null>(query, { slug });
}

// Fetch posts by category
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const query = `
    *[_type == "post" && category->slug.current == $slug && defined(category) && defined(author)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query, { slug: categorySlug });
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const query = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      color,
      description,
      "postCount": count(*[_type == "post" && references(^._id)])
    }
  `;
  return fetchData<Category[]>(query);
}

// Fetch related posts (same category, excluding current post)
export async function getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3): Promise<Post[]> {
  const query = `
    *[_type == "post" && category._ref == $categoryId && _id != $currentPostId && defined(category) && defined(author)] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query, { categoryId, currentPostId });
}

// Fetch all posts with pagination
export async function getAllPosts(start: number = 0, end: number = 10): Promise<Post[]> {
  const query = `
    *[_type == "post" && defined(category) && defined(author)] | order(publishedAt desc) [${start}...${end}] {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      "category": category->{_id, title, slug, color},
      "author": author->{name, slug},
      publishedAt,
      readTime
    }
  `;
  return fetchData<Post[]>(query);
}

// Get total post count
export async function getTotalPostCount(): Promise<number> {
  const query = `count(*[_type == "post"])`;
  return fetchData<number>(query);
}
