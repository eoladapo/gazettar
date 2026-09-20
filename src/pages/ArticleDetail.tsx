import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getRelatedPosts } from "@/lib/sanity/api";
import type { Post } from "@/types/sanity";
import { format } from "date-fns";
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
      <div className="min-h-screen bg-[#F5EDE4] text-ink">
        <Header />
        <main className="px-6 py-16 max-w-4xl mx-auto">
          <div className="space-y-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-14 w-full bg-gray-200 rounded" />
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] text-ink">
        <Header />
        <main className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-ink mb-4">
            {error || "Article not found"}
          </h1>
          <p className="text-lg text-muted-ink mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="text-sm font-semibold hover:underline text-accent-press">
            ← Back to Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE4] text-ink">
      <Header />

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-6 py-10">
        {/* Category Badge */}
        <div className="mb-4">
          <Link
            to={`/category/${post.category?.slug?.current || 'politics'}`}
            className="inline-block bg-accent-press text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded hover:bg-accent-press/90 transition-colors"
          >
            {post.category?.title || "Politics"}
          </Link>
        </div>

        {/* Article Title */}
        <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6 text-ink">
          {post.title}
        </h1>

        {/* Article Excerpt */}
        <p className="text-xl text-muted-ink leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Author & Meta Info */}
        <div className="flex items-center gap-4 pb-6 mb-8 border-b-2 border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-press flex items-center justify-center text-white font-bold text-lg">
              {post.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-semibold text-ink">{post.author?.name || "Unknown"}</p>
              <div className="flex items-center gap-2 text-sm text-muted-ink">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime || 9} min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="mb-10 rounded-lg overflow-hidden">
            <img
              src={post.mainImage}
              alt={post.mainImageAlt || post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.body ? (
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="font-display text-3xl font-bold mt-10 mb-4 text-ink">
                      {children}
                    </h2>
                  ),
                  normal: ({ children }) => (
                    <p className="text-lg leading-relaxed mb-6 text-ink">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent-press pl-6 my-8 italic text-xl text-ink">
                      {children}
                    </blockquote>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-bold text-ink">{children}</strong>
                  ),
                },
              }}
            />
          ) : (
            <p className="text-lg leading-relaxed text-ink">
              {post.excerpt || "Content coming soon..."}
            </p>
          )}
        </div>

        {/* Author Bio */}
        {post.author?.bio && (
          <div className="bg-white rounded-lg p-6 mb-10 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-press flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {post.author.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-bold text-lg mb-2">About {post.author.name}</p>
                <p className="text-sm text-muted-ink leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <h3 className="text-2xl font-display font-bold mb-6">Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related._id}
                  to={`/article/${related.slug.current}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {related.mainImage && (
                    <img
                      src={related.mainImage}
                      alt={related.mainImageAlt || related.title}
                      className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <div className="p-5">
                    <span className="text-xs text-accent-press font-bold uppercase tracking-wider">
                      {post.category?.title || "Politics"}
                    </span>
                    <h4 className="font-display text-lg font-semibold mt-2 mb-2 group-hover:text-accent-press transition-colors leading-tight">
                      {related.title}
                    </h4>
                    <p className="text-sm text-muted-ink line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
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
