import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  proseToMarkdown,
  pickProseArtifact,
  planNarration,
  parseChapters,
  detectCast,
  buildChunkSsml,
  normaliseOptions,
  composeSsml,
  planStory,
} from '../src/index.js';

const VOICE = { id: 'en-GB-RyanNeural', kind: 'prebuilt', locale: 'en-GB' };

/* ------------------------------ prose ------------------------------ */

const PAYLOAD = {
  title: 'The Silent Clock',
  chapters: [
    {
      title: 'Chapter One: Arrival',
      summary: 'Hale arrives and nobody meets him. The sister did it.',
      paragraphs: ['The train was late.', '"Nobody met me," Hale said.'],
    },
    { title: 'Chapter Two', summary: 'The reveal.', paragraphs: ['It was the sister.'] },
  ],
};

test('chapter summaries are never narrated by default', () => {
  const { markdown, summariesIncluded } = proseToMarkdown(PAYLOAD);
  assert.equal(summariesIncluded, false);
  assert.ok(!markdown.includes('The sister did it'), 'summary must not reach the narration');
  assert.ok(!markdown.includes('The reveal'));
  assert.ok(markdown.includes('The train was late.'));
});

test('summaries can be opted into explicitly', () => {
  const { markdown } = proseToMarkdown(PAYLOAD, { includeSummaries: true });
  assert.ok(markdown.includes('The sister did it'));
});

test('prose converts to markdown the chapter parser understands', () => {
  const { markdown, title, chapters, paragraphs } = proseToMarkdown(PAYLOAD);
  assert.equal(title, 'The Silent Clock');
  assert.equal(chapters, 2);
  assert.equal(paragraphs, 3);

  const parsed = parseChapters(markdown);
  assert.equal(parsed.title, 'The Silent Clock');
  assert.equal(parsed.chapters.length, 2);
  assert.equal(parsed.chapters[0].title, 'Chapter One: Arrival');
  assert.ok(parsed.chapters.every((c) => c.titled));
});

test('a malformed payload degrades instead of throwing', () => {
  assert.equal(proseToMarkdown(null).chapters, 0);
  assert.equal(proseToMarkdown({ chapters: 'nope' }).chapters, 0);
  assert.equal(proseToMarkdown({}, { fallbackTitle: 'Fallback' }).title, 'Fallback');
  const ragged = proseToMarkdown({ chapters: [{ paragraphs: [null, '', 'Real text.'] }] });
  assert.equal(ragged.paragraphs, 1);
  assert.ok(ragged.markdown.includes('Chapter 1'));
});

test('prose artifact selection matches the PDF route order', () => {
  assert.equal(pickProseArtifact({ prose_long: 'L', prose_medium: 'M' }).type, 'prose_medium');
  assert.equal(pickProseArtifact({ prose_long: 'L' }).type, 'prose_long');
  assert.equal(pickProseArtifact({ prose: 'legacy' }).type, 'prose');
  assert.equal(pickProseArtifact({ prose_long: 'L' }, 'short').type, 'prose_long', 'falls back when the asked-for length is missing');
  assert.equal(pickProseArtifact({}), null);
});

/* ------------------------------ planning ------------------------------ */

test('planning reports chapters, requests and a cost before any spend', () => {
  const { markdown } = proseToMarkdown(PAYLOAD);
  const plan = planNarration(markdown);
  assert.equal(plan.totals.chapters, 2);
  assert.ok(plan.totals.chunks >= 2);
  assert.ok(plan.estimate.usd >= 0);
  assert.equal(plan.estimate.usdPerMillion, 15);
  assert.equal(planNarration(markdown, { voiceKind: 'personal' }).estimate.usdPerMillion, 24);
});

test('front matter is skipped, but a heading-less story is never dropped', () => {
  const withFront = '# Book\n\n*Run ID: abc - Generated today*\n\n---\n\n## One\n\nReal prose here.\n';
  const plan = planNarration(withFront);
  const front = plan.chapters.find((c) => c.isFrontMatter);
  assert.ok(front && front.skipped, 'run-id front matter must not open the audiobook');
  assert.equal(plan.totals.chapters, 1);

  // The guard: no headings at all is ONE untitled chapter, not front matter.
  const bare = planNarration('Just a paragraph of prose with no heading at all.');
  assert.equal(bare.totals.chapters, 1);
  assert.ok(bare.totals.words > 0);
});

/* ------------------------------ dialogue ------------------------------ */

