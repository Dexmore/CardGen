# cardgen — 학습 카드 HTML 생성기

Claude Code에서 `/cardgen <주제>` 한 줄로 학습 카드 HTML을 자동 생성하는 skill입니다.

AI가 주제에 맞는 학습 카드 JSON을 생성하고, 즉시 HTML 파일로 변환해 바탕화면에 저장합니다.

## 사전 조건

- [Claude Code](https://claude.ai/code) 설치
- [Node.js](https://nodejs.org) v18 이상 설치

## 설치

```bash
git clone https://github.com/Dexmore/cardgen.git
cd cardgen
bash install.sh
```

## 사용법

Claude Code에서 아래 명령어를 입력하세요:

```
/cardgen 파이썬 데코레이터
/cardgen SQL 인덱스 [면접 모드] 카드 4개
/cardgen 세계 2차대전 원인 [시험 모드] 카드 5개
```

생성된 파일은 **바탕화면(Desktop)** 에 `output.html`로 저장됩니다.

## 지원 모드

| 모드 | 트리거 키워드 | 설명 |
|---|---|---|
| 개념 학습 (기본) | 없음 | 개념 이해 중심 카드 |
| 면접 모드 | `[면접 모드]` | 30초/1분 답변, 심화 질문 포함 |
| 시험 모드 | `[시험 모드]` | 예상 문제, 오답 포인트, 암기 트릭 포함 |

## 파일 구성

| 파일 | 설명 |
|---|---|
| `cardgen.md` | Claude Code skill 정의 |
| `rules.md` | AI 카드 생성 규칙 및 JSON 스키마 |
| `template.html` | 카드 HTML 템플릿 |
| `render-card.js` | JSON → HTML 변환 Node.js 스크립트 |
| `install.sh` | 설치 스크립트 |
