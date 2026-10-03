// A_110 0.6 — the case-noun guard's witness: it must FIRE on a planted literal (CLAUDE.md probe rule), stay
// quiet on comments, generic words and the baseline, and report a baseline row whose hit is gone.
import { test } from "node:test";
import assert from "node:assert/strict";
import { caseNounsOf, commonWordsOf, literalsOf, scan, againstBaseline } from "../case-noun-guard.mjs";

const artifacts = [
  { projectId: "p1", type: "cast", payload: { cast: { characters: [{ name: "Dr. Isolde Varnaby" }, { name: "Tom Baker" }] } } },
  { projectId: "p1", type: "location_profiles", payload: { primary: { name: "Grimsworth Lodge", place: "Quillhaven" }, keyLocations: [{ name: "Drawing Room" }, { name: "Access Corridor" }] } },
];
const common = commonWordsOf(["the drawing room had an access corridor and a baker who baked bread in the lodge"]);
const nouns = caseNounsOf(artifacts, common);

test("collects coined nouns and full names, not ordinary words", () => {
  for (const n of ["Isolde Varnaby", "Varnaby", "Grimsworth Lodge", "Grimsworth", "Quillhaven", "Tom Baker"]) assert.ok(nouns.has(n), n);
  for (const n of ["Baker", "Drawing Room", "Access Corridor", "Access", "Lodge"]) assert.ok(!nouns.has(n), n);
});

test("fires on a planted literal and ignores comments", () => {
  const src = [
    "// Isolde Varnaby was the case that motivated this — a comment citing evidence is allowed",
    "/* Quillhaven, likewise */",
    'const line = "Set the scene in a village such as Quillhaven";',
    "const ok = `a drawing room off the access corridor`;",
  ].join("\n");
  const hits = scan(["planted.ts"], nouns, () => src);
  assert.deepEqual(hits.map((h) => [h.noun, h.line]), [["Quillhaven", 3]]);
});

test("literalsOf keeps strings that contain //", () => {
  const lits = literalsOf('const u = "see http://x.example/Varnaby";');
  assert.equal(lits.length, 1);
});

test("the baseline silences known hits and names stale rows", () => {
  const hits = [{ file: "a.ts", noun: "Quillhaven", line: 3 }, { file: "b.ts", noun: "Varnaby", line: 9 }];
  const { fresh, stale } = againstBaseline(hits, [{ file: "a.ts", noun: "Quillhaven" }, { file: "c.ts", noun: "Grimsworth" }]);
  assert.deepEqual(fresh.map((h) => h.noun), ["Varnaby"]);
  assert.deepEqual(stale.map((b) => b.noun), ["Grimsworth"]);
});
