'use client';

import { useState, useRef, useMemo } from 'react';
import {
  Search,
  Pencil,
  Check,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react';
import type { QuickMemo } from '@/lib/quick-memos';
import { CATEGORIES, getCategoryName } from '@/lib/categories';
import EmptyState from '@/components/EmptyState';
import { StickyNote } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'category';

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sort state
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Filtered and sorted memos
  const displayedMemos = useMemo(() => {
    let result = [...memos];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (memo) =>
          memo.content.toLowerCase().includes(q) ||
          (memo.title && memo.title.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;
      case 'category':
        result.sort((a, b) => {
          const catA = a.category || '';
          const catB = b.category || '';
          if (catA === catB)
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          if (!catA) return 1;
          if (!catB) return -1;
          return catA.localeCompare(catB);
        });
        break;
    }

    return result;
  }, [memos, searchQuery, sortOption]);

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

  // Inline edit handlers
  const startEdit = (memo: QuickMemo) => {
    setEditingId(memo.id);
    setEditContent(memo.content);
    setTimeout(() => editTextareaRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async () => {
    if (!editingId || !editContent.trim() || editSaving) return;

    setEditSaving(true);
    try {
      const res = await fetch('/api/quick-memos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, content: editContent.trim() }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMemos((prev) =>
          prev.map((m) => (m.id === editingId ? updated : m))
        );
        setEditingId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Failed to update memo:', error);
    } finally {
      setEditSaving(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      cancelEdit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      saveEdit();
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Set minimal drag image data
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setMemos((prev) => {
      const updated = [...prev];
      const draggedIndex = updated.findIndex((m) => m.id === draggedId);
      const targetIndex = updated.findIndex((m) => m.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const [dragged] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, dragged);
      return updated;
    });

    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
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

  const sortLabel: Record<SortOption, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
    category: 'Category',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Sort Bar */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memos..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-card-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-card-border bg-surface text-sm text-foreground hover:bg-surface/80 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4 text-muted" />
            <span className="hidden sm:inline">{sortLabel[sortOption]}</span>
          </button>
          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-card border border-card-border rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setSortOption('newest');
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                    sortOption === 'newest'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  Newest
                </button>
                <button
                  onClick={() => {
                    setSortOption('oldest');
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                    sortOption === 'oldest'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  Oldest
                </button>
                <button
                  onClick={() => {
                    setSortOption('category');
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                    sortOption === 'category'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Category
                </button>
              </div>
            </>
          )}
        </div>
      </div>

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

      {/* Search Result Info */}
      {searchQuery && (
        <p className="text-xs text-muted">
          {displayedMemos.length} result
          {displayedMemos.length !== 1 ? 's' : ''} for &quot;{searchQuery}
          &quot;
        </p>
      )}

      {/* Memo List */}
      {memos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {displayedMemos.length > 0 ? (
            displayedMemos.map((memo) => {
              const isEditing = editingId === memo.id;
              const isDragging = draggedId === memo.id;
              const isDragOver = dragOverId === memo.id;

              return (
                <div
                  key={memo.id}
                  draggable={!isEditing}
                  onDragStart={(e) => handleDragStart(e, memo.id)}
                  onDragOver={(e) => handleDragOver(e, memo.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, memo.id)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-card border rounded-xl p-5 transition-all ${
                    isEditing
                      ? 'border-primary/40 bg-surface ring-1 ring-primary/20'
                      : isDragOver
                        ? 'border-primary/40 bg-surface/50'
                        : 'border-card-border'
                  } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
                >
                  {/* Title */}
                  {memo.title && (
                    <h3 className="text-body-lg font-semibold text-foreground mb-2">
                      {memo.title}
                    </h3>
                  )}

                  {/* Content — view or edit mode */}
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        ref={editTextareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="w-full h-28 resize-none rounded-lg border border-card-border bg-card p-3 focus:outline-none text-foreground text-sm placeholder:text-muted"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">
                          Ctrl+Enter to save, Esc to cancel
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-subtle hover:text-foreground transition-colors rounded-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            disabled={
                              !editContent.trim() ||
                              editSaving ||
                              editContent.trim() === memo.content
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {editSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {memo.content}
                    </p>
                  )}

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
                      {/* Drag handle */}
                      <GripVertical className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
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
                    <div className="flex items-center gap-1">
                      {/* Edit button */}
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(memo)}
                          className="p-1 text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                          title="Edit memo"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(memo.id)}
                        className="p-1 text-muted hover:text-primary transition-colors shrink-0"
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
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted">
                No memos match your search.
              </p>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<StickyNote size={48} />}
          title="No memos yet"
          description="Quick memos you create will appear here."
        />
      )}
    </div>
  );
}
