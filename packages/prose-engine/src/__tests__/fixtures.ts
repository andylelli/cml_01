/**
 * The archive, as contract inputs.
 *
 * `data/store.json` holds every artifact of every project this pipeline has run — 66 with a cast,
 * 58 with clues. It is the only corpus this project has, and A_99 §10's whole reason for making the
 * engine pure is that its decisions can be replayed over it for £0. A test that needs a paid run to
 * find a defect will not be run.
 *
 * Absent store ⇒ an empty list and the suites skip, so a checkout without the archive is still green.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ContractInput } from "../types.js";

const here = dirname(fileURLToPath(import.meta.url));

/** `packages/prose-engine/src/__tests__` → the repo root. */
const repoRoot = join(here, "..", "..", "..", "..");

export interface ArchiveProject {
  projectId: string;
  input: ContractInput;
  /** Raw artifacts, for a test that needs something the contract does not carry. */
  artifacts: Record<string, unknown>;
}

const unwrapArtifact = (value: unknown, keys: string[]): unknown => {
  const v = value as Record<string, unknown> | null;
  if (!v || typeof v !== "object") return value;
  for (const key of keys) {
    const inner = v[key];
    if (inner && typeof inner === "object") return inner;
  }
  return value;
};

let cached: ArchiveProject[] | null = null;

export const loadArchive = (): ArchiveProject[] => {
  if (cached) return cached;
  const path = join(repoRoot, "data", "store.json");
  if (!existsSync(path)) {
    cached = [];
    return cached;
  }
  let store: { artifacts?: Array<{ projectId?: string; type?: string; payload?: unknown }> };
  try {
    store = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    cached = [];
    return cached;
  }
  const byProject = new Map<string, Record<string, unknown>>();
  for (const artifact of store.artifacts ?? []) {
    const id = String(artifact?.projectId ?? "");
    const type = String(artifact?.type ?? "");
    if (!id || !type) continue;
    if (!byProject.has(id)) byProject.set(id, {});
    // Latest wins — the same rule `latestArtifact` uses when a resume re-persists a stage.
    byProject.get(id)![type] = artifact.payload;
  }

  const out: ArchiveProject[] = [];
  for (const [projectId, artifacts] of byProject) {
    const outline = unwrapArtifact(artifacts.outline, ["narrative", "outline"]) as ContractInput["outline"];
    if (!outline || !Array.isArray((outline as { acts?: unknown }).acts)) continue;
    const cast = unwrapArtifact(artifacts.cast, ["cast"]) as ContractInput["cast"];
    out.push({
      projectId,
      artifacts,
      input: {
        cml: artifacts.cml ?? {},
        clues: (artifacts.clues ?? null) as ContractInput["clues"],
        outline,
        cast,
        profiles: (artifacts.character_profiles ?? null) as ContractInput["profiles"],
        world: artifacts.world_document,
        locations: artifacts.location_profiles,
        temporal: artifacts.temporal_context,
        setting: artifacts.setting,
        lockedFacts: readLockedFacts(artifacts.hard_logic_devices),
        humourLevel: "classic",
      },
    });
  }
  cached = out;
  return cached;
};

/** The primary device's locked facts — where Agent 3b puts them and Agent 9 reads them. */
const readLockedFacts = (devices: unknown): Array<Record<string, unknown>> => {
  const list = (devices as { devices?: unknown[] } | null)?.devices;
  const primary = Array.isArray(list) ? (list[0] as { lockedFacts?: unknown } | undefined) : undefined;
  const facts = primary?.lockedFacts;
  return Array.isArray(facts) ? (facts as Array<Record<string, unknown>>) : [];
};

/** Projects that carry everything the contract wants. The strictest replay set. */
export const completeProjects = (): ArchiveProject[] =>
  loadArchive().filter(
    (p) =>
      Boolean(p.artifacts.cml) &&
      Boolean(p.artifacts.clues) &&
      Boolean(p.artifacts.cast) &&
      Boolean(p.artifacts.character_profiles),
  );
