import { getQuickMemos } from '@/lib/quick-memos';
import MemoList from './MemoList';

export const metadata = {
  title: 'Memos - MyBlog',
  description: '빠른 메모 모음',
};

export default async function MemosPage() {
  const memos = await getQuickMemos(50);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold text-foreground mb-2">
          Memos
        </h1>
        <p className="text-subtle text-sm">
          Quick notes and thoughts.
        </p>
      </header>

      <MemoList initialMemos={memos} />
    </div>
  );
}
