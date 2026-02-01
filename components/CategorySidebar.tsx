'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';

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
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          카테고리
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isAllActive()
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>전체</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
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
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {postCounts[category.id] || 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
