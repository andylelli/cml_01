/* The narration core, shared by the standalone app and the workshop API. */

export { escapeXml } from './xml.js';

export {
  stripMarkdown, parseChapters, chunkChapter, planStory, markFrontMatter,
  countWords, withoutMarkers, EM_OPEN, EM_CLOSE, ST_OPEN, ST_CLOSE,
} from './text.js';

export {
  splitQuotes, segmentParagraph, segmentParagraphs, speakerCueIn, detectCast, mergeAliases, resolveSpeaker,
} from './dialogue.js';

export { renderText, buildChunkSsml } from './ssml.js';

export {
  listPrebuiltVoices, ensureProject, createConsent, createPersonalVoice,
  getPersonalVoice, deletePersonalVoice, waitForPersonalVoice,
  consentStatement, synthesize,
} from './azure.js';

export {
  ffmpegBinary, runFfmpeg, durationSeconds, concatMp3, makeSilence,
  buildM4b, toConsentWav, formatDuration,
} from './audio.js';

export { proseToMarkdown, pickProseArtifact } from './prose.js';

export {
  DEFAULTS, normaliseOptions, estimateCost, composeSsml, planNarration, renderBook, slug,
} from './render.js';
