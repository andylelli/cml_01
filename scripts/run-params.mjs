#!/usr/bin/env node
/**
 * SEEDED RUN PARAMETERS — random by default, exactly reproducible on demand.
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────────
 *
 * `scripts/canary-core-inputs.yaml` pins every story parameter, so every run is the same story with
 * different words. MEASURED over the stored corpus:
 *
 *   axis        temporal 32 · authority 2 · spatial 1 · identity 1 · behavioral 1
 *   externally read books                 : 14, ALL temporal. Zero non-temporal reads exist.
 *   chapter-1 openings naming the detective: 61% of August books
 *   cast                                  : the SAME SIX NAMES in every book
 *
 * The axis skew is not a pipeline defect — `scripts/axis-sweep.mjs:14` already records the cause:
 * the pinned theme *"driven by a mechanical clock-tampering method"* forces a temporal story, so
 * varying `primaryAxis` alone would measure nothing. The theme and the axis have to move together.
 *
 * The consequence is that every instrument this project owns is calibrated on one axis with one cast.
 * The register correlation (−0.697), "best ever 86", "prose is 0-for-43" — all temporal statements.
 *
 * ── THE TRADE, STATED ────────────────────────────────────────────────────────────────────────────
 *
 * Randomising costs comparability. Fourteen reads share a theme, which is why cross-run comparison
 * has been possible at all. That is why this is a SEPARATE inputs file rather than an edit to the
 * pinned one: `canary-core-inputs.yaml` stays exactly as it is, and a seeded run is opt-in.
 *
 *   node scripts/run-params.mjs                 # new random seed, prints it
 *   node scripts/run-params.mjs --seed 8143     # reproduce that run's parameters EXACTLY
 *   node scripts/run-params.mjs --axis spatial  # pin one field, randomise the rest
 *   node scripts/run-params.mjs --angle "a racing stable"   # pin the story angle (see STORY_ANGLES)
 *   node scripts/run-params.mjs --no-angle      # no angle at all — the theme as it was before angles
 *
 * It writes `scripts/generated/run-params-<seed>.yaml` and prints the line to run. The seed is in the
 * filename, in a comment at the top of the file, and echoed as RUN_SEED= — three places, because the
 * whole point is that a run can be found again.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

// ── a deterministic PRNG, so a seed is a promise ────────────────────────────────────────────────
// mulberry32: small, fast, and — the property that matters here — identical across platforms and
// Node versions. Math.random() cannot be seeded and would make every "reproduce" claim a lie.
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * STORY ANGLES — a jolt, not an axis.
 *
 * Every parameter above is STRUCTURAL: which axis, which concealment, which era, which room. None of
 * them says what the story is ABOUT, so the plot agents fill that in from the same distribution every
 * time and the corpus reads as one household with the furniture moved. An angle is a world — a
 * racing stable, a by-election, a regimental reunion — that the setting, the cast's occupations and
 * the motive are asked to draw on. It is explicitly NOT the mechanism: the sentence appended to the
 * theme says so, and the axis concealment stays exactly as chosen.
 *
 * It is drawn LAST, after every existing pick, so every seed generated before this list existed
 * still reproduces its original parameters field-for-field; the angle is a pure addition.
 *
 * WORDS THAT CANNOT APPEAR HERE. The theme is read by two keyword matchers before any model sees it:
 * `extractThemeMechanismFamilies` (agent3b-hard-logic-devices.ts, MECHANISM_FAMILY_KEYWORDS) locks
 * the primary device onto a family when its stem appears — "recording", "lens", "forged", "clock" —
 * and `deriveHardLogicDirectives` (shared.ts) adds families on /train|rail|liner|ship|seaside|hotel/,
 * /inheritance|will|estate/ and the like, by SUBSTRING, so "championship" is a ship and "training"
 * is a train. `--self-test` parses both source files and checks every entry below against them,
 * because a list this long cannot be proof-read for substrings by eye.
 */
