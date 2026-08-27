/**
 * A_75 §6.1 (P1) — the voice-spec engine.
 *
 * Two things are worth pinning here and they are both about the lever being REAL rather than
 * plausible: that the divergence instruction names actual numbers (a generator told "be distinctive"
 * returns the corpus mean, which is how the corpus got uniform in the first place), and that the
 * parser coerces rather than throws — the Agent 7 beat-enum lesson, where a model's formatting slip
 * discarded an otherwise good candidate and burned the run's only attempt.
 */

import { describe, expect, it } from 'vitest';

import {
  generateVoiceSpec,
  divergenceSet,
  buildDivergenceBlock,
  buildVoiceSpecPrompt,
  buildVoiceSpecJudgePrompt,
  buildVoiceSpecBlock,
  parseVoiceSpecCandidate,
  summariseVoiceSpec,
  isVoiceSpecEnabled,
  VOICE_SPEC_CANDIDATES,
} from '../agent9-prose/voice-spec-engine.js';
import { VOICE_CORPUS } from '../constants/voice-corpus.js';
// Statically imported, NOT lazily inside a test body. The dynamic form compiled the 2,500-line
// prompt-builder on first call and took ~3.7s in isolation, which timed out under full-suite load —
// a flake introduced by the test, not by the code it covers.
import {
  applyPromptBudgeting,
  __CRAFT_INPUT_BLOCKS,
  __DROP_LAST_BLOCKS,
} from '../agent9-prose/prompt-builder.js';
import { validateVoiceSpec } from '@cml/prose-guard';
import type { VoiceSpec } from '@cml/prose-guard';

const SPEC: VoiceSpec = {
  sentenceLength: { mean: 11.4, sd: 5.5 },
  syntacticHabit: 'long periodic sentences that withhold the verb',
  diction: 'latinate-formal',
  narrationDistance: 'wry-companion',
  signatureMove: 'the detective notices what is absent before what is present',
  avoid: ['the word "faint"'],
};

describe('the divergence instruction names real numbers', () => {
  const block = buildDivergenceBlock();

  it('quotes the measured corpus, not an adjective', () => {
    expect(VOICE_CORPUS.length).toBeGreaterThanOrEqual(10);
    // Every corpus mean must appear, or the generator is being asked to avoid a set it cannot see.
    for (const entry of VOICE_CORPUS) {
      expect(block).toContain(entry.mean.toFixed(1));
    }
  });

  it('states the gap and the range the validator actually enforces', () => {
    expect(block).toMatch(/at least 2\.0 words away/);
    expect(block).toMatch(/\[9, 22\]/);
  });

  it('says why — a constraint with no reason gets negotiated away', () => {
    expect(block.toLowerCase()).toContain('smaller than the variation inside any');
  });

  it('folds in prior committed specs as well as the measured corpus', () => {
    const withRecent = buildDivergenceBlock([
      { story: 's1', mean: 20.5, diction: 'plain-anglo', narrationDistance: 'cool-observer', signatureMove: 'the clock is always wrong' },
    ]);
    expect(withRecent).toContain('20.5');
    expect(withRecent).toContain('the clock is always wrong');
  });
});

describe('the generation prompt', () => {
  const { system, user } = buildVoiceSpecPrompt({ title: 'The Reversed Pendulum', era: '1932' });

  it('asks for the number of candidates the engine expects to parse', () => {
    expect(system).toContain(String(VOICE_SPEC_CANDIDATES));
  });

  it('refuses adjectives as voices, in the prompt itself', () => {
    expect(system.toLowerCase()).toContain('are not voices');
  });

  it('requires the candidates to differ from each other, not just from the corpus', () => {
    // Three variations on one rhythm is one candidate submitted three times, and the judge cannot
    // tell them apart.
    expect(system).toMatch(/differ from EACH OTHER/i);
  });

  it('carries the book so the voice suits it', () => {
    expect(user).toContain('The Reversed Pendulum');
    expect(user).toContain('1932');
  });
});

