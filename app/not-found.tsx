import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-subtle">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
