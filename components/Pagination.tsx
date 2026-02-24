import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== 'ellipsis'
    ) {
      pages.push('ellipsis');
    }
  }

  const href = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="p-2 rounded-lg text-subtle hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Previous page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-muted/40">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-muted"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary text-white'
                : 'text-subtle hover:text-foreground hover:bg-surface'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="p-2 rounded-lg text-subtle hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Next page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-muted/40">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      )}
    </nav>
  );
}
