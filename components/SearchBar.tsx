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
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="검색..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 pl-10 bg-light/5 border border-light/10 rounded-lg text-light placeholder-light/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light/40"
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
        <div className="absolute z-50 w-full mt-2 bg-dark border border-light/10 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="block px-4 py-3 hover:bg-teal/10 border-b border-light/5 last:border-0 transition-colors"
            >
              <h4 className="font-medium text-light">
                {post.title}
              </h4>
              <p className="text-sm text-light/50 line-clamp-1">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-dark border border-light/10 rounded-lg shadow-lg p-4 text-center text-light/50">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
