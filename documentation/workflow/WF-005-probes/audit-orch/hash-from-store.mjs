import { pathToFileURL } from "node:url";
const arm = process.argv[3];
for (const k of ["CML_VERIFIED_FIXES","CML_PROMPT_TRIMS","PROSE_V2_SEGMENT_CHAPTERS"]) process.env[k] = "1";
for (const k of ["PROSE_V2_CONTRACT_FIXES","PROSE_V2_OPENING","PROSE_V2_SELECTOR_RANKS","PROSE_V2_TAIL_FINDING"]) process.env[k] = arm === "B" ? "1" : "";
const run = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/agents/agent9-v2/run.js").href);
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const hyd = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/resume-hydration.js").href);
const store = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/artifact-store.js").href);
const { hashContract } = await import(pathToFileURL("C:/CML/apps/worker/dist/jobs/agents/agent9-v2/checkpoint.js").href);
const pid = process.argv[2];
const st = store.loadArtifactStore("C:/CML");
const { bundle } = hyd.loadResumeBundle(st, pid, "prose");
const spec = store.specToInputs(store.resolveProjectSpec("C:/CML", pid).spec ?? {});
const ctx = { inputs: spec, primaryAxis: spec.primaryAxis, warnings: [] };
hyd.applyResumeBundle(ctx, bundle);
const contract = pe.buildBookContract(run.buildContractInput(ctx));
const plan = pe.planSegments(contract, 32768, { chaptersPerCall: 1 });
const h = hashContract({
  chapters: contract.book.chapters, reveal: contract.roles.reveal, aftermath: contract.roles.aftermath,
  clueIds: contract.scenes.flatMap(s => s.mustSurface.map(m => m.id)),
  plan: plan.segments.map(s => s.chapters.join("-")).join("|"),
  prompt: [contract.bible.text, contract.brief.text, ...contract.scenes.map(s => run.renderSceneContract(contract, s.chapter)), pe.writerFormatInstruction(contract.scenes.map(s => s.chapter))].join("\n"),
});
console.log(`arm ${arm}: contract hash ${h}`);
console.log("book words", JSON.stringify(contract.book.words), "per-chapter preferred", contract.scenes.map(s => s.words.preferred).join(","));
