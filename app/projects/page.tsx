import { Suspense } from 'react';
import { getProjects, getDevlogCountByProject } from '@/lib/projects';
import { isAuthenticated } from '@/lib/auth';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import AdminProjectButton from '@/components/AdminProjectButton';
import EmptyState from '@/components/EmptyState';
import { FolderOpen } from 'lucide-react';
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
  isAdmin,
}: {
  status?: string;
  query?: string;
  isAdmin: boolean;
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
      <EmptyState
        icon={<FolderOpen size={48} />}
        title="프로젝트가 없습니다"
        description="아직 등록된 프로젝트가 없거나, 선택한 필터에 해당하는 프로젝트가 없습니다."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          devlogCount={devlogCounts[project.id] || 0}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { status, q } = await searchParams;
  const isAdmin = await isAuthenticated();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Suspense fallback={null}>
          <ProjectFilter />
        </Suspense>
        {isAdmin && <AdminProjectButton />}
      </div>

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
        <ProjectList status={status} query={q} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}
