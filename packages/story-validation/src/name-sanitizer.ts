/**
 * Shared character-name sanitization utilities.
 *
 * Centralizes titled-name detection so prose sanitization and chapter
 * validation stay in lockstep.
 */

const TITLED_NAME_PATTERN = /\b(Inspector|Constable|Sergeant|Captain|Detective|Mr\.?|Mrs\.?|Miss|Dr\.?)\s+([A-Z][a-z]+(?:[-'’][A-Z][a-z]+)?(?:\s+[A-Z][a-z]+(?:[-'’][A-Z][a-z]+)?)*)/g;
const TITLE_TOKENS = new Set([
  'inspector',
  'constable',
  'sergeant',
  'captain',
  'detective',
  'mr',
  'mrs',
  'miss',
  'dr',
]);

const ANON_MAP: Record<string, string> = {
  Inspector: 'an inspector',
  Constable: 'a constable',
  Sergeant: 'the sergeant',
  Captain: 'the captain',
  Detective: 'the detective',
  Mr: 'a gentleman',
  'Mr.': 'a gentleman',
  Mrs: 'a woman',
  'Mrs.': 'a woman',
  Miss: 'a young woman',
  Dr: 'the doctor',
  'Dr.': 'the doctor',
};

function normalizeSurnameToken(s: string): string {
  return s.replace(/[.,;:!?"'”’)]$/g, '');
}

function isTitleToken(token: string): boolean {
  return TITLE_TOKENS.has(token.toLowerCase().replace(/\.$/, ''));
}

function extractSurnameFromNameSegment(nameSegment: string): string {
  const tokens = nameSegment
    .split(/\s+/)
    .map((token) => normalizeSurnameToken(token))
    .filter(Boolean);
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    if (!isTitleToken(tokens[i])) {
      return tokens[i];
    }
  }
  return '';
}

export function buildValidSurnames(validCastNames: string[]): Set<string> {
  return new Set(
    validCastNames
      .map((name) => normalizeSurnameToken(name.split(' ').pop() ?? name))
      .map((surname) => surname.toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Return all unknown `Title Surname` mentions in text.
 */
export function findUnknownTitledNameMentions(text: string, validCastNames: string[]): string[] {
  const validSurnames = buildValidSurnames(validCastNames);
  const unknown: string[] = [];

  for (const match of text.matchAll(TITLED_NAME_PATTERN)) {
    const full = match[0];
    const surname = extractSurnameFromNameSegment(match[2] ?? '').toLowerCase();
    if (!surname) continue;
    if (!validSurnames.has(surname)) {
      unknown.push(full);
    }
  }

  return unknown;
}

/**
 * Replace unknown titled names with anonymous role phrases.
 */
export function anonymizeUnknownTitledNames(text: string, validCastNames: string[]): string {
  const validSurnames = buildValidSurnames(validCastNames);

  return text.replace(TITLED_NAME_PATTERN, (match, title, nameSegment) => {
    const cleanSurname = extractSurnameFromNameSegment(nameSegment ?? '').toLowerCase();
    if (!cleanSurname) {
      return match;
    }
    if (validSurnames.has(cleanSurname)) {
      return match;
    }
    return ANON_MAP[title] ?? 'an officer';
  });
}
