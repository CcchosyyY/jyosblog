'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

// ─── Image Block View ─────────────────────────────────────────
// Rendered as NodeView for existing images (with src)
// Shows hover toolbar with delete / alignment controls

export default function ImageBlockView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) || '';
  const title = (node.attrs.title as string) || '';
  const align = (node.attrs.align as string) || 'center';

  const alignmentClass =
    align === 'left'
      ? 'mr-auto'
      : align === 'right'
        ? 'ml-auto'
        : 'mx-auto';

  return (
    <NodeViewWrapper
      className="image-block-wrapper"
      data-drag-handle=""
    >
      <div
        className={`image-block-container ${alignmentClass}`}
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        {/* Image */}
        <img
          src={src}
          alt={alt}
          title={title}
          className={`image-block-img ${selected ? 'image-block-selected' : ''}`}
          draggable={false}
        />

        {/* Hover toolbar overlay */}
        {showToolbar && (
          <div className="image-block-toolbar">
            {/* Alignment buttons */}
            <button
              type="button"
              className={`image-toolbar-btn ${align === 'left' ? 'image-toolbar-btn-active' : ''}`}
              onClick={() => updateAttributes({ align: 'left' })}
              title="왼쪽 정렬"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="17" y1="10" x2="3" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="17" y1="18" x2="3" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={`image-toolbar-btn ${align === 'center' ? 'image-toolbar-btn-active' : ''}`}
              onClick={() => updateAttributes({ align: 'center' })}
              title="가운데 정렬"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="10" x2="6" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="18" y1="18" x2="6" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={`image-toolbar-btn ${align === 'right' ? 'image-toolbar-btn-active' : ''}`}
              onClick={() => updateAttributes({ align: 'right' })}
              title="오른쪽 정렬"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="21" y1="10" x2="7" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="21" y1="18" x2="7" y2="18" />
              </svg>
            </button>

            {/* Divider */}
            <div className="image-toolbar-divider" />

            {/* Delete button */}
            <button
              type="button"
              className="image-toolbar-btn image-toolbar-btn-danger"
              onClick={() => deleteNode()}
              title="이미지 삭제"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
