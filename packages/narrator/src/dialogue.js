/* ------------------------------------------------------------------ *
 * Dialogue attribution.
 *
 * A single TTS voice reading eight suspects in a drawing room is the biggest
 * thing separating this from an audiobook. This module finds who is speaking
 * so each character can be given a different voice.
 *
 * It reads the prose only - no pipeline artifacts - so it works on a pasted
 * story as well as on a generated one.
 * ------------------------------------------------------------------ */

const SPEECH_VERBS =
  'said|says|asked|asks|replied|replies|answered|answers|murmured|muttered|whispered|' +
  'cried|exclaimed|observed|remarked|continued|added|began|declared|insisted|protested|' +
  'admitted|agreed|snapped|retorted|demanded|repeated|breathed|returned|offered|ventured|' +
  'countered|conceded|mused|sighed|growled|called|put in|went on|broke in|interrupted';

const TITLES = 'Dr|Mr|Mrs|Ms|Miss|Lady|Lord|Sir|Inspector|Superintendent|Sergeant|Constable|Captain|Colonel|Major|Professor|Reverend|Nurse|Doctor';

/** "Dr. Cecil Ashgrove", "Katherine Bellamy", "Hale" - up to three words. */
const NAME_SRC = `(?:(?:${TITLES})\\.?\\s+)?[A-Z][a-z]+(?:\\s+[A-Z][a-z]+){0,2}`;

const AFTER_NAME_VERB = new RegExp(`^[\\s,]*(${NAME_SRC})\\s+(?:${SPEECH_VERBS})\\b`);
const AFTER_VERB_NAME = new RegExp(`^[\\s,]*(?:${SPEECH_VERBS})\\s+(${NAME_SRC})\\b`);
const BEFORE_NAME_VERB = new RegExp(`(${NAME_SRC})\\s+(?:${SPEECH_VERBS})\\b[\\s,:]*$`);
const BEFORE_VERB_NAME = new RegExp(`(?:${SPEECH_VERBS})\\s+(${NAME_SRC})\\b[\\s,:]*$`);

/* Unanchored fallbacks, tried only after the anchored forms fail. A speaker
 * often changes without a tag on the quote itself - "Ferdinand Carrick's
 * clipped voice cut through the hush" is the attribution for what follows. */
const VOICE_NOUNS = 'voice|tone|words|reply|answer|retort|drawl|murmur|whisper|question';
const POSSESSIVE_VOICE = new RegExp(`(${NAME_SRC})'s\\s+(?:\\w+\\s+){0,2}(?:${VOICE_NOUNS})\\b`);
const ANY_NAME_VERB = new RegExp(`(${NAME_SRC})\\s+(?:${SPEECH_VERBS})\\b`);
const ANY_VERB_NAME = new RegExp(`(?:${SPEECH_VERBS})\\s+(${NAME_SRC})\\b`);

/** Words that look like names but never are, in this position. */
const STOPWORDS = new Set([
  'The', 'She', 'He', 'They', 'It', 'His', 'Her', 'Their', 'That', 'This', 'There',
  'But', 'And', 'When', 'Then', 'Now', 'After', 'Before', 'If', 'As', 'At', 'In', 'On',
  'A', 'An', 'One', 'Both', 'Neither', 'Everyone', 'Someone', 'Nobody', 'Chapter',
]);

function cleanName(raw) {
  if (!raw) return null;
  let n = raw.trim().replace(/\s+/g, ' ').replace(/[.,;:]+$/, '');
  const first = n.split(' ')[0].replace(/\.$/, '');
  if (STOPWORDS.has(first)) return null;
  if (n.length < 2) return null;
  return n;
}

