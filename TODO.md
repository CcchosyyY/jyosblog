# TODO

## 높은 우선순위

### 콘텐츠
- [x] 첫 번째 블로그 글 작성
- [ ] About 페이지 내용 업데이트 (프로필 사진, 실제 소개글)


---

## 중간 우선순위

### 사용자 기능
- [x] 로그인 후 원래 페이지로 돌아가기 (`next` 쿼리 파라미터 지원)
- [ ] 시리즈/연재 기능
- [x] Vercel 환경변수에 `SUPABASE_SERVICE_ROLE_KEY` 추가 (프로덕션 RLS)

### UI 개선
- [x] EmptyState 컴포넌트 적용 (글 없을 때 일러스트)
- [x] lucide-react 아이콘 라이브러리 도입 (현재 인라인 SVG)
- [x] admin/login 페이지 하드코딩 hex 색상 → CSS 변수 마이그레이션
- [ ] 라이트모드 전체 시각 검증 (다크모드 완료 후)

### 디자인
- [ ] Pencil 디자인에 로그인/프로필 관련 컴포넌트 추가

---

## 낮은 우선순위

### 기능
- [ ] 소셜 로그인 provider 추가 (카카오, 네이버 등)
- [ ] 이메일 알림 기능 (새 댓글 알림)
- [ ] 뉴스레터 구독
- [ ] 통계 대시보드

### 마케팅
- [ ] 랜딩페이지 제작 (일반 사용자 대상, 한 줄 카피 + 스크린샷 + CTA)

### 성능
- [x] 이미지 최적화
- [x] 번들 사이즈 최적화

### 메모 개선
- [x] 메모 검색 기능 (키워드로 필터링)
- [ ] 메모 드래그 앤 드롭으로 PostEditor에 삽입
- [x] 메모 인라인 수정 기능
- [x] 메모 정렬 옵션 (날짜순, 카테고리순)

### 기타
- [ ] 커스텀 도메인 구매 (jyos.dev, jyos.blog 등)

---

## 완료

- [x] 댓글 기능 구현
- [x] Supabase `profiles` 테이블 생성
- [x] 전역 검색 기능 (Cmd+K 단축키)
- [x] Footer 소셜 링크 실제 URL로 교체
- [x] 사용자 프로필 페이지 (`/profile`)
- [x] 조회수 카운터
- [x] 좋아요 기능
- [x] 페이지네이션
- [x] 로딩 스켈레톤
- [x] 404 페이지 커스터마이징
- [x] Geist 폰트 파일 삭제
- [x] `/admin/login` 페이지 정리 (OAuth 우선, 비밀번호 접이식)
- [x] 관련 글 추천 (같은 카테고리/태그 기반)
- [x] Header 모바일 드롭다운 UX 개선 (아바타 + 메뉴 통합)
- [x] Supabase RLS 설정 (service_role 분리)
- [x] 작업준비/작업완료 스킬 자동화 구축
- [x] Header 중앙 정렬 네비게이션 + 넓은 검색바
- [x] 로그인 페이지 리디자인 (OAuth 중심, 글로우 이펙트)
- [x] CLAUDE.md 전면 정리
- [x] 크로스 프로젝트 devlog 발행 구조 구축 (~/.env.blog)
- [x] 디자인 시스템 기반 구축 (타이포그래피 토큰, 상태/카테고리 CSS 변수)
- [x] Avatar 공유 컴포넌트 생성 (Header, Comment, Profile, Sidebar 통합)
- [x] CommentSection 전면 재설계 (divider 레이아웃, 낙관적 UI, 글자수 카운터)
- [x] 블로그 상세 페이지 개선 (max-w-2xl, 태그 헤더, Related Posts 리스트)
- [x] text-[Npx] → 시맨틱 토큰 전체 마이그레이션 (25+ 파일)
- [x] dark: prefix 위반 및 하드코딩 색상 전면 제거
- [x] 백엔드 프로필 입력 검증 + createSupabaseFromRequest 중복 제거
- [x] 프로젝트 기능 (CRUD, devlog 타임라인, 필터, 상태 배지)
- [x] MCP 우선 확인 워크플로우 규칙 CLAUDE.md에 추가
- [x] 로그인 후 원래 페이지로 돌아가기 (next 쿼리 파라미터)
- [x] Vercel 환경변수 SUPABASE_SERVICE_ROLE_KEY 확인 (이미 설정됨)
- [x] EmptyState 공통 컴포넌트 + 5개 페이지 적용
- [x] lucide-react 아이콘 도입 (6개 컴포넌트 인라인 SVG 교체)
- [x] admin/login hex 색상 → CSS 변수 마이그레이션
- [x] 이미지 최적화 (ImageBlockView img→Image) + 번들 최적화 (BlockEditor 동적 import)
- [x] 메모 검색/인라인 수정/정렬/드래그앤드롭 기능
