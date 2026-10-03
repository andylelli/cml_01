import type { CoverStyle } from "../services/api";

/**
 * The cover styles a story of `decade` may use — the UI's copy of `cardsForEra` in @cml/covers, so the choices
 * shown are the choices the server will honour. TRUE TO THE DECADE (owner, 2026-10-03): only the story's decade;
 * with none tagged, the nearest decade; with no decade, every style.
 */
export const decadeNumber = (era: string | undefined | null): number | null => {
	const m = (era ?? "").match(/(1[89]\d|20\d)(\d)s?/);
	return m ? Number(m[1]) * 10 : null;
};

export const stylesForDecade = (styles: readonly CoverStyle[], decade: string | undefined | null): CoverStyle[] => {
	const d = decadeNumber(decade);
	if (d === null) return [...styles];
	const dist = (s: CoverStyle) => Math.min(...(s.decades ?? []).map((x) => Math.abs((decadeNumber(x) ?? 9999) - d)), 9999);
	const best = Math.min(...styles.map(dist));
	return styles.filter((s) => dist(s) === best);
};
