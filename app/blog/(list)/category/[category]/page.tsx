import {
  getPostsByCategory,
  getCategoryName,
  CATEGORIES,
  getAllPosts,
} from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const categoryName = getCategoryName(category);
  return {
    title: `${categoryName} - MyBlog`,
    description: `${categoryName} 카테고리의 글 목록`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const validCategory = CATEGORIES.find((c) => c.id === category);

  if (!validCategory) {
    notFound();
  }

  const posts = await getPostsByCategory(category);
  const categoryName = getCategoryName(category);
  const allPosts = await getAllPosts();

  const searchPosts = allPosts.map((post) => ({
    title: post.title,
    description: post.description,
    slug: post.slug,
    date: post.date,
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Category Header + Search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-0.5">
            {categoryName}
          </h2>
          <p className="text-subtle text-sm">
            {posts.length}개의 글
          </p>
        </div>
        <div className="w-48">
          <SearchBar posts={searchPosts} />
        </div>
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">
            이 카테고리에 작성된 글이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
