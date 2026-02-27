# DID - 완료된 작업 기록

## 2026-02-27: 인증 플로우 안정화 + CSS 변수 시스템 수정

Supabase 브라우저 클라이언트의 세션 초기화 타이밍 문제를 근본적으로 수정하고, CSS 변수를 hex→RGB 포맷으로 변환하여 Tailwind 투명도 수식어 지원을 복구.

### 완료 항목

- 인증 플로우 수정: getUser() → onAuthStateChange(INITIAL_SESSION) 전환
- CSS 변수 시스템 수정: hex → RGB 컴포넌트 포맷 변환
- Vercel 환경변수 전체 확인 (5개 모두 정상 설정)

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `lib/supabase-browser.ts` | MODIFY | 싱글톤 패턴 적용 (매 호출마다 새 인스턴스 생성 → 캐시) |
| `components/Header.tsx` | MODIFY | 중복 getUser() 제거, onAuthStateChange만 사용, admin 쿠키 체크 pathname 의존성 분리 |
| `app/dashboard/page.tsx` | MODIFY | getUser() → onAuthStateChange(INITIAL_SESSION) + isMounted 가드 |
| `app/profile/page.tsx` | MODIFY | getUser() → onAuthStateChange(INITIAL_SESSION) + isMounted 가드 |
| `components/LikeButton.tsx` | MODIFY | getUser() → onAuthStateChange(INITIAL_SESSION) |
| `components/CommentSection.tsx` | MODIFY | getUser() → onAuthStateChange(INITIAL_SESSION/SIGNED_IN) |
| `app/globals.css` | MODIFY | 모든 CSS 변수를 hex(#B3001B) → RGB 컴포넌트(179 0 27) 포맷으로 변환 |
| `tailwind.config.ts` | MODIFY | 모든 색상을 rgb(var(...) / <alpha-value>) 포맷으로 변경 |

### 아키텍처

```
[인증 세션 감지 개선]
  Before: getUser() → 쿠키 세션 초기화 전 null 반환 → 잘못된 로그인 리다이렉트
  After:  onAuthStateChange(INITIAL_SESSION) → 세션 초기화 완료 대기 → 정확한 판단

  getSupabaseBrowser() [싱글톤]
    ├─ Header.tsx (onAuthStateChange → setUser)
    ├─ dashboard/page.tsx (INITIAL_SESSION → setUser or redirect)
    ├─ profile/page.tsx (INITIAL_SESSION → setUserId + fetch profile)
    ├─ LikeButton.tsx (INITIAL_SESSION → fetch likes with userId)
    └─ CommentSection.tsx (INITIAL_SESSION/SIGNED_IN → set user info)

[CSS 변수 시스템]
  globals.css: --primary: #B3001B → --primary: 179 0 27
  tailwind.config: primary: 'var(--primary)' → primary: 'rgb(var(--primary) / <alpha-value>)'
  결과: bg-primary/10, text-muted/40 등 투명도 수식어 정상 작동
```

---

## 2026-02-27: 로그인 리다이렉트, lucide-react, EmptyState, 메모 개선, 최적화

로그인 후 원래 페이지로 돌아가기, 인라인 SVG → lucide-react 아이콘 교체, EmptyState 공통 컴포넌트 도입, 메모 검색/수정/정렬/DnD 기능 추가, 이미지/번들 최적화 등 8개 작업을 병렬 실행으로 완료.

### 완료 항목

- 로그인 후 원래 페이지로 돌아가기 (`next` 쿼리 파라미터 지원)
- Vercel 환경변수 `SUPABASE_SERVICE_ROLE_KEY` 확인 (이미 설정됨)
- EmptyState 공통 컴포넌트 생성 및 5개 페이지 적용
- lucide-react 아이콘 도입 (6개 컴포넌트 인라인 SVG 교체)
- admin/login 하드코딩 hex 색상 → CSS 변수 마이그레이션 (30+ 색상)
- 이미지 최적화 (ImageBlockView `<img>` → `<Image>`)
- 번들 최적화 (BlockEditor 동적 import)
- 메모 검색/인라인 수정/정렬/드래그앤드롭 기능

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `components/EmptyState.tsx` | NEW | 아이콘+제목+설명+CTA 공통 빈 상태 컴포넌트 |
| `components/Header.tsx` | MODIFY | 로그인 링크에 `?next=` 현재 경로 파라미터 추가 |
| `app/login/page.tsx` | MODIFY | next 파라미터 수신 + OAuth redirectTo에 전달 + Suspense 바운더리 |
| `app/auth/callback/route.ts` | MODIFY | next 파라미터 추출 + Open Redirect 보안 검증 + 조건부 리다이렉트 |
| `app/admin/login/page.tsx` | MODIFY | next 파라미터 지원 + lucide-react 아이콘 + hex→CSS 변수 전면 교체 + Suspense |
| `app/about/page.tsx` | MODIFY | lucide-react 아이콘 교체 (Github, Mail) |
| `components/AdminSidebar.tsx` | MODIFY | lucide-react 아이콘 교체 (LayoutGrid, Settings, Plus) |
| `components/SearchModal.tsx` | MODIFY | lucide-react Search 아이콘 + EmptyState 적용 |
| `components/MemoSidebar.tsx` | MODIFY | lucide-react Check + 검색 기능 추가 |
| `app/memos/MemoList.tsx` | MODIFY | 검색/인라인 수정/정렬/드래그앤드롭 + EmptyState 적용 (498줄 확장) |
| `components/QuickMemoWidget.tsx` | MODIFY | 검색 기능 추가 |
| `app/projects/page.tsx` | MODIFY | EmptyState 적용 |
| `app/blog/(list)/category/[category]/page.tsx` | MODIFY | EmptyState + CTA 적용 |
| `app/blog/(list)/tag/[tag]/page.tsx` | MODIFY | EmptyState + CTA 적용 |
| `components/editor/ImageBlockView.tsx` | MODIFY | `<img>` → next/image `<Image>` + isOptimizable 헬퍼 |
| `components/PostEditor.tsx` | MODIFY | BlockEditor 동적 import (`next/dynamic`, ssr: false) |
| `app/globals.css` | MODIFY | --error, --error-foreground, --glow-primary, --glow-accent 변수 추가 |
| `tailwind.config.ts` | MODIFY | error, error-foreground, glow-primary, glow-accent 색상 등록 |
| `package.json` | MODIFY | lucide-react 의존성 추가 |

### 아키텍처

```
[로그인 리다이렉트 플로우]
  Header (loginHref ?next=pathname)
    → /login?next=/blog/post
      → OAuth redirectTo: /auth/callback?next=/blog/post
        → callback: 보안 검증(/ && !//) → 리다이렉트

[EmptyState 컴포넌트]
  components/EmptyState.tsx (icon, title, description, action)
    ├─ projects/page.tsx (FolderOpen)
    ├─ category/[category]/page.tsx (FileText + CTA)
    ├─ tag/[tag]/page.tsx (Tag + CTA)
    ├─ MemoList.tsx (StickyNote)
    └─ SearchModal.tsx (SearchX)

[메모 기능 개선]
  MemoList.tsx
    ├─ 검색 (클라이언트 필터링)
    ├─ 인라인 수정 (textarea + PATCH API)
    ├─ 정렬 (최신/오래된/카테고리)
    └─ 드래그앤드롭 (HTML5 DnD, 로컬 상태)
  MemoSidebar.tsx → 검색 추가
  QuickMemoWidget.tsx → 검색 추가
```

---

## 2026-02-27: Block Editor 마이그레이션 + DevProjectFilter 아코디언 리디자인

MarkdownToolbar를 Tiptap/Novel 기반 BlockEditor로 교체하고, 개발 카테고리 페이지의 DevProjectFilter를 프로젝트별 아코디언 섹션 + 넷플릭스 스타일 가로 스크롤로 재설계.

### 완료 항목

- Block Editor(Tiptap/Novel) 마이그레이션 — 슬래시 커맨드, 이미지 업로드, 캘아웃, 토글 지원
- DevProjectFilter 아코디언 + 가로 스크롤 리디자인
- About 페이지 레이아웃 업데이트
- 에디터 도움말 모달 추가

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `components/DevProjectFilter.tsx` | MODIFY | 탭 필터 → 프로젝트별 아코디언 섹션 + 가로 스크롤 + StatusBadge/GitHub/Live 링크 |
| `components/BlockEditor.tsx` | NEW | Tiptap/Novel 기반 블록 에디터 컴포넌트 |
| `components/EditorHelpModal.tsx` | NEW | 에디터 단축키/사용법 도움말 모달 |
| `components/editor/ImageBlockView.tsx` | NEW | 에디터 이미지 블록 NodeView |
| `components/editor/ImageUploadView.tsx` | NEW | 에디터 이미지 업로드 플레이스홀더 NodeView |
| `components/MarkdownToolbar.tsx` | DELETE | BlockEditor로 대체 |
| `components/PostEditor.tsx` | MODIFY | BlockEditor 통합, MDX↔HTML 변환 |
| `lib/editor-extensions.ts` | NEW | Tiptap 확장 설정 (슬래시 커맨드, 캘아웃, 토글 등) |
| `lib/editor-image-extension.ts` | NEW | 커스텀 이미지 확장 (업로드, 리사이즈, 정렬) |
| `lib/markdown-utils.ts` | NEW | MDX↔HTML 변환 유틸리티 |
| `app/about/page.tsx` | MODIFY | 레이아웃 및 스타일 업데이트 |
| `app/globals.css` | MODIFY | 에디터 관련 CSS 스타일 대량 추가 (이미지 블록, 캘아웃, 토글, 테이블 등) |
| `app/admin/write/page.tsx` | MODIFY | BlockEditor 연동 |
| `app/admin/edit/[id]/page.tsx` | MODIFY | BlockEditor 연동 |
| `package.json` | MODIFY | Tiptap/Novel 관련 패키지 추가 |

### 아키텍처

```
[Block Editor]
  PostEditor.tsx ──── BlockEditor.tsx ──── Tiptap/Novel
    │                   ├─ editor-extensions.ts (slash cmd, callout, toggle, table)
    │                   └─ editor-image-extension.ts (upload, resize, align)
    └─ markdown-utils.ts (MDX ↔ HTML 변환)

[DevProjectFilter]
  category/[category]/page.tsx
    └─ DevProjectFilter.tsx
         ├─ 프로젝트별 아코디언 (StatusBadge + GitHub/Live 링크)
         ├─ 가로 스크롤 PostCard (snap-x + scrollbar-hide)
         └─ 기타 글 섹션
```

## 2026-02-25: 전체 UI 개선 — 디자인 시스템, 타이포그래피, 백엔드 검증

디자인 시스템 기반 구축(타이포그래피 토큰 10개, 상태/카테고리 CSS 변수), Avatar 공유 컴포넌트 생성, CommentSection 전면 재설계(낙관적 UI), 블로그 상세 페이지 개선, 25+파일 text-[Npx] → 시맨틱 토큰 마이그레이션, 백엔드 입력 검증 및 중복 유틸 추출.

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `tailwind.config.ts` | MODIFY | 타이포그래피 스케일(heading-xl~caption-xs) + 상태/카테고리 색상 토큰 추가 |
| `app/globals.css` | MODIFY | CSS 변수(status, category) 추가, focus-ring 유틸리티, prose 스타일 개선 |
| `components/Avatar.tsx` | NEW | 공유 Avatar 컴포넌트 (xs~xl 5사이즈, Image+이니셜 폴백) |
| `lib/supabase-server.ts` | NEW | createSupabaseFromRequest 공유 유틸리티 |
| `components/CommentSection.tsx` | MODIFY | divider 레이아웃, 낙관적 UI, 글자수 카운터, Avatar 적용 |
| `app/blog/[slug]/page.tsx` | MODIFY | max-w-2xl, 태그 헤더 이동, 메타 한줄 dot구분, Related Posts 리스트화 |
| `components/TableOfContents.tsx` | MODIFY | border-left 인디케이터, "On this page" 라벨 |
| `app/api/profile/route.ts` | MODIFY | 입력 검증(nickname 50자, bio 500자, avatar_url http) |
| `app/api/comments/route.ts` | MODIFY | 공유 supabase-server 사용 |
| `app/api/likes/route.ts` | MODIFY | 공유 supabase-server 사용 |
| `components/Header.tsx` | MODIFY | Avatar 적용, dark: prefix 제거 |
| `components/ProfileCard.tsx` | MODIFY | Avatar 적용 |
| `components/CategorySidebar.tsx` | MODIFY | dark: prefix, 하드코딩 hex 제거 |
| `components/StatusBadge.tsx` | MODIFY | status CSS 변수 사용 |
| `app/page.tsx` | MODIFY | 카테고리 CSS 변수, hover scale 제거, 시맨틱 토큰 |
| 기타 ~15개 파일 | MODIFY | text-[Npx] → 시맨틱 토큰 마이그레이션 |
| `CLAUDE.md` | MODIFY | Workflow 섹션 추가 (MCP 우선 확인 규칙) |

### 아키텍처

```
[Design System Foundation]
  tailwind.config.ts ─── fontSize tokens (10개)
  globals.css ─────────── CSS vars (status/category) + focus-ring
  Avatar.tsx ──────────── 공유 컴포넌트 (Header, Comment, Profile, Sidebar)

[Backend]
  supabase-server.ts ──── 공유 유틸 ← comments/likes/profile API
  profile/route.ts ────── 입력 검증 추가

[Component Redesign]
  CommentSection ──── divider list + optimistic UI
  Blog [slug] ─────── max-w-2xl + tag header + simple related
  TableOfContents ──── border-left indicator
```

## 2026-02-25: Skills 시스템, RLS 보안, UI 리디자인, 신규 기능 추가

스킬(작업준비/작업완료) 자동화 시스템 구축, Supabase RLS + service_role 분리, Header/Login 리디자인, 댓글/좋아요/조회수/검색/프로필/404 기능 추가.

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `.claude/skills/작업완료/SKILL.md` | NEW | 세션 마무리 자동화 스킬 (git commit, DID/TODO 업데이트, devlog 발행) |
| `.claude/skills/작업준비/SKILL.md` | NEW | 세션 시작 자동화 스킬 (Chrome, dev서버, git status, TODO 요약) |
| `CLAUDE.md` | MODIFY | 프로젝트 구조 전면 정리, 스킬 테이블 추가, OAuth 인증 흐름 반영 |
| `TODO.md` | MODIFY | 완료 항목 11개 체크, 중복 제거, 재구성 |
| `lib/supabase.ts` | MODIFY | `getSupabaseAdmin()` 싱글톤 추가 (service_role key) |
| `lib/auth.ts` | MODIFY | 모든 함수 `getSupabaseAdmin()` 사용으로 전환 |
| `lib/categories.ts` | MODIFY | admin 클라이언트로 전환 |
| `lib/quick-memos.ts` | MODIFY | admin 클라이언트로 전환 |
| `lib/settings.ts` | MODIFY | admin 클라이언트로 전환 |
| `lib/posts.ts` | MODIFY | admin 함수 전환 + `getRelatedPosts()` 추가 |
| `components/Header.tsx` | MODIFY | 중앙 정렬 nav, 넓은 검색바, 모바일 UX 개편 |
| `components/Footer.tsx` | MODIFY | 이메일 주소 수정 |
| `app/login/page.tsx` | MODIFY | 대형 카드, OAuth 중심, 글로우 이펙트 리디자인 |
| `app/admin/login/page.tsx` | MODIFY | OAuth 주요, 비밀번호 접이식 폴백 |
| `app/blog/[slug]/page.tsx` | MODIFY | 관련 게시글 섹션 추가 |
| `app/fonts/GeistMonoVF.woff` | DELETE | 미사용 폰트 제거 (66KB) |
| `app/fonts/GeistVF.woff` | DELETE | 미사용 폰트 제거 (64KB) |
| `components/CommentSection.tsx` | NEW | 댓글 기능 |
| `components/LikeButton.tsx` | NEW | 좋아요 기능 |
| `components/ViewCounter.tsx` | NEW | 조회수 기능 |
| `components/SearchModal.tsx` | NEW | 검색 모달 |
| `components/Pagination.tsx` | NEW | 페이지네이션 |
| `components/ProfileCard.tsx` | NEW | 프로필 카드 |
| `components/PostCardSkeleton.tsx` | NEW | 로딩 스켈레톤 |
| `app/not-found.tsx` | NEW | 404 페이지 |
| `app/profile/page.tsx` | NEW | 프로필 페이지 |
| `app/blog/page.tsx` | NEW | 블로그 목록 페이지 |
| `lib/comments.ts` | NEW | 댓글 CRUD |
| `lib/likes.ts` | NEW | 좋아요 CRUD |
| `lib/views.ts` | NEW | 조회수 CRUD |
| `lib/profiles.ts` | NEW | 프로필 CRUD |
| `supabase/migrations/001_add_features.sql` | NEW | 신규 테이블 마이그레이션 |

### 아키텍처

```
Supabase RLS 보안 모델:
  ├─ anon key (getSupabase) → SELECT only (published posts, categories, settings)
  └─ service_role key (getSupabaseAdmin) → ALL operations (CRUD)

스킬 자동화:
  작업준비 → Chrome 열기 + dev서버 + git status + TODO 브리핑
  작업완료 → git commit/push + DID.md + TODO.md + devlog 발행

크로스 프로젝트 devlog 발행:
  ~/.env.blog → BLOG_SUPABASE_URL + BLOG_SUPABASE_SERVICE_ROLE_KEY
  curl POST → /rest/v1/posts (service_role 인증)
```

## 2026-02-23: 일반 사용자 로그인 + 관리자 분리

모든 사용자가 소셜 로그인 가능하도록 변경하되, 관리자 이메일(`ADMIN_EMAIL`)로 로그인 시에만 `/admin` 대시보드 접근 가능하게 구현.

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `middleware.ts` | MODIFY | `@supabase/ssr` `createServerClient`로 매 요청마다 Supabase Auth 세션 리프레시 + matcher를 전체 경로로 확장 |
| `app/auth/callback/route.ts` | NEW | OAuth 콜백 — 모든 사용자 Supabase 세션 유지, 관리자만 `admin_session` + `is_admin` 쿠키 추가 |
| `app/login/page.tsx` | NEW | Google/GitHub 소셜 로그인 전용 페이지 (비밀번호 필드 없음) |
| `components/Header.tsx` | MODIFY | Supabase Auth로 사용자 확인 → 아바타/드롭다운 표시, 관리자면 Dashboard 링크 |
| `app/api/auth/logout/route.ts` | NEW | Supabase signOut + `is_admin`/`admin_session` 쿠키 정리 |
| `next.config.mjs` | MODIFY | Google/GitHub 아바타 이미지 도메인 허용 |
| `lib/supabase-browser.ts` | NEW | 브라우저용 Supabase 클라이언트 (`createBrowserClient`) |
| `app/globals.css` | MODIFY | 로그인 카드 애니메이션 추가 |
| `app/admin/login/page.tsx` | MODIFY | OAuth 소셜 로그인 버튼 추가 + UI 개선 |

### 아키텍처

```
사용자: /login → OAuth (Google/GitHub) → /auth/callback
  ├─ 관리자 이메일 → admin_session + is_admin 쿠키 → /admin 리다이렉트
  └─ 일반 사용자 → Supabase 세션만 유지 → / 리다이렉트

Header: Supabase 세션 확인 → 아바타/드롭다운 (관리자면 Dashboard 링크)
로그아웃: /api/auth/logout → Supabase signOut + 모든 쿠키 정리
```