const STORY_ANGLES = [
  // sport
  "a county cricket eleven and its ageing captain",
  "the amateur boxing circuit and a promoter who owes money",
  "a golf club committee at war over a new course",
  "a tennis tournament week and the visiting players",
  "a rowing regatta and the crew's coach",
  "a fencing academy with a rivalry between its two masters",
  "the hunt ball and the hunting set",
  "a fishing competition on a private stretch of river",
  "a mountaineering party returned home with one member fewer",
  "a long-distance swimmer preparing for the Channel",
  "a racing stable and its jockeys on the eve of a big meeting",
  "a greyhound track and the men who own the dogs",
  "a motor-racing team and its star driver",
  "a record-attempt speed trial on the sands",
  "a cycling club's annual road race",
  "an ice-skating exhibition and its imported champion",
  "a polo team of cavalry officers",
  "a billiards professional touring the provinces",
  "a chess congress and a disputed adjournment",
  "a bridge tournament and the pairs it breaks up",
  "a crossword setter with a devoted following",
  "a dog show and the breed society behind it",
  // army, navy, war
  "a regimental reunion dinner",
  "a retired general writing his memoirs",
  "a demobilised battalion's officers settling old scores",
  "a military academy in its passing-out week",
  "a naval dockyard town and the wives left ashore",
  "the shadow of an old court-martial",
  "a war widow's disputed pension claim",
  "a company of Territorials on summer camp",
  "a bomb-disposal officer home on leave",
  "a survivor of a torpedoed convoy",
  // politics, public life
  "a by-election in a marginal seat",
  "a cabinet minister's country weekend",
  "a town council fighting over a slum clearance",
  "a trade-union strike ballot",
  "a suffrage veteran's memorial committee",
  "a diplomatic reception and a disputed treaty",
  "a newspaper proprietor choosing which party to back",
  "a political hostess and her salon",
  "a magistrate's bench and a case it got wrong",
  "a coroner's officer with ambitions",
  // arts, stage, letters
  "a landscape painter's final exhibition",
  "a sculptor's studio and the commission that pays for it",
  "a portrait painter and the sitter who refused to pay",
  "a repertory theatre company on tour",
  "a ballet corps rehearsing a new production",
  "a string quartet and its second violin",
  "a dance band playing a summer residency",
  "a poets' circle and a contested literary prize",
  "a publisher's list and the novelist who missed a deadline",
  "an auction house and a painting of doubtful attribution",
  "a society photographer's studio",
  "a film unit on location in a small town",
  "a wireless station and its announcers",
  "a circus wintering in a market town",
  "a music-hall bill and its top-of-the-bill comedian",
  "a cathedral choir school",
  "a village bell-ringers' society",
  "a travelling puppet theatre",
  // invention, science, discovery
  "an inventor with a patent pending and a rival who knows it",
  "an aircraft designer's prototype",
  "a wireless-telegraphy pioneer",
  "an industrial chemist's laboratory",
  "an astronomer's private observatory",
  "a surveyor mapping a disputed boundary",
  "an archaeological dig and what it turned up",
  "a plant collector back from the Himalayas",
  "an ornithologist's bird sanctuary",
  "a beekeeper's apiary",
  "a lighthouse keeper's family",
  "a canal lock-keeper's cottage",
  "a meteorologist at a hilltop weather station",
  // theft, crime, money
  "a jewel theft that everyone assumed was solved",
  "a cat burglar working the county houses",
  "a bank robbery's missing share",
  "a smuggling run on the coast",
  "a stolen manuscript",
  "a card-sharp on a country-house weekend",
  "a confidence trickster's last mark",
  "a pawnbroker's shop and its pledge book",
  "a receiver of stolen goods",
  "a stamp collection worth a fortune",
  "a rare-book dealer",
  "a private bank on the edge of collapse",
  "an insurance assessor who asks too many questions",
  // trade, industry, land
  "a wine merchant's cellar",
  "a tea-importing family",
  "a coal-mine owner's household",
  "a mill town and its mill-owner",
  "a brewery dynasty",
  "a market-garden co-operative",
  "a department store's founding family",
  "a sheep farm and a disputed right of way",
  // places, institutions, curiosities
  "a maze in a country garden",
  "a topiary garden and its head gardener",
  "a model village built by a recluse",
  "a folly built by an eccentric",
  "a girls' boarding school",
  "a Cambridge college in May Week",
  "a hospital's board of governors",
  "a veterinary surgeon's round",
  "a vicarage and a contested living",
  "a spiritualist medium's séance",
  "a flower show and its judging tent",
  "a fashion house's spring collection",
  "a cookery school",
];

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i > -1 ? argv[i + 1] : undefined;
};

