export default function PostCardSkeleton() {
  return (
    <div className="p-6 bg-card rounded-xl border border-card-border animate-pulse">
      <div className="h-3 w-16 bg-surface rounded" />
      <div className="mt-3 h-5 w-3/4 bg-surface rounded" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full bg-surface rounded" />
        <div className="h-3 w-2/3 bg-surface rounded" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="h-6 w-14 bg-surface rounded-sm" />
        <div className="h-6 w-14 bg-surface rounded-sm" />
      </div>
    </div>
  );
}
