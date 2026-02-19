'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuickMemo } from '@/lib/quick-memos';
import { CATEGORIES, getCategoryName } from '@/lib/categories';

interface MemoSidebarProps {
  category: string;
  onInsert: (content: string) => void;
}

export default function MemoSidebar({
  category,
  onInsert,
}: MemoSidebarProps) {
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState(category);
  const [unprocessedOnly, setUnprocessedOnly] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMemos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (filterCategory) params.set('category', filterCategory);
      if (unprocessedOnly) params.set('is_processed', 'false');

      const res = await fetch(`/api/quick-memos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMemos(data);
      }
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, unprocessedOnly]);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  useEffect(() => {
    setFilterCategory(category);
  }, [category]);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const markAsProcessed = async (ids: string[]) => {
    try {
      await fetch('/api/quick-memos/batch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      setMemos((prev) => prev.filter((m) => !ids.includes(m.id)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      if (expandedId && ids.includes(expandedId)) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error('Failed to mark as processed:', error);
    }
  };

  const handleInsertSingle = async (e: React.MouseEvent, memo: QuickMemo) => {
    e.stopPropagation();
    onInsert(memo.content);
    await markAsProcessed([memo.id]);
  };

  const handleInsertSelected = async () => {
    const ids = Array.from(selectedIds);
    const selectedMemos = memos.filter((m) => ids.includes(m.id));
    const combined = selectedMemos.map((m) => m.content).join('\n\n');
    onInsert(combined);
    await markAsProcessed(ids);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
        <h3 className="text-base font-semibold text-foreground">Memos</h3>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {memos.length}
        </span>
      </div>

      {/* Filter Section */}
      <div className="px-4 py-3 border-b border-card-border">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md border border-card-border bg-surface text-xs text-foreground focus:outline-none"
        >
          <option value="">All</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Memo List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted">
            Loading...
          </div>
        ) : memos.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted">
            No memos found
          </div>
        ) : (
          memos.map((memo) => {
            const isExpanded = expandedId === memo.id;
            return (
              <div
                key={memo.id}
                onClick={() => toggleExpand(memo.id)}
                className={`flex gap-2.5 px-4 py-3 border-b border-card-border cursor-pointer transition-colors ${
                  isExpanded ? 'bg-surface' : 'hover:bg-surface/50'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => toggleSelect(e, memo.id)}
                  className={`shrink-0 w-4 h-4 mt-0.5 rounded border transition-colors ${
                    selectedIds.has(memo.id)
                      ? 'bg-primary border-primary'
                      : 'border-card-border bg-card'
                  }`}
                >
                  {selectedIds.has(memo.id) && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {memo.title && (
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {memo.title}
                    </p>
                  )}
                  {isExpanded ? (
                    <div className="space-y-2 mt-1">
                      <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                        {memo.content}
                      </p>
                      {memo.category && (
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-link/10 text-link">
                          {getCategoryName(memo.category)}
                        </span>
                      )}
                      <button
                        onClick={(e) => handleInsertSingle(e, memo)}
                        className="w-full py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                      >
                        Insert
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-subtle line-clamp-1 mt-0.5">
                        {memo.content}
                      </p>
                      {memo.category && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-link/10 text-link">
                          {getCategoryName(memo.category)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Bar */}
      {selectedIds.size > 0 && (
        <div className="px-4 py-3 border-t border-card-border">
          <button
            onClick={handleInsertSelected}
            className="w-full py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
          >
            Insert Selected ({selectedIds.size})
          </button>
        </div>
      )}
    </div>
  );
}
