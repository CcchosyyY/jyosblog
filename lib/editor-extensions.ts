import { Node, mergeAttributes } from '@tiptap/core';

// Callout extension — renders as a styled div with emoji + content
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('data-callout-type') || 'info',
        renderHTML: (attributes: Record<string, string>) => ({
          'data-callout-type': attributes.type,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        class: 'callout-block',
      }),
      0,
    ];
  },
});

// Toggle/Details extension — collapsible content block
export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary detailsContent',
  defining: true,

  parseHTML() {
    return [{ tag: 'details' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes, { class: 'toggle-block' }),
      0,
    ];
  },
});

export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  group: '',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: 'summary' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return [
      'summary',
      mergeAttributes(HTMLAttributes, { class: 'toggle-summary' }),
      0,
    ];
  },
});

export const DetailsContent = Node.create({
  name: 'detailsContent',
  group: '',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-details-content]' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-details-content': '',
        class: 'toggle-content',
      }),
      0,
    ];
  },
});
