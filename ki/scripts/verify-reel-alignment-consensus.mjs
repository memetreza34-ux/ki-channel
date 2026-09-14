#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {runtimeAudioPath, safeCompositionId} from './lib/render-provenance.mjs';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/verify-reel-alignment-consensus.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = async (message, payload = null) => {
  if (payload) await writeFile(p('06-projektdateien', 'ALIGNMENT-QUALITY.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.error(`ALIGNMENT CONSENSUS FAILED: ${message}`);
  process.exit(1);
};
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const percentile = (values, q) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[index];
};
const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[^\p{L}\p{N}]+/gu, '').trim();
const phraseTokens = (value) => String(value ?? '').split(/\s+/).map(normalize).filter(Boolean);

const reelPath = p('06-projektdateien', 'reel.json');
const wordsPath = p('01-script-audio', 'WORD-TIMINGS.json');
const scriptPath = p('01-script-audio', 'VOICEOVER-ZUM-KOPIEREN.txt');
const planPath = p('06-projektdateien', 'SYNC-PLAN.json');
for (const file of [reelPath, wordsPath, scriptPath, planPath]) if (!existsSync(file)) await fail(`required file missing: ${file}`);

const reel = await readJson(reelPath);
const primaryDoc = await readJson(wordsPath);
const plan = await readJson(planPath);
const primary = Array.isArray(primaryDoc?.words) ? primaryDoc.words : [];
if (!primary.length) await fail('WORD-TIMINGS.json has no words.');
const primaryBackend = String(primaryDoc?.backend || 'unknown');
if (primaryBackend === 'ctc-german') await fail('independent verifier would equal primary backend. Use auto/mlx-qwen3 on Apple Silicon for strict consensus.');

const compositionId = safeCompositionId(reel?.compositionId);
if (!compositionId) await fail('compositionId missing.');
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(runtimeAudio)) await fail(`runtime audio missing: ${runtimeAudio}`);

const workDir = path.resolve('.cache', 'reel-alignment', compositionId);
await mkdir(workDir, {recursive: true});
const verifierRawPath = path.join(workDir, 'alignment.verifier-ctc.raw.json');
const verifierCachePath = path.join(workDir, 'alignment.verifier-ctc.cache.json');
const [audioBytes, scriptBytes, wordTimingBytes] = await Promise.all([
  readFile(runtimeAudio),
  readFile(scriptPath),
  readFile(wordsPath),
]);
const verifierFingerprint = sha256(JSON.stringify({
  version:2,
  audioSha256:sha256(audioBytes),
  scriptSha256:sha256(scriptBytes),
  primaryWordTimingsSha256:sha256(wordTimingBytes),
  primaryBackend,
  verifierBackend:'ctc-german',
}));
let verifierCacheHit = false;
if (existsSync(verifierRawPath) && existsSync(verifierCachePath)) {
  try {
    const meta = await readJson(verifierCachePath);
    verifierCacheHit = meta?.verifierFingerprint === verifierFingerprint;
  } catch {
    verifierCacheHit = false;
  }
}

const run = (label, command, args, options = {}) => {
  const result = spawnSync(command, args, {encoding: 'utf8', ...options});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) throw new Error(`${label} failed${result.error ? `: ${result.error.message}` : ''}`);
  return result;
};

