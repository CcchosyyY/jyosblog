import Link from 'next/link';
import { getCategoryName, getCategoryColor, getCategoryIcon } from '@/lib/categories';

interface PostCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
  category?: string;
}

export default function PostCard({
  title,
  description,
  date,
  slug,
  tags = [],
  category,
}: PostCardProps) {
  return (
    <article className="group h-40 bg-card rounded-lg border border-card-border hover:border-primary/30 transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:scale-[1.03]">
      <Link href={`/blog/${slug}`} className="flex flex-col justify-between h-full p-3.5">
        <div>
          <div className="flex items-center gap-2">
            {category && (
              <span className="flex items-center gap-1 text-caption-xs font-medium">
                <svg
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  style={{ color: getCategoryColor(category) }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={getCategoryIcon(category)} />
                </svg>
                {getCategoryName(category)}
              </span>
            )}
            <time className="text-caption-xs text-muted" dateTime={date}>
              {new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              {new Date(date).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </time>
          </div>
          <h3 className="mt-1.5 text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {title}
          </h3>
          <p className="mt-1.5 text-caption-sm text-subtle leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-caption-xs font-medium bg-secondary/20 text-secondary rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
