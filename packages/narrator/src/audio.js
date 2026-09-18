import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';

/* ------------------------------------------------------------------ *
 * All audio assembly is local. ffmpeg ships with the app (ffmpeg-static),
 * so there is nothing to install and nothing else to upload.
 * ------------------------------------------------------------------ */

export function ffmpegBinary() {
  return ffmpegPath;
}

export function runFfmpeg(args, { timeoutMs = 15 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ['-hide_banner', '-nostdin', ...args], {
      windowsHide: true,
    });
    let stderr = '';
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
      if (stderr.length > 200000) stderr = stderr.slice(-100000);
    });
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error(`ffmpeg timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    proc.on('error', (e) => {
      clearTimeout(timer);
      reject(new Error(`ffmpeg could not start: ${e.message}`));
    });
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stderr);
      else reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-2000)}`));
    });
  });
}

/** Duration in seconds, read from ffmpeg's own probe output (no ffprobe needed). */
export async function durationSeconds(file) {
  let stderr = '';
  try {
    stderr = await runFfmpeg(['-i', file, '-f', 'null', '-'], { timeoutMs: 120000 });
  } catch (e) {
    stderr = e.message;
  }
  const matches = [...stderr.matchAll(/time=(\d+):(\d+):(\d+(?:\.\d+)?)/g)];
  if (matches.length) {
    const m = matches[matches.length - 1];
    return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  }
  const d = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderr);
  if (d) return Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]);
  return 0;
}

/** The concat demuxer wants forward slashes and escaped quotes, on every OS. */
function concatLine(file) {
  const p = file.replace(/\\/g, '/').replace(/'/g, "'\\''");
  return `file '${p}'`;
}

async function writeConcatList(files, listPath) {
  await fs.writeFile(listPath, files.map(concatLine).join('\n') + '\n', 'utf8');
  return listPath;
}

/**
 * Join mp3s without re-encoding. Every chunk came back from Azure with the
 * same codec parameters, so a stream copy is both lossless and instant.
 */
export async function concatMp3(files, outFile, { workDir } = {}) {
  if (!files.length) throw new Error('concatMp3: no input files');
  const dir = workDir || path.dirname(outFile);
  await fs.mkdir(dir, { recursive: true });
  const listPath = path.join(dir, `concat-${path.basename(outFile)}.txt`);
  await writeConcatList(files, listPath);
  await runFfmpeg([
    '-f', 'concat', '-safe', '0', '-i', listPath,
    '-c', 'copy', '-y', outFile,
  ]);
  await fs.rm(listPath, { force: true });
  return outFile;
}

/** A beat of silence to sit between chapters, encoded to match the chunks. */
export async function makeSilence(outFile, seconds = 1.2) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await runFfmpeg([
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=mono:sample_rate=24000',
    '-t', String(seconds), '-c:a', 'libmp3lame', '-b:a', '160k', '-ar', '24000', '-ac', '1',
    '-y', outFile,
  ]);
  return outFile;
}

function ffmetaEscape(s) {
  return String(s).replace(/([=;#\\\n])/g, '\\$1');
}

/**
 * Build an .m4b audiobook with real chapter markers, so a player can skip
 * between chapters instead of treating 80 minutes as one track.
 */
export async function buildM4b({ chapterFiles, chapters, outFile, meta = {}, workDir }) {
  const dir = workDir || path.dirname(outFile);
  await fs.mkdir(dir, { recursive: true });

  const durations = [];
  for (const f of chapterFiles) durations.push(await durationSeconds(f));

  const lines = [';FFMETADATA1'];
  if (meta.title) lines.push(`title=${ffmetaEscape(meta.title)}`);
  if (meta.artist) lines.push(`artist=${ffmetaEscape(meta.artist)}`);
  if (meta.album) lines.push(`album=${ffmetaEscape(meta.album)}`);
  lines.push('genre=Audiobook');

  let cursorMs = 0;
  durations.forEach((secs, i) => {
    const startMs = Math.round(cursorMs);
    const endMs = Math.round(cursorMs + secs * 1000);
    lines.push('', '[CHAPTER]', 'TIMEBASE=1/1000', `START=${startMs}`, `END=${endMs}`,
      `title=${ffmetaEscape(chapters[i]?.title || `Chapter ${i + 1}`)}`);
    cursorMs = endMs;
  });

  const metaPath = path.join(dir, 'chapters.ffmeta');
  await fs.writeFile(metaPath, lines.join('\n') + '\n', 'utf8');

  const listPath = path.join(dir, 'concat-m4b.txt');
  await writeConcatList(chapterFiles, listPath);

  await runFfmpeg([
    '-f', 'concat', '-safe', '0', '-i', listPath,
    '-i', metaPath,
    '-map', '0:a', '-map_metadata', '1',
    '-c:a', 'aac', '-b:a', '64k', '-ar', '24000', '-ac', '1',
    '-movflags', '+faststart', '-f', 'mp4',
    '-y', outFile,
  ]);

  await fs.rm(listPath, { force: true });
  return { outFile, durations, totalSeconds: cursorMs / 1000 };
}

/**
 * Azure wants a clean mono 16 kHz PCM wav for voice samples. Users upload
 * m4a/mp3/whatever their phone recorded, so normalise before it goes up.
 */
export async function toConsentWav(inFile, outFile) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await runFfmpeg([
    '-i', inFile,
    '-ac', '1', '-ar', '16000', '-sample_fmt', 's16',
    '-y', outFile,
  ], { timeoutMs: 300000 });
  return outFile;
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m ${String(sec).padStart(2, '0')}s`
    : `${m}m ${String(sec).padStart(2, '0')}s`;
}