if (verifierCacheHit) {
  console.log('CTC CONSENSUS CACHE HIT — unchanged audio/script/primary timings; skipping second model inference.');
} else {
  console.log('CTC CONSENSUS CACHE MISS — verifier runs once for this exact alignment.');
  const markerPath = path.resolve('.cache', 'reel-aligner-verifier-ctc.json');
  if (!existsSync(markerPath)) run('CTC verifier setup', process.execPath, [path.resolve('ki/scripts/setup-ctc-alignment-verifier.mjs')], {stdio: 'inherit'});
  const marker = await readJson(markerPath);
  const verifierPython = path.resolve(String(marker?.python || ''));
  if (!existsSync(verifierPython)) await fail(`verifier python missing: ${verifierPython}`);
  try {
    run('CTC independent forced alignment', verifierPython, [
      path.resolve('ki/scripts/python/align_words.py'),
      '--audio', runtimeAudio,
      '--text-file', scriptPath,
      '--output', verifierRawPath,
      '--backend', 'ctc-german',
    ], {stdio: 'inherit'});
  } catch (error) {
    await fail(error.message);
  }
  await writeFile(verifierCachePath, `${JSON.stringify({
    version:2,
    status:'CTC_VERIFIER_ALIGNMENT_CACHED',
    verifierFingerprint,
    audioSha256:sha256(audioBytes),
    scriptSha256:sha256(scriptBytes),
    primaryWordTimingsSha256:sha256(wordTimingBytes),
    primaryBackend,
    verifierBackend:'ctc-german',
  },null,2)}\n`, 'utf8');
}

const verifierDoc = await readJson(verifierRawPath);
const verifier = Array.isArray(verifierDoc?.words) ? verifierDoc.words : [];
if (verifier.length !== primary.length) await fail(`word count mismatch primary=${primary.length}, verifier=${verifier.length}`);

const paired = [];
for (let index = 0; index < primary.length; index++) {
  const a = primary[index];
  const b = verifier[index];
  if (normalize(a.text) !== normalize(b.text)) await fail(`word ${index + 1} mismatch: primary="${a.text}" verifier="${b.text}"`);
  const primaryStart = Number(a.startSeconds);
  const primaryEnd = Number(a.endSeconds);
  const verifierStart = Number(b.start);
  const verifierEnd = Number(b.end);
  if (![primaryStart, primaryEnd, verifierStart, verifierEnd].every(Number.isFinite)) await fail(`word ${index + 1} has invalid timestamps.`);
  paired.push({
    index,
    text: String(a.text),
    sentenceId: String(a.sentenceId),
    sceneId: String(a.sceneId),
    startDeltaMs: Math.abs(primaryStart - verifierStart) * 1000,
    endDeltaMs: Math.abs(primaryEnd - verifierEnd) * 1000,
    primaryStart,
    primaryEnd,
    verifierStart,
    verifierEnd,
  });
}

const startDeltas = paired.map((row) => row.startDeltaMs);
const endDeltas = paired.map((row) => row.endDeltaMs);
const rules = plan?.rules?.alignmentConsensus || {};
const thresholds = {
  medianStartDeltaMs: Number(rules.medianStartDeltaMs ?? 100),
  p95StartDeltaMs: Number(rules.p95StartDeltaMs ?? 220),
  maxAnchorDeltaMs: Number(rules.maxAnchorDeltaMs ?? 220),
  maxAnyWordDeltaMs: Number(rules.maxAnyWordDeltaMs ?? 450),
};

const sentenceIndexes = new Map();
for (const row of paired) {
  const list = sentenceIndexes.get(row.sentenceId) || [];
  list.push(row.index);
  sentenceIndexes.set(row.sentenceId, list);
}
const findPhraseStartIndex = (sentenceId, phrase) => {
  const indexes = sentenceIndexes.get(sentenceId) || [];
  const wanted = phraseTokens(phrase);
  const normalized = indexes.map((index) => normalize(primary[index].text));
  for (let i = 0; i <= normalized.length - wanted.length; i++) {
    let ok = true;
    for (let offset = 0; offset < wanted.length; offset++) if (normalized[i + offset] !== wanted[offset]) { ok = false; break; }
    if (ok) return {first: indexes[i], last: indexes[i + wanted.length - 1]};
  }
  return null;
};

