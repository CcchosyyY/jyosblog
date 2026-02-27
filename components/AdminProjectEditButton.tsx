'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import AdminProjectModal from './AdminProjectModal';
import type { Project } from '@/lib/supabase';

interface AdminProjectEditButtonProps {
  project: Project;
}

export default function AdminProjectEditButton({
  project,
}: AdminProjectEditButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 bg-surface/80 backdrop-blur-sm rounded-md text-muted hover:bg-surface hover:text-primary transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </button>
      {showModal && (
        <AdminProjectModal
          project={project}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        />
      )}
    </>
  );
}
