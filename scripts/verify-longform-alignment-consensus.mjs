#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  ALIGNMENT_STATUS,
  WORD_TIMING_STATUS,
  alignmentCacheDir,
  getVersion,
  nonEmptyFile,
  normalizeToken,
  packagePath,
  percentile,
  phraseMatch,
  posix,
  readJson,
  requirePackage,
  run,
  runtimeWavPath,
  sha256,
  writeJson,
} from './lib/longform-sync.mjs';

const fail = async (root, message, payload = null) => {
  if (payload && root) await writeJson(packagePath(root, '06-projektdateien', 'ALIGNMENT-QUALITY.json'), payload);
  console.error(`LONGFORM ALIGNMENT CONSENSUS FAILED: ${message}`);
  process.exit(1);
};

let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { await fail(null, error.message); }

let version;
try { ({version} = await getVersion(root)); }
catch (error) { await fail(root, error.message); }
const wordsPath = packagePath(root, '01-script-audio', 'WORD-TIMINGS.json');
const transcriptPath = packagePath(root, '01-script-audio', 'VOICEOVER.txt');
const planPath = packagePath(root, '06-projektdateien', 'CHOREOGRAPHY-PLAN.json');
for (const file of [wordsPath, transcriptPath, planPath]) if (!nonEmptyFile(file)) await fail(root, `required file missing/empty: ${posix(file)}`);

const primaryDoc = await readJson(wordsPath);
const plan = await readJson(planPath);
if (primaryDoc?.status !== WORD_TIMING_STATUS) await fail(root, `WORD-TIMINGS.status must be ${WORD_TIMING_STATUS}.`);
const primary = Array.isArray(primaryDoc?.words) ? primaryDoc.words : [];
if (!primary.length) await fail(root, 'WORD-TIMINGS has no words.');
const primaryBackend = String(primaryDoc?.backend || 'unknown');
if (primaryBackend === 'ctc-german') {
  await fail(root, 'strict independent consensus requires a primary backend different from ctc-german. Use --backend=mlx-qwen3 for the primary alignment.');
}

const runtime = runtimeWavPath(version);
if (!nonEmptyFile(runtime)) await fail(root, `runtime WAV missing: ${posix(runtime)}. Run primary alignment first.`);
const workDir = alignmentCacheDir(version);
await mkdir(workDir, {recursive: true});
const verifierRawPath = path.join(workDir, 'alignment.verifier-ctc.raw.json');
const verifierCachePath = path.join(workDir, 'alignment.verifier-ctc.cache.json');
const [audioBytes, transcriptBytes, primaryBytes] = await Promise.all([
  readFile(runtime), readFile(transcriptPath), readFile(wordsPath),
]);
const verifierFingerprint = sha256(JSON.stringify({
  version: 1,
  audioSha256: sha256(audioBytes),
  transcriptSha256: sha256(transcriptBytes),
  primaryWordTimingsSha256: sha256(primaryBytes),
  primaryBackend,
  verifierBackend: 'ctc-german',
}));
let cacheHit = false;
if (nonEmptyFile(verifierRawPath) && nonEmptyFile(verifierCachePath)) {
  try {
    const meta = await readJson(verifierCachePath);
    cacheHit = meta?.verifierFingerprint === verifierFingerprint;
  } catch { cacheHit = false; }
}

