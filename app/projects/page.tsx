export const metadata = {
  title: 'Projects - Jyo\'s Blog',
  description: '만들고 있는 프로젝트들을 소개합니다.',
};

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: 'active' | 'in-progress';
  github?: string;
  live?: string;
  gradient: string;
}

const PROJECTS: Project[] = [
  {
    id: 'jyos-blog',
    title: "Jyo's Blog",
    description:
      'Next.js 15 App Router와 Supabase를 기반으로 직접 설계하고 만든 개인 블로그.',
    longDescription:
      'Next.js 15 App Router와 Supabase를 기반으로 직접 설계하고 만든 개인 블로그. Pencil 디자인 툴로 UI를 먼저 그리고, Claude Code와 함께 코드로 옮기는 방식으로 개발하고 있습니다.',
    tags: ['Next.js 15', 'Supabase', 'MDX', 'Tailwind'],
    status: 'active',
    github: 'https://github.com/CcchosyyY/MyBlog',
    live: 'https://jyos-blog.vercel.app',
    gradient: 'from-[#B3001B] via-[#135E90] to-[#FAA916]',
  },
  {
    id: 'side-project-1',
    title: 'Side Project',
    description: 'Coming soon \u2014 \uc0c8\ub85c\uc6b4 \ud504\ub85c\uc81d\ud2b8\ub97c \uc900\ube44\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4.',
    longDescription: '',
    tags: ['TBD'],
    status: 'in-progress',
    gradient: 'from-[#135E90] to-[#22C55E]',
  },
  {
    id: 'side-project-2',
    title: 'Another Project',
    description: 'Coming soon \u2014 \uc544\uc774\ub514\uc5b4\ub97c \uad6c\uccb4\ud654\ud558\ub294 \uc911\uc785\ub2c8\ub2e4.',
    longDescription: '',
    tags: ['TBD'],
    status: 'in-progress',
    gradient: 'from-[#FAA916] to-[#B3001B]',
  },
];

function StatusBadge({ status }: { status: Project['status'] }) {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
        isActive
          ? 'bg-green-500/10 text-green-500'
          : 'bg-secondary/10 text-secondary'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-green-500' : 'bg-secondary'
        }`}
      />
      {isActive ? 'Active' : 'In Progress'}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
      <div
        className={`h-[140px] bg-gradient-to-br ${project.gradient}`}
      />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-[13px] text-subtle leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-medium bg-secondary/10 text-secondary rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-muted bg-surface rounded-lg hover:text-foreground transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
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
              Live Site
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const featured = PROJECTS[0];
const others = PROJECTS.slice(1);

export default function ProjectsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section>
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-subtle mt-2 text-sm leading-relaxed max-w-lg">
          만들고 있는 것들. 개발 과정에서 배운 것들을 직접 프로젝트로
          만들어보고 있습니다.
        </p>
      </section>

      {/* Featured */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
          Featured
        </h2>
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div
            className={`h-[200px] bg-gradient-to-br ${featured.gradient}`}
          />
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {featured.title}
              </h3>
              <StatusBadge status={featured.status} />
            </div>
            <p className="text-[13px] text-subtle leading-relaxed">
              {featured.longDescription}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium bg-secondary/10 text-secondary rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              {featured.github && (
                <a
                  href={featured.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-muted bg-surface rounded-lg hover:text-foreground transition-colors"
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
              {featured.live && (
                <a
                  href={featured.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
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
                  Live Site
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
          Other Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
