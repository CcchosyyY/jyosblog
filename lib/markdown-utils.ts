import { marked } from 'marked';

export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