/**
 * `--self-test` — the seed makes a promise; this checks it is still kept.
 *
 * A reproducibility guarantee that silently stops holding is worse than none, because every replay
 * quietly becomes a different experiment. Runs the generator twice on fixed seeds and compares.
 */
if (argv.includes("--self-test")) {
  const gen = (s) => {
    const r = mulberry32(s);
    return Array.from({ length: 40 }, () => r()).join(",");
  };
  const pairs = [1, 8143, 25479, 99999];
  const same = pairs.every((s) => gen(s) === gen(s));
  const distinct = new Set(pairs.map(gen)).size === pairs.length;
  console.log(`
  same seed reproduces      : ${same ? "PASS" : "FAIL"}`);
  console.log(`  distinct seeds differ     : ${distinct ? "PASS" : "FAIL"}`);
  // A known vector, so a change to the PRNG itself is caught rather than silently accepted.
  //
  // MEASURED, not invented. The first version of this line carried a hand-written constant and the
  // self-test failed on its own first run — which is the check doing exactly its job, and the ninth
  // instance in three days of a probe asserting something its author had not verified.
  /**
   * STORY_ANGLES vs the theme keyword matchers. The stems and regexes are PARSED FROM THE SOURCE
   * FILES at test time — a copied list here would be a second copy of the same entity set, which
   * is the divergence shape WF-002 warned about, and it would drift the first time either file
   * gained a stem.
   */
  const src = (p) => readFileSync(join(ROOT, p), "utf8");
  const a3b = src("packages/prompts-llm/src/agent3b-hard-logic-devices.ts");
  const kwBlock = a3b.slice(a3b.indexOf("const MECHANISM_FAMILY_KEYWORDS"), a3b.indexOf("const familiesIn"));
  const stems = [...kwBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1].toLowerCase());
  const shared = src("apps/worker/src/jobs/agents/shared.ts");
  const regexes = [...shared.matchAll(/\{\s*re: \/(.+?)\/,/g)].map((m) => new RegExp(m[1], "i"));
  const collisions = [];
  for (const angle of STORY_ANGLES) {
    const low = angle.toLowerCase();
    for (const stem of stems) if (low.includes(stem)) collisions.push(`"${angle}" contains 3b stem "${stem}"`);
    for (const re of regexes) if (re.test(low)) collisions.push(`"${angle}" matches shared.ts ${re}`);
  }
  const angleCount = STORY_ANGLES.length;
  const angleDistinct = new Set(STORY_ANGLES).size === angleCount;
  console.log(`  story angles              : ${angleCount} entries, ${angleDistinct ? "all distinct" : "DUPLICATES"}`);
  console.log(`  angles vs keyword matchers: ${collisions.length === 0 ? "PASS" : "FAIL"} (${stems.length} 3b stems, ${regexes.length} shared.ts rules)`);
  for (const c of collisions) console.log(`      ${c}`);
  const vector = mulberry32(8143)();
  const EXPECTED = 0.13783118315041065;
  const pinned = Math.abs(vector - EXPECTED) < 1e-15;
  console.log(`  PRNG vector unchanged     : ${pinned ? "PASS" : `FAIL (got ${vector})`}`);
  process.exit(same && distinct && pinned ? 0 : 1);
}

