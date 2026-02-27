import { getPostsByTag, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import { Tag } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      {/* Tag Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-0.5">
          #{decodedTag}
        </h2>
        <p className="text-subtle text-sm">
          {posts.length}개의 글
        </p>
      </div>

      {/* Other Tags */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((t) => (
          <Link
            key={t}
            href={`/blog/tag/${t}`}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              t === decodedTag
                ? 'bg-secondary text-white'
                : 'bg-secondary/20 text-secondary hover:bg-secondary/30'
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              tags={post.tags}
              category={post.category}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Tag size={48} />}
          title="태그에 해당하는 글이 없습니다"
          description={`#${decodedTag} 태그가 달린 글이 아직 없습니다.`}
          action={{ label: '전체 글 보기', href: '/' }}
        />
      )}
    </div>
  );
}
