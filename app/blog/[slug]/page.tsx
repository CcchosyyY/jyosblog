import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { getCategoryName } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
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
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Left: Share Buttons */}
      <aside className="hidden xl:block fixed left-[max(2rem,calc(50%-38rem))] top-40">
        <ShareButtons title={post.title} slug={post.slug} />
      </aside>

      {/* Right: Table of Contents */}
      <TableOfContents />

      {/* Center: Article */}
      <article className="max-w-2xl mx-auto xl:mx-0 xl:ml-40 xl:mr-72">
      <div className="flex flex-col gap-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body font-medium text-subtle hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>

        {/* Title Section */}
        <header className="flex flex-col gap-4">
          <h1 className="text-heading-xl sm:text-4xl font-bold text-foreground">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-2.5 py-0.5 text-caption font-medium bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5 text-caption text-muted">
            <time>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              {new Date(post.date).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </time>
            <span>&middot;</span>
            <ViewCounter postId={post.id} />
            <span>&middot;</span>
            <LikeButton postId={post.id} />
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-card-border" />

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Divider */}
        <div className="h-px bg-card-border" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 id="related-posts" data-toc className="text-heading-sm text-foreground">
              Related Posts
            </h2>
            <div className="divide-y divide-card-border">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="flex items-center justify-between py-3 group hover:bg-surface/60 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {related.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-caption text-muted">
                        {getCategoryName(related.category)}
                      </span>
                      <span className="text-caption text-muted">
                        {related.readingTime}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-muted group-hover:text-primary transition-colors shrink-0 ml-3"
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
    </div>
  );
}
