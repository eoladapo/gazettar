import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getRelatedPosts } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { dummyArticleContent } from "@/data/dummyArticles";

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return "";
  }
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function loadPost() {
      try {
        setLoading(true);
        setError(null);

        const postData = await getPostBySlug(slug);

        if (!postData) {
          const dummyPost = dummyArticleContent[slug];
          if (dummyPost) {
            setPost({
              _id: `dummy-${slug}`,
              slug: { current: slug },
              ...dummyPost,
            } as any);

            if (dummyPost.relatedPosts) {
              setRelatedPosts(dummyPost.relatedPosts.map((rp: any, idx: number) => ({
                _id: `related-${idx}`,
                author: { name: "Staff Writer", _id: `author-${idx}` },
                readTime: 5,
                publishedAt: "2026-09-10",
                ...rp,
              })) as any);
            }
            return;
          }

          setError("Article not found");
          return;
        }

        setPost(postData);

        if (postData.category?._id) {
          try {
            const related = await getRelatedPosts(postData.category._id, postData._id, 2);
            setRelatedPosts(related);
          } catch (relatedError) {
            console.error("Error loading related posts:", relatedError);
          }
        }
      } catch (err) {
        console.error("Error loading post:", err);

        const dummyPost = dummyArticleContent[slug];
        if (dummyPost) {
          setPost({
            _id: `dummy-${slug}`,
            slug: { current: slug },
            ...dummyPost,
          } as any);
        } else {
          setError("Failed to load article");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <main className="px-[clamp(20px,4vw,56px)] py-16">
          <div className="space-y-6 animate-pulse max-w-[680px] mx-auto">
            <div className="h-6 w-32 bg-gray-200" />
            <div className="h-14 w-full bg-gray-200" />
            <div className="h-5 w-3/4 bg-gray-200" />
          </div>
        </main>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <main className="px-[clamp(20px,4vw,56px)] py-16 text-center">
          <h1 className="font-serif text-[34px] font-medium text-ink mb-4">
            {error || "Article not found"}
          </h1>
          <p className="text-[18px] text-muted-ink mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="text-[14px] font-semibold hover:underline text-accent-press">
            ← Back to Home
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Post Header */}
      <header className="px-[clamp(20px,4vw,56px)] py-14 pb-0">
        <div className="text-[14px] text-accent-press font-semibold mb-4 uppercase tracking-wider">
          {post.category?.title || "Politics"}
        </div>

        <h1 className="font-serif text-[clamp(34px,4.6vw,54px)] font-medium leading-[1.08] tracking-[-0.01em] max-w-[20ch] mb-[18px] text-ink">
          {post.title}
        </h1>

        <p className="text-[18px] text-muted-ink leading-[1.55] max-w-[56ch] mb-[26px]">
          {post.excerpt}
        </p>

        {/* Meta bar */}
        <div className="flex items-center gap-6 py-[26px] border-t-2 border-b-2 border-accent-press text-[13.5px] text-muted-ink">
          <span className="w-[34px] h-[34px] rounded-full bg-accent-press flex items-center justify-center text-surface font-serif text-[14px] mr-[10px] font-bold">
            {post.author?.name?.charAt(0) || "A"}
          </span>
          <span className="font-semibold text-ink">{post.author?.name || "Unknown"}</span>
          <span>·</span>
          <span className="text-accent-press font-semibold">{post.category?.title || "Politics"} Desk</span>
          <span className="ml-auto">{post.readTime || 9} min read · {formatDate(post.publishedAt)}</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-[1180px] mx-auto px-[clamp(20px,4vw,56px)] mt-10">
        {post.mainImage ? (
          <img
            src={post.mainImage}
            alt={post.mainImageAlt || post.title}
            className="w-full aspect-[16/8] object-cover"
          />
        ) : (
          <div className="w-full aspect-[16/8] relative overflow-hidden bg-gradient-to-br from-ink to-ink/90">
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
              <circle cx="320" cy="40" r="140" fill="currentColor" className="text-ink/50" opacity="0.6" />
              <rect x="-20" y="180" width="440" height="160" fill="currentColor" className="text-accent-press" opacity="0.18" />
              <line x1="0" y1="0" x2="400" y2="300" stroke="currentColor" className="text-surface" strokeOpacity="0.08" strokeWidth="1" />
              <line x1="400" y1="0" x2="0" y2="300" stroke="currentColor" className="text-surface" strokeOpacity="0.08" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Article Body */}
      <article className="max-w-[680px] mx-auto px-[clamp(20px,4vw,56px)] py-12 text-[18px] leading-[1.75]">
        {post.body && (
          <div>
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="font-serif text-[28px] font-medium leading-tight mt-[1.6em] mb-[0.6em]">
                      {children}
                    </h2>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-[1.4em] first-of-type:first-letter:font-serif first-of-type:first-letter:font-semibold first-of-type:first-letter:text-[68px] first-of-type:first-letter:leading-[0.78] first-of-type:first-letter:float-left first-of-type:first-letter:pr-[10px] first-of-type:first-letter:pt-1">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-accent-press my-8 pl-6 font-serif italic text-[22px] text-ink">
                      {children}
                    </blockquote>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                },
              }}
            />
          </div>
        )}
      </article>

      {/* Author Bio */}
      {post.author?.bio && (
        <div className="max-w-[680px] mx-auto px-[clamp(20px,4vw,56px)] mb-16">
          <div className="flex items-center gap-4 p-6 border-t border-line">
            <span className="w-12 h-12 rounded-full bg-ink flex items-center justify-center text-surface font-serif text-[16px] shrink-0">
              {post.author.name?.charAt(0) || "A"}
            </span>
            <p className="text-[14px] text-muted-ink leading-relaxed">
              Written by {post.author.name} — {post.author.bio}
            </p>
          </div>
        </div>
      )}

      {/* Read Next Section - Simple list layout */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-line py-16 mb-16">
          <div className="max-w-[680px] mx-auto px-[clamp(20px,4vw,56px)]">
            <h3 className="font-serif text-[22px] font-medium mb-7 text-ink border-b-2 border-accent-press pb-3">
              Read <span className="text-accent-press">next</span>
            </h3>

            <div className="space-y-0">
              {relatedPosts.map((related, index) => (
                <Link
                  key={related._id}
                  to={`/article/${related.slug.current}`}
                  className="flex gap-7 py-6 border-t border-line items-start hover:opacity-80 transition-opacity group"
                >
                  <span className="font-serif italic text-[14px] text-muted-ink pt-1 w-12">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-serif text-[23px] font-medium leading-tight mb-2 text-ink group-hover:text-accent-press">
                      {related.title}
                    </h4>
                    <p className="text-[14.5px] text-muted-ink leading-relaxed">
                      {related.excerpt}
                    </p>
                  </div>
                  <span className="text-[12.5px] text-accent-press font-semibold whitespace-nowrap pt-[6px] uppercase tracking-wider">
                    {post.category?.title || "Politics"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
