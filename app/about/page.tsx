export const metadata = {
  title: '소개 - MyBlog',
  description: '블로그 소개 페이지',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-light mb-4">
          About
        </h1>
      </header>

      <div className="prose prose-invert prose-teal max-w-none">
        {/* Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 not-prose">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal to-rose flex items-center justify-center text-light text-4xl font-bold">
            M
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-light">
              Blog Owner
            </h2>
            <p className="text-light/70 mt-2">
              개발과 일상을 기록하는 블로거
            </p>
          </div>
        </div>

        <h2>안녕하세요!</h2>
        <p>
          여러 일들의 과정이나 내가 했던 일들을 정리하는 공간입니다.
          개발하면서 배운 것들, 일상의 기록, 그리고 다양한 생각들을 이곳에 남기고 있습니다.
        </p>

        <h2>이 블로그에서는</h2>
        <ul>
          <li>개발 학습 내용과 프로젝트 경험</li>
          <li>일상의 소소한 이야기들</li>
          <li>책, 영화 등 콘텐츠 감상</li>
          <li>생각 정리 및 회고</li>
        </ul>

        <h2>기술 스택</h2>
        <p>이 블로그는 다음 기술로 만들어졌습니다:</p>
        <ul>
          <li><strong>Next.js 14</strong> - React 기반 프레임워크</li>
          <li><strong>TypeScript</strong> - 타입 안정성</li>
          <li><strong>Tailwind CSS</strong> - 스타일링</li>
          <li><strong>MDX</strong> - 콘텐츠 작성</li>
          <li><strong>Vercel</strong> - 배포</li>
        </ul>

        <h2>Contact</h2>
        <p>
          궁금한 점이나 피드백은 언제든 환영합니다!
        </p>
        <ul>
          <li>
            GitHub:{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com
            </a>
          </li>
          <li>
            Email:{' '}
            <a href="mailto:contact@example.com">contact@example.com</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
