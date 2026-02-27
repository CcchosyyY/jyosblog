'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import AdminProjectModal from './AdminProjectModal';
import type { Project } from '@/lib/supabase';

interface ProjectCardProps {
  project: Project;
  devlogCount?: number;
  latestDate?: string | null;
  isAdmin?: boolean;
}

export default function ProjectCard({
  project,
  devlogCount = 0,
  latestDate,
  isAdmin = false,
}: ProjectCardProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const formattedDate = latestDate
    ? new Date(latestDate).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
    : null;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('이 프로젝트를 삭제하시겠습니까?')) return;

    const res = await fetch(`/api/projects?id=${project.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <div className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group relative">
          <div
            className="h-[100px]"
            style={{
              background:
                project.gradient ||
                'linear-gradient(135deg, #135E90, #22C55E)',
            }}
          />
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                className="p-1.5 bg-surface/80 backdrop-blur-sm rounded-md text-muted hover:bg-surface hover:text-primary transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 bg-surface/80 backdrop-blur-sm rounded-md text-muted hover:bg-surface hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-body-sm text-subtle leading-relaxed line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center gap-3 pt-1 text-caption text-muted">
              {devlogCount > 0 && (
                <span>Devlog {devlogCount}개</span>
              )}
              {formattedDate && (
                <span>최근 {formattedDate}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      {showEditModal && (
        <AdminProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSave={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
