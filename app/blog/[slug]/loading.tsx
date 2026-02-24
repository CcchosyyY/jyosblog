export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="flex flex-col gap-8">
        {/* Back link skeleton */}
        <div className="h-4 w-20 bg-surface rounded" />

        {/* Title skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-3/4 bg-surface rounded" />
          <div className="flex gap-3">
            <div className="h-3 w-20 bg-surface rounded" />
            <div className="h-5 w-16 bg-surface rounded" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-card-border" />

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-5/6 bg-surface rounded" />
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-2/3 bg-surface rounded" />
          <div className="h-20 w-full bg-surface rounded mt-4" />
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-4/5 bg-surface rounded" />
        </div>
      </div>
    </div>
  );
}
