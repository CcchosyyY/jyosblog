'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import ProfileCard from '@/components/ProfileCard';

interface ProfileData {
  nickname: string;
  bio: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
          if (!session?.user) {
            router.replace('/login?next=/profile');
            return;
          }
          setUserId(session.user.id);
          fetch(`/api/profile?userId=${session.user.id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data: ProfileData | null) => {
              if (!isMounted) return;
              if (data) {
                setNickname(data.nickname || '');
                setBio(data.bio || '');
              }
            })
            .catch(() => {})
            .finally(() => {
              if (isMounted) setLoading(false);
            });
        }
        if (event === 'SIGNED_OUT') {
          router.replace('/login?next=/profile');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, bio }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-surface rounded" />
          <div className="h-32 bg-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">프로필</h1>

      <ProfileCard userId={userId} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-card-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="닉네임을 입력하세요"
            maxLength={50}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            소개
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full resize-none px-3 py-2 bg-surface border border-card-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="자기소개를 입력하세요"
            maxLength={500}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          {saved && (
            <span className="text-sm text-secondary">저장되었습니다</span>
          )}
        </div>
      </form>
    </div>
  );
}
