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
| `cardgen-sync.md` | `/cardgen-sync` skill 정의 |
| `rules.md` | AI 카드 생성 규칙 및 JSON 스키마 |
| `template.html` | 카드 HTML 템플릿 |
| `render-card.js` | JSON → HTML 변환 Node.js 스크립트 |
| `install.ps1` | 설치 스크립트 (Windows PowerShell) |
| `install.sh` | 설치 스크립트 (Mac / Linux / Git Bash) |
