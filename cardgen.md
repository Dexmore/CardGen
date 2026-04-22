# 학습 카드 HTML 자동 생성

주제: $ARGUMENTS

다음 단계를 순서대로 실행하세요.

## 1단계: rules.md 읽기
`$HOME/.claude/cardgen/rules.md` 파일을 Read 도구로 읽으세요.

## 2단계: JSON 생성
rules.md의 규칙을 엄격히 따라 "$ARGUMENTS" 주제에 맞는 학습 카드 JSON을 생성하세요.
- 카드 수: 별도 지정 없으면 3개 이상
- 출력 형식: 순수 JSON 객체만 (코드블록 래퍼 없이)

## 3단계: JSON 파일로 저장
Write 도구로 `$HOME/.claude/cardgen/_temp_card.json` 경로에 JSON을 저장하세요 (UTF-8).

## 4단계: HTML 렌더링
아래 명령어를 실행하세요:
```
node "$HOME/.claude/cardgen/render-card.js" --json "$HOME/.claude/cardgen/_temp_card.json" --template "$HOME/.claude/cardgen/template.html" --output "$HOME/Desktop/output.html"
```

## 5단계: 결과 보고
성공하면 `~/Desktop/output.html` 경로와 카드 수를 사용자에게 알려주세요.
오류가 발생하면 오류 메시지를 분석해 수정 후 재시도하세요.
