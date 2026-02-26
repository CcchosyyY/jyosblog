# MyBlog

Next.js 15 App Router + Supabase + MDX 기반 개인 블로그

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## Tech Stack

- **Next.js 15.5** / React 18 / TypeScript 5 (strict mode)
- **Tailwind CSS 3** + `@tailwindcss/typography`
- **Supabase** (`@supabase/supabase-js`) — DB & 인증 & 세션 관리
- **MDX** (`next-mdx-remote`) — 블로그 콘텐츠 렌더링
- **next-themes** — 다크모드
- **rehype-highlight** — 코드 하이라이팅
- 테스트 프레임워크: 없음

## Project Structure

```
app/
├── layout.tsx                    # Root layout (폰트, ThemeProvider)
├── page.tsx                      # 홈 (포스트 목록)
├── globals.css                   # CSS 변수 기반 테마 정의
├── not-found.tsx                 # 404 페이지
├── blog/
│   ├── page.tsx                  # 블로그 목록 (리다이렉트)
│   ├── loading.tsx               # 블로그 로딩 스켈레톤
│   ├── [slug]/page.tsx           # 블로그 상세
│   └── (list)/                   # 목록 레이아웃 그룹
│       ├── layout.tsx            # 사이드바 포함 레이아웃
│       ├── page.tsx              # 전체 목록
│       ├── category/[category]/  # 카테고리별 목록
│       └── tag/[tag]/            # 태그별 목록
├── about/page.tsx                # 소개 페이지
├── projects/
│   ├── page.tsx                  # 프로젝트 목록 (DB 기반 + 필터)
│   └── [slug]/page.tsx           # 프로젝트 상세 + devlog 타임라인
├── memos/                        # 메모 페이지
│   ├── page.tsx
│   └── MemoList.tsx
├── login/page.tsx                # 일반 사용자 소셜 로그인
├── profile/page.tsx              # 사용자 프로필
├── dashboard/page.tsx            # 사용자 대시보드
├── auth/callback/route.ts        # OAuth 콜백
├── admin/
│   ├── login/page.tsx            # 관리자 로그인
│   ├── write/page.tsx            # 글쓰기
│   ├── edit/[id]/page.tsx        # 글 수정
│   └── (with-sidebar)/           # 사이드바 포함 레이아웃
│       ├── layout.tsx
│       ├── page.tsx              # 대시보드
│       └── settings/page.tsx     # 설정
├── api/
│   ├── posts/route.ts            # 포스트 CRUD
│   ├── comments/route.ts         # 댓글
│   ├── likes/route.ts            # 좋아요
│   ├── views/route.ts            # 조회수
│   ├── search/route.ts           # 검색
│   ├── upload/route.ts           # 이미지 업로드
│   ├── profile/route.ts          # 프로필
│   ├── auth/logout/route.ts      # 로그아웃
│   ├── quick-memos/route.ts      # 메모 CRUD
│   ├── quick-memos/batch/route.ts
│   └── admin/                    # 관리자 전용
│       ├── login/route.ts
│       ├── settings/route.ts
│       └── categories/route.ts
├── feed.xml/route.ts             # RSS 피드
├── sitemap.ts                    # SEO
└── robots.ts                     # SEO

components/
├── Header.tsx                    # 네비게이션 헤더
├── Footer.tsx                    # 푸터
├── PostCard.tsx                  # 포스트 카드
├── PostCardSkeleton.tsx          # 포스트 카드 스켈레톤
├── PostEditor.tsx                # 글쓰기/수정 에디터
├── MarkdownToolbar.tsx           # 마크다운 툴바
├── SearchBar.tsx                 # 검색 (헤더용)
├── SearchModal.tsx               # 검색 모달 (Cmd+K)
├── CategorySidebar.tsx           # 카테고리 사이드바
├── BlogSidebar.tsx               # 블로그 사이드바
├── AdminSidebar.tsx              # 관리자 사이드바
├── MemoSidebar.tsx               # 메모 사이드바
├── TableOfContents.tsx           # 목차
├── Pagination.tsx                # 페이지네이션
├── CommentSection.tsx            # 댓글
├── LikeButton.tsx                # 좋아요 버튼
├── ViewCounter.tsx               # 조회수 카운터
├── ProfileCard.tsx               # 프로필 카드
├── QuickMemoWidget.tsx           # 빠른 메모 위젯
├── StatusBadge.tsx               # 프로젝트 상태 배지
├── ProjectCard.tsx               # 프로젝트 카드 (Link 래핑)
├── ProjectFilter.tsx             # 프로젝트 상태 필터 탭
├── DevlogTimeline.tsx            # Linear 스타일 수직 타임라인
├── ThemeProvider.tsx             # next-themes Provider
└── ThemeToggle.tsx               # 다크모드 토글

lib/
├── supabase.ts                   # Supabase 클라이언트 싱글톤 + Post/Project 타입
├── supabase-browser.ts           # 브라우저용 Supabase 클라이언트
├── auth.ts                       # 세션 생성/검증/삭제 (isAuthenticated)
├── posts.ts                      # 포스트 CRUD + getPostsByProject
├── projects.ts                   # 프로젝트 CRUD (getProjects, getProjectBySlug)
├── categories.ts                 # 카테고리 CRUD + CATEGORIES 배열
├── comments.ts                   # 댓글 CRUD
├── likes.ts                      # 좋아요 CRUD
├── views.ts                      # 조회수 CRUD
├── profiles.ts                   # 프로필 CRUD
├── settings.ts                   # 설정 CRUD
├── quick-memos.ts                # 빠른 메모 CRUD
└── suggest-category.ts           # 카테고리 자동 추천

middleware.ts                     # /admin/* 경로 세션 검증 + Supabase Auth 리프레시
```

