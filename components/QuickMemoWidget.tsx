'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface QuickMemo {
  id: string;
  content: string;
  created_at: string;
  is_processed: boolean;
}

export default function QuickMemoWidget() {
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMemos = useCallback(async () => {
    try {
      const res = await fetch('/api/quick-memos?limit=10');
      if (res.ok) {
        const data = await res.json();
        setMemos(data);
      }
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    }
  }, []);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const handleSave = async () => {
    if (!content.trim() || saving) return;

    setSaving(true);
    try {
      const res = await fetch('/api/quick-memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        const newMemo = await res.json();
        setMemos((prev) => [newMemo, ...prev]);
        setContent('');
      }
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/quick-memos?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMemos((prev) => prev.filter((memo) => memo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-foreground mb-3">Quick Memo</h3>

      {/* Memo Input */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-surface rounded-lg">
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메모를 입력하세요..."
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder-muted focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={!content.trim() || saving}
          className="text-muted hover:text-primary transition-colors disabled:opacity-30 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Memo List */}
      {memos.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="flex items-center justify-between px-3.5 py-2.5 bg-surface rounded-lg"
            >
              <span className="flex-1 text-[13px] text-subtle break-words">
                {memo.content}
              </span>
              <button
                onClick={() => handleDelete(memo.id)}
                className="ml-2 text-muted hover:text-primary transition-colors shrink-0"
                title="삭제"
              >
                <svg
                  className="w-3.5 h-3.5"
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
          ))}
        </div>
      )}
    </div>
  );
}
