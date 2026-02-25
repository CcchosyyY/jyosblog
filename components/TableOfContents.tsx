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
    const elements = Array.from(
      document.querySelectorAll('article h1, article h2, article h3')
    ).map((element) => ({
      id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }));

    // Add IDs to headings that don't have them
    document
      .querySelectorAll('article h1, article h2, article h3')
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
    <nav className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto">
      <h4 className="text-caption font-semibold text-muted uppercase tracking-wider mb-4">
        On this page
      </h4>
      <ul className="border-l border-card-border">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1.5 pl-3 -ml-px text-body-sm transition-colors ${
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
