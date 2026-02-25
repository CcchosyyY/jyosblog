'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import { suggestCategory } from '@/lib/suggest-category';
import type { Post } from '@/lib/supabase';
import Image from 'next/image';
import MarkdownToolbar from '@/components/MarkdownToolbar';

interface PostEditorProps {
  post?: Post;
  initialMemoId?: string;
  initialTemplate?: string;
  onInsertRef?: React.MutableRefObject<((content: string) => void) | null>;
}

export default function PostEditor({
  post,
  initialMemoId,
  initialTemplate,
  onInsertRef,
}: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [category, setCategory] = useState(post?.category || 'daily');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose insert handler for parent to wire up MemoSidebar
  useEffect(() => {
    if (onInsertRef) {
      onInsertRef.current = (memoContent: string) => {
        const textarea = contentRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newContent =
            content.substring(0, start) +
            memoContent +
            content.substring(end);
          setContent(newContent);
          setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + memoContent.length;
            textarea.selectionEnd = start + memoContent.length;
          }, 0);
        } else {
          setContent((prev) => prev + '\n\n' + memoContent);
        }
      };
    }
  }, [content, onInsertRef]);

  // Pre-fill from memo if initialMemoId is provided
  useEffect(() => {
    if (!initialMemoId || isEditing) return;

    const fetchMemo = async () => {
      try {
        const res = await fetch(`/api/quick-memos?id=${initialMemoId}`);
        if (res.ok) {
          const data = await res.json();
          const memo = Array.isArray(data) ? data[0] : data;
          if (memo) {
            if (memo.title) setTitle(memo.title);
            if (memo.content) setContent(memo.content);
            if (memo.category) setCategory(memo.category);
            if (memo.tags?.length) setTags(memo.tags.join(', '));
          }
        }
      } catch (error) {
        console.error('Failed to fetch memo:', error);
      }
    };

    fetchMemo();
  }, [initialMemoId, isEditing]);

  useEffect(() => {
    if (!initialTemplate || isEditing) return;

    if (initialTemplate === 'devlog') {
      const today = new Date();
      const dateStr = today
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\. /g, '-')
        .replace('.', '');
      setTitle(`${dateStr} 개발일지`);
      setCategory('daily');
      setTags('devlog');
      setContent(
        `## 오늘 한 일\n\n- \n\n## 배운 점\n\n- \n\n## 내일 할 일\n\n- \n`
      );
    }
  }, [initialTemplate, isEditing]);

  useEffect(() => {
    if (content.length > 50) {
      const suggested = suggestCategory(content);
      if (suggested !== category) {
        setSuggestedCategory(suggested);
      } else {
        setSuggestedCategory(null);
      }
    }
  }, [content, category]);

  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 100);
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  const handleUpload = async (file: File) => {
    if (uploading) return;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('PNG, JPG, WEBP, GIF 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setThumbnail(data.url);
      } else {
        const data = await res.json();
        setError(data.error || '업로드에 실패했습니다.');
      }
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (!slug.trim()) {
      setError('슬러그를 입력해주세요.');
      return;
    }

    setError('');
    setSaving(true);

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title,
      content,
      slug,
      description,
      category,
      tags: tagArray,
      status,
      suggested_category: suggestedCategory,
      thumbnail: thumbnail || null,
    };

    try {
      const res = await fetch('/api/posts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditing ? { ...postData, id: post.id } : postData
        ),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || '저장에 실패했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (id: string) => {
    return CATEGORIES.find((c) => c.id === id)?.name || id;
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-card-border rounded-lg bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm';

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-primary/10 border-b border-primary/30 text-primary px-6 py-3 text-body-sm font-medium">
          <svg
            className="w-4 h-4 shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
          </svg>
          {error}
        </div>
      )}

      {/* Header: Thumbnail (left) + Title & Meta (right) */}
      <div className="flex items-start gap-5 border-b border-card-border px-4 py-3">
        {/* Thumbnail */}
        <div className="shrink-0">
          {thumbnail ? (
            <div className="relative group w-[180px] h-[180px] rounded-xl overflow-hidden border border-card-border">
              <Image
                src={thumbnail}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setThumbnail('')}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 w-[180px] h-[180px] rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-card-border bg-surface hover:border-subtle'
              }`}
            >
              {uploading ? (
                <span className="text-xs text-muted">업로드 중...</span>
              ) : (
                <>
                  <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <span className="text-caption-sm text-muted">썸네일</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Title + Meta */}
        <div className="flex-1 min-w-0 flex flex-col h-[180px]">
          {/* Meta fields (top) */}
          <div className="flex flex-col gap-1.5 px-1 pb-3 border-b border-card-border text-caption">
            <div className="flex items-center">
              <span className="shrink-0 w-14 text-muted font-medium">슬러그</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 min-w-0 px-2 py-0.5 border border-card-border rounded bg-surface text-foreground placeholder-muted text-caption focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="url-friendly-slug"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="shrink-0 w-14 text-muted font-medium">카테고리</span>
                <select
                  data-category-select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-16 px-1.5 py-0.5 border border-card-border rounded bg-surface text-foreground text-caption focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {suggestedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(suggestedCategory);
                      setSuggestedCategory(null);
                    }}
                    className="ml-1 text-caption-sm text-link hover:text-primary transition-colors whitespace-nowrap"
                  >
                    추천: {getCategoryName(suggestedCategory)}
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <span className="shrink-0 w-8 text-muted font-medium">태그</span>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-24 px-1.5 py-0.5 border border-card-border rounded bg-surface text-foreground placeholder-muted text-caption focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="태그1, 태그2"
                />
              </div>
            </div>
          </div>

          {/* Title + Description (bottom, vertically centered in remaining space) */}
          <div className="flex-1 flex flex-col justify-start px-1 pt-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold text-foreground bg-transparent placeholder-muted focus:outline-none"
              placeholder="제목을 입력하세요"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 text-body-sm text-subtle bg-transparent placeholder-muted focus:outline-none"
              placeholder="글에 대한 짧은 설명을 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <label className="block text-sm font-semibold text-foreground mb-2">
          내용 (Markdown)
        </label>
        <div className="relative flex gap-2">
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} font-mono min-h-[400px] resize-y flex-1`}
            placeholder="Markdown으로 글을 작성하세요..."
          />
          <div className="sticky top-4 self-start shrink-0">
            <MarkdownToolbar
              contentRef={contentRef}
              content={content}
              setContent={setContent}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-card-border">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-5 py-2.5 text-sm font-medium text-subtle hover:text-foreground transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="px-5 py-2.5 border border-secondary text-secondary rounded-lg text-sm font-medium hover:bg-secondary/10 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '임시저장'}
        </button>
        <button
          type="button"
          onClick={() => handleSave('published')}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '발행하기'}
        </button>
      </div>
    </div>
  );
}
