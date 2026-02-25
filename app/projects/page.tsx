import { Suspense } from 'react';
import { getProjects, getDevlogCountByProject } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import type { ProjectStatus } from '@/lib/projects';

export const metadata = {
  title: 'Projects - Jyo\'s Blog',
  description: '만들고 있는 프로젝트들을 소개합니다.',
};

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

async function ProjectList({
  status,
  query,
}: {
  status?: string;
  query?: string;
}) {
  const validStatuses: ProjectStatus[] = [
    'active',
    'completed',
    'archived',
  ];
  const filterStatus =
    status && validStatuses.includes(status as ProjectStatus)
      ? (status as ProjectStatus)
      : undefined;

  const [projects, devlogCounts] = await Promise.all([
    getProjects(filterStatus),
    getDevlogCountByProject(),
  ]);

  const filtered = query
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) =>
            t.toLowerCase().includes(query.toLowerCase())
          )
      )
    : projects;

  if (filtered.length === 0) {
    return (
      <p className="text-muted text-sm py-12 text-center">
        프로젝트가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          devlogCount={devlogCounts[project.id] || 0}
        />
      ))}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { status, q } = await searchParams;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <Suspense fallback={null}>
        <ProjectFilter />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-card-border rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-[100px] bg-surface" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface rounded w-2/3" />
                  <div className="h-3 bg-surface rounded w-full" />
                  <div className="h-3 bg-surface rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <ProjectList status={status} query={q} />
      </Suspense>
    </div>
  );
}
