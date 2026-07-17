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
  '1860s': {
    decade: '1860s',
    forbiddenTerms: [
      'telephone', 'automobile', 'motor car', 'airplane', 'aircraft', 'radio', 'wireless',
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'gas lamp', 'candle', 'steam train', 'revolver', 'horse', 'carriage', 'post'],
    technologyForbidden: ['telephone', 'automobile', 'airplane', 'radio', 'television', 'computer', 'internet']
  },
  '1870s': {
    decade: '1870s',
    forbiddenTerms: [
      'telephone', 'automobile', 'motor car', 'airplane', 'aircraft', 'radio', 'wireless',
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'gas lamp', 'candle', 'steam train', 'revolver', 'horse', 'carriage', 'post'],
    technologyForbidden: ['telephone', 'automobile', 'airplane', 'radio', 'television', 'computer', 'internet']
  },
  '1880s': {
    decade: '1880s',
    forbiddenTerms: [
      'automobile', 'motor car', 'airplane', 'aircraft', 'radio', 'wireless',
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'telephone', 'gas lamp', 'electric light', 'steam train', 'revolver', 'horse', 'carriage'],
    technologyForbidden: ['automobile', 'airplane', 'radio', 'television', 'computer', 'internet']
  },
  '1890s': {
    decade: '1890s',
    forbiddenTerms: [
      'airplane', 'aircraft', 'radio', 'wireless',
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'telephone', 'electric light', 'steam train', 'bicycle', 'early motor car', 'revolver'],
    technologyForbidden: ['airplane', 'radio', 'television', 'computer', 'internet']
  },
  '1900s': {
    decade: '1900s',
    forbiddenTerms: [
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'smartphone',
      'GPS', 'laptop', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'telephone', 'electric light', 'motor car', 'automobile', 'steam train', 'typewriter', 'gramophone'],
    technologyForbidden: ['television', 'computer', 'internet', 'email', 'cell phone', 'plastic']
  },
  '1910s': {
    decade: '1910s',
    forbiddenTerms: [
      'television', 'computer', 'internet', 'email', 'cell phone', 'mobile', 'smartphone',
      'GPS', 'laptop', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telegraph', 'telephone', 'electric light', 'motor car', 'automobile', 'typewriter', 'gramophone', 'wireless', 'biplane'],
    technologyForbidden: ['television', 'computer', 'internet', 'email', 'cell phone', 'plastic']
  },
  '1920s': {
    decade: '1920s',
    forbiddenTerms: [
      'television', 'tv', 'jet', 'computer', 'internet', 'email',
      'cell phone', 'mobile', 'digital', 'plastic'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telephone', 'telegram', 'radio', 'automobile', 'typewriter', 'phonograph', 'silent film', 'talking picture'],
    technologyForbidden: ['television', 'jet', 'computer', 'internet', 'plastic']
  },
  '1930s': {
    decade: '1930s',
    forbiddenTerms: [
      'computer', 'internet', 'email', 'cell phone', 'mobile phone', 'smartphone',
      'GPS', 'laptop', 'tablet', 'digital camera', 'text message', 'app', 'online',
      'wifi', 'bluetooth', 'DVD', 'CD', 'mp3', 'jet plane', 'jet aircraft'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telephone', 'telegram', 'radio', 'gramophone', 'automobile', 'motor car', 'typewriter', 'film camera', 'talking picture', 'wireless'],
    technologyForbidden: ['computer', 'internet', 'email', 'cell phone', 'GPS', 'digital', 'television']
  },
  '1940s': {
    decade: '1940s',
    forbiddenTerms: [
      'computer', 'internet', 'email', 'cell phone', 'mobile phone', 'smartphone',
      'GPS', 'laptop', 'tablet', 'digital camera', 'text message', 'app', 'online',
      'wifi', 'bluetooth', 'DVD', 'CD', 'mp3'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telephone', 'telegram', 'radio', 'gramophone', 'automobile', 'motor car', 'typewriter', 'film camera', 'radar', 'wireless', 'jeep'],
    technologyForbidden: ['computer', 'internet', 'email', 'cell phone', 'GPS', 'digital']
  },
  '1950s': {
    decade: '1950s',
    forbiddenTerms: [
      'cell phone', 'mobile phone', 'smartphone', 'internet', 'email', 'website',
      'computer', 'laptop', 'tablet', 'GPS', 'digital camera', 'text message',
      'app', 'online', 'wifi', 'bluetooth', 'DVD', 'CD', 'mp3'
    ],
    requiredMarkers: ['formal address', 'period technology', 'fashion detail', 'social norm'],
    technologyAvailable: ['telephone', 'rotary phone', 'telegram', 'radio', 'wireless', 'typewriter', 'film camera', 'phonograph', 'vinyl record'],
    technologyForbidden: ['cell phone', 'internet', 'email', 'computer', 'GPS', 'digital']
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
      if (!pattern.test(scene.text)) continue;
      // A_62 abort class #7 guard — polysemous terms need the ANACHRONISTIC sense's context.
      const guard = EraAuthenticityValidator.POLYSEMOUS_TERM_GUARDS[forbidden.toLowerCase()];
      if (guard && !this.termAppearsInAnachronisticSense(scene.text, pattern, guard)) continue;
      errors.push({
        type: 'anachronism',
        message: `"${forbidden}" did not exist in the ${era.decade}`,
        severity: 'major',
        sceneNumber: scene.number,
        suggestion: `Use period-appropriate technology: ${era.technologyAvailable.slice(0, 3).join(', ')}`
      });
    }

    return errors;
  }

  // ── A_62 abort class #7 (M1v8-2, mystery-1784247524200) ─────────────────────────────────────────
  // "tablet" flagged as an anachronism 8×/8 chapters in a POISON mystery — where every instance was
  // the PILL sense ("a tablet, dissolved slowly, releasing its poison": the murder method itself).
  // Medicine tablets date to the 1880s; stone/writing/soap tablets are centuries older. One
  // polysemous word, repeated per chapter, crossed the majors>5 needs_revision threshold and aborted
  // a run with ZERO criticals — the A_60 mechanical-"spring" shape on a new lexeme, with the same
  // per-chapter amplification. Fixture-driven per the RC-4 rule (the run's own sentence is the test
  // fixture). A polysemous term now needs the ANACHRONISTIC sense's context within ±80 chars: a
  // computing tablet arrives with its context ("glowing screen", "swiped"); a pill never does.
  private static readonly POLYSEMOUS_TERM_GUARDS: Record<string, RegExp> = {
    // computing-device sense only; the pill/stone/writing senses are period-valid
    tablet: /\b(?:screen|device|electronic|digital|touch\w*|swipe\w*|app|apps|glow\w*|charg\w*|battery|pixel\w*)\b/i,
  };

  // ── module-scope helper (kept on the class for cohesion) ────────────────────────────────────────
  private termAppearsInAnachronisticSense(text: string, termPattern: RegExp, guard: RegExp): boolean {
    const global = new RegExp(termPattern.source, "gi");
    let match: RegExpExecArray | null;
    while ((match = global.exec(text))) {
      const lo = Math.max(0, match.index - 80);
      const hi = Math.min(text.length, match.index + match[0].length + 80);
      if (guard.test(text.slice(lo, hi))) return true;
    }
    return false;
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
