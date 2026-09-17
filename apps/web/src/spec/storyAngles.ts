/**
 * THE STORY ANGLES — a world for the story to draw on.
 *
 * ── WHAT AN ANGLE IS, AND WHY IT IS NOT THE THEME ─────────────────────────────────────────────
 *
 * The theme is the CRIME: "a locked-room murder in a manor". The angle is the WORLD the crime
 * happens inside — a racing stable, a by-election, a cathedral restoration — and it colours the
 * setting, the cast's occupations and the motive without being the mechanism. Left to itself the
 * pipeline writes the same country house every time, and the corpus reads as one household with
 * the furniture moved.
 *
 * They are not alternatives. A run has both, and they reach the pipeline by two DIFFERENT routes:
 *
 *   - `storyAngle` is a first-class input that Agents 1 and 2 read directly, because neither of
 *     them is ever shown the theme (`mystery-orchestrator.ts:188`, `agent1-setting.ts:204`,
 *     `agent2-cast.ts:561`).
 *   - the SAME angle is also appended to `theme`, in one fixed framing sentence, because Agents
 *     2e, 3b and 3 read the theme and never see the field.
 *
 * Send one without the other and half the pipeline is blind to it. The API does both from a single
 * spec field — see `composeThemeWithAngle` in apps/api/src/server.ts.
 *
 * ── WHY THE WORDING OF AN ANGLE IS CONSTRAINED ────────────────────────────────────────────────
 *
 * The theme is read by two SUBSTRING matchers before any model sees it — MECHANISM_FAMILY_KEYWORDS
 * in agent3b, and the family rules in shared.ts. "championship" contains "ship" and "training"
 * contains "train". An angle carrying such a stem silently locks the murder mechanism, which is
 * why the generator self-tests this list against both matchers and why free text typed into the
 * field gets the same warning the theme does.
 *
 * ── GENERATED, NOT TYPED ──────────────────────────────────────────────────────────────────────
 *
 * A copy of STORY_ANGLES in scripts/run-params.mjs, which is a .mjs script apps/web cannot import.
 * A copy of a list is a divergence waiting to happen (WF-002), so __tests__/storyAngles.test.ts
 * parses the real list out of that file and fails if the two differ by a single character — the
 * same guard MECHANISM_FAMILY_KEYWORDS already carries in composeTheme.ts.
 *
 * Regenerate rather than editing by hand.
 */

export interface AngleGroup {
	readonly category: string;
	readonly angles: readonly string[];
}

export const ANGLE_GROUPS: readonly AngleGroup[] = [
	{
		category: "Sport",
		angles: [
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
		],
	},
	{
		category: "Army, Navy, War",
		angles: [
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
		],
	},
	{
		category: "Politics, Public Life",
		angles: [
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
		],
	},
	{
		category: "Arts, Stage, Letters",
		angles: [
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
		],
	},
	{
		category: "Invention, Science, Discovery",
		angles: [
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
		],
	},
	{
		category: "Theft, Crime, Money",
		angles: [
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
		],
	},
	{
		category: "Trade, Industry, Land",
		angles: [
			"a wine merchant's cellar",
			"a tea-importing family",
			"a coal-mine owner's household",
			"a mill town and its mill-owner",
			"a brewery dynasty",
			"a market-garden co-operative",
			"a department store's founding family",
			"a sheep farm and a disputed right of way",
		],
	},
	{
		category: "Places, Institutions, Curiosities",
		angles: [
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
		],
	},
];

/** Every angle, flat, in the generator's own order. */
export const STORY_ANGLES: readonly string[] = ANGLE_GROUPS.flatMap((g) => g.angles);

/**
 * One angle at random.
 *
 * Unseeded on purpose. `scripts/run-params.mjs` draws its angle from a SEEDED generator so a run
 * can be reproduced; a UI that quietly used its own PRNG would produce a third thing that looks
 * like a seeded run and matches none of them. This is a convenience for a person choosing, and it
 * is recorded in the spec like any other typed value.
 */
export const randomAngle = (): string => STORY_ANGLES[Math.floor(Math.random() * STORY_ANGLES.length)];
