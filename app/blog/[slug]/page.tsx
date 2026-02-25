import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { getCategoryName } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import TableOfContents from '@/components/TableOfContents';
import LikeButton from '@/components/LikeButton';
import ViewCounter from '@/components/ViewCounter';
import CommentSection from '@/components/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} - MyBlog`,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.category,
    post.tags
  );

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TableOfContents />

      <div className="flex flex-col gap-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>

        {/* Title Section */}
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <time className="text-xs text-muted">{post.date}</time>
            {post.tags.length > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-secondary/20 text-secondary rounded">
                {post.tags[0]}
              </span>
            )}
            <ViewCounter postId={post.id} />
            <LikeButton postId={post.id} />
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-card-border" />

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>

        {/* Divider */}
        <div className="h-px bg-card-border" />

        {/* Post Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-2.5 py-1 text-xs font-medium bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">
              Related Posts
            </h2>
            <div className="grid gap-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-card-border bg-card hover:bg-surface transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {related.title}
                    </h3>
                    {related.description && (
                      <p className="mt-1 text-xs text-muted line-clamp-1">
                        {related.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-muted">
                        {getCategoryName(related.category)}
                      </span>
                      <span className="text-[11px] text-muted">
                        {related.readingTime}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  );
}
