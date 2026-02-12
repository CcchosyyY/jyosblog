import { getPostCountByCategory } from '@/lib/posts';
import CategorySidebar from '@/components/CategorySidebar';
import QuickMemoWidget from '@/components/QuickMemoWidget';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postCounts = await getPostCountByCategory();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-10">
      <div className="flex gap-10">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="hidden lg:flex flex-col gap-6 w-[280px] shrink-0">
          <CategorySidebar postCounts={postCounts} />
          <QuickMemoWidget />
        </div>
      </div>
    </div>
  );
}