const seed = Number(arg("seed") ?? Math.floor(Math.random() * 100000));
if (!Number.isFinite(seed)) { console.error("\n  --seed must be a number\n"); process.exit(1); }
const rnd = mulberry32(seed);
const pick = (list) => list[Math.floor(rnd() * list.length)];
const pickN = (list, n) => {
  const pool = [...list];
  const out = [];
  while (out.length < n && pool.length) out.push(...pool.splice(Math.floor(rnd() * pool.length), 1));
  return out;
};

/**
 * THEMES ARE PAIRED TO AXES, NOT DRAWN INDEPENDENTLY.
 *
 * This is the whole reason the existing skew exists. A clock-tampering brief forces a temporal story
 * whatever `primaryAxis` says — `axis-sweep.mjs` learned this and says so in its header. Each entry
 * below is a concealment the named axis can actually carry.
 */
const AXES = {
  temporal: [
    "a mechanical clock-tampering method — a timepiece made to lie about when the death happened",
    "a chiming clock whose strike was made to fall at the wrong hour",
    "a staged interruption that makes the death seem to fall inside a witnessed hour",
  ],
  spatial: [
    "a concealment of WHERE the death happened — the body moved, the true scene disguised",
    "a room that appears sealed but is not, so the killer is placed outside a space they were inside",
    "a route nobody believes exists, making an impossible presence look like an absence",
  ],
  identity: [
    "a concealment of WHO acted — one person taken for another at the critical moment",
    "a mistaken identification the whole household repeats until it hardens into fact",
    "a person believed absent who was present under another name",
  ],
  behavioral: [
    "a concealment of HOW someone behaves — a habit everyone believes is unbreakable and is not",
    "a routine so reliable that its one exception is invisible to every witness",
    "a character whose known incapacity is a performance",
  ],
  authority: [
    "a concealment resting on WHO IS BELIEVED — a testimony trusted because of the speaker's standing",
    "an official record accepted without question, and wrong",
    "a professional judgement nobody thinks to re-examine",
  ],
};

/** Period-plausible names, drawn fresh so the corpus stops sharing one cast. */
const SURNAMES = ["Ashgrove", "Bellamy", "Carrick", "Dunmore", "Ellery", "Fairweather", "Gaunt",
  "Halloway", "Ingram", "Jardine", "Kestrel", "Lachlan", "Merrow", "Norbury", "Orme", "Penhale",
  "Quayle", "Rutherford", "Selwyn", "Thorne", "Underhill", "Vance", "Whitlock", "Yardley"];
const FEMALE = ["Adela", "Beatrice", "Clarissa", "Dorothy", "Edith", "Frances", "Gwendolyn",
  "Harriet", "Iris", "Josephine", "Katherine", "Lavinia", "Marguerite", "Nora", "Ottoline", "Prudence"];
const MALE = ["Ambrose", "Bertram", "Cecil", "Desmond", "Edmund", "Ferdinand", "Gerald", "Hector",
  "Ivor", "Julian", "Kenneth", "Leonard", "Montague", "Neville", "Oswald", "Percival"];

const axis = arg("axis") ?? pick(Object.keys(AXES));
if (!AXES[axis]) {
  console.error(`\n  unknown axis "${axis}" — one of: ${Object.keys(AXES).join(", ")}\n`);
  process.exit(1);
}

const castSize = Number(arg("cast") ?? pick([5, 6, 6, 6, 7]));
const surnames = pickN(SURNAMES, castSize);
const castNames = [];
const castGenders = {};
/**
 * GIVEN NAMES MUST BE DISTINCT, and this was measured wrong twice before it was fixed.
 *
 * Surnames went through `pickN`, which draws without replacement; given names went through `pick`,
 * which does not — so two characters could share a first name, and on seed 73501 two did:
 * **"Dr. Adela Quayle" and "Adela Jardine"**. Both external reads of that seed named it. The 76/100
 * review: *"Too many similar female names... That is a bad choice. Two Adelas in a short mystery is
 * unnecessary friction. Rename one."* The 77/100 review scored `character_clarity` **5/10**, its
 * lowest mark, on the resulting confusion.
 *
 * A first-name collision is not a style quibble in this genre: the prose refers to characters by
 * given name in dialogue and by surname in narration, so two Adelas make every unattributed line
 * ambiguous. Cheap to prevent, expensive to read around.
 */
