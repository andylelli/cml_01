/**
 * Timeline Validator
 * Extracts clock-time and named-time references from prose and detects
 * within-chapter chronological contradictions (time going backwards).
 */

import type { Story, ValidationError } from './types.js';

const CLOCK_TIME_PATTERN = /\b(\d{1,2})[:.]\s?(\d{2})\s*(a\.?m\.?|p\.?m\.?|AM|PM|o[''\u2019]?clock)?\b/gi;
const NAMED_TIME_PATTERN = /\b(midnight|noon|half\s+past\s+\w+|quarter\s+to\s+\w+|quarter\s+past\s+\w+|dawn|dusk|daybreak|sunrise|sunset)\b/gi;
// A_53 P5 (timeline-validator-no-day-tracking): cues that advance the calendar day, so a backward
// clock time after one (9 p.m. \u2192 2 p.m. "the next afternoon") is not a contradiction.
const DAY_ADVANCE_PATTERN =
  /\b(?:the\s+)?(?:next|following)\s+(?:day|morning|afternoon|evening|night)\b|\b(?:a\s+day\s+later|the\s+day\s+after|the\s+day\s+after\s+that|tomorrow|overnight|by\s+(?:the\s+next\s+)?morning|twenty[- ]four\s+hours\s+later)\b/gi;

export interface TimeReference {
  raw: string;
  normalizedMinutes: number; // minutes from midnight
  chapter: number;
  dayIndex: number; // 0-based day within the scene, incremented by each day-advance cue before it
}

/**
 * Extract all time references (clock times + named times) from a story's prose.
 */
export function extractTimeReferences(story: Story): TimeReference[] {
  const refs: TimeReference[] = [];

  for (const scene of story.scenes) {
    const text = scene.text ?? '';
    const sceneRefs: Array<{ raw: string; normalizedMinutes: number; index: number }> = [];

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
      sceneRefs.push({ raw: match[0], normalizedMinutes: hours * 60 + minutes, index: match.index });
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
        sceneRefs.push({ raw: match[0], normalizedMinutes: mins, index: match.index });
      }
    }

    // A_53 P5 (timeline-validator-no-day-tracking): order refs by text position (so clock + named
    // times interleave correctly) and stamp each with the day it falls on \u2014 the count of day-advance
    // cues that appear before it in the scene.
    const dayCuePositions: number[] = [];
    const dayRe = new RegExp(DAY_ADVANCE_PATTERN.source, DAY_ADVANCE_PATTERN.flags);
    while ((match = dayRe.exec(text)) !== null) dayCuePositions.push(match.index);

    sceneRefs.sort((a, b) => a.index - b.index);
    for (const ref of sceneRefs) {
      refs.push({
        raw: ref.raw,
        normalizedMinutes: ref.normalizedMinutes,
        chapter: scene.number,
        dayIndex: dayCuePositions.filter((p) => p < ref.index).length,
      });
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
      // A_53 P5: only a SAME-DAY backward jump is a contradiction — a backward clock time after a
      // day-advance cue (9 p.m. → 2 p.m. the next afternoon) is legitimate.
      if (curr.dayIndex === prev.dayIndex && diff < -60 && diff > -720) {
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
