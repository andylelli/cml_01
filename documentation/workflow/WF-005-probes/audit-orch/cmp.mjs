import { readFileSync } from "node:fs";
const arts = JSON.parse(readFileSync(process.argv[2], "utf8"));
const art = arts.find(a => a.id.endsWith(process.argv[3])).payload;
const md = readFileSync(process.argv[4], "utf8");
const ck = JSON.parse(readFileSync(process.argv[5], "utf8"));
const norm = s => String(s ?? "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...").trim();
// parse md
const mdCh = md.split(/\n## Chapter \d+: /).slice(1).map(block => {
  const [titleLine, ...rest] = block.split("\n");
  const paras = rest.join("\n").replace(/\n---\s*$/,"").split(/\n\n+/).map(s => s.trim()).filter(s => s && s !== "---");
  return { title: titleLine.trim(), paras };
});
console.log("md chapters", mdCh.length, "art chapters", art.chapters.length);
let diffs = 0;
art.chapters.forEach((c, i) => {
  const a = c.paragraphs.map(norm).filter(Boolean);
  const m = mdCh[i]?.paras ?? [];
  if (norm(c.title) !== mdCh[i]?.title) console.log("TITLE DIFF ch", i+1, JSON.stringify(c.title), "vs", JSON.stringify(mdCh[i]?.title));
  if (a.length !== m.length) { console.log("PARA COUNT ch", i+1, a.length, m.length); diffs++; }
  for (let j = 0; j < Math.min(a.length, m.length); j++) if (a[j] !== m[j]) { diffs++; if (diffs < 5) console.log("PARA DIFF ch", i+1, j, "\n A:", a[j].slice(0,200), "\n M:", m[j].slice(0,200)); }
});
console.log("art-vs-md paragraph diffs", diffs);
// art vs checkpoint chosen
const chosen = ck.segments.flatMap(s => s.drafts.find(d => d.attempt === s.chosen).chapters);
let changed = 0, chChanged = [];
art.chapters.forEach((c, i) => {
  const k = chosen[i];
  const a = c.paragraphs.join("\n\n"), b = k.paragraphs.join("\n\n");
  if (a !== b) { changed++; chChanged.push(`${i+1}(${b.length}->${a.length}, paras ${k.paragraphs.length}->${c.paragraphs.length})`); }
  if (c.title !== k.title) console.log("art vs chosen title", i+1, c.title, "|", k.title);
});
console.log("chapters differing from chosen draft:", changed, chChanged.join(" "));
console.log("ck.chapters length", ck.chapters.length, "edits", ck.edits.length);
console.log(JSON.stringify(ck.edits[0]).slice(0, 800));
