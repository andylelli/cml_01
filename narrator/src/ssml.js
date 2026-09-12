import { escapeXml } from './azure.js';
import { segmentParagraph } from './dialogue.js';
import { EM_OPEN, EM_CLOSE, ST_OPEN, ST_CLOSE } from './text.js';

/* ------------------------------------------------------------------ *
 * SSML assembly.
 *
 * Three things happen here that separate this from reading text aloud:
 *   - italics in the prose become <emphasis>, because in a fair-play mystery
 *     the stressed word often IS the clue
 *   - each speaking character can get their own <voice>
 *   - a pronunciation lexicon fixes names the model will otherwise mangle
 * ------------------------------------------------------------------ */

const SUB_OPEN = '\uE004';
const SUB_MID = '\uE005';
const SUB_CLOSE = '\uE006';

/** Longest-first so "Dr. Cecil Ashgrove" wins over "Ashgrove". */
function lexiconPattern(lexicon) {
  const terms = Object.keys(lexicon).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!terms.length) return null;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(?<![\\w])(${escaped.join('|')})(?![\\w])`, 'g');
}

/**
 * Text -> SSML fragment.
 * Markdown emphasis arrives as private-use sentinels (planted by stripMarkdown
 * so the markers survive paragraph assembly), and lexicon hits are wrapped in
 * sentinels too. Everything is XML-escaped first, then the sentinels become
 * real tags - so no user text can ever inject markup.
 */
export function renderText(text, { lexicon = {}, emphasis = true } = {}) {
  let s = String(text);

  const pattern = lexiconPattern(lexicon);
  const aliases = [];
  if (pattern) {
    s = s.replace(pattern, (match) => {
      const alias = lexicon[match] ?? lexicon[Object.keys(lexicon).find((k) => k.toLowerCase() === match.toLowerCase())];
      if (!alias) return match;
      const i = aliases.push(alias) - 1;
      return `${SUB_OPEN}${i}${SUB_MID}${match}${SUB_CLOSE}`;
    });
  }

  s = escapeXml(s);

  if (emphasis) {
    s = s.split(EM_OPEN).join('<emphasis level="moderate">').split(EM_CLOSE).join('</emphasis>');
    s = s.split(ST_OPEN).join('<emphasis level="strong">').split(ST_CLOSE).join('</emphasis>');
  } else {
    s = s.split(EM_OPEN).join('').split(EM_CLOSE).join('')
         .split(ST_OPEN).join('').split(ST_CLOSE).join('');
  }

  s = s.replace(
    new RegExp(`${SUB_OPEN}(\\d+)${SUB_MID}([\\s\\S]*?)${SUB_CLOSE}`, 'g'),
    (_m, idx, original) => `<sub alias="${escapeXml(aliases[Number(idx)])}">${original}</sub>`
  );

  return s;
}

function voiceName(voice, fallbackBaseModel) {
  if (!voice) return null;
  return voice.kind === 'personal' ? voice.baseModel || fallbackBaseModel : voice.id;
}

function embedding(voice) {
  return voice?.kind === 'personal'
    ? `<mstts:ttsembedding speakerProfileId="${escapeXml(voice.speakerProfileId)}"/>`
    : '';
}

/** Wrap a body in <voice>, with prosody and style applied inside it. */
function voiceElement(voice, body, { rate, pitch, style, baseModel }) {
  let inner = body;
  // express-as is a prebuilt-voice feature; a cloned voice carries its own affect.
  if (style && voice?.kind !== 'personal') {
    inner = `<mstts:express-as style="${escapeXml(style)}">${inner}</mstts:express-as>`;
  }
  const attrs = [];
  if (rate) attrs.push(`rate="${escapeXml(rate)}"`);
  if (pitch) attrs.push(`pitch="${escapeXml(pitch)}"`);
  if (attrs.length) inner = `<prosody ${attrs.join(' ')}>${inner}</prosody>`;
  return `<voice name="${escapeXml(voiceName(voice, baseModel))}">${embedding(voice)}${inner}</voice>`;
}

function speak(locale, body) {
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" ` +
    `xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${escapeXml(locale)}">${body}</speak>`
  );
}

/**
 * Build the SSML for one chunk.
 *
 * `state` threads quote and speaker across chunks, because a quote can open in
 * one chunk and close in the next. It is returned so the caller can pass it on.
 */
export function buildChunkSsml({ chunk, voices, options = {}, state = { inQuote: false, lastSpeaker: null } }) {
  const {
    locale = 'en-GB',
    rate,
    pitch,
    style,
    paragraphPauseMs = 550,
    scenePauseMs = 1400,
    headingPauseMs = 1100,
    lexicon = {},
    emphasis = true,
    multiVoice = false,
    baseModel,
  } = options;

  const narrator = voices.narrator;
  const prosody = { rate, pitch, style, baseModel };
  let next = { ...state };

  /* ---- single voice: one <voice> around everything ---- */
  if (!multiVoice) {
    const parts = [];
    chunk.blocks.forEach((b, i) => {
      if (b.type === 'break') {
        parts.push(`<break time="${scenePauseMs}ms"/>`);
        return;
      }
      if (i > 0 && chunk.blocks[i - 1].type !== 'break') {
        parts.push(`<break time="${paragraphPauseMs}ms"/>`);
      }
      const rendered = renderText(b.text, { lexicon, emphasis });
      parts.push(b.type === 'heading' ? `${rendered}<break time="${headingPauseMs}ms"/>` : rendered);
    });
    return { ssml: speak(locale, voiceElement(narrator, parts.join(''), prosody)), state: next };
  }

  /* ---- multi voice: a <voice> element per speaker turn ---- */
  const elements = [];
  let pending = [];
  let pendingVoice = narrator;

  const flush = () => {
    if (!pending.length) return;
    elements.push(voiceElement(pendingVoice, pending.join(''), prosody));
    pending = [];
  };
  const emit = (voice, fragment) => {
    if (voice !== pendingVoice) {
      flush();
      pendingVoice = voice;
    }
    pending.push(fragment);
  };

  chunk.blocks.forEach((b, i) => {
    if (b.type === 'break') {
      emit(pendingVoice, `<break time="${scenePauseMs}ms"/>`);
      return;
    }
    if (i > 0 && chunk.blocks[i - 1].type !== 'break') {
      emit(pendingVoice, `<break time="${paragraphPauseMs}ms"/>`);
    }
    if (b.type === 'heading') {
      emit(narrator, `${renderText(b.text, { lexicon, emphasis })}<break time="${headingPauseMs}ms"/>`);
      return;
    }

    const r = segmentParagraph(b.text, { lastSpeaker: next.lastSpeaker, inQuote: next.inQuote });
    next = { inQuote: r.inQuote, lastSpeaker: r.lastSpeaker };

    for (const seg of r.segments) {
      const voice =
        seg.kind === 'dialogue' && seg.speaker
          ? voices.byCharacter?.[seg.speaker] || narrator
          : narrator;
      emit(voice, renderText(seg.text, { lexicon, emphasis }));
    }
  });

  flush();
  return { ssml: speak(locale, elements.join('')), state: next };
}
