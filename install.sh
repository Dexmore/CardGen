#!/bin/bash
# cardgen skill 설치 스크립트 (Mac / Linux / Windows Git Bash)

set -e

CARDGEN_DIR="$HOME/.claude/cardgen"
COMMANDS_DIR="$HOME/.claude/commands"

echo "📦 cardgen skill 설치 중..."

# 디렉토리 생성
mkdir -p "$CARDGEN_DIR"
mkdir -p "$COMMANDS_DIR"

# 에셋 파일 복사
cp rules.md "$CARDGEN_DIR/rules.md"
cp template.html "$CARDGEN_DIR/template.html"
cp render-card.js "$CARDGEN_DIR/render-card.js"

# skill 파일 복사
cp cardgen.md "$COMMANDS_DIR/cardgen.md"

echo ""
echo "✅ 설치 완료!"
echo ""
echo "사용법: Claude Code에서 /cardgen <주제> 를 입력하세요."
echo "예시: /cardgen 파이썬 데코레이터"
echo "      /cardgen SQL 인덱스 [면접 모드] 카드 4개"
echo ""
echo "생성된 파일은 ~/Desktop/output.html 에 저장됩니다."
