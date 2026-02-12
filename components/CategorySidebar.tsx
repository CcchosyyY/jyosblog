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
    <aside className="w-full md:w-60 shrink-0">
      <nav className="sticky top-24">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isAllActive()
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-subtle hover:bg-surface hover:text-foreground'
              }`}
            >
              <span>전체</span>
              <span className="text-xs text-muted">
                {Object.values(postCounts).reduce((a, b) => a + b, 0)}
              </span>
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog/category/${category.id}`}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(category.id)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-subtle hover:bg-surface hover:text-foreground'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-xs text-muted">
                  {postCounts[category.id] || 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick Memo Widget */}
        <div className="mt-6 pt-6 border-t border-card-border">
          <QuickMemoWidget />
        </div>
      </nav>
    </aside>
  );
}
