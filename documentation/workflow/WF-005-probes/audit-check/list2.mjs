import fs from 'node:fs';
const f = 'C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl';
const lines = fs.readFileSync(f,'utf8').split('\n').filter(Boolean);
const ops = {};
for (const l of lines) { const j = JSON.parse(l); const k = (j.agent||'')+'|'+j.operation; ops[k]=(ops[k]||0)+1; }
console.log(lines.length);
for (const [k,v] of Object.entries(ops)) if (/Editor|Critic/.test(k)) console.log(v,k);
const ed = lines.map(l=>JSON.parse(l)).find(j=>/Editor/.test(j.agent||'') && /response/.test(j.operation||''));
console.log(JSON.stringify(ed).slice(0,1500));
