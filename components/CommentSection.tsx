'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Avatar from '@/components/Avatar';
import type { Comment } from '@/lib/comments';

interface CommentSectionProps {
  postId: string;
  isAdmin?: boolean;
}

export default function CommentSection({ postId, isAdmin = false }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          setUserId(session?.user?.id ?? null);
          if (session?.user) {
            setUserName(
              session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split('@')[0] ||
                'User'
            );
            setUserAvatar(session.user.user_metadata?.avatar_url ?? null);
          }
        }
      }
    );

    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, [postId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim() || submitting) return;
      setSubmitting(true);
      setError('');

      const tempId = `temp-${Date.now()}`;
      const optimistic: Comment = {
        id: tempId,
        post_id: postId,
        user_id: userId || '',
        user_name: userName,
        user_avatar: userAvatar,
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setComments((prev) => [...prev, optimistic]);
      setPendingIds((prev) => new Set(prev).add(tempId));
      const savedContent = content;
      setContent('');

      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, content: savedContent.trim() }),
        });
        if (res.ok) {
          const comment = await res.json();
          setComments((prev) =>
            prev.map((c) => (c.id === tempId ? comment : c))
          );
        } else {
          setComments((prev) => prev.filter((c) => c.id !== tempId));
          setError('댓글 작성에 실패했습니다.');
          setContent(savedContent);
        }
      } catch {
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setError('댓글 작성에 실패했습니다.');
        setContent(savedContent);
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
        setSubmitting(false);
      }
    },
    [content, submitting, postId, userId, userName, userAvatar]
  );

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
    <section className="border border-card-border rounded-xl bg-card p-5 sm:p-6 flex flex-col gap-5">
      <h2 className="text-body-lg font-semibold text-foreground">
        Comments{comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      {/* Comment List */}
      {loading ? (
        <div className="divide-y divide-card-border">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 py-5">
              <div className="w-9 h-9 rounded-full bg-surface shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-surface rounded" />
                <div className="h-3 w-full bg-surface rounded" />
                <div className="h-3 w-2/3 bg-surface rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-body-sm text-muted py-8 text-center">
          첫 댓글을 남겨보세요
        </p>
      ) : (
        <div className="divide-y divide-card-border">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`flex gap-3 py-5 first:pt-0 ${
                pendingIds.has(comment.id) ? 'opacity-60' : ''
              }`}
            >
              <Avatar
                src={comment.user_avatar}
                name={comment.user_name}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-body font-medium text-foreground">
                    {comment.user_name}
                  </span>
                  <time className="text-caption text-muted">
                    {formatDate(comment.created_at)}
                  </time>
                  {pendingIds.has(comment.id) && (
                    <span className="text-caption text-muted">전송 중...</span>
                  )}
                  {(userId === comment.user_id || isAdmin) &&
                    !pendingIds.has(comment.id) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className={`ml-auto text-caption transition-colors ${
                          isAdmin && userId !== comment.user_id
                            ? 'text-muted hover:text-red-500'
                            : 'text-muted hover:text-primary'
                        }`}
                      >
                        삭제
                      </button>
                    )}
                </div>
                <p className="mt-1.5 text-body-sm text-subtle whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-body-sm text-primary">{error}</p>
      )}

      {/* Comment Form */}
      {userId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows={2}
            maxLength={2000}
            className="w-full resize-none rounded-lg border border-card-border bg-surface px-3 py-2 text-body-sm text-foreground placeholder-muted focus-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-caption-sm text-muted">
              {content.length.toLocaleString()} / 2,000
            </span>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-3 py-1.5 text-body-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {submitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-surface rounded-lg text-center">
          <p className="text-body-sm text-muted">
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
