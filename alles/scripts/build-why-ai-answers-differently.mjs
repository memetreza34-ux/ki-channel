import {spawn} from 'node:child_process';
import {getDifferentAnswersConfig} from './why-ai-answers-differently-render-config.mjs';

const config = getDifferentAnswersConfig(process.argv[2]);
const run = (command, args) => new Promise((resolvePromise, reject) => {
  const child = spawn(command, args, {stdio: 'inherit', shell: process.platform === 'win32'});
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? resolvePromise() : reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}`)));
});

if (config.syncStatus !== 'final-transcript-aligned') {
  throw new Error('Gesamtbuild blockiert: zuerst echtes Voiceover transkribieren und final-sync erzeugen.');
}

await run(process.execPath, ['scripts/validate-reel-v4.mjs', config.reelRoot, '--final']);
await run(process.execPath, ['scripts/stage-why-ai-answers-differently-audio.mjs', config.reelRoot]);
await run('npm', ['run', 'motion:typecheck']);
await run('npx', ['--no-install', 'vitest', 'run',
  'ki/src/reels/why-ai-answers-differently/__tests__',
  'ki/src/components/__tests__/SingleSentenceKaraokeCaption.test.ts',
]);
await run(process.execPath, ['scripts/render-why-ai-answers-differently.mjs', 'all', config.reelRoot]);
await run(process.execPath, ['scripts/check-why-ai-answers-differently.mjs', config.reelRoot]);
console.log('✓ Technischer Build abgeschlossen. Animation Director, Icon-Prüfung, Visual QA und Nutzerfreigabe bleiben erforderlich.');
