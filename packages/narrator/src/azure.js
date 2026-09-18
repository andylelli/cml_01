/* ------------------------------------------------------------------ *
 * Azure AI Speech client.
 *
 * Credentials are passed in, never read from a module-level config. Two hosts
 * use this package - the standalone narrator app and apps/api - and each owns
 * its own env loading. Reading process.env inside a module const would freeze
 * the value before dotenv runs (ADR-0004); taking it as an argument sidesteps
 * the question entirely and makes every function testable.
 *
 * Two distinct services live behind one key:
 *   - tts.speech.microsoft.com      -> synthesis (prebuilt AND cloned voices)
 *   - api.cognitive.microsoft.com   -> the Custom Voice control plane, where a
 *                                      Personal Voice is created
 * ------------------------------------------------------------------ */

const USER_AGENT = 'cml-narrator/1.0';
const DEFAULT_API_VERSION = '2024-02-01-preview';
const DEFAULT_OUTPUT_FORMAT = 'audio-24khz-160kbitrate-mono-mp3';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function requireCreds(creds, what) {
  const key = creds?.key;
  const region = creds?.region;
  if (!key) {
    const err = new Error(`No Azure Speech key supplied for ${what}.`);
    err.status = 428;
    throw err;
  }
  if (!region) {
    const err = new Error(`No Azure Speech region supplied for ${what}.`);
    err.status = 428;
    throw err;
  }
  return {
    key,
    region,
    apiVersion: creds.apiVersion || DEFAULT_API_VERSION,
    outputFormat: creds.outputFormat || DEFAULT_OUTPUT_FORMAT,
    companyName: creds.companyName || 'Personal use',
  };
}

const ttsHost = (region) => `https://${region}.tts.speech.microsoft.com`;
const cvHost = (region) => `https://${region}.api.cognitive.microsoft.com/customvoice`;

/** Turn an Azure error response into something a human can act on. */
async function azureError(res, what) {
  let body = '';
  try {
    body = await res.text();
  } catch {
    /* body already consumed or empty */
  }
  let detail = body.slice(0, 600);
  try {
    const parsed = JSON.parse(body);
    detail = parsed?.error?.message || parsed?.message || detail;
  } catch {
    /* not JSON, keep the raw text */
  }

  let hint = '';
  if (res.status === 401 || res.status === 403) {
    if (/personalvoice|consent|custom/i.test(what)) {
      hint =
        ' - Personal Voice is behind Microsoft limited access. The Speech resource must be approved via the "Custom neural voice" intake form before this endpoint will answer. Prebuilt voices work regardless.';
    } else {
      hint = ' - check the Azure Speech key and that the region matches the resource.';
    }
  }
  if (res.status === 404) {
    hint = ' - check the region; a wrong region gives a 404 on an otherwise valid call.';
  }

  const err = new Error(`Azure ${what} failed (HTTP ${res.status})${hint}\n${detail}`);
  err.status = res.status;
  err.azure = true;
  return err;
}

/* ------------------------------- voices ------------------------------- */

