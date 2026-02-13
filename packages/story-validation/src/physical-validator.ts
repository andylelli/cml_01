/**
 * Physical Plausibility Validator
 * Priority: HIGH - Ensures evidence is physically realistic
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

interface EvidenceRule {
  type: string;
  viableSurfaces: string[];
  nonViableSurfaces: { surface: string; reason: string; alternative: string }[];
  weatherConstraints: { condition: string; viable: boolean; reason: string }[];
  physicsConstraints: string[];
}

const EVIDENCE_RULES: EvidenceRule[] = [
  {
    type: 'footprints',
    viableSurfaces: ['carpet', 'soft earth', 'dust', 'snow', 'mud', 'sand'],
    nonViableSurfaces: [
      {
        surface: 'wooden deck',
        reason: 'Treated wood is non-porous, footprints do not form',
        alternative: 'Use: muddy residue trail, wet footprints on interior carpet, blood traces'
      },
      {
        surface: 'tile',
        reason: 'Hard surface does not retain impressions',
        alternative: 'Use: wet footprint marks (temporary), scuff marks'
      },
      {
        surface: 'metal',
        reason: 'No impression possible on hard metal',
        alternative: 'Use: scratches, dents, or transfer evidence'
      }
    ],
    weatherConstraints: [
      {
        condition: 'rain',
        viable: false,
        reason: 'Rain washes away outdoor footprints within seconds'
      },
      {
        condition: 'storm',
        viable: false,
        reason: 'Storm conditions destroy all trace evidence outdoors'
      },
      {
        condition: 'wind',
        viable: false,
        reason: 'Wind disperses dust and light surface impressions'
      }
    ],
    physicsConstraints: [
      'Surface must accept and retain impressions',
      'Must be protected from weather elements',
      'Requires sufficient pressure and soft/porous surface'
    ]
  },
  {
    type: 'embedded metal',
    viableSurfaces: ['soft wood', 'drywall', 'cork', 'soft earth'],
    nonViableSurfaces: [
      {
        surface: 'hardwood deck',
        reason: 'Hardwood is too dense for metal to embed without massive force',
        alternative: 'Use: object lying on surface, scratched into wood, caught in rope/rigging'
      },
      {
        surface: 'steel',
        reason: 'Metal cannot embed in harder metal',
        alternative: 'Use: welded, bolted, or magnetized attachment'
      }
    ],
    weatherConstraints: [],
    physicsConstraints: [
      'Requires high velocity impact (bullet) OR industrial force',
      'Receiving material must be significantly softer than embedded object',
      'Human strength alone is insufficient to embed metal in hardwood'
    ]
  }
];

export class PhysicalPlausibilityValidator implements Validator {
  name = 'PhysicalPlausibilityValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    for (const scene of story.scenes) {
      // Check for footprint plausibility
      if (scene.text.match(/footprint/i)) {
        const footprintErrors = this.validateFootprints(scene);
        errors.push(...footprintErrors);
      }

      // Check for embedded objects
      if (scene.text.match(/embedded|buried in|stuck in/i)) {
        const embeddedErrors = this.validateEmbeddedObjects(scene);
        errors.push(...embeddedErrors);
      }

      // Check for weather-evidence contradictions
      if (scene.text.match(/storm|rain|wind/i)) {
        const weatherErrors = this.validateWeatherEvidence(scene);
        errors.push(...weatherErrors);
      }

      // Check for struggle evidence plausibility
      if (scene.text.match(/struggle|fight|confrontation/i)) {
        const struggleErrors = this.validateStruggleEvidence(scene);
        errors.push(...struggleErrors);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private validateFootprints(scene: { text: string; number: number }): ValidationError[] {
    const errors: ValidationError[] = [];
    const rule = EVIDENCE_RULES.find(r => r.type === 'footprints')!;

    // Check for footprints on non-viable surfaces
    for (const { surface, reason, alternative } of rule.nonViableSurfaces) {
      if (scene.text.toLowerCase().includes(surface) && scene.text.match(/footprint/i)) {
        errors.push({
          type: 'implausible_footprints',
          message: `Footprints on ${surface} are physically implausible. ${reason}`,
          severity: 'major',
          sceneNumber: scene.number,
          suggestion: alternative
        });
      }
    }

    // Check for footprints in adverse weather
    const hasStorm = scene.text.match(/storm|heavy rain|downpour/i);
    const hasRain = scene.text.match(/rain|wet|water/i);
    const hasWind = scene.text.match(/wind|gust|breeze/i);
    const isOutdoor = scene.text.match(/deck|outside|exterior|outdoor/i);

    if (isOutdoor && (hasStorm || (hasRain && hasWind))) {
      errors.push({
        type: 'weather_destroys_evidence',
        message: 'Footprints cannot survive outdoor in storm/rain conditions',
        severity: 'major',
        sceneNumber: scene.number,
        suggestion: 'Use weather-resistant evidence: secured objects, structural damage, or move evidence to protected interior location'
      });
    }

    return errors;
  }

  private validateEmbeddedObjects(scene: { text: string; number: number }): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for metal embedded in hardwood
    if (scene.text.match(/metal|insignia|badge/i) && 
        scene.text.match(/embedded|buried|stuck/i) && 
        scene.text.match(/wood|deck|plank/i)) {
      errors.push({
        type: 'implausible_embedded_object',
        message: 'Metal object cannot become embedded in hardwood deck without massive force (bullet velocity or industrial press)',
        severity: 'major',
        sceneNumber: scene.number,
        suggestion: 'Use instead: object lying on surface, caught in rope/rigging, scratched into wood, or wedged in crack'
      });
    }

    return errors;
  }

  private validateWeatherEvidence(scene: { text: string; number: number }): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for trace evidence during storm
    const hasStorm = scene.text.match(/storm|tempest|gale/i);
    const hasTraceEvidence = scene.text.match(/dust|paper|footprint|fiber/i);
    const isOutdoor = scene.text.match(/deck|outside|exterior/i);

    if (hasStorm && hasTraceEvidence && isOutdoor) {
      errors.push({
        type: 'weather_incompatible_evidence',
        message: 'Light trace evidence (dust, papers, footprints) cannot survive outdoor storm conditions',
        severity: 'major',
        sceneNumber: scene.number,
        suggestion: 'Use storm-resistant evidence: structural damage, secured heavy objects, or move to interior location'
      });
    }

    return errors;
  }

  private validateStruggleEvidence(scene: { text: string; number: number }): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for implausible struggle damage
    const implausibleDamage = [
      { pattern: /shattered.*steel|broken.*iron/i, message: 'Human struggle cannot shatter steel or iron' },
      { pattern: /embedded.*metal.*wood/i, message: 'Struggle cannot embed metal in hardwood' },
      { pattern: /cracked.*stone|fractured.*marble/i, message: 'Human struggle unlikely to crack stone/marble' }
    ];

    for (const { pattern, message } of implausibleDamage) {
      if (pattern.test(scene.text)) {
        errors.push({
          type: 'implausible_struggle_damage',
          message,
          severity: 'moderate',
          sceneNumber: scene.number,
          suggestion: 'Use plausible struggle evidence: overturned furniture, torn fabric, broken glass/china, scattered papers, defensive wounds'
        });
      }
    }

    return errors;
  }
}
