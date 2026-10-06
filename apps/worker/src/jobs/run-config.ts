/**
 * CR-22 (ORC-05) — what a run was configured with, recorded at t=0.
 *
 * FLAG-AUDIT Addendum 5: "a run's behaviour cannot be reconstructed from its configuration." Replay
 * fixtures read the flag environment from the machine's `.env.local` at fixture time, which is not what
 * the run saw if the file changed since or a flag was set on the command line (RESUME_REDO, a probe's
 * override). This records it as the run saw it.
 *
 * It records RAW values, not parsed ones, on purpose: the pipeline still parses flags in several
 * vocabularies (ORC-05 counts eight), so a table of "effective booleans" written here would be a second
 * copy of each flag's parse, free to disagree with the site that decides — the restated-fact defect this
 * codebase has paid for four times. Raw values plus the build fingerprint written beside them reconstruct
 * the behaviour exactly. The names are GENERATED from what the code reads (run-env-names.generated.ts,
 * kept current by flags:check), so a new flag is recorded without anyone remembering to list it.
 *
 * Read at call time, inside generateMystery after dotenv has loaded (ADR-0004) — never at module load.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ScoreAggregator } from "@cml/story-validation";
import { RUN_ENV_NAMES } from "./run-env-names.generated.js";

export interface RunEnvironmentRecord {
  /** Every read flag that is set, with the value the run saw. Unset flags take their code default. */
  set: Record<string, string>;
  /** How many names were checked, so an empty `set` reads as "none set", not "nothing recorded". */
  names_checked: number;
}

export function captureRunEnvironment(env: NodeJS.ProcessEnv = process.env): RunEnvironmentRecord {
  const set: Record<string, string> = {};
  for (const name of RUN_ENV_NAMES) {
    const value = env[name];
    if (value !== undefined) set[name] = value;
  }
  return { set, names_checked: RUN_ENV_NAMES.length };
}

export const runConfigPath = (workerAppRoot: string, runId: string): string =>
  join(workerAppRoot, "logs", `run-config-${runId}.json`);

/** Beside the build fingerprint, so it exists with scoring off too. Best-effort: a record never fails a run. */
/**
 * A_111 V-20 (WF-005 V2K-05) — the code a run ran. Two runs with identical flags were taken for a matched pair while their
 * v2 code differed (P-5 ran the chapter-1 opening ranks arm B's code did not have, with 0 flag differences). The commit
 * and whether packages/ or apps/ had uncommitted changes go into the run-config FILE (not the report's diagnostic, so
 * replay digests are unchanged). null when git is unavailable.
 */
export const codeVersion = (workerAppRoot: string): { commit: string | null; dirty: boolean | null } => {
  const root = join(workerAppRoot, "..", "..");
  const git = (args: string[]): string | null => {
    try {
      return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000 }).trim();
    } catch {
      return null;
    }
  };
  const commit = git(["rev-parse", "HEAD"]);
  const status = git(["status", "--porcelain", "--", "packages", "apps"]);
  return { commit, dirty: status === null ? null : status.length > 0 };
};

export function writeRunEnvironment(
  workerAppRoot: string,
  runId: string,
  record: RunEnvironmentRecord,
  code?: { commit: string | null; dirty: boolean | null },
): void {
  try {
    mkdirSync(join(workerAppRoot, "logs"), { recursive: true });
    writeFileSync(runConfigPath(workerAppRoot, runId), JSON.stringify({ runId, recordedAt: new Date().toISOString(), ...(code ? { code } : {}), ...record }, null, 2), "utf8");
  } catch {
    /* best-effort */
  }
}

/** At t=0 of generateMystery: the record beside the build fingerprint, and as the report's `run_config` diagnostic. */
export function recordRunEnvironment(workerAppRoot: string, runId: string, scoreAggregator: ScoreAggregator | undefined): RunEnvironmentRecord {
  const record = captureRunEnvironment(process.env);
  writeRunEnvironment(workerAppRoot, runId, record, codeVersion(workerAppRoot));
  scoreAggregator?.upsertDiagnostic("run_config", "orchestrator", "Run configuration", "run_config", { ...record });
  return record;
}
