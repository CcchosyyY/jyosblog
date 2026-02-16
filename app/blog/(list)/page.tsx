import { getAllPosts, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export const metadata = {
  title: '블로그 - MyBlog',
  description: '모든 블로그 글 목록',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const searchPosts = posts.map((post) => ({
    title: post.title,
    description: post.description,
    slug: post.slug,
    date: post.date,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <SearchBar posts={searchPosts} />

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">
            아직 작성된 글이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
