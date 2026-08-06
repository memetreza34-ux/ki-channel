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

await run(process.execPath, ['scripts/validate-reel-v4.mjs', config.reelRoot]);
await run(process.execPath, ['scripts/validate-reel-animation-novelty.mjs', config.reelRoot]);
await run('npm', ['run', 'motion:typecheck']);
await run('npx', [
  '--no-install',
  'vitest',
  'run',
  'ki/src/reels/why-ai-does-not-know-today/__tests__',
  'ki/src/components/__tests__/SingleSentenceKaraokeCaption.test.ts',
]);
await run(process.execPath, ['scripts/render-why-ai-does-not-know-today.mjs', 'stills', config.reelRoot]);
await run(process.execPath, ['scripts/render-why-ai-does-not-know-today.mjs', 'cover', config.reelRoot]);
await run(process.execPath, ['scripts/render-why-ai-does-not-know-today.mjs', 'preview-video', config.reelRoot]);
await run(process.execPath, ['scripts/check-why-ai-does-not-know-today.mjs', config.reelRoot]);

console.log('✓ Stumme Vorschau technisch erstellt. Audio-Sync, Smartphone-Sichtprüfung und Nutzerfreigabe bleiben offen.');
