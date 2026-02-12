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
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          전체 글
        </h1>
        <p className="text-subtle mb-6 text-sm">
          총 {posts.length}개의 글이 있습니다.
        </p>
        <SearchBar posts={searchPosts} />
      </header>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 ? (
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
