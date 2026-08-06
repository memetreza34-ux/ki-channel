import {spawn} from 'node:child_process';
import {getWhyAIForgetsRenderConfig} from './why-ai-forgets-render-config.mjs';

const config = getWhyAIForgetsRenderConfig(process.argv[2]);

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

await run(process.execPath, ['scripts/validate-reel-v3.mjs', config.reelRoot, '--final']);
await run(process.execPath, ['scripts/validate-v3-caption-coverage.mjs', config.reelRoot]);
await run(process.execPath, ['scripts/stage-why-ai-forgets-audio.mjs', config.reelRoot]);
await run('npm', ['run', 'motion:typecheck']);
await run('npx', ['--no-install', 'vitest', 'run',
  'ki/src/reels/why-ai-forgets-earlier-messages/__tests__',
  'ki/src/components/__tests__/DualSentenceKaraokeCaption.test.ts',
]);
await run(process.execPath, ['scripts/render-why-ai-forgets-earlier-messages.mjs', 'all', config.reelRoot]);
await run(process.execPath, ['scripts/check-why-ai-forgets-earlier-messages.mjs', config.reelRoot]);

console.log('✓ Gesamtbuild technisch abgeschlossen. Animation Director, Visual-QA-Agent und Nutzerfreigabe bleiben erforderlich.');
