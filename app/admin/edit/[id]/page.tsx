'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import PostEditor from '@/components/PostEditor';
import type { Post } from '@/lib/supabase';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: Props) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setError('글을 찾을 수 없습니다.');
        }
      } catch {
        setError('글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">로딩 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-primary mb-4">{error || '글을 찾을 수 없습니다.'}</p>
        <Link href="/admin" className="text-link hover:text-primary transition-colors text-sm font-medium">
          관리자 페이지로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-subtle hover:text-foreground transition-colors text-sm font-medium"
            >
              &larr; 뒤로
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              글 수정
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <PostEditor post={post} />
        </div>
      </main>
    </div>
  );
}
