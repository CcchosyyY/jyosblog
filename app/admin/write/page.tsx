import PostEditor from '@/components/PostEditor';
import Link from 'next/link';

export default function WritePage() {
  return (
    <div className="min-h-screen bg-dark">
      <header className="bg-dark border-b border-light/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-light/50 hover:text-teal transition-colors"
            >
              &larr; 뒤로
            </Link>
            <h1 className="text-2xl font-bold text-light">
              새 글 작성
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-light/5 border border-light/10 rounded-lg p-6">
          <PostEditor />
        </div>
      </main>
    </div>
  );
}
