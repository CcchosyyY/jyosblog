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
- **Supabase** (`@supabase/supabase-js`) - DB & 세션 관리
- **MDX** (`next-mdx-remote`) - 블로그 콘텐츠 렌더링
- **next-themes** - 다크모드
- **rehype-highlight** - 코드 하이라이팅
- 테스트 프레임워크: 없음

## Project Structure

```
app/
├── layout.tsx              # Root layout (폰트, ThemeProvider)
├── page.tsx                # 홈 (포스트 목록)
├── globals.css             # CSS 변수 기반 테마 정의
├── blog/                   # 블로그 상세 페이지
├── about/                  # 소개 페이지
├── admin/                  # 관리자 (대시보드, 글쓰기, 수정, 로그인)
├── api/                    # API Routes (admin/, posts/, quick-memos/)
├── feed.xml/               # RSS 피드
├── sitemap.ts, robots.ts   # SEO
components/
├── Header.tsx              # 네비게이션 헤더
├── Footer.tsx              # 푸터
├── PostCard.tsx            # 포스트 카드 컴포넌트
├── PostEditor.tsx          # 글쓰기/수정 에디터
├── SearchBar.tsx           # 검색
├── CategorySidebar.tsx     # 카테고리 사이드바
├── TableOfContents.tsx     # 목차
├── ThemeProvider.tsx        # next-themes Provider
├── ThemeToggle.tsx          # 다크모드 토글 버튼
├── QuickMemoWidget.tsx     # 빠른 메모 위젯
lib/
├── supabase.ts             # Supabase 클라이언트 싱글톤 + Post 타입
├── auth.ts                 # 세션 생성/검증/삭제 (isAuthenticated)
├── posts.ts                # 포스트 CRUD
├── categories.ts           # 카테고리 정의 (CATEGORIES 배열)
├── quick-memos.ts          # 빠른 메모 CRUD
├── suggest-category.ts     # 카테고리 자동 추천
middleware.ts               # /admin/* 경로 세션 검증
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
- 에러 처리: try-catch + null 반환 패턴

### API Routes
- 인증 필요 엔드포인트: `isAuthenticated()` 검증 필수 (`lib/auth.ts`)
- 응답: `NextResponse.json()` 사용

## Data Model

### Posts
```
id: uuid (PK)
title: string
content: string (MDX)
slug: string (unique)
description: string | null
category: string
tags: string[]
status: 'draft' | 'published'
suggested_category: string | null
created_at: timestamp
updated_at: timestamp
published_at: timestamp | null
```

### Admin Sessions
```
token: string (PK)
created_at: timestamp
expires_at: timestamp (7일)
```

### Quick Memos
```
id: uuid (PK)
content: string
created_at: timestamp
is_processed: boolean
```

### CategoryId
```typescript
'daily' | 'dev' | 'cooking' | 'study' | 'exercise'
```

## Auth Flow

1. 로그인: `ADMIN_PASSWORD` 환경변수와 비밀번호 비교
2. 세션 생성: `crypto.randomUUID()` → Supabase `admin_sessions` 테이블 저장
3. 쿠키 설정: `admin_session` httpOnly 쿠키 (7일 만료, secure, sameSite: strict)
4. 요청 검증: `middleware.ts`에서 쿠키 존재 확인 → API에서 `isAuthenticated()`로 DB 세션 유효성 검증

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon 키
- `ADMIN_PASSWORD` — 관리자 로그인 비밀번호 (서버 전용)

## Skills

| 스킬 | 설명 |
|------|------|
| `manage-skills` | 세션 변경사항 분석 → 검증 스킬 드리프트 탐지/수정 |
| `verify-implementation` | 모든 verify 스킬 순차 실행 → 통합 검증 보고서 생성 |
| `uitest` | Pencil 디자인 vs 실제 UI 비교 & 자동 수정 (Main.pen + Puppeteer로 전체 UI 검증) |
| `verify-backend` | 백엔드 보안 패턴, 인증 플로우, Supabase 에러 처리 검증 |

## Caveats

- **Next.js 15 async API**: `params`와 `cookies()`는 반드시 `await` 필요
- **다크모드**: `dark:` prefix 대신 CSS 변수 자동 전환. 예외: `prose` 클래스는 `dark:prose-invert` 사용
- **카테고리 추가**: `lib/categories.ts`의 `CATEGORIES` 배열에 추가해야 함
- **Supabase RLS**: public 정책 → API 단에서 `isAuthenticated()`로 인증 관리
