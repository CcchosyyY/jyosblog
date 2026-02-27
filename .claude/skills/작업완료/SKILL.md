---
name: 작업완료
description: 세션 마무리 자동화 — git commit/push, TODO→DID 이동, DID 기반 개발일지 발행. 작업 종료 시 사용.
user-invocable: true
---

# 작업완료 — 세션 마무리 자동화

## Purpose

세션 종료 시 아래 작업을 순차 실행하여 작업 기록을 자동화:

1. **Git commit + push** — 변경사항 커밋 및 원격 푸시
2. **TODO.md → DID.md** — TODO에서 완료된 항목을 DID.md로 이동
3. **블로그 개발일지 발행** — DID.md 내용 기반으로 Supabase에 devlog 발행

## When to Run

- 작업 세션을 마무리할 때
- 사용자가 "작업완료"를 입력했을 때

## Workflow

### Step 1: Git Commit + Push

#### 1a. 변경사항 확인

```bash
git status
git diff --stat
```

변경사항이 없으면 "커밋할 변경사항이 없습니다"라고 알리고 Step 2로 진행.

#### 1b. 변경 내용 분석 및 커밋

변경사항이 있으면:

1. `git diff --staged`와 `git diff`로 변경 내용 분석
2. `git log --oneline -5`로 최근 커밋 스타일 참고
3. 변경 내용을 분석하여 커밋 메시지 자동 생성
4. 파일별로 `git add`하여 스테이징 (.env, credentials 등 민감 파일 제외)
5. 커밋 생성 (Co-Authored-By 포함)

```bash
git add <changed-files>
git commit -m "$(cat <<'EOF'
<자동 생성된 커밋 메시지>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

#### 1c. Push

```bash
git push origin main
```

push 실패 시 사용자에게 알리고 다음 단계로 진행.

### Step 2: TODO.md → DID.md 이동

#### 2a. 완료 항목 식별

오늘 세션의 커밋 내용과 작업 기록을 기반으로 TODO.md에서 완료된 항목을 식별.

```bash
# 오늘의 커밋 목록
git log --oneline --since="today" --format="%h %s"

# 변경된 파일 목록
git diff HEAD~N --name-status  # N은 오늘 커밋 수
```

#### 2b. TODO.md 전체 항목 유효성 검증

오늘 작업과 무관하게, TODO.md **전체 항목**을 검토하여 정리:

1. **이전 세션에서 이미 완료된 항목** — `[x]`인데 "완료" 섹션에 안 옮겨진 항목을 "완료" 섹션으로 이동
2. **상황 변경으로 무의미해진 항목** — 이미 구현됐거나, 삭제된 기능 관련 항목 제거
3. **중복 항목** — 동일/유사한 항목이 여러 곳에 있으면 하나로 통합
4. **완료 섹션 정리** — `[x]` 항목이 높은/중간/낮은 우선순위 섹션에 남아있으면 "완료" 섹션으로 이동

#### 2c. TODO.md 업데이트

1. 이번 세션에서 완료된 항목을 `[ ]` → `[x]`로 변경
2. 세션 중 발견된 새로운 할 일이 있으면 적절한 우선순위 섹션에 추가
3. 2b에서 발견된 정리 사항 반영

**규칙:**
- 기존 TODO.md 형식 유지 (높은/중간/낮은 우선순위 + 하위 카테고리)
- 이미 있는 항목 중복 추가 금지
- 새 항목은 `- [ ]` 형식으로 추가

#### 2d. DID.md에 완료 항목 기록

파일: `/home/chosangyun/MyBlog/DID.md`

다음 3가지를 종합하여 오늘의 DID 항목을 작성합니다:

1. **세션 내용** — 이번 세션에서 실제로 수행한 작업, 대화 맥락
2. **Git 변경사항** — `git log --since="today"`, `git diff` 등으로 확인한 코드 변경
3. **TODO.md** — 완료 처리할 항목, 새로 발견된 TODO

**기존 형식을 반드시 유지:**

```markdown
## YYYY-MM-DD: <작업 제목 요약>

<1-2문장 설명>

### 완료 항목

- <TODO에서 완료된 항목 1>
- <TODO에서 완료된 항목 2>
- ...

### 변경 파일

| 파일 | 작업 | 내용 |
|------|------|------|
| `path/to/file` | NEW/MODIFY/DELETE | 변경 내용 설명 |

### 아키텍처

\```
아키텍처 다이어그램 (ASCII)
\```
```

**규칙:**
- 파일 상단(`# DID` 헤더 바로 아래)에 새 섹션을 삽입 (최신이 위로)
- 오늘 날짜 섹션이 이미 있으면 그 아래에 새 서브섹션 추가
- 작업 유형: NEW (새 파일), MODIFY (수정), DELETE (삭제)
- 아키텍처 섹션은 구조적 변경이 있을 때만 포함
- **"완료 항목" 섹션에는 TODO.md에서 이번에 완료 처리한 항목만 나열**

### Step 3: 블로그 개발일지 발행

#### 3a. MDX 콘텐츠 생성

**DID.md의 오늘 섹션을 기반으로** 개발일지 MDX 작성:

```markdown
# <날짜> 개발일지: <제목>

## 오늘 한 일

<DID.md의 완료 항목 + 변경 파일 테이블>

## 다음 할 일

<TODO.md에서 우선순위 높은 미완료 항목 3-5개>
```

**핵심: DID.md가 블로그 콘텐츠의 원본 소스**

