'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminProjectModal from './AdminProjectModal';

export default function AdminProjectButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        새 프로젝트
      </button>
      {showModal && (
        <AdminProjectModal
          project={null}
          onClose={() => setShowModal(false)}
          onSave={() => setShowModal(false)}
        />
      )}
    </>
  );
}
