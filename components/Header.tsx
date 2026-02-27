'use client';

import Link from 'next/link';
import Avatar from '@/components/Avatar';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

const NAV_LINKS = [
  { href: '/', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const isAdminCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('is_admin='));
    setIsAdmin(!!isAdminCookie);

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/blog');
    return pathname === href;
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAdmin(false);
      router.push('/');
      router.refresh();
    } catch {
      // Silently fail
    }
  };

  const openSearch = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })
    );
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  // Build login href with ?next= param so user returns after login
  const isLoginPage =
    pathname === '/login' || pathname === '/admin/login';
  const loginHref = isLoginPage
    ? '/login'
    : `/login?next=${encodeURIComponent(pathname)}`;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-card-border">
      <nav className="max-w-6xl mx-auto px-6">
        <div className="relative flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Jyos Blog
          </Link>

          {/* Desktop Navigation — absolute center */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/15 text-primary'
                    : 'text-subtle hover:bg-primary/15 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 h-9 w-44 rounded-lg border border-card-border hover:bg-surface transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-muted shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-xs text-muted flex-1 text-left">
                Search...
              </span>
              <kbd className="text-caption-xs font-medium text-muted bg-surface px-1 py-0.5 rounded border border-card-border">
                Ctrl+K
              </kbd>
            </button>

            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                  aria-label="Dashboard"
                >
                  <Avatar src={avatarUrl} name={displayName} size="md" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2 h-9 rounded-lg hover:bg-surface transition-colors text-subtle hover:text-foreground"
                  aria-label="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-xs font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href={loginHref}
                className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg hover:bg-surface transition-colors text-subtle hover:text-foreground"
                aria-label="Login"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
                <span className="text-xs font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile: ThemeToggle + Hamburger only */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col gap-1">
              {/* Nav Links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/15 text-primary'
                      : 'text-subtle hover:bg-primary/15 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Search */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setTimeout(openSearch, 100);
                }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-subtle hover:bg-primary/15 hover:text-primary rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>

              {/* Divider */}
              <div className="h-px bg-card-border my-2" />

              {/* User section */}
              {user ? (
                <>
                  <Link
                    href={isAdmin ? '/admin' : '/dashboard'}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors"
                  >
                    <Avatar src={avatarUrl} name={displayName} size="sm" />
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    {isAdmin && (
                      <span className="text-caption-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-subtle hover:text-foreground hover:bg-surface rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href={loginHref}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-subtle hover:bg-primary/15 hover:text-primary rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
