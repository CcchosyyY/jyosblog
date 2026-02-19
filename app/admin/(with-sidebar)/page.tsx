'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/supabase';
import type { QuickMemo } from '@/lib/quick-memos';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [memoContent, setMemoContent] = useState('');
  const [memoSaving, setMemoSaving] = useState(false);
  const [memoExpanded, setMemoExpanded] = useState(false);
  const [memoSort, setMemoSort] = useState<'newest' | 'oldest'>('newest');
  const memoTextareaRef = useRef<HTMLInputElement>(null);

  const fetchMemos = useCallback(async () => {
    try {
      const res = await fetch('/api/quick-memos?limit=50');
      if (res.ok) {
        const data = await res.json();
        setMemos(data);
      }
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchMemos();
  }, [fetchMemos]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    try {
      const res = await fetch(`/api/quick-memos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMemos(memos.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const handleSaveMemo = async () => {
    if (!memoContent.trim() || memoSaving) return;
    setMemoSaving(true);
    try {
      const res = await fetch('/api/quick-memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: memoContent.trim() }),
      });
      if (res.ok) {
        const newMemo = await res.json();
        setMemos((prev) => [newMemo, ...prev]);
        setMemoContent('');
        setMemoExpanded(false);
      }
    } catch (error) {
      console.error('Failed to save memo:', error);
    } finally {
      setMemoSaving(false);
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

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const categoryCount = new Set(posts.map((p) => p.category)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-10">
      <h1 className="text-[28px] font-bold text-foreground mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-card-border p-5 rounded-xl">
          <p className="text-xs font-medium text-muted">Total Posts</p>
          <p className="text-[28px] font-bold text-foreground mt-1">{posts.length}</p>
        </div>
        <div className="bg-card border border-card-border p-5 rounded-xl">
          <p className="text-xs font-medium text-muted">Published</p>
          <p className="text-[28px] font-bold text-foreground mt-1">{publishedCount}</p>
        </div>
        <div className="bg-card border border-card-border p-5 rounded-xl">
          <p className="text-xs font-medium text-muted">Drafts</p>
          <p className="text-[28px] font-bold text-foreground mt-1">{draftCount}</p>
        </div>
        <div className="bg-card border border-card-border p-5 rounded-xl">
          <p className="text-xs font-medium text-muted">Categories</p>
          <p className="text-[28px] font-bold text-foreground mt-1">{categoryCount}</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
        <div className="border border-card-border rounded-xl overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">
              글이 없습니다.
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted w-[280px]">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted w-[120px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted w-[120px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted w-[120px]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-card-border hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {post.title}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                          post.status === 'published'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          post.status === 'published' ? 'bg-primary' : 'bg-secondary'
                        }`} />
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted">
                      {new Date(post.updated_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="text-subtle hover:text-foreground transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Memos Section */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Memos</h2>
          <button
            onClick={() => setMemoExpanded(!memoExpanded)}
            className="ml-2 p-1 text-muted hover:text-primary transition-colors rounded-lg hover:bg-surface"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={memoExpanded ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
            </svg>
          </button>
          <select
            value={memoSort}
            onChange={(e) => setMemoSort(e.target.value as 'newest' | 'oldest')}
            className="ml-auto px-3 py-1.5 text-xs font-medium text-subtle bg-surface border border-card-border rounded-lg focus:outline-none"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        {memoExpanded && (
          <div className="flex items-center gap-2 mb-4 max-w-sm">
            <input
              type="text"
              ref={memoTextareaRef}
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setMemoExpanded(false);
                  setMemoContent('');
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveMemo();
                }
              }}
              placeholder="Enter your text here..."
              className="flex-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveMemo}
              disabled={!memoContent.trim() || memoSaving}
              className="px-3 py-2 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {memoSaving ? '...' : 'Save'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[...memos].sort((a, b) => {
            const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            return memoSort === 'newest' ? -diff : diff;
          }).map((memo) => (
              <div
                key={memo.id}
                className="flex flex-col bg-background border border-card-border rounded-lg px-4 py-3"
              >
                <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed flex-1">
                  {memo.content}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-card-border">
                  <time className="text-xs text-muted">
                    {formatDate(memo.created_at)}
                  </time>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/write?memoId=${memo.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-link bg-link/10 rounded hover:bg-link/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Write
                    </Link>
                    <button
                      onClick={() => handleDeleteMemo(memo.id)}
                      className="p-1 text-muted hover:text-primary transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
