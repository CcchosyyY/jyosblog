'use client';

import { useState, useEffect } from 'react';

interface ViewCounterProps {
  postId: string;
}

function getOrCreateViewerHash(): string {
  const key = 'viewer_hash';
  let hash = localStorage.getItem(key);
  if (!hash) {
    hash = crypto.randomUUID();
    localStorage.setItem(key, hash);
  }
  return hash;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const viewerHash = getOrCreateViewerHash();

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, viewerHash }),
    })
      .then(() => fetch(`/api/views?postId=${postId}`))
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => {});
  }, [postId]);

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      {count}
    </span>
  );
}
