'use client';

import { useState, type ReactNode } from 'react';

const HELP_SECTIONS = [
  {
    title: '기본 블록',
    items: [
      { ko: '/텍스트', en: '/text', desc: '일반 텍스트 작성' },
      { ko: '/제목 1', en: '/heading 1', desc: '큰 제목 (H1)' },
      { ko: '/제목 2', en: '/heading 2', desc: '중간 제목 (H2)' },
      { ko: '/제목 3', en: '/heading 3', desc: '작은 제목 (H3)' },
    ],
  },
  {
    title: '목록',
    items: [
      { ko: '/글머리 목록', en: '/bullet list', desc: '글머리 기호 목록' },
      { ko: '/번호 목록', en: '/numbered list', desc: '번호가 매겨진 목록' },
      { ko: '/체크리스트', en: '/checklist', desc: '할 일 체크리스트' },
    ],
  },
  {
    title: '블록',
    items: [
      { ko: '/인용문', en: '/quote', desc: '인용 블록' },
      { ko: '/코드 블록', en: '/code block', desc: '코드 스니펫 (구문 하이라이팅)' },
      { ko: '/구분선', en: '/divider', desc: '가로 구분선' },
      { ko: '/콜아웃', en: '/callout', desc: '강조 박스 (팁, 경고, 정보)' },
      { ko: '/토글', en: '/toggle', desc: '접기/펼치기 블록' },
    ],
  },
  {
    title: '미디어',
    items: [
      { ko: '/이미지', en: '/image', desc: '이미지 업로드 (드래그/붙여넣기 가능)' },
      { ko: '/유튜브', en: '/youtube', desc: 'YouTube 영상 임베드' },
      { ko: '/링크', en: '/link', desc: '링크 삽입' },
    ],
  },
  {
    title: '고급',
    items: [
      { ko: '/표', en: '/table', desc: '3x3 표 삽입 (컬럼 리사이즈 가능)' },
      { ko: '/수식', en: '/math', desc: 'LaTeX 수식 입력' },
    ],
  },
  {
    title: '템플릿',
    items: [
      { ko: '/개발일지 템플릿', en: '/devlog template', desc: '오늘 한 일 / 배운 점 / 내일 할 일' },
      { ko: '/리뷰 템플릿', en: '/review template', desc: '소개 / 장점 / 단점 / 총평' },
      { ko: '/메모 삽입', en: '/insert memo', desc: '메모 사이드바에서 선택 삽입' },
    ],
  },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'B'], desc: '굵게' },
  { keys: ['Ctrl', 'I'], desc: '기울임' },
  { keys: ['Ctrl', 'U'], desc: '밑줄' },
  { keys: ['Ctrl', 'Shift', 'X'], desc: '취소선' },
  { keys: ['Ctrl', 'E'], desc: '인라인 코드' },
  { keys: ['Ctrl', 'K'], desc: '링크' },
  { keys: ['Ctrl', 'Shift', '8'], desc: '글머리 목록' },
  { keys: ['Ctrl', 'Shift', '7'], desc: '번호 목록' },
  { keys: ['Ctrl', 'Shift', '9'], desc: '체크리스트' },
  { keys: ['Ctrl', 'Z'], desc: '되돌리기' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: '다시 실행' },
];

type Tab = 'commands' | 'shortcuts' | 'tips';

export default function EditorHelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('commands');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[640px] max-h-[80vh] bg-card border border-card-border rounded-2xl shadow-2xl flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <h2 className="text-lg font-bold text-foreground">
            에디터 사용법
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3">
          {[
            { id: 'commands' as Tab, label: '슬래시 커맨드' },
            { id: 'shortcuts' as Tab, label: '단축키' },
            { id: 'tips' as Tab, label: '사용 팁' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                tab === t.id
                  ? 'bg-surface text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === 'commands' && (
            <div className="space-y-5">
              {HELP_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                  <div className="border border-card-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {section.items.map((item) => (
                          <tr
                            key={item.ko}
                            className="border-b border-card-border last:border-b-0"
                          >
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1.5">
                                <code className="px-1.5 py-0.5 rounded bg-surface text-secondary text-xs font-mono">
                                  {item.ko}
                                </code>
                                <code className="px-1.5 py-0.5 rounded bg-surface text-secondary text-xs font-mono">
                                  {item.en}
                                </code>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-subtle text-xs">
                              {item.desc}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'shortcuts' && (
            <div className="border border-card-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border bg-surface">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">
                      단축키
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted">
                      기능
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SHORTCUTS.map((s) => (
                    <tr
                      key={s.desc}
                      className="border-b border-card-border last:border-b-0"
                    >
                      <td className="px-3 py-2">
                        <span className="inline-flex gap-1">
                          {s.keys.map((k) => (
                            <kbd
                              key={k}
                              className="px-1.5 py-0.5 rounded bg-surface border border-card-border text-xs font-mono text-foreground"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-subtle text-xs">
                        {s.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'tips' && (
            <div className="space-y-3 text-sm text-subtle leading-relaxed">
              <TipCard
                title="슬래시 커맨드"
                desc={
                  <>
                    빈 줄에서{' '}
                    <span className="text-secondary font-medium">/</span> 를
                    입력하면 블록 메뉴가 나타납니다.{' '}
                    <span className="text-secondary font-medium">
                      한국어로도 검색
                    </span>{' '}
                    가능합니다.
                  </>
                }
              />
              <TipCard
                title="텍스트 선택 메뉴"
                desc={
                  <>
                    텍스트를{' '}
                    <span className="text-secondary font-medium">드래그</span>
                    하면 굵게, 기울임, 취소선, 코드, 링크 버튼이 나타납니다.
                  </>
                }
              />
              <TipCard
                title="이미지 업로드"
                desc={
                  <>
                    이미지를 에디터에{' '}
                    <span className="text-secondary font-medium">드래그</span>
                    하거나, 클립보드에서{' '}
                    <span className="text-secondary font-medium">Ctrl+V</span>
                    로 붙여넣으면 자동 업로드됩니다.
                  </>
                }
              />
              <TipCard
                title="Markdown 호환"
                desc={
                  <>
                    <span className="text-secondary font-medium">
                      Markdown 문법
                    </span>
                    으로 작성해도 자동 변환됩니다. 예: ## 제목, **굵게**, - 목록
                  </>
                }
              />
              <TipCard
                title="메모 삽입"
                desc={
                  <>
                    사이드바에서 메모를 선택하거나,{' '}
                    <span className="text-secondary font-medium">
                      /메모 삽입
                    </span>{' '}
                    커맨드로 메모를 에디터에 바로 넣을 수 있습니다.
                  </>
                }
              />
              <TipCard
                title="표 편집"
                desc={
                  <>
                    표를 삽입한 후{' '}
                    <span className="text-secondary font-medium">
                      열 경계를 드래그
                    </span>
                    하면 컬럼 너비를 조절할 수 있습니다.
                  </>
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-card-border flex items-center justify-between">
          <p className="text-caption text-muted">
            <kbd className="px-1 py-0.5 rounded bg-surface border border-card-border text-caption-sm font-mono">
              /
            </kbd>
            {' '}를 입력하여 시작하세요
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-foreground bg-surface border border-card-border rounded-lg hover:bg-card transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function TipCard({ title, desc }: { title: string; desc: ReactNode }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-surface border border-card-border">
      <span className="text-primary mt-0.5 shrink-0">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-subtle mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