test('speakers are attributed across paragraphs and quote runs', () => {
  const paras = [
    '"The logs show he left at eight," Dr Ashgrove said, glancing at the fabric.',
    'Ferdinand Carrick\'s clipped voice cut through the hush.',
    '"I was in my quarters, as the logs will show."',
    '"You were in the lounge, weren\'t you?" Katherine Bellamy asked.',
  ];
  const cast = detectCast(paras);
  const names = cast.map((c) => c.name);
  assert.ok(names.some((n) => /Ashgrove/.test(n)));
  assert.ok(names.some((n) => /Carrick/.test(n)), 'possessive-voice attribution must be found');
  assert.ok(names.some((n) => /Katherine/.test(n)));
});

/* -------------------------------- SSML -------------------------------- */

function xmlWellFormed(s) {
  const stack = [];
  const re = /<(\/?)([A-Za-z:][\w:.-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(s))) {
    const [, close, name, , selfClose] = m;
    if (selfClose) continue;
    if (close) {
      if (stack.pop() !== name) return false;
    } else stack.push(name);
  }
  if (stack.length) return false;
  const stripped = s.replace(re, '');
  return !stripped.includes('<') && !stripped.includes('>');
}

test('italics become emphasis and raw markup can never be injected', () => {
  const md = '## One\n\nShe said she *saw* him & <not> heard him.\n';
  const plan = planStory(md, { maxChunkChars: 2400 });
  const opts = normaliseOptions({ emphasis: true });
  const [{ ssml }] = composeSsml(plan, { voice: VOICE, options: opts }).flatMap((c) =>
    c.ssml.map((s) => ({ ssml: s }))
  );
  assert.ok(ssml.includes('<emphasis level="moderate">saw</emphasis>'));
  assert.ok(ssml.includes('&amp;') && ssml.includes('&lt;not&gt;'), 'user text must be escaped');
  assert.ok(xmlWellFormed(ssml));

  const off = composeSsml(plan, { voice: VOICE, options: normaliseOptions({ emphasis: false }) })[0].ssml[0];
  assert.ok(!off.includes('<emphasis'));
});

test('multi-voice emits a voice element per speaker and stays well formed', () => {
  const md = '## One\n\n"I saw him," Katherine said. "At four."\n\nThe clock had stopped.\n';
  const plan = planStory(md, { maxChunkChars: 2400 });
  const opts = normaliseOptions({
    multiVoice: true,
    characterVoices: [
      { name: 'Katherine', aliases: [], voice: { id: 'en-GB-SoniaNeural', kind: 'prebuilt' } },
    ],
  });
  const ssml = composeSsml(plan, { voice: VOICE, options: opts })[0].ssml[0];
  assert.ok(ssml.includes('en-GB-SoniaNeural'), 'the character voice must be used');
  assert.ok(ssml.includes('en-GB-RyanNeural'), 'narration stays in the narrator voice');
  assert.ok((ssml.match(/<voice /g) || []).length >= 2);
  assert.ok(xmlWellFormed(ssml));
});

test('single-voice mode uses exactly one voice element', () => {
  const md = '## One\n\n"I saw him," Katherine said.\n';
  const plan = planStory(md, { maxChunkChars: 2400 });
  const ssml = composeSsml(plan, { voice: VOICE, options: normaliseOptions({ multiVoice: false }) })[0].ssml[0];
  assert.equal((ssml.match(/<voice /g) || []).length, 1);
});

test('a cloned voice is addressed by base model plus speaker profile', () => {
  const clone = { id: 'pv_1', kind: 'personal', speakerProfileId: 'abc-123', baseModel: 'DragonLatestNeural' };
  const { ssml } = buildChunkSsml({
    chunk: { blocks: [{ type: 'p', text: 'Hello.' }] },
    voices: { narrator: clone, byCharacter: {} },
    options: { locale: 'en-GB' },
  });
  assert.ok(ssml.includes('name="DragonLatestNeural"'));
  assert.ok(ssml.includes('speakerProfileId="abc-123"'));
  assert.ok(xmlWellFormed(ssml));
});

test('the pronunciation lexicon rewrites names via sub alias', () => {
  const { ssml } = buildChunkSsml({
    chunk: { blocks: [{ type: 'p', text: 'Fairweather was dead.' }] },
    voices: { narrator: VOICE, byCharacter: {} },
    options: { locale: 'en-GB', lexicon: { Fairweather: 'Fair-wether' } },
  });
  assert.ok(ssml.includes('<sub alias="Fair-wether">Fairweather</sub>'));
  assert.ok(xmlWellFormed(ssml));
});