describe('the parser coerces, it does not throw', () => {
  it('accepts snake_case and a mis-worded enum', () => {
    const spec = parseVoiceSpecCandidate({
      sentence_length: { mean: 18, sd: 9 },
      syntactic_habit: 'parataxis',
      diction: 'Plain Anglo',
      narration_distance: 'COOL_OBSERVER',
      signature_move: 'doors are always described by their sound',
    });
    expect(spec?.diction).toBe('plain-anglo');
    expect(spec?.narrationDistance).toBe('cool-observer');
    expect(spec?.sentenceLength).toEqual({ mean: 18, sd: 9 });
  });

  it('falls back on an unrecognised enum rather than discarding the candidate', () => {
    // The Agent 7 beat-enum lesson: coerce before validating, or one bad field costs the whole call.
    const spec = parseVoiceSpecCandidate({ sentenceLength: { mean: 12, sd: 5 }, diction: 'baroque' });
    expect(spec?.diction).toBe('mixed-period');
  });

  it('supplies a default spread when the model omits it', () => {
    expect(parseVoiceSpecCandidate({ sentenceLength: { mean: 12 } })?.sentenceLength.sd).toBe(7);
  });

  it('returns null only when there is no usable mean', () => {
    expect(parseVoiceSpecCandidate({ syntacticHabit: 'fragments' })).toBeNull();
    expect(parseVoiceSpecCandidate(null)).toBeNull();
    expect(parseVoiceSpecCandidate('nonsense')).toBeNull();
  });
});

describe('the block the writer sees', () => {
  const block = buildVoiceSpecBlock(SPEC);

  it('is empty with no spec, so the prompt is byte-identical with the flag off', () => {
    expect(buildVoiceSpecBlock(null)).toBe('');
    expect(buildVoiceSpecBlock(undefined)).toBe('');
  });

  it('states the average as a target AND tells the writer to vary around it', () => {
    // A model told to hit 11 words per sentence writes eleven-word sentences and nothing else, which
    // is a metronome. The spread has to be in the instruction, not just in the spec.
    expect(block).toContain('11 words per sentence');
    expect(block).toMatch(/VARY widely/);
    expect(block).toContain('The average is the target, not the shape.');
  });

  it('carries every committed field', () => {
    expect(block).toContain(SPEC.syntacticHabit);
    expect(block).toContain(SPEC.signatureMove);
    expect(block).toContain('latinate formal');
    expect(block).toContain('wry companion');
    expect(block).toContain('the word "faint"');
  });

  it('stays short — the craft blocks are what budget pressure deletes first', () => {
    // X47 measured craft_guide and judged_on dying on chapters 8-10. A voice block that ran to a page
    // would be dropped from exactly the chapters it needs to reach.
    expect(block.split('\n').length).toBeLessThanOrEqual(10);
  });
});

describe('the judge prompt', () => {
  const { system, user } = buildVoiceSpecJudgePrompt([SPEC, { ...SPEC, sentenceLength: { mean: 19, sd: 9 } }], {});

  it('judges on distinctiveness AND writability, and says so', () => {
    expect(system).toContain('DISTINCTIVENESS');
    expect(system).toContain('WRITABILITY');
  });

  it('indexes the candidates from zero, as the engine reads them', () => {
    expect(user).toContain('[0]');
    expect(user).toContain('[1]');
    expect(system).toContain('counting from 0');
  });
});

describe('the flag is read at call time', () => {
  it('is off by default and settable from the environment', () => {
    // A module-const flag freezes before dotenv — the trap this repo has paid for twice, most
    // recently on a lever that was unsettable from .env.local.
    expect(isVoiceSpecEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isVoiceSpecEnabled({ AGENT9_VOICE_SPEC: 'true' } as unknown as NodeJS.ProcessEnv)).toBe(true);
    expect(isVoiceSpecEnabled({ AGENT9_VOICE_SPEC: '1' } as unknown as NodeJS.ProcessEnv)).toBe(true);
    expect(isVoiceSpecEnabled({ AGENT9_VOICE_SPEC: 'false' } as unknown as NodeJS.ProcessEnv)).toBe(false);
  });
});

