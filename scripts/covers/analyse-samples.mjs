#!/usr/bin/env node
/**
 * Analyse cover SAMPLE images into fixed-shape style descriptors — documentation/covers/COVER-HARNESS-PLAN.md §2 step 1.
 *
 * The samples never reach the image model (copyright). This turns each one into words — palette, medium,
 * composition, family — so a person can write or revise a style card from them. Run it when samples are
 * added; it also checks the hand classification in the plan (§1) against the model's.
 *
 *   node scripts/covers/analyse-samples.mjs                      # temp/covers/** → library/cover-styles/samples.json
 *   node scripts/covers/analyse-samples.mjs --dir <folder> --out <file.json>
 *
 * One vision call per image to the Azure chat deployment (AZURE_OPENAI_*), ~£0.002 each. Images are sent
 * to the project's own Azure resource only.
 */
import { config } from "dotenv";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : d);
const dir = path.resolve(root, opt("dir", "temp/covers"));
const out = path.resolve(root, opt("out", "library/cover-styles/samples.json"));

/** The plan's §1 hand classification (by eye, 2026-10-02) — what the model's family is checked against. */
const HAND = {
  "1920s/image_01.jpg": "A", "1920s/image_02.jpg": "A", "1920s/image_03.jpg": "B", "1920s/image_04.jpg": "B",
  "1920s/image_05.jpg": "A", "1920s/image_06.jpg": "E", "1930s/image_01.jpg": "A", "1930s/image_02.jpg": "B",
  "1930s/image_03.jpg": "C", "1930s/image_04.jpeg": "D", "1930s/image_05.jpeg": "C", "1930s/image_06.jpg": "C",
  "1930s/image_07.jpeg": "C", "1930s/image_08.jpg": "C", "1930s/image_09.jpg": "D",
};

const FAMILIES = `A = Art Deco portrait (one stylised figure, sunburst/arch geometry, jewel tones, gold line-work)
B = period magazine illustration (elongated figure in profile, flat ground colour, one seasonal motif)
C = flat lithographic travel poster (a place in silhouette, 3-5 flat inks, small figures, framed type band)
D = painterly poster (gouache/oil, deep space, atmospheric light)
E = advertising pastiche (dominated by lettering)`;

const PROMPT = `You are cataloguing a vintage illustration for a book-cover style library. Describe only what is visible.
Reply with one JSON object:
{
  "family": "one letter from the list below",
  "palette": ["4-6 dominant colours as #rrggbb"],
  "medium": "8-20 words: technique, edges, shading, texture",
  "composition": ["exactly 3 short statements about layout, subject placement and scale"],
  "subject": "what is depicted, 4-12 words",
  "figure_treatment": "how people are drawn, or 'no figures'",
  "type_treatment": "how any lettering is placed and styled, or 'no lettering'",
  "mood": "2-4 words",
  "mystery_fit": "1-5: how well this look would suit a 1920s-30s murder-mystery jacket",
  "one_line": "the look in one sentence, without naming any artist or publication"
}
Families:
${FAMILIES}`;

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (f === "out") continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jpe?g|png|webp)$/i.test(f)) files.push(p);
  }
};
walk(dir);
files.sort();

const endpoint = (process.env.AZURE_OPENAI_ENDPOINT ?? "").replace(/\/+$/, "");
const key = process.env.AZURE_OPENAI_API_KEY ?? "";
const deployment = process.env.CML_COVER_LLM_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
if (!endpoint || !key || !deployment) {
  console.error("AZURE_OPENAI_ENDPOINT / _API_KEY / _DEPLOYMENT_NAME required");
  process.exit(1);
}
console.log(`[samples] ${files.length} image(s) from ${path.relative(root, dir)} via ${deployment}`);

const mime = (f) => (/\.png$/i.test(f) ? "image/png" : /\.webp$/i.test(f) ? "image/webp" : "image/jpeg");
const rows = [];
for (const file of files) {
  const rel = path.relative(dir, file).replace(/\\/g, "/");
  const b64 = readFileSync(file).toString("base64");
  const res = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`, {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: `data:${mime(file)};base64,${b64}`, detail: "low" } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 700,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log(`  ${rel}: HTTP ${res.status} ${text.slice(0, 160)}`);
    rows.push({ file: rel, error: `HTTP ${res.status}` });
    continue;
  }
  const json = JSON.parse(JSON.parse(text).choices[0].message.content);
  const hand = HAND[rel] ?? null;
  rows.push({ file: rel, hand_family: hand, ...json });
  console.log(`  ${rel}: ${json.family}${hand ? (hand === json.family ? " (= hand)" : ` (hand ${hand})`) : ""} · fit ${json.mystery_fit} · ${json.one_line}`);
}

const judged = rows.filter((r) => r.hand_family && r.family);
const agree = judged.filter((r) => r.hand_family === r.family).length;
writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), source: path.relative(root, dir), deployment, families: FAMILIES.split("\n"), agreement: `${agree}/${judged.length}`, samples: rows }, null, 2));
console.log(`[samples] family agreement with the hand classification: ${agree}/${judged.length} → ${path.relative(root, out)}`);