/**
 * ── AND THE SAME DEFECT ONE LAYER OUT: DISTINCT NAMES, COLLIDING INITIALS ───────────────────────
 *
 * The fix above stopped two characters sharing a first NAME. It did not stop them sharing a first
 * LETTER, because `usedGiven` tracks names and the two pools carry the SAME sixteen initials (A-P):
 * "Adela" and "Ambrose" are different names that read as the same person in a scan.
 *
 * That matters more here than it would elsewhere, because the pipeline states it as a rule about
 * itself. `agent2-cast.ts:468` calls it MANDATORY - *"no two characters may share the same initial.
 * This guarantees name uniqueness across stories."* But look at the line above it:
 *
 *     const namingDirectives = !inputs.characterNames ? `...FIRST-NAME INITIALS (MANDATORY)...` : ``;
 *
 * When cast names are SUPPLIED - which is every seeded run - that whole block is omitted. The prompt
 * correctly defers to the names it was given, so nothing downstream re-imposes the rule and whatever
 * this script emits is final.
 *
 * MEASURED 2026-09-04, and the split is what makes this file the right place to fix it:
 *
 *   over 366 generated param files : 45% share a first-name initial, 8% share a given name
 *   over 50 shipped casts, seeded  : 75% share an initial, 50% share a given name  (n=8)
 *   over 50 shipped casts, pipeline: 10% share an initial,  0% share a given name  (n=42)
 *
 * The pipeline's own rule WORKS - zero duplicate given names in 42 casts it named itself. Every one
 * of the four books that shipped two characters with the same first name came from this script.
 *
 * Always satisfiable: both pools hold 16 distinct initials and `castSize` is at most 7. The fallback
 * chain is still written out and still widens rather than throwing, because a run that cannot be
 * parameterised is worse than one with a name clash - but it announces itself instead of silently
 * repeating the defect.
 *
 * Axis-independent by construction: names are drawn before the axis is used for anything, and this
 * runs identically for temporal, spatial, identity, behavioural and authority cases.
 */
const usedGiven = new Set();
const usedInitials = new Set();
const pickDistinctGiven = (pool) => {
  const initial = (n) => n.charAt(0).toUpperCase();
  const free = pool.filter((n) => !usedGiven.has(n));
  let chosen = null;
  if (free.length > 0) {
    /**
     * REJECTION SAMPLING, and the reason is reproducibility rather than elegance.
     *
     * The obvious fix is to filter the pool down to names whose initial is also unused and pick from
     * that. It works, and it changes the cast for EVERY seed - including the 55% that never had a
     * collision - because a shorter array turns the same random value into a different index.
     * MEASURED on seed 22362, whose cast was already collision-free (D, E, I, H, C): filtering
     * rewrote three of its five names.
     *
     * Drawing from the SAME array and re-drawing on a clash consumes an extra rnd() only when there
     * is a clash, so a seed that never collided replays byte-identically. The blast radius becomes
     * exactly the seeds that were broken.
     *
     * Bounded, because an unbounded redraw on an exhausted pool would spin forever.
     */
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const candidate = pick(free);
      if (!usedInitials.has(initial(candidate))) { chosen = candidate; break; }
    }
    if (chosen === null) {
      chosen = pick(free);
      console.warn(`  ! initial pool exhausted — "${chosen}" repeats the initial ${initial(chosen)}`);
    }
  } else {
    chosen = pick(pool);
    console.warn(`  ! name pool exhausted — "${chosen}" is a repeated given name`);
  }
  usedGiven.add(chosen);
  usedInitials.add(initial(chosen));
  return chosen;
};
for (let i = 0; i < castSize; i += 1) {
  const female = rnd() < 0.5;
  const given = pickDistinctGiven(female ? FEMALE : MALE);
  // The victim is a doctor often enough in this genre to be worth keeping; the title also exercises
  // the honorific-stripping paths that have broken twice.
  const title = i === 1 && rnd() < 0.5 ? "Dr. " : "";
  const name = `${title}${given} ${surnames[i]}`;
  castNames.push(name);
  castGenders[name] = female ? "female" : "male";
}



