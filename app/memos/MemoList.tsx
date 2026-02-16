'use client';

import { useState, useRef } from 'react';
import type { QuickMemo } from '@/lib/quick-memos';
import { CATEGORIES, getCategoryName } from '@/lib/categories';

interface MemoListProps {
  initialMemos: QuickMemo[];
}

export default function MemoList({ initialMemos }: MemoListProps) {
  const [memos, setMemos] = useState<QuickMemo[]>(initialMemos);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!content.trim() || saving) return;

    setSaving(true);
    try {
      const tags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const body: Record<string, unknown> = {
        content: content.trim(),
      };
      if (title.trim()) body.title = title.trim();
      if (category) body.category = category;
      if (tags.length > 0) body.tags = tags;

      const res = await fetch('/api/quick-memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const newMemo = await res.json();
        setMemos((prev) => [newMemo, ...prev]);
        setContent('');
        setTitle('');
        setCategory('');
        setTagInput('');
        setIsFormOpen(false);
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
      setIsFormOpen(false);
      setContent('');
      setTitle('');
      setCategory('');
      setTagInput('');
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add Memo Button / Form */}
      <div>
        {isFormOpen ? (
          <div className="bg-card border border-card-border rounded-xl p-5 animate-fadeIn">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Memo title..."
              className="w-full mb-3 px-3 py-2.5 rounded-lg border border-card-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none"
            />

            {/* Category & Tags */}
            <div className="flex gap-3 mb-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-card-border bg-surface text-sm text-foreground focus:outline-none"
              >
                <option value="">Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tags (comma separated)"
                className="flex-1 px-3 py-2.5 rounded-lg border border-card-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none"
              />
            </div>

            {/* Content */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a memo... (Ctrl+Enter to save, Esc to cancel)"
              className="w-full h-28 resize-none rounded-lg border border-card-border bg-surface p-3 focus:outline-none text-foreground text-sm placeholder:text-muted"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-card-border">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setContent('');
                  setTitle('');
                  setCategory('');
                  setTagInput('');
                }}
                className="px-6 py-3 text-sm font-medium text-subtle hover:text-foreground transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() || saving}
                className="px-6 py-3 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Memo
          </button>
        )}
      </div>

      {/* Memo List */}
      {memos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="group bg-card border border-card-border rounded-xl p-5"
            >
              {/* Title */}
              {memo.title && (
                <h3 className="text-[15px] font-semibold text-foreground mb-2">
                  {memo.title}
                </h3>
              )}

              {/* Content */}
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {memo.content}
              </p>

              {/* Category & Tags */}
              {(memo.category || (memo.tags && memo.tags.length > 0)) && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {memo.category && (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-link/10 text-link">
                      {getCategoryName(memo.category)}
                    </span>
                  )}
                  {memo.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/10 text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-3">
                  <time className="text-xs text-muted">
                    {formatDate(memo.created_at)}
                  </time>
                  {!memo.is_processed && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Unprocessed
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(memo.id)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-muted hover:text-primary transition-all shrink-0"
                  title="Delete memo"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">No memos yet.</p>
        </div>
      )}
    </div>
  );
}
