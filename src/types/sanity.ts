import type { PortableTextBlock } from "@portabletext/react";

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  color: string;
  description?: string;
  postCount?: number;
}

export interface Author {
  _id?: string;
  name: string;
  slug: {
    current: string;
  };
  bio?: string;
  image?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage?: string;
  mainImageAlt?: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  trending?: boolean;
  body?: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface SimplifiedPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  category?: Category;
  publishedAt: string;
}
