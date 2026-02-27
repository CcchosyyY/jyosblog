'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { Project } from '@/lib/supabase';

interface AdminProjectModalProps {
  project?: Project | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminProjectModal({
  project,
  onClose,
  onSave,
}: AdminProjectModalProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [id, setId] = useState(project?.id || '');
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(
    project?.description || ''
  );
  const [longDescription, setLongDescription] = useState(
    project?.long_description || ''
  );
  const [tagsInput, setTagsInput] = useState(
    project?.tags?.join(', ') || ''
  );
  const [status, setStatus] = useState<'active' | 'completed' | 'archived'>(
    project?.status || 'active'
  );
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '');
  const [liveUrl, setLiveUrl] = useState(project?.live_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      id: isEdit ? project.id : id,
      title,
      description: description || null,
      long_description: longDescription || null,
      tags,
      status,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
    };

    try {
      const res = await fetch('/api/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save project');
        setSaving(false);
        return;
      }

      router.refresh();
      onSave();
    } catch {
      setError('Failed to save project');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-card-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-card-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? '프로젝트 수정' : '새 프로젝트'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-foreground transition-colors rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-body-sm font-medium text-foreground mb-1">
                ID (slug)
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="my-project"
                required
                className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Long Description
            </label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Next.js, React, TypeScript"
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as 'active' | 'completed' | 'archived'
                )
              }
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-foreground mb-1">
              Live URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-body-sm bg-surface border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-body-sm font-medium text-muted hover:text-foreground bg-surface border border-card-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-body-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
