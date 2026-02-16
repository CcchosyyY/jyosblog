'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { QuickMemo } from '@/lib/quick-memos';
import { CATEGORIES } from '@/lib/categories';

export default function QuickMemoWidget() {
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setTitle('');
      setCategory('');
      setTagInput('');
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
    setTitle('');
    setCategory('');
    setTagInput('');
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
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memo title..."
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none"
          />

          {/* Category & Tags row */}
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-surface text-sm text-foreground focus:outline-none"
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
              className="flex-1 px-3 py-2 rounded-lg border border-card-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none"
            />
          </div>

          {/* Content */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your text here..."
            className="w-full h-[120px] resize-none rounded-lg border border-card-border bg-surface p-3 text-sm text-foreground placeholder-muted focus:outline-none"
          />
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
          <span className="flex-1 text-[13px] text-muted">메모를 입력하세요...</span>
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
        <div className="mt-2 space-y-1.5">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="flex items-center justify-between px-3.5 py-2.5 bg-surface rounded-lg"
            >
              <span className="flex-1 text-[13px] text-subtle break-words">
                {memo.title ? `${memo.title}: ` : ''}
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
