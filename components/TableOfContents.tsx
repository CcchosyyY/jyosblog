'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const selector = 'article .prose h2, article .prose h3, article [data-toc]';
    const elements = Array.from(
      document.querySelectorAll(selector)
    ).map((element) => ({
      id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }));

    // Add IDs to headings that don't have them
    document
      .querySelectorAll(selector)
      .forEach((element) => {
        if (!element.id) {
          element.id =
            element.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        }
      });

    setHeadings(elements);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-[max(1rem,calc(50%-39rem))] top-40 w-52 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
      <h4 className="text-caption-sm font-semibold text-muted uppercase tracking-wider mb-3">
        On this page
      </h4>
      <ul className="border-l border-card-border">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 10}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 pl-2.5 -ml-px text-caption transition-colors line-clamp-2 ${
                activeId === heading.id
                  ? 'text-primary font-medium border-l-2 border-primary'
                  : 'text-muted hover:text-foreground border-l-2 border-transparent'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