const params = {
  seed,
  theme: `Golden Age murder mystery built on ${pick(AXES[axis])}. Enforce strict fair-play: `
    + `reveal all mechanism-critical clues to the reader by mid-story, and place the discriminating `
    + `test before the reveal.`,
  primaryAxis: axis,
  eraPreference: arg("era") ?? pick(["1920s", "1930s", "1930s", "1940s", "1950s"]),
  locationPreset: arg("location") ?? pick(["CountryHouse", "SeasideHotel", "Village", "Liner", "Theatre"]),
  tone: arg("tone") ?? pick(["Cozy", "Classic", "Classic", "Dark"]),
  /**
   * SHORT BY DEFAULT, and this is a correction rather than a preference.
   *
   * `canary-core-inputs.yaml` sets `targetLength: short`. A generated file REPLACES that file (it is
   * passed as CANARY_CORE_INPUTS_YAML, not merged into it), so omitting the field silently fell
   * through to the code default of "medium" — `prompt-builder.ts:1773`,
   * `const { targetLength = "medium" } = inputs`. The first seeded run therefore produced a medium
   * book while every prior book in the corpus is short, which would have confounded the one
   * comparison the run existed to make.
   *
   * Every field the baseline pins must be pinned here too, or the generator quietly changes things
   * nobody asked it to change. Override with `--length medium|long` when that is the point.
   */
  targetLength: arg("length") ?? "short",
  detectiveType: pick(["amateur", "amateur", "private", "police"]),
  narrativeStyle: pick(["classic", "classic", "atmospheric", "modern"]),
  castSize,
  castNames,
  castGenders,
};

/**
 * THE ANGLE IS THE LAST DRAW — and the first version of this got it wrong. It sat above the params
 * literal, but the era, tone, location, detective and concealment picks happen INSIDE that literal,
 * so the angle draw shifted all of them: the same seed gave "1950s / Cozy / amateur" without an
 * angle and "1930s / Cozy / private" with one. MEASURED on seed 91375, caught by diffing
 * `--no-angle` against the HEAD generator. Every existing seed reproduces only if nothing is
 * drawn before the picks it already had, so this MUST stay after `params`.
 *
 * `--angle "<text>"` supplies one; `--no-angle` omits it entirely (the theme is then exactly
 * what it was before angles existed).
 */
const storyAngle = argv.includes("--no-angle") ? null : (arg("angle") ?? pick(STORY_ANGLES));
if (storyAngle) {
  params.theme += ` Story angle: ${storyAngle}. This is background colour for the setting, the cast's `
    + `occupations and the motive; it is NOT the murder mechanism and must not displace the concealment above.`;
}
params.storyAngle = storyAngle;

