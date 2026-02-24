'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  userId: string;
}

interface ProfileData {
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function ProfileCard({ userId }: ProfileCardProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 bg-card rounded-xl border border-card-border animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-surface rounded" />
            <div className="h-3 w-32 bg-surface rounded" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.nickname || 'User';
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="p-6 bg-card rounded-xl border border-card-border">
      <div className="flex items-center gap-4">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={displayName}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {displayName}
          </h2>
          {joinDate && (
            <p className="text-xs text-muted">{joinDate} 가입</p>
          )}
        </div>
      </div>
      {profile?.bio && (
        <p className="mt-4 text-sm text-subtle">{profile.bio}</p>
      )}
    </div>
  );
}
