'use client';

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PostEditor from '@/components/PostEditor';
import MemoSidebar from '@/components/MemoSidebar';

function WritePageContent() {
  const searchParams = useSearchParams();
  const memoId = searchParams.get('memoId') || undefined;
  const template = searchParams.get('template') || undefined;
  const [category, setCategory] = useState('daily');
  const [showMobileMemos, setShowMobileMemos] = useState(false);
  const insertHandlerRef = useRef<((content: string) => void) | null>(null);

  const handleInsert = (content: string) => {
    insertHandlerRef.current?.(content);
  };

  const registerInsertHandler = useCallback(
    (handler: (content: string) => void) => {
      insertHandlerRef.current = handler;
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const select = document.querySelector(
        'select[data-category-select]'
      ) as HTMLSelectElement | null;
      if (select && select.value !== category) {
        setCategory(select.value);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [category]);

  // Listen for /memo slash command
  useEffect(() => {
    const handler = () => setShowMobileMemos(true);
    window.addEventListener('open-memo-sidebar', handler);
    return () => window.removeEventListener('open-memo-sidebar', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-card-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-subtle hover:text-foreground transition-colors text-sm font-medium"
              >
                &larr; 뒤로
              </Link>
              <h1 className="text-lg font-bold text-foreground">
                새 글 작성
              </h1>
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

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <PostEditor
              initialMemoId={memoId}
              initialTemplate={template}
              onInsert={registerInsertHandler}
            />
          </div>

          <div className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[61px] max-h-[calc(100vh-85px)] bg-card border border-card-border rounded-xl overflow-hidden">
              <MemoSidebar category={category} onInsert={handleInsert} />
            </div>
          </div>
        </div>

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
                  category={category}
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

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted">로딩 중...</p>
        </div>
      }
    >
      <WritePageContent />
    </Suspense>
  );
}
