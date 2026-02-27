'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SearchX } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

interface SearchPost {
  title: string;
  description: string;
  slug: string;
  category: string;
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [results, setResults] = useState<SearchPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (posts.length === 0) {
        fetch('/api/search')
          .then((res) => res.json())
          .then((data) => setPosts(Array.isArray(data) ? data : []))
          .catch(() => {});
      }
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen, posts.length]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    );
    setSelectedIndex(0);
  }, [query, posts]);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = useCallback(
    (slug: string) => {
      close();
      router.push(`/blog/${slug}`);
    },
    [close, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].slug);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-lg bg-card border border-card-border rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-caption-xs font-medium text-muted bg-surface rounded border border-card-border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {query && (
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              results.map((post, i) => (
                <button
                  key={post.slug}
                  onClick={() => navigate(post.slug)}
                  className={`w-full text-left px-4 py-3 border-b border-card-border last:border-0 transition-colors ${
                    i === selectedIndex
                      ? 'bg-primary/10'
                      : 'hover:bg-surface/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-caption-xs font-medium text-primary">
                      {post.category}
                    </span>
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </h4>
                  </div>
                  {post.description && (
                    <p className="mt-0.5 text-xs text-muted line-clamp-1">
                      {post.description}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <EmptyState
                icon={<SearchX size={36} />}
                title="검색 결과가 없습니다"
                description="다른 키워드로 검색해 보세요."
                className="py-8"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
