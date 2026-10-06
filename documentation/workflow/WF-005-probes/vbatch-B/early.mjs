// vbatch-B: reads the RECORDED scores in the checkpoints (the OFF baseline as the runs scored it); rescore.mjs re-scores OFF and ON.
import fs from 'node:fs';
import path from 'node:path';
const PE = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js');
const files = process.argv.slice(2);
const split = (t) => t.split(/(?<=[.!?]["”’]?)\s+/);
let totalHits = 0, decided = 0; const verbs = {};
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const s of c.segments) {
    const fails = s.drafts.map(d => PE.rankingFailures(d.score));
    const earlyCounts = s.drafts.map(d => d.score.hard.filter(h => h.kind === 'culprit_early').length);
    for (const d of s.drafts) for (const h of d.score.hard.filter(h => h.kind === 'culprit_early')) {
      totalHits++;
      const culprit = h.detail.split(' named as the murderer')[0];
      const ch = d.chapters.find(x => x.number === h.chapter) ?? d.chapters[0];
      const text = (ch.paragraphs ?? []).join('\n');
      const sents = split(text.replace(/\n/g, ' ')).filter(x => PE.namesAsCulprit(x, culprit));
      for (const x of sents) {
        const m = x.match(/\b(killed|murdered|poisoned|strangled|throttled|struck|stabbed|shot|drowned|smothered|suffocated|bludgeoned|pushed|cut|confess\w*|responsible|guilty|custody|led away|is the (?:killer|murderer|culprit)|did it)\b/i);
        const v = m ? m[1].toLowerCase() : '?'; verbs[v] = (verbs[v] ?? 0) + 1;
        console.log(`${path.basename(f).slice(20, 52)} seg${s.index} d${d.attempt}${d.attempt === s.chosen ? '*' : ' '} ch${h.chapter} [${culprit}] ${v}: "${x.slice(0, 170)}"`);
      }
      if (sents.length === 0) console.log(`${path.basename(f).slice(20, 52)} seg${s.index} d${d.attempt} ch${h.chapter} [${culprit}] (cross-sentence match only)`);
    }
    // was the choice decided by culprit_early?
    if (earlyCounts.some(n => n > 0) && !earlyCounts.every(n => n === earlyCounts[0])) {
      const minFail = Math.min(...fails);
      const without = s.drafts.map((d, i) => fails[i] - earlyCounts[i]);
      const minWithout = Math.min(...without);
      const poolWith = s.drafts.filter((d, i) => fails[i] === minFail).map(d => d.attempt);
      const poolWithout = s.drafts.filter((d, i) => without[i] === minWithout).map(d => d.attempt);
      if (poolWith.join() !== poolWithout.join()) { decided++; console.log(`   -> seg${s.index}: culprit_early changes the eligible pool from [${poolWithout}] to [${poolWith}], chosen ${s.chosen}`); }
    }
  }
}
console.log({ totalHits, poolChanged: decided, verbs });
