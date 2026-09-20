import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentPosts, getFeaturedPost } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
import Layout from "@/components/Layout";
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
    <Layout>
      {/* Hero Section - matching HTML */}
      <section className="px-[clamp(20px,4vw,56px)] pt-14 pb-35 transition-colors duration-200" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '56px', alignItems: 'end' }}>
        <div>
          <div className="text-[13px] text-accent-press font-semibold mb-[10px] uppercase tracking-wider">Politics, Technology & Entertainment</div>

          <h1 className="font-serif text-[clamp(40px,5.4vw,72px)] font-medium leading-[1.08] tracking-[-0.01em] mb-[18px] text-ink">
            The stories shaping <span className="text-accent-press">power</span>, <span className="text-accent-press">technology</span> and <span className="text-accent-press">culture</span> — as they happen.
          </h1>

          <p className="text-[17px] text-muted-ink leading-[1.55] max-w-[46ch]">
            Gazettar covers the decisions made in parliament, the products reshaping how we live, and the culture everyone's actually talking about — reported straight, without the noise.
          </p>
        </div>

        <div className="border-l-2 border-accent-press pl-7 text-[14px] text-muted-ink bg-ink text-surface p-6">
          <div className="mb-[22px]">
            <span className="font-serif text-[34px] text-accent-press block mb-1">
              {recentPosts.length > 0 ? recentPosts.length * 12 : 412}
            </span>
            stories published this year
          </div>
          <div>
            <span className="font-serif text-[34px] text-accent-press block mb-1">26k</span>
            readers in the daily brief
          </div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="pt-0 pb-16 border-b border-line transition-colors duration-200">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)]">
          {featuredPost && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              <Link to={`/article/${featuredPost.slug.current}`}>
                {featuredPost.mainImage ? (
                  <img
                    src={featuredPost.mainImage}
                    alt={featuredPost.mainImageAlt || featuredPost.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-ink to-ink/90">
                    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
                      <circle cx="320" cy="40" r="140" fill="currentColor" className="text-ink/50" opacity="0.6" />
                      <rect x="-20" y="180" width="440" height="160" fill="currentColor" className="text-accent-press" opacity="0.18" />
                      <line x1="0" y1="0" x2="400" y2="300" stroke="currentColor" className="text-surface" strokeOpacity="0.08" strokeWidth="1" />
                      <line x1="400" y1="0" x2="0" y2="300" stroke="currentColor" className="text-surface" strokeOpacity="0.08" strokeWidth="1" />
                    </svg>
                  </div>
                )}
              </Link>

              <div>
                <div className="text-[13px] text-accent-press font-semibold mb-4 uppercase tracking-wider">Featured — Politics</div>

                <h2 className="font-serif text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.08] tracking-[-0.01em] mb-4 text-ink">
                  <Link to={`/article/${featuredPost.slug.current}`} className="hover:text-accent-press transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-[17px] text-muted-ink leading-[1.55] mb-5">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-[10px] text-[13px] text-muted-ink">
                  <span className="w-[34px] h-[34px] rounded-full bg-ink flex items-center justify-center text-surface font-serif text-[14px]">
                    {featuredPost.author?.name?.charAt(0) || "A"}
                  </span>
                  <span>{featuredPost.author?.name || "Unknown"}</span>
                  <span className="w-[3px] h-[3px] rounded-full bg-muted-ink"></span>
                  <span>{featuredPost.readTime || 9} min read</span>
                  <span className="w-[3px] h-[3px] rounded-full bg-muted-ink"></span>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Container for sections */}
      <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)]">
        {/* Politics Section */}
        {finalPoliticsPosts.length > 0 && (
          <section className="py-16 border-b border-line transition-colors duration-200">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] font-medium text-ink">
                <span className="text-accent-press">Politics</span>
              </h2>
              <Link to="/category/politics" className="text-[13.5px] font-semibold text-ink border-b-2 border-transparent pb-[2px] hover:text-accent-press hover:border-accent-press transition-all">
                See all Politics →
              </Link>
            </div>

            <div className="space-y-6">
              {finalPoliticsPosts.map((post, index) => (
                <Link to={`/article/${post.slug.current}`} key={post._id} className="grid grid-cols-[100px_1fr_auto] gap-7 py-[26px] border-t border-line items-start hover:opacity-80 transition-opacity">
                  <span className="font-serif italic text-[14px] text-muted-ink pt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-[23px] font-medium leading-tight mb-2 text-ink">{post.title}</h3>
                    <p className="text-[14.5px] text-muted-ink leading-relaxed max-w-[60ch]">{post.excerpt}</p>
                  </div>
                  <span className="text-[12.5px] text-accent-press font-semibold whitespace-nowrap pt-[6px] uppercase tracking-wider">Politics</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Technology Section */}
        {finalTechnologyPosts.length > 0 && (
          <section className="py-16 border-b border-line transition-colors duration-200">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] font-medium text-ink">
                <span className="text-accent-press">Technology</span>
              </h2>
              <Link to="/category/technology" className="text-[13.5px] font-semibold text-ink border-b-2 border-transparent pb-[2px] hover:text-accent-press hover:border-accent-press transition-all">
                See all Technology →
              </Link>
            </div>

            <div className="space-y-6">
              {finalTechnologyPosts.map((post, index) => (
                <Link to={`/article/${post.slug.current}`} key={post._id} className="grid grid-cols-[100px_1fr_auto] gap-7 py-[26px] border-t border-line items-start hover:opacity-80 transition-opacity">
                  <span className="font-serif italic text-[14px] text-muted-ink pt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-[23px] font-medium leading-tight mb-2 text-ink">{post.title}</h3>
                    <p className="text-[14.5px] text-muted-ink leading-relaxed max-w-[60ch]">{post.excerpt}</p>
                  </div>
                  <span className="text-[12.5px] text-accent-press font-semibold whitespace-nowrap pt-[6px] uppercase tracking-wider">Technology</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Entertainment Section */}
        {finalEntertainmentPosts.length > 0 && (
          <section className="py-16 border-b border-line transition-colors duration-200">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] font-medium text-ink">
                <span className="text-accent-press">Entertainment</span>
              </h2>
              <Link to="/category/entertainment" className="text-[13.5px] font-semibold text-ink border-b-2 border-transparent pb-[2px] hover:text-accent-press hover:border-accent-press transition-all">
                See all Entertainment →
              </Link>
            </div>

            <div className="space-y-6">
              {finalEntertainmentPosts.map((post, index) => (
                <Link to={`/article/${post.slug.current}`} key={post._id} className="grid grid-cols-[100px_1fr_auto] gap-7 py-[26px] border-t border-line items-start hover:opacity-80 transition-opacity">
                  <span className="font-serif italic text-[14px] text-muted-ink pt-1">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-[23px] font-medium leading-tight mb-2 text-ink">{post.title}</h3>
                    <p className="text-[14.5px] text-muted-ink leading-relaxed max-w-[60ch]">{post.excerpt}</p>
                  </div>
                  <span className="text-[12.5px] text-accent-press font-semibold whitespace-nowrap pt-[6px] uppercase tracking-wider">Entertainment</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16">
          <div className="bg-ink text-surface px-[clamp(24px,5vw,64px)] py-12 grid grid-cols-[1.2fr_1fr] gap-8 items-center transition-colors duration-200 border-4 border-accent-press">
            <div>
              <h2 className="font-serif text-[clamp(24px,3vw,34px)] font-medium text-surface mb-[10px]">
                One brief every morning. <span className="text-accent-press">No noise.</span>
              </h2>
              <p className="text-[14.5px] text-surface/80">Join 26,000 readers who start their day with Gazettar's politics, tech and entertainment brief.</p>
            </div>
            <form className="flex border-b-2 border-accent-press">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 bg-transparent border-none text-surface text-[15px] py-3 px-1 placeholder:text-surface/60 focus:outline-none"
              />
              <button type="submit" className="bg-accent-press border-none text-ink font-bold text-[14px] py-3 px-6 cursor-pointer hover:opacity-90 transition-opacity uppercase tracking-wider">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
}
