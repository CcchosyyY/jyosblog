import Link from 'next/link';
import BlogSidebar from '@/components/BlogSidebar';
import { getAllPosts, getPostCountByCategory } from '@/lib/posts';
import { getCategoryName } from '@/lib/categories';

const MOCK_POSTS = [
  {
    slug: 'nextjs-15-app-router',
    title: 'Next.js 15 App Router로 블로그 만들기',
    description:
      'Next.js 15의 App Router를 활용하여 개인 블로그를 처음부터 끝까지 구축하는 과정을 정리했습니다. 서버 컴포넌트, 라우팅, 메타데이터 설정 등을 다룹니다.',
    category: 'dev',
    date: '2026-02-18',
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    slug: 'supabase-auth-session',
    title: 'Supabase로 관리자 인증 시스템 구현하기',
    description:
      '환경변수 기반 비밀번호 비교와 Supabase 세션 테이블을 활용한 간단하고 안전한 관리자 인증 플로우를 만들어 봤습니다.',
    category: 'dev',
    date: '2026-02-15',
    tags: ['Supabase', 'Auth', 'Security'],
  },
  {
    slug: 'tailwind-dark-mode',
    title: 'CSS 변수로 깔끔한 다크모드 구현',
    description:
      'Tailwind CSS와 CSS 변수를 조합해서 dark: prefix 없이도 자연스럽게 테마가 전환되는 방법을 소개합니다.',
    category: 'dev',
    date: '2026-02-12',
    tags: ['Tailwind', 'CSS', 'Dark Mode'],
  },
  {
    slug: 'weekly-cooking-log',
    title: '이번 주 요리 기록 - 된장찌개와 계란말이',
    description:
      '주말에 만들어 본 된장찌개와 계란말이 레시피 정리. 다음에 또 만들 때 참고하려고 기록해둡니다.',
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
];

export default async function Home() {
  const postCounts = await getPostCountByCategory();
  const allPosts = await getAllPosts();
  const recentPosts =
    allPosts.length > 0 ? allPosts.slice(0, 5) : MOCK_POSTS;

  return (
    <div className="flex">
      <BlogSidebar postCounts={postCounts} />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-6 pt-10">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Recent
          </h2>
          <ul>
            {recentPosts.map((post, index) => (
              <li
                key={post.slug}
                className={index !== 0 ? 'border-t border-card-border' : ''}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center justify-between py-2.5 group"
                >
                  <span className="text-[13px] text-foreground group-hover:text-primary transition-colors truncate">
                    {post.title}
                  </span>
                  <time className="text-[11px] text-muted shrink-0 ml-6 tabular-nums">
                    {post.date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
