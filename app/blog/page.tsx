import { getAllPosts, getPublishedPostCount } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

const POSTS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const totalCount = await getPublishedPostCount();
  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const posts = await getAllPosts({
    offset,
    limit: POSTS_PER_PAGE,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">Blog</h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <p className="text-center text-muted py-12">아직 게시된 글이 없습니다.</p>
      )}

      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog"
        />
      </div>
    </div>
  );
}
