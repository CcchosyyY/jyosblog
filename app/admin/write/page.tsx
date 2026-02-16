import PostEditor from '@/components/PostEditor';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ memoId?: string }>;
}

export default async function WritePage({ searchParams }: Props) {
  const { memoId } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-subtle hover:text-foreground transition-colors text-sm font-medium"
            >
              &larr; 뒤로
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              새 글 작성
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-card-border rounded-xl p-6">
          <PostEditor initialMemoId={memoId} />
        </div>
      </main>
    </div>
  );
}
