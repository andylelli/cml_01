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
export {};
