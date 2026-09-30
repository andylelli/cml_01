/**
 * CR-22 (ORC-05) — the two boolean idioms the worker's agents repeat, each once.
 *
 * ORC-05 counted eight parse idioms across the pipeline. These are the two the worker's own flags use
 * most, written out inline at every site: default-OFF flags accept `1|true|yes|on` (any case), and
 * default-ON flags are on unless set to `0|false|no|off`. Each helper is the site's expression verbatim —
 * no trim, the same words — so moving a flag onto it changes no flag's vocabulary (R1). Accepting one
 * vocabulary everywhere, with a warning on unknown values, is ORC-Q05 (R2, the owner's).
 *
 * Call inside a getter, never at module scope (ADR-0004): `module-const-flag-check.mjs` recognises these
 * calls as flag reads and fails a module-level one, as it does a bare `process.env` read.
 */

/** A default-OFF flag: on for `1`, `true`, `yes`, `on` (any case). */
export const envOn = (name: string): boolean => /^(1|true|yes|on)$/i.test(process.env[name] ?? "");

/** A default-ON flag: off only for `0`, `false`, `no`, `off` (any case). */
export const envNotOff = (name: string): boolean => !/^(0|false|no|off)$/i.test(process.env[name] ?? "");
