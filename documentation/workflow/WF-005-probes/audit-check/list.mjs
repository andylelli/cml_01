import fs from 'node:fs';
const f = 'C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl';
const lines = fs.readFileSync(f,'utf8').split('\n').filter(Boolean);
for (const l of lines) { const j = JSON.parse(l); console.log(j.timestamp, j.agent, j.runId, j.operation, Object.keys(j).join(',').slice(0,120)); }
