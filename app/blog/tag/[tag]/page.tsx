import { getPostsByTag, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} - MyBlog`,
    description: `${decodedTag} 태그가 있는 글 목록`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);
  const allTags = await getAllTags();

  if (posts.length === 0 && !allTags.includes(decodedTag)) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-foreground transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          전체 글 보기
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          #{decodedTag}
        </h1>
        <p className="text-subtle text-sm">
          {posts.length}개의 글
        </p>
      </header>

      {/* Other Tags */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog/tag/${t}`}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                t === decodedTag
                  ? 'bg-secondary text-white'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="grid gap-5">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            slug={post.slug}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  );
}
