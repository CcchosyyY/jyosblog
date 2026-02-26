'use client';

import { useState, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

// ─── Image Upload Placeholder View ───────────────────────────
// Inserted when user selects /image from slash command
// Shows drag-drop zone, file picker, URL input, and close button
// On successful upload/URL → replaces itself with a real image node

export default function ImageUploadView({
  editor,
  node,
  getPos,
  deleteNode,
}: NodeViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace this placeholder node with a real image
  const replaceWithImage = useCallback(
    (src: string) => {
      const pos = getPos();
      if (pos === undefined) return;

      editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .insertContentAt(pos, {
          type: 'image',
          attrs: { src, alt: '', title: '', align: 'center' },
        })
        .run();
    },
    [editor, getPos, node.nodeSize]
  );

  // Upload file to server
  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.includes('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size / 1024 / 1024 > 5) {
        setError('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setError('');
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        replaceWithImage(data.url);
      } catch {
        setError('업로드에 실패했습니다. 다시 시도해주세요.');
        setIsUploading(false);
      }
    },
    [replaceWithImage]
  );

  // Handle URL submission
  const handleUrlSubmit = useCallback(() => {
    const url = urlValue.trim();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('올바른 URL을 입력해주세요.');
      return;
    }

    replaceWithImage(url);
  }, [urlValue, replaceWithImage]);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  // File input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  return (
    <NodeViewWrapper className="image-upload-wrapper" contentEditable={false}>
      <div
        className={`image-upload-placeholder ${isDragging ? 'image-upload-dragging' : ''} ${isUploading ? 'image-upload-loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Close (X) button */}
        <button
          type="button"
          className="image-upload-close"
          onClick={() => deleteNode()}
          title="닫기"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isUploading ? (
          /* Upload progress */
          <div className="image-upload-spinner-container">
            <div className="image-upload-spinner" />
            <p className="image-upload-status">업로드 중...</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="image-upload-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>

            {/* Drag & drop text */}
            <p className="image-upload-text">
              이미지를 드래그하여 놓거나
            </p>

            {/* Action buttons row */}
            <div className="image-upload-actions">
              <button
                type="button"
                className="image-upload-btn-file"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                파일 선택
              </button>
              <button
                type="button"
                className={`image-upload-btn-url ${showUrlInput ? 'image-upload-btn-url-active' : ''}`}
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                URL로 추가
              </button>
            </div>

            {/* URL input field */}
            {showUrlInput && (
              <div className="image-upload-url-row">
                <input
                  type="text"
                  className="image-upload-url-input"
                  placeholder="https://example.com/image.png"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                    if (e.key === 'Escape') {
                      setShowUrlInput(false);
                      setUrlValue('');
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="image-upload-url-submit"
                  onClick={handleUrlSubmit}
                  disabled={!urlValue.trim()}
                >
                  삽입
                </button>
              </div>
            )}

            {/* Error message */}
            {error && <p className="image-upload-error">{error}</p>}
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </NodeViewWrapper>
  );
}