describe('summariseVoiceSpec feeds the next story', () => {
  it('keeps the mean and the signature move — what a divergence instruction needs', () => {
    expect(summariseVoiceSpec('story_20260827-1200', SPEC)).toEqual({
      story: 'story_20260827-1200',
      mean: 11.4,
      diction: 'latinate-formal',
      narrationDistance: 'wry-companion',
      signatureMove: SPEC.signatureMove,
    });
  });
});

describe('the voice block is the LAST droppable block, whatever the array order says', () => {
  /**
   * THE DEFECT THIS REPLACES, measured on the live arm-B run rather than argued: `voice_spec` was
   * placed after `craft_guide` in the ordered array with a comment claiming it would die last. It was
   * dropped from chapter 6 onward, BEFORE `world_document`, which sits far earlier in that array —
   * because `AGENT9_PROMPT_PREFIX_ORDER` reorders by STABILITY before the drop loop runs, so array
   * position never reaches it.
   *
   * The previous version of this test passed anyway, because it fed `applyPromptBudgeting` a
   * hand-built array in the order it wanted. A test that constructs the input it hopes for proves
   * nothing about the pipeline. These pass the blocks in the ADVERSE order instead.
   */
  const blk = (key: string, tokens: number) => ({ key, priority: 'high' as const, content: 'x'.repeat(tokens * 4) });

  const withCraftFloor = async <T>(fn: () => Promise<T> | T): Promise<T> => {
    const prev = process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR;
    process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR = 'true';
    try {
      return await fn();
    } finally {
      if (prev === undefined) delete process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR;
      else process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR = prev;
    }
  };

  it('is declared drop-last, and is a craft input as well', async () => {
    expect(__DROP_LAST_BLOCKS.has('voice_spec')).toBe(true);
    expect(__CRAFT_INPUT_BLOCKS.has('voice_spec')).toBe(true);
  });

  it('survives when voice_spec is passed FIRST — the order the live run actually produced', async () => {
    await withCraftFloor(() => {
      // voice_spec ahead of everything, exactly as the stability reorder placed it on the real run.
      const { droppedBlocks } = applyPromptBudgeting(
        'f'.repeat(100 * 4), '', '',
        [blk('voice_spec', 65), blk('world_document', 300), blk('craft_guide', 300)],
        // Tight enough that BOTH of the others must go — otherwise one drop suffices and the test
        // never reaches the question it is asking.
        300,
      );
      expect(droppedBlocks).toContain('craft_guide');
      expect(droppedBlocks).toContain('world_document');
      expect(droppedBlocks).not.toContain('voice_spec');
    });
  });

  it('survives with the craft floor OFF too — ordering is unconditional', async () => {
    const prev = process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR;
    delete process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR;
    try {
      const { droppedBlocks } = applyPromptBudgeting(
        'f'.repeat(100 * 4), '', '',
        [blk('voice_spec', 65), blk('humour_guide', 400)],
        480,
      );
      expect(droppedBlocks).toEqual(['humour_guide']);
    } finally {
      if (prev !== undefined) process.env.AGENT9_PROMPT_BUDGET_CRAFT_FLOOR = prev;
    }
  });

  it('still goes when nothing else is left — protection is an ORDER, not immunity', async () => {
    await withCraftFloor(() => {
      const { droppedBlocks } = applyPromptBudgeting(
        'f'.repeat(500 * 4), '', '',
        [blk('voice_spec', 65)],
        510,
      );
      expect(droppedBlocks).toEqual(['voice_spec']);
    });
  });
});

