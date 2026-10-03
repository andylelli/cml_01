/**
 * ORC-13 / A5-14 (CR-31): small shared text patterns, each previously copied byte-for-byte across packages.
 */

/** A canonical clue id: `clue_` then letters, digits, `_` or `-` (case-insensitive). No `g` flag, so `.test` is stateless. */
export const CANONICAL_CLUE_ID_RE = /^clue_[a-z0-9_-]+$/i;

/** Escape a literal for use inside a RegExp source. */
export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
