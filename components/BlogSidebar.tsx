'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import QuickMemoWidget from './QuickMemoWidget';

interface BlogSidebarProps {
  postCounts: Record<string, number>;
}

export default function BlogSidebar({ postCounts }: BlogSidebarProps) {
  const pathname = usePathname();

  const isCategoryActive = (categoryId: string) => {
    return pathname === `/blog/category/${categoryId}`;
  };

  const isAllActive = () => {
    return pathname === '/' || pathname === '/blog';
  };

  const totalCount = Object.values(postCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-card-border bg-card">
      {/* Profile */}
      <div className="p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-base font-semibold shrink-0 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            J
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">
              Jyo
            </h3>
            <p className="text-[13px] text-subtle">
              Developer &amp; Blogger
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 px-3">
        <h3 className="px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isAllActive()
                  ? 'bg-primary/10 text-primary'
                  : 'text-subtle hover:bg-surface hover:text-foreground'
              }`}
            >
              <span>전체</span>
              <span
                className={`text-xs ${isAllActive() ? 'text-primary' : 'text-muted'}`}
              >
                {totalCount}
              </span>
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog/category/${category.id}`}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCategoryActive(category.id)
                    ? 'bg-primary/10 text-primary'
                    : 'text-subtle hover:bg-surface hover:text-foreground'
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-xs ${isCategoryActive(category.id) ? 'text-primary' : 'text-muted'}`}
                >
                  {postCounts[category.id] || 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Memo */}
      <div className="p-3 border-t border-card-border">
        <QuickMemoWidget />
      </div>
    </aside>
  );
}
