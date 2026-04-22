#!/bin/bash
# cardgen skill 설치 스크립트 (Mac / Linux / Windows Git Bash)

set -e

CARDGEN_DIR="$HOME/.claude/cardgen"
COMMANDS_DIR="$HOME/.claude/commands"

echo "📦 cardgen skill 설치 중..."

# 디렉토리 생성
mkdir -p "$CARDGEN_DIR"
mkdir -p "$COMMANDS_DIR"

ASSET_FILES=(rules.md template.html render-card.js)
COMMAND_FILES=(cardgen.md cardgen-quiz.md cardgen-sync.md)

for f in "${ASSET_FILES[@]}";   do cp "$f" "$CARDGEN_DIR/$f";   done
for f in "${COMMAND_FILES[@]}"; do cp "$f" "$COMMANDS_DIR/$f"; done

echo ""
echo "✅ 설치 완료!"
echo ""
echo "사용법: Claude Code에서 /cardgen <주제> 를 입력하세요."
echo "예시: /cardgen 파이썬 데코레이터"
echo "      /cardgen SQL 인덱스 [면접 모드] 카드 4개"
echo ""
echo "자가진단 퀴즈: /cardgen-quiz (직전 카드셋) 또는 /cardgen-quiz <주제>"
echo "템플릿 업데이트: /cardgen-sync 또는 /cardgen-sync /path/to/template.html"
echo ""
echo "생성된 파일은 ~/Desktop/output.html 에 저장됩니다."
