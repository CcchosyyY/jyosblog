import { getPostCountByCategory } from '@/lib/posts';
import BlogSidebar from '@/components/BlogSidebar';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postCounts = await getPostCountByCategory();

  return (
    <div className="flex">
      <BlogSidebar postCounts={postCounts} />
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
