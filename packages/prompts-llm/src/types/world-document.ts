/**
 * World Document types for Agent 6.5 (World Builder).
 *
 * The WorldDocumentResult is produced by generateWorldDocument() and consumed
 * by Agent 7 (narrative enrichment) and Agent 9 (prose generation).
 */

export interface WorldDocumentHistoricalMoment {
  specificDate: string;
  eraRegister: string;
  currentTensions: string[];
  physicalConstraints: string[];
  emotionalRegister: string;
  wartimeServiceContext?: {
    serviceStatus: string;
    socialTexture: string;
    absenceEffect?: string;
  };
}

export interface WorldDocumentCharacterPortrait {
  name: string;
  portrait: string;
  eraIntersection: string;
}

export interface WorldDocumentVoiceFragment {
  register: 'comfortable' | 'evasive' | 'stressed' | 'humorous' | 'formal';
  text: string;
}

export interface WorldDocumentCharacterVoiceSketch {
  name: string;
  voiceDescription: string;
  fragments: WorldDocumentVoiceFragment[];
  humourNote?: string;
}

export interface WorldDocumentLocationRegister {
  locationId: string;
  name: string;
  emotionalRegister: string;
  eraNote?: string;
  cameraAngle: string;
}

export interface WorldDocumentArcTurningPoint {
  /** Arc position enum — one of: opening | early | first_turn | mid | second_turn | pre_climax | climax | resolution */
  position: string;
  emotionalDescription: string;
}

export interface WorldDocumentEmotionalArc {
  dominantRegister: string;
  arcDescription: string;
  turningPoints: WorldDocumentArcTurningPoint[];
  endingNote: string;
}

export interface WorldDocumentHumourEntry {
  scenePosition: string;
  humourPermission: 'permitted' | 'conditional' | 'forbidden';
  condition?: string;
  permittedCharacters?: string[];
  permittedForms?: string[];
  rationale: string;
}

export interface WorldDocumentBreakMoment {
  character: string;
  scenePosition: string;
  form: string;
  narrativeFunction: string;
}

export interface WorldDocumentValidationConfirmations {
  noNewCharacterFacts: boolean;
  noNewPlotFacts: boolean;
  castComplete: boolean;
  eraSpecific: boolean;
  lockedFactsPreserved: boolean;
  humourMapComplete: boolean;
}

export interface WorldDocumentResult {
  status: 'draft' | 'final';
  storyTheme: string;
  historicalMoment: WorldDocumentHistoricalMoment;
  characterPortraits: WorldDocumentCharacterPortrait[];
  characterVoiceSketches: WorldDocumentCharacterVoiceSketch[];
  locationRegisters: WorldDocumentLocationRegister[];
  storyEmotionalArc: WorldDocumentEmotionalArc;
  humourPlacementMap: WorldDocumentHumourEntry[];
  breakMoment: WorldDocumentBreakMoment;
  revealImplications: string;
  validationConfirmations: WorldDocumentValidationConfirmations;
  cost: number;
  durationMs: number;
}
