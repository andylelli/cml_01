/**
 * cml-core LIVE certify-loop harness (Agent 3 redesign §9.1 spike steps 2–3).
 *
 * Proves the last unverified falsification criterion: can the real model READ a
 * `SOLUTION_NOT_UNIQUE` counterexample from the deterministic certifier and CONVERGE — via a
 * propose→verify→repair loop — to a clean fair-play certificate, in a bounded number of turns,
 * without cheating (the action space forbids removing a suspect).
 *
 * The certifier is ground truth; the model is just the proposer. The loop itself is the pure,
 * unit-tested `runCertifyLoop` from @cml/cml-core — this harness only supplies an LLM-backed
 * proposer and prints the trace.
 *
 * Requires Azure OpenAI credentials; skips gracefully without them.
 *   AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME [, AZURE_OPENAI_API_VERSION]
 *
 * Run:  node scripts/cml-core-certify-loop.mjs
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import {
  runCertifyLoop,
  certify,
  clockSetFastBroken,
  lockedStudyBroken,
  uniqueMeansBroken,
} from "../packages/cml-core/dist/index.js";

// Pick the case with CML_LOOP_CASE = clock | locked | means (default clock).
const CASES = { clock: clockSetFastBroken, locked: lockedStudyBroken, means: uniqueMeansBroken };
const CASE_KEY = (process.env.CML_LOOP_CASE || "clock").toLowerCase();
const startingCase = (CASES[CASE_KEY] || clockSetFastBroken);

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
const API_KEY = process.env.AZURE_OPENAI_API_KEY || "";
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini";
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
const MAX_TURNS = Number(process.env.CML_LOOP_MAX_TURNS || 6);

const line = (s = "") => console.log(s);

const ACTION_SCHEMA = `Respond with EXACTLY ONE JSON action (no prose). PREFER the first one:
{"op":"extend_presence","suspectId":"<id>","location":"<precluding locationId the suspect is ALREADY at>","interval":{"start":<minutes>,"end":<minutes>},"worded":"<reader-facing sentence>"}
   → WIDENS the suspect's existing presence at that location to cover the window (or adds one), then attaches it to the eliminating step. Use this when the suspect is already placed somewhere — it CANNOT create a contradiction.
{"op":"eliminate_suspect","suspectId":"<id>","location":"<precluding locationId>","interval":{"start":<m>,"end":<m>},"worded":"<text>"}
   → mints a NEW alibi clue + attaches it. Only use when the suspect has NO existing whereabouts (else you risk a "two places at once" contradiction).
{"op":"establish_capability","suspectId":"<id>","capability":"<one of the crime's requiredCapabilities>","has":false,"worded":"<reader-facing sentence>"}
   → for LOCKED-ROOM / UNIQUE-MEANS cases: proves a suspect LACKS a capability the crime required (a key, the medical knowledge…), eliminating them. The solver adds the inference step.
{"op":"attach_premise","stepId":"<edge id>","clueId":"<clue id>"}
{"op":"set_culprit","culpritId":"<id>"}
{"op":"give_up","reason":"<why>"}

Rules:
- Times are minutes since midnight. To ALIBI a suspect, the location must be a PRECLUDING one (see WORLD FACTS) and the interval must COVER the whole crime window.
- RECONCILE with existing evidence: if a clue already places a suspect at a precluding location, EXTEND that presence — do NOT invent a different location (that contradicts the known clue).
- You may ONLY add/extend facts. You may NOT remove suspects. Renaming the culprit does not change which suspects the clues rule out.`;

function buildMessages(state) {
  const core = {
    entities: state.cml.entities,
    crime: state.cml.crime,
    clues: state.cml.clues,
    inferencePath: state.cml.inferencePath,
    solution: state.cml.solution,
  };

  // Fair scaffolding: state the world's rules explicitly (the model should reason within them,
  // not have to reverse-engineer the engine's reachability semantics).
  const locations = state.cml.entities.filter((e) => e.kind === "location");
  const precluding = locations.filter((l) => l.id !== state.cml.crime.location && !state.cml.crime.reachableFrom.includes(l.id));
  const reachable = locations.filter((l) => l.id === state.cml.crime.location || state.cml.crime.reachableFrom.includes(l.id));
  const spares = (state.certificate.uniqueAmong || []).filter((id) => id !== state.cml.solution.culpritId);
  const w = state.cml.crime.window;
  const precludingIds = new Set(precluding.map((l) => l.id));

  // Surface each spare suspect's KNOWN whereabouts from existing clues, so the model reconciles
  // (extends a known precluding presence) instead of inventing a contradictory new one.
  const knownPlacement = spares
    .map((id) => {
      const locs = [...new Set(state.cml.clues.filter((c) => c.kind === "presence" && c.person === id).map((c) => c.location))];
      const precludeLocs = locs.filter((l) => precludingIds.has(l));
      const tip = precludeLocs.length ? ` → EXTEND ${id}'s presence at "${precludeLocs[0]}" to cover [${w.start},${w.end}]` : "";
      return `${id} is already placed at [${locs.join(", ") || "nowhere"}]${tip}`;
    })
    .join("; ");

  const reqCaps = state.cml.crime.requiredCapabilities ?? [];
  const capLine = reqCaps.length
    ? `\n- The crime REQUIRED capabilities: ${reqCaps.join(", ")}. A suspect proven to LACK any required capability is eliminated — use establish_capability.` +
      `\n- Capability clues so far: ${state.cml.clues.filter((c) => c.kind === "capability").map((c) => `${c.person} ${c.has ? "has" : "lacks"} ${c.capability}`).join("; ") || "(none)"}`
    : "";

  const contradiction = state.certificate.failures.some((f) => /two places at once/i.test(f))
    ? `\n- WARNING: your previous repair created a "two places at once" contradiction. Do NOT place a suspect at a NEW location that conflicts with an existing clue — EXTEND their existing precluding presence instead.`
    : "";

  const hint =
    `WORLD FACTS (read carefully):\n` +
    `- Crime window to cover: [${w.start}, ${w.end}]. A clue interval ALIBIS a suspect only if start <= ${w.start} AND end >= ${w.end}.\n` +
    `- Locations where presence PRECLUDES the crime (alibi a suspect with one of these): ${precluding.map((l) => l.id).join(", ") || "(none)"}.\n` +
    `- Locations that do NOT preclude it (the scene or reachable — useless as an alibi): ${reachable.map((l) => l.id).join(", ")}.\n` +
    `- Suspects you must eliminate (every one EXCEPT the culprit "${state.cml.solution.culpritId}"): ${spares.join(", ") || "(none)"}.\n` +
    `- Their known whereabouts: ${knownPlacement || "(none)"}.\n` +
    `- After alibiing a suspect, the eliminating step is attached automatically.` +
    capLine +
    contradiction;
  const system =
    "You are repairing the LOGIC of a fair-play mystery so a deterministic certifier passes. " +
    "The certifier checks timeline consistency, deducibility (every elimination justified by its premises; no clue used before it is shown), " +
    "and solution UNIQUENESS (exactly one suspect survives the shown clues, and it is the named culprit). " +
    "Make the single best repair this turn.";
  const user =
    `CURRENT TYPED CML:\n${JSON.stringify(core, null, 2)}\n\n` +
    `CERTIFIER VERDICT (turn ${state.turn}): NOT fair-play.\nfailures:\n- ${state.certificate.failures.join("\n- ")}\n\n` +
    `${hint}\n\n` +
    `${ACTION_SCHEMA}`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function makeLlmProposer(client) {
  return async (state) => {
    const res = await client.chat({
      messages: buildMessages(state),
      temperature: 0.2,
      maxTokens: 1200,
      jsonMode: true,
      logContext: { runId: "cml-core-spike", projectId: "cml-core", agent: "Agent3-CertifyLoop", retryAttempt: state.turn },
    });
    try {
      const action = JSON.parse(res.content);
      const detail =
        action.op === "add_presence_clue" ? ` (${action.clue?.person}@${action.clue?.location} [${action.clue?.interval?.start},${action.clue?.interval?.end}])`
        : action.op === "eliminate_suspect" || action.op === "extend_presence" ? ` (${action.suspectId}@${action.location} [${action.interval?.start},${action.interval?.end}])`
        : action.op === "establish_capability" ? ` (${action.suspectId} ${action.has ? "has" : "lacks"} ${action.capability})`
        : action.op === "attach_premise" ? ` (${action.stepId} += ${action.clueId})`
        : "";
      line(`  turn ${state.turn}: model → ${action.op}${detail}`);
      return action;
    } catch (e) {
      line(`  turn ${state.turn}: model returned unparseable JSON → give_up`);
      return { op: "give_up", reason: `unparseable: ${String(e)}` };
    }
  };
}

async function main() {
  line("=".repeat(74));
  line("CML-CORE LIVE CERTIFY-LOOP  (Agent 3 redesign §9.1 spike steps 2–3)");
  line("=".repeat(74));

  // Always show the ground-truth starting point (deterministic, no creds needed).
  const start = certify(startingCase());
  line(`\nStarting case: ${startingCase().caseId} (CML_LOOP_CASE=${CASE_KEY}). Certifier verdict: ok=${start.ok}`);
  line(`  → ${start.failures.find((f) => /SOLUTION_NOT_UNIQUE/.test(f)) ?? start.failures[0]}`);

  if (!ENDPOINT || !API_KEY) {
    line("\n[skipped — live model not run]");
    line("Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY (and AZURE_OPENAI_DEPLOYMENT_NAME) to run the loop.");
    line("The loop's control flow + convergence + falsification guards are verified offline in");
    line("packages/cml-core/src/__tests__/repair-loop.test.ts (mock proposer).");
    line("=".repeat(74));
    return;
  }

  line(`\nModel: ${DEPLOYMENT} (api ${API_VERSION}). Driving propose→verify→repair, maxTurns=${MAX_TURNS}…\n`);
  const client = new AzureOpenAIClient({ endpoint: ENDPOINT, apiKey: API_KEY, defaultModel: DEPLOYMENT, apiVersion: API_VERSION });
  const result = await runCertifyLoop(startingCase(), makeLlmProposer(client), { maxTurns: MAX_TURNS });

  line("\n  per-turn certifier feedback:");
  for (const h of result.history) {
    line(`    turn ${h.turn}: ok=${h.ok}  ${h.failures[0] ?? ""}`);
  }
  line(`\nRESULT: converged=${result.converged} turns=${result.turns} stoppedReason=${result.stoppedReason}`);
  line(`  final certificate: ok=${result.certificate.ok} uniqueAmong=[${result.certificate.uniqueAmong}]`);
  const suspects = result.cml.entities.filter((e) => e.kind === "person" && e.role === "suspect");
  line(`  suspects intact (no delete-the-spare cheat): ${suspects.length} → [${suspects.map((s) => s.id)}]`);
  line(`  independent re-certify of the model's output: ok=${certify(result.cml).ok}`);
  line("\nGO/NO-GO: " + (result.converged ? "GO — the model read the counterexample and converged to a certificate." : `NO — ${result.stoppedReason}; the model did not converge within ${MAX_TURNS} turns.`));
  line("=".repeat(74));
}

main().catch((e) => { console.error("harness error:", e); process.exit(1); });
