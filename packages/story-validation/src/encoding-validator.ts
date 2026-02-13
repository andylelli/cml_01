/**
 * Encoding Validator - Fix UTF-8 encoding artifacts
 * Priority: HIGH - Immediate readability issue
 */

import type { Validator, Story, ValidationResult, ValidationError } from './types.js';

const ENCODING_ARTIFACTS: Array<[RegExp, string]> = [
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€œ|â€\x9d/g, '"'],
  [/â€"|â€”/g, '—'],
  [/â€“/g, '–'],
  [/â€¦/g, '…'],
  [/faˆ§ade/g, 'façade'],
  [/Â/g, ''],
  [/\uFFFD/g, ''],
];

const ENCODING_PATTERN = /(?:â€™|â€˜|â€œ|â€\x9d|â€"|â€”|â€“|â€¦|Â|ˆ§|\uFFFD)/g;

export class EncodingValidator implements Validator {
  name = 'EncodingValidator';

  validate(story: Story): ValidationResult {
    const errors: ValidationError[] = [];

    for (const scene of story.scenes) {
      const artifacts = this.findEncodingArtifacts(scene.text);
      
      if (artifacts.length > 0) {
        errors.push({
          type: 'encoding_artifact',
          message: `Found ${artifacts.length} encoding artifacts in scene ${scene.number}`,
          severity: 'major',
          sceneNumber: scene.number,
          suggestion: 'Auto-fix available: convert to proper UTF-8 characters'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private findEncodingArtifacts(text: string): string[] {
    const matches = text.match(ENCODING_PATTERN);
    return matches ? Array.from(new Set(matches)) : [];
  }

  /**
   * Auto-fix encoding issues in text
   */
  fixEncoding(text: string): string {
    let fixed = text.normalize('NFC');

    for (const [pattern, replacement] of ENCODING_ARTIFACTS) {
      fixed = fixed.replace(pattern, replacement);
    }
    
    return fixed
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+$/gm, '');
  }

  /**
   * Auto-fix all scenes in a story
   */
  fixStory(story: Story): Story {
    return {
      ...story,
      scenes: story.scenes.map(scene => ({
        ...scene,
        text: this.fixEncoding(scene.text),
        paragraphs: scene.paragraphs?.map(p => this.fixEncoding(p))
      }))
    };
  }
}