const yaml = [
  `# GENERATED RUN PARAMETERS — seed ${seed}`,
  `#`,
  `# Reproduce this exact parameter set:`,
  `#     node scripts/run-params.mjs --seed ${seed}`,
  `#`,
  `# Run it:`,
  `#     CANARY_CORE_INPUTS_YAML=scripts/generated/run-params-${seed}.yaml \\`,
  `#       node --use-system-ca scripts/canary-core.mjs`,
  `#`,
  `# The pinned baseline (scripts/canary-core-inputs.yaml) is untouched and still the default.`,
  `# Generated ${new Date().toISOString()}`,
  ``,
  `seed: ${seed}`,
  `theme: ${JSON.stringify(params.theme)}`,
  ...(storyAngle ? [`storyAngle: ${JSON.stringify(storyAngle)}`] : [`# storyAngle: (none — --no-angle)`]),
  `primaryAxis: ${params.primaryAxis}`,
  `eraPreference: ${JSON.stringify(params.eraPreference)}`,
  `locationPreset: ${params.locationPreset}`,
  `tone: ${JSON.stringify(params.tone)}`,
  `targetLength: ${params.targetLength}`,
  `detectiveType: ${params.detectiveType}`,
  `narrativeStyle: ${params.narrativeStyle}`,
  `castSize: ${params.castSize}`,
  `castNames:`,
  ...castNames.map((n) => `  - ${JSON.stringify(n)}`),
  `castGenders:`,
  ...castNames.map((n) => `  ${JSON.stringify(n)}: ${castGenders[n]}`),
  ``,
  `# ── SUBSYSTEM SWITCHES, copied verbatim from scripts/canary-core-inputs.yaml ────────────────────`,
  `#`,
  `# MEASURED, and this is the second instance of the defect the targetLength comment above describes.`,
  `# A generated file REPLACES the baseline rather than merging into it, and every one of these is read`,
  `# as a bare truthiness check (\`if (ctx.inputs.enableLockedFactRegistry)\`) with no \`?? true\` default —`,
  `# so omitting them SWITCHED SIX SUBSYSTEMS OFF on every seeded run.`,
  `#`,
  `# PROVEN for enableLockedFactRegistry: 42 \`apps/worker/logs/locked-facts-*.json\` files exist and the`,
  `# newest is from 2026-09-02, none for any seeded run — and that block also contains X38, the`,
  `# device-arithmetic reconciler and the case-time coherence check. The 76/100 read whose FIRST`,
  `# complaint was "that arithmetic is wrong" was produced by a run with the entire arithmetic-checking`,
  `# subsystem switched off. Not blind checks — absent ones.`,
  `enableLockedFactRegistry: true`,
  `enableLockedFactGate: true`,
  `enableBindingGates: true`,
  `enableCharacterBundle: true`,
  `enableOutlineCompleteness: true`,
  `enableSurgicalFingerprintRetry: true`,
  `proseBatchSize: 1`,
  `similarityThreshold: 0.9`,
  `skipNoveltyCheck: false`,
  ``,
].join("\n");

const outDir = join(ROOT, "scripts", "generated");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `run-params-${seed}.yaml`);
/**
 * ── A PARAMS FILE IS THE PROVENANCE OF A RUN THAT HAPPENED ─────────────────────────────────────
 *
 * `--seed N` reads as "show me seed N", and it used to WRITE — so reproducing the parameters of a
 * finished run silently rewrote its record. Demonstrated the hard way on 2026-09-05: the author
 * documented this rule in CLAUDE.md and then overwrote run 87779's file within the hour, while that
 * run was still in flight. A comment was not enough; this is the guard.
 *
 * Refuses rather than clobbers. `--force` is there for the one legitimate case — regenerating a file
 * for a seed whose run never happened — and has to be typed on purpose.
 */
