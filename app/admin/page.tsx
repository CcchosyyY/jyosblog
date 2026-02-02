'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/supabase';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <p className="text-light/50">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-dark border-b border-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light">
            블로그 관리
          </h1>
          <div className="flex gap-4">
            <Link
              href="/admin/write"
              className="px-4 py-2 bg-teal text-light rounded-md hover:bg-teal/80 transition-colors"
            >
              글쓰기
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-light/70 hover:text-rose transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-light/5 border border-light/10 p-4 rounded-lg">
            <p className="text-sm text-light/50">전체 글</p>
            <p className="text-2xl font-bold text-light">{posts.length}</p>
          </div>
          <div className="bg-light/5 border border-light/10 p-4 rounded-lg">
            <p className="text-sm text-light/50">발행됨</p>
            <p className="text-2xl font-bold text-teal">{publishedCount}</p>
          </div>
          <div className="bg-light/5 border border-light/10 p-4 rounded-lg">
            <p className="text-sm text-light/50">임시저장</p>
            <p className="text-2xl font-bold text-rose">{draftCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-teal text-light'
                : 'bg-light/5 text-light/70 hover:bg-light/10'
            }`}
          >
            전체 ({posts.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'published'
                ? 'bg-teal text-light'
                : 'bg-light/5 text-light/70 hover:bg-light/10'
            }`}
          >
            발행됨 ({publishedCount})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'draft'
                ? 'bg-teal text-light'
                : 'bg-light/5 text-light/70 hover:bg-light/10'
            }`}
          >
            임시저장 ({draftCount})
          </button>
        </div>

        {/* Posts List */}
        <div className="bg-light/5 border border-light/10 rounded-lg overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-light/50">
              글이 없습니다.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-light/10">
              <thead className="bg-light/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light/50 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light/50 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light/50 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light/50 uppercase tracking-wider">
                    수정일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-light/50 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light/10">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-light/5">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-light">
                        {post.title}
                      </div>
                      <div className="text-sm text-light/50">
                        {post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-light/70">
                      {post.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === 'published'
                            ? 'bg-teal/20 text-teal'
                            : 'bg-rose/20 text-rose'
                        }`}
                      >
                        {post.status === 'published' ? '발행됨' : '임시저장'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-light/50">
                      {new Date(post.updated_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="text-teal hover:text-teal/80"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-rose hover:text-rose/80"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
