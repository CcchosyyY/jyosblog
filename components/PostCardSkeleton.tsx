export default function PostCardSkeleton() {
  return (
    <div className="h-40 p-3.5 bg-card rounded-lg border border-card-border animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 bg-surface rounded" />
          <div className="h-3 w-20 bg-surface rounded" />
        </div>
        <div className="mt-2 h-4 w-3/4 bg-surface rounded" />
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full bg-surface rounded" />
          <div className="h-3 w-2/3 bg-surface rounded" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-12 bg-surface rounded-sm" />
        <div className="h-5 w-12 bg-surface rounded-sm" />
      </div>
    </div>
  );
}