const anchorChecks = [];
for (const event of Array.isArray(plan?.events) ? plan.events : []) {
  const sentenceId = String(event?.sentenceId || '');
  const indexes = sentenceIndexes.get(sentenceId) || [];
  if (!indexes.length) await fail(`${event.id}: sentence has no aligned words.`);
  let pairIndex;
  let edge = 'start';
  if (event.anchorType === 'SENTENCE_START') pairIndex = indexes[0];
  else if (event.anchorType === 'SENTENCE_END') { pairIndex = indexes[indexes.length - 1]; edge = 'end'; }
  else {
    const match = findPhraseStartIndex(sentenceId, event.anchorPhrase);
    if (!match) await fail(`${event.id}: anchor phrase missing in canonical word sequence.`);
    if (event.anchorType === 'PHRASE_END') { pairIndex = match.last; edge = 'end'; }
    else pairIndex = match.first;
  }
  const pair = paired[pairIndex];
  const deltaMs = edge === 'end' ? pair.endDeltaMs : pair.startDeltaMs;
  anchorChecks.push({eventId: event.id, sentenceId, edge, word: pair.text, deltaMs: Number(deltaMs.toFixed(2))});
}

const metrics = {
  medianStartDeltaMs: Number(percentile(startDeltas, 0.5).toFixed(2)),
  p95StartDeltaMs: Number(percentile(startDeltas, 0.95).toFixed(2)),
  p95EndDeltaMs: Number(percentile(endDeltas, 0.95).toFixed(2)),
  maxAnyWordDeltaMs: Number(Math.max(...startDeltas, ...endDeltas).toFixed(2)),
  maxAnchorDeltaMs: Number(Math.max(...anchorChecks.map((row) => row.deltaMs)).toFixed(2)),
};
const violations = [];
if (metrics.medianStartDeltaMs > thresholds.medianStartDeltaMs) violations.push(`median start delta ${metrics.medianStartDeltaMs}ms > ${thresholds.medianStartDeltaMs}ms`);
if (metrics.p95StartDeltaMs > thresholds.p95StartDeltaMs) violations.push(`p95 start delta ${metrics.p95StartDeltaMs}ms > ${thresholds.p95StartDeltaMs}ms`);
if (metrics.maxAnchorDeltaMs > thresholds.maxAnchorDeltaMs) violations.push(`max planned-anchor delta ${metrics.maxAnchorDeltaMs}ms > ${thresholds.maxAnchorDeltaMs}ms`);
if (metrics.maxAnyWordDeltaMs > thresholds.maxAnyWordDeltaMs) violations.push(`max word-edge delta ${metrics.maxAnyWordDeltaMs}ms > ${thresholds.maxAnyWordDeltaMs}ms`);

const payload = {
  version:2,
  status: violations.length ? 'ALIGNMENT_CONSENSUS_FAILED' : 'ALIGNMENT_CONSENSUS_PASSED',
  generatedAt: new Date().toISOString(),
  authority: '01-script-audio/WORD-TIMINGS.json',
  wordTimingsSha256: sha256(wordTimingBytes),
  verifierFingerprint,
  cacheHit: verifierCacheHit,
  primary: {backend: primaryBackend, model: primaryDoc?.model || null},
  verifier: {backend: 'ctc-german', model: verifierDoc?.model || null},
  wordCount: primary.length,
  plannedAnchorCount: anchorChecks.length,
  thresholds,
  metrics,
  worstAnchors: [...anchorChecks].sort((a, b) => b.deltaMs - a.deltaMs).slice(0, 10),
  violations,
};
await writeFile(p('06-projektdateien', 'ALIGNMENT-QUALITY.json'), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
if (violations.length) await fail(violations.join('; '), payload);

console.log('ALIGNMENT CONSENSUS PASSED');
console.log(`primary: ${payload.primary.backend}`);
console.log(`verifier: ${payload.verifier.backend}`);
console.log(`cache: ${verifierCacheHit ? 'HIT' : 'MISS'}`);
console.log(`median start delta: ${metrics.medianStartDeltaMs} ms`);
console.log(`p95 start delta: ${metrics.p95StartDeltaMs} ms`);
console.log(`max planned-anchor delta: ${metrics.maxAnchorDeltaMs} ms`);
