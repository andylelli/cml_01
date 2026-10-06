// Shared: load arm artifacts, editor prompts+responses, and build the contract.
import fs from 'node:fs';
export const RUNS = { A: 'resume-1791307885184', B: 'resume-1791308574179' };
const PROJ = 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db';
export const loadStore = () => JSON.parse(fs.readFileSync('C:/CML/data/store.json','utf8'));
export const artifactsFor = (store, after) => {
  const arts = Object.values(store.artifacts).filter(a => a.projectId === PROJ && a.createdAt && a.createdAt > after);
  const by = {}; for (const a of arts.sort((x,y)=>x.createdAt.localeCompare(y.createdAt))) if (!by[a.type]) by[a.type] = a.payload;
  return by;
};
export const editorCalls = (runId) => {
  const prompts = fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl','utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l))
    .filter(j => j.runId === runId && /Editor/.test(j.agent));
  const resps = fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl','utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l))
    .filter(j => j.runId === runId && /Editor/.test(j.agent) && (j.operation === 'chat_response' || j.operation === 'chat_error'));
  // pair by agent label in order
  const out = [];
  const used = new Set();
  for (const p of prompts) {
    const r = resps.find((x, i) => !used.has(i) && x.agent === p.agent && x.timestamp >= p.timestamp && (used.add(i), true));
    out.push({ agent: p.agent, user: p.messages.find(m=>m.role==='user').content, response: r?.operation === 'chat_response' ? r.response : null, op: r?.operation });
  }
  return out;
};
export const parsePrompt = (user) => {
  const idx = user.indexOf('\nTHE CHAPTER\n');
  const chapterText = user.slice(idx + '\nTHE CHAPTER\n'.length);
  const paragraphs = chapterText.split('\n\n').map(p => p.replace(/^\n+/, '')).filter(p => p.length > 0);
  const head = user.slice(0, idx);
  const findings = [];
  const re = /^  (\d+)\. \[([a-z_]+)\] (.*)\n     "(.*)"$/gm;
  let m; while ((m = re.exec(head))) findings.push({ class: m[2], note: m[3], quote: m[4] });
  const chapterNumber = Number(user.match(/^Chapter (\d+) of/)[1]);
  return { chapterNumber, paragraphs, findings };
};
