/**
 * Chapter-level Validator
 * Quick validation for individual chapters during prose generation
 * Catches major issues early before full pipeline validation
 */

import type { CMLData } from './types.js';

export interface ChapterValidationIssue {
  severity: 'critical' | 'major' | 'moderate';
  message: string;
  suggestion?: string;
}

export interface ChapterValidationResult {
  isValid: boolean;
  issues: ChapterValidationIssue[];
}

export interface ChapterContent {
  title: string;
  paragraphs: string[];
  chapterNumber: number;
}

/**
 * Validates a single chapter against CML requirements
 * Focuses on: clue visibility, character consistency, setting fidelity
 */
export class ChapterValidator {
  /**
   * Validate a chapter during generation
   * Returns issues that should trigger regeneration
   */
  validateChapter(chapter: ChapterContent, cml: CMLData): ChapterValidationResult {
    const issues: ChapterValidationIssue[] = [];
    const cmlCase = (cml as any)?.CASE ?? {};
    const chapterText = chapter.paragraphs.join('\n');

    // 1. Check for character name consistency (ALL CHAPTERS)
    // PHASE 5: Apply to all chapters to prevent bad data in continuity record
    const characterIssues = this.checkCharacterNames(chapter, cmlCase);
    issues.push(...characterIssues);

    // 2. Check for setting drift (ALL CHAPTERS)
    // PHASE 5: Apply to all chapters to prevent bad data in continuity record
    const settingIssues = this.checkSettingFidelity(chapter, cmlCase);
    issues.push(...settingIssues);

    // 3. Check for discriminating test scene (if this is late chapter)
    if (chapter.chapterNumber >= 10) {
      const testIssues = this.checkDiscriminatingTest(chapter, cmlCase);
      issues.push(...testIssues);
    }

    // 4. Check for basic prose quality issues (ALL CHAPTERS)
    const qualityIssues = this.checkProseQuality(chapter);
    issues.push(...qualityIssues);

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const isValid = criticalIssues.length === 0;

    return {
      isValid,
      issues
    };
  }

  private checkCharacterNames(chapter: ChapterContent, cmlCase: any): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const cast = cmlCase.cast || [];
    const chapterText = chapter.paragraphs.join('\n');
    
    // Build list of valid character names
    const validNames = new Set<string>();
    cast.forEach((char: any) => {
      validNames.add(char.name);
      if (char.alias) validNames.add(char.alias);
      if (char.role_in_story) {
        const role = char.role_in_story.toLowerCase();
        if (role.includes('detective') || role.includes('inspector') || role.includes('constable')) {
          // Allow title variations
          const baseName = char.name.split(' ').pop() || char.name;
          validNames.add(baseName);
        }
      }
    });

    // Check for character name inconsistencies
    // Look for patterns like "Mr. Smith was" or "Detective Jones said"
    const namePattern = /(?:Mr\.|Mrs\.|Miss|Dr\.|Detective|Inspector|Constable|Captain)\s+([A-Z][a-z]+)/g;
    const matches = chapterText.matchAll(namePattern);
    
    for (const match of matches) {
      const lastName = match[1];
      let found = false;
      for (const name of validNames) {
        if (name.includes(lastName)) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        issues.push({
          severity: 'critical',
          message: `Character name "${match[0]}" not found in CML cast`,
          suggestion: `Use only these character names: ${Array.from(validNames).join(', ')}`
        });
      }
    }

