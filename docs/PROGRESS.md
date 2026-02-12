# 지금까지 진행사항

## 완료된 기능

### 핵심 기능
- [x] 홈페이지 (최신 글 목록)
- [x] 블로그 글 목록 페이지
- [x] 개별 글 상세 페이지
- [x] 반응형 디자인 (모바일/데스크톱)

### 분류 시스템
- [x] 5개 카테고리 (일상/개발/요리/공부/운동)
- [x] 태그 시스템
- [x] 카테고리 사이드바
- [x] AI 카테고리 자동 추천

### UI/UX
- [x] 다크모드 (`#121212` 배경)
- [x] 검색 기능
- [x] 목차(TOC) 자동 생성
- [x] 코드 하이라이팅

### Pencil 디자인 시스템 리디자인 (2025-02)
- [x] 컬러 시스템 전환: teal/rose → Primary `#B3001B` (crimson) / Secondary `#FAA916` (gold)
- [x] 폰트 변경: Geist → Inter + JetBrains Mono
- [x] CSS 변수 기반 디자인 토큰 (background, foreground, card, primary, secondary, link, muted, subtle, surface, card-border)
- [x] 전체 22개 파일 토큰 변환 완료
- [x] Header NavLink Active 상태 (pathname 기반)
- [x] Header Memo 링크 추가
- [x] Header SearchBtn 아이콘 추가
- [x] Footer RSS 피드 아이콘 추가
- [x] Pencil 아토믹 디자인: Atoms → Molecules → Organisms → Page 레이아웃 시안 완성

### 관리 기능
- [x] Admin UI (글 작성/수정/삭제)
- [x] 관리자 로그인
- [x] Quick Memo 위젯

### SEO & 기타
- [x] RSS 피드
- [x] Sitemap
- [x] SEO 메타태그
- [x] About 페이지

---

## 배포 현황
- **Vercel**: 배포 완료
- **URL**: `*.vercel.app`

---

## 커밋 히스토리
```
xxxxxxx Redesign blog with Pencil atomic design system
dfa45e2 Fix security vulnerabilities, redesign color system, and upgrade to Next.js 15
dbc47fe Add project documentation (docs folder)
d0c5f0a Clean up: remove unused files and update README
494fe7e Add Quick Memo feature with Supabase integration
6c5f132 Add Supabase blog system with Admin UI
237118a Add category sidebar with 5 categories
eacf85f Change dark mode background to pure black
2b32e6c Complete blog project with all features
0aed1e8 Add PLAN.md
da85fa0 Initial commit
```
