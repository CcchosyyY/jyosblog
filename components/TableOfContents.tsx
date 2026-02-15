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
      <h4 className="font-semibold text-foreground mb-4">
        목차
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted hover:text-foreground'
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
