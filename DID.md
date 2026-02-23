# DID - 완료된 작업 기록

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
