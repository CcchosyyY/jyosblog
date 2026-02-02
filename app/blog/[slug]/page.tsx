import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

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
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-teal hover:text-rose transition-colors mb-8"
      >
        &larr; 블로그로 돌아가기
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-light mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-light/50">
          <time>{post.date}</time>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-2 py-1 text-xs bg-rose/20 text-rose rounded hover:bg-rose/30 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-invert prose-teal max-w-none">
        <MDXRemote source={post.content} />
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-light/10">
        <Link
          href="/blog"
          className="inline-flex items-center text-teal hover:text-rose transition-colors"
        >
          &larr; 다른 글 보기
        </Link>
      </footer>
    </article>
  );
}
