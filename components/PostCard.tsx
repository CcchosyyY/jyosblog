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
    <article className="group p-6 bg-dark rounded-lg border border-light/10 hover:border-teal/50 transition-all duration-200 hover:shadow-lg hover:shadow-teal/5">
      <Link href={`/blog/${slug}`}>
        <time className="text-sm text-light/50">{date}</time>
        <h3 className="mt-2 text-xl font-semibold text-light group-hover:text-teal transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-light/70 line-clamp-2">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-rose/20 text-rose rounded"
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