if (existsSync(outPath) && !argv.includes("--force")) {
  const existing = readFileSync(outPath, "utf8");
  const strip = (t) => t.replace(/^# Generated .*$/m, "");
  if (strip(existing) === strip(yaml)) {
    console.log(`
  ${outPath.replace(ROOT, ".")} already exists and is IDENTICAL — not rewritten.`);
  } else {
    console.error(`
  REFUSING TO OVERWRITE ${outPath.replace(ROOT, ".")}`);
    console.error(`  It is the provenance record of a run that happened, and the parameters DIFFER`);
    console.error(`  from what this version of the generator would produce. Copy it aside, or pass`);
    console.error(`  --force if that run never ran.
`);
    process.exit(1);
  }
} else {
  writeFileSync(outPath, yaml, "utf8");
}

/**
 * ── PRINT EVERY PARAMETER, NOT A FLATTERING SUBSET ───────────────────────────────────────────────
 *
 * CLAUDE.md, "Reporting a run": a run's parameters are the only thing that makes it comparable to
 * another run, so they are stated in full BEFORE it is launched.
 *
 * The old summary printed axis, setting, length, detective and cast, and omitted three things that
 * matter more than any of them:
 *
 *   the THEME               the single biggest determinant of the story this run tells
 *   the cast GENDERS        every pronoun in the book follows from them
 *   the SUBSYSTEM SWITCHES  omitting these from the generated file once disabled SIX subsystems on
 *                           every seeded run, X38 among them, and it took a 76/100 read complaining
 *                           about arithmetic to notice
 *
 * A parameter that is not printed is a parameter nobody checks.
 */
const wrapAt = (text, width, indent) =>
  String(text ?? "")
    .split(" ")
    .reduce((acc, word) => {
      const last = acc[acc.length - 1];
      if (last !== undefined && (last + " " + word).length <= width) acc[acc.length - 1] = last + " " + word;
      else acc.push(word);
      return acc;
    }, [])
    .map((line, i) => (i === 0 ? line : indent + line))
    .join("\n");

const heading = (label) => `  ${label} ${"-".repeat(Math.max(0, 72 - label.length))}`;
const bare = (name) => name.replace(/^(?:Dr\.|Miss|Mrs\.|Mr\.|Captain|Colonel|Sir|Lady|Lord|Professor|Reverend)\s+/, "");

console.log(`\nRUN_SEED=${seed}`);

console.log(`\n${heading("STORY")}`);
console.log(`  axis        ${params.primaryAxis}`);
console.log(`  setting     ${params.locationPreset} · ${params.eraPreference} · ${params.tone}`);
console.log(`  narrative   ${params.detectiveType} detective · ${params.narrativeStyle} · length ${params.targetLength}` +
  `${params.targetLength === "short" ? " (default — matches every prior book)" : "  ** OVERRIDDEN **"}`);
console.log(`  theme       ${wrapAt(params.theme, 62, "              ")}`);
console.log(`  angle       ${storyAngle ?? "(none — --no-angle)"}`);

console.log(`\n${heading("CAST")}`);
// The initial is printed against each name because a collision is invisible in a comma-separated
// list, and two external reads were spent on one: "Two Adelas in a short mystery is unnecessary
// friction" (76/100), and character_clarity 5/10 (77/100).
for (const name of castNames) {
  console.log(`  ${bare(name).charAt(0)}   ${name.padEnd(32)} ${castGenders[name]}`);
}
const shownInitials = castNames.map((n) => bare(n).charAt(0).toUpperCase());
const shownGivens = castNames.map((n) => bare(n).split(/\s+/)[0]);
const clash =
  shownInitials.length !== new Set(shownInitials).size || shownGivens.length !== new Set(shownGivens).size;
console.log(`      ${castSize} characters · initials ${shownInitials.join(" ")}` +
  `${clash ? "   ** COLLISION — violates agent2-cast.ts:468 **" : "   (all distinct)"}`);

console.log(`\n${heading("SUBSYSTEM SWITCHES")}`);
for (const line of [
  "enableLockedFactRegistry=true   enableLockedFactGate=true       enableBindingGates=true",
  "enableCharacterBundle=true      enableOutlineCompleteness=true  enableSurgicalFingerprintRetry=true",
  "proseBatchSize=1                similarityThreshold=0.9         skipNoveltyCheck=false",
]) console.log(`  ${line}`);
console.log(`  all nine present — omitting them switches six subsystems OFF, X38 included`);

console.log(`\n  written   ${outPath.replace(ROOT, ".")}`);
console.log(`\n  RUN IT:`);
console.log(`    CANARY_CORE_INPUTS_YAML=scripts/generated/run-params-${seed}.yaml \\`);
console.log(`      node --use-system-ca scripts/canary-core.mjs`);
console.log(`\n  REPRODUCE:  node scripts/run-params.mjs --seed ${seed}\n`);
