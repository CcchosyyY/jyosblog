'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import QuickMemoWidget from './QuickMemoWidget';

interface CategorySidebarProps {
  postCounts: Record<string, number>;
}

export default function CategorySidebar({ postCounts }: CategorySidebarProps) {
  const pathname = usePathname();

  const isActive = (categoryId: string) => {
    return pathname === `/blog/category/${categoryId}`;
  };

  const isAllActive = () => {
    return pathname === '/blog';
  };

  return (
    <aside className="w-full md:w-48 shrink-0">
      <nav className="sticky top-24">
        <h3 className="text-sm font-semibold text-light/50 uppercase tracking-wider mb-4">
          카테고리
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isAllActive()
                  ? 'bg-teal/20 text-teal font-medium'
                  : 'text-light/70 hover:bg-light/5 hover:text-light'
              }`}
            >
              <span>전체</span>
              <span className="text-sm text-light/50">
                {Object.values(postCounts).reduce((a, b) => a + b, 0)}
              </span>
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog/category/${category.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive(category.id)
                    ? 'bg-teal/20 text-teal font-medium'
                    : 'text-light/70 hover:bg-light/5 hover:text-light'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-light/50">
                  {postCounts[category.id] || 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Memo Widget */}
        <div className="mt-8 pt-6 border-t border-light/10">
          <QuickMemoWidget />
        </div>
      </nav>
    </aside>
  );
}
