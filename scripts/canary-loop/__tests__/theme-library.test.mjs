import test from "node:test";
import assert from "node:assert/strict";
import {
  selectCanaryTheme,
  listCanaryThemeKeys,
  CANARY_THEME_LIBRARY,
} from "../theme-library.mjs";

test("unset / empty selector keeps the YAML theme (returns null)", () => {
  assert.equal(selectCanaryTheme(undefined), null);
  assert.equal(selectCanaryTheme(""), null);
  assert.equal(selectCanaryTheme("   "), null);
});

test("unknown selector returns null (no override)", () => {
  assert.equal(selectCanaryTheme("nonexistent-family"), null);
});

test("a known key selects its premise + canonical axis", () => {
  const poison = selectCanaryTheme("poison");
  assert.equal(poison.key, "poison");
  // Canonical spelling; `psychological` was the retired one. See theme-library.mjs.
  assert.equal(poison.primaryAxis, "behavioral");
  assert.match(poison.theme, /poison/i);
  // The fair-play scaffold is always appended so the generated mystery stays well-formed.
  assert.match(poison.theme, /strict fair-play/i);
});

test("selection is case-insensitive and trimmed", () => {
  const a = selectCanaryTheme("  TIDE  ");
  assert.equal(a.key, "tide");
  assert.equal(a.primaryAxis, "temporal");
});

test("every library entry maps its mechanism keyword into the theme text", () => {
  // Guards against a future edit that breaks Agent 3b's family extraction.
  const expectedKeyword = {
    clock: /clock/i,
    poison: /poison/i,
    tide: /tidal|tide/i,
    acoustic: /gramophone|acoustic/i,
    optics: /optical|mirror|lens/i,
    identity: /impersonation|disguise|double identity/i,
  };
  for (const key of listCanaryThemeKeys()) {
    const sel = selectCanaryTheme(key);
    assert.ok(sel, `selectCanaryTheme(${key}) should resolve`);
    assert.match(sel.theme, expectedKeyword[key], `${key} theme must carry its mechanism keyword`);
    assert.ok(
      // The canonical five. This list previously held the RETIRED spellings, so it would have
      // passed while the library emitted "mechanical" — a value that now throws at run start.
      ["temporal", "spatial", "identity", "behavioral", "authority"].includes(sel.primaryAxis),
      `${key} axis must be canonical`,
    );
  }
});

test("rotate is deterministic given a seed and cycles through all keys", () => {
  const keys = listCanaryThemeKeys();
  for (let i = 0; i < keys.length * 2; i++) {
    const sel = selectCanaryTheme("rotate", i);
    assert.equal(sel.key, keys[i % keys.length]);
  }
  // Same seed → same selection (stable across resume/replay).
  assert.equal(selectCanaryTheme("rotate", 42).key, selectCanaryTheme("rotate", 42).key);
});

test("library is non-empty and well-formed", () => {
  const keys = listCanaryThemeKeys();
  assert.ok(keys.length >= 5);
  for (const k of keys) {
    assert.equal(typeof CANARY_THEME_LIBRARY[k].premise, "string");
    assert.ok(CANARY_THEME_LIBRARY[k].premise.length > 20);
  }
});
