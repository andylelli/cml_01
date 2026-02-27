#!/usr/bin/env node
/**
 * migrate-validation-artifacts.ts
 *
 * §3.4 — One-time migration for legacy projects generated before the pipeline
 * began persisting per-phase validation artifacts:
 *   - setting_validation
 *   - cast_validation
 *   - clues_validation
 *   - outline_validation
 *
 * For setting_validation and cast_validation the data is back-filled from the
 * existing setting / cast artifacts (which carry realism / diversity sub-objects).
 *
 * For clues_validation and outline_validation the pipeline warnings that normally
 * populate these were not stored in the DB, so legacy projects receive a
 * "migrated — assuming passed" placeholder.
 *
 * Usage:
 *   cd apps/api
 *   npx tsx src/scripts/migrate-validation-artifacts.ts
 *
 * The script is idempotent — projects that already have all four validation
 * artifacts are left untouched.
 */

import { createRepository } from "../db.js";

interface ValidationArtifact {
  valid: boolean;
  errors: string[];
  warnings: string[];
  note?: string;
}

async function main() {
  const repo = await createRepository();
  const projects = await repo.listProjects();

  console.log(`\nmigrate-validation-artifacts: processing ${projects.length} project(s)…\n`);

  let created = 0;
  let alreadyPresent = 0;
  let noSourceArtifact = 0;

  for (const project of projects) {
    const pid = project.id;
    console.log(`  Project: ${project.name} (${pid})`);

    // ── setting_validation ──────────────────────────────────────────────────
    const existingSettingVal = await repo.getLatestArtifact(pid, "setting_validation");
    if (existingSettingVal) {
      alreadyPresent++;
    } else {
      const settingArtifact = await repo.getLatestArtifact(pid, "setting");
      if (settingArtifact) {
        const settingRealism = (settingArtifact.payload as any)?.setting?.realism ?? {};
        const errors: string[] = [
          ...((settingRealism.anachronisms as string[] | undefined) ?? []).map(
            (a) => `Anachronism: ${a}`,
          ),
          ...((settingRealism.implausibilities as string[] | undefined) ?? []).map(
            (i) => `Implausibility: ${i}`,
          ),
        ];
        const artifact: ValidationArtifact = {
          valid: errors.length === 0,
          errors,
          warnings: [],
          note: "Migrated from setting artifact",
        };
        await repo.createArtifact(pid, "setting_validation", artifact, null);
        console.log(`    ✓ setting_validation created (${errors.length} error(s))`);
        created++;
      } else {
        console.log(`    ⚠ setting_validation skipped — no setting artifact found`);
        noSourceArtifact++;
      }
    }

    // ── cast_validation ─────────────────────────────────────────────────────
    const existingCastVal = await repo.getLatestArtifact(pid, "cast_validation");
    if (existingCastVal) {
      alreadyPresent++;
    } else {
      const castArtifact = await repo.getLatestArtifact(pid, "cast");
      if (castArtifact) {
        const castDiversity = (castArtifact.payload as any)?.cast?.diversity ?? {};
        const errors: string[] = (castDiversity.stereotypeCheck as string[] | undefined) ?? [];
        const warnings: string[] = (castDiversity.recommendations as string[] | undefined) ?? [];
        const artifact: ValidationArtifact = {
          valid: errors.length === 0,
          errors,
          warnings,
          note: "Migrated from cast artifact",
        };
        await repo.createArtifact(pid, "cast_validation", artifact, null);
        console.log(`    ✓ cast_validation created (${errors.length} error(s), ${warnings.length} warning(s))`);
        created++;
      } else {
        console.log(`    ⚠ cast_validation skipped — no cast artifact found`);
        noSourceArtifact++;
      }
    }

    // ── clues_validation ────────────────────────────────────────────────────
    // Clue-coverage warnings are derived from pipeline run-time warnings which
    // are not stored in the DB, so legacy projects get a "passed" placeholder.
    const existingCluesVal = await repo.getLatestArtifact(pid, "clues_validation");
    if (existingCluesVal) {
      alreadyPresent++;
    } else {
      const cluesArtifact = await repo.getLatestArtifact(pid, "clues");
      if (cluesArtifact) {
        const artifact: ValidationArtifact = {
          valid: true,
          errors: [],
          warnings: [],
          note: "Migrated — no clue-warning data available for legacy run; assuming passed",
        };
        await repo.createArtifact(pid, "clues_validation", artifact, null);
        console.log(`    ✓ clues_validation created (legacy default — passed)`);
        created++;
      } else {
        console.log(`    ⚠ clues_validation skipped — no clues artifact found`);
        noSourceArtifact++;
      }
    }

    // ── outline_validation ──────────────────────────────────────────────────
    // Outline-coverage-gap warnings are similarly only available at run time.
    const existingOutlineVal = await repo.getLatestArtifact(pid, "outline_validation");
    if (existingOutlineVal) {
      alreadyPresent++;
    } else {
      const outlineArtifact = await repo.getLatestArtifact(pid, "outline");
      if (outlineArtifact) {
        const artifact: ValidationArtifact = {
          valid: true,
          errors: [],
          warnings: [],
          note: "Migrated — no outline-coverage data available for legacy run; assuming passed",
        };
        await repo.createArtifact(pid, "outline_validation", artifact, null);
        console.log(`    ✓ outline_validation created (legacy default — passed)`);
        created++;
      } else {
        console.log(`    ⚠ outline_validation skipped — no outline artifact found`);
        noSourceArtifact++;
      }
    }
  }

  console.log(`
─────────────────────────────────────
Migration complete:
  • Created:          ${created} validation artifact(s)
  • Already present:  ${alreadyPresent} (unchanged)
  • No source data:   ${noSourceArtifact} (project has no base artifact to derive from)
─────────────────────────────────────`);
}

main().catch((err: unknown) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
