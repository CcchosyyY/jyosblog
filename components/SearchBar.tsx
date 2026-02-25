'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  slug: string;
  date: string;
}

interface SearchBarProps {
  posts: SearchResult[];
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, posts]);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          aria-label="블로그 글 검색"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-1.5 pl-8 bg-surface border border-card-border rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && query && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-card-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="block px-4 py-2.5 hover:bg-primary/10 border-b border-card-border last:border-0 transition-colors"
            >
              <h4 className="text-sm font-medium text-foreground">
                {post.title}
              </h4>
              <p className="text-xs text-muted line-clamp-1">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-card-border rounded-lg shadow-lg p-4 text-center text-muted text-sm">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
