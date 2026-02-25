import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  calculateCategoryScore,
  getCriticalFailures,
} from '../scorer-utils.js';

/**
 * Temporal context from Agent 2d
 */
export interface TemporalContextOutput {
  specific_date?: string;
  time_of_day?: string;
  season?: string;
  weather_patterns?: string;
  fashion_and_attire?: string;
  seasonal_activities?: string;
}

/**
 * Scores the Temporal Context phase (Agent 2d)
 * 
 * Validation: Date/time specificity
 * Quality: Temporal detail richness
 * Completeness: All temporal aspects covered
 * Consistency: Season/weather/fashion alignment with era
 */
export class TemporalContextScorer
  implements Scorer<any, TemporalContextOutput>
{
  async score(
    input: any,
    output: TemporalContextOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output));

    // QUALITY TESTS (30% weight)
    tests.push(...this.assessQuality(output));

    // COMPLETENESS TESTS (20% weight)
    tests.push(...this.checkCompleteness(output));

    // CONSISTENCY TESTS (10% weight)
    tests.push(...this.checkConsistency(output, context));

    // Calculate component scores
    const validation_score = calculateCategoryScore(tests, 'validation');
    const quality_score = calculateCategoryScore(tests, 'quality');
    const completeness_score = calculateCategoryScore(tests, 'completeness');
    const consistency_score = calculateCategoryScore(tests, 'consistency');

    // Calculate total
    const total =
      validation_score * 0.4 +
      quality_score * 0.3 +
      completeness_score * 0.2 +
      consistency_score * 0.1;

    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 60;
    
    const component_failures: string[] = [];
    if (validation_score < 60) component_failures.push('validation');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 60) component_failures.push('completeness');
    if (consistency_score < 50) component_failures.push('consistency');

    return {
      agent: 'agent2d-temporal-context',
      validation_score,
      quality_score,
      completeness_score,
      consistency_score,
      total: Math.round(total),
      grade: this.calculateGrade(total),
      passed,
      tests,
      component_failures: component_failures.length > 0 ? component_failures : undefined,
      failure_reason: !passed
        ? this.buildFailureReason(criticalFailures, component_failures)
        : undefined,
    };
  }

  private validateStructure(output: TemporalContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output) {
      tests.push(
        fail(
          'Output exists',
          'validation',
          3.0,
          'Temporal context output is missing',
          'critical'
        )
      );
      return tests;
    }

    // Required fields
    const requiredFields: (keyof TemporalContextOutput)[] = [
      'specific_date',
      'time_of_day',
      'season',
      'weather_patterns',
    ];

    for (const field of requiredFields) {
      if (!exists(output[field])) {
        tests.push(
          fail(
            `${field} present`,
            'validation',
            1.0,
            `Missing required field: ${field}`,
            'major'
          )
        );
      } else {
        tests.push(pass(`${field} present`, 'validation', 0.5));
      }
    }

    // Check date specificity
    if (output.specific_date) {
      const dateSpecificity = this.checkDateSpecificity(output.specific_date);
      tests.push(
        dateSpecificity.score >= 70
          ? pass('Date specificity', 'validation', 1.0, dateSpecificity.reason)
          : partial('Date specificity', 'validation', dateSpecificity.score, 1.0, dateSpecificity.reason)
      );
    }

    // Check time of day specificity
    if (output.time_of_day) {
      const timeSpecificity = this.checkTimeSpecificity(output.time_of_day);
      tests.push(
        timeSpecificity.score >= 70
          ? pass('Time specificity', 'validation', 1.0, timeSpecificity.reason)
          : partial('Time specificity', 'validation', timeSpecificity.score, 1.0, timeSpecificity.reason)
      );
    }

    return tests;
  }

  private checkDateSpecificity(date: string): { score: number; reason: string } {
    // Look for specific patterns
    const hasYear = /\d{4}/.test(date);
    const hasMonth = /(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2})/i.test(date);
    const hasDay = /\d{1,2}(st|nd|rd|th)?/.test(date);

    if (hasYear && hasMonth && hasDay) {
      return { score: 100, reason: 'Full date specified' };
    } else if (hasMonth && hasYear) {
      return { score: 80, reason: 'Month and year specified' };
    } else if (hasMonth) {
      return { score: 60, reason: 'Month specified' };
    } else if (hasYear) {
      return { score: 50, reason: 'Only year specified' };
    }

    return { score: 30, reason: 'Date too vague' };
  }

  private checkTimeSpecificity(time: string): { score: number; reason: string } {
    // Look for specific patterns
    const hasHour = /\d{1,2}:\d{2}/.test(time) || /\d{1,2}\s*(am|pm|o'clock)/i.test(time);
    const hasPeriod = /(morning|afternoon|evening|night|dawn|dusk|noon|midnight)/i.test(time);

    if (hasHour) {
      return { score: 100, reason: 'Specific time given' };
    } else if (hasPeriod) {
      return { score: 70, reason: 'Time period specified' };
    }

    return { score: 40, reason: 'Time too vague' };
  }

  private assessQuality(output: TemporalContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Weather detail richness
    if (output.weather_patterns) {
      const weatherScore = this.scoreWeatherDetail(output.weather_patterns);
      tests.push(
        weatherScore >= 70
          ? pass('Weather detail', 'quality', 1.0, `${weatherScore}% richness`)
          : partial('Weather detail', 'quality', weatherScore, 1.0, `${weatherScore}% richness`)
      );
    }

    // Fashion detail richness
    if (output.fashion_and_attire) {
      const fashionScore = this.scoreFashionDetail(output.fashion_and_attire);
      tests.push(
        fashionScore >= 70
          ? pass('Fashion detail', 'quality', 1.0, `${fashionScore}% richness`)
          : partial('Fashion detail', 'quality', fashionScore, 1.0, `${fashionScore}% richness`)
      );
    }

    // Overall temporal richness (word count)
    const totalWords = [
      output.specific_date,
      output.time_of_day,
      output.season,
      output.weather_patterns,
      output.fashion_and_attire,
      output.seasonal_activities,
    ]
      .filter(exists)
      .join(' ')
      .split(/\s+/).length;

    tests.push(
      totalWords >= 200
        ? pass('Temporal richness', 'quality', 1.0, `${totalWords} words`)
        : partial('Temporal richness', 'quality', Math.min(100, (totalWords / 200) * 100), 1.0, `Only ${totalWords} words`)
    );

    return tests;
  }

  private scoreWeatherDetail(weather: string): number {
    const wordCount = weather.split(/\s+/).length;
    let score = 0;

    // Word count
    if (wordCount >= 80) score += 50;
    else if (wordCount >= 40) score += 30;
    else if (wordCount >= 20) score += 15;

    // Specific weather markers
    const markers = [
      /temperature|degrees|cold|hot|warm|cool/i,
      /rain|snow|fog|mist|drizzle|storm/i,
      /wind|breeze|gust|calm/i,
      /clouds|clear|overcast|sunny/i,
      /humidity|dry|damp|moisture/i,
    ];

    const matchedMarkers = markers.filter(m => m.test(weather)).length;
    score += matchedMarkers * 10;

    return Math.min(100, score);
  }

  private scoreFashionDetail(fashion: string): number {
    const wordCount = fashion.split(/\s+/).length;
    let score = 0;

    // Word count
    if (wordCount >= 80) score += 50;
    else if (wordCount >= 40) score += 30;
    else if (wordCount >= 20) score += 15;

    // Specific fashion markers
    const markers = [
      /hat|cap|bonnet|fedora|cloche/i,
      /dress|suit|gown|coat|jacket/i,
      /shoes|boots|heels|oxfords/i,
      /fabric|silk|wool|cotton|linen/i,
      /color|colour|pattern|style/i,
    ];

    const matchedMarkers = markers.filter(m => m.test(fashion)).length;
    score += matchedMarkers * 10;

    return Math.min(100, score);
  }

  private checkCompleteness(output: TemporalContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Count how many optional fields are filled
    const optionalFields = [
      output.fashion_and_attire,
      output.seasonal_activities,
    ];

    const filledOptional = optionalFields.filter(exists).length;

    tests.push(
      filledOptional >= 2
        ? pass('Optional fields', 'completeness', 1.5, 'All optional fields present')
        : partial('Optional fields', 'completeness', (filledOptional / 2) * 100, 1.5, `${filledOptional}/2 optional fields`)
    );

    // Check that all required fields have substantial content (not just placeholders)
    const substantialFields = [
      output.specific_date,
      output.time_of_day,
      output.season,
      output.weather_patterns,
    ]
      .filter((f): f is string => exists(f))
      .filter(f => f.split(/\s+/).length >= 5).length;

    tests.push(
      substantialFields >= 4
        ? pass('Substantial content', 'completeness', 1.5, 'All fields have detail')
        : partial('Substantial content', 'completeness', (substantialFields / 4) * 100, 1.5, `${substantialFields}/4 fields detailed`)
    );

    return tests;
  }

  private checkConsistency(
    output: TemporalContextOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    // Check season/weather consistency
    if (output.season && output.weather_patterns) {
      const consistent = this.checkSeasonWeatherConsistency(
        output.season,
        output.weather_patterns
      );
      tests.push(
        consistent
          ? pass('Season/weather consistency', 'consistency', 1.0)
          : fail('Season/weather consistency', 'consistency', 1.0, 'Season and weather patterns conflict', 'minor')
      );
    }

    // Check fashion alignment with era
    if (output.fashion_and_attire && context.cml) {
      const era = (context.cml as any)?.BACKGROUND_CONTEXT?.era_background?.decade;
      if (era) {
        const fashionEraConsistent = this.checkFashionEraConsistency(
          output.fashion_and_attire,
          era
        );
        tests.push(
          fashionEraConsistent
            ? pass('Fashion/era consistency', 'consistency', 1.0)
            : fail('Fashion/era consistency', 'consistency', 1.0, 'Fashion markers conflict with era', 'minor')
        );
      }
    }

    // Check date/era consistency
    if (output.specific_date && context.cml) {
      const era = (context.cml as any)?.BACKGROUND_CONTEXT?.era_background?.decade;
      if (era) {
        const dateEraConsistent = this.checkDateEraConsistency(
          output.specific_date,
          era
        );
        tests.push(
          dateEraConsistent
            ? pass('Date/era consistency', 'consistency', 1.0)
            : fail('Date/era consistency', 'consistency', 1.0, 'Date conflicts with era', 'major')
        );
      }
    }

    return tests;
  }

  private checkSeasonWeatherConsistency(season: string, weather: string): boolean {
    const s = season.toLowerCase();
    const w = weather.toLowerCase();

    // Simple heuristics
    if (s.includes('winter') && (w.includes('hot') || w.includes('sweltering'))) {
      return false;
    }
    if (s.includes('summer') && (w.includes('snow') || w.includes('freezing'))) {
      return false;
    }

    return true;
  }

  private checkFashionEraConsistency(fashion: string, era: string): boolean {
    const f = fashion.toLowerCase();

    // Look for anachronisms
    if (era.includes('1920') || era.includes('1930')) {
      const anachronisms = ['sneakers', 'jeans', 't-shirt', 'hoodie', 'tracksuit'];
      if (anachronisms.some(a => f.includes(a))) {
        return false;
      }
    }

    return true;
  }

  private checkDateEraConsistency(date: string, era: string): boolean {
    // Extract year from date
    const yearMatch = date.match(/\b(19\d{2}|20\d{2})\b/);
    if (!yearMatch) return true; // Can't check if no year

    const year = parseInt(yearMatch[1], 10);

    // Extract decade from era
    const decadeMatch = era.match(/\b(19\d{2}|20\d{2})/);
    if (!decadeMatch) return true; // Can't check if no decade

    const decade = parseInt(decadeMatch[1], 10);
    const decadeEnd = decade + 9;

    // Check if year is within decade
    return year >= decade && year <= decadeEnd;
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private buildFailureReason(
    criticalFailures: TestResult[],
    componentFailures: string[]
  ): string {
    const parts: string[] = [];

    if (criticalFailures.length > 0) {
      parts.push(`${criticalFailures.length} critical failure(s)`);
    }

    if (componentFailures.length > 0) {
      parts.push(`Components below minimum: ${componentFailures.join(', ')}`);
    }

    return parts.join('; ') || 'Score below threshold';
  }
}
