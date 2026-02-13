/**
 * Character Consistency Validator
 * Priority: CRITICAL - Prevents story-breaking character inconsistencies
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError, CharacterState } from './types.js';

export class CharacterConsistencyValidator implements Validator {
  name = 'CharacterConsistencyValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    if (!cml) {
      return { valid: true, errors: [] };
    }

    // Build character manifest from CML
    const manifest = this.buildCharacterManifest(cml);

    // Track character usage across scenes
    const usageTracker = new Map<string, { scenes: number[]; pronouns: Set<string> }>();

    for (const scene of story.scenes) {
      // Check name consistency
      const mentionedNames = this.extractCharacterNames(scene.text, manifest);
      
      for (const name of mentionedNames) {
        if (!manifest.has(name)) {
          // Check if this might be a name variation
          const similarName = this.findSimilarName(name, Array.from(manifest.keys()));
          if (similarName) {
            errors.push({
              type: 'character_name_inconsistency',
              message: `Character name "${name}" does not match CML. Did you mean "${similarName}"?`,
              severity: 'critical',
              sceneNumber: scene.number,
              cmlReference: `cast[${similarName}]`
            });
          } else {
            errors.push({
              type: 'unknown_character',
              message: `Character "${name}" not found in CML cast`,
              severity: 'major',
              sceneNumber: scene.number
            });
          }
        }

        // Track usage
        if (!usageTracker.has(name)) {
          usageTracker.set(name, { scenes: [], pronouns: new Set() });
        }
        usageTracker.get(name)!.scenes.push(scene.number);
      }

      // Check pronoun-gender agreement
      for (const [name, charState] of manifest.entries()) {
        if (scene.text.includes(name)) {
          const pronounErrors = this.checkPronounAgreement(scene.text, name, charState, scene.number);
          errors.push(...pronounErrors);
        }
      }

      // Check role-location consistency
      const locationErrors = this.checkRoleLocationConsistency(scene, manifest);
      errors.push(...locationErrors);
    }

    // Check for character name switches (same character referred to by different names)
    const switchErrors = this.detectNameSwitches(story, manifest);
    errors.push(...switchErrors);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private buildCharacterManifest(cml: CMLData): Map<string, CharacterState> {
    const manifest = new Map<string, CharacterState>();

    for (const char of cml.CASE.cast) {
      const gender = this.parseGender(char.gender);
      manifest.set(char.name, {
        name: char.name,
        gender,
        role: char.role_archetype,
        pronouns: this.getPronounsForGender(gender),
        isCrewMember: this.isCrewRole(char.role_archetype)
      });
    }

    return manifest;
  }

  private parseGender(gender?: string): 'male' | 'female' | 'non-binary' | 'unknown' {
    const g = gender?.toLowerCase();
    if (g === 'male' || g === 'm') return 'male';
    if (g === 'female' || g === 'f') return 'female';
    if (g === 'non-binary' || g === 'nb') return 'non-binary';
    return 'unknown';
  }

  private getPronounsForGender(gender: string): { subject: string; object: string; possessive: string } {
    switch (gender) {
      case 'male':
        return { subject: 'he', object: 'him', possessive: 'his' };
      case 'female':
        return { subject: 'she', object: 'her', possessive: 'her' };
      case 'non-binary':
        return { subject: 'they', object: 'them', possessive: 'their' };
      default:
        return { subject: 'they', object: 'them', possessive: 'their' };
    }
  }

  private isCrewRole(role: string): boolean {
    const crewKeywords = ['crew', 'captain', 'officer', 'steward', 'engineer', 'sailor', 'staff'];
    return crewKeywords.some(kw => role.toLowerCase().includes(kw));
  }

  private extractCharacterNames(text: string, manifest: Map<string, CharacterState>): string[] {
    const names: string[] = [];
    for (const name of manifest.keys()) {
      if (text.includes(name)) {
        names.push(name);
      }
    }
    return names;
  }

  private findSimilarName(name: string, validNames: string[]): string | null {
    // Simple similarity check - could be enhanced with Levenshtein distance
    const nameLower = name.toLowerCase();
    
    for (const validName of validNames) {
      // Check for partial matches
      if (validName.toLowerCase().includes(nameLower) || nameLower.includes(validName.toLowerCase())) {
        return validName;
      }
      
      // Check for last name match
      const nameWords = name.split(' ');
      const validWords = validName.split(' ');
      if (nameWords.some(w => validWords.includes(w))) {
        return validName;
      }
    }
    
    return null;
  }

  private checkPronounAgreement(text: string, characterName: string, charState: CharacterState, sceneNumber: number): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (charState.gender === 'unknown') {
      return errors; // Skip validation if gender unknown
    }

    const correctPronouns = charState.pronouns;
    const incorrectPronouns = this.findIncorrectPronouns(text, characterName, correctPronouns);

    if (incorrectPronouns.length > 0) {
      const correctSet = `${correctPronouns.subject}/${correctPronouns.object}/${correctPronouns.possessive}`;
      errors.push({
        type: 'pronoun_gender_mismatch',
        message: `Character "${characterName}" has incorrect pronouns. Should use ${correctSet} but found: ${incorrectPronouns.join(', ')}`,
        severity: 'critical',
        sceneNumber,
        suggestion: `Use ${correctSet} consistently for ${characterName}`
      });
    }

    return errors;
  }

  private findIncorrectPronouns(text: string, characterName: string, correctPronouns: CharacterState['pronouns']): string[] {
    const incorrect: string[] = [];
    
    // Find sentences mentioning the character
    const sentences = text.split(/[.!?]/).filter(s => s.includes(characterName));
    
    for (const sentence of sentences) {
      // After character name, look for pronouns
      const afterName = sentence.substring(sentence.indexOf(characterName) + characterName.length);
      
      // Check for wrong subject pronouns
      if (correctPronouns.subject !== 'he' && /\bhe\b/i.test(afterName)) {
        incorrect.push('he');
      }
      if (correctPronouns.subject !== 'she' && /\bshe\b/i.test(afterName)) {
        incorrect.push('she');
      }
      
      // Check for wrong object pronouns
      if (correctPronouns.object !== 'him' && /\bhim\b/i.test(afterName)) {
        incorrect.push('him');
      }
      if (correctPronouns.object !== 'her' && /\bher\b/i.test(afterName)) {
        incorrect.push('her');
      }
      
      // Check for wrong possessive
      if (correctPronouns.possessive !== 'his' && /\bhis\b/i.test(afterName)) {
        incorrect.push('his');
      }
    }
    
    return Array.from(new Set(incorrect));
  }

  private checkRoleLocationConsistency(scene: { text: string; number: number }, manifest: Map<string, CharacterState>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [name, charState] of manifest.entries()) {
      if (scene.text.includes(name)) {
        // Check if passenger is in crew quarters
        if (!charState.isCrewMember && scene.text.includes('crew quarters')) {
          errors.push({
            type: 'role_location_mismatch',
            message: `"${name}" is a ${charState.role} (passenger) but appears in crew quarters`,
            severity: 'major',
            sceneNumber: scene.number,
            suggestion: 'Passengers should be in passenger areas (cabins, lounges, dining room)'
          });
        }

        // Check if crew is in passenger-exclusive areas (less strict)
        if (charState.isCrewMember && scene.text.match(/\b(first.class|exclusive|private.passenger)\b/i)) {
          // This is less critical - crew can sometimes be in passenger areas for work
          errors.push({
            type: 'role_location_notice',
            message: `"${name}" is crew but in passenger-exclusive area - ensure this is intentional`,
            severity: 'moderate',
            sceneNumber: scene.number
          });
        }
      }
    }

    return errors;
  }

  private detectNameSwitches(story: Story, manifest: Map<string, CharacterState>): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Look for common detective name variations
    const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
    const foundDetectives = new Set<string>();

    for (const scene of story.scenes) {
      for (const name of detectiveNames) {
        if (scene.text.includes(name)) {
          foundDetectives.add(name);
        }
      }
    }

    if (foundDetectives.size > 1) {
      errors.push({
        type: 'detective_name_inconsistency',
        message: `Detective name switches between: ${Array.from(foundDetectives).join(', ')}. Use ONE consistent name.`,
        severity: 'critical',
        suggestion: 'Choose one detective name and use it throughout the entire story'
      });
    }

    return errors;
  }
}