/** Every prebuilt neural voice the region offers. Needs no approval. */
export async function listPrebuiltVoices(creds) {
  const c = requireCreds(creds, 'voice list');
  const res = await fetch(`${ttsHost(c.region)}/cognitiveservices/voices/list`, {
    headers: { 'Ocp-Apim-Subscription-Key': c.key, 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw await azureError(res, 'voice list');
  const all = await res.json();
  return all.map((v) => ({
    id: v.ShortName,
    name: v.DisplayName,
    locale: v.Locale,
    localeName: v.LocaleName,
    gender: v.Gender,
    styles: v.StyleList || [],
    wordsPerMinute: Number(v.WordsPerMinute) || null,
    kind: 'prebuilt',
  }));
}

/* -------------------------- personal voice ---------------------------- */

/** Container that consents and cloned voices hang off. Idempotent. */
export async function ensureProject(projectId, creds) {
  const c = requireCreds(creds, 'personalvoice project create');
  const url = `${cvHost(c.region)}/projects/${encodeURIComponent(projectId)}?api-version=${c.apiVersion}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Ocp-Apim-Subscription-Key': c.key,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ description: 'CML narrator personal voices', kind: 'PersonalVoice' }),
  });
  if (!res.ok && res.status !== 409) throw await azureError(res, 'personalvoice project create');
  return projectId;
}

/**
 * Upload the recorded consent statement. Azure will not mint a cloned voice
 * without one - the speaker has to say a fixed sentence naming themselves and
 * the company. A legal gate, not a formality to route around.
 */
export async function createConsent({ consentId, projectId, voiceTalentName, locale, audio }, creds) {
  const c = requireCreds(creds, 'consent create');
  const form = new FormData();
  form.append('projectId', projectId);
  form.append('voiceTalentName', voiceTalentName);
  form.append('companyName', c.companyName);
  form.append('locale', locale);
  form.append('audiodata', new Blob([audio.buffer]), audio.filename);

  const url = `${cvHost(c.region)}/consents/${encodeURIComponent(consentId)}?api-version=${c.apiVersion}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': c.key, 'User-Agent': USER_AGENT },
    body: form,
  });
  if (!res.ok) throw await azureError(res, 'consent create');
  return res.json();
}

/**
 * Create the cloned voice from one or more sample recordings.
 * Returns a speakerProfileId, which is the handle synthesis actually uses.
 */
export async function createPersonalVoice({ personalVoiceId, projectId, consentId, samples }, creds) {
  const c = requireCreds(creds, 'personalvoice create');
  const form = new FormData();
  form.append('projectId', projectId);
  form.append('consentId', consentId);
  for (const s of samples) form.append('audiodata', new Blob([s.buffer]), s.filename);

  const url = `${cvHost(c.region)}/personalvoices/${encodeURIComponent(personalVoiceId)}?api-version=${c.apiVersion}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': c.key, 'User-Agent': USER_AGENT },
    body: form,
  });
  if (!res.ok) throw await azureError(res, 'personalvoice create');
  return res.json();
}

export async function getPersonalVoice(personalVoiceId, creds) {
  const c = requireCreds(creds, 'personalvoice get');
  const url = `${cvHost(c.region)}/personalvoices/${encodeURIComponent(personalVoiceId)}?api-version=${c.apiVersion}`;
  const res = await fetch(url, {
    headers: { 'Ocp-Apim-Subscription-Key': c.key, 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw await azureError(res, 'personalvoice get');
  return res.json();
}

export async function deletePersonalVoice(personalVoiceId, creds) {
  const c = requireCreds(creds, 'personalvoice delete');
  const url = `${cvHost(c.region)}/personalvoices/${encodeURIComponent(personalVoiceId)}?api-version=${c.apiVersion}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Ocp-Apim-Subscription-Key': c.key, 'User-Agent': USER_AGENT },
  });
  if (!res.ok && res.status !== 404) throw await azureError(res, 'personalvoice delete');
}

/** Poll until the clone is usable. Cloning is fast - seconds, not minutes. */
export async function waitForPersonalVoice(personalVoiceId, creds, { timeoutMs = 180000, onTick } = {}) {
  const started = Date.now();
  let delay = 2000;
  for (;;) {
    const v = await getPersonalVoice(personalVoiceId, creds);
    const status = v.status || v.Status;
    onTick?.(status);
    if (status === 'Succeeded') return v;
    if (status === 'Failed') {
      const err = new Error(`Azure rejected the voice sample: ${JSON.stringify(v).slice(0, 400)}`);
      err.status = 422;
      throw err;
    }
    if (Date.now() - started > timeoutMs) {
      const err = new Error(`Voice creation still "${status}" after ${Math.round(timeoutMs / 1000)}s.`);
      err.status = 504;
      throw err;
    }
    await sleep(delay);
    delay = Math.min(delay * 1.5, 8000);
  }
}

/** The exact sentence Azure requires on the consent recording. */
export function consentStatement(name, company) {
  return `I ${name || '[your first and last name]'} am aware that recordings of my voice will be used by ${company || 'Personal use'} to create and use a synthetic version of my voice.`;
}

/* ----------------------------- synthesis ------------------------------ */

/**
 * Synthesize one SSML document to an mp3 buffer.
 *
 * Retries 429 and 5xx with backoff, honouring Retry-After: a 10k-word book is
 * ~35 requests and a throttle mid-book must not lose the whole render.
 */
export async function synthesize(ssml, creds, { attempts = 5, signal } = {}) {
  const c = requireCreds(creds, 'synthesis');
  let lastErr;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let res;
    try {
      res = await fetch(`${ttsHost(c.region)}/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': c.key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': c.outputFormat,
          'User-Agent': USER_AGENT,
        },
        body: ssml,
        signal,
      });
    } catch (netErr) {
      if (signal?.aborted) throw netErr;
      lastErr = netErr;
      await sleep(Math.min(1000 * 2 ** (attempt - 1), 15000));
      continue;
    }

    if (res.ok) return Buffer.from(await res.arrayBuffer());

    const retryable = res.status === 429 || res.status >= 500;
    const err = await azureError(res, 'synthesis');
    if (!retryable || attempt === attempts) throw err;

    lastErr = err;
    const retryAfter = Number(res.headers.get('retry-after'));
    const wait =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(1000 * 2 ** (attempt - 1), 15000);
    await sleep(wait);
  }
  throw lastErr;
}

export { escapeXml } from './xml.js';
