#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

// --- CLI args ---
const argv = process.argv.slice(2);
function getArg(flag) { const i = argv.indexOf(flag); return i !== -1 ? argv[i+1] : null; }
const jsonPath    = getArg('--json');
const templatePath = getArg('--template');
const outputPath  = getArg('--output') || 'output.html';

if (!jsonPath || !templatePath) {
  console.error('Usage: node render-card.js --json <file.json> --template <template.html> [--output <output.html>]');
  process.exit(1);
}

const jsonRaw     = fs.readFileSync(jsonPath,     'utf-8');
const templateHtml = fs.readFileSync(templatePath, 'utf-8');

// ─── JSON 오류 자동 교정 ───────────────────────────────────────────────────────
function fixJsonErrors(s) {
  const result = []; const stack = []; let inString = false; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (inString) {
      result.push(ch);
      if (ch === '\\' && i + 1 < s.length) { result.push(s[i+1]); i += 2; continue; }
      if (ch === '"') inString = false;
    } else {
      if (ch === '"') { inString = true; result.push(ch); }
      else if (ch === '[') { stack.push('['); result.push(ch); }
      else if (ch === '{') { stack.push('{'); result.push(ch); }
      else if (ch === ']') { if (stack.length && stack[stack.length-1]==='[') stack.pop(); result.push(ch); }
      else if (ch === '}') {
        if (stack.length && stack[stack.length-1]==='[') { stack.pop(); result.push(']'); }
        else { if (stack.length && stack[stack.length-1]==='{') stack.pop(); result.push(ch); }
      } else { result.push(ch); }
    }
    i++;
  }
  return result.join('').replace(/,(\s*[}\]])/g, '$1');
}

