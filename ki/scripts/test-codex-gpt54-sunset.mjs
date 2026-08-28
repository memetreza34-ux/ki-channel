#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const reelDir = path.resolve('ki/reels/2026-08-24_bis_2026-08-30/06_Codex-GPT-5-4-verschwindet-am-31-August');
const compositionId = 'KI-CodexGPT54Sunset';
const outputDir = path.resolve('out/codex-gpt54-transfer-test');
const video = path.join(outputDir, `${compositionId}-test.mp4`);
const contactSheet = path.join(outputDir, `${compositionId}-contact-sheet.jpg`);
const reportPath = path.join(outputDir, 'TRANSFER-TEST-REPORT.json');
const voiceover = path.join(reelDir, '01-script-audio', 'voiceover.mp3');
const audioSource = path.join(reelDir, '01-script-audio', 'audio-source.json');

const fail = (message) => { console.error(`CODEX GPT-5.4 TRANSFER TEST FAILED: ${message}`); process.exit(1); };
const run = (label, command, args, options = {}) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {encoding:'utf8', stdio:'inherit', ...options});
  if (result.error || result.status !== 0) fail(`${label}${result.error ? `: ${result.error.message}` : ` exited with ${result.status}`}`);
};
const sha256File = async (file) => {
  const hash = createHash('sha256');
  await new Promise((resolve,reject)=>{
    const stream=createReadStream(file);
    stream.on('data',(chunk)=>hash.update(chunk));
    stream.on('end',resolve);
    stream.on('error',reject);
  });
  return hash.digest('hex');
};

for (const binary of ['ffmpeg','ffprobe']) {
  const probe=spawnSync(binary,['-version'],{encoding:'utf8'});
  if (probe.error || probe.status !== 0) fail(`${binary} is required.`);
}
if (!existsSync(path.resolve('node_modules/.bin/remotion'))) fail('node_modules/remotion missing. Run npm install once.');
await mkdir(outputDir,{recursive:true});

if (!existsSync(voiceover)) {
  run('Download exact generated voiceover', process.execPath, [path.resolve('ki/scripts/fetch-generated-voiceover.mjs'), audioSource, voiceover]);
}

if (!existsSync(path.resolve('public/reel-sfx/sfx-index.json'))) {
  run('Setup local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/setup-reel-sfx-library.mjs')]);
}
run('Validate local CC0 SFX library', process.execPath, [path.resolve('ki/scripts/validate-reel-sfx-library.mjs')]);

// This is intentionally a real from-scratch transfer test: pause compression + actual local forced alignment
// + scene lock + caption generation + deterministic SFX resolution all run here.
run('Full local voice alignment and SFX lock', process.execPath, [path.resolve('ki/scripts/align-reel-local.mjs'), reelDir]);
run('Resolve licensed external visuals locally', process.execPath, [path.resolve('ki/scripts/resolve-reel-visual-assets.mjs'), reelDir]);
run('Validate local visual rights and SHA256', process.execPath, [path.resolve('ki/scripts/validate-reel-visual-assets.mjs'), reelDir]);
run('Validate source isolation', process.execPath, [path.resolve('ki/scripts/validate-reel-source-isolation.mjs'), reelDir]);

run('Typecheck Remotion source', 'npm', ['run','typecheck:motion']);
run('Codex reel contract test', 'npx', ['--no-install','vitest','run','ki/src/reels/codex-gpt54-sunset/contract.test.ts']);

run('Render transfer-test MP4', 'npx', ['--no-install','remotion','render','ki/src/index.ts',compositionId,video,'--overwrite']);
run('Technical A/V gate', process.execPath, [path.resolve('ki/scripts/validate-final-video.mjs'), video]);
run('Create contact sheet', 'ffmpeg', ['-hide_banner','-loglevel','error','-y','-i',video,'-vf','fps=1/3,scale=270:-1,tile=2x6','-frames:v','1',contactSheet]);

const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',video],{encoding:'utf8'});
if (probe.error || probe.status !== 0) fail('could not probe rendered MP4 duration.');
const durationSeconds=Number(String(probe.stdout).trim());
const videoSha256=await sha256File(video);
const wordTimings=JSON.parse(await readFile(path.join(reelDir,'01-script-audio','WORD-TIMINGS.json'),'utf8'));
const sfx=JSON.parse(await readFile(path.join(reelDir,'06-projektdateien','sfx-resolved.json'),'utf8'));
const visuals=JSON.parse(await readFile(path.join(reelDir,'06-projektdateien','visual-assets-resolved.json'),'utf8'));
const reel=JSON.parse(await readFile(path.join(reelDir,'06-projektdateien','reel.json'),'utf8'));
const externalAssets=(visuals.assets || []).filter((asset)=>asset.localFile);

const report={
  status:'NEW_REEL_TRANSFER_TEST_READY_FOR_HUMAN_REVIEW_NOT_FINAL',
  compositionId,
  video,
  contactSheet,
  durationSeconds:Number(durationSeconds.toFixed(6)),
  finalDurationInFrames:reel?.format?.finalDurationInFrames,
  videoSha256,
  alignment:{backend:wordTimings.backend,model:wordTimings.model,words:(wordTimings.words||[]).length},
  sfxEvents:(sfx.events||[]).length,
  externalVisuals:externalAssets.map((asset)=>({id:asset.id,rightsStatus:asset.rightsStatus,sourceUrl:asset.sourceUrl,sha256:asset.sha256})),
  checksPassed:[
    'generated voiceover download',
    'pause compression',
    'real local forced alignment',
    'scene timing lock',
    'voice-locked captions',
    'CC0 SFX library',
    'deterministic semantic SFX resolution',
    'Wikimedia license-filtered local image resolution',
    'local visual SHA256 gate',
    'source isolation',
    'TypeScript motion typecheck',
    'Codex reel contract test',
    'technical MP4 A/V gate'
  ],
  humanReviewRequired:['pacing','caption sync','SFX timing/loudness','external NASA server visual relevance/crop','zoom/focus','source proof','visual overload','final payoff'],
  finalizationAllowed:false,
  generatedAt:new Date().toISOString(),
};
await writeFile(reportPath,`${JSON.stringify(report,null,2)}\n`,'utf8');

console.log('\nNEW REEL TRANSFER TEST READY — NOT FINAL');
console.log(`video: ${video}`);
console.log(`contact sheet: ${contactSheet}`);
console.log(`report: ${reportPath}`);
console.log(`duration: ${durationSeconds.toFixed(3)} s`);
console.log(`alignment: ${report.alignment.backend} / ${report.alignment.words} words`);
console.log(`SFX events: ${report.sfxEvents}`);
console.log(`external licensed visuals: ${report.externalVisuals.length}`);
console.log('Next: upload this exact MP4 and review it at 1x before promoting anything globally.');