#### 3b. Supabase에 직접 Insert

`.env.local`에서 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 읽어서 REST API로 insert:

```bash
# .env.local에서 환경변수 읽기
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2)
SUPABASE_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2)

# slug 생성: devlog-YYYY-MM-DD
SLUG="devlog-$(date +%Y-%m-%d)"
NOW=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)  # 현재 시각 UTC ISO 8601

# project_id 결정: 현재 프로젝트 디렉토리 기준
# - MyBlog 디렉토리 → "jyos-blog"
# - 다른 프로젝트 → CLAUDE.md에서 project slug 읽기 또는 디렉토리명 사용
PROJECT_ID="jyos-blog"  # 기본값 (MyBlog 프로젝트)

curl -s -X POST "${SUPABASE_URL}/rest/v1/posts" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "<제목>",
    "content": "<DID.md 기반 MDX 콘텐츠>",
    "slug": "'${SLUG}'",
    "description": "<한줄 설명>",
    "category": "dev",
    "tags": ["devlog"],
    "status": "published",
    "published_at": "'${NOW}'",
    "project_id": "'${PROJECT_ID}'"
  }'
```

**project_id 결정 규칙:**
- MyBlog 프로젝트에서 실행 시: `"jyos-blog"`
- 다른 프로젝트에서 실행 시: 해당 프로젝트의 CLAUDE.md에서 project slug를 읽거나, 디렉토리명을 slug로 변환하여 사용
- Supabase `projects` 테이블에 해당 id가 없으면 project_id를 null로 설정

**slug 충돌 시:** 같은 날짜에 이미 devlog가 있으면 `devlog-YYYY-MM-DD-2` 형식으로 suffix 추가.

#### 3c. 발행 확인

curl 응답에서 `id`가 포함되면 성공. 실패 시 에러 메시지를 사용자에게 보여주고 수동 발행 안내.

### Step 4: DID.md 오래된 항목 정리

블로그 발행이 완료된 후, DID.md에서 **최근 3개 날짜(고유 날짜 기준)만 유지**하고 나머지는 삭제합니다.

#### 로직

1. DID.md에서 `## YYYY-MM-DD` 패턴의 날짜 헤더를 모두 찾습니다.
2. 고유 날짜를 추출하여 최신순 정렬합니다. (같은 날짜에 여러 항목이 있으면 같은 날짜로 카운트)
3. **최근 3개 고유 날짜에 해당하는 항목만 유지**합니다.
4. 4번째 이후 날짜의 항목은 해당 섹션 전체(`## 날짜` ~ 다음 `## 날짜` 또는 파일 끝)를 삭제합니다.

#### 예시

작업 날짜가 1일, 2일, 5일, 10일이었다면:
- 유지: 10일, 5일, 2일 (최근 3개 날짜)
- 삭제: 1일

같은 날짜에 3개 항목이 있어도 1개 날짜로 카운트:
- 2/28(1개), 2/27(3개), 2/25(2개), 2/23(1개) → 2/28, 2/27, 2/25 유지, 2/23 삭제

#### 주의사항

- `# DID` 제목 헤더는 항상 유지합니다.
- 각 날짜 섹션 사이의 `---` 구분선도 함께 관리합니다.
- 삭제된 항목은 이미 블로그에 발행되어 있으므로 데이터 유실 없음.

### Step 5: DID.md, TODO.md 커밋 + Push

Step 2~4에서 변경된 DID.md, TODO.md를 추가 커밋:

```bash
git add DID.md TODO.md
git commit -m "$(cat <<'EOF'
docs: DID.md/TODO.md 업데이트 (YYYY-MM-DD)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
git push origin main
```

### Step 6: 완료 리포트

```markdown
## 작업완료 리포트

### Git
- 커밋: <커밋 해시> — <커밋 메시지>
- Push: origin/main ✓

### TODO → DID
- 완료 처리: N개 항목
- 새로 추가: N개 항목
- DID.md 섹션: YYYY-MM-DD: <제목>

### 블로그
- 발행: <포스트 제목>
- URL: https://jyos-blog.vercel.app/blog/<slug>

### DID.md 정리
- 유지: N개 날짜 (M개 항목)
- 삭제: N개 날짜 (M개 항목)
```

## Related Files

| File | Purpose |
|------|---------|
| `DID.md` | 완료 작업 기록 (블로그 콘텐츠 원본) |
| `TODO.md` | 할 일 목록 (완료 시 DID로 이동) |
| `lib/posts.ts` | 포스트 CRUD (createPost 참고) |
| `lib/supabase.ts` | Supabase 클라이언트 |
| `.env.local` | Supabase URL/Key 환경변수 |

## Exceptions

1. **변경사항 없음** — git 변경사항이 없어도 TODO→DID 이동 및 블로그 발행은 진행
2. **Push 실패** — 네트워크 문제 등으로 push 실패 시 나머지 단계는 계속 진행, 마지막에 수동 push 안내
3. **Supabase 연결 실패** — 블로그 발행 실패 시 MDX 콘텐츠를 콘솔에 출력하여 수동 발행 가능하게 함
4. **같은 날 중복 실행** — DID.md에 같은 날짜 섹션이 이미 있으면 하위에 append, 블로그 slug에 suffix 추가
5. **완료 항목 없음** — TODO에서 완료 처리할 항목이 없어도 커밋 기반으로 DID.md 작성 및 블로그 발행 진행
