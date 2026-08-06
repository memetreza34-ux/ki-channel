import {spawn} from 'node:child_process';
import {getTodayKnowledgeRenderConfig} from './why-ai-does-not-know-today-render-config.mjs';

const config = getTodayKnowledgeRenderConfig(process.argv[2]);

const run = (command, args) => new Promise((resolvePromise, reject) => {
  const child = spawn(command, args, {stdio: 'inherit', shell: process.platform === 'win32'});
  child.on('error', reject);
  child.on('exit', (code) => code === 0
    ? resolvePromise()
    : reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}`)));
});

if (config.syncStatus !== 'final-transcript-aligned') {
  throw new Error('Gesamtbuild blockiert: timeline/final-sync.json muss zuerst aus dem echten Voiceover erzeugt werden.');
}

await run(process.execPath, ['scripts/validate-reel-v4.mjs', config.reelRoot, '--final']);
await run(process.execPath, ['scripts/validate-reel-animation-novelty.mjs', config.reelRoot, '--final']);
await run(process.execPath, ['scripts/stage-why-ai-does-not-know-today-audio.mjs', config.reelRoot]);
await run('npm', ['run', 'motion:typecheck']);
await run('npx', [
  '--no-install',
  'vitest',
  'run',
  'ki/src/reels/why-ai-does-not-know-today/__tests__',
  'ki/src/components/__tests__/SingleSentenceKaraokeCaption.test.ts',
]);
await run(process.execPath, ['scripts/render-why-ai-does-not-know-today.mjs', 'all', config.reelRoot]);
await run(process.execPath, ['scripts/check-why-ai-does-not-know-today.mjs', config.reelRoot]);

console.log('✓ Finaler technischer Build abgeschlossen. Animation Director, Smartphone-QA und Nutzerfreigabe bleiben erforderlich.');
