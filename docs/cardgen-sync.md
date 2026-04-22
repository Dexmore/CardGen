# /cardgen-sync — 템플릿 동기화

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

[← 목차로 돌아가기](../README.md)
