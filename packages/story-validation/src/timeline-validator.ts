/**
 * Timeline Validator
 * Extracts clock-time and named-time references from prose and detects
 * within-chapter chronological contradictions (time going backwards).
 */

import type { Story, ValidationError } from './types.js';

const CLOCK_TIME_PATTERN = /\b(\d{1,2})[:.]\s?(\d{2})\s*(a\.?m\.?|p\.?m\.?|AM|PM|o[''\u2019]?clock)?\b/gi;
const NAMED_TIME_PATTERN = /\b(midnight|noon|half\s+past\s+\w+|quarter\s+to\s+\w+|quarter\s+past\s+\w+|dawn|dusk|daybreak|sunrise|sunset)\b/gi;

export interface TimeReference {
  raw: string;
  normalizedMinutes: number; // minutes from midnight
  chapter: number;
}

/**
 * Extract all time references (clock times + named times) from a story's prose.
 */
export function extractTimeReferences(story: Story): TimeReference[] {
  const refs: TimeReference[] = [];

  for (const scene of story.scenes) {
    const text = scene.text ?? '';

    // Clock times (e.g. "9:30 PM", "3.15 a.m.", "7:00 o'clock")
    const clockRe = new RegExp(CLOCK_TIME_PATTERN.source, CLOCK_TIME_PATTERN.flags);
    let match: RegExpExecArray | null;
    while ((match = clockRe.exec(text)) !== null) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      if (hours > 23 || minutes > 59) continue; // skip invalid times
      const meridiem = (match[3] ?? '').toLowerCase().replace(/\./g, '').replace(/['\u2019]/g, '');
      if (meridiem.startsWith('p') && hours < 12) hours += 12;
      if (meridiem.startsWith('a') && hours === 12) hours = 0;
      refs.push({
        raw: match[0],
        normalizedMinutes: hours * 60 + minutes,
        chapter: scene.number,
      });
    }

    // Named times (midnight, noon, dawn, dusk, etc.)
    const namedRe = new RegExp(NAMED_TIME_PATTERN.source, NAMED_TIME_PATTERN.flags);
    while ((match = namedRe.exec(text)) !== null) {
      const name = match[0].toLowerCase();
      let mins = -1;
      if (name === 'midnight') mins = 0;
      else if (name === 'noon') mins = 720;
      else if (name === 'dawn' || name === 'daybreak' || name === 'sunrise') mins = 360;
      else if (name === 'dusk' || name === 'sunset') mins = 1080;
      if (mins >= 0) {
        refs.push({ raw: match[0], normalizedMinutes: mins, chapter: scene.number });
      }
    }
  }

  return refs;
}

/**
 * Validate within-chapter time ordering.
 * Flags cases where time goes backwards by more than 60 minutes
 * within the same chapter (allowing for midnight-crossing).
 */
export function validateTimeline(story: Story): ValidationError[] {
  const errors: ValidationError[] = [];
  const refs = extractTimeReferences(story);
  if (refs.length < 2) return errors;

  // Group by chapter
  const byChapter = new Map<number, TimeReference[]>();
  for (const ref of refs) {
    if (!byChapter.has(ref.chapter)) byChapter.set(ref.chapter, []);
    byChapter.get(ref.chapter)!.push(ref);
  }

  for (const [chapter, chapterRefs] of byChapter) {
    if (chapterRefs.length < 2) continue;
    for (let i = 1; i < chapterRefs.length; i++) {
      const prev = chapterRefs[i - 1];
      const curr = chapterRefs[i];
      // Flag if time goes backwards by more than 60 min
      // but less than 720 min (to allow midnight crossing / flashback tolerance)
      const diff = curr.normalizedMinutes - prev.normalizedMinutes;
      if (diff < -60 && diff > -720) {
        errors.push({
          type: 'timeline_contradiction',
          message: `Chapter ${chapter}: Time goes backwards from "${prev.raw}" to "${curr.raw}"`,
          severity: 'major',
          sceneNumber: chapter,
        });
      }
    }
  }

  return errors;
}
