import { loadStore, artifactsFor, editorCalls, parsePrompt, RUNS } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
export const buildContract = (after) => {
  const store = loadStore();
  const a = artifactsFor(store, after);
  const device = a.hard_logic_devices?.devices?.[0];
  const input = {
    cml: a.cml ?? {}, clues: a.clues ?? null, outline: a.outline ?? null, cast: a.cast?.cast ?? null,
    profiles: a.character_profiles ?? null, world: a.world_document, locations: a.location_profiles,
    temporal: a.temporal_context, setting: a.setting, lockedFacts: device?.lockedFacts ?? [],
    humourLevel: 'classic', primaryAxis: 'identity', targetLength: 'short', proofSteps: false, falseLead: false,
  };
  const contract = PE.buildBookContract(input);
  const castNames = (a.cast?.cast?.characters ?? []).map(c => String(c.name).trim()).filter(Boolean);
  return { contract, castNames, artifacts: a, lockedFacts: (device?.lockedFacts ?? []).map(f => String(f.value ?? '').trim()).filter(Boolean) };
};
if (process.argv[1].endsWith('contract.mjs')) {
  const { contract, castNames, lockedFacts } = buildContract('2026-10-06T17:43');
  console.log('chapters', contract.scenes.length, 'reveal', contract.roles.reveal, 'cast', castNames.length, 'locked', lockedFacts);
  // Validate: rebuild the "WHAT THIS CHAPTER OWES" block and compare with the logged prompt
  const calls = editorCalls(RUNS.B);
  let match = 0, total = 0;
  for (const c of calls) {
    const p = parsePrompt(c.user);
    const rebuilt = PE.buildEditorPrompt({ chapter: { paragraphs: p.paragraphs }, chapterNumber: p.chapterNumber, findings: p.findings, scene: contract.scenes.find(s => s.chapter === p.chapterNumber) });
    total++; if (rebuilt === c.user) match++; else {
      const a = rebuilt.split('\n'), b = c.user.split('\n');
      const i = a.findIndex((l, k) => l !== b[k]);
      console.log(c.agent, 'first diff line', i, JSON.stringify(a[i])?.slice(0,150), '|', JSON.stringify(b[i])?.slice(0,150));
    }
  }
  console.log('prompts reproduced byte-exact', match, 'of', total);
}
