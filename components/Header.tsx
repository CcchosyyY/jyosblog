'use client';

import Link from 'next/link';
import Image from 'next/image';
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

    // Check is_admin cookie
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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname.startsWith('/blog');
    return pathname === href;
  };

  const handleLogout = async () => {
    try {
      // Sign out from browser client first (clears in-memory session)
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();

      // Sign out from server (clears DB session + cookies)
      await fetch('/api/auth/logout', { method: 'POST' });

      setUser(null);
      setIsAdmin(false);
      router.push('/');
      router.refresh();
    } catch {
      // Silently fail
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-card-border">
      <nav className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Jyo&apos;s Blog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                    : 'text-subtle hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => {
                document.dispatchEvent(
                  new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true,
                    bubbles: true,
                  })
                );
              }}
              className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg border border-card-border hover:bg-surface transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-muted"
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
              <kbd className="hidden sm:inline text-[10px] font-medium text-muted bg-surface px-1 py-0.5 rounded border border-card-border">
                Ctrl+K
              </kbd>
            </button>

            {/* User area */}
            {user ? (
              <div className="flex items-center gap-1">
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                  aria-label="Dashboard"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-subtle hover:text-foreground"
                  aria-label="Logout"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface transition-colors"
                aria-label="Login"
              >
                <svg
                  className="w-5 h-5 text-subtle"
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
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                  aria-label="Dashboard"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-surface transition-colors text-subtle hover:text-foreground"
                  aria-label="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : null}
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'text-subtle hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-subtle hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
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
