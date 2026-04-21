# cardgen — 학습 카드 HTML 생성기

Claude Code에서 `/cardgen <주제>` 한 줄로 학습 카드 HTML을 자동 생성하는 skill입니다.

AI가 주제에 맞는 학습 카드 JSON을 생성하고, 즉시 HTML 파일로 변환해 바탕화면에 저장합니다.

---

## 사전 조건

- [Claude Code](https://claude.ai/code) 설치
- [Node.js](https://nodejs.org) v18 이상 설치

---

## 설치

### 1. 저장소 클론

```bash
git clone https://github.com/Sundae-unity-dev/CardGen.git
cd CardGen
```

### 2. 설치 스크립트 실행

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Mac / Linux / Git Bash:**
```bash
bash install.sh
```

설치가 완료되면 터미널 창은 닫아도 됩니다.

---

## 사용법

> ⚠️ 아래 명령어는 터미널이 아닌 **Claude Code** 에서 입력해야 합니다.

### Claude Code 실행

> 💡 **설치 후 Claude Code를 새로 열어야** 새 스킬(`/cardgen`, `/cardgen-sync`)이 인식됩니다.
> 이미 열려 있었다면 완전히 종료 후 다시 실행하세요.

설치 후 Claude Code를 실행하세요.

- **Windows**: 시작 메뉴에서 `Claude` 검색 후 실행, 또는 터미널에서 `claude` 입력
- **Mac**: Spotlight에서 `Claude` 검색 후 실행, 또는 터미널에서 `claude` 입력

### /cardgen — 학습 카드 생성

Claude Code 입력창에 아래처럼 입력하세요:

```
/cardgen 파이썬 데코레이터
/cardgen SQL 인덱스 [면접 모드] 카드 4개
/cardgen 세계 2차대전 원인 [시험 모드] 카드 5개
```

잠시 후 **바탕화면(Desktop)** 에 `output.html` 파일이 생성됩니다. 브라우저로 열면 됩니다.

> 💡 **처음 실행 시** Claude Code가 명령어 실행 권한을 요청하는 팝업을 띄울 수 있습니다. **Allow** 를 눌러야 정상 작동합니다.

#### 지원 모드

| 모드 | 트리거 키워드 | 설명 |
|---|---|---|
| 개념 학습 (기본) | 없음 | 개념 이해 중심 카드 |
| 면접 모드 | `[면접 모드]` | 30초/1분 답변, 심화 질문 포함 |
| 시험 모드 | `[시험 모드]` | 예상 문제, 오답 포인트, 암기 트릭 포함 |

### /cardgen-quiz — 학습 카드 자가진단

방금 `/cardgen` 으로 생성한 카드셋(또는 지정한 카드 JSON)에서 객관식 8문항을 자동 출제합니다. 한 문항씩 인터랙티브로 풀고, 점수 밴드별 피드백과 오답 해설을 받습니다.

```
# 직전에 /cardgen 으로 만든 카드셋으로 바로 퀴즈
/cardgen-quiz

# 새 주제로 카드 생성 후 이어서 퀴즈
/cardgen-quiz 파이썬 데코레이터

# 특정 경로의 카드 JSON으로 퀴즈
/cardgen-quiz C:\Users\사용자명\Desktop\my_cards.json
```

출제 규칙:
- 정확히 8문항 (1~4 개념 이해, 5~8 실전 활용)
- 3~4개 선택지, 응답 전 정답 비공개
- 문항은 카드의 `concept` / `key_formula` / `real_world_usage` / `example_situation` 필드에서만 파생

점수 밴드:

| 점수 | 등급 | 다음 행동 |
|---|---|---|
| 7~8 | 🌟 마스터 | 다음 주제로 이동 |
| 5~6 | 👍 거의 완료 | 틀린 문항의 출처 카드 복습 |
| 3~4 | 📚 성장중 | 카드셋 재학습 후 재시도 |
| 0~2 | 🔁 재시작 | 난이도 낮추거나 선수 개념부터 |

**학습 루프**: `/cardgen` (생성) → 카드 학습 → `/cardgen-quiz` (자가진단) → 오답 카드 복습 → 재시도

### /cardgen-sync — 템플릿 동기화

`template.html`을 수정한 뒤 Claude Code에서 실행하면, 변경된 내용에 맞춰 `render-card.js`와 `rules.md`를 자동으로 업데이트합니다.

```
# ~/.claude/cardgen/template.html을 직접 교체한 경우
/cardgen-sync

# 특정 경로의 파일을 지정하는 경우 (Windows)
/cardgen-sync C:\Users\사용자명\Downloads\template.html

# 특정 경로의 파일을 지정하는 경우 (Mac/Linux)
/cardgen-sync ~/Downloads/template.html
```

---

## 파일 구성

| 파일 | 설명 |
|---|---|
| `cardgen.md` | `/cardgen` skill 정의 |
| `cardgen-quiz.md` | `/cardgen-quiz` skill 정의 |
| `cardgen-sync.md` | `/cardgen-sync` skill 정의 |
| `rules.md` | AI 카드 생성 규칙 및 JSON 스키마 |
| `template.html` | 카드 HTML 템플릿 |
| `render-card.js` | JSON → HTML 변환 Node.js 스크립트 |
| `install.ps1` | 설치 스크립트 (Windows PowerShell) |
| `install.sh` | 설치 스크립트 (Mac / Linux / Git Bash) |
