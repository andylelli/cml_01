const $ = (id) => document.getElementById(id);
const state = { status: null, voices: { personal: [], prebuilt: [] }, plan: null, cast: [], source: null, pollTimer: null };

async function api(url, opts = {}) {
  const res = await fetch(url, opts);
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(body?.error || (typeof body === 'string' ? body : 'Request failed'));
  return body;
}

const fmt = (n) => Number(n).toLocaleString('en-GB');
const show = (el, on) => el.classList.toggle('hidden', !on);

/* ------------------------------- tabs ------------------------------- */

document.querySelectorAll('nav button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('nav button').forEach((x) => x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    $(`tab-${b.dataset.tab}`).classList.add('active');
    if (b.dataset.tab === 'library') refreshJobs();
  };
});

/* ------------------------------ status ------------------------------ */

async function loadStatus() {
  try {
    const s = await api('/api/status');
    state.status = s;
    $('statusPills').innerHTML = [
      `<span class="pill ${s.configured ? 'ok' : 'bad'}">${s.configured ? 'Azure key set' : 'no Azure key'}</span>`,
      `<span class="pill">${s.region}</span>`,
      `<span class="pill ${s.ffmpeg.ok ? 'ok' : 'bad'}">ffmpeg ${s.ffmpeg.ok ? 'ready' : 'missing'}</span>`,
    ].join(' ');
    show($('notConfigured'), !s.configured);
  } catch (e) {
    $('statusPills').innerHTML = `<span class="pill bad">server error</span>`;
  }
}

/* ------------------------------ voices ------------------------------ */

async function loadConsentStatement() {
  const name = $('pvName').value.trim();
  const { statement } = await api(`/api/consent-statement?name=${encodeURIComponent(name)}`);
  $('consentText').textContent = statement;
}

async function loadVoices() {
  try {
    const v = await api('/api/voices');
    state.voices = v;
    renderVoiceList();
    renderVoicePicker();
    if (v.prebuiltError) {
      $('prebuiltNote').innerHTML = `<div class="note" style="margin-top:12px">Could not list prebuilt voices: ${escapeHtml(v.prebuiltError)}</div>`;
    } else {
      $('prebuiltNote').innerHTML = `<p class="faint" style="margin-top:10px">${v.prebuilt.length} prebuilt neural voices available in this region.</p>`;
    }
  } catch (e) {
    $('voiceList').innerHTML = `<div class="note err">${escapeHtml(e.message)}</div>`;
  }
}

function renderVoiceList() {
  const { personal } = state.voices;
  if (!personal.length) {
    $('voiceList').innerHTML = `<div class="muted">No cloned voices yet. Create one below, or use a prebuilt voice on the Narrate tab.</div>`;
    return;
  }
  $('voiceList').innerHTML = personal.map((v) => `
    <div class="voice">
      <div style="flex:1">
        <div class="nm">${escapeHtml(v.label)}</div>
        <div class="meta">cloned · ${escapeHtml(v.locale)} · ${escapeHtml(v.baseModel || '')} · created ${new Date(v.createdAt).toLocaleDateString('en-GB')}</div>
      </div>
      <button class="btn danger small" data-del="${escapeHtml(v.id)}">Delete</button>
    </div>`).join('');

  $('voiceList').querySelectorAll('[data-del]').forEach((b) => {
    b.onclick = async () => {
      if (!confirm('Delete this cloned voice from Azure and from this app? This cannot be undone.')) return;
      b.disabled = true;
      try {
        await api(`/api/voices/${b.dataset.del}`, { method: 'DELETE' });
        await loadVoices();
      } catch (e) {
        alert(e.message);
        b.disabled = false;
      }
    };
  });
}

$('pvName').addEventListener('input', debounce(loadConsentStatement, 250));

$('copyStatement').onclick = async () => {
  await navigator.clipboard.writeText($('consentText').textContent);
  $('copyStatement').textContent = 'Copied';
  setTimeout(() => ($('copyStatement').textContent = 'Copy sentence'), 1400);
};

