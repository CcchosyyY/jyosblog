'use client';

import { useRef } from 'react';
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandList,
  EditorCommandEmpty,
  EditorBubble,
  EditorBubbleItem,
  StarterKit,
  TiptapLink,
  TaskList,
  TaskItem,
  HorizontalRule,
  Placeholder,
  CodeBlockLowlight,
  Youtube,
  Mathematics,
  handleCommandNavigation,
  createSuggestionItems,
  Command,
  renderItems,
  createImageUpload,
  handleImagePaste,
  handleImageDrop,
  useEditor,
  type EditorInstance,
} from 'novel';
import { Markdown } from 'tiptap-markdown';
import 'katex/dist/katex.min.css';
import { common, createLowlight } from 'lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Callout, Details, DetailsSummary, DetailsContent } from '@/lib/editor-extensions';
import { CustomImage, ImageUploadPlaceholder } from '@/lib/editor-image-extension';

const lowlight = createLowlight(common);

// Image upload
const uploadFn = createImageUpload({
  onUpload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  },
  validateFn: (file: File) => {
    if (!file.type.includes('image/')) throw new Error('File type not supported.');
    if (file.size / 1024 / 1024 > 5) throw new Error('File size too big (max 5MB).');
  },
});

// ─── Extensions ───────────────────────────────────────────────

const placeholder = Placeholder.configure({
  placeholder: '/ 를 입력하여 블록 추가...',
  includeChildren: true,
});

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: 'text-link underline underline-offset-2 hover:text-primary transition-colors cursor-pointer',
  },
});

// Image extensions are defined in lib/editor-image-extension.ts
// CustomImage = TiptapImage + NodeView + hover toolbar + align attribute
// ImageUploadPlaceholder = placeholder block for upload UI

const taskList = TaskList.configure({
  HTMLAttributes: { class: 'not-prose pl-2' },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: { class: 'flex items-start my-4' },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: { class: 'mt-4 mb-6 border-t border-card-border' },
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight,
  HTMLAttributes: {
    class: 'rounded-lg bg-surface border border-card-border p-4 font-mono text-sm',
  },
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: 'rounded-lg border border-card-border overflow-hidden',
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: 'math-node',
  },
});

const table = Table.configure({
  resizable: true,
  HTMLAttributes: {
    class: 'table-block',
  },
});

const tableRow = TableRow.configure({
  HTMLAttributes: { class: '' },
});

const tableCell = TableCell.configure({
  HTMLAttributes: { class: 'table-cell-block' },
});

