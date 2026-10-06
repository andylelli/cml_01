// V-10: the audit's two "person as object" sentences among the 125 figurative-prone matches (fp.mjs), OFF and ON,
// with the case's victim as the contract carries it. Expect the real accusation kept and the figurative one dropped.
const PE = await import("file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js");
const rows = [
  // canary_1789156244431: culprit Gwendolyn Vance, victim Bertram Norbury
  ["Gwendolyn Vance", { victim: "Bertram Norbury", cast: [] }, "Gwendolyn Vance left the rehearsal room during the silent intermission, struck Bertram Norbury on the head with a heavy baton, and returned before the music resumed at twenty minutes past four."],
  // canary_1785694688532: culprit Hugo Vane, victim Sylvia Trent; the name fp.mjs tested was "Eleanor"
  ["Eleanor Voss", { victim: "Sylvia Trent", cast: [] }, "That single contradiction-Eleanor's departure from the party, minutes before eleven-struck Hugo as the first thread in a tapestry of secrets."],
];
for (const [name, people, text] of rows) {
  const off = PE.namesAsCulprit(text, name, people);
  process.env.PROSE_V2_AUDIT_FIXES = "1";
  const on = PE.namesAsCulprit(text, name, people);
  delete process.env.PROSE_V2_AUDIT_FIXES;
  console.log(`OFF ${off} ON ${on} [${name}] ${text.slice(0, 110)}`);
}
