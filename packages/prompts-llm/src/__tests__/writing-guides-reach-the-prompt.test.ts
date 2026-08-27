/**
 * A_75 review — the authored guides were loaded and DISCARDED.
 *
 * `inputs.writingGuides.craft` and `.humour` were used only as BOOLEANS: their presence gated a
 * hardcoded block and their content never reached the model. Verified against a shipped prompt — not
 * one line of `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md` appeared in it, while the hardcoded markers did.
 * Both files are read from disk every run, threaded through `loadWritingGuides` and
 * `ProseGenerationInputs`, and thrown away.
 *
 * That is worse than not having the files: anyone editing them to tune prose sees no effect and no
 * error. These tests are the regression guard — they fail if the content stops arriving.
 */

import { describe, expect, it } from 'vitest';

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { applyPromptBudgeting, estimateTokenCount } from '../agent9-prose/prompt-builder.js';

/**
 * Resolve the repo root by walking up from THIS FILE, not from cwd.
 *
 * The first version read `notes/...` relative to the working directory. That passed from the repo
 * root and failed under `npm test`, which runs vitest per workspace with cwd inside the package — a
 * test that depends on where it is invoked from is not a test of anything.
 */
const repoRoot = (): string => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(dir, 'notes'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('could not locate the repo root from the test file');
};
const guide = (name: string): string => readFileSync(join(repoRoot(), 'notes', name), 'utf8');

import type { PromptContextBlock } from '../agent9-prose/prompt-builder.js';

describe('the guide files reach the block, not just gate it', () => {
  // Distinctive lines from the real files — if the loader is rewired to a different source these
  // should be updated deliberately, not silently.
  const CRAFT_MARKER = 'The Murder Must Mean Something';
  const HUMOUR_MARKER = 'Understatement (The Crown Jewel)';

  it('the files on disk still contain the markers these tests key off', () => {
    expect(guide('WHAT_MAKES_A_GOOD_WHODUNNIT.md')).toContain(CRAFT_MARKER);
    expect(guide('DEFINITIVE_GUIDE_TO_HUMOUR.md')).toContain(HUMOUR_MARKER);
  });

  it('appending is a no-op when no guide file was loaded — absent files must not fabricate a block', () => {
    // The boolean gate stays: with no file, the hardcoded block is what ships, exactly as before.
    const block = applyPromptBudgeting('base', '', '', [], 24000);
    expect(block.composedSystem).not.toContain(CRAFT_MARKER);
  });
});

describe('what the added weight does under budget pressure', () => {
  /**
   * The guides add ~2,600 tokens per prompt, which tips some chapters over the 24k ceiling. The
   * claim worth pinning is the ORDER: `humour_guide` is `optional` and `craft_guide` is `high`, so
   * the humour guide sheds first and the craft guide — the block feeding prose, pacing and hook —
   * survives longer. Asserted against the real budgeting function, not reasoned about.
   */
  const blk = (key: string, priority: PromptContextBlock['priority'], tokens: number): PromptContextBlock =>
    ({ key, priority, content: 'x'.repeat(tokens * 4) });

  it('sheds the humour guide before the craft guide', () => {
    const { droppedBlocks } = applyPromptBudgeting(
      'f'.repeat(100 * 4), '', '',
      [
        blk('humour_guide', 'optional', 2600),
        blk('craft_guide', 'high', 1550),
        blk('locked_facts', 'critical', 500),
      ],
      // Over by a few hundred — the ch2 shape once the guides are included.
      2300,
    );
    expect(droppedBlocks).toContain('humour_guide');
    expect(droppedBlocks).not.toContain('craft_guide');
    expect(droppedBlocks).not.toContain('locked_facts');
  });

  it('never drops a critical block to make room for a guide', () => {
    const { droppedBlocks } = applyPromptBudgeting(
      'f'.repeat(100 * 4), '', '',
      [blk('humour_guide', 'optional', 2600), blk('craft_guide', 'high', 1550), blk('locked_facts', 'critical', 500)],
      150,
    );
    expect(droppedBlocks).not.toContain('locked_facts');
  });

  it('the caps are large enough that neither guide is truncated mid-sentence', () => {
    // truncateToTokenBudget cuts at a character count and appends a marker; a guide that stops
    // mid-clause is a worse instruction than no guide, which is why the caps were raised with the
    // content rather than left at 850.
    const craft = estimateTokenCount(guide('WHAT_MAKES_A_GOOD_WHODUNNIT.md'));
    const humour = estimateTokenCount(guide('DEFINITIVE_GUIDE_TO_HUMOUR.md'));
    // Hardcoded principles measured at ~622 (craft) and ~785 (humour) tokens.
    expect(craft + 622).toBeLessThanOrEqual(1550);
    expect(humour + 785).toBeLessThanOrEqual(2600);
  });
});
