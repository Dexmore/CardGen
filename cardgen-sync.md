# CardGen 템플릿 동기화

수정된 template.html을 분석해서 render-card.js, rules.md를 자동으로 업데이트합니다.

사용법:
- `/cardgen-sync` — `~/.claude/cardgen/template.html`이 이미 교체된 경우
- `/cardgen-sync /path/to/template.html` — 특정 경로의 파일을 사용하는 경우

## 1단계: 파일 읽기

**새 template.html 읽기:**

$ARGUMENTS가 있으면 그 경로의 파일을, 없으면 `$HOME/.claude/cardgen/template.html`을 Read 도구로 읽으세요.

**현재 render-card.js 읽기:**
`$HOME/.claude/cardgen/render-card.js`를 Read 도구로 읽으세요.

**현재 rules.md 읽기:**
`$HOME/.claude/cardgen/rules.md`를 Read 도구로 읽으세요.

## 2단계: 플레이스홀더 변경사항 분석

template.html에서 `[...]` 패턴의 플레이스홀더를 모두 추출하세요.

render-card.js의 `renderHtml()` 함수에서 현재 처리 중인 플레이스홀더를 모두 추출하세요.

아래 형식으로 비교 결과를 정리하세요:

```
=== 플레이스홀더 변경사항 ===
추가됨: [NEW_PLACEHOLDER], ...
삭제됨: [OLD_PLACEHOLDER], ...
유지됨: [CARD_BLOCKS], [CARD_COUNT], ...

=== 카드 구조 변경사항 ===
- study-card, study-card-body 등 클래스명 변경 여부
- 새로운 섹션 추가 여부
- 삭제된 섹션

=== 영향받는 파일 ===
- render-card.js: renderHtml(), renderCard() 등 수정 필요 항목
- rules.md: JSON 스키마 변경 필요 항목
```

## 3단계: render-card.js 수정

분석 결과를 바탕으로 render-card.js를 Edit 도구로 수정하세요.

**플레이스홀더 추가/삭제/변경 처리 규칙:**

새 플레이스홀더가 추가된 경우 (`renderHtml()` 함수 안에 추가):
- 단순 텍스트: `html = html.replace('[NEW_PLACEHOLDER]', esc(data.new_field ?? ''));`
- 반복 블록: `html = html.replace(/\[NEW_BLOCKS\]/g, buildNewBlocks(data));`
- 계산값: 필요한 helper 함수를 먼저 작성 후 inject

삭제된 플레이스홀더는 해당 `html.replace(...)` 라인을 삭제하세요.

이름이 바뀐 플레이스홀더는 문자열만 교체하세요.

**카드 구조가 변경된 경우:**
- 클래스명이 바뀌었으면 `renderCard()` 함수 내 해당 HTML 문자열을 수정
- 새 섹션이 추가됐으면 `renderCard()` 내 `cardBody` 조합 부분에 추가
- 섹션이 삭제됐으면 해당 빌더 함수 호출 및 변수 제거

## 4단계: rules.md 수정

render-card.js에서 새 JSON 필드를 참조하게 된 경우, rules.md의 JSON 스키마에도 해당 필드를 추가하세요 (Edit 도구 사용).

삭제된 필드는 rules.md에서도 제거하세요.

변경이 없으면 이 단계를 건너뛰세요.

## 5단계: 새 template.html을 로컬에 반영

$ARGUMENTS로 외부 경로 파일을 받은 경우, 해당 파일 내용을 Read 도구로 읽어서 `$HOME/.claude/cardgen/template.html`에 Write 도구로 저장하세요.

$ARGUMENTS가 없으면 (이미 교체된 경우) 이 단계를 건너뛰세요.

## 6단계: 렌더링 테스트

아래 명령으로 정상 작동을 확인하세요:

```bash
node "$HOME/.claude/cardgen/render-card.js" \
  --json "$HOME/.claude/cardgen/_temp_card.json" \
  --template "$HOME/.claude/cardgen/template.html" \
  --output "$HOME/Desktop/output_sync_test.html"
```

`_temp_card.json`이 없으면 먼저 최소 테스트 JSON을 생성하세요:
```json
{
  "title": "동기화 테스트",
  "subtitle": "템플릿 업데이트 검증",
  "tags": ["테스트", "검증", "sync"],
  "summary": ["항목1", "항목2", "항목3"],
  "cards": [{
    "question": "테스트 질문",
    "difficulty": "초급",
    "type": "개념 이해",
    "badges": ["badge1"],
    "key_formula": "테스트 공식",
    "concept": {
      "core_principle": "핵심",
      "why_it_matters": "이유",
      "practical_example": "예시",
      "learning_method": "방법",
      "common_misconceptions": "실수"
    },
    "real_world_usage": "",
    "learning_roadmap": "",
    "example_situation": "",
    "example_code": "",
    "code_language": "",
    "tips": "",
    "warnings": "",
    "explain_mode": {},
    "related_questions": [],
    "progress_checklist": ["항목1", "항목2"],
    "prerequisite": ""
  }]
}
```

## 7단계: 결과 보고

```
=== cardgen-sync 완료 ===
✅ template.html 반영
✅ render-card.js 수정
  - 추가: [NEW_PLACEHOLDER] → data.new_field
  - 삭제: [OLD_PLACEHOLDER]
  - 변경: renderCard() 내 클래스명 업데이트
✅/⚠️ rules.md [업데이트 완료 / 변경 없음]
✅ 렌더링 테스트 통과

GitHub 커밋 준비 완료:
  ~/.claude/cardgen/template.html
  ~/.claude/cardgen/render-card.js
  ~/.claude/cardgen/rules.md (변경 시)
```

오류가 발생하면 원인을 분석하고 render-card.js를 수정 후 재시도하세요.
