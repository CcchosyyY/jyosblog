'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { Comment } from '@/lib/comments';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });

    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: content.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setContent('');
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // silently fail
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground">
        {comments.length > 0 ? `${comments.length}` : ''}
      </h2>

      {/* Comment List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-surface rounded" />
                <div className="h-3 w-full bg-surface rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 bg-card rounded-lg border border-card-border"
            >
              {comment.user_avatar ? (
                <Image
                  src={comment.user_avatar}
                  alt={comment.user_name}
                  width={32}
                  height={32}
                  className="rounded-full shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {comment.user_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {comment.user_name}
                  </span>
                  <time className="text-xs text-muted">
                    {formatDate(comment.created_at)}
                  </time>
                  {userId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-xs text-muted hover:text-primary transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-subtle whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      {userId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows={3}
            className="w-full resize-none rounded-lg border border-card-border bg-surface p-3 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {submitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-surface rounded-lg text-center">
          <p className="text-sm text-muted">
            <Link
              href="/login"
              className="text-link hover:text-primary transition-colors underline"
            >
              로그인
            </Link>
            {' '}후 댓글을 작성할 수 있습니다.
          </p>
        </div>
      )}
    </section>
  );
}
