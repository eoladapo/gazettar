import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentPosts, getFeaturedPost } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
import {
  dummyPoliticsPosts,
  dummyTechnologyPosts,
  dummyEntertainmentPosts,
  getDummyFeaturedPost,
} from "@/data/dummyContent";

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return "";
  }
}

export default function Home() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featured, recent] = await Promise.all([
          getFeaturedPost(),
          getRecentPosts(12),
        ]);

        setFeaturedPost(featured || getDummyFeaturedPost());
        setRecentPosts(recent.length > 0 ? recent : [
          ...dummyPoliticsPosts,
          ...dummyTechnologyPosts,
          ...dummyEntertainmentPosts,
        ]);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        setFeaturedPost(getDummyFeaturedPost());
        setRecentPosts([
          ...dummyPoliticsPosts,
          ...dummyTechnologyPosts,
          ...dummyEntertainmentPosts,
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const politicsPosts = recentPosts.filter((p) => p.category?.slug?.current === "politics").slice(0, 3);
  const technologyPosts = recentPosts.filter((p) => p.category?.slug?.current === "technology").slice(0, 3);
  const entertainmentPosts = recentPosts.filter((p) => p.category?.slug?.current === "entertainment").slice(0, 3);

  const finalPoliticsPosts = politicsPosts.length > 0 ? politicsPosts : dummyPoliticsPosts.slice(0, 3);
  const finalTechnologyPosts = technologyPosts.length > 0 ? technologyPosts : dummyTechnologyPosts.slice(0, 3);
  const finalEntertainmentPosts = entertainmentPosts.length > 0 ? entertainmentPosts : dummyEntertainmentPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5EDE4] text-ink">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className=" mx-auto px-4 py-4">
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <main className="p-6">
          {/* Hero Story */}
          {featuredPost && (
            <div className="relative h-[500px] rounded-lg overflow-hidden mb-8 group cursor-pointer">
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
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">
                    {featuredPost.title}
                  </h1>
                  <p className="text-lg opacity-90 max-w-3xl">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Politics Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-accent-press"></div>
              <h2 className="text-2xl font-display font-bold">Politics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finalPoliticsPosts.slice(0, 2).map((post) => (
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
                        Politics
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-accent-press transition-colors leading-tight">
                        {post.title}
                      </h3>
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
          </section>

          {/* Technology Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-accent-press"></div>
              <h2 className="text-2xl font-display font-bold">Technology</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finalTechnologyPosts.slice(0, 2).map((post) => (
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
                        Technology
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-accent-press transition-colors leading-tight">
                        {post.title}
                      </h3>
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
          </section>

          {/* Entertainment Section */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-accent-press"></div>
              <h2 className="text-2xl font-display font-bold">Entertainment</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finalEntertainmentPosts.slice(0, 2).map((post) => (
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
                        Entertainment
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-accent-press transition-colors leading-tight">
                        {post.title}
                      </h3>
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
          </section>

          {/* Story From Editor's Desk */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-accent-press"></div>
              <h2 className="text-2xl font-display font-bold">Story From Editor's Desk</h2>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[...finalPoliticsPosts, ...finalTechnologyPosts].slice(0, 4).map((post) => (
                <Link
                  key={post._id}
                  to={`/article/${post.slug.current}`}
                  className="group"
                >
                  {post.mainImage ? (
                    <img
                      src={post.mainImage}
                      alt={post.mainImageAlt || post.title}
                      className="w-full h-32 object-cover rounded mb-2 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
                  )}
                  <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-accent-press transition-colors">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter Subscription */}
          <section className="bg-white rounded-lg p-6 border border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-muted-ink">Get the latest news delivered to your inbox</p>
              </div>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-press"
                />
                <button
                  type="submit"
                  className="bg-accent-press text-white px-6 py-2 rounded font-semibold hover:bg-accent-press/90 transition-colors"
                >
                  →
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
