import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import TableOfContents from '@/components/TableOfContents';

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
      </div>
    </article>
  );
}
