import type { Project } from '@/lib/supabase';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TechStackGrid from '@/components/TechStackGrid';
import ScreenshotGallery from '@/components/ScreenshotGallery';
import KeyMetrics from '@/components/KeyMetrics';

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const hasDescription = !!project.long_description;
  const hasTechStack = project.tech_stack && project.tech_stack.length > 0;
  const hasScreenshots = project.screenshots && project.screenshots.length > 0;
  const hasMetrics = project.key_metrics && project.key_metrics.length > 0;
  const hasAnyContent =
    hasDescription || hasTechStack || hasScreenshots || hasMetrics;

  if (!hasAnyContent) {
    return (
      <p className="text-muted text-sm py-8 text-center">
        아직 프로젝트 소개가 작성되지 않았습니다.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {hasDescription && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">소개</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none text-subtle">
            <MarkdownRenderer content={project.long_description!} />
          </div>
        </section>
      )}

      {hasTechStack && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            기술 스택
          </h3>
          <TechStackGrid items={project.tech_stack} />
        </section>
      )}

      {hasScreenshots && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            스크린샷
          </h3>
          <ScreenshotGallery images={project.screenshots} />
        </section>
      )}

      {hasMetrics && (
        <section>
          <KeyMetrics items={project.key_metrics} />
        </section>
      )}
    </div>
  );
}
