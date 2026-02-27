'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Settings, Plus } from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-card-border bg-card">
      <div className="p-6">
        <h2 className="text-lg font-bold text-foreground">Admin</h2>
      </div>
      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-subtle hover:bg-surface hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-card-border space-y-2">
        <Link
          href="/admin/write"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-subtle text-sm hover:text-primary transition-colors rounded-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
