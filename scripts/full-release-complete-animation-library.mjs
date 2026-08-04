import {spawn} from 'node:child_process';

const run = (command, args) =>
  new Promise((resolvePromise, reject) => {
    console.log(`\n> ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

await run('node', ['scripts/verify-complete-animation-library-all.mjs']);
await run('node', ['scripts/render-complete-animation-library.mjs', 'all']);
await run('node', ['scripts/check-complete-animation-library-renders.mjs']);

console.log('\nVollständiger technischer Release-Check der 22-Familien-Bibliothek bestanden.');
console.log('Manuelle Sichtprüfung der 154 PNGs und 22 MP4s bleibt verpflichtend.');