$('createVoice').onclick = async () => {
  const btn = $('createVoice');
  const err = $('createVoiceError');
  show(err, false);

  const fd = new FormData();
  fd.append('name', $('pvName').value.trim());
  fd.append('locale', $('pvLocale').value);
  const consent = $('pvConsent').files[0];
  const samples = [...$('pvSample').files];
  if (consent) fd.append('consent', consent);
  for (const s of samples) fd.append('sample', s);

  btn.disabled = true;
  $('createVoiceStatus').innerHTML = '<span class="spin"></span> uploading and training — usually under a minute';
  try {
    const { voice } = await api('/api/voices/personal', { method: 'POST', body: fd });
    $('createVoiceStatus').textContent = `Created "${voice.label}".`;
    $('pvConsent').value = '';
    $('pvSample').value = '';
    await loadVoices();
  } catch (e) {
    $('createVoiceStatus').textContent = '';
    err.innerHTML = escapeHtml(e.message).replace(/\n/g, '<br>');
    show(err, true);
  } finally {
    btn.disabled = false;
  }
};

/* ------------------------------ stories ----------------------------- */

async function loadStories() {
  try {
    const s = await api('/api/stories');
    if (!s.available || !s.stories.length) {
      $('storyPick').innerHTML = '<option value="">No stories found</option>';
      $('sourceHint').textContent = 'No stories/ folder found — use upload or paste.';
      return;
    }
    $('storyPick').innerHTML = s.stories
      .map((x) => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.title)} — ${fmt(x.words)} words</option>`)
      .join('');
    $('sourceHint').textContent = `${s.total} found`;
  } catch (e) {
    $('storyPick').innerHTML = '<option value="">Error loading</option>';
  }
}

$('optFrontMatter').onchange = () => { if (state.plan) $('analyseBtn').click(); };

$('sourceMode').onchange = () => {
  const m = $('sourceMode').value;
  show($('srcRepo'), m === 'repo');
  show($('srcUpload'), m === 'upload');
  show($('srcPaste'), m === 'paste');
};

/* ------------------------------- plan ------------------------------- */

function buildSourceForm() {
  const mode = $('sourceMode').value;
  const fd = new FormData();
  const voice = currentVoice();
  fd.append('voiceKind', voice?.kind || 'prebuilt');
  fd.append('skipFrontMatter', $('optFrontMatter').checked ? 'true' : 'false');
  if (mode === 'repo') {
    if (!$('storyPick').value) throw new Error('Pick a story.');
    fd.append('storyId', $('storyPick').value);
  } else if (mode === 'upload') {
    if (!$('storyFile').files[0]) throw new Error('Choose a file.');
    fd.append('file', $('storyFile').files[0]);
  } else {
    if (!$('storyText').value.trim()) throw new Error('Paste some text.');
    fd.append('text', $('storyText').value);
  }
  return fd;
}

$('analyseBtn').onclick = async () => {
  $('analyseStatus').innerHTML = '<span class="spin"></span>';
  try {
    const fd = buildSourceForm();
    const plan = await api('/api/plan', { method: 'POST', body: fd });
    state.plan = plan;
    renderPlan(plan);
    loadCast();
    $('analyseStatus').textContent = '';
    $('renderBtn').disabled = !state.status?.configured;
    $('renderStatus').textContent = state.status?.configured ? '' : 'Set your Azure key first.';
  } catch (e) {
    $('analyseStatus').textContent = '';
    alert(e.message);
  }
};

function renderPlan(plan) {
  show($('planCard'), true);
  $('planTitle').textContent = plan.title || 'Plan';
  const t = plan.totals;
  $('planStats').innerHTML = [
    ['words', fmt(t.words)],
    ['characters', fmt(t.chars)],
    ['chapters', fmt(t.chapters)],
    ['azure requests', fmt(t.chunks)],
    ['est. runtime', `${t.estimatedMinutes} min`],
  ].map(([l, n]) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');

  $('planTable').innerHTML =
    '<tr><th>Chapter</th><th>Words</th><th>Chars</th><th>Requests</th></tr>' +
    plan.chapters.map((c) => {
      const label = c.isFrontMatter
        ? `${escapeHtml(c.title)} <span class="faint">front matter${c.skipped ? ' — skipped' : ''}</span>`
        : escapeHtml(c.title);
      const dim = c.skipped ? ' style="opacity:0.45"' : '';
      return `<tr${dim}><td>${label}</td><td>${fmt(c.words)}</td><td>${fmt(c.chars)}</td><td>${c.skipped ? '—' : c.chunks}</td></tr>`;
    }).join('');

  updateCost();
}

function updateCost() {
  if (!state.plan || !state.status) return show($('costNote'), false);
  const voice = currentVoice();
  const kind = voice?.kind || 'prebuilt';
  const rate = kind === 'personal' ? state.status.pricing.personal : state.status.pricing.neural;
  const chars = state.plan.totals.chars;
  const usd = (chars / 1e6) * rate;
  const gbp = usd * state.status.pricing.usdToGbp;
  $('costNote').innerHTML =
    `<strong>Estimated Azure cost: $${usd.toFixed(2)} (about £${gbp.toFixed(2)})</strong> — ` +
    `${fmt(chars)} characters at $${rate}/million for a ${kind === 'personal' ? 'cloned' : 'prebuilt neural'} voice. ` +
    `Chunks are cached, so a re-render of the same text and voice costs nothing.`;
  show($('costNote'), true);
}

/* ------------------------------- cast ------------------------------- */

/** "Fairweather = Fair-wether" lines -> { Fairweather: "Fair-wether" }. */
function parseLexicon() {
  const out = {};
  for (const line of ($('lexicon').value || '').split('\n')) {
    const m = /^\s*([^=]+?)\s*=\s*(.+?)\s*$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function collectOptions(voice) {
  return {
    locale: voice?.locale || 'en-GB',
    rate: $('ratePick').value,
    pitch: $('pitchPick').value,
    style: $('stylePick').value,
    paragraphPauseMs: Number($('pausePick').value),
    scenePauseMs: Number($('scenePick').value),
    readChapterTitles: $('optTitles').checked,
    skipFrontMatter: $('optFrontMatter').checked,
    emphasis: $('optEmphasis').checked,
    multiVoice: $('optMultiVoice').checked,
    lexicon: parseLexicon(),
    characterVoices: collectCharacterVoices(),
  };
}

function collectCharacterVoices() {
  if (!$('optMultiVoice').checked) return [];
  return (state.cast || [])
    .map((c, i) => {
      const sel = $(`castVoice${i}`);
      const val = sel?.value;
      if (!val) return null;
      const [kind, id] = val.split('::');
      const voice =
        kind === 'personal'
          ? state.voices.personal.find((v) => v.id === id)
          : state.voices.prebuilt.find((v) => v.id === id);
      return voice ? { name: c.name, aliases: c.aliases || [], voice } : null;
    })
    .filter(Boolean);
}

async function loadCast() {
  try {
    const fd = buildSourceForm();
    const { cast, dialogueLines } = await api('/api/cast', { method: 'POST', body: fd });
    state.cast = cast;
    renderCast(cast, dialogueLines);
  } catch {
    show($('castCard'), false);
  }
}

function voiceOptionsHtml(selectedId) {
  const { personal, prebuilt } = state.voices;
  const en = prebuilt.filter((v) => v.locale.startsWith('en'));
  const opt = (v, kind) =>
    `<option value="${kind}::${escapeHtml(v.id)}"${v.id === selectedId ? ' selected' : ''}>` +
    `${escapeHtml(v.label || v.name)}${kind === 'prebuilt' ? ` — ${escapeHtml(v.gender)}` : ''}</option>`;
  return (
    '<option value="">— narrator voice —</option>' +
    (personal.length ? `<optgroup label="Cloned">${personal.map((v) => opt(v, 'personal')).join('')}</optgroup>` : '') +
    `<optgroup label="English neural">${en.map((v) => opt(v, 'prebuilt')).join('')}</optgroup>`
  );
}

function renderCast(cast, dialogueLines) {
  if (!cast.length) {
    show($('castCard'), false);
    return;
  }
  show($('castCard'), true);

  // Spread distinct default voices across the cast so the first render is
  // already differentiated rather than everyone sharing one voice.
  const pool = state.voices.prebuilt.filter((v) => v.locale.startsWith('en'));
  $('castList').innerHTML = cast
    .map((c, i) => {
      const suggested = pool.length ? pool[(i + 1) % pool.length].id : '';
      return `<div class="voice">
        <div style="flex:1">
          <div class="nm">${escapeHtml(c.name)}</div>
          <div class="meta">${fmt(c.lines)} spoken lines${c.aliases?.length ? ` · also called ${escapeHtml(c.aliases.join(', '))}` : ''}</div>
        </div>
        <select id="castVoice${i}" style="max-width:260px">${voiceOptionsHtml(suggested)}</select>
      </div>`;
    })
    .join('');

  $('castNote').textContent =
    `${cast.length} speakers, ${fmt(dialogueLines)} lines of dialogue. Unattributed speech falls back to the narrator voice.`;
  updateCastEnabled();
}

function updateCastEnabled() {
  const on = $('optMultiVoice').checked;
  $('castList').style.opacity = on ? '1' : '0.45';
  $('castList').querySelectorAll('select').forEach((s) => (s.disabled = !on));
}
$('optMultiVoice').onchange = updateCastEnabled;

/* ----------------------------- audition ----------------------------- */

$('auditionBtn').onclick = async () => {
  const btn = $('auditionBtn');
  const voice = currentVoice();
  if (!voice) return alert('Pick a voice first.');
  if (!state.status?.configured) return alert('Set your Azure key first.');

  const body = { voices: [{ id: voice.id, kind: voice.kind, label: voice.label || voice.name, locale: voice.locale }] };
  if ($('sourceMode').value === 'repo' && $('storyPick').value) body.storyId = $('storyPick').value;
  else if ($('sourceMode').value === 'paste') body.text = $('storyText').value.slice(0, 700);
  body.options = collectOptions(voice);

  btn.disabled = true;
  $('auditionOut').innerHTML = '<span class="spin"></span> <span class="muted">rendering sample…</span>';
  try {
    const r = await api('/api/audition', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    $('auditionOut').innerHTML = r.results
      .map((x) =>
        x.error
          ? `<div class="note err">${escapeHtml(x.label || '')}: ${escapeHtml(x.error)}</div>`
          : `<div style="margin-bottom:8px"><div class="muted">${escapeHtml(x.label)} — ${fmt(x.chars)} chars</div><audio controls src="${x.url}"></audio></div>`
      )
      .join('');
  } catch (e) {
    $('auditionOut').innerHTML = `<div class="note err">${escapeHtml(e.message)}</div>`;
  } finally {
    btn.disabled = false;
  }
};

/* ------------------------------ render ------------------------------ */

function currentVoice() {
  const val = $('voicePick').value;
  if (!val) return null;
  const [kind, id] = val.split('::');
  if (kind === 'personal') return state.voices.personal.find((v) => v.id === id) || null;
  return state.voices.prebuilt.find((v) => v.id === id) || null;
}

function renderVoicePicker() {
  const { personal, prebuilt } = state.voices;
  const groups = [];
  if (personal.length) {
    groups.push(`<optgroup label="Your cloned voices">${personal
      .map((v) => `<option value="personal::${escapeHtml(v.id)}">${escapeHtml(v.label)}</option>`).join('')}</optgroup>`);
  }
  // English first - this is a Golden Age mystery pipeline, not a translator.
  const en = prebuilt.filter((v) => v.locale.startsWith('en'));
  const rest = prebuilt.filter((v) => !v.locale.startsWith('en'));
  const opt = (v) => `<option value="prebuilt::${escapeHtml(v.id)}">${escapeHtml(v.name)} — ${escapeHtml(v.localeName)} (${escapeHtml(v.gender)})</option>`;
  if (en.length) groups.push(`<optgroup label="English neural voices">${en.map(opt).join('')}</optgroup>`);
  if (rest.length) groups.push(`<optgroup label="Other languages">${rest.map(opt).join('')}</optgroup>`);

  $('voicePick').innerHTML = groups.join('') || '<option value="">No voices available</option>';
  const preferred = [...en].find((v) => /RyanNeural|SoniaNeural/.test(v.id));
  if (!personal.length && preferred) $('voicePick').value = `prebuilt::${preferred.id}`;
  onVoiceChange();
}

function onVoiceChange() {
  const v = currentVoice();
  const styles = v?.styles || [];
  $('stylePick').innerHTML =
    '<option value="">Default</option>' + styles.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  $('stylePick').disabled = !styles.length;
  updateCost();
}
$('voicePick').onchange = onVoiceChange;

$('renderBtn').onclick = async () => {
  const btn = $('renderBtn');
  show($('renderError'), false);
  const voice = currentVoice();
  if (!voice) return alert('Pick a voice.');

  try {
    const fd = buildSourceForm();
    fd.append('voiceId', voice.id);
    fd.append('voiceKind', voice.kind);
    fd.append('voiceLabel', voice.label || voice.name || voice.id);
    fd.append('locale', voice.locale || 'en-GB');
    fd.append('options', JSON.stringify(collectOptions(voice)));

    btn.disabled = true;
    $('renderStatus').innerHTML = '<span class="spin"></span> starting…';
    const { job } = await api('/api/jobs', { method: 'POST', body: fd });
    $('renderStatus').textContent = '';
    document.querySelector('nav button[data-tab="library"]').click();
    refreshJobs();
  } catch (e) {
    $('renderStatus').textContent = '';
    $('renderError').innerHTML = escapeHtml(e.message).replace(/\n/g, '<br>');
    show($('renderError'), true);
  } finally {
    btn.disabled = false;
  }
};

/* ------------------------------ library ----------------------------- */

async function refreshJobs() {
  let jobs;
  try {
    ({ jobs } = await api('/api/jobs'));
  } catch {
    return;
  }

  if (!jobs.length) {
    $('jobList').innerHTML = '<div class="muted">Nothing rendered yet.</div>';
  } else {
    $('jobList').innerHTML = jobs.map(renderJob).join('');
    $('jobList').querySelectorAll('[data-act]').forEach((b) => {
      b.onclick = async () => {
        const { act, id } = b.dataset;
        if (act === 'delete' && !confirm('Delete this render and its audio files?')) return;
        b.disabled = true;
        try {
          if (act === 'delete') await api(`/api/jobs/${id}`, { method: 'DELETE' });
          else await api(`/api/jobs/${id}/${act}`, { method: 'POST' });
        } catch (e) {
          alert(e.message);
        }
        refreshJobs();
      };
    });
  }

  const active = jobs.some((j) => ['queued', 'running', 'assembling'].includes(j.status));
  clearTimeout(state.pollTimer);
  if (active) state.pollTimer = setTimeout(refreshJobs, 1500);
}

function renderJob(j) {
  const pct = j.progress?.total ? Math.round((j.progress.done / j.progress.total) * 100) : 0;
  const active = ['queued', 'running', 'assembling'].includes(j.status);

  let body = '';
  if (active) {
    body = `
      <div class="bar-track" style="margin-top:10px"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="row" style="margin-top:7px">
        <span class="muted">${j.status === 'assembling' ? 'Stitching chapters…' : `${j.progress.done} / ${j.progress.total} chunks · ${pct}%`}</span>
        ${j.progress?.cachedHits ? `<span class="faint">${j.progress.cachedHits} from cache</span>` : ''}
        <div class="spacer"></div>
        <button class="btn ghost small" data-act="cancel" data-id="${j.id}">Cancel</button>
      </div>`;
  } else if (j.status === 'done') {
    const mp3 = j.outputs?.mp3;
    body = `
      ${mp3 ? `<audio controls preload="none" src="/api/jobs/${j.id}/file/${encodeURIComponent(mp3)}"></audio>` : ''}
      <div class="row" style="margin-top:9px">
        ${mp3 ? `<a class="btn small" href="/api/jobs/${j.id}/file/${encodeURIComponent(mp3)}">Download MP3</a>` : ''}
        ${j.outputs?.m4b ? `<a class="btn ghost small" href="/api/jobs/${j.id}/file/${encodeURIComponent(j.outputs.m4b)}">Download M4B</a>` : ''}
        <span class="faint">${j.outputs?.chapters?.length || 0} chapters${j.durationLabel ? ` · ${j.durationLabel}` : ''}</span>
        <div class="spacer"></div>
        <button class="btn danger small" data-act="delete" data-id="${j.id}">Delete</button>
      </div>`;
  } else {
    body = `
      <div class="note err" style="margin-top:10px">${escapeHtml(j.error || 'Stopped')}</div>
      <div class="row" style="margin-top:9px">
        <button class="btn small" data-act="retry" data-id="${j.id}">Resume</button>
        <span class="faint">Completed chunks are cached — resuming does not pay for them twice.</span>
        <div class="spacer"></div>
        <button class="btn danger small" data-act="delete" data-id="${j.id}">Delete</button>
      </div>`;
  }

  return `<div class="job">
    <div class="hd">
      <span class="ti">${escapeHtml(j.title)}</span>
      <span class="st ${j.status}">${j.status}</span>
      <span class="faint">${escapeHtml(j.voice?.label || '')} · ${fmt(j.totals?.words || 0)} words</span>
    </div>
    ${body}
  </div>`;
}

/* ------------------------------- utils ------------------------------ */

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* -------------------------------- init ------------------------------ */

(async function init() {
  await loadStatus();
  await Promise.all([loadVoices(), loadStories(), loadConsentStatement()]);
  refreshJobs();
})();
