import Link from 'next/link';
import StatusBadge from './StatusBadge';
import type { Project } from '@/lib/supabase';

interface ProjectCardProps {
  project: Project;
  devlogCount?: number;
  latestDate?: string | null;
}

export default function ProjectCard({
  project,
  devlogCount = 0,
  latestDate,
}: ProjectCardProps) {
  const formattedDate = latestDate
    ? new Date(latestDate).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
    : null;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group">
        <div
          className="h-[100px]"
          style={{
            background:
              project.gradient ||
              'linear-gradient(135deg, #135E90, #22C55E)',
          }}
        />
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
  );
}
