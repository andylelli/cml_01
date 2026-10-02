import type { CoverBrief, CoverManifest } from "./types.js";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** One static page: every cover side by side, each captioned with its styles, palette and full brief. */
export const renderContactSheet = (m: CoverManifest, briefs: CoverBrief[]): string => {
  const byId = new Map(briefs.map((b) => [b.id, b]));
  const cards = m.covers
    .map((r) => {
      const b = byId.get(r.briefId);
      const img = r.coverPath
        ? `<img src="${esc(r.coverPath)}" alt="${esc(r.briefId)}">`
        : `<div class="empty">${esc(r.error ?? (m.dryRun ? "dry run — brief only" : "no image"))}</div>`;
      const swatches = (b?.inks ?? []).map((c) => `<span style="background:${c}" title="${c}"></span>`).join("");
      return `<figure>${img}<figcaption><b>${esc(r.styles.join(" + "))}</b> · ${esc(r.framing ?? "")} · ${esc(r.palette)} <span class="sw">${swatches}</span>
<details><summary>brief</summary><pre>${esc(b?.prompt ?? "")}</pre></details></figcaption></figure>`;
    })
    .join("\n");
  const a = m.anchors;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(m.title)} — covers</title>
<style>
:root{--bg:#f6f3ec;--fg:#1d1d1d;--mute:#6b675e;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#16161a;--fg:#ece8df;--mute:#9a958a;--card:#222228}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif}
h1{margin:0 0 4px;font-size:22px} .meta{color:var(--mute);margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
figure{margin:0;background:var(--card);border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.15)}
img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover}
.empty{aspect-ratio:2/3;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center;color:var(--mute)}
figcaption{padding:10px 12px;font-size:13px} .sw span{display:inline-block;width:12px;height:12px;border-radius:2px;margin-left:2px;vertical-align:middle}
pre{white-space:pre-wrap;font-size:12px;color:var(--mute)}
</style></head><body>
<h1>${esc(m.title)}</h1>
<div class="meta">${m.dryRun ? "DRY RUN · " : ""}${esc(m.generatedAt)} · seed ${m.seed} · anchors (${a.source}): ${esc(a.place)} · ${esc(a.time_of_day)}, ${esc(a.season)} · object: ${esc(a.clue_object)} · mood: ${esc(a.mood)}</div>
<div class="grid">
${cards}
</div></body></html>`;
};