if (cacheHit) {
  console.log('LONGFORM CTC CONSENSUS CACHE HIT — skipping second model inference.');
} else {
  console.log('LONGFORM CTC CONSENSUS CACHE MISS — running independent verifier.');
  const markerPath = path.resolve('.cache', 'reel-aligner-verifier-ctc.json');
  if (!existsSync(markerPath)) {
    try { run('CTC verifier setup', process.execPath, [path.resolve('ki/scripts/setup-ctc-alignment-verifier.mjs')], {stdio: 'inherit'}); }
    catch (error) { await fail(root, error.message); }
  }
  const marker = await readJson(markerPath);
  const python = path.resolve(String(marker?.python || ''));
  if (!existsSync(python)) await fail(root, `CTC verifier python missing: ${python}`);
  try {
    run('independent CTC longform alignment', python, [
      path.resolve('ki/scripts/python/align_words.py'),
      '--audio', runtime,
      '--text-file', transcriptPath,
      '--output', verifierRawPath,
      '--backend', 'ctc-german',
    ], {stdio: 'inherit'});
  } catch (error) { await fail(root, error.message); }
  await writeJson(verifierCachePath, {
    version: 1,
    status: 'CTC_VERIFIER_ALIGNMENT_CACHED',
    verifierFingerprint,
    primaryBackend,
    verifierBackend: 'ctc-german',
    audioSha256: sha256(audioBytes),
    transcriptSha256: sha256(transcriptBytes),
    primaryWordTimingsSha256: sha256(primaryBytes),
  });
}

const verifierDoc = await readJson(verifierRawPath);
const verifier = Array.isArray(verifierDoc?.words) ? verifierDoc.words : [];
if (verifier.length !== primary.length) await fail(root, `word count mismatch primary=${primary.length}, verifier=${verifier.length}.`);

const paired = [];
for (let index = 0; index < primary.length; index++) {
  const a = primary[index]; const b = verifier[index];
  if (normalizeToken(a.text) !== normalizeToken(b.text)) await fail(root, `word ${index + 1} mismatch: primary="${a.text}" verifier="${b.text}".`);
  const values = [Number(a.startSeconds), Number(a.endSeconds), Number(b.start), Number(b.end)];
  if (!values.every(Number.isFinite)) await fail(root, `word ${index + 1} has invalid timestamps.`);
  paired.push({
    index,
    text: String(a.text),
    sentenceId: String(a.sentenceId),
    chapterId: String(a.chapterId),
    startDeltaMs: Math.abs(values[0] - values[2]) * 1000,
    endDeltaMs: Math.abs(values[1] - values[3]) * 1000,
  });
}

const wordsBySentence = new Map();
for (let index = 0; index < primary.length; index++) {
  const sid = String(primary[index].sentenceId || '');
  const row = wordsBySentence.get(sid) || [];
  row.push({...primary[index], _index: index});
  wordsBySentence.set(sid, row);
}
const resolveAnchorWord = (beat, anchor) => {
  const row = wordsBySentence.get(String(beat?.sentenceId || '')) || [];
  if (!row.length) throw new Error(`${beat?.id || '?'}: sentence ${beat?.sentenceId || '?'} has no aligned words.`);
  if (anchor?.type === 'SENTENCE_START') return {index: row[0]._index, edge: 'start'};
  if (anchor?.type === 'SENTENCE_END') return {index: row[row.length - 1]._index, edge: 'end'};
  if (anchor?.type === 'PHRASE_START' || anchor?.type === 'PHRASE_END') {
    const match = phraseMatch(row, anchor?.phrase);
    if (!match) throw new Error(`${beat?.id || '?'}: exact anchor phrase missing: "${anchor?.phrase || ''}".`);
    return anchor.type === 'PHRASE_START'
      ? {index: match.first._index, edge: 'start'}
      : {index: match.last._index, edge: 'end'};
  }
  throw new Error(`${beat?.id || '?'}: unsupported speech anchor ${anchor?.type || 'missing'}.`);
};

const anchorChecks = [];
try {
  for (const beat of Array.isArray(plan?.beats) ? plan.beats : []) {
    for (const [name, anchor] of [['speechStart', beat?.speech?.start], ['speechEnd', beat?.speech?.end]]) {
      const resolved = resolveAnchorWord(beat, anchor);
      const pair = paired[resolved.index];
      const deltaMs = resolved.edge === 'end' ? pair.endDeltaMs : pair.startDeltaMs;
      anchorChecks.push({
        beatId: String(beat.id),
        anchor: name,
        sentenceId: String(beat.sentenceId),
        edge: resolved.edge,
        word: pair.text,
        deltaMs: Number(deltaMs.toFixed(2)),
      });
    }
  }
} catch (error) { await fail(root, error.message); }
if (!anchorChecks.length) await fail(root, 'CHOREOGRAPHY-PLAN has no speech anchors to verify.');

