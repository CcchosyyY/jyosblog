import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TiptapImage, UploadImagesPlugin } from 'novel';
import ImageBlockView from '@/components/editor/ImageBlockView';
import ImageUploadView from '@/components/editor/ImageUploadView';

// ─── Custom Image Extension ──────────────────────────────────
// Extends TiptapImage with:
// - Custom React NodeView for hover toolbar
// - align attribute for image alignment
// - Keeps UploadImagesPlugin compatibility

export const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('data-align') || 'center',
        renderHTML: (attributes: Record<string, string>) => ({
          'data-align': attributes.align,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },

  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: 'opacity-40 rounded-lg border border-card-border',
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: 'rounded-lg border border-card-border',
  },
});

// ─── Image Upload Placeholder Node ───────────────────────────
// A transient node that shows the upload UI
// When an image is uploaded, it replaces itself with a real image node

export const ImageUploadPlaceholder = Node.create({
  name: 'imageUploadPlaceholder',
  group: 'block',
  atom: true, // No editable content inside
  draggable: true,
  selectable: true,

  parseHTML() {
    return [{ tag: 'div[data-image-upload-placeholder]' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-image-upload-placeholder': '',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadView);
  },
});
