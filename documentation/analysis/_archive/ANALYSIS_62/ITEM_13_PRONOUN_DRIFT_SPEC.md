# Item 13 — Pronoun Drift: problem spec + fixture shapes (user-provided, 2026-07-17)

**Provenance:** written by the project owner from the external-read experience (the four 2026-07-13
ChatGPT reads all flagged drift; their verbatim quotes were never recorded — this spec supplies the
canonical SHAPES instead, which is what the fixture work actually needs).

**Status:** the fixture source for Item 13. The A_62 RC-4 audit established the internal detector has
BOTH a precision gap (unnamed-role FP, cross-paragraph referent FP; 30 noisy moderates on M1v8-2) and
a recall gap. Everything below feeds `scripts/pronoun-audit.mjs --fixtures` first — **measure, then
fix** (the RC-4 rule; the class-#2 lesson says fixture from real shapes, never from the fixer's
assumption).

---

## The defect

Characters are referred to with wrong or inconsistent gendered pronouns. Roles are usually stable
(the cast design is right); the PROSE breaks stability by attaching pronouns to the wrong person.

## Canonical true-positive shapes (fixture set)

| # | Shape | Example |
|---|---|---|
| TP1 | Subject-pronoun mismatch inside one beat | "Captain Hale tightened **her** jaw and looked away." |
| TP2 | Alibi-clearance drift | "Captain Hale's alibi proved **she** could not have been near the room." |
| TP3 | Investigator masculinized | Eleanor Voss as subject → "**he** remembered", "**his** gaze", "**he** pressed on" |
| TP4 | Cross-beat mixing (same referent, two genders) | "Captain Hale did not answer at once. **Her** hand tightened around the chair." (both sentences about Hale) |
| TP5 | Nearest-name capture | subject is A, pronoun matches nearer-named B: "**his** loyalty to Hugo wavered" where the subject is female |

## NOT drift (precision fixtures — must not flag)

| # | Shape | Example |
|---|---|---|
| FP1 | Opposite-gender pronoun with a legitimate in-scene referent | "Eleanor watched Hugo. **He** looked away." |
| FP2 | Unnamed role carrying the pronoun | "As Eleanor spoke, the night porter stepped forward, clearing **his** throat." (the RC-4 audit's live FP) |
| FP3 | Cross-paragraph referent | male named in ¶1, "**his** jaw" in ¶2 with female subject (the RC-4 audit's other live FP) |
| AMB | Ambiguous-but-grammatical after a group | "Eleanor watched Hugo and Sylvia. He looked away." — clarity problem (craft), not a gender error; repair by NAME SUBSTITUTION, not gender flip |

## High-risk scene classes (where detection/repair should concentrate)

Group interrogations · final reveals · alibi-clearing sections · motive discussions ·
many-suspect paragraphs · rapid-observation sequences.

## The fix architecture (maps onto existing machinery — nothing here is a new subsystem)

1. **Fixed pronoun map before drafting** → exists: the frozen Bible gender map
   (`AGENT9_BIBLE_AUTHORITATIVE`, ON). Verify prompts actually surface it per character.
2. **Generation instruction** (map + name-over-pronoun in dense scenes + drafting-time consistency
   pass) → a PROMPT lever: implement default-OFF (`AGENT9_PRONOUN_CLARITY`), A/B at P5 alongside
   the craft levers, measuring drift-event count AND dialogue/prose marks (name repetition is a
   craft trade-off — the spec accepts it; the rubric must confirm readers do).
3. **Post-processing consistency pass** → exists: the pronoun sweep + `repairPronouns` /
   `repairChapterPronouns`. The fixture audit must measure what the CURRENT repair does with each
   TP shape (M1v8-2 shipped 3 surviving pronoun majors — the sweep demonstrably misses some).
4. **Name-substitution repair for ambiguity** (AMB shape): repair by replacing the pronoun with the
   intended NAME — never by flipping gender (a wrong flip corrupts; a name is always safe).

## Editing checklist (verbatim from the spec — prompt-lever copy source)

- Eleanor Voss must never become "he/his"; Hale/Vane never "she/her"; Quill/Trent never "he/him".
- No ambiguous pronouns after group descriptions — repeat the name.
- Names over pronouns in deduction/reveal scenes.
- Never mix pronouns inside one character beat.
- Check every alibi-clearance sentence (TP2 is the highest-damage shape: it flips who reads as
  cleared/guilty).

## Recommended generation instruction (for the P5 lever, verbatim)

> Maintain strict pronoun consistency for every character. Before writing, create an internal
> character-pronoun map and never deviate from it. […] In scenes with multiple characters, prefer
> repeating the character's name over using a pronoun if there is any possible ambiguity. After
> drafting, perform a pronoun consistency pass and correct every mismatched "he," "she," "his,"
> "her," "him," and "hers."

*(Full text in the conversation record; the flag implementation should carry it verbatim.)*

---

## Fixture audit results (2026-07-17, `scripts/pronoun-fixture-audit.mjs`, real shipped machinery)

| Fixture | Detector | Repair sweep |
|---|---|---|
| TP1 beat-mismatch | ✅ fires | ✅ fixes |
| TP2 alibi-drift | ❌ **quiet** | ✅ **fixes** |
| TP3 investigator-masc (cross-sentence) | ❌ quiet | ❌ **untouched** |
| TP4 cross-beat-mix | ❌ quiet | ✅ fixes |
| TP5 nearest-name-capture | ❌ quiet | ❌ untouched (genuinely ambiguous — name-substitution territory, P5) |
| FP1 legit-referent | ✅ quiet | — |
| FP2 unnamed-role | ❌ **FIRES** (the RC-4 live FP, reproduced) | — |
| AMB group-ambiguity | ✅ quiet | — |

**Reading:** the REPAIR already handles the most damaging shapes (incl. the alibi flip); surviving
live drift is the cross-sentence class (TP3) plus post-sweep-written text. The DETECTOR is both
blind (1/5) and noisy (FP2) — explaining 0/20 caps alongside 30 junk moderates on M1v8-2.
**Indicted fixes: (a) detector FP2 — unnamed-role suppression; (b) repair TP3 — sentence-initial
pronoun inherits the previous sentence's subject. TP5 and the AMB name-substitution repair are P5
lever territory (`AGENT9_PRONOUN_CLARITY`), not deterministic-sweep work.**
