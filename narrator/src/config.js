import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..');
export const REPO_ROOT = path.resolve(ROOT, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

/**
 * Env is read at CALL time, never frozen into a module const, so a .env edit
 * takes effect on the next request without a restart (ADR-0004 in the parent repo).
 */
export function config() {
  return {
    port: Number(process.env.PORT || 5174),
    speechKey: process.env.AZURE_SPEECH_KEY || '',
    region: process.env.AZURE_SPEECH_REGION || 'uksouth',
    // Personal Voice (voice cloning) is gated behind Microsoft's limited-access
    // approval. Leave this alone; the app detects a 403 and says so plainly.
    apiVersion: process.env.AZURE_CUSTOMVOICE_API_VERSION || '2024-02-01-preview',
    // Base model that carries the cloned timbre. Dragon is the most expressive.
    personalVoiceBaseModel: process.env.AZURE_PERSONAL_VOICE_BASE_MODEL || 'DragonLatestNeural',
    companyName: process.env.VOICE_TALENT_COMPANY || 'Personal use',
    outputFormat: process.env.AZURE_OUTPUT_FORMAT || 'audio-24khz-160kbitrate-mono-mp3',
    maxChunkChars: Number(process.env.MAX_CHUNK_CHARS || 2400),
    concurrency: Number(process.env.SYNTH_CONCURRENCY || 3),
    // USD per 1M characters, for the cost estimate shown before you press go.
    // Azure list price at time of writing: neural ~$15, personal voice ~$24.
    usdPerMillionNeural: Number(process.env.USD_PER_MILLION_NEURAL || 15),
    usdPerMillionPersonal: Number(process.env.USD_PER_MILLION_PERSONAL || 24),
    usdToGbp: Number(process.env.USD_TO_GBP || 0.79),
  };
}

export const paths = {
  data: path.join(ROOT, 'data'),
  voices: path.join(ROOT, 'data', 'voices.json'),
  jobs: path.join(ROOT, 'data', 'jobs'),
  cache: path.join(ROOT, 'data', 'cache'),
  output: path.join(ROOT, 'data', 'output'),
  uploads: path.join(ROOT, 'data', 'uploads'),
  public: path.join(ROOT, 'public'),
};

export function assertConfigured() {
  const c = config();
  if (!c.speechKey) {
    const err = new Error(
      'AZURE_SPEECH_KEY is not set. Copy .env.example to .env and paste the key from your Azure Speech resource.'
    );
    err.status = 428;
    throw err;
  }
  return c;
}
