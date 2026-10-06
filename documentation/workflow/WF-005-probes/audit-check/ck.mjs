import fs from 'node:fs';
const c = JSON.parse(fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json','utf8'));
console.log(Object.keys(c));
for (const [k,v] of Object.entries(c)) console.log(k, typeof v, Array.isArray(v)? v.length : (v && typeof v==='object'? Object.keys(v).slice(0,10): String(v).slice(0,100)));
console.log(JSON.stringify(c.edits).slice(0,3000));
console.log(c.findings.anchored.length, c.findings.discarded.length);
const t={}; for (const f of c.findings.anchored) t[f.class+'|'+f.severity]=(t[f.class+'|'+f.severity]||0)+1; console.log(t);
