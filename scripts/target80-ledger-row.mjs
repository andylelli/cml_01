// Ledger helper (TARGET_80_LEDGER.md §1–§4): print one run's scoreboard row from its report JSON.
//   node scripts/target80-ledger-row.mjs <path-to-report.json> [...more]
// Pure read-only; extracts gate status (SHIPPED = passed|warning), score, rubric caps/categories,
// clue visibility, and the reliability-relevant warnings.
import fs from "fs";

for (const p of process.argv.slice(2)) {
  const r = JSON.parse(fs.readFileSync(p, "utf8"));
  // A_70 §4: a report left behind by a run whose finalization failed is a PARTIAL snapshot — it can
  // read `overall_score: 96 / run_outcome: passed` for a run that actually scored 66 with chapters
  // failing validation (measured: mystery-1785175520689). The API corrects this on read (A_44 R5a);
  // this script reads the file directly, so it must check for itself. Loud, and never silently
  // scored as a real row.
  if (r.in_progress === true || r.stale === true || r.incomplete === true) {
    console.log(`run=${r.run_id}`);
    console.log(`  *** PARTIAL / STALE SNAPSHOT — NOT A RUN RESULT. Do not enter in the ledger. ***`);
    console.log(`  reason=${r.stale_reason ?? r.incomplete_reason ?? "in_progress snapshot (run never finalized)"}`);
    console.log(`  (upstream-only figures follow for diagnosis) score=${r.overall_score}/${r.overall_grade} phases_failed=${r.summary?.phases_failed ?? "-"}`);
    console.log("");
    continue;
  }
  const gate = r.release_gate_outcome ?? {};
  const rub = (r.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? {};
  const gs = (r.diagnostics ?? []).find((d) => d.key === "agent9_prose_release_gate_summary")?.details ?? {};
  const shipped = gate.status === "passed" || gate.status === "warning";
  const cats = (rub.categories ?? []).map((c) => `${c.category}:${c.mark}`).join(" ");
  console.log(`run=${r.run_id}`);
  console.log(`  gate=${gate.status} (hard=${gate.hard_stop_count} warn=${gate.warning_count}) SHIPPED=${shipped} run_outcome=${r.run_outcome}`);
  console.log(`  score=${r.overall_score}/${r.overall_grade} rubric=${rub.final ?? "-"} (raw=${rub.raw_total ?? "-"}) caps=[${(rub.caps_applied ?? []).join(", ")}]`);
  console.log(`  cost=£${r.total_cost} min=${(r.total_duration_ms / 60000).toFixed(1)}`);
  console.log(`  clue_visibility=${gs.clue_visibility_extracted_count}/${gs.clue_visibility_expected_count} missing=[${(gs.clue_visibility_missing_expected_ids ?? []).join(", ")}]`);
  console.log(`  gate_warnings=[${(gs.release_gate_warnings ?? []).join(" | ")}]`);
  console.log(`  gate_hard_stops=[${(gs.release_gate_hard_stops ?? []).join(" | ")}]`);
  console.log(`  categories: ${cats}`);
  console.log(`  abort=${r.aborted ?? false}${r.abort_reason ? ` (${r.abort_reason})` : ""}`);
  console.log("");
}
