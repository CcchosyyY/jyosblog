'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import { suggestCategory } from '@/lib/suggest-category';
import type { Post } from '@/lib/supabase';

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [category, setCategory] = useState(post?.category || 'daily');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    };

    try {
      const res = await fetch('/api/posts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...postData, id: post.id } : postData),
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
    <div className="space-y-6">
      {error && (
        <div className="bg-rose/10 border border-rose/30 text-rose p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="글 제목을 입력하세요"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          슬러그 (URL)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="url-friendly-slug"
        />
        <p className="mt-1 text-xs text-light/40">
          /blog/{slug || 'your-slug'}
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          설명
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="글에 대한 짧은 설명"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          내용 (Markdown)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent font-mono"
          placeholder="Markdown으로 글을 작성하세요..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          카테고리
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {suggestedCategory && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-light/50">
              추천 카테고리:
            </span>
            <button
              type="button"
              onClick={() => {
                setCategory(suggestedCategory);
                setSuggestedCategory(null);
              }}
              className="text-sm text-teal hover:text-rose transition-colors"
            >
              {getCategoryName(suggestedCategory)} 로 변경
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-light/70 mb-1">
          태그
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-light/20 rounded-md bg-light/5 text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
          placeholder="태그1, 태그2, 태그3 (쉼표로 구분)"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-light/10">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-light/70 hover:text-light transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="px-4 py-2 border border-light/20 rounded-md text-light/70 hover:bg-light/5 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '임시저장'}
        </button>
        <button
          type="button"
          onClick={() => handleSave('published')}
          disabled={saving}
          className="px-4 py-2 bg-teal text-light rounded-md hover:bg-teal/80 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '발행하기'}
        </button>
      </div>
    </div>
  );
}
