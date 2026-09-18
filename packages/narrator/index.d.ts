/** Hand-written types: the implementation is plain ESM, so there is no build. */

export interface AzureCreds {
  key: string;
  region: string;
  apiVersion?: string;
  outputFormat?: string;
  companyName?: string;
}

export interface Voice {
  id: string;
  kind: 'prebuilt' | 'personal';
  label?: string;
  name?: string;
  locale?: string;
  localeName?: string;
  gender?: string;
  styles?: string[];
  wordsPerMinute?: number | null;
  speakerProfileId?: string | null;
  baseModel?: string | null;
}

export interface CharacterVoice {
  name: string;
  aliases?: string[];
  voice: Voice;
}

export interface NarrationOptions {
  locale?: string;
  rate?: string;
  pitch?: string;
  style?: string;
  paragraphPauseMs?: number;
  scenePauseMs?: number;
  headingPauseMs?: number;
  readChapterTitles?: boolean;
  skipFrontMatter?: boolean;
  emphasis?: boolean;
  multiVoice?: boolean;
  lexicon?: Record<string, string>;
  characterVoices?: CharacterVoice[];
  makeM4b?: boolean;
  maxChunkChars?: number;
  concurrency?: number;
}

export interface Rates {
  usdPerMillionNeural?: number;
  usdPerMillionPersonal?: number;
  usdToGbp?: number;
}

export interface CostEstimate {
  chars: number;
  usdPerMillion: number;
  usd: number;
  gbp: number;
}

export interface PlanTotals {
  chapters: number;
  chunks: number;
  chars: number;
  words: number;
  estimatedMinutes: number;
}

export interface PlannedChapter {
  index: number;
  title: string;
  titled: boolean;
  words: number;
  chars: number;
  chunks: number;
  isFrontMatter?: boolean;
  skipped?: boolean;
}

export interface NarrationPlan {
  title: string | null;
  totals: PlanTotals;
  estimate: CostEstimate;
  chapters: PlannedChapter[];
}

export interface ChapterOutput {
  title: string;
  file: string;
  index: number;
  startSeconds?: number;
  durationSeconds?: number;
}

export interface RenderResult {
  outputs: { mp3: string; m4b?: string; chapters: ChapterOutput[] };
  warnings: string[];
  totals: PlanTotals;
  durationSeconds: number;
  durationLabel: string;
  elapsedSeconds: number;
  cachedHits: number;
  chunks: number;
  cost: CostEstimate;
}

export interface RenderProgress {
  done: number;
  total: number;
  cachedHits: number;
  phase: 'synthesizing' | 'assembling';
}

export interface CastMember {
  name: string;
  lines: number;
  chars: number;
  aliases: string[];
}

export interface ProseMarkdown {
  markdown: string;
  title: string;
  chapters: number;
  paragraphs: number;
  summariesIncluded: boolean;
}

/* ---- prose ---- */
export function proseToMarkdown(
  payload: unknown,
  opts?: { includeSummaries?: boolean; fallbackTitle?: string }
): ProseMarkdown;
export function pickProseArtifact<T>(
  byType: Record<string, T>,
  preferredLength?: string | null
): { type: string; artifact: T } | null;

/* ---- planning and rendering ---- */
export function planNarration(
  markdown: string,
  opts?: { options?: NarrationOptions; voiceKind?: string; rates?: Rates }
): NarrationPlan;

export function renderBook(args: {
  markdown: string;
  title: string;
  voice: Voice;
  options?: NarrationOptions;
  creds: AzureCreds;
  dirs: { cache: string; out: string };
  baseModel?: string;
  signal?: AbortSignal;
  onProgress?: (p: RenderProgress) => void;
  rates?: Rates;
}): Promise<RenderResult>;

export function normaliseOptions(options?: NarrationOptions, voice?: Partial<Voice>): Required<NarrationOptions>;
export function estimateCost(chars: number, voiceKind?: string, rates?: Rates): CostEstimate;
export function slug(s: string): string;
export const DEFAULTS: {
  maxChunkChars: number;
  concurrency: number;
  usdPerMillionNeural: number;
  usdPerMillionPersonal: number;
  usdToGbp: number;
};

/* ---- text and dialogue ---- */
export function parseChapters(raw: string): {
  title: string | null;
  chapters: Array<{
    index: number;
    title: string;
    titled: boolean;
    blocks: Array<{ type: 'p' | 'heading' | 'break'; text?: string }>;
  }>;
};
export function detectCast(paragraphs: string[]): CastMember[];
export function countWords(s: string): number;
export function escapeXml(s: string): string;

/* ---- azure ---- */
export function listPrebuiltVoices(creds: AzureCreds): Promise<Voice[]>;
export function synthesize(
  ssml: string,
  creds: AzureCreds,
  opts?: { attempts?: number; signal?: AbortSignal }
): Promise<Buffer>;
export function consentStatement(name?: string, company?: string): string;
export function ensureProject(projectId: string, creds: AzureCreds): Promise<string>;
export function createConsent(
  args: { consentId: string; projectId: string; voiceTalentName: string; locale: string; audio: { buffer: Buffer; filename: string } },
  creds: AzureCreds
): Promise<unknown>;
export function createPersonalVoice(
  args: { personalVoiceId: string; projectId: string; consentId: string; samples: Array<{ buffer: Buffer; filename: string }> },
  creds: AzureCreds
): Promise<unknown>;
export function waitForPersonalVoice(
  personalVoiceId: string,
  creds: AzureCreds,
  opts?: { timeoutMs?: number; onTick?: (status: string) => void }
): Promise<Record<string, unknown>>;
export function deletePersonalVoice(personalVoiceId: string, creds: AzureCreds): Promise<void>;

/* ---- audio ---- */
export function durationSeconds(file: string): Promise<number>;
export function formatDuration(totalSeconds: number): string;
export function toConsentWav(inFile: string, outFile: string): Promise<string>;
export function ffmpegBinary(): string;
