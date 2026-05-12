import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const base = 'C:/CML/documentation/prompts/actual/run_20260512-1639_mystery/';

function extractChapters(filename) {
  const raw = readFileSync(join(base, filename), 'utf8');
  const bodyStart = raw.indexOf('## Response Body');
  if (bodyStart < 0) return null;
  const tick1 = raw.indexOf('```', bodyStart);
  const contentStart = raw.indexOf('\n', tick1) + 1;
  const tick2 = raw.lastIndexOf('```');
  const json = raw.slice(contentStart, tick2).trim();
  try {
    return JSON.parse(json);
  } catch (e) {
    return { error: e.message.substring(0, 120) };
  }
}

function extractAtmosphereReplacements(filename) {
  const raw = readFileSync(join(base, filename), 'utf8');
  const bodyStart = raw.indexOf('## Response Body');
  if (bodyStart < 0) return [];
  const tick1 = raw.indexOf('```', bodyStart);
  const contentStart = raw.indexOf('\n', tick1) + 1;
  const tick2 = raw.lastIndexOf('```');
  const json = raw.slice(contentStart, tick2).trim();
  try {
    const obj = JSON.parse(json);
    return obj.replacements || [];
  } catch (e) {
    return [];
  }
}

function applyReplacements(text, replacements) {
  let result = text;
  for (const r of replacements) {
    if (r.original && r.replacement) {
      result = result.split(r.original).join(r.replacement);
    }
  }
  return result;
}

// Final ProseGenerator file per chapter (last successful attempt)
const proseFiles = {
  1: '17_Agent9-ProseGenerator-Ch1_response.md',
  2: '18_Agent9-ProseGenerator-Ch2_response.md',
  3: '21_Agent9-ProseGenerator-Ch3_response.md',
  4: '22_Agent9-ProseGenerator-Ch4_response.md',
  5: '23_Agent9-ProseGenerator-Ch5_response.md',
  6: '24_Agent9-ProseGenerator-Ch6_response.md',
  7: '25_Agent9-ProseGenerator-Ch7_response.md',
  8: '27_Agent9-ProseGenerator-Ch8_response.md',
  9: '31_Agent9-ProseGenerator-Ch9_response.md',
};

// AtmosphereRepair files per chapter (where they exist)
const repairFiles = {
  1: '32_Agent9-AtmosphereRepair-Ch1_response.md',
  2: '33_Agent9-AtmosphereRepair-Ch2_response.md',
  3: '34_Agent9-AtmosphereRepair-Ch3_response.md',
  4: '35_Agent9-AtmosphereRepair-Ch4_response.md',
  5: '36_Agent9-AtmosphereRepair-Ch5_response.md',
  6: '37_Agent9-AtmosphereRepair-Ch6_response.md',
  7: '38_Agent9-AtmosphereRepair-Ch7_response.md',
  8: '39_Agent9-AtmosphereRepair-Ch8_response.md',
};

// Get story title from Agent3 CML response
function getStoryTitle() {
  try {
    const cmlRaw = readFileSync(join(base, '05_Agent3-CMLGenerator_response.md'), 'utf8');
    const titleMatch = cmlRaw.match(/title:\s*["']?([^"'\n]+)["']?/i);
    return titleMatch ? titleMatch[1].trim() : 'The Mystery';
  } catch { return 'The Mystery'; }
}

// Get cast info from cast designer
function getCastInfo() {
  try {
    const raw = readFileSync(join(base, '02_Agent2-CastDesigner_response.md'), 'utf8');
    const tick1 = raw.indexOf('```', raw.indexOf('## Response Body'));
    const contentStart = raw.indexOf('\n', tick1) + 1;
    const tick2 = raw.lastIndexOf('```');
    const obj = JSON.parse(raw.slice(contentStart, tick2).trim());
    return obj;
  } catch { return null; }
}

const title = getStoryTitle();
console.log('Title:', title);

// Extract and assemble all chapters
const assembledChapters = [];

for (let i = 1; i <= 9; i++) {
  const proseObj = extractChapters(proseFiles[i]);
  if (!proseObj || proseObj.error) {
    console.error(`Chapter ${i}: prose extraction failed`, proseObj?.error);
    continue;
  }

  const chapters = proseObj.chapters || [];
  for (const ch of chapters) {
    let text = ch.paragraphs.join('\n\n');

    // Apply atmosphere repairs if available
    if (repairFiles[i]) {
      const repairs = extractAtmosphereReplacements(repairFiles[i]);
      text = applyReplacements(text, repairs);
    }

    assembledChapters.push({
      title: ch.title || `Chapter ${i}`,
      summary: ch.summary || '',
      text,
    });
    console.log(`Chapter ${i}: "${ch.title}" — ${ch.paragraphs.length} paragraphs, ${text.split(/\s+/).length} words`);
  }
}

// Build the markdown file
let md = '';
md += `# ${title}\n\n`;
md += `*Run ID: mystery-1778603975299 — Generated 12 May 2026*\n\n`;
md += `---\n\n`;

for (const ch of assembledChapters) {
  md += `## ${ch.title}\n\n`;
  md += ch.text + '\n\n';
  md += `---\n\n`;
}

const outPath = join(base, 'full_story.md');
writeFileSync(outPath, md, 'utf8');
console.log('\nWritten to:', outPath);
console.log('Total words:', md.split(/\s+/).length);
