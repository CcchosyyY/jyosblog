# DID - 완료된 작업 기록

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
