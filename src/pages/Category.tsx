import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostsByCategory } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
import {
  dummyPoliticsPosts,
  dummyTechnologyPosts,
  dummyEntertainmentPosts,
} from "@/data/dummyContent";

const categoryInfo: Record<string, { name: string; description: string }> = {
  politics: {
    name: "Politics",
    description: "Parliament, policy, elections and the people making the decisions — reported with named sources and no access traded for softer questions.",
  },
  technology: {
    name: "Technology",
    description: "The products, startups and infrastructure decisions reshaping how people work, pay and connect — without the hype.",
  },
  entertainment: {
    name: "Entertainment",
    description: "Music, film and the culture everyone's actually talking about — covered with the same rigour as everything else on Gazettar.",
  },
};

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return "";
  }
}

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;

      try {
        setLoading(true);
        const postsData = await getPostsByCategory(slug);

        if (postsData.length > 0) {
          setPosts(postsData);
        } else {
          const dummyPosts = slug === "politics" ? dummyPoliticsPosts :
            slug === "technology" ? dummyTechnologyPosts :
              slug === "entertainment" ? dummyEntertainmentPosts : [];
          setPosts(dummyPosts as any);
        }
      } catch (error) {
        console.error("Error loading category data:", error);
        const dummyPosts = slug === "politics" ? dummyPoliticsPosts :
          slug === "technology" ? dummyTechnologyPosts :
            slug === "entertainment" ? dummyEntertainmentPosts : [];
        setPosts(dummyPosts as any);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const info = slug ? categoryInfo[slug] : null;
  const featuredPost = posts[0];
  const morePosts = posts.slice(1);

  if (!info) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] text-ink">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-3xl font-bold mb-4 text-ink">Section not found</h1>
          <p className="text-muted-ink mb-8">The section you're looking for doesn't exist.</p>
          <Link to="/" className="text-sm font-semibold hover:underline text-accent-press">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE4] text-ink">
      <Header />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <main className="p-6">
          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-accent-press"></div>
              <h1 className="text-3xl font-display font-bold text-accent-press">{info.name}</h1>
            </div>
            <p className="text-muted-ink text-sm max-w-3xl">{info.description}</p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="relative h-[450px] rounded-lg overflow-hidden mb-10 group cursor-pointer">
              <Link to={`/article/${featuredPost.slug.current}`}>
                {featuredPost.mainImage ? (
                  <img
                    src={featuredPost.mainImage}
                    alt={featuredPost.mainImageAlt || featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-accent-press text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                      Featured
                    </span>
                    <span className="text-sm opacity-90">{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg opacity-90 max-w-3xl line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* More Stories */}
          {morePosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-display font-bold mb-6">More in {info.name}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {morePosts.map((post) => (
                  <article key={post._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <Link to={`/article/${post.slug.current}`}>
                      {post.mainImage ? (
                        <img
                          src={post.mainImage}
                          alt={post.mainImageAlt || post.title}
                          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-300"></div>
                      )}
                      <div className="p-5">
                        <span className="text-xs text-accent-press font-bold uppercase tracking-wider">
                          {info.name}
                        </span>
                        <h4 className="font-display text-lg font-semibold mt-2 mb-2 group-hover:text-accent-press transition-colors leading-tight">
                          {post.title}
                        </h4>
                        <p className="text-sm text-muted-ink mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-ink">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                              {post.author?.name?.charAt(0) || "A"}
                            </div>
                            <span>{post.author?.name || "Staff"}</span>
                          </div>
                          <span>•</span>
                          <span>{post.readTime || 5} min</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Menu Icon */}
          <button className="p-2 hover:bg-gray-100 rounded">
            <div className="w-5 h-0.5 bg-ink mb-1"></div>
            <div className="w-5 h-0.5 bg-ink mb-1"></div>
            <div className="w-5 h-0.5 bg-ink"></div>
          </button>

          {/* Center: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/gazettar logo.png" alt="Gazettar" className="h-10 w-auto" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-sans text-xl font-normal text-ink">The</span>
                <span className="font-sans text-xl font-bold text-accent-press">Gazettar</span>
              </div>
              <span className="text-[7px] text-muted-ink uppercase tracking-[0.2em]">THE WORLD. YOUR WORLD.</span>
            </div>
          </Link>

          {/* Right: Search Icon */}
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-8 mt-4 text-sm">
          <Link to="/" className="hover:text-accent-press transition-colors font-medium">Home</Link>
          <Link to="/category/politics" className="hover:text-accent-press transition-colors">Politics</Link>
          <Link to="/category/technology" className="hover:text-accent-press transition-colors">Technology</Link>
          <Link to="/category/entertainment" className="hover:text-accent-press transition-colors">Entertainment</Link>
        </nav>
      </div>
    </header>
  );
}
