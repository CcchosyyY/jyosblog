'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CATEGORIES } from '@/lib/categories';
import { suggestCategory } from '@/lib/suggest-category';
import type { Post } from '@/lib/supabase';
import type { EditorInstance } from 'novel';
import Image from 'next/image';
import EditorHelpModal from '@/components/EditorHelpModal';
import { markdownToHtml } from '@/lib/markdown-utils';

const BlockEditor = dynamic(() => import('@/components/BlockEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] px-8 py-6">
      <p className="text-sm text-muted">에디터 로딩 중...</p>
    </div>
  ),
});

interface PostEditorProps {
  post?: Post;
  initialMemoId?: string;
  initialTemplate?: string;
  onInsert?: (handler: (content: string) => void) => void;
}

export default function PostEditor({
  post,
  initialMemoId,
  initialTemplate,
  onInsert,
}: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [category, setCategory] = useState(post?.category || 'daily');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCover, setShowCover] = useState(!!post?.thumbnail);
  const [slugEditing, setSlugEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [initialMarkdown, setInitialMarkdown] = useState(
    post?.content || ''
  );

  const editorRef = useRef<EditorInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register insert handler for parent (MemoSidebar)
  const handleInsertContent = useCallback(
    (memoContent: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      const html = markdownToHtml(memoContent);
      editor.chain().focus().insertContent(html).run();
    },
    []
  );

  useEffect(() => {
    onInsert?.(handleInsertContent);
  }, [onInsert, handleInsertContent]);

  // Pre-fill from memo
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
            if (memo.content) setInitialMarkdown(memo.content);
            if (memo.category) setCategory(memo.category);
            if (memo.tags?.length) setTags(memo.tags);
          }
        }
      } catch (error) {
        console.error('Failed to fetch memo:', error);
      }
    };

    fetchMemo();
  }, [initialMemoId, isEditing]);

  // Template
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
      setTags(['devlog']);
      setInitialMarkdown(
        `## 오늘 한 일\n\n- \n\n## 배운 점\n\n- \n\n## 내일 할 일\n\n- \n`
      );
    }
  }, [initialTemplate, isEditing]);

  // Auto-slug
  useEffect(() => {
    if (!isEditing && title && !slugEditing) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 100);
      setSlug(generatedSlug);
    }
  }, [title, isEditing, slugEditing]);

  const handleEditorReady = useCallback((editor: EditorInstance) => {
    editorRef.current = editor;
  }, []);

  const handleContentChange = useCallback(
    (md: string) => {
      if (md.length > 50) {
        const suggested = suggestCategory(md);
        if (suggested !== category) {
          setSuggestedCategory(suggested);
        } else {
          setSuggestedCategory(null);
        }
      }
    },
    [category]
  );

  const getEditorMarkdown = (): string => {
    const editor = editorRef.current;
    if (!editor) return '';
    return editor.storage.markdown.getMarkdown();
  };

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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    const content = getEditorMarkdown();
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

    const postData = {
      title,
      content,
      slug,
      description,
      category,
      tags,
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-lg text-body-sm font-medium mb-4">
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

      {/* Main editor area */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden flex-1 flex flex-col">
        {/* Cover image */}
        {showCover && (
          <div className="relative border-b border-card-border">
            {thumbnail ? (
              <div className="relative group w-full h-48 overflow-hidden">
                <Image
                  src={thumbnail}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    변경
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail('');
                      setShowCover(false);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    삭제
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 w-full h-32 cursor-pointer transition-colors ${
                  isDragOver
                    ? 'bg-primary/5'
                    : 'bg-surface/50 hover:bg-surface'
                }`}
              >
                {uploading ? (
                  <span className="text-sm text-muted">업로드 중...</span>
                ) : (
                  <span className="text-sm text-muted">
                    이미지를 드래그하거나 클릭하여 커버 추가
                  </span>
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
        )}

        {/* Title & Description */}
        <div className="relative px-8 pt-8 pb-0">
          {/* Help button - top right */}
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 text-muted hover:text-foreground hover:bg-surface border border-card-border rounded-full transition-colors"
            title="에디터 사용법"
          >
            <span className="text-xs font-bold">?</span>
          </button>

          {!showCover && (
            <button
              type="button"
              onClick={() => setShowCover(true)}
              className="text-xs text-muted hover:text-foreground transition-colors mb-4 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              커버 추가
            </button>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-foreground bg-transparent placeholder-muted/50 focus:outline-none"
            placeholder="제목을 입력하세요"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 text-body text-muted bg-transparent placeholder-muted/50 focus:outline-none"
            placeholder="글에 대한 짧은 설명을 입력하세요"
          />
        </div>

        {/* Metadata chips */}
        <div className="px-8 py-4 flex flex-wrap items-center gap-2 border-b border-card-border">
          {/* Category */}
          <select
            data-category-select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1 border border-card-border rounded-lg bg-surface text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
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
              className="text-caption-sm text-link hover:text-primary transition-colors"
            >
              추천: {getCategoryName(suggestedCategory)}
            </button>
          )}

          <div className="w-px h-4 bg-card-border" />

          {/* Tags */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface text-xs text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted hover:text-foreground transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="px-2 py-0.5 bg-transparent text-xs text-foreground placeholder-muted focus:outline-none w-20"
            placeholder="+ 태그"
          />

          <div className="w-px h-4 bg-card-border" />

          {/* Slug */}
          <div className="flex items-center gap-1 text-xs text-muted">
            <span>slug:</span>
            {slugEditing ? (
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onBlur={() => setSlugEditing(false)}
                autoFocus
                className="px-1.5 py-0.5 border border-card-border rounded bg-surface text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
            ) : (
              <button
                type="button"
                onClick={() => setSlugEditing(true)}
                className="text-foreground hover:text-primary transition-colors truncate max-w-[200px]"
              >
                {slug || 'auto'}
              </button>
            )}
          </div>
        </div>

        {/* Block Editor */}
        <div className="flex-1">
          <BlockEditor
            initialContent={initialMarkdown}
            onEditorReady={handleEditorReady}
            onContentChange={handleContentChange}
          />
        </div>
      </div>

      {/* Actions - sticky bottom bar */}
      <div className="sticky bottom-0 flex justify-end gap-3 py-4 bg-background">
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
          className="px-5 py-2.5 border border-card-border text-foreground rounded-lg text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50"
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

      <EditorHelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
