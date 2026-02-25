import Link from 'next/link';

interface PostCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
}

export default function PostCard({
  title,
  description,
  date,
  slug,
  tags = [],
}: PostCardProps) {
  return (
    <article className="group p-3.5 bg-card rounded-lg border border-card-border hover:border-primary/30 transition-all duration-200 hover:shadow-md hover:shadow-primary/5">
      <Link href={`/blog/${slug}`}>
        <time className="text-caption-xs text-muted" dateTime={date}>{date}</time>
        <h3 className="mt-1.5 text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="mt-1.5 text-caption-sm text-subtle leading-relaxed line-clamp-2">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
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
