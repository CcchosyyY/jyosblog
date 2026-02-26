'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import StatusBadge from './StatusBadge';
import type { PostMeta } from '@/lib/posts';
import type { Project } from '@/lib/supabase';

interface DevProjectFilterProps {
  posts: PostMeta[];
  projects: Project[];
}

export default function DevProjectFilter({
  posts,
  projects,
}: DevProjectFilterProps) {
  // Group posts by project
  const projectGroups = projects
    .filter((p) => posts.some((post) => post.project_id === p.id))
    .map((project) => ({
      project,
      posts: posts.filter((post) => post.project_id === project.id),
    }));

  const ungroupedPosts = posts.filter((post) => !post.project_id);

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(
      projectGroups
        .map((g) => g.project.id)
        .concat(ungroupedPosts.length ? ['ungrouped'] : [])
    )
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {projectGroups.map(({ project, posts: groupPosts }) => {
        const isOpen = openSections.has(project.id);
        return (
          <section key={project.id}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(project.id)}
              className="w-full flex items-center gap-3 py-2 text-left group/header"
            >
              <svg
                className={`w-3 h-3 shrink-0 text-muted transition-transform duration-200 ${
                  isOpen ? 'rotate-90' : ''
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.293 4.293a1 1 0 011.414 0L14 10.586l-6.293 6.293a1 1 0 01-1.414-1.414L11.172 10.586 6.293 5.707a1 1 0 010-1.414z" />
              </svg>
              <svg
                className="w-4 h-4 shrink-0 text-cat-dev"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
              <span className="text-body font-semibold text-foreground group-hover/header:text-primary transition-colors">
                {project.title}
              </span>
              {project.status && (
                <StatusBadge
                  status={
                    project.status as 'active' | 'completed' | 'archived'
                  }
                />
              )}
              <span className="text-caption-sm text-muted">
                ({groupPosts.length})
              </span>
              <div className="flex-1" />
              {/* External links */}
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground transition-colors"
                    title="GitHub"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground transition-colors"
                    title="Live"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </button>
            {/* Description */}
            {isOpen && project.description && (
              <p className="text-caption-sm text-muted ml-6 mb-2">
                {project.description}
              </p>
            )}
            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 pb-2 snap-x snap-mandatory">
                  {groupPosts.map((post) => (
                    <div
                      key={post.slug}
                      className="min-w-[280px] max-w-[280px] shrink-0 snap-start"
                    >
                      <PostCard
                        title={post.title}
                        description={post.description}
                        date={post.date}
                        slug={post.slug}
                        tags={post.tags}
                        category={post.category}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Ungrouped posts */}
      {ungroupedPosts.length > 0 && (
        <section>
          <button
            onClick={() => toggleSection('ungrouped')}
            className="w-full flex items-center gap-3 py-2 text-left group/header"
          >
            <svg
              className={`w-3 h-3 shrink-0 text-muted transition-transform duration-200 ${
                openSections.has('ungrouped') ? 'rotate-90' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.293 4.293a1 1 0 011.414 0L14 10.586l-6.293 6.293a1 1 0 01-1.414-1.414L11.172 10.586 6.293 5.707a1 1 0 010-1.414z" />
            </svg>
            <svg
              className="w-4 h-4 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <span className="text-body font-semibold text-foreground group-hover/header:text-primary transition-colors">
              기타 글
            </span>
            <span className="text-caption-sm text-muted">
              ({ungroupedPosts.length})
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.has('ungrouped')
                ? 'max-h-[500px] opacity-100 mt-2'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2 snap-x snap-mandatory">
                {ungroupedPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="min-w-[280px] max-w-[280px] shrink-0 snap-start"
                  >
                    <PostCard
                      title={post.title}
                      description={post.description}
                      date={post.date}
                      slug={post.slug}
                      tags={post.tags}
                      category={post.category}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">작성된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
