'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface LikeButtonProps {
  postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'INITIAL_SESSION') {
          const uid = session?.user?.id ?? null;
          setUserId(uid);
          const params = new URLSearchParams({ postId });
          if (uid) params.set('userId', uid);
          fetch(`/api/likes?${params}`)
            .then((res) => res.json())
            .then((data) => {
              setCount(data.count ?? 0);
              setLiked(data.liked ?? false);
            })
            .catch(() => {});
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [postId]);

  const handleToggle = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setCount(data.count);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors disabled:opacity-50"
    >
      <svg
        className={`w-4 h-4 transition-colors ${liked ? 'text-primary fill-primary' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {count}
    </button>
  );
}
