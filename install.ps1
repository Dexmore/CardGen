# cardgen skill 설치 스크립트 (Windows PowerShell)

$CardgenDir = "$env:USERPROFILE\.claude\cardgen"
$CommandsDir = "$env:USERPROFILE\.claude\commands"

Write-Host "📦 cardgen skill 설치 중..."

New-Item -ItemType Directory -Force -Path $CardgenDir | Out-Null
New-Item -ItemType Directory -Force -Path $CommandsDir | Out-Null

Copy-Item rules.md         "$CardgenDir\rules.md"         -Force
Copy-Item template.html    "$CardgenDir\template.html"    -Force
Copy-Item render-card.js   "$CardgenDir\render-card.js"   -Force

Copy-Item cardgen.md       "$CommandsDir\cardgen.md"      -Force
Copy-Item cardgen-quiz.md  "$CommandsDir\cardgen-quiz.md" -Force
Copy-Item cardgen-sync.md  "$CommandsDir\cardgen-sync.md" -Force

Write-Host ""
Write-Host "✅ 설치 완료!"
Write-Host ""
Write-Host "사용법: Claude Code에서 /cardgen <주제> 를 입력하세요."
Write-Host "예시: /cardgen 파이썬 데코레이터"
Write-Host "      /cardgen SQL 인덱스 [면접 모드] 카드 4개"
Write-Host ""
Write-Host "자가진단 퀴즈: /cardgen-quiz (직전 카드셋) 또는 /cardgen-quiz <주제>"
Write-Host "템플릿 업데이트: /cardgen-sync 또는 /cardgen-sync C:\path\to\template.html"
Write-Host ""
Write-Host "생성된 파일은 바탕화면\output.html 에 저장됩니다."