## Design Workflow (Pencil)

- 디자인 파일: `pencil/Main.pen`
- Pencil MCP 도구로 Atomic Design 기반 컴포넌트 디자인
- **새 페이지/컴포넌트 생성 시 필수 워크플로우:**
  1. Main.pen에서 Atomic 컴포넌트(Atom → Molecule → Organism) 먼저 디자인
  2. 디자인된 컴포넌트를 조합하여 페이지 프레임 구성
  3. 완성된 디자인을 코드로 변환하여 UI 구현
  4. **코드 작성 전에 반드시 Main.pen에 디자인이 존재해야 함**
- `.pen` 파일은 반드시 Pencil MCP 도구로만 읽기/쓰기 (Read/Grep 사용 금지)
- 디자인 변경 요청 시: 페이지/인스턴스를 직접 수정하지 않고, **Atomic 컴포넌트(reusable: true)**를 찾아 수정 → 모든 인스턴스에 자동 반영

## Coding Conventions

### TypeScript & React
- Server Component 기본, 필요 시 `'use client'` 추가
- Props는 `interface` 선언 (type 아닌 interface)
- 컴포넌트 파일명: PascalCase (e.g., `PostCard.tsx`)
- Import alias: `@/*` (프로젝트 루트 기준)

### Tailwind & 스타일링
- CSS 변수 기반 테마 색상 사용 (globals.css에 정의)
  - `text-foreground`, `bg-background`, `bg-card`, `text-primary`, `text-secondary`, `text-muted`, `text-link`, `bg-surface`
- 직접 색상값 (`text-gray-500`, `bg-blue-600` 등) 사용 금지
- CSS modules 미사용 — Tailwind 유틸리티 클래스만 사용
- 다크모드: CSS 변수가 자동 전환됨 → `dark:` prefix 불필요 (prose 관련만 `dark:prose-invert`)

### Formatting (Prettier)
- semi: true / singleQuote: true / tabWidth: 2
- trailingComma: "es5" / printWidth: 80

