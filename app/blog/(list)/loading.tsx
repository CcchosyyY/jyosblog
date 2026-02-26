import PostCardSkeleton from '@/components/PostCardSkeleton';

export default function BlogListLoading() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-7 w-24 bg-surface rounded animate-pulse" />
          <div className="mt-1 h-4 w-16 bg-surface rounded animate-pulse" />
        </div>
        <div className="w-48 h-9 bg-surface rounded-lg animate-pulse" />
      </div>

      {/* Posts grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
