#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const rawPackage = process.argv[2];
if (!rawPackage) {
  console.error('Usage: node scripts/check-ki-longform-render-readiness.mjs <ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel>');
  process.exit(1);
}
const root = path.resolve(rawPackage);
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const isFile = (p) => existsSync(p) && statSync(p).isFile();
const nonEmptyFile = (p) => isFile(p) && statSync(p).size > 0;
const posix = (p) => p.split(path.sep).join('/');
const inside = (parent, child) => child === parent || child.startsWith(`${parent}${path.sep}`);
if (!existsSync(root) || !statSync(root).isDirectory()) { console.error(`LONGFORM RENDER READINESS FAILED: package missing: ${posix(root)}`); process.exit(1); }
const readJson = async (relative) => { const p = path.join(root, relative); if (!nonEmptyFile(p)) { fail(`required JSON missing/empty: ${relative}`); return null; } try { return JSON.parse(await readFile(p, 'utf8')); } catch (error) { fail(`invalid JSON ${relative}: ${error.message}`); return null; } };
const sha256File = (file) => new Promise((resolveHash, reject) => { const hash = createHash('sha256'); const stream = createReadStream(file); stream.on('data', (chunk) => hash.update(chunk)); stream.on('end', () => resolveHash(hash.digest('hex'))); stream.on('error', reject); });
const walk = async (dir) => { const out = []; for (const entry of await readdir(dir, {withFileTypes:true})) { const p = path.join(dir, entry.name); if (entry.isDirectory()) out.push(...await walk(p)); else if (entry.isFile()) out.push(p); } return out; };
const run = (cmd,args) => spawnSync(cmd,args,{encoding:'utf8',maxBuffer:32*1024*1024});
const version = await readJson('06-projektdateien/LONGFORM-VERSION.json');
const chapters = await readJson('01-script-audio/CHAPTERS.json');
const claims = await readJson('01-script-audio/CLAIMS.json');
const media = await readJson('02-visuals/MEDIA-PLAN.json');
if (version) { if (version.version !== 1 || version.contract !== 'LONGFORM_V1') fail('LONGFORM-VERSION must be LONGFORM_V1 version 1.'); if (version.animationFreedom !== 'OPEN_ENDED_STORY_DRIVEN') fail('animationFreedom must be OPEN_ENDED_STORY_DRIVEN.'); if (!version.compositionId || typeof version.compositionId !== 'string') fail('LONGFORM-VERSION.compositionId must be set before render.'); }
const voiceCandidates = ['voiceover.wav','voiceover.mp3'].map((n)=>path.join(root,'01-script-audio',n));
const voice = voiceCandidates.find(nonEmptyFile);
let voiceDuration = NaN;
if (!voice) fail('final user voiceover missing (voiceover.wav or voiceover.mp3).'); else { const probe = run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',voice]); if (probe.error || probe.status !== 0) fail(`ffprobe failed for voiceover: ${probe.stderr || probe.error?.message}`); else { voiceDuration = Number(String(probe.stdout).trim()); if (!Number.isFinite(voiceDuration) || voiceDuration <= 1) fail('voiceover duration invalid.'); } }
if (chapters) { if (!['VOICE_LOCKED','READY'].includes(chapters.status)) fail('CHAPTERS.status must be VOICE_LOCKED or READY before render.'); if (!Array.isArray(chapters.chapters) || chapters.chapters.length === 0) fail('CHAPTERS must contain at least one chapter.'); let lastEnd = 0; for (const chapter of chapters.chapters ?? []) { const start = Number(chapter.startSeconds); const end = Number(chapter.endSeconds); if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) { fail(`chapter ${chapter.id ?? '?'} needs real startSeconds/endSeconds.`); continue; } if (start < lastEnd - 0.05) fail(`chapter ${chapter.id ?? '?'} overlaps previous chapter.`); if (start - lastEnd > 2.0) warn(`chapter gap before ${chapter.id ?? '?'} is ${(start-lastEnd).toFixed(2)}s.`); lastEnd = end; } if (Number.isFinite(voiceDuration) && lastEnd > 0 && Math.abs(lastEnd-voiceDuration) > 1.25) fail(`last chapter ends at ${lastEnd.toFixed(2)}s but voiceover is ${voiceDuration.toFixed(2)}s; timeline is not voice-locked.`); }
if (claims && !['READY','FACT_CHECKED'].includes(claims.status)) fail('CLAIMS.status must be FACT_CHECKED or READY before render.');
if (media) { if (!['READY_FOR_RENDER','READY'].includes(media.status)) fail('MEDIA-PLAN.status must be READY_FOR_RENDER or READY before render.'); if (!Array.isArray(media.assets)) fail('MEDIA-PLAN.assets must be an array.'); for (const asset of media.assets ?? []) { if (asset.requiredForRender === false) continue; const id = asset.assetId ?? '?'; if (asset.status !== 'APPROVED') fail(`media ${id} is required but not APPROVED.`); if (asset.rightsVerified !== true) fail(`media ${id} requires rightsVerified=true.`); if (!asset.localFile || /^https?:\/\//i.test(String(asset.localFile))) { fail(`media ${id} requires a localFile.`); continue; } const local = path.resolve(root, String(asset.localFile)); if (!inside(root,local)) { fail(`media ${id} localFile escapes package root.`); continue; } if (!nonEmptyFile(local)) { fail(`media ${id} local file missing/empty: ${asset.localFile}`); continue; } if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(asset.sha256)) fail(`media ${id} requires SHA-256.`); else { const actual = await sha256File(local); if (actual.toLowerCase() !== asset.sha256.toLowerCase()) fail(`media ${id} SHA-256 does not match local file.`); } if (!['USER_PROVIDED','GENERATED_NON_EVIDENTIARY'].includes(asset.sourceType) && !asset.sourceUrl) fail(`external media ${id} requires sourceUrl.`); if (asset.sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) fail(`generated media ${id} may not prove a real-world claim.`); } }
if (version?.sourceSlug) { const sourceRoot = path.resolve('ki','src','longform',version.sourceSlug); if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) fail(`source root missing: ${posix(sourceRoot)}`); else { const files = (await walk(sourceRoot)).filter((p)=>/\.(ts|tsx)$/i.test(p)); const tsx = files.filter((p)=>/\.tsx$/i.test(p)); if (tsx.length === 0) fail('longform source contains no TSX composition/components; README-only prototypes are not renderable.'); const placeholderPattern = /\b(?:TODO|TBD|PLACEHOLDER)\b|\b(?:Payoff|Demo|Astra\s+praktisch)\s+Visual\b|\bB-?Roll\s+(?:here|hier)\b|\bImage\s+(?:here|hier)\b/gi; const remoteMediaPattern = /https?:\/\/[^'"`\s]+\.(?:png|jpe?g|webp|gif|mp4|mov|webm)(?:\?[^'"`\s]*)?/gi; for (const file of files) { const text = await readFile(file,'utf8'); const placeholders = [...text.matchAll(placeholderPattern)].map((m)=>m[0]); if (placeholders.length) fail(`${posix(file)} contains render-blocking placeholder text: ${[...new Set(placeholders)].join(', ')}`); if (remoteMediaPattern.test(text)) fail(`${posix(file)} contains direct remote media URL; materialize media locally before render.`); remoteMediaPattern.lastIndex = 0; } const gitStatus = run('git',['status','--porcelain','--',sourceRoot]); if (!gitStatus.error && gitStatus.status === 0 && String(gitStatus.stdout).trim()) fail('longform source has uncommitted/untracked changes; commit source before production render.'); const rootSource = path.resolve('ki','src','Root.tsx'); if (version.compositionId && nonEmptyFile(rootSource)) { const rootText = await readFile(rootSource,'utf8'); if (!rootText.includes(version.compositionId)) fail(`compositionId ${version.compositionId} is not registered in ki/src/Root.tsx.`); } } }
for (const m of warnings) console.warn(`LONGFORM RENDER READINESS WARNING: ${m}`);
if (errors.length) { console.error(`LONGFORM RENDER BLOCKED (${errors.length}):`); for (const m of errors) console.error(`- ${m}`); process.exit(1); }
console.log('LONGFORM RENDER READINESS: PASSED'); console.log(`package: ${posix(root)}`); console.log(`voiceover: ${voice ? posix(voice) : 'missing'}${Number.isFinite(voiceDuration)?` (${voiceDuration.toFixed(3)}s)`:''}`); console.log(`composition: ${version?.compositionId}`);