    return issues;
  }

  private checkSettingFidelity(chapter: ChapterContent, cmlCase: any): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const meta = cmlCase.meta || {};
    const setting = meta.setting || {};
    const locationType = setting.location_type || setting.type || '';
    const chapterText = chapter.paragraphs.join('\n').toLowerCase();

    // Check for location type drift
    const settingPatterns: Record<string, string[]> = {
      'country_estate': ['estate', 'manor', 'countryside', 'grounds', 'drawing room'],
      'london_townhouse': ['london', 'townhouse', 'street', 'square', 'parlour'],
      'ocean_liner': ['ship', 'deck', 'cabin', 'stateroom', 'dining saloon', 'liner'],
      'orient_express': ['train', 'compartment', 'dining car', 'express', 'railway'],
      'hotel': ['hotel', 'lobby', 'suite', 'reception'],
      'scottish_castle': ['castle', 'scotland', 'highland', 'keep', 'battlements'],
      'cotswold_village': ['village', 'cotswold', 'cottage', 'high street'],
    };

    if (locationType && settingPatterns[locationType]) {
      const expectedTerms = settingPatterns[locationType];
      const hasExpectedTerm = expectedTerms.some(term => chapterText.includes(term));

      // Check for wrong setting markers
      const wrongSettings = Object.entries(settingPatterns)
        .filter(([type]) => type !== locationType)
        .flatMap(([_, terms]) => terms);

      const conflictingTerms = wrongSettings.filter(term => chapterText.includes(term));

      if (conflictingTerms.length > 0) {
        // PHASE 5: Stricter early chapter validation to prevent bad continuity data
        const severity = chapter.chapterNumber <= 5 ? 'critical' : 'critical';
        issues.push({
          severity,
          message: `Setting drift detected in chapter ${chapter.chapterNumber}: Found "${conflictingTerms[0]}" but CML specifies "${locationType}"`,
          suggestion: `Keep all scenes within the ${locationType} setting. Use terms like: ${expectedTerms.join(', ')}`
        });
      }

      // PHASE 5: Warn if early chapters lack expected setting markers (weak signal)
      if (chapter.chapterNumber <= 3 && !hasExpectedTerm) {
        issues.push({
          severity: 'moderate',
          message: `Chapter ${chapter.chapterNumber} may lack clear "${locationType}" setting markers`,
          suggestion: `Include at least one setting term: ${expectedTerms.slice(0, 3).join(', ')}`
        });
      }
    }

    return issues;
  }

  private checkDiscriminatingTest(chapter: ChapterContent, cmlCase: any): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const discriminatingTest = cmlCase.discriminating_test || {};
    const testDesign = discriminatingTest.design || '';
    const chapterText = chapter.paragraphs.join('\n');

    if (!testDesign) return issues;

    // Extract key terms from discriminating test design
    const keyTerms = this.extractKeyTerms(testDesign);
    
    // Check if any key terms appear in this chapter
    const foundTerms = keyTerms.filter(term => 
      chapterText.toLowerCase().includes(term.toLowerCase())
    );

    // If this is a late chapter (likely resolution) and no test terms found, flag it
    if (chapter.chapterNumber >= 12 && foundTerms.length === 0) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} may be missing the discriminating test scene`,
        suggestion: `Include a scene that tests: ${testDesign.substring(0, 100)}...`
      });
    }

    return issues;
  }

  private extractKeyTerms(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4)
      .filter(w => !['that', 'this', 'with', 'from', 'were', 'have', 'been', 'they', 'what', 'when', 'where', 'which'].includes(w))
      .slice(0, 5);
    return words;
  }

  private checkProseQuality(chapter: ChapterContent): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];

    // Check paragraph count
    if (chapter.paragraphs.length < 2) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} has only ${chapter.paragraphs.length} paragraph(s)`,
        suggestion: 'Chapters should have at least 2-3 paragraphs for proper pacing'
      });
    }

    // Check for extremely short paragraphs
    const shortParas = chapter.paragraphs.filter(p => p.length < 100);
    if (shortParas.length > chapter.paragraphs.length / 2) {
      issues.push({
        severity: 'moderate',
        message: `Chapter ${chapter.chapterNumber} has too many short paragraphs`,
        suggestion: 'Vary paragraph length for better pacing - mix short and longer paragraphs'
      });
    }

    // Check for repetitive sentence starts
    const firstWords = chapter.paragraphs
      .map(p => p.trim().split(/\s+/)[0])
      .filter(w => w);
    
    const wordCounts = firstWords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const repetitive = Object.entries(wordCounts).filter(([_, count]) => count > 3);
    if (repetitive.length > 0) {
      issues.push({
        severity: 'moderate',
        message: `Chapter ${chapter.chapterNumber} has repetitive sentence starts: "${repetitive[0][0]}" appears ${repetitive[0][1]} times`,
        suggestion: 'Vary sentence structure and opening words for better flow'
      });
    }

    return issues;
  }
}
