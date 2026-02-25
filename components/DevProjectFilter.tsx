'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import type { PostMeta } from '@/lib/posts';
import type { Project } from '@/lib/supabase';

interface DevProjectFilterProps {
  posts: PostMeta[];
  projects: Project[];
}

export default function DevProjectFilter({ posts, projects }: DevProjectFilterProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const filteredPosts = activeProject
    ? posts.filter((post) => post.project_id === activeProject)
    : posts;

  // Only show projects that have posts
  const projectsWithPosts = projects.filter((project) =>
    posts.some((post) => post.project_id === project.id)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Project Filter Tabs */}
      {projectsWithPosts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveProject(null)}
            className={`px-3 py-1.5 text-caption font-medium rounded-lg transition-colors ${
              activeProject === null
                ? 'bg-primary text-white'
                : 'bg-surface text-subtle hover:text-foreground'
            }`}
          >
            전체
          </button>
          {projectsWithPosts.map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={`px-3 py-1.5 text-caption font-medium rounded-lg transition-colors ${
                activeProject === project.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-subtle hover:text-foreground'
              }`}
            >
              {project.title}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              tags={post.tags}
              category={post.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted">
            이 프로젝트에 작성된 글이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
