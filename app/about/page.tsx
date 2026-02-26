import Link from 'next/link';
import { getPublishedPostCount } from '@/lib/posts';
import { getProjects } from '@/lib/projects';
import {
  CATEGORIES,
  getCategoryColor,
  getCategoryIcon,
} from '@/lib/categories';

export const metadata = {
  title: '소개 - Jyo\'s Blog',
  description: '개발자 Jyo의 소개와 블로그 이야기',
};

const TECH_STACK = [
  { name: 'Next.js 15', icon: '▲' },
  { name: 'React', icon: '⚛' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'MDX', icon: '📝' },
  { name: 'Vercel', icon: '▼' },
  { name: 'Claude Code', icon: '🤖' },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  dev: '개발하며 배운 것들과 기술적 경험을 정리합니다',
  daily: '일상의 소소한 이야기와 생각들을 기록합니다',
  cooking: '직접 만든 요리와 레시피를 공유합니다',
  study: '공부하며 정리한 내용을 기록합니다',
  exercise: '운동 루틴과 건강 관리 이야기를 남깁니다',
  invest: '투자 공부와 경제적 관점을 정리합니다',
};

export default async function AboutPage() {
  const [postCount, projects] = await Promise.all([
    getPublishedPostCount(),
    getProjects(),
  ]);

  const projectCount = projects.length;
  const categoryCount = CATEGORIES.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. Hero */}
      <section className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-foreground">Jyos</h1>
        <p className="text-subtle text-body-lg mt-1">
          만들고, 기록하고, 공유합니다
        </p>
        <p className="text-muted text-sm leading-relaxed mt-4 max-w-md">
          개발, 일상, 요리, 운동, 투자 — 다양한 관심사를 기록하는 공간입니다.
          과정을 남기고 정리하면서 조금씩 성장해가고 있습니다.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <a
            href="https://github.com/CcchosyyY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-card-border rounded-lg text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:chosangyun.dev@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-card border border-card-border rounded-lg text-foreground hover:border-primary/40 hover:text-primary transition-colors"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </a>
        </div>
      </section>

      {/* 2. About This Blog */}
      <section className="bg-card border border-card-border rounded-xl p-6 sm:p-8">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          About This Blog
        </h2>
        <p className="text-body-sm text-subtle leading-relaxed">
          이 블로그는 Next.js 15 App Router와 Supabase를 기반으로 직접 설계하고
          만들었습니다. Pencil 디자인 툴로 UI를 먼저 그리고, Claude Code와 함께
          코드로 옮기는 방식으로 개발하고 있습니다.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-card-border">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {postCount}
            </div>
            <div className="text-caption-sm text-muted mt-0.5">게시글</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {projectCount}
            </div>
            <div className="text-caption-sm text-muted mt-0.5">프로젝트</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">
              {categoryCount}
            </div>
            <div className="text-caption-sm text-muted mt-0.5">카테고리</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">2026.02</div>
            <div className="text-caption-sm text-muted mt-0.5">Since</div>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-6">
          이런 것들을 씁니다
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.id}`}
              className="group flex items-start gap-3 p-4 bg-card border border-card-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: `color-mix(in srgb, ${getCategoryColor(cat.id)} 15%, transparent)`,
                }}
              >
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: getCategoryColor(cat.id) }}
                >
                  <path d={getCategoryIcon(cat.id)} />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </div>
                <div className="text-caption-sm text-muted mt-0.5 leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[cat.id] || ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Philosophy */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
          기록에 대한 생각
        </h2>
        <blockquote className="border-l-2 border-primary pl-4 text-subtle italic text-body-lg leading-relaxed">
          &ldquo;완벽하지 않아도 기록하는 것 자체에 가치가 있다고
          생각합니다.&rdquo;
        </blockquote>
        <div className="space-y-4 text-body-sm text-subtle leading-relaxed">
          <p>
            처음에는 개발 공부를 정리하려고 블로그를 시작했습니다. 그런데 글을
            쓰다 보니 개발뿐 아니라 일상의 여러 관심사들도 함께 기록하고
            싶어졌습니다. 요리를 하면서 느낀 것, 운동하며 깨달은 것, 투자를
            공부하며 정리한 것 — 결국 모든 경험이 연결되어 있다는 걸
            알게 됐습니다.
          </p>
          <p>
            완성된 결과보다 과정을 남기는 데 집중합니다. 시행착오도, 실패도,
            작은 발견도 모두 기록할 가치가 있다고 믿습니다. 이 블로그는 그런
            기록들이 쌓이는 곳입니다.
          </p>
        </div>
      </section>

      {/* 5. Tech Stack */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption-sm font-medium bg-card border border-card-border rounded-full text-subtle hover:border-primary/30 hover:text-foreground transition-colors"
            >
              <span>{tech.icon}</span>
              {tech.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
