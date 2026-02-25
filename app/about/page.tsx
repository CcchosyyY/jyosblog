export const metadata = {
  title: '소개 - Jyo\'s Blog',
  description: '개발자 Jyo의 소개와 블로그 개발 이야기',
};

const TECH_STACK = [
  { name: 'Next.js 15', desc: 'App Router', icon: '▲' },
  { name: 'React 18', desc: 'Server Components', icon: '⚛' },
  { name: 'TypeScript', desc: 'Strict Mode', icon: 'TS' },
  { name: 'Tailwind CSS', desc: 'CSS Variables', icon: '🎨' },
  { name: 'Supabase', desc: 'DB & Auth', icon: '⚡' },
  { name: 'MDX', desc: 'Content', icon: '📝' },
  { name: 'Vercel', desc: 'Deploy', icon: '▼' },
  { name: 'Claude Code', desc: 'AI Pair Programming', icon: '🤖' },
];

const DEV_TIMELINE = [
  {
    date: '2026.02',
    title: '블로그 v2 — 관리자 시스템 & 홈 리디자인',
    items: [
      'Admin Settings 페이지 (블로그 설정 + 카테고리 CRUD)',
      'AdminSidebar / BlogSidebar 컴포넌트 분리',
      'Route Group (with-sidebar) 패턴 적용',
      '홈 화면 리디자인 — Recent 리스트 + Featured 그리드',
      'Quick Memo 기능 (빠른 메모 위젯 + Memos 페이지)',
    ],
  },
  {
    date: '2026.02',
    title: '다크 모드 & UI 전면 개편',
    items: [
      'CSS 변수 기반 테마 시스템 (dark: prefix 미사용)',
      'Pencil 디자인 → 코드 변환 워크플로우 도입',
      'Atomic Design 패턴 (Atom → Molecule → Organism → Page)',
      '관리자 로그인 페이지 다크 테마 리디자인',
    ],
  },
  {
    date: '2026.02',
    title: '블로그 v1 — 기본 구축',
    items: [
      'Next.js 15 App Router + Supabase 기반 블로그 구축',
      '관리자 인증 (timing-safe comparison + 세션 관리)',
      '포스트 CRUD + MDX 렌더링 + 코드 하이라이팅',
      'SEO (sitemap, robots.txt, RSS feed)',
      '검색 기능 + 카테고리/태그 필터링',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="w-28 h-28 rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg">
          J
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">
            Jyo
          </h1>
          <p className="text-subtle mt-1 text-body-lg">
            Developer & Blogger
          </p>
          <p className="text-muted mt-4 text-sm leading-relaxed max-w-lg">
            과정을 기록하고 정리하는 공간입니다. 개발하면서 배운 것들,
            일상의 이야기, 그리고 만들어가는 과정을 이곳에 남기고 있습니다.
          </p>
          <div className="flex items-center gap-4 mt-5 justify-center sm:justify-start">
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
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="bg-card border border-card-border rounded-lg px-4 py-3 hover:border-primary/30 transition-colors"
            >
              <div className="text-lg mb-1">{tech.icon}</div>
              <div className="text-body-sm font-semibold text-foreground">
                {tech.name}
              </div>
              <div className="text-caption-sm text-muted">{tech.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Development Timeline */}
      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-6">
          Development Log
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-card-border" />

          <div className="space-y-8">
            {DEV_TIMELINE.map((entry, i) => (
              <div key={i} className="relative pl-8">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 ${
                    i === 0
                      ? 'border-primary bg-primary/20'
                      : 'border-card-border bg-card'
                  }`}
                />

                <div>
                  <time className="text-caption-sm font-medium text-muted uppercase tracking-wider">
                    {entry.date}
                  </time>
                  <h3 className="text-body-lg font-semibold text-foreground mt-1">
                    {entry.title}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {entry.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-body-sm text-subtle leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-muted mt-1 shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About This Blog */}
      <section className="bg-card border border-card-border rounded-lg p-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          About This Blog
        </h2>
        <p className="text-body-sm text-subtle leading-relaxed">
          이 블로그는 Next.js 15 App Router와 Supabase를 기반으로
          직접 설계하고 만들었습니다. Pencil 디자인 툴로 UI를 먼저 그리고,
          Claude Code와 함께 코드로 옮기는 방식으로 개발하고 있습니다.
          개발 과정의 모든 기록은 블로그 글로 정리할 예정입니다.
        </p>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-card-border">
          <div>
            <div className="text-lg font-bold text-foreground">5+</div>
            <div className="text-caption-sm text-muted">Categories</div>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div>
            <div className="text-lg font-bold text-foreground">MDX</div>
            <div className="text-caption-sm text-muted">Content Format</div>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div>
            <div className="text-lg font-bold text-foreground">SSR</div>
            <div className="text-caption-sm text-muted">Rendering</div>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div>
            <div className="text-lg font-bold text-primary">Live</div>
            <div className="text-caption-sm text-muted">Vercel Deploy</div>
          </div>
        </div>
      </section>
    </div>
  );
}
