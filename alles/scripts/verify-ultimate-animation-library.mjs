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

const checks = [
  ['node', ['--check', 'scripts/ultimate-animation-library-render-config.mjs']],
  ['node', ['--check', 'scripts/render-ultimate-animation-library.mjs']],
  ['node', ['--check', 'scripts/check-ultimate-animation-library-renders.mjs']],
  ['npx', ['--no-install', 'tsc', '--noEmit', '-p', 'ki/tsconfig.animation-library.json']],
  ['npx', ['--no-install', 'vitest', 'run', 'ki/src/animation-library/__tests__']],
  ['node', ['--test', 'scripts/__tests__/ultimate-animation-library-config.test.mjs']],
  ['node', ['scripts/render-ultimate-animation-library.mjs', 'plan']],
];

for (const [command, args] of checks) {
  await run(command, args);
}

console.log('\nVollständige 88-Animationsbibliothek erfolgreich verifiziert.');
