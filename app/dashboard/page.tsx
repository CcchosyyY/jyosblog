'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowser();

    // Use onAuthStateChange to wait for session initialization from cookies
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!isMounted) return;
        if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            setUser(session.user);
          } else {
            router.replace('/login?next=/dashboard');
          }
          setLoading(false);
        }
        if (event === 'SIGNED_OUT') {
          router.replace('/login?next=/dashboard');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-background">
        <p className="text-muted">로딩 중...</p>
      </div>
    );
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-heading-lg font-bold text-foreground mb-2">
          My Dashboard
        </h1>
        <p className="text-subtle mb-8">
          {displayName}님, 환영합니다.
        </p>

        <div className="bg-card border border-card-border rounded-xl p-8 text-center">
          <p className="text-muted text-sm">
            준비 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
