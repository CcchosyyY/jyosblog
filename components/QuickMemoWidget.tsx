'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES } from '@/lib/categories';
import type { QuickMemo } from '@/lib/quick-memos';

export default function QuickMemoWidget() {
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [hoveredMemo, setHoveredMemo] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMemoEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMemo(id);
  };

  const handleMemoLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMemo(null);
    }, 100);
  };

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
      const body: Record<string, string> = { content: content.trim() };
      if (category) body.category = category;

      const res = await fetch('/api/quick-memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const newMemo = await res.json();
        setMemos((prev) => [newMemo, ...prev]);
        setContent('');
        setCategory(null);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setContent('');
      setCategory(null);
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent('');
    setCategory(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Quick Memo</h3>
        {memos.length > 0 && (
          <button
            onClick={() => setIsListOpen(!isListOpen)}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {memos.length}건
          </button>
        )}
      </div>

      {/* Memo Input */}
      {isExpanded ? (
        <div className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your text here..."
            className="w-full h-[120px] resize-none rounded-lg border border-card-border bg-surface p-3 text-sm text-foreground placeholder-muted focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setCategory(category === cat.id ? null : cat.id)
                }
                className={`px-2.5 py-1 text-caption-sm font-medium rounded-full border transition-colors ${
                  category === cat.id
                    ? 'bg-secondary/10 border-secondary text-secondary'
                    : 'border-card-border text-muted hover:text-foreground hover:border-subtle'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-subtle hover:text-foreground transition-colors rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              disabled={!content.trim() || saving}
              className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 bg-surface rounded-lg cursor-pointer"
          onClick={handleExpand}
        >
          <span className="flex-1 text-body-sm text-muted">메모를 입력하세요...</span>
          <button
            className="text-muted hover:text-primary transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Memo List */}
      {isListOpen && memos.length > 0 && (
        <div className="relative mt-2 space-y-1">
          {memos.map((memo) => {
            const catName =
              CATEGORIES.find((c) => c.id === memo.category)?.name ||
              memo.category;
            const isHovered = hoveredMemo === memo.id;

            return (
              <div
                key={memo.id}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-default transition-colors ${
                  isHovered
                    ? 'bg-primary/5 border border-primary/20'
                    : 'bg-surface border border-transparent'
                }`}
                onMouseEnter={() => handleMemoEnter(memo.id)}
                onMouseLeave={handleMemoLeave}
              >
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  {memo.category && (
                    <span className="shrink-0 px-0.5 py-px text-caption-xs font-medium bg-secondary/10 text-secondary rounded">
                      {catName}
                    </span>
                  )}
                  <span className="text-body-sm text-subtle truncate">
                    {memo.content}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(memo.id)}
                  className={`ml-2 text-muted hover:text-primary transition-all shrink-0 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
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

                {/* Preview Card */}
                {isHovered && (
                  <div className="absolute left-[calc(100%+8px)] top-0 w-[220px] z-50 animate-in fade-in slide-in-from-left-1 duration-150">
                    <div className="bg-card border border-card-border rounded-xl shadow-xl overflow-hidden">
                      <div className="px-3 py-2 border-b border-card-border bg-surface/50 flex items-center justify-between">
                        {memo.category ? (
                          <span className="px-2 py-0.5 text-caption-xs font-semibold bg-secondary/15 text-secondary rounded-full">
                            {catName}
                          </span>
                        ) : (
                          <span className="text-caption-xs text-muted">메모</span>
                        )}
                        <time className="text-caption-xs text-muted">
                          {new Date(memo.created_at).toLocaleDateString(
                            'ko-KR',
                            { month: 'short', day: 'numeric' }
                          )}
                        </time>
                      </div>
                      <div className="px-3 py-2.5">
                        <p className="text-caption text-foreground whitespace-pre-wrap break-words leading-relaxed">
                          {memo.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
