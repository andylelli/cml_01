/**
 * CR-22 (ORC-05) — the two boolean idioms the worker's agents repeat, each once.
 *
 * ORC-05 counted eight parse idioms across the pipeline. These are the two the worker's own flags use
 * most, written out inline at every site: default-OFF flags accept `1|true|yes|on` (any case), and
 * default-ON flags are on unless set to `0|false|no|off`. Since owner decision 9 (ORC-Q05, 2026-10-01) both
 * are @cml/cml's readBooleanFlag: the one vocabulary, trimmed, with a warning on any other value.
 *
 * Call inside a getter, never at module scope (ADR-0004): `module-const-flag-check.mjs` recognises these
 * calls as flag reads and fails a module-level one, as it does a bare `process.env` read.
 */

import { readBooleanFlag } from "@cml/cml";

/** A default-OFF flag: on for `1`, `true`, `yes`, `on` (any case). */
export const envOn = (name: string): boolean => readBooleanFlag(name, false);

/** A default-ON flag: off only for `0`, `false`, `no`, `off` (any case). */
export const envNotOff = (name: string): boolean => readBooleanFlag(name, true);
