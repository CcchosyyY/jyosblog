import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

interface DevlogTimelineProps {
  posts: PostMeta[];
}

export default function DevlogTimeline({ posts }: DevlogTimelineProps) {
  if (posts.length === 0) {
    return (
      <p className="text-muted text-sm py-8 text-center">
        아직 개발일지가 없습니다.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-card-border" />

      <div className="space-y-0">
        {posts.map((post, index) => {
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="relative pl-8 py-4 hover:bg-surface/50 rounded-lg transition-colors">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-[22px] w-[15px] h-[15px] rounded-full border-2 border-card-border bg-card group-hover:border-primary transition-colors ${
                    index === 0
                      ? 'border-primary bg-primary/20'
                      : ''
                  }`}
                >
                  <div
                    className={`absolute inset-[3px] rounded-full ${
                      index === 0 ? 'bg-primary' : 'bg-muted/50'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <span className="text-caption text-muted">
                    {formattedDate}
                  </span>
                  <h3 className="text-body-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-body-sm text-subtle line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-caption-sm font-medium bg-secondary/10 text-secondary rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
