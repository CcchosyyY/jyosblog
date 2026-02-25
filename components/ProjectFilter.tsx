'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
] as const;

export default function ProjectFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';
  const currentQuery = searchParams.get('q') || '';

  function handleFilter(key: string) {
    const params = new URLSearchParams();
    if (key !== 'all') params.set('status', key);
    if (currentQuery) params.set('q', currentQuery);
    const qs = params.toString();
    router.push(qs ? `/projects?${qs}` : '/projects');
  }

  function handleSearch(value: string) {
    const params = new URLSearchParams();
    if (currentStatus !== 'all') params.set('status', currentStatus);
    if (value.trim()) params.set('q', value.trim());
    const qs = params.toString();
    router.push(qs ? `/projects?${qs}` : '/projects');
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex gap-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilter(filter.key)}
            className={`px-3 py-1.5 text-body-sm font-medium rounded-lg transition-colors ${
              currentStatus === filter.key
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:text-foreground hover:bg-surface'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="relative sm:ml-auto">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="프로젝트 검색..."
          defaultValue={currentQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-3 py-1.5 text-body-sm w-48 bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-colors"
        />
      </div>
    </div>
  );
}
