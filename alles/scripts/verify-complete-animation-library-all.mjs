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

await run('node', ['scripts/verify-complete-animation-library.mjs']);
await run('node', [
  '--test',
  'scripts/__tests__/complete-animation-library-config.test.mjs',
]);

console.log('\nAlle vollständigen Bibliotheksprüfungen erfolgreich.');
