import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostsByCategory } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
import Layout from "@/components/Layout";
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

        // Use Sanity data if available, otherwise use dummy content
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
      <Layout>
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)] py-16 text-center">
          <h1 className="font-serif text-[36px] font-medium mb-4 text-ink">Section not found</h1>
          <p className="text-muted-ink mb-8">The section you're looking for doesn't exist.</p>
          <Link to="/" className="text-[14px] font-semibold hover:underline text-accent-press">
            ← Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Hero */}
      <div className="px-[clamp(20px,4vw,56px)] py-[60px]">
        <div className="text-[12.5px] text-accent-press font-semibold mb-4 uppercase tracking-wider">Section</div>
        <h1 className="font-serif text-[clamp(40px,5.6vw,66px)] font-medium leading-[1.08] tracking-[-0.01em] mb-4 text-ink">
          <span className="text-accent-press">{info.name}</span>
        </h1>
        <p className="text-[17px] text-muted-ink leading-[1.55] max-w-[56ch]">{info.description}</p>

        {/* Category Tabs */}
        <div className="flex gap-[30px] mt-[34px] pt-[22px] border-t-2 border-accent-press text-[14px] font-semibold">
          <Link
            to="/category/politics"
            className={`pb-4 border-b-2 transition-all ${slug === "politics"
              ? "border-accent-press text-accent-press"
              : "border-transparent text-muted-ink hover:text-accent-press"
              }`}
          >
            Politics
          </Link>
          <Link
            to="/category/technology"
            className={`pb-4 border-b-2 transition-all ${slug === "technology"
              ? "border-accent-press text-accent-press"
              : "border-transparent text-muted-ink hover:text-accent-press"
              }`}
          >
            Technology
          </Link>
          <Link
            to="/category/entertainment"
            className={`pb-4 border-b-2 transition-all ${slug === "entertainment"
              ? "border-accent-press text-accent-press"
              : "border-transparent text-muted-ink hover:text-accent-press"
              }`}
          >
            Entertainment
          </Link>
        </div>
      </div>

      {/* Featured Post (Lead Story) */}
      {featuredPost && (
        <section className="pb-16 border-b border-line">
          <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="text-[12.5px] text-accent-press font-semibold mb-4 uppercase tracking-wider">Lead story</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
              {/* Image */}
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

              {/* Content */}
              <div>
                <h2 className="font-serif text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.08] tracking-[-0.01em] mb-4 text-ink">
                  <Link to={`/article/${featuredPost.slug.current}`} className="hover:text-accent-press transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-[18px] text-muted-ink leading-[1.55] mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-2 text-[13px] text-muted-ink">
                  <span className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-surface font-serif text-[12px]">
                    {featuredPost.author?.name?.charAt(0) || "A"}
                  </span>
                  <span className="font-medium">{featuredPost.author?.name || "Unknown"}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime || 5} min read</span>
                  <span>·</span>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* More in Category - Grid Layout */}
      {morePosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)]">
            <h3 className="font-serif text-[22px] font-medium mb-7 pb-4 border-b-2 border-accent-press">
              More in <span className="text-accent-press">{info.name}</span>
            </h3>

            {/* Archive Grid - 3 columns */}
            <div className="grid grid-cols-3 gap-0 border-t border-l border-line">
              {morePosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/article/${post.slug.current}`}
                  className="border-r border-b border-line p-[30px_26px] flex flex-col min-h-[230px] hover:bg-accent-press/10 hover:border-accent-press transition-all"
                >
                  <div className="text-[12.5px] text-accent-press font-semibold mb-[14px] uppercase tracking-wider">
                    {info.name}
                  </div>

                  <h4 className="font-serif text-[19px] font-medium leading-tight mb-[10px] text-ink">
                    {post.title}
                  </h4>

                  <p className="text-[14px] text-muted-ink mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-[13px] text-muted-ink mt-auto">
                    <span>{post.author?.name || "Unknown"}</span>
                    <span>·</span>
                    <span>{post.readTime || 5} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