/**
 * Split a paragraph into quoted and unquoted spans.
 *
 * Two quote styles occur and both must work: manuscripts written to
 * stories/*.md use straight quotes, the prose artifacts in the store use curly
 * ones. Handling only `"` made cast detection silently return zero speakers on
 * every stored manuscript - a filter returning no rows, which reads exactly
 * like "this book has no dialogue".
 *
 * U+2019 is deliberately NOT a quote here: it is the apostrophe in "don't",
 * and treating it as one shreds every line of dialogue that contains one.
 *
 * Quote state is threaded ACROSS paragraphs, because speech routinely runs on:
 * a paragraph can open a quote and never close it. Tracking parity per
 * paragraph inverts every span after the first such run - narration gets read
 * as dialogue and dialogue as narration. Continued speech also re-opens with a
 * quote mark in each new paragraph but closes only once at the end, so a
 * leading quote while already inside one is a re-opener, not a closer.
 */
const OPEN_QUOTES = new Set(['“', '«', '„']);
const CLOSE_QUOTES = new Set(['”', '»']);
const LEADING_REOPEN = /^(\s*)["“«„]/;

export function splitQuotes(paragraph, startInQuote = false) {
  const spans = [];
  let buf = '';
  let inQuote = startInQuote;
  let text = String(paragraph);

  // Continued speech re-opens with a quote mark in each new paragraph but only
  // closes once at the end, so a leading quote while already inside one is a
  // re-opener, not a closer.
  if (inQuote && LEADING_REOPEN.test(text)) {
    text = text.replace(LEADING_REOPEN, '$1');
  }

  const flush = (quoted) => {
    if (buf.trim()) spans.push({ quoted, text: buf });
    buf = '';
  };

  for (const ch of text) {
    if (ch === '"') {
      flush(inQuote);
      inQuote = !inQuote;
      continue;
    }
    if (OPEN_QUOTES.has(ch)) {
      if (inQuote) continue; // mid-speech re-open; stay inside
      flush(false);
      inQuote = true;
      continue;
    }
    if (CLOSE_QUOTES.has(ch)) {
      if (!inQuote) continue; // stray close; ignore rather than invert everything
      flush(true);
      inQuote = false;
      continue;
    }
    buf += ch;
  }
  flush(inQuote);
  return { spans, endInQuote: inQuote };
}

/** Pull the speaker out of the narration on either side of a quote. */
function attribute(after, before) {
  // Tightest evidence first: a tag sitting directly against the quote.
  for (const re of [AFTER_NAME_VERB, AFTER_VERB_NAME]) {
    const n = cleanName(re.exec(after || '')?.[1]);
    if (n) return n;
  }
  for (const re of [BEFORE_NAME_VERB, BEFORE_VERB_NAME]) {
    const n = cleanName(re.exec(before || '')?.[1]);
    if (n) return n;
  }
  // Then looser evidence in the narration that introduces the quote.
  for (const re of [POSSESSIVE_VOICE, ANY_NAME_VERB, ANY_VERB_NAME]) {
    const n = cleanName(re.exec(before || '')?.[1]);
    if (n) return n;
  }
  for (const re of [POSSESSIVE_VOICE, ANY_NAME_VERB, ANY_VERB_NAME]) {
    const n = cleanName(re.exec(after || '')?.[1]);
    if (n) return n;
  }
  return null;
}

/**
 * Turn one paragraph into narration/dialogue segments with speakers attached.
 * `lastSpeaker` carries across a split quote ("...," she said, "...") and is
 * returned so the caller can thread it through the following paragraphs.
 */
export function segmentParagraph(paragraph, { lastSpeaker = null, inQuote = false } = {}) {
  const { spans, endInQuote } = splitQuotes(paragraph, inQuote);
  const segments = [];
  let carried = lastSpeaker;

  spans.forEach((span, i) => {
    if (!span.quoted) {
      segments.push({ kind: 'narration', speaker: null, text: span.text });
      return;
    }
    const after = spans.slice(i + 1).find((s) => !s.quoted)?.text || '';
    const before = [...spans.slice(0, i)].reverse().find((s) => !s.quoted)?.text || '';
    const speaker = attribute(after, before) || carried;
    if (speaker) carried = speaker;
    segments.push({ kind: 'dialogue', speaker, text: span.text });
  });

  return { segments, lastSpeaker: carried, inQuote: endInQuote };
}

/**
 * A speaker named in narration that carries no dialogue of its own.
 *
 * Fiction routinely introduces a speaker in one paragraph and gives them the
 * next one outright:
 *
 *     Ferdinand Carrick's clipped voice cut through the hush.
 *
 *     "I was in my quarters, as the logs will show."
 *
 * Attribution that only looks inside a paragraph cannot see this, and hands
 * the line to whoever spoke last - the wrong character, in a different voice.
 */
export function speakerCueIn(text) {
  for (const re of [POSSESSIVE_VOICE, ANY_NAME_VERB, ANY_VERB_NAME]) {
    const n = cleanName(re.exec(text || '')?.[1]);
    if (n) return n;
  }
  return null;
}

/**
 * Segment a run of paragraphs, threading quote state and speaker through.
 * This is the entry point everything else should use - segmenting a paragraph
 * in isolation cannot know whether it begins inside a quote, nor who the
 * previous paragraph just put on stage.
 */
export function segmentParagraphs(paragraphs, { lastSpeaker = null, inQuote = false } = {}) {
  const out = [];
  let carried = lastSpeaker;
  let quote = inQuote;
  for (const p of paragraphs) {
    const r = segmentParagraph(p, { lastSpeaker: carried, inQuote: quote });
    quote = r.inQuote;

    const spoke = r.segments.some((s) => s.kind === 'dialogue');
    if (spoke) {
      carried = r.lastSpeaker;
    } else {
      // Narration only: if it names someone about to speak, hand them the floor.
      carried = speakerCueIn(p) || r.lastSpeaker;
    }
    out.push(r.segments);
  }
  return { paragraphs: out, lastSpeaker: carried, inQuote: quote };
}

/**
 * Scan a whole story for who speaks and how often, so the UI can offer a cast
 * list to assign voices to. Returns most-spoken first.
 */
export function detectCast(paragraphs) {
  const counts = new Map();
  const { paragraphs: segmented } = segmentParagraphs(paragraphs);


  for (const segments of segmented) {
    for (const s of segments) {
      if (s.kind !== 'dialogue' || !s.speaker) continue;
      const entry = counts.get(s.speaker) || { name: s.speaker, lines: 0, chars: 0 };
      entry.lines += 1;
      entry.chars += s.text.length;
      counts.set(s.speaker, entry);
    }
  }

  const cast = [...counts.values()];
  const merged = mergeAliases(cast);

  return merged.sort((a, b) => b.lines - a.lines);
}

/**
 * "Katherine", "Katherine Bellamy" and "Miss Bellamy" are one person.
 * Fold short names into the longest name that contains them, so the user
 * assigns one voice per character rather than one per spelling.
 */
export function mergeAliases(cast) {
  const sorted = [...cast].sort((a, b) => b.name.length - a.name.length);
  const out = [];
  for (const person of sorted) {
    const words = new Set(person.name.replace(/\b(?:[A-Z][a-z]+)\./g, '').split(/\s+/).filter(Boolean));
    const host = out.find((o) => {
      const hostWords = new Set(o.name.split(/\s+/).filter(Boolean));
      for (const w of words) if (hostWords.has(w)) return true;
      return false;
    });
    if (host) {
      host.lines += person.lines;
      host.chars += person.chars;
      host.aliases = [...(host.aliases || []), person.name];
    } else {
      out.push({ ...person, aliases: [] });
    }
  }
  return out;
}

/** Resolve a detected speaker to one of the cast entries the user assigned. */
export function resolveSpeaker(speaker, cast) {
  if (!speaker) return null;
  const exact = cast.find((c) => c.name === speaker || (c.aliases || []).includes(speaker));
  if (exact) return exact;
  const words = speaker.split(/\s+/).filter((w) => !/^[A-Z][a-z]+\.$/.test(w));
  return (
    cast.find((c) => {
      const hay = [c.name, ...(c.aliases || [])].join(' ');
      return words.some((w) => w.length > 2 && hay.includes(w));
    }) || null
  );
}
