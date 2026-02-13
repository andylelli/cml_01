/**
 * Era Authenticity Validator
 * Priority: MODERATE - Ensures period-appropriate details
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

interface EraContext {
  decade: string;
  forbiddenTerms: string[];
  requiredMarkers: string[];
  technologyAvailable: string[];
  technologyForbidden: string[];
}

const ERA_CONTEXTS: Record<string, EraContext> = {
  '1950s': {
    decade: '1950s',
    forbiddenTerms: [
      'cell phone', 'mobile phone', 'smartphone', 'internet', 'email', 'website',
      'computer', 'laptop', 'tablet', 'GPS', 'digital camera', 'text message',
      'app', 'online', 'wifi', 'bluetooth', 'DVD', 'CD', 'mp3'
    ],
    requiredMarkers: [
      'formal address', 'period technology', 'fashion detail', 'social norm'
    ],
    technologyAvailable: [
      'telephone', 'rotary phone', 'telegram', 'radio', 'wireless',
      'typewriter', 'film camera', 'phonograph', 'vinyl record'
    ],
    technologyForbidden: [
      'cell phone', 'internet', 'email', 'computer', 'GPS', 'digital'
    ]
  },
  '1920s': {
    decade: '1920s',
    forbiddenTerms: [
      'television', 'tv', 'jet', 'computer', 'internet', 'email',
      'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: [
      'formal address', 'period technology', 'fashion detail', 'social norm'
    ],
    technologyAvailable: [
      'telephone', 'telegram', 'radio', 'automobile', 'typewriter',
      'phonograph', 'silent film', 'talking picture'
    ],
    technologyForbidden: [
      'television', 'jet', 'computer', 'internet', 'plastic'
    ]
  }
};

export class EraAuthenticityValidator implements Validator {
  name = 'EraAuthenticityValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    if (!cml?.CASE.meta.era?.decade) {
      return { valid: true, errors: [] };
    }

    const decade = cml.CASE.meta.era.decade;
    const eraContext = ERA_CONTEXTS[decade];

    if (!eraContext) {
      // Unknown era, skip validation
      return { valid: true, errors: [] };
    }

    for (const scene of story.scenes) {
      // Check for anachronisms
      const anachronismErrors = this.checkAnachronisms(scene, eraContext);
      errors.push(...anachronismErrors);

      // Check for period markers
      const markerErrors = this.checkPeriodMarkers(scene, eraContext);
      errors.push(...markerErrors);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private checkAnachronisms(scene: { text: string; number: number }, era: EraContext): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const forbidden of era.forbiddenTerms) {
      const pattern = new RegExp(`\\b${forbidden.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (pattern.test(scene.text)) {
        errors.push({
          type: 'anachronism',
          message: `"${forbidden}" did not exist in the ${era.decade}`,
          severity: 'major',
          sceneNumber: scene.number,
          suggestion: `Use period-appropriate technology: ${era.technologyAvailable.slice(0, 3).join(', ')}`
        });
      }
    }

    return errors;
  }

  private checkPeriodMarkers(scene: { text: string; number: number }, era: EraContext): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if scene has at least some period-appropriate details
    const hasFormalAddress = /\b(Mr\.|Mrs\.|Miss|Detective|Captain|Colonel|Doctor|Lady|Sir)\s+[A-Z]/i.test(scene.text);
    const hasPeriodTech = era.technologyAvailable.some(tech => 
      new RegExp(`\\b${tech}\\b`, 'i').test(scene.text)
    );
    const hasFashionDetail = /\b(hat|gloves|suit|dress|tie|fedora|stockings)\b/i.test(scene.text);
    
    const markerCount = [hasFormalAddress, hasPeriodTech, hasFashionDetail].filter(Boolean).length;

    if (markerCount === 0 && scene.text.length > 500) {
      // Long scene with no period markers
      errors.push({
        type: 'missing_period_markers',
        message: `Scene lacks ${era.decade} period details - feels generic/timeless`,
        severity: 'moderate',
        sceneNumber: scene.number,
        suggestion: 'Add: formal titles (Mr./Mrs.), period technology (telephone, telegram), or fashion details (gloves, hat, formal dress)'
      });
    }

    return errors;
  }
}
