/**
 * Cross-run novelty ledger (ANALYSIS_49 T1.7).
 *
 * The current novelty design is blind across runs: Agent 8 / `buildNoveltyConstraints` only ever
 * compares the new CML to the static seed corpus, which is identical every run — so every run drifts
 * to the same "manipulated clock at a manor" premise (rubric `premise` frozen at 7). This module
 * persists a lightweight fingerprint of every *shipped* run and folds the most recent ones into the
 * avoidance constraints that already flow into Agent 3, pushing each new CML away from recent runs.
 *
 * Deliberately app-side and fs-backed (the `@cml/novelty` package stays pure). Reuses the SAME CML
 * fields `buildNoveltyConstraints` reads from seeds (`shared.ts`), so no fragile enum mapping is
 * needed — this is the zero-LLM divergence lever. Gated entirely behind `NOVELTY_CROSS_RUN`
 * (default off); when off, every function here is unreachable from the orchestrator.
 */

import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

/** A lightweight, shipped-run fingerprint — the avoidance-relevant fields of one CML. */
export interface PriorRunRecord {
  id: string;
  title: string;
  era: string;
  location: string;
  crimeSubtype: string;
  deathMethod: string;
  axis: string;
  falseAssumption: string;
  discrimMethod: string;
  discrimDesign: string;
  premise: string;
}

interface NoveltyLedgerFile {
  version: 1;
  shipped: PriorRunRecord[];
}

/** The avoidance/divergence constraints shape produced by `buildNoveltyConstraints`. */
export interface NoveltyConstraints {
  divergeFrom: string[];
  areas: string[];
  avoidancePatterns: string[];
}

const MAX_LEDGER_ENTRIES = 500;
const DEFAULT_WINDOW = 20;

/** Cross-run novelty is opt-in and default-OFF — the current single-run behavior is the fallback. */
export const isCrossRunNoveltyEnabled = (): boolean =>
  /^(1|true|yes|on)$/i.test(process.env.NOVELTY_CROSS_RUN ?? "");

export const noveltyLedgerPath = (): string =>
  process.env.CML_NOVELTY_LEDGER_PATH ?? path.resolve(process.cwd(), "data", "novelty-ledger.json");

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Pull the avoidance-relevant fields out of a CML CASE — mirrors `buildNoveltyConstraints`'s reads. */
export const extractPriorRunRecord = (cml: unknown, runId: string): PriorRunRecord => {
  const cmlCase = ((cml as any)?.CASE ?? cml ?? {}) as Record<string, any>;
  const meta = cmlCase.meta ?? {};
  return {
    id: runId,
    title: str(meta?.title),
    era: str(meta?.era?.decade),
    location: str(meta?.setting?.location),
    crimeSubtype: str(meta?.crime_class?.subtype),
    deathMethod: str(cmlCase?.death_method),
    axis: str(cmlCase?.false_assumption?.type),
    falseAssumption: str(cmlCase?.false_assumption?.statement),
    discrimMethod: str(cmlCase?.discriminating_test?.method),
    discrimDesign: str(cmlCase?.discriminating_test?.design),
    premise: str(cmlCase?.surface_model?.narrative?.summary),
  };
};

/** Load the ledger; tolerate a missing or corrupt file by returning an empty corpus. */
export const loadNoveltyLedger = async (ledgerPath = noveltyLedgerPath()): Promise<PriorRunRecord[]> => {
  try {
    const raw = await fs.readFile(ledgerPath, "utf-8");
    const parsed = JSON.parse(raw) as NoveltyLedgerFile;
    return Array.isArray(parsed?.shipped) ? parsed.shipped : [];
  } catch {
    return [];
  }
};

/** Append a shipped-run record, atomically (temp-write + rename), keeping the last MAX_LEDGER_ENTRIES. */
export const appendNoveltyLedger = async (
  record: PriorRunRecord,
  ledgerPath = noveltyLedgerPath(),
): Promise<void> => {
  const dir = path.dirname(ledgerPath);
  await fs.mkdir(dir, { recursive: true });
  const existing = await loadNoveltyLedger(ledgerPath);
  const shipped = [...existing, record].slice(-MAX_LEDGER_ENTRIES);
  const payload = JSON.stringify({ version: 1, shipped } satisfies NoveltyLedgerFile, null, 2);
  const tempPath = path.join(dir, `${path.basename(ledgerPath)}.${randomUUID()}.tmp`);
  await fs.writeFile(tempPath, payload, "utf-8");
  await fs.rename(tempPath, ledgerPath);
};

/** Turn prior-run records into avoidance strings — labelled "Prior run" so Agent 3 reads them as recency. */
export const priorRunAvoidancePatterns = (records: PriorRunRecord[]): string[] =>
  records.flatMap((r) =>
    [
      r.crimeSubtype ? `Prior run crime subtype: ${r.crimeSubtype}` : "",
      r.deathMethod ? `Prior run manner of death: ${r.deathMethod}` : "",
      r.axis ? `Prior run false-assumption axis: ${r.axis}` : "",
      r.falseAssumption ? `Prior run false assumption: ${r.falseAssumption}` : "",
      r.discrimMethod ? `Prior run discriminating test: ${r.discrimMethod}` : "",
    ].filter(Boolean),
  );

/**
 * Fold the most recent `windowN` shipped runs into the existing (seed-derived) constraints so Agent 3
 * is told to diverge from recent runs as well as the static seeds. Prior-run patterns are placed FIRST
 * (most actionable) and the merged list is de-duped and capped.
 */
export const mergePriorRunsIntoConstraints = (
  constraints: NoveltyConstraints,
  records: PriorRunRecord[],
  windowN = DEFAULT_WINDOW,
): NoveltyConstraints => {
  const recent = records.slice(-windowN);
  if (recent.length === 0) return constraints;
  const priorPatterns = priorRunAvoidancePatterns(recent);
  const priorTitles = recent.map((r) => r.title).filter(Boolean);
  return {
    ...constraints,
    // prior-run patterns first, then the seed-derived ones; de-duped, capped to keep the prompt lean
    avoidancePatterns: Array.from(new Set([...priorPatterns, ...constraints.avoidancePatterns])).slice(0, 20),
    divergeFrom: Array.from(new Set([...priorTitles, ...constraints.divergeFrom])).slice(0, 12),
  };
};