describe('generateVoiceSpec — the async path, which no test had ever executed', () => {
  /**
   * The engine is flag-gated and unrun. A lever whose code path has never been exercised is how a
   * paid probe comes back measuring nothing, so the whole path runs here against a fake client:
   * parse, validate, judge, fall back, and fail safely.
   */
  const makeClient = (replies: string[], onCall?: (agent: string) => void) => {
    let i = 0;
    return {
      chat: async (req: any) => {
        onCall?.(req?.logContext?.agent ?? '');
        const content = replies[Math.min(i, replies.length - 1)];
        i += 1;
        if (content === '__throw__') throw new Error('content filter');
        return { content };
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    } as any;
  };

  const candidate = (mean: number, sd = 6) => ({
    sentenceLength: { mean, sd },
    syntacticHabit: 'clauses stacked with and, then',
    diction: 'plain-anglo',
    narrationDistance: 'cool-observer',
    signatureMove: 'rooms are introduced by what is missing from them',
    avoid: [],
  });

  it("commits the judge's winner", async () => {
    const agents: string[] = [];
    // 19 is deliberately in this list and deliberately NOT selectable: the corpus tops out at 17.2,
    // so 19 is 1.8 words away and the gate rejects it. The usable pair is 11 and 21, and the judge's
    // index counts over the SURVIVORS.
    const client = makeClient(
      [
        JSON.stringify({ candidates: [candidate(11), candidate(19), candidate(21)] }),
        JSON.stringify({ winner: 1, score: 82, why: 'most distinctive and still writable' }),
      ],
      (a) => agents.push(a),
    );
    const res = await generateVoiceSpec(client, {}, []);
    expect(res.ran).toBe(true);
    expect(res.spec?.sentenceLength.mean).toBe(21);
    expect(agents).toEqual(['Agent9-VoiceSpec', 'Agent9-VoiceSpecJudge']);
    expect(res.candidates.find((c) => c.spec.sentenceLength.mean === 21)?.note).toContain('judge winner');
    expect(res.candidates.find((c) => c.spec.sentenceLength.mean === 19)?.rejected.join(' ')).toMatch(/words from/);
  });

  it('REJECTS candidates that sit on the corpus, and says which — the gate must be visible', async () => {
    // 15.6 is the corpus mean; a run where nothing is ever rejected has a gate that never fires.
    const client = makeClient([JSON.stringify({ candidates: [candidate(15.6), candidate(11)] }),
      JSON.stringify({ winner: 0 })]);
    const res = await generateVoiceSpec(client, {}, []);
    expect(res.spec?.sentenceLength.mean).toBe(11);
    const rejected = res.candidates.filter((c) => c.rejected.length > 0);
    expect(rejected.length).toBeGreaterThan(0);
    expect(rejected[0].rejected.join(' ')).toMatch(/only .* words from/);
  });

  it('skips the judge when only one candidate survives — no ranking of one', async () => {
    const agents: string[] = [];
    const client = makeClient([JSON.stringify({ candidates: [candidate(15.6), candidate(11)] })], (a) => agents.push(a));
    // Both corpus-adjacent except 11.
    const res = await generateVoiceSpec(client, {}, []);
    expect(res.ran).toBe(true);
    expect(agents).toEqual(['Agent9-VoiceSpec']);
    expect(res.candidates.find((c) => c.rejected.length === 0)?.note).toContain('no judge call');
  });

  it('falls back to the first survivor when the judge returns an out-of-range index', async () => {
    const client = makeClient([
      JSON.stringify({ candidates: [candidate(11), candidate(19)] }),
      JSON.stringify({ winner: 7 }),
    ]);
    const res = await generateVoiceSpec(client, {}, []);
    expect(res.spec?.sentenceLength.mean).toBe(11);
  });

  it('CANNOT stop a run — a thrown call returns a null spec, not an exception', async () => {
    // The B1 reasoning applied to a craft lever: any failure leaves the prompt byte-identical.
    const res = await generateVoiceSpec(makeClient(['__throw__']), {}, []);
    expect(res.ran).toBe(false);
    expect(res.spec).toBeNull();
    expect(res.error).toContain('content filter');
  });

  it('survives unparseable output and reports WHY, rather than a silent null', async () => {
    const res = await generateVoiceSpec(makeClient(['I think the voice should be lyrical.']), {}, []);
    expect(res.spec).toBeNull();
    expect(res.error).toBeTruthy();
  });

  it('reports every candidate rejected, with the reason, when none survives', async () => {
    const res = await generateVoiceSpec(makeClient([JSON.stringify({ candidates: [candidate(15.6), candidate(15.4)] })]), {}, []);
    expect(res.spec).toBeNull();
    expect(res.candidates).toHaveLength(2);
    expect(res.error).toMatch(/rejected/);
  });

  it('accepts a bare array and a single bare object — models return both', async () => {
    const asArray = await generateVoiceSpec(makeClient([JSON.stringify([candidate(11), candidate(20)]), JSON.stringify({ winner: 0 })]), {}, []);
    expect(asArray.spec?.sentenceLength.mean).toBe(11);
    const asObject = await generateVoiceSpec(makeClient([JSON.stringify(candidate(20))]), {}, []);
    expect(asObject.spec?.sentenceLength.mean).toBe(20);
  });
});

describe('THE OPERATIONAL RISK: the corpus can close the door', () => {
  /**
   * The gate rejects anything within 2.0 words of the 20 corpus means, which run 13.6 to 17.2. The
   * writable space is therefore [9, 11.6] and [19.2, 22] and nothing between — narrow by design, and
   * it NARROWS FURTHER as new books land in those bands. If it ever closes, every candidate is
   * rejected, the spec is null, and the lever silently stops existing while the flag reads ON.
   *
   * That failure is loud rather than silent — the worker logs each rejection with its reason — but
   * it is worth a test that states the shape, because the fix is to widen VOICE_MEAN_MIN/MAX or
   * shrink the corpus window, not to loosen the gap.
   */
  it('the corpus leaves exactly two usable bands, and the engine reports it when both are missed', async () => {
    const client = {
      chat: async () => ({ content: JSON.stringify({ candidates: [{ sentenceLength: { mean: 15.0, sd: 6 }, syntacticHabit: 'h', signatureMove: 's' }] }) }),
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    } as any;
    const res = await generateVoiceSpec(client, {}, []);
    expect(res.spec).toBeNull();
    expect(res.error).toMatch(/rejected/);
    // The reason names the book it collided with, so a run log says WHY the lever produced nothing.
    expect(res.candidates[0].rejected.join(' ')).toMatch(/story_/);
  });
});

describe("the open bands, not just the forbidden means", () => {
  /**
   * Stating what is forbidden is not stating what is available, and the difference is expensive: a
   * model asked to avoid twenty numbers between 13.6 and 17.2 most often returns 13-17 anyway,
   * because that is where its natural register sits. Every candidate is then rejected, no spec is
   * committed, and an arm of a PAID matched pair silently becomes a copy of the other arm — two
   * identical books read as evidence that the lever does nothing.
   */
  const block = buildDivergenceBlock();

  it("names the intervals a candidate may actually land in", () => {
    expect(block).toContain("THAT LEAVES EXACTLY THESE BANDS OPEN");
    expect(block).toMatch(/9\.0 to 11\.[0-9] words per sentence/);
    expect(block).toMatch(/19\.[0-9] to 22\.0 words per sentence/);
  });

  it("the stated bands agree with what the validator accepts — a prompt and a gate that disagree is the bug this file already had once", () => {
    const bands = [...block.matchAll(/([0-9.]+) to ([0-9.]+) words per sentence/g)]
      .map((m) => [Number(m[1]), Number(m[2])] as const);
    expect(bands.length).toBeGreaterThan(0);
    const spec = (mean: number) => ({
      sentenceLength: { mean, sd: 6 },
      syntacticHabit: 'h',
      diction: 'plain-anglo' as const,
      narrationDistance: 'cool-observer' as const,
      signatureMove: 's',
      avoid: [],
    });
    for (const [lo, hi] of bands) {
      // Just inside each edge must be accepted; the midpoint of the forbidden gap must not.
      expect(validateVoiceSpec(spec(lo + 0.1), divergenceSet()).ok).toBe(true);
      expect(validateVoiceSpec(spec(hi - 0.1), divergenceSet()).ok).toBe(true);
    }
    expect(validateVoiceSpec(spec(15.5), divergenceSet()).ok).toBe(false);
  });

  it("says so plainly if the corpus ever fills the range, instead of asking for the impossible", async () => {
    // The band-exhaustion failure mode: loud, not silent.
    const crowded = Array.from({ length: 14 }, (_, i) => ({
      story: `s${i}`, mean: 9 + i, diction: 'plain-anglo' as const,
      narrationDistance: 'cool-observer' as const, signatureMove: '',
    }));
    expect(buildDivergenceBlock(crowded)).toContain("NO BAND IS OPEN");
  });
});