const tableHeader = TableHeader.configure({
  HTMLAttributes: { class: 'table-header-block' },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: { class: 'list-disc list-outside leading-3 -mt-2' },
  },
  orderedList: {
    HTMLAttributes: { class: 'list-decimal list-outside leading-3 -mt-2' },
  },
  listItem: {
    HTMLAttributes: { class: 'leading-normal -mb-2' },
  },
  blockquote: {
    HTMLAttributes: { class: 'border-l-4 border-primary' },
  },
  codeBlock: false,
  code: {
    HTMLAttributes: {
      class: 'rounded-md bg-surface px-1.5 py-1 font-mono font-medium text-primary',
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: { color: 'var(--primary)', width: 4 },
  gapcursor: false,
});

const markdownExtension = Markdown.configure({
  html: true,
  transformPastedText: true,
  transformCopiedText: true,
});

const extensions = [
  starterKit,
  placeholder,
  tiptapLink,
  CustomImage,
  ImageUploadPlaceholder,
  taskList,
  taskItem,
  horizontalRule,
  codeBlockLowlight,
  youtube,
  mathematics,
  table,
  tableRow,
  tableCell,
  tableHeader,
  Callout,
  Details,
  DetailsSummary,
  DetailsContent,
  markdownExtension,
];

// ─── Slash Command Items ──────────────────────────────────────

const suggestionItems = createSuggestionItems([
  // Basic
  {
    title: '텍스트',
    description: '일반 텍스트를 작성합니다.',
    searchTerms: ['text', 'p', 'paragraph', '텍스트', '글'],
    icon: <IconText />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
    },
  },
  {
    title: '제목 1',
    description: '큰 제목',
    searchTerms: ['heading', 'title', 'big', 'large', 'h1', '제목'],
    icon: <IconHeading level={1} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: '제목 2',
    description: '중간 제목',
    searchTerms: ['heading', 'subtitle', 'medium', 'h2', '제목'],
    icon: <IconHeading level={2} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: '제목 3',
    description: '작은 제목',
    searchTerms: ['heading', 'subtitle', 'small', 'h3', '제목'],
    icon: <IconHeading level={3} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },

  // Lists
  {
    title: '글머리 목록',
    description: '글머리 기호 목록',
    searchTerms: ['bullet', 'list', 'unordered', 'point', '목록', '리스트'],
    icon: <IconList />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: '번호 목록',
    description: '번호가 매겨진 목록',
    searchTerms: ['numbered', 'list', 'ordered', '번호', '숫자', '리스트'],
    icon: <IconOrderedList />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: '체크리스트',
    description: '할 일 체크리스트',
    searchTerms: ['todo', 'task', 'check', 'checkbox', '체크', '할일', '투두'],
    icon: <IconCheck />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },

  // Blocks
  {
    title: '인용문',
    description: '인용 블록',
    searchTerms: ['quote', 'blockquote', '인용', '명언'],
    icon: <IconQuote />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').toggleBlockquote().run();
    },
  },
  {
    title: '코드 블록',
    description: '코드 스니펫',
    searchTerms: ['code', 'codeblock', '코드', '프로그래밍'],
    icon: <IconCode />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: '구분선',
    description: '가로 구분선',
    searchTerms: ['divider', 'hr', 'horizontal', '구분', '선', '분리'],
    icon: <IconDivider />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },

  // Media
  {
    title: '이미지',
    description: '이미지 업로드 또는 URL로 추가',
    searchTerms: ['image', 'photo', 'picture', '이미지', '사진', '그림'],
    icon: <IconImage />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: 'imageUploadPlaceholder' })
        .run();
    },
  },
  {
    title: '유튜브',
    description: 'YouTube 영상 임베드',
    searchTerms: ['youtube', 'video', 'embed', '영상', '유튜브', '동영상'],
    icon: <IconYoutube />,
    command: ({ editor, range }) => {
      const url = window.prompt('YouTube URL을 입력하세요:');
      if (url) {
        editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
      }
    },
  },
  {
    title: '링크',
    description: '링크 삽입',
    searchTerms: ['link', 'url', 'href', '링크', '연결'],
    icon: <IconLink />,
    command: ({ editor, range }) => {
      const url = window.prompt('URL을 입력하세요:');
      if (url) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: 'text',
            text: url,
            marks: [{ type: 'link', attrs: { href: url } }],
          })
          .run();
      }
    },
  },

  // Advanced
  {
    title: '표',
    description: '3x3 표 삽입',
    searchTerms: ['table', '표', '테이블', '격자'],
    icon: <IconTable />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: '콜아웃',
    description: '강조 박스 (팁, 경고, 정보)',
    searchTerms: ['callout', 'alert', 'info', 'warning', 'tip', '강조', '알림', '팁', '경고', '정보'],
    icon: <IconCallout />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      editor.commands.insertContent({
        type: 'callout',
        attrs: { type: 'info' },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: '여기에 내용을 입력하세요.' }] }],
      });
    },
  },
  {
    title: '토글',
    description: '접기/펼치기 블록',
    searchTerms: ['toggle', 'collapse', 'details', '접기', '펼치기', '토글', '숨기기'],
    icon: <IconToggle />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      editor.commands.insertContent({
        type: 'details',
        content: [
          { type: 'detailsSummary', content: [{ type: 'text', text: '클릭하여 펼치기' }] },
          { type: 'detailsContent', content: [{ type: 'paragraph' }] },
        ],
      });
    },
  },
  {
    title: '수식',
    description: 'LaTeX 수식 입력',
    searchTerms: ['math', 'latex', 'equation', '수식', '공식', '수학'],
    icon: <IconMath />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      editor.commands.setLatex({ latex: 'E = mc^2' });
    },
  },

  // Blog-specific
  {
    title: '개발일지 템플릿',
    description: '오늘 한 일 / 배운 점 / 내일 할 일',
    searchTerms: ['template', 'devlog', '템플릿', '개발일지', '일지'],
    icon: <IconTemplate />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(
          '<h2>오늘 한 일</h2><ul><li><p></p></li></ul>' +
            '<h2>배운 점</h2><ul><li><p></p></li></ul>' +
            '<h2>내일 할 일</h2><ul><li><p></p></li></ul>'
        )
        .run();
    },
  },
  {
    title: '리뷰 템플릿',
    description: '소개 / 장점 / 단점 / 총평',
    searchTerms: ['template', 'review', '템플릿', '리뷰', '후기'],
    icon: <IconTemplate />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(
          '<h2>소개</h2><p></p>' +
            '<h2>장점</h2><ul><li><p></p></li></ul>' +
            '<h2>단점</h2><ul><li><p></p></li></ul>' +
            '<h2>총평</h2><p></p>'
        )
        .run();
    },
  },
  {
    title: '메모 삽입',
    description: '메모 사이드바 열기',
    searchTerms: ['memo', '메모', '노트'],
    icon: <IconMemo />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.dispatchEvent(new CustomEvent('open-memo-sidebar'));
    },
  },
]);

