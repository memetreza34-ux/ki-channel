import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {getTodayKnowledgeRenderConfig} from './why-ai-does-not-know-today-render-config.mjs';

const mode = process.argv[2] ?? 'plan';
const projectArg = process.argv[3];
const modes = new Set(['plan', 'smoke', 'stills', 'cover', 'preview-video', 'video', 'all']);
if (!modes.has(mode)) throw new Error(`Unbekannter Modus: ${mode}`);

const config = getTodayKnowledgeRenderConfig(projectArg);
const checkpoints = mode === 'smoke' ? [...config.smokeCheckpoints] : [...config.checkpoints];
const plan = {
  version: 1,
  reelRoot: config.reelRoot,
  syncStatus: config.syncStatus,
  entryPoint: config.entryPoint,
  compositionId: config.compositionId,
  coverId: config.coverId,
  width: config.width,
  height: config.height,
  fps: config.fps,
  durationInFrames: config.durationInFrames,
  checkpoints,
};

await mkdir(config.stillOutput, {recursive: true});
await writeFile(resolve(config.reelRoot, 'timeline', 'render-plan.json'), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
if (mode === 'plan') {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

const run = (command, args) => new Promise((resolvePromise, reject) => {
  const child = spawn(command, args, {stdio: 'inherit', shell: process.platform === 'win32'});
  child.on('error', reject);
  child.on('exit', (code) => code === 0
    ? resolvePromise()
    : reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}`)));
});

if (new Set(['smoke', 'stills', 'all']).has(mode)) {
  for (const frame of checkpoints) {
    const output = resolve(config.stillOutput, `frame-${String(frame).padStart(4, '0')}.png`);
    await run('npx', [
      '--no-install',
      'remotion',
      'still',
      config.entryPoint,
      config.compositionId,
      output,
      `--frame=${frame}`,
      '--props={"muteVoiceover":true}',
      '--overwrite',
    ]);
  }
}

if (new Set(['cover', 'all']).has(mode)) {
  await mkdir(dirname(config.coverOutput), {recursive: true});
  await run('npx', ['--no-install', 'remotion', 'still', config.entryPoint, config.coverId, config.coverOutput, '--frame=0', '--overwrite']);
}

if (mode === 'preview-video') {
  await mkdir(dirname(config.previewVideoOutput), {recursive: true});
  await run('npx', [
    '--no-install',
    'remotion',
    'render',
    config.entryPoint,
    config.compositionId,
    config.previewVideoOutput,
    '--codec=h264',
    '--crf=18',
    '--props={"muteVoiceover":true}',
    '--concurrency=2',
    '--overwrite',
  ]);
}

if (new Set(['video', 'all']).has(mode)) {
  if (config.syncStatus !== 'final-transcript-aligned') {
    throw new Error('Finaler Video-Render blockiert: final-sync ist noch ein Platzhalter.');
  }
  await mkdir(dirname(config.finalVideoOutput), {recursive: true});
  await run('npx', [
    '--no-install',
    'remotion',
    'render',
    config.entryPoint,
    config.compositionId,
    config.finalVideoOutput,
    '--codec=h264',
    '--crf=18',
    '--audio-codec=aac',
    '--concurrency=2',
    '--overwrite',
  ]);
}

console.log(`✓ Render abgeschlossen: ${config.reelRoot}`);
