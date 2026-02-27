'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface AdminPostActionsProps {
  postId: string;
}

export default function AdminPostActions({ postId }: AdminPostActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('이 글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/');
      }
    } catch {
      // silently fail
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 bg-surface/80 backdrop-blur-sm rounded-md text-muted hover:text-red-500 hover:bg-surface transition-all"
      title="삭제"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