const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

const allExtensions = [...extensions, slashCommand];

// ─── Icons ────────────────────────────────────────────────────

function IconText() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
    </svg>
  );
}

function IconHeading({ level }: { level: number }) {
  return <span className="text-sm font-bold">H{level}</span>;
}

function IconList() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconOrderedList() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 6H3" /><path d="M21 12H8" /><path d="M21 18H8" /><path d="M3 12v6" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconDivider() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconTable() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function IconCallout() {
  return <span className="text-[16px]">💡</span>;
}

function IconToggle() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconMath() {
  return <span className="text-sm font-mono font-bold">fx</span>;
}

function IconTemplate() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  );
}

function IconMemo() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

// ─── BlockEditor Component ────────────────────────────────────

interface BlockEditorProps {
  initialContent?: string;
  onEditorReady?: (editor: EditorInstance) => void;
  onContentChange?: (markdown: string) => void;
}

export default function BlockEditor({
  initialContent,
  onEditorReady,
  onContentChange,
}: BlockEditorProps) {
  const editorRef = useRef<EditorInstance | null>(null);
  const readyCallbackRef = useRef(onEditorReady);
  const contentChangeRef = useRef(onContentChange);
  readyCallbackRef.current = onEditorReady;
  contentChangeRef.current = onContentChange;

  return (
    <EditorRoot>
      <EditorContent
        className="novel-editor"
        extensions={allExtensions}
        initialContent={undefined}
        onCreate={({ editor }) => {
          editorRef.current = editor;
          if (initialContent) {
            editor.commands.setContent(
              editor.storage.markdown.parser.parse(initialContent)
            );
          }
          readyCallbackRef.current?.(editor);
        }}
        onUpdate={({ editor }) => {
          editorRef.current = editor;
          const md = editor.storage.markdown?.getMarkdown?.();
          if (md) contentChangeRef.current?.(md);
        }}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class:
              'prose dark:prose-invert prose-headings:font-bold focus:outline-none max-w-full min-h-[400px] px-8 py-6',
          },
        }}
      >
        {/* Slash command menu */}
        <EditorCommand className="novel-command-menu z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-xl border border-card-border bg-card px-1 py-2 shadow-xl">
          <EditorCommandEmpty className="px-2 text-sm text-muted">
            결과 없음
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface aria-selected:bg-surface cursor-pointer"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-surface text-foreground">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        {/* Bubble menu */}
        <EditorBubble
          className="flex items-center gap-0.5 rounded-xl border border-card-border bg-card px-1 py-1 shadow-xl"
          tippyOptions={{ duration: 100 }}
        >
          <BubbleButton
            action={(editor) => editor.chain().focus().toggleBold().run()}
            isActive={(editor) => editor.isActive('bold')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </BubbleButton>
          <BubbleButton
            action={(editor) => editor.chain().focus().toggleItalic().run()}
            isActive={(editor) => editor.isActive('italic')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </BubbleButton>
          <BubbleButton
            action={(editor) => editor.chain().focus().toggleStrike().run()}
            isActive={(editor) => editor.isActive('strike')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
            </svg>
          </BubbleButton>
          <div className="w-px h-5 bg-card-border mx-0.5" />
          <BubbleButton
            action={(editor) => editor.chain().focus().toggleCode().run()}
            isActive={(editor) => editor.isActive('code')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          </BubbleButton>
          <BubbleButton
            action={(editor) => {
              const url = window.prompt('URL:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            isActive={(editor) => editor.isActive('link')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </BubbleButton>
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}

function BubbleButton({
  children,
  action,
  isActive,
}: {
  children: React.ReactNode;
  action: (editor: EditorInstance) => void;
  isActive: (editor: EditorInstance) => boolean;
}) {
  const { editor } = useEditor();

  return (
    <EditorBubbleItem
      onSelect={(editor) => action(editor)}
    >
      <button
        type="button"
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          editor && isActive(editor)
            ? 'bg-surface text-foreground'
            : 'text-muted hover:text-foreground hover:bg-surface'
        }`}
      >
        {children}
      </button>
    </EditorBubbleItem>
  );
}
