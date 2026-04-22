# cardgen — 학습 카드 HTML 생성기

Claude Code에서 `/cardgen <주제>` 한 줄로 학습 카드 HTML을 자동 생성하는 skill입니다.

AI가 주제에 맞는 학습 카드 JSON을 생성하고, 즉시 HTML 파일로 변환해 바탕화면에 저장합니다.

---

## 빠른 시작

```
/cardgen 파이썬 데코레이터
```

→ 바탕화면에 `output.html` 생성. 브라우저로 열면 됩니다.

---

## 문서

| | |
|---|---|
| [설치 방법](docs/installation.md) | 사전 조건 및 설치 스크립트 실행 |
| [/cardgen](docs/cardgen.md) | 학습 카드 생성 — 모드·옵션 상세 |
| [/cardgen-quiz](docs/cardgen-quiz.md) | 자가진단 퀴즈 — 출제 규칙·점수 밴드 |
| [/cardgen-sync](docs/cardgen-sync.md) | 템플릿 동기화 — template.html 변경 후 적용 |
| [파일 구성](docs/file-structure.md) | 저장소 파일 역할 정리 |

---

## 학습 루프

`/cardgen` (생성) → 카드 학습 → `/cardgen-quiz` (자가진단) → 오답 카드 복습 → 재시도