### Supabase
- `getSupabase()` 싱글톤 사용 (`lib/supabase.ts`)
- 브라우저: `supabase-browser.ts`의 `createBrowserClient` 사용
- 에러 처리: try-catch + null 반환 패턴

### API Routes
- 인증 필요 엔드포인트: `isAuthenticated()` 검증 필수 (`lib/auth.ts`)
- 응답: `NextResponse.json()` 사용

## Data Model

### Posts
```
id: uuid (PK), title, content (MDX), slug (unique), description?, category,
tags[], status ('draft'|'published'), suggested_category?, thumbnail?,
project_id? (FK → projects.id),
created_at, updated_at, published_at?
```

### Projects
```
id: text (PK, slug 겸용), title, description?, long_description?,
tags[], status ('active'|'completed'|'archived'),
github_url?, live_url?, gradient?, sort_order,
created_at, updated_at
```

### Categories
```
id: string (PK), name, sort_order, created_at
```

### Comments / Likes / Views / Profiles
- Supabase 테이블로 관리 (lib/comments.ts, likes.ts, views.ts, profiles.ts 참고)

### Quick Memos
```
id: uuid (PK), content, created_at, is_processed
```

### Admin Sessions
```
token: string (PK), created_at, expires_at (7일)
```

## Auth Flow

1. **일반 사용자**: `/login` → OAuth (Google/GitHub) → `/auth/callback` → Supabase 세션
2. **관리자**: `/admin/login` → `ADMIN_PASSWORD` 비교 → `admin_session` 쿠키 (7일)
3. **요청 검증**: `middleware.ts`에서 Supabase Auth 리프레시 + 관리자 쿠키 확인 → API에서 `isAuthenticated()`

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon 키
- `ADMIN_PASSWORD` — 관리자 로그인 비밀번호 (서버 전용)

## Skills

| 스킬 | 설명 |
|------|------|
| `작업실행` | 작업을 세부 단계로 분해하고, 순차/병렬 모드로 계획 후 실행합니다 |
| `작업준비` | 세션 시작 자동화 — Chrome 탭 열기, dev 서버 시작, git 상태 확인, TODO 요약 |
| `작업완료` | 세션 마무리 자동화 — git commit/push, DID.md/TODO.md 업데이트, 개발일지 블로그 발행 |
| `manage-skills` | 세션 변경사항 분석 → 검증 스킬 드리프트 탐지/수정 |
| `verify-implementation` | 모든 verify 스킬 순차 실행 → 통합 검증 보고서 생성 |
| `uitest` | Pencil 디자인 vs 실제 UI 비교 & 자동 수정 (Main.pen + Puppeteer) |
| `verify-backend` | 백엔드 보안 패턴, 인증 플로우, Supabase 에러 처리 검증 |

## Workflow

- **작업 시작 시 MCP 확인 필수**: 모든 작업을 시작하기 전에 먼저 사용 가능한 MCP 서버/도구를 확인(`ToolSearch` 또는 `ListMcpResourcesTool`)하고, 해당 작업에 활용할 수 있는 MCP가 있는지 판단한 후 작업을 진행할 것
- 활용 가능한 MCP 서버: Pencil(디자인), Chrome DevTools/Puppeteer(UI 테스트), Figma(디자인 연동), Supabase(DB), Vercel(배포), GitHub(PR/이슈), context7(문서 조회), memory(지식 관리) 등

## Caveats

- **Next.js 15 async API**: `params`와 `cookies()`는 반드시 `await` 필요
- **다크모드**: `dark:` prefix 대신 CSS 변수 자동 전환. 예외: `prose` 클래스는 `dark:prose-invert` 사용
- **카테고리 추가**: `lib/categories.ts`의 `CATEGORIES` 배열 + Supabase `categories` 테이블 모두 추가
- **Supabase RLS**: public 정책 → API 단에서 `isAuthenticated()`로 인증 관리
