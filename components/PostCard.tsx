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
    <article className="group p-6 bg-card rounded-xl border border-card-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/blog/${slug}`}>
        <time className="text-xs text-muted" dateTime={date}>{date}</time>
        <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-sm text-subtle leading-relaxed line-clamp-2">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded"
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
