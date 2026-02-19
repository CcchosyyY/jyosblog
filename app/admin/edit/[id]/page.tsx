'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import PostEditor from '@/components/PostEditor';
import MemoSidebar from '@/components/MemoSidebar';
import type { Post } from '@/lib/supabase';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: Props) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileMemos, setShowMobileMemos] = useState(false);
  const insertRef = useRef<((content: string) => void) | null>(null);

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

  const handleInsert = (content: string) => {
    if (insertRef.current) {
      insertRef.current(content);
    }
  };

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
        <p className="text-primary mb-4">
          {error || '글을 찾을 수 없습니다.'}
        </p>
        <Link
          href="/admin"
          className="text-link hover:text-primary transition-colors text-sm font-medium"
        >
          관리자 페이지로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-card-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-subtle hover:text-foreground transition-colors text-sm font-medium"
              >
                &larr; 뒤로
              </Link>
              <h1 className="text-xl font-bold text-foreground">글 수정</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileMemos(!showMobileMemos)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-subtle hover:text-foreground bg-surface border border-card-border rounded-lg transition-colors"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Memos
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Editor */}
          <div className="flex-1 min-w-0">
            <PostEditor post={post} onInsertRef={insertRef} />
          </div>

          {/* Memo Sidebar - Desktop */}
          <div className="hidden lg:block w-[320px] shrink-0 sticky top-[73px] max-h-[calc(100vh-73px)] bg-card border border-card-border rounded-xl overflow-hidden">
            <MemoSidebar
              category={post.category}
              onInsert={handleInsert}
            />
          </div>
        </div>

        {/* Memo Sidebar - Mobile overlay */}
        {showMobileMemos && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="absolute right-0 top-0 bottom-0 w-[320px] bg-card border-l border-card-border shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
                <span className="text-sm font-semibold text-foreground">
                  Memos
                </span>
                <button
                  onClick={() => setShowMobileMemos(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(100%-52px)]">
                <MemoSidebar
                  category={post.category}
                  onInsert={(content) => {
                    handleInsert(content);
                    setShowMobileMemos(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