// ─── 렌더링 유틸 ─────────────────────────────────────────────────────────────
function esc(s) {
  return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function ensureList(v, len=0, def='') {
  if(v==null)v=[];
  if(typeof v==='string')v=[v];
  if(!Array.isArray(v))v=[];
  while(v.length<len)v.push(def);
  return v;
}
const HL_MAP={'~':'study-highlight cool','!':'study-highlight pink','+':'study-highlight green','*':'study-highlight purple'};
function applyHL(text) {
  return String(text??'').replace(/(?<!=)==([~!+*]?)([^=\n]+?)==(?!=)/g,(_,p,inner)=>{
    return `<span class="${HL_MAP[p]||'study-highlight'}">${esc(inner)}</span>`;
  });
}
const CHIP_MAP={'경험 기반 역량':'skill','가치관':'value','업무 태도':'attitude','문제 해결':'problem','개념 이해':'skill','실전 활용':'value','실수 포인트':'attitude','심화 탐구':'problem'};
function injectChip(text) {
  const raw=String(text??'');
  for(const [kw,cls] of Object.entries(CHIP_MAP)){
    if(raw.includes(kw)) return `<span class="study-qa-chip ${cls}">${esc(kw)}</span>${applyHL(raw.replace(kw,'').trim())}`;
  }
  return applyHL(raw);
}
function hlSentence(text,v=''){
  return `<span class="${v==='cool'?'study-highlight cool':'study-highlight'}">${esc(text)}</span>`;
}
function toggleBox(title,inner,open=false){
  if(!inner.trim())return'';
  return `<details class="study-toggle-box"${open?' open':''}><summary class="study-toggle-head"><h4>${title}</h4><span class="study-toggle-arrow">▶</span></summary><div class="study-toggle-body">${inner}</div></details>`;
}
function optBox(title,inner){
  if(!inner.trim())return'';
  return `<div class="study-box"><h4>${esc(title)}</h4>${inner}</div>`;
}
const DIFF_MAP={초급:'beginner',중급:'intermediate',고급:'advanced'};
const TYPE_CLS={'경험 기반 역량':'study-type-skill','가치관':'study-type-value','업무 태도':'study-type-attitude','문제 해결':'study-type-problem','개념 이해':'study-type-skill','실전 활용':'study-type-value','실수 포인트':'study-type-attitude','심화 탐구':'study-type-problem'};

function buildFormulaBox(formula){
  if(!formula||!String(formula).trim())return'';
  return `<div class="study-formula-box" style="background:linear-gradient(135deg,rgba(111,44,255,.07),rgba(122,53,255,.05));border:1.5px solid rgba(111,44,255,.2);border-radius:10px;padding:13px 16px;margin-top:12px;display:flex;align-items:flex-start;gap:10px"><span class="study-formula-icon" style="font-size:18px;flex-shrink:0">💡</span><span class="study-formula-text" style="font-size:15px;font-weight:700;color:#2d1a5e;line-height:1.7">${applyHL(String(formula))}</span></div>`;
}
function buildRealWorldBox(rw){
  if(!rw||typeof rw!=='object')return'';
  const parts=[];
  if(rw.industry_case)parts.push(`<p style="margin:0 0 10px;font-size:15px;color:#1e4a42;line-height:1.82"><strong>실제 사례:</strong> ${applyHL(rw.industry_case)}</p>`);
  const ctx=rw.context||rw.tools_and_context||'';
  if(ctx)parts.push(`<p style="margin:0 0 10px;font-size:15px;color:#1e4a42;line-height:1.82"><strong>관련 맥락:</strong> ${applyHL(ctx)}</p>`);
  if(rw.before_after)parts.push(`<p style="margin:0;font-size:15px;color:#1e4a42;line-height:1.82"><strong>적용 전→후:</strong> ${applyHL(rw.before_after)}</p>`);
  if(!parts.length)return'';
  return toggleBox('🏢 실무/현실 활용',
    `<div class="study-realworld-box" style="background:linear-gradient(135deg,rgba(20,184,166,.08),rgba(16,185,129,.05));border:1px solid rgba(20,184,166,.22);border-radius:10px;padding:14px 16px">`+
    `<div class="study-realworld-label" style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#0d7a6a;letter-spacing:.05em;text-transform:uppercase;margin-bottom:10px">💼 REAL WORLD</div>`+
    `<div>${parts.join('')}</div></div>`
  );
}
function buildRoadmapBox(rm){
  if(!rm||typeof rm!=='object')return'';
  const prev=ensureList(rm.prerequisites,0,'').filter(Boolean);
  const curr=String(rm.current_topic||'');
  const next=ensureList(rm.next_steps,0,'').filter(Boolean);
  if(!prev.length&&!curr&&!next.length)return'';
  const prevHtml=prev.length?`<div class="study-roadmap-item prev" style="flex:1;min-width:110px;background:rgba(54,162,235,.08);border:1px solid rgba(54,162,235,.2);border-radius:8px;padding:11px 13px;display:flex;flex-direction:column;gap:5px"><span class="study-roadmap-badge" style="font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#1558b0">📚 선행 학습</span><span style="font-size:13px;line-height:1.6;color:#3a3254;font-weight:500">${prev.map(p=>esc(p)).join('<br>')}</span></div>`:'';
  const currHtml=curr?`<div class="study-roadmap-item curr" style="flex:1;min-width:110px;background:rgba(111,44,255,.09);border:1.5px solid rgba(111,44,255,.22);border-radius:8px;padding:11px 13px;display:flex;flex-direction:column;gap:5px"><span class="study-roadmap-badge" style="font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#5a14e8">📍 현재</span><span style="font-size:13px;line-height:1.6;color:#3a3254;font-weight:500">${esc(curr)}</span></div>`:'';
  const nextHtml=next.length?`<div class="study-roadmap-item next" style="flex:1;min-width:110px;background:rgba(255,159,64,.08);border:1px solid rgba(255,159,64,.22);border-radius:8px;padding:11px 13px;display:flex;flex-direction:column;gap:5px"><span class="study-roadmap-badge" style="font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#9a6000">🚀 다음 단계</span><span style="font-size:13px;line-height:1.6;color:#3a3254;font-weight:500">${next.map(n=>esc(n)).join('<br>')}</span></div>`:'';
  return toggleBox('🗺 학습 로드맵',`<div class="study-roadmap-box"><div class="study-roadmap-row" style="display:flex;gap:8px;flex-wrap:wrap">${prevHtml}${currHtml}${nextHtml}</div></div>`);
}
function buildProgressCss(qid,total){
  const lines=[];
  lines.push(`#${qid}-progress .study-progress-state{display:none}`);
  lines.push(`#${qid}-progress .state-0{display:inline}`);
  lines.push(`#${qid}-progress .study-progress-fill{width:0%}`);
  const combos=1<<total;
  for(let mask=0;mask<combos;mask++){
    const checkedCount=[...Array(total)].filter((_,i)=>(mask>>i)&1).length;
    const pct=Math.round(checkedCount/total*100);
    const hasParts=[...Array(total)].map((_,i)=>
      `:has(#${qid}-check-${i+1}:${(mask>>i)&1?'':'not(:'}checked${(mask>>i)&1?'':')'})`
    ).join('');
    const sel=`#${qid}-progress${hasParts}`;
    lines.push(`${sel} .study-progress-state{display:none}`);
    lines.push(`${sel} .state-${checkedCount}{display:inline}`);
    lines.push(`${sel} .study-progress-fill{width:${pct}%}`);
  }
  return `<style data-p="1">${lines.join('')}</style>`;
}
function buildProgressBox(qid,checklist){
  const total=checklist.length;
  const items=checklist.map((item,i)=>{
    const cid=`${qid}-check-${i+1}`;
    return `<div class="study-check-row"><input class="study-check-input" type="checkbox" id="${cid}" /><label class="study-check-item" for="${cid}"><span class="study-check-ui"></span><span class="study-check-text">${esc(item)}</span></label></div>`;
  }).join('');
  const stateSpans=[...Array(total+1)].map((_,i)=>
    `<span class="study-progress-state state-${i}">${i} / ${total} 완료 · ${Math.round(i/total*100)}%</span>`
  ).join('');
  return buildProgressCss(qid,total)+
    `<div class="study-progress-box" id="${qid}-progress">`+
    `<div class="study-progress-head"><h4>학습 체크리스트</h4><div class="study-progress-meta">${stateSpans}</div></div>`+
    `<div class="study-progress-bar"><div class="study-progress-fill"></div></div>`+
    `<div class="study-checklist">${items}</div></div>`;
}
function buildInlineStatus(qid){
  const labels=[['notyet','미학습','❌'],['understood','이해','✅'],['review','복습','🔄'],['mastered','완료','🏆']];
  const inputs=labels.map(([k])=>`<input class="study-status-input" type="radio" name="${qid}-hd-status" id="${qid}-hd-${k}" value="${k}" />`).join('');
  const chips=labels.map(([k,label,icon])=>`<label class="study-status-chip ${k}" style="font-size:11px;padding:4px 10px" for="${qid}-hd-${k}">${icon} ${label}</label>`).join('');
  return `<div class="study-inline-status" style="margin-top:8px;position:relative">${inputs}<div class="study-status-row">${chips}</div></div>`;
}
function renderCard(card,idx,isFirst){
  const qRaw=String(card.question??'');
  const diff=String(card.difficulty??'초급');
  const diffKey=DIFF_MAP[diff]||'beginner';
  const qtype=String(card.type??'개념 이해');
  const typeCls=TYPE_CLS[qtype]||'study-type-skill';
  const badges=ensureList(card.badges,3,'');
  const badgesHtml=badges.filter(Boolean).map(b=>`<span class="study-badge">${esc(b)}</span>`).join('');
  const concept=card.concept??{};
  const CONCEPT_STYLES={
    'concept-card-core':{card:'background:rgba(111,44,255,.07);border-left:3px solid rgba(111,44,255,.4);border-radius:8px;padding:13px 15px;margin-bottom:8px',label:'color:#5a14e8'},
    'concept-card-why':{card:'background:rgba(59,130,246,.07);border-left:3px solid rgba(59,130,246,.4);border-radius:8px;padding:13px 15px;margin-bottom:8px',label:'color:#1d58c0'},
    'concept-card-ex':{card:'background:rgba(20,184,166,.07);border-left:3px solid rgba(20,184,166,.4);border-radius:8px;padding:13px 15px;margin-bottom:8px',label:'color:#0d7a6a'},
    'concept-card-learn':{card:'background:rgba(245,158,11,.07);border-left:3px solid rgba(245,158,11,.4);border-radius:8px;padding:13px 15px;margin-bottom:8px',label:'color:#92600a'},
    'concept-card-warn':{card:'background:rgba(239,68,68,.06);border-left:3px solid rgba(239,68,68,.35);border-radius:8px;padding:13px 15px;margin-bottom:8px',label:'color:#b91c1c'},
  };
  const conceptFields=[
    ['core_principle','핵심 원리','🔑','concept-card-core'],
    ['why_it_matters','왜 중요한가','💡','concept-card-why'],
    ['practical_example','실전 예시','🛠','concept-card-ex'],
    ['learning_method','학습 방법','📚','concept-card-learn'],
    ['common_misconceptions','자주 하는 실수','⚠️','concept-card-warn'],
  ];
  const conceptHtml=conceptFields.map(([k,label,icon,cls])=>{
    if(!concept[k])return'';
    const st=CONCEPT_STYLES[cls];
    return `<div class="concept-card ${cls}" style="${st.card}">`+
      `<div class="concept-card-label" style="display:flex;align-items:center;gap:7px;margin-bottom:6px">`+
      `<span class="concept-icon" style="font-size:14px">${icon}</span>`+
      `<strong style="font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;${st.label}">${label}</strong></div>`+
      `<div class="concept-card-body" style="font-size:15px;line-height:1.82;color:#3a3254">${applyHL(concept[k])}</div></div>`;
  }).join('');
  const formulaHtml=buildFormulaBox(card.key_formula);
  const realWorldHtml=buildRealWorldBox(card.real_world_usage);
  const roadmapHtml=buildRoadmapBox(card.learning_roadmap);
  const expects=ensureList(card.interviewer_expects,0,'');
  const expectsHtml=expects.filter(Boolean).map(e=>`<li>${injectChip(e)}</li>`).join('');
  const expectsSection=expectsHtml?toggleBox('💬 면접관이 바라는 점',`<ul class="study-list study-qa-list">${expectsHtml}</ul>`):'';
  const em=card.explain_mode??card.interview_mode??{};
  const oneLiner=em.one_liner||'';
  const ans30=em.summary_30s||em.answer_30s||'';
  const ans1m=em.detail_1m||em.answer_1m||'';
  const deepQ=em.deep_question||em.followup_question||'';
  const deepA=em.deep_answer||em.followup_answer||'';
  const ivParts=[];
  if(oneLiner)ivParts.push(`<div class="study-answer-block" style="border-left-color:#7a35ff;margin-bottom:10px"><p style="font-size:14px;font-weight:700;color:#5a14e8">${applyHL(oneLiner)}</p></div>`);
  if(ans30)ivParts.push(`<div class="study-followup-wrap" style="margin-top:10px"><div class="study-followup-q"><span class="study-followup-label">⏱ 30초 핵심 요약</span></div><div class="study-followup-a"><p>${applyHL(ans30)}</p></div></div>`);
  if(ans1m)ivParts.push(`<div class="study-followup-wrap" style="margin-top:10px"><div class="study-followup-q"><span class="study-followup-label">📝 1분 상세 답변</span></div><div class="study-followup-a"><p>${applyHL(ans1m)}</p></div></div>`);
  if(deepQ&&deepA)ivParts.push(`<div class="study-followup-wrap" style="margin-top:10px"><div class="study-followup-q"><span class="study-followup-label">⚡ 심화 질문</span><p class="study-followup-qtext">${esc(deepQ)}</p></div><div class="study-followup-a"><span class="study-followup-alabel">✅ 모범 답변</span><p>${applyHL(deepA)}</p></div></div>`);
  const ivSection=ivParts.length?toggleBox('🎤 설명해보기',ivParts.join('')):'';
  const ex=card.exam_mode??{};
  const examParts=[];
  if(ex.likely_question)examParts.push(`<div class="concept-card concept-card-why"><div class="concept-card-label"><span class="concept-icon">📝</span><strong>예상 문제</strong></div><div class="concept-card-body">${applyHL(ex.likely_question)}</div></div>`);
  if(ex.answer_point)examParts.push(`<div class="concept-card concept-card-core"><div class="concept-card-label"><span class="concept-icon">🎯</span><strong>핵심 답안 포인트</strong></div><div class="concept-card-body">${applyHL(ex.answer_point)}</div></div>`);
  if(ex.wrong_choices)examParts.push(`<div class="concept-card concept-card-warn"><div class="concept-card-label"><span class="concept-icon">❌</span><strong>자주 나오는 오답</strong></div><div class="concept-card-body">${applyHL(ex.wrong_choices)}</div></div>`);
  if(ex.memory_tip)examParts.push(`<div class="concept-card concept-card-learn"><div class="concept-card-label"><span class="concept-icon">🧠</span><strong>암기 트릭</strong></div><div class="concept-card-body">${applyHL(ex.memory_tip)}</div></div>`);
  const examSection=examParts.length?toggleBox('📋 시험 대비',examParts.join('')):'';
  const related=ensureList(card.related_questions,2);
  const relatedHtml=related.filter(Boolean).map(r=>`<span class="study-related">${esc(r)}</span>`).join('');
  const checklist=ensureList(card.progress_checklist,4);
  const sitRaw=String(card.example_situation??'');
  const exHtml=sitRaw?`<p>${hlSentence(sitRaw)}</p>`:'';
  const codeLang=esc(card.code_language||'code');
  const codeSrc=String(card.example_code??'').trim();
  let codeHtml='';
  if(codeSrc){
    const codeFormatted=codeSrc.split('\n').map(line=>line.trim()===''?'<br>':esc(line)).join('\n');
    codeHtml=`<div class="study-code"><div class="study-code-head"><div class="study-card-actions"><strong>${codeLang}</strong><span>예제 코드</span></div></div><pre><code>${codeFormatted}</code></pre></div>`;
  }
  const tipHtml=card.tips?`<div class="study-tip"><strong>실전 TIP:</strong> ${applyHL(card.tips)}</div>`:'';
  const warnHtml=card.warnings?`<div class="study-warning"><strong>주의사항:</strong> ${applyHL(card.warnings)}</div>`:'';
  let exCodeSection='';
  if(exHtml&&codeHtml)exCodeSection=toggleBox('💻 예제 상황 & 코드',exHtml+codeHtml);
  else if(codeHtml)exCodeSection=toggleBox('💻 예제 코드',codeHtml);
  else if(exHtml)exCodeSection=toggleBox('📌 예제 상황',exHtml);
  const tipWarn=(tipHtml||warnHtml)?toggleBox('⚡ TIP & 주의사항',tipHtml+warnHtml):'';
  const cardBody=
    `<div class="study-chip-row study-badge-row">${badgesHtml}</div>`+formulaHtml+
    toggleBox('📖 개념 정리',conceptHtml)+realWorldHtml+roadmapHtml+
    expectsSection+ivSection+examSection+exCodeSection+tipWarn+
    optBox('🔗 연관 질문',`<div class="study-chip-row">${relatedHtml}</div>`)+
    `<div class="study-box">${buildProgressBox(`q${idx}`,checklist)}</div>`;
  const head=
    `<div class="study-card-title-wrap">`+
    `<div class="study-index">Q${idx}</div>`+
    `<div class="study-question"><h3>${applyHL(qRaw)}</h3>`+
    `<div class="study-chip-row"><span class="study-mini-chip level-${diffKey}">${diff}</span><span class="study-mini-chip ${typeCls}">${qtype}</span></div>`+
    buildInlineStatus(`q${idx}`)+`</div></div>`;
  return `<details class="study-card study-${diffKey}"${isFirst?' open':''} data-card-id="q${idx}"><summary class="study-card-head">${head}<span class="study-card-arrow">▶</span></summary><div class="study-card-body">${cardBody}</div></details>`;
}
function buildDiffSteps(cards){
  return cards.map((c,i)=>{
    const key=DIFF_MAP[String(c.difficulty??'초급')]||'beginner';
    const q=String(c.question??'').slice(0,40);
    return `<a class="study-step-item study-step-${key}" data-target="q${i+1}" href="#q${i+1}"><span class="study-step-num">Q${i+1}</span><span class="study-step-label">${esc(q)}…</span></a>`;
  }).join('');
}
function buildOverallProgress(total){
  if(!total)return'';
  const checks=Array.from({length:total},(_,i)=>`<input class="study-check-input" type="checkbox" id="overall-check-${i+1}" />`).join('');
  return `<div class="study-progress-box" id="study-overall-progress">${checks}<div class="study-progress-head"><h4>전체 학습 진행도</h4><span class="study-progress-meta" id="study-overall-meta">0 / ${total}</span></div><div class="study-progress-bar"><div class="study-progress-fill" id="study-overall-fill"></div></div></div>`;
}
function buildDiffStat(cards){
  const counts={초급:0,중급:0,고급:0};
  for(const c of cards) counts[String(c.difficulty??'초급')]=(counts[String(c.difficulty??'초급')]||0)+1;
  return Object.entries(counts).filter(([,v])=>v>0).map(([k,v])=>`${k} ${v}`).join(' · ')||'-';
}
function findPrimaryLang(cards){
  const langs={};
  for(const c of cards){const l=String(c.code_language??'').trim();if(l)langs[l]=(langs[l]||0)+1;}
  const e=Object.entries(langs);
  return e.length?e.sort((a,b)=>b[1]-a[1])[0][0]:'-';
}
function minifyCss(css){
  return css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{}:;,>])\s*/g,'$1').replace(/;}/g,'}').trim();
}
function minifyHtml(html){
  const stash=[];
  const mark=(m)=>{stash.push(m);return`\x00${stash.length-1}\x00`;};
  html=html.replace(/<pre[\s\S]*?<\/pre>/gi,mark);
  html=html.replace(/<script[\s\S]*?<\/script>/gi,mark);
  html=html.replace(/<style[\s\S]*?<\/style>/gi,mark);
  html=html.replace(/>\s+</g,'><').replace(/\n+/g,'').trim();
  html=html.replace(/\x00(\d+)\x00/g,(_,i)=>{
    let block=stash[+i];
    if(/^<style[^>]*>/i.test(block)&&!/data-p/i.test(block)){
      const inner=block.replace(/^<style[^>]*>/i,'').replace(/<\/style>$/i,'');
      block=`<style>${minifyCss(inner)}</style>`;
    }
    return block;
  });
  return html;
}
function renderHtml(data, templateHtml) {
  const tags=ensureList(data.tags,3,'');
  let summary=ensureList(data.summary,3,'');
  if(!summary.some(Boolean))summary=['핵심 개념을 먼저 이해하고, 실제 예제와 연결해서 보는 것이 가장 빠르다.','단순 암기보다 흐름과 맥락을 설명할 수 있어야 면접과 실무에서 강하다.','실수 포인트와 경계값을 함께 점검하면 학습 완성도가 훨씬 올라간다.'];
  const cards=Array.isArray(data.cards)?data.cards:[];
  const cardBlocksHtml=cards.map((c,i)=>renderCard(c,i+1,i===0)).join('');
  let html=templateHtml;
  html=html.replace('[수집된 카드 제목]',esc(data.title??''));
  html=html.replace('[수집된 부제목]',esc(data.subtitle??''));
  for(let i=0;i<3;i++)html=html.replace(`[태그명 ${i+1}]`,esc(tags[i]));
  for(let i=0;i<3;i++){
    const item=summary[i]?applyHL(summary[i]):'';
    html=html.replace(`[핵심 요약 ${i+1}]`,item);
  }
  html=html.replace('[CARD_COUNT]',String(cards.length));
  html=html.replace('[PRIMARY_TAG]',esc(findPrimaryLang(cards)));
  html=html.replace('[ESTIMATED_TIME]',`${cards.length*7}분`);
  html=html.replace('[CURRENT_STATUS]',esc(buildDiffStat(cards)));
  html=html.replace(/\[DIFFICULTY_STEPS\]/g,buildDiffSteps(cards));
  html=html.replace(/\[OVERALL_PROGRESS\]/g,buildOverallProgress(cards.length));
  html=html.replace(/\[CARD_BLOCKS\]/g,cardBlocksHtml);
  html=html.replace('<span>현재 상태</span>','<span>난이도 구성</span>');
  const timerJs=`<script>(function(){document.addEventListener("click",function(e){var a=e.target.closest(".study-step-link");if(!a)return;e.preventDefault();var id=a.getAttribute("data-target");var card=document.querySelector('.study-card[data-card-id="'+id+'"]');if(card){card.open=true;card.scrollIntoView({behavior:"smooth"});}});})();<\/script>`;
  return minifyHtml(html+timerJs);
}

// ─── 실행 ─────────────────────────────────────────────────────────────────────
let data;
try {
  let cleaned = jsonRaw.replace(/^```json\s*/,'').replace(/\s*```$/,'');
  cleaned = fixJsonErrors(cleaned);
  data = JSON.parse(cleaned);
} catch(e) {
  console.error('JSON 파싱 오류:', e.message);
  process.exit(1);
}

const result = renderHtml(data, templateHtml);
fs.writeFileSync(outputPath, result, 'utf-8');
console.log(`생성 완료: ${outputPath} (카드 ${data.cards?.length || 0}개)`);
