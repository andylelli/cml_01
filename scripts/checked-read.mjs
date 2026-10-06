#!/usr/bin/env node
/**
 * A_110 §39.2 — THE CHECKED READ: can the reader see the owner's points at all?
 *
 * Expert creative writers and LLM judges agree on yes/no craft tests at kappa close to zero (Chakrabarty et al., CHI 2024),
 * and the rubric scores none of the owner's first four points (A_110 §8). So, in a call of its own, the reader is asked
 * yes/no questions the probe can also answer from the text — and the two are compared. Where the reader disagrees with
 * the counts, no 1–10 mark will move with that lever, and the owner's read is its only judge.
 *
 * Every question is generated from the case's own artifacts (owner-needs-probe.mjs, rule G8); none names a fixed noun.
 *
 *   node scripts/checked-read.mjs questions <manuscript.md>                 # the sheet to paste into the reader
 *   node scripts/checked-read.mjs compare <manuscript.md> <answers.txt>     # the reader's answers against the counts
 *
 * The answers file holds lines "Q1: yes", "Q2: no", … in any order; anything else is ignored.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const probe = await import(pathToFileURL(join(ROOT, "documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs")).href);

/** The questions for one book, each with the probe's own answer. */
export const questionsFor = (raw) => {
  const match = probe.matchCase(raw);
  if (!match) return null;
  const cs = probe.caseOf(match.art);
  const m = probe.measure(raw, cs);
  if (!m) return null;
  const q = [];
  q.push({ text: "In chapter 1, is the place itself described, in at least two paragraphs, before anybody speaks?", truth: (m.p1_firstQuotePara ?? 99) >= 3 });
  if (cs.place || cs.placeName) q.push({ text: "Does chapter 1 name the town or village where the story takes place?", truth: m.p3_place === true });
  if (cs.month && cs.year) q.push({ text: "Does chapter 1 say the month and the year?", truth: m.p3_month === true && m.p3_year === true });
  const [met, of] = String(m.p4_introduced).split("/").map(Number);
  if (of > 0) q.push({ text: `When each person in chapter 1 first appears, does the text say what they do and what they were to ${cs.victim ?? "the victim"}?`, truth: met === of });
  const [spoke, present] = String(m.p5_spoke).split("/").map(Number);
  if (present > 0) q.push({ text: "In the chapter where the death is discovered, does each person present say something about the death?", truth: spoke === present });
  if (cs.amateur === true) q.push({ text: "When the body is found, is the police or a doctor sent for?", truth: m.p5_authoritySent === true });
  return { project: match.id, questions: q.map((x, i) => ({ id: `Q${i + 1}`, ...x })) };
};

const invokedDirectly = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (invokedDirectly) {
  const [mode, ms, answersPath] = process.argv.slice(2);
  if (!mode || !ms) {
    console.log("usage: checked-read.mjs questions <manuscript.md> | compare <manuscript.md> <answers.txt>");
    process.exit(1);
  }
  const sheet = questionsFor(readFileSync(ms, "utf8"));
  if (!sheet) {
    console.log("no stored case matches this manuscript's cast — nothing to ask");
    process.exit(1);
  }
  if (mode === "questions") {
    console.log("Answer each question with yes or no only, one per line, as \"Q1: yes\". Judge only from the book's text.\n");
    for (const q of sheet.questions) console.log(`${q.id}. ${q.text}`);
  } else {
    const answers = new Map([...readFileSync(answersPath, "utf8").matchAll(/^\s*(Q\d+)\s*[:.)-]\s*(yes|no)\b/gim)].map((m) => [m[1].toUpperCase(), m[2].toLowerCase() === "yes"]));
    let agree = 0, answered = 0;
    for (const q of sheet.questions) {
      const a = answers.get(q.id);
      if (a === undefined) {
        console.log(`${q.id}  reader: —    probe: ${q.truth ? "yes" : "no "}  ${q.text}`);
        continue;
      }
      answered++;
      if (a === q.truth) agree++;
      console.log(`${q.id}  reader: ${a ? "yes" : "no "}  probe: ${q.truth ? "yes" : "no "}  ${a === q.truth ? "agree   " : "DISAGREE"}  ${q.text}`);
    }
    console.log(`\nagreement ${agree} of ${answered} answered (${sheet.questions.length} asked) — a question the reader gets wrong is a point no mark of it can register`);
  }
}
