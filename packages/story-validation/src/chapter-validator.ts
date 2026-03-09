/**
 * Chapter-level Validator
 * Quick validation for individual chapters during prose generation
 * Catches major issues early before full pipeline validation
 */

import type { CMLData } from './types.js';
import { findUnknownTitledNameMentions } from './name-sanitizer.js';

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
  /** Total chapters in this story (used to scale late-chapter thresholds). */
  totalChapters?: number;
  /** Canonical month for timeline lock (from temporal context). */
  temporalMonth?: string;
  /** Canonical season derived from temporal month. */
  temporalSeason?: 'spring' | 'summer' | 'autumn' | 'winter';
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
    const cmlCase = cml.CASE;
    const chapterText = chapter.paragraphs.join('\n');

    // 1. Check for character name consistency (ALL CHAPTERS)
    // PHASE 5: Apply to all chapters to prevent bad data in continuity record
    const characterIssues = this.checkCharacterNames(chapter, cmlCase);
    issues.push(...characterIssues);

    // 2. Check for setting drift (ALL CHAPTERS)
    // PHASE 5: Apply to all chapters to prevent bad data in continuity record
    const settingIssues = this.checkSettingFidelity(chapter, cmlCase);
    issues.push(...settingIssues);

    // 3. Check for discriminating test scene (if this is a late chapter).
    // Thresholds are relative to totalChapters so they scale for short/medium/long stories.
    // Fallback to 20 (minimum story size) when totalChapters is not provided.
    const total = chapter.totalChapters ?? 20;
    if (chapter.chapterNumber >= Math.ceil(total * 0.70)) {
      const testIssues = this.checkDiscriminatingTest(chapter, cmlCase, total);
      issues.push(...testIssues);
    }

    // 4. Check for basic prose quality issues (ALL CHAPTERS)
    const qualityIssues = this.checkProseQuality(chapter);
    issues.push(...qualityIssues);

    // 5. Check scene grounding (ALL CHAPTERS)
    const groundingIssues = this.checkSceneGrounding(chapter, cmlCase);
    issues.push(...groundingIssues);

    // 6. Check encoding integrity (ALL CHAPTERS)
    const encodingIssues = this.checkEncodingIntegrity(chapter);
    issues.push(...encodingIssues);

    // 7. Check temporal consistency (ALL CHAPTERS)
    const temporalIssues = this.checkTemporalConsistency(chapter);
    issues.push(...temporalIssues);

    // 8. Check for template/scaffold leakage (ALL CHAPTERS)
    const leakageIssues = this.checkTemplateLeakage(chapter);
    issues.push(...leakageIssues);

    // 9. Check victim identity in chapter 1 (discovery chapter)
    if (chapter.chapterNumber === 1) {
      const victimIssues = this.checkVictimNaming(chapter, cmlCase);
      issues.push(...victimIssues);
    }

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

    // Check for character name inconsistencies (shared regex + matching logic)
    const unknownMentions = findUnknownTitledNameMentions(chapterText, Array.from(validNames));
    for (const mention of unknownMentions) {
      issues.push({
        severity: 'critical',
        message: `Character name "${mention}" not found in CML cast`,
        suggestion: `Use only these character names: ${Array.from(validNames).join(', ')}`
      });
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

  private checkDiscriminatingTest(chapter: ChapterContent, cmlCase: any, totalChapters: number): ChapterValidationIssue[] {
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

    // Only report missing if we're in the final 15% of the story (so for 20 chapters: ch 17+).
    // This prevents false positives in mid-story chapters that precede the denouement.
    if (chapter.chapterNumber >= Math.ceil(totalChapters * 0.85) && foundTerms.length === 0) {
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
    const paragraphLengths = chapter.paragraphs.map((p) => p.length);
    const maxParagraphLength = paragraphLengths.length > 0 ? Math.max(...paragraphLengths) : 0;
    const minParagraphLength = paragraphLengths.length > 0 ? Math.min(...paragraphLengths) : 0;

    // Check paragraph count
    if (chapter.paragraphs.length < 3) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} has only ${chapter.paragraphs.length} paragraph(s)`,
        suggestion: 'Chapters should have at least 3+ meaningful paragraphs for readability and pacing'
      });
    }

    // Detect dense wall-of-text paragraphs
    if (maxParagraphLength > 2400) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} contains an overlong paragraph block (${maxParagraphLength} chars)` ,
        suggestion: 'Split dense paragraph blocks into smaller logical paragraphs with clear breaks'
      });
    }

    // Detect extreme paragraph imbalance (tiny + huge blocks)
    if (maxParagraphLength > 0 && minParagraphLength > 0 && maxParagraphLength / minParagraphLength > 10) {
      issues.push({
        severity: 'moderate',
        message: `Chapter ${chapter.chapterNumber} has extreme paragraph length imbalance`,
        suggestion: 'Balance paragraph sizes to improve rhythm and readability'
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

  private checkSceneGrounding(chapter: ChapterContent, cmlCase: any): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const text = chapter.paragraphs.join('\n').toLowerCase();

    const setting = cmlCase.meta?.setting || {};
    const locationType = (setting.location_type || setting.type || '').toLowerCase();
    const locationName = (setting.location || '').toLowerCase();

    const settingPatterns: Record<string, string[]> = {
      'country_estate': ['estate', 'manor', 'grounds', 'drawing room', 'study', 'library'],
      'london_townhouse': ['london', 'townhouse', 'square', 'parlour', 'street'],
      'ocean_liner': ['ship', 'deck', 'cabin', 'stateroom', 'saloon', 'gangway'],
      'orient_express': ['train', 'compartment', 'railway', 'dining car', 'corridor'],
      'hotel': ['hotel', 'lobby', 'suite', 'reception', 'hallway'],
      'scottish_castle': ['castle', 'highland', 'keep', 'battlements', 'great hall'],
      'cotswold_village': ['village', 'cottage', 'lane', 'high street', 'green'],
    };

    const fallbackAnchors = ['room', 'hall', 'corridor', 'garden', 'window', 'door', 'fireplace'];
    const expectedAnchors = [
      ...(settingPatterns[locationType] || []),
      ...(locationName ? [locationName] : []),
      ...fallbackAnchors,
    ];

    const hasLocationAnchor = expectedAnchors.some((term) => text.includes(term));
    const sensoryMarkers = [
      'smell', 'scent', 'odor', 'fragrance',
      'sound', 'echo', 'silence', 'whisper', 'creak',
      'cold', 'warm', 'damp', 'rough', 'smooth',
      'glow', 'shadow', 'flicker', 'dim',
    ].filter((term) => text.includes(term)).length;
    const atmosphereMarkers = [
      'rain', 'wind', 'fog', 'storm', 'mist', 'thunder',
      'evening', 'morning', 'night', 'dawn', 'dusk', 'season',
    ].filter((term) => text.includes(term)).length;

    if (!hasLocationAnchor) {
      issues.push({
        severity: chapter.chapterNumber <= 3 ? 'major' : 'moderate',
        message: `Chapter ${chapter.chapterNumber} lacks clear scene location anchoring`,
        suggestion: 'Anchor scene opening to a specific location from setting/location profiles'
      });
    }

    if (sensoryMarkers < 2) {
      issues.push({
        severity: chapter.chapterNumber <= 3 ? 'major' : 'moderate',
        message: `Chapter ${chapter.chapterNumber} has weak sensory grounding (${sensoryMarkers} sensory markers found)`,
        suggestion: 'Include at least two sensory cues (sound/smell/tactile/visual atmosphere) tied to the location'
      });
    }

    if (atmosphereMarkers < 1) {
      issues.push({
        severity: 'moderate',
        message: `Chapter ${chapter.chapterNumber} has weak atmosphere/time grounding`,
        suggestion: 'Include at least one weather/time/atmosphere marker to set the scene'
      });
    }

    return issues;
  }

  private checkEncodingIntegrity(chapter: ChapterContent): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const text = chapter.paragraphs.join('\n');
    const mojibakePattern = /(?:Ã¢â‚¬â„¢|Ã¢â‚¬Ëœ|Ã¢â‚¬Å“|Ã¢â‚¬\x9d|Ã¢â‚¬"|Ã¢â‚¬â€|Ã¢â‚¬â€œ|Ã¢â‚¬Â¦|Ã‚|Ë†Â§|â€™|â€˜|â€œ|â€\x9d|â€"|â€¦|Â|\uFFFD)/;
    const illegalControlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

    if (mojibakePattern.test(text)) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} contains mojibake/encoding artifacts`,
        suggestion: 'Normalize to UTF-8 and replace garbled punctuation before persisting chapter text'
      });
    }

    if (illegalControlPattern.test(text)) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} contains illegal control characters`,
        suggestion: 'Remove illegal control characters while preserving valid Unicode content'
      });
    }

    return issues;
  }

  private checkTemporalConsistency(chapter: ChapterContent): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const text = chapter.paragraphs.join(' ').toLowerCase();

    const monthToSeason: Record<string, 'spring' | 'summer' | 'autumn' | 'winter'> = {
      january: 'winter',
      february: 'winter',
      march: 'spring',
      april: 'spring',
      may: 'spring',
      june: 'summer',
      july: 'summer',
      august: 'summer',
      september: 'autumn',
      october: 'autumn',
      november: 'autumn',
      december: 'winter',
    };

    const seasonTerms: Record<'spring' | 'summer' | 'autumn' | 'winter', RegExp> = {
      spring: /\b(spring|vernal)\b/i,
      summer: /\b(summer|midsummer)\b/i,
      autumn: /\b(autumn|fall)\b/i,
      winter: /\b(winter|wintry)\b/i,
    };

    const temporalMonth = chapter.temporalMonth?.toLowerCase();
    const expectedFromTemporalMonth = temporalMonth ? monthToSeason[temporalMonth] : undefined;
    const mentionedMonths = Object.keys(monthToSeason).filter((month) => new RegExp(`\\b${month}\\b`, 'i').test(text));
    const expectedSeasons = new Set<'spring' | 'summer' | 'autumn' | 'winter'>(
      mentionedMonths.map((month) => monthToSeason[month]).filter(Boolean),
    );
    if (expectedFromTemporalMonth) {
      expectedSeasons.add(expectedFromTemporalMonth);
    }
    if (expectedSeasons.size === 0) return issues;

    const conflicting: string[] = [];

    (Object.keys(seasonTerms) as Array<keyof typeof seasonTerms>).forEach((season) => {
      if (seasonTerms[season].test(text) && !expectedSeasons.has(season)) {
        conflicting.push(season);
      }
    });

    if (conflicting.length > 0) {
      const monthAnchor = mentionedMonths[0] ?? temporalMonth ?? 'timeline month';
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} has month/season contradiction (${monthAnchor} vs ${conflicting.join(', ')})`,
        suggestion: `Align season wording with month references (${(mentionedMonths.length > 0 ? mentionedMonths : [temporalMonth]).filter(Boolean).join(', ')}) to maintain temporal consistency`
      });
    }

    return issues;
  }

  /**
   * Checks that the murder victim is introduced by name in the discovery chapter.
   * Only runs for chapter 1. Flags as major if victim is anonymised ("unknown victim", etc.).
   */
  private checkVictimNaming(chapter: ChapterContent, cmlCase: any): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    if (chapter.chapterNumber !== 1) return issues;

    // Extract victim's full name from cast via roleArchetype (camelCase) or role_archetype (snake_case)
    const cast: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
    const victimChar = cast.find((c: any) => {
      const archetype: string = c.roleArchetype ?? c.role_archetype ?? '';
      return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    });
    const victimName: string = victimChar?.name ?? '';

    const chapterText = chapter.paragraphs.join(' ');

    // Check for anonymous victim language patterns
    const anonymousVictimPattern = /\b(an?\s+unknown\s+(victim|body|person|man|woman)|body\s+of\s+an?\s+(unknown|unidentified)|unidentified\s+(victim|body|person))\b/i;
    const hasAnonymousVictim = anonymousVictimPattern.test(chapterText);

    if (victimName) {
      // If we know who the victim is, ensure they are named in chapter 1
      const nameInText = chapterText.toLowerCase().includes(victimName.toLowerCase())
        || victimName.split(' ').some(part => part.length > 3 && chapterText.toLowerCase().includes(part.toLowerCase()));
      if (!nameInText) {
        issues.push({
          severity: 'major',
          message: `Chapter 1 (discovery chapter) does not name the victim "${victimName}". The reader must know who died.`,
          suggestion: `Introduce ${victimName} by full name in the discovery chapter so the victim feels like a real person whose death matters.`
        });
      }
    }

    if (hasAnonymousVictim) {
      issues.push({
        severity: 'major',
        message: 'Chapter 1 presents an anonymous victim ("body of an unknown person"). The murder victim must have a name and identity established for the reader.',
        suggestion: 'Replace anonymous victim language with the victim\'s proper name and a brief characterisation so the reader mourns a real person.'
      });
    }

    return issues;
  }

  private checkTemplateLeakage(chapter: ChapterContent): ChapterValidationIssue[] {
    const issues: ChapterValidationIssue[] = [];
    const joined = chapter.paragraphs.join('\n\n');

    const leakedScaffoldPattern = /At\s+The\s+[A-Z][^\n]{0,120}the\s+smell\s+of\s+[\s\S]{30,240}?atmosphere\s+ripe\s+for\s+revelation\.?/gi;
    const scaffoldMatches = joined.match(leakedScaffoldPattern) || [];

    if (scaffoldMatches.length > 0) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} appears to contain templated scaffold prose`,
        suggestion: 'Replace scaffold-like location boilerplate with chapter-specific prose grounded in profile details'
      });
    }

    const normalizedParagraphs = chapter.paragraphs
      .map((p) => p.toLowerCase().replace(/\s+/g, ' ').trim())
      .filter((p) => p.length >= 180);
    const dupSet = new Set<string>();
    const seen = new Set<string>();
    normalizedParagraphs.forEach((p) => {
      if (seen.has(p)) dupSet.add(p);
      seen.add(p);
    });

    if (dupSet.size > 0) {
      issues.push({
        severity: 'major',
        message: `Chapter ${chapter.chapterNumber} has repeated long boilerplate paragraph blocks`,
        suggestion: 'Paraphrase repeated long blocks and vary chapter opening language'
      });
    }

    return issues;
  }
}
