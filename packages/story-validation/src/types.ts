/**
 * Story Validation Types
 */

export interface ValidationError {
  type: string;
  message: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  sceneNumber?: number;
  lineNumber?: number;
  suggestion?: string;
  cmlReference?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

export interface Scene {
  number: number;
  title: string;
  summary?: string;
  text: string;
  paragraphs?: string[];
}

export interface Story {
  id: string;
  projectId: string;
  scenes: Scene[];
  metadata?: {
    era?: string;
    setting?: string;
    cast?: string[];
  };
}

export interface CharacterState {
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'unknown';
  role: string;
  pronouns: {
    subject: string;  // he, she, they
    object: string;   // him, her, them
    possessive: string;  // his, her, their
  };
  isCrewMember: boolean;
  firstMention?: {
    scene: number;
    line: number;
  };
}

export interface CMLData {
  CASE: {
    meta: {
      era?: { decade?: string };
      setting?: { location?: string };
      crime_class?: { victim_identity_status?: string };
    };
    cast: Array<{
      name: string;
      role_archetype: string;
      gender?: string;
    }>;
    crime_scene?: {
      primary_location: string;
      location_type: 'interior' | 'exterior';
    };
    discriminating_test?: {
      method?: string;
      design?: string;
      pass_condition?: string;
    };
    culpability?: {
      culprits: string[];
    };
  };
}

export interface Validator {
  name: string;
  validate(story: Story, cml?: CMLData): Promise<ValidationResult> | ValidationResult;
}
