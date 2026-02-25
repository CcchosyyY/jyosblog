'use client';

import { RefObject } from 'react';

interface MarkdownToolbarProps {
  contentRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: (content: string) => void;
}

interface ToolbarAction {
  icon: React.ReactNode;
  title: string;
  action: (
    textarea: HTMLTextAreaElement,
    content: string,
    setContent: (c: string) => void
  ) => void;
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  content: string,
  setContent: (c: string) => void,
  before: string,
  after: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.substring(start, end) || placeholder;
  const newContent =
    content.substring(0, start) + before + selected + after + content.substring(end);
  setContent(newContent);
  setTimeout(() => {
    textarea.focus();
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    textarea.selectionStart = cursorStart;
    textarea.selectionEnd = cursorEnd;
  }, 0);
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  content: string,
  setContent: (c: string) => void,
  text: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newContent =
    content.substring(0, start) + text + content.substring(end);
  setContent(newContent);
  setTimeout(() => {
    textarea.focus();
    const cursor = start + text.length;
    textarea.selectionStart = cursor;
    textarea.selectionEnd = cursor;
  }, 0);
}

function prefixLine(
  textarea: HTMLTextAreaElement,
  content: string,
  setContent: (c: string) => void,
  prefix: string
) {
  const start = textarea.selectionStart;
  const lineStart = content.lastIndexOf('\n', start - 1) + 1;
  const newContent =
    content.substring(0, lineStart) + prefix + content.substring(lineStart);
  setContent(newContent);
  setTimeout(() => {
    textarea.focus();
    const cursor = start + prefix.length;
    textarea.selectionStart = cursor;
    textarea.selectionEnd = cursor;
  }, 0);
}

const TOOLBAR_GROUPS: (ToolbarAction | 'divider')[][] = [
  [
    {
      icon: <span className="text-caption-sm font-bold">H1</span>,
      title: '제목 1',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '# '),
    },
    {
      icon: <span className="text-caption-sm font-bold">H2</span>,
      title: '제목 2',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '## '),
    },
    {
      icon: <span className="text-caption-sm font-bold">H3</span>,
      title: '제목 3',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '### '),
    },
  ],
  [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      ),
      title: '굵게 (Bold)',
      action: (ta, c, sc) => wrapSelection(ta, c, sc, '**', '**', '굵은 텍스트'),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      ),
      title: '기울임 (Italic)',
      action: (ta, c, sc) => wrapSelection(ta, c, sc, '*', '*', '기울임 텍스트'),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4H9a3 3 0 0 0-2.83 4" />
          <path d="M14 12a4 4 0 0 1 0 8H6" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      ),
      title: '취소선 (Strikethrough)',
      action: (ta, c, sc) => wrapSelection(ta, c, sc, '~~', '~~', '취소선 텍스트'),
    },
  ],
  [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      title: '링크',
      action: (ta, c, sc) => {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = c.substring(start, end);
        if (selected) {
          wrapSelection(ta, c, sc, '[', '](url)', '');
        } else {
          insertAtCursor(ta, c, sc, '[링크 텍스트](url)');
        }
      },
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      title: '이미지',
      action: (ta, c, sc) => insertAtCursor(ta, c, sc, '![대체 텍스트](이미지URL)'),
    },
  ],
  [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      title: '목록',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '- '),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      ),
      title: '번호 목록',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '1. '),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 6h9" />
          <path d="M11 12h9" />
          <path d="M12 18h8" />
          <path d="M3 8l2 2 4-4" />
          <path d="M4 11.5l1.5 1.5 3-3" />
          <rect x="3" y="15" width="4" height="4" rx="1" />
        </svg>
      ),
      title: '체크리스트',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '- [ ] '),
    },
  ],
  [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 6H3" />
          <path d="M21 12H8" />
          <path d="M21 18H8" />
          <path d="M3 12v6" />
        </svg>
      ),
      title: '인용문',
      action: (ta, c, sc) => prefixLine(ta, c, sc, '> '),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: '인라인 코드',
      action: (ta, c, sc) => wrapSelection(ta, c, sc, '`', '`', '코드'),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 9.5 8 12l2 2.5" />
          <path d="m14 9.5 2 2.5-2 2.5" />
          <rect x="2" y="3" width="20" height="18" rx="2" />
        </svg>
      ),
      title: '코드 블록',
      action: (ta, c, sc) =>
        wrapSelection(ta, c, sc, '```\n', '\n```', '코드를 입력하세요'),
    },
  ],
  [
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      title: '구분선',
      action: (ta, c, sc) => insertAtCursor(ta, c, sc, '\n---\n'),
    },
  ],
];

export default function MarkdownToolbar({
  contentRef,
  content,
  setContent,
}: MarkdownToolbarProps) {
  const handleAction = (action: ToolbarAction['action']) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    action(textarea, content, setContent);
  };

  return (
    <div className="flex flex-col gap-0.5 p-1.5 bg-card border border-card-border rounded-xl shadow-sm">
      {TOOLBAR_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && (
            <div className="h-px bg-card-border my-1" />
          )}
          <div className="flex flex-col gap-0.5">
            {group.map((item, ii) => {
              if (item === 'divider') return null;
              return (
                <button
                  key={ii}
                  type="button"
                  title={item.title}
                  onClick={() => handleAction(item.action)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