const starts = paired.map((row) => row.startDeltaMs);
const ends = paired.map((row) => row.endDeltaMs);
const rules = plan?.rules?.alignmentConsensus || {};
const thresholds = {
  medianStartDeltaMs: Number(rules.medianStartDeltaMs ?? 100),
  p95StartDeltaMs: Number(rules.p95StartDeltaMs ?? 220),
  maxAnchorDeltaMs: Number(rules.maxAnchorDeltaMs ?? 220),
  maxAnyWordDeltaMs: Number(rules.maxAnyWordDeltaMs ?? 450),
};
const metrics = {
  medianStartDeltaMs: Number(percentile(starts, 0.5).toFixed(2)),
  p95StartDeltaMs: Number(percentile(starts, 0.95).toFixed(2)),
  p95EndDeltaMs: Number(percentile(ends, 0.95).toFixed(2)),
  maxAnyWordDeltaMs: Number(Math.max(...starts, ...ends).toFixed(2)),
  maxAnchorDeltaMs: Number(Math.max(...anchorChecks.map((row) => row.deltaMs)).toFixed(2)),
};
const violations = [];
if (metrics.medianStartDeltaMs > thresholds.medianStartDeltaMs) violations.push(`median start delta ${metrics.medianStartDeltaMs}ms > ${thresholds.medianStartDeltaMs}ms`);
if (metrics.p95StartDeltaMs > thresholds.p95StartDeltaMs) violations.push(`p95 start delta ${metrics.p95StartDeltaMs}ms > ${thresholds.p95StartDeltaMs}ms`);
if (metrics.maxAnchorDeltaMs > thresholds.maxAnchorDeltaMs) violations.push(`max planned-anchor delta ${metrics.maxAnchorDeltaMs}ms > ${thresholds.maxAnchorDeltaMs}ms`);
if (metrics.maxAnyWordDeltaMs > thresholds.maxAnyWordDeltaMs) violations.push(`max word-edge delta ${metrics.maxAnyWordDeltaMs}ms > ${thresholds.maxAnyWordDeltaMs}ms`);

const payload = {
  version: 1,
  status: violations.length ? 'ALIGNMENT_CONSENSUS_FAILED' : ALIGNMENT_STATUS,
  generatedAt: new Date().toISOString(),
  authority: '01-script-audio/WORD-TIMINGS.json',
  wordTimingsSha256: sha256(primaryBytes),
  verifierFingerprint,
  cacheHit,
  primary: {backend: primaryBackend, model: primaryDoc?.model || null},
  verifier: {backend: 'ctc-german', model: verifierDoc?.model || null},
  wordCount: primary.length,
  plannedAnchorCount: anchorChecks.length,
  thresholds,
  metrics,
  worstAnchors: [...anchorChecks].sort((a, b) => b.deltaMs - a.deltaMs).slice(0, 20),
  violations,
};
await writeJson(packagePath(root, '06-projektdateien', 'ALIGNMENT-QUALITY.json'), payload);
if (violations.length) await fail(root, violations.join('; '), payload);

console.log('LONGFORM ALIGNMENT CONSENSUS PASSED');
console.log(`primary: ${payload.primary.backend}`);
console.log(`verifier: ${payload.verifier.backend}`);
console.log(`cache: ${cacheHit ? 'HIT' : 'MISS'}`);
console.log(`median start delta: ${metrics.medianStartDeltaMs} ms`);
console.log(`p95 start delta: ${metrics.p95StartDeltaMs} ms`);
console.log(`max choreography-anchor delta: ${metrics.maxAnchorDeltaMs} ms`);
