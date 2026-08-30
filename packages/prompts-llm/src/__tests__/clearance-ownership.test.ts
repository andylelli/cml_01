/**
 * A_76 §14 — clearance ownership, resolved once.
 *
 * The defect: 172 prose prompts carried `SUSPECT CLEARANCE REQUIRED (MANDATORY)`, distributed to
 * ch8/ch9/ch10 only, with the BYTE-IDENTICAL suspect list going to all three of the final chapters
 * of the complained-about run. We ordered the roll-call three times and regenerated any chapter that
 * omitted it.
 *
 * The cause of the cause: exact coordinate matching NEVER succeeds — 1 of 116 clearance refs match an
 * outline scene across 29 books — because the CML numbers scenes against a nominal ~6-scene story
 * (act 3, scene 5) while the outline numbers them globally (act 3, scenes 8–10). So the exclusivity
 * branch was dead code and everything fell through to keyword matching.
 *
 * These tests pin the reconciliation and the two invariants an ownership latch must hold.
 */

import { describe, expect, it } from 'vitest';

import {
  resolveClearanceOwnership,
  isClearanceOwnershipEnabled,
} from '../agent9-prose/clearance-ownership.js';

/** The real shape from canary_1788111325657 — three suspects at act 3 scene 5, victim at scene 6. */
const CLEARANCE_SCENES = [
  { suspect_name: 'Beatrice Quill', act_number: 3, scene_number: 5 },
  { suspect_name: 'Sylvia Trent', act_number: 3, scene_number: 5 },
  { suspect_name: 'Hugo Vane', act_number: 3, scene_number: 5 },
  { suspect_name: 'Dr. Mallory Finch', act_number: 3, scene_number: 6 },
];

/** The real outline: act 3 holds scenes 8, 9, 10 — coordinates that match NOTHING in the CML. */
const OUTLINE = [
  { act: 1, sceneNumber: 1 }, { act: 1, sceneNumber: 2 }, { act: 1, sceneNumber: 3 },
  { act: 2, sceneNumber: 4 }, { act: 2, sceneNumber: 5 }, { act: 2, sceneNumber: 6 },
  { act: 2, sceneNumber: 7 },
  { act: 3, sceneNumber: 8 }, { act: 3, sceneNumber: 9 }, { act: 3, sceneNumber: 10 },
];

describe('the numbering schemes are reconciled by ordinal within the act', () => {
  it('resolves act-3 scene 5 onto the FIRST outline scene of act 3, not scene 5 of the book', () => {
    // Exact matching gives nothing here — that is the whole point. Ordinal position is the one
    // thing Agent 3 and Agent 7 agree on.
    const o = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    const beatrice = o.entries.find((e) => e.suspectName === 'Beatrice Quill');
    expect(beatrice?.ownerSceneNumber).toBe(8);
  });

  it('gives all three suspects at the same CML scene the same owner', () => {
    const o = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    for (const name of ['Beatrice Quill', 'Sylvia Trent', 'Hugo Vane']) {
      expect(o.entries.find((e) => e.suspectName === name)?.ownerSceneNumber).toBe(8);
    }
    expect(o.suspectsByScene.get(8)).toHaveLength(3);
  });
});

describe('INVARIANT 1 — one owner per suspect', () => {
  it('never assigns the same suspect twice', () => {
    const dup = [
      { suspect_name: 'Beatrice Quill', act_number: 3, scene_number: 5 },
      { suspect_name: 'Beatrice Quill', act_number: 3, scene_number: 6 },
    ];
    const o = resolveClearanceOwnership({ clearanceScenes: dup, allOutlineScenes: OUTLINE });
    const owned = o.entries.filter((e) => e.suspectName === 'Beatrice Quill' && e.ownerSceneNumber !== null);
    expect(owned).toHaveLength(1);
    expect(o.entries.filter((e) => e.suspectName === 'Beatrice Quill').map((e) => e.reason))
      .toContain('already owned by an earlier chapter');
  });

  it('no chapter appears twice for one suspect in suspectsByScene', () => {
    const o = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    for (const names of o.suspectsByScene.values()) {
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe('INVARIANT 2 — the final chapter can never own a clearance', () => {
  it('vetoes the last scene of the book', () => {
    const o = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    expect(o.vetoed.has(10)).toBe(true);
    expect(o.suspectsByScene.has(10)).toBe(false);
  });

  it('when the ordinal target IS the finale, moves BACKWARD not forward', () => {
    // Moving a clearance earlier is always safe: suspect closure is validated over the whole
    // manuscript (22 of 28 stored books still pass with both final chapters deleted). Moving it
    // later walks toward the finale, which is the defect.
    const lateRef = [{ suspect_name: 'Hugo Vane', act_number: 3, scene_number: 5 }];
    const twoSceneAct = [
      { act: 3, sceneNumber: 9 }, { act: 3, sceneNumber: 10 },
    ];
    const o = resolveClearanceOwnership({ clearanceScenes: lateRef, allOutlineScenes: twoSceneAct });
    expect(o.entries[0]?.ownerSceneNumber).toBe(9);
  });

  it('does NOT veto when there is no alternative — coverage outranks tidiness', () => {
    const one = [{ act: 3, sceneNumber: 1 }];
    const o = resolveClearanceOwnership({
      clearanceScenes: [{ suspect_name: 'Hugo Vane', act_number: 3, scene_number: 5 }],
      allOutlineScenes: one,
    });
    expect(o.vetoed.size).toBe(0);
    expect(o.entries[0]?.ownerSceneNumber).toBe(1);
  });
});

describe('exclusions and degenerate input', () => {
  it('excludes the victim, so we never order the murder victim cleared', () => {
    // Dr. Mallory Finch is the VICTIM and the CML assigns them a clearance anyway. The closure
    // validator has the mirror of this bug and hard-stops runs over it.
    const o = resolveClearanceOwnership({
      clearanceScenes: CLEARANCE_SCENES,
      allOutlineScenes: OUTLINE,
      excludeSuspects: ['Dr. Mallory Finch'],
    });
    const victim = o.entries.find((e) => e.suspectName === 'Dr. Mallory Finch');
    expect(victim?.ownerSceneNumber).toBeNull();
    expect(victim?.reason).toMatch(/excluded/);
  });

  it('returns empty rather than throwing on missing inputs', () => {
    expect(resolveClearanceOwnership({ clearanceScenes: [], allOutlineScenes: [] }).entries).toHaveLength(0);
    expect(resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: [] })
      .suspectsByScene.size).toBe(0);
  });

  it('says so when it could not resolve anything, rather than failing silently', () => {
    const o = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: [] });
    expect(o.notes.join(' ')).toMatch(/no chapter could own any clearance/);
  });

  it('is deterministic — same inputs, same answer', () => {
    const a = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    const b = resolveClearanceOwnership({ clearanceScenes: CLEARANCE_SCENES, allOutlineScenes: OUTLINE });
    expect(JSON.stringify(a.entries)).toBe(JSON.stringify(b.entries));
  });
});

describe('the flag is read at call time', () => {
  it('is off by default and settable from the environment', () => {
    expect(isClearanceOwnershipEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isClearanceOwnershipEnabled({ AGENT9_CLEARANCE_OWNERSHIP: 'true' } as never)).toBe(true);
  });
});
