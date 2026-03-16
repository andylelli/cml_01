/**
 * Programmatic period-authentic name generation for mystery cast members.
 *
 * Names are picked in code from curated historical pools using a seeded PRNG
 * (seeded from the runId), ensuring every run gets a fresh, varied cast
 * without relying on the LLM's statistical name biases (which tend to recycle
 * a small set of "genre-attractor" names like Inspector Harlow or Mr. Vane).
 *
 * Pools cover the full 1880–1960 range appropriate for Golden Age mystery
 * fiction. Each pool carries its own naming tradition (English gentry,
 * professional London, Scottish Lowland, Irish, Norman-French, Northern
 * English), giving cultural variety across runs while staying era-authentic.
 */
/**
 * Setting context from Agent 1 output, used to weight name pool selection.
 * All fields are optional; omitting them falls back to uniform random selection.
 */
export interface NameGeneratorContext {
    /** Story decade (e.g. 1920, 1935). Used to pick era-appropriate first names. */
    decade?: number;
    /** Location type from setting (e.g. "country house", "village", "london"). */
    locationType?: string;
    /** Full location description from setting, searched for additional signals. */
    locationDescription?: string;
    /** Social context / norms string from setting, searched for social signals. */
    socialContext?: string;
}
/**
 * Generate `count` period-authentic full names for a mystery cast.
 *
 * Names are picked deterministically from curated historical pools using a
 * seeded PRNG, so the same runId always produces the same names, but
 * different runs produce genuinely different casts.
 *
 * When `context` is supplied (from Agent 1 setting output), pool selection is
 * weighted by location and social signals, and first names are blended from
 * the pool's own list (2× weight) plus an era-appropriate bucket derived from
 * the story decade.
 *
 * Gender is distributed roughly half-and-half (randomised per run).
 *
 * @param runId   - The run identifier used to seed the PRNG.
 * @param count   - How many names to generate (total cast size incl. detective).
 * @param context - Optional setting context from Agent 1 output.
 * @returns Array of full names e.g. `["Harriet Wellow", "Cecil Ackroyd", ...]`
 */
export declare function generateCastNames(runId: string, count: number, context?: NameGeneratorContext): string[];
