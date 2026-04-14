/**
 * Maps arc-position labels to the scenePosition labels used in
 * CML humourPlacementMap.
 */
export const ARC_POS_TO_SCENE_TYPE: Record<string, string> = {
  opening: 'opening_scene',
  early: 'first_investigation',
  first_turn: 'tension_scene',
  mid: 'mid_investigation',
  second_turn: 'second_interview',
  pre_climax: 'pre_climax',
  climax: 'discriminating_test',
  resolution: 'resolution',
};

/**
 * Maps each arc-position label to its dominant emotional register.
 * Used by voice fragment selection (§3.2) to prefer register-matched
 * fragments and by sensory variant selection (§3.3) for register filtering.
 */
export const ARC_POSITION_REGISTER: Record<string, string> = {
  opening:      'warm',
  early:        'curious',
  first_turn:   'urgent',
  mid:          'methodical',
  second_turn:  'stressed',
  pre_climax:   'stressed',
  climax:       'tense',
  resolution:   'reflective',
};

/**
 * High-tension arc positions used by §4.4 tonal contrast enforcement.
 * When two consecutive chapters are both in this set, a tonal contrast
 * instruction is injected into the obligation block.
 */
export const HIGH_TENSION_POSITIONS = new Set([
  'first_turn',
  'second_turn',
  'pre_climax',
  'climax',
]);
