import Link from 'next/link';
import BlogSidebar from '@/components/BlogSidebar';
import { getAllPosts, getPostCountByCategory } from '@/lib/posts';
import { getCategoryName, getCategoryColor, getCategoryIcon } from '@/lib/categories';

const MOCK_POSTS = [
  {
    slug: 'nextjs-15-app-router',
    title: 'Next.js 15 App Router로 블로그 만들기',
    description:
      'Next.js 15의 App Router를 활용하여 개인 블로그를 처음부터 끝까지 구축하는 과정을 정리했습니다.',
    category: 'dev',
    date: '2026-02-18',
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    slug: 'supabase-auth-session',
    title: 'Supabase로 관리자 인증 시스템 구현하기',
    description:
      '환경변수 기반 비밀번호 비교와 Supabase 세션 테이블을 활용한 간단하고 안전한 관리자 인증 플로우.',
    category: 'dev',
    date: '2026-02-15',
    tags: ['Supabase', 'Auth', 'Security'],
  },
  {
    slug: 'tailwind-dark-mode',
    title: 'CSS 변수로 깔끔한 다크모드 구현',
    description:
      'Tailwind CSS와 CSS 변수를 조합해서 dark: prefix 없이도 자연스럽게 테마가 전환되는 방법.',
    category: 'dev',
    date: '2026-02-12',
    tags: ['Tailwind', 'CSS', 'Dark Mode'],
  },
  {
    slug: 'weekly-cooking-log',
    title: '이번 주 요리 기록',
    description:
      '주말에 만들어 본 된장찌개와 계란말이 레시피 정리. 다음에 또 만들 때 참고하려고 기록.',
    category: 'cooking',
    date: '2026-02-10',
    tags: ['요리', '레시피'],
  },
  {
    slug: 'morning-routine',
    title: '아침 루틴 정리하기',
    description:
      '생산적인 하루를 위해 아침 루틴을 정리해봤습니다. 기상 후 1시간을 어떻게 보내는지 기록.',
    category: 'daily',
    date: '2026-02-08',
    tags: ['일상', '루틴'],
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 실전 팁 모음',
    description:
      '프로젝트에서 자주 쓰는 TypeScript 패턴과 유틸리티 타입을 정리한 실전 팁 모음집.',
    category: 'study',
    date: '2026-02-05',
    tags: ['TypeScript', 'Tips'],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  dev: 'from-cat-dev/20 to-cat-dev/10',
  cooking: 'from-cat-cooking/20 to-cat-cooking/10',
  daily: 'from-cat-daily/20 to-cat-daily/10',
  study: 'from-cat-study/20 to-cat-study/10',
  exercise: 'from-cat-exercise/20 to-cat-exercise/10',
  invest: 'from-cat-invest/20 to-cat-invest/10',
};

const CATEGORY_ICONS: Record<string, string> = {
  dev: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  cooking: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  daily: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707',
  study: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  exercise: 'M13 10V3L4 14h7v7l9-11h-7z',
  invest: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
};

export default async function Home() {
  const postCounts = await getPostCountByCategory();
  const allPosts = await getAllPosts();
  const posts = allPosts.length > 0 ? allPosts : MOCK_POSTS;
  const recentPosts = posts.slice(0, 5);
  const featuredPosts = posts.slice(0, 6);

  return (
    <div className="flex">
      <BlogSidebar postCounts={postCounts} />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
          {/* Recent List */}
          <div className="max-w-2xl">
            <div className="bg-card border border-card-border rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 border-b border-card-border">
                <h2 className="text-caption-sm font-semibold text-muted uppercase tracking-wider">
                  Recent
                </h2>
              </div>
              <ul>
                {recentPosts.map((post, index) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className={`flex items-center justify-between px-4 py-2 group hover:bg-surface/60 transition-all duration-200 ${
                        index !== 0 ? 'border-t border-card-border' : ''
                      }`}
                    >
                      <span className="text-caption text-foreground group-hover:text-primary transition-colors truncate">
                        {post.title}
                      </span>
                      <time className="text-caption-xs text-muted shrink-0 ml-6 tabular-nums">
                        {new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                        {new Date(post.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured Posts Grid */}
          <div>
            <h2 className="text-caption-sm font-semibold text-muted uppercase tracking-wider mb-3">
              Featured
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-card border border-card-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200">
                    {/* Thumbnail */}
                    <div
                      className={`aspect-[16/10] bg-gradient-to-br ${
                        CATEGORY_COLORS[post.category] || 'from-muted/20 to-muted/10'
                      } flex items-center justify-center`}
                    >
                      <svg
                        className="w-8 h-8 text-muted/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={
                            CATEGORY_ICONS[post.category] ||
                            'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                          }
                        />
                      </svg>
                    </div>
                    {/* Content */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex items-center gap-1 text-caption-xs font-medium">
                          <svg
                            className="w-3 h-3 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            style={{ color: getCategoryColor(post.category) }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={getCategoryIcon(post.category)} />
                          </svg>
                          {getCategoryName(post.category)}
                        </span>
                        <span className="text-caption-xs text-muted">
                          {new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                          {new Date(post.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                      </div>
                      <h3 className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-caption-sm text-subtle leading-snug line-clamp-2 min-h-[2.3rem] max-h-[2.3rem] overflow-hidden">
                        {post.description || '\u00A0'}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {post.tags.slice(0, 5).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-1 text-[9px] leading-4 text-muted bg-surface rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
