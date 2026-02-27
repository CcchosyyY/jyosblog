import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/projects';
import { getPostsByProject } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';
import StatusBadge from '@/components/StatusBadge';
import PostCard from '@/components/PostCard';
import ProjectTabs from '@/components/ProjectTabs';
import ProjectOverview from '@/components/ProjectOverview';
import AdminProjectEditButton from '@/components/AdminProjectEditButton';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} - Jyo's Blog`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, devlogs, isAdmin] = await Promise.all([
    getProjectBySlug(slug),
    getPostsByProject(slug),
    isAuthenticated(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted hover:text-foreground transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Projects
      </Link>

      {/* Project header */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {project.title}
            </h1>
            {isAdmin && (
              <AdminProjectEditButton project={project} />
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {project.description && (
          <p className="text-subtle text-sm leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-caption-sm font-medium bg-secondary/10 text-secondary rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2.5">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-body-sm font-medium text-muted bg-surface rounded-lg hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-body-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
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
                  d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                />
              </svg>
              Visit Site
            </a>
          )}
        </div>
      </section>

      {/* Divider */}
      <hr className="border-card-border" />

      {/* Tabs: Overview + DevLog */}
      <ProjectTabs
        overviewContent={<ProjectOverview project={project} />}
        devlogContent={
          devlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devlogs.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  description={post.description || ''}
                  date={post.date}
                  slug={post.slug}
                  tags={post.tags}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm py-8 text-center">
              아직 개발일지가 없습니다.
            </p>
          )
        }
        devlogCount={devlogs.length}
        isAdmin={isAdmin}
        projectSlug={slug}
      />
    </div>
  );
}
