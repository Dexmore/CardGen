# cardgen — 학습 카드 HTML 생성기

Claude Code에서 `/cardgen <주제>` 한 줄로 학습 카드 HTML을 자동 생성하는 skill입니다.

AI가 주제에 맞는 학습 카드 JSON을 생성하고, 즉시 HTML 파일로 변환해 바탕화면에 저장합니다.

## 사전 조건

- [Claude Code](https://claude.ai/code) 설치
- [Node.js](https://nodejs.org) v18 이상 설치

## 설치

```bash
git clone https://github.com/Sundae-unity-dev/CardGen.git
cd CardGen
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Mac / Linux / Git Bash:**
```bash
bash install.sh
```

## 스킬 목록

| 스킬 | 설명 |
|---|---|
| `/cardgen <주제>` | 주제에 맞는 학습 카드 HTML 생성 |
| `/cardgen-sync` | 수정된 template.html에 맞춰 나머지 파일 자동 업데이트 |

---

## /cardgen — 학습 카드 생성

### 사용법

```
/cardgen 파이썬 데코레이터
/cardgen SQL 인덱스 [면접 모드] 카드 4개
/cardgen 세계 2차대전 원인 [시험 모드] 카드 5개
```

생성된 파일은 **바탕화면(Desktop)** 에 `output.html`로 저장됩니다.

### 지원 모드

| 모드 | 트리거 키워드 | 설명 |
|---|---|---|
| 개념 학습 (기본) | 없음 | 개념 이해 중심 카드 |
| 면접 모드 | `[면접 모드]` | 30초/1분 답변, 심화 질문 포함 |
| 시험 모드 | `[시험 모드]` | 예상 문제, 오답 포인트, 암기 트릭 포함 |

---

## /cardgen-sync — 템플릿 동기화

`template.html`을 수정했을 때 사용합니다. 변경된 플레이스홀더와 카드 구조를 분석해 `render-card.js`와 `rules.md`를 자동으로 업데이트합니다.

### 사용법

```
# ~/.claude/cardgen/template.html을 직접 교체한 경우
/cardgen-sync

# 특정 경로의 파일을 지정하는 경우
/cardgen-sync /path/to/수정된_template.html
```

### 동작 순서

1. 새 `template.html`의 플레이스홀더(`[...]`) 추출 및 변경사항 분석
2. `render-card.js` — 추가/삭제/변경된 플레이스홀더에 맞게 수정
3. `rules.md` — JSON 스키마 변경이 필요한 경우 업데이트
4. 렌더링 테스트로 정상 작동 확인
5. 변경된 항목 보고

---

## 파일 구성

| 파일 | 설명 |
|---|---|
| `cardgen.md` | `/cardgen` skill 정의 |
| `cardgen-sync.md` | `/cardgen-sync` skill 정의 |
| `rules.md` | AI 카드 생성 규칙 및 JSON 스키마 |
| `template.html` | 카드 HTML 템플릿 |
| `render-card.js` | JSON → HTML 변환 Node.js 스크립트 |
| `install.ps1` | 설치 스크립트 (Windows PowerShell) |
| `install.sh` | 설치 스크립트 (Mac / Linux / Git Bash) |
