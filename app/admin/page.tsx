'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/supabase';
import type { QuickMemo } from '@/lib/quick-memos';
import { CATEGORIES, getCategoryName } from '@/lib/categories';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [memos, setMemos] = useState<QuickMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUnprocessedOnly, setFilterUnprocessedOnly] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
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

  const filteredMemos = memos.filter((memo) => {
    if (filterCategory && memo.category !== filterCategory) return false;
    if (filterUnprocessedOnly && memo.is_processed) return false;
    return true;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const categoryCount = new Set(posts.map((p) => p.category)).size;

  const postCountByCategory: Record<string, number> = {};
  posts.forEach((p) => {
    postCountByCategory[p.category] = (postCountByCategory[p.category] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar - Categories */}
          <div className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-24">
              <h3 className="text-base font-semibold text-foreground mb-4">
                Categories
              </h3>
              <ul className="space-y-1">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-lg text-[15px] font-medium text-subtle">
                      <span>{category.name}</span>
                      <span className="text-xs text-muted">
                        {postCountByCategory[category.id] || 0}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-[28px] font-bold text-foreground">
                Dashboard
              </h1>
              <div className="flex gap-3">
                <Link
                  href="/admin/write"
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors"
                >
                  글쓰기
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-subtle text-sm hover:text-primary transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>

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
              {/* Header with filter */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Quick Memos</h2>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border border-card-border rounded-lg">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent text-sm text-foreground focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <span className="w-px h-6 bg-card-border" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[13px] text-subtle">Unprocessed only</span>
                    <button
                      onClick={() => setFilterUnprocessedOnly(!filterUnprocessedOnly)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        filterUnprocessedOnly ? 'bg-primary' : 'bg-surface border border-card-border'
                      }`}
                    >
                      <span
                        className={`absolute top-[2px] w-5 h-5 rounded-full bg-card transition-transform ${
                          filterUnprocessedOnly ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              {/* Memo Cards */}
              {filteredMemos.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">
                  메모가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMemos.map((memo) => (
                    <div
                      key={memo.id}
                      className="bg-background border border-card-border rounded-xl p-5"
                    >
                      {/* Header: title + actions */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[15px] font-semibold text-foreground">
                          {memo.title || 'Untitled'}
                        </span>
                        <div className="flex items-center gap-2">
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
                            className="text-muted hover:text-primary transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-subtle whitespace-pre-wrap break-words leading-relaxed">
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

                      {/* Bottom: timestamp + processed indicator */}
                      <div className="flex items-center justify-between mt-3">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
