'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ProjectTabsProps {
  overviewContent: ReactNode;
  devlogContent: ReactNode;
  devlogCount: number;
  isAdmin?: boolean;
  projectSlug?: string;
}

export default function ProjectTabs({
  overviewContent,
  devlogContent,
  devlogCount,
  isAdmin = false,
  projectSlug,
}: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'devlog'>(
    'overview'
  );

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="relative flex items-center gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`relative px-4 py-2.5 text-body-sm font-medium rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-muted hover:text-foreground border border-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('devlog')}
          className={`relative px-4 py-2.5 text-body-sm font-medium rounded-lg transition-colors ${
            activeTab === 'devlog'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-muted hover:text-foreground border border-transparent'
          }`}
        >
          DevLog
          <span className="ml-1.5 text-caption text-muted font-normal">
            ({devlogCount})
          </span>
        </button>
        {isAdmin && activeTab === 'devlog' && projectSlug && (
          <Link
            href={`/admin/write?project=${projectSlug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-1.5 text-body-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            새 개발일지
          </Link>
        )}
      </div>

      {/* Tab content */}
      <div className={activeTab === 'overview' ? '' : 'hidden'}>
        {overviewContent}
      </div>
      <div className={activeTab === 'devlog' ? '' : 'hidden'}>
        {devlogContent}
      </div>
    </div>
  );
}
