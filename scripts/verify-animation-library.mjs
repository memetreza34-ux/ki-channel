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
  [
    'node',
    [
      '--check',
      'scripts/animation-library-render-config.mjs',
    ],
  ],
  ['node', ['--check', 'scripts/render-animation-library.mjs']],
  ['node', ['--check', 'scripts/check-animation-library-renders.mjs']],
  ['node', ['--check', 'scripts/render-content-matched-prototype.mjs']],
  ['node', ['--check', 'scripts/verify-content-matched-runtime.mjs']],
  [
    'npx',
    [
      '--no-install',
      'tsc',
      '--noEmit',
      '-p',
      'ki/tsconfig.animation-library.json',
    ],
  ],
  [
    'npx',
    [
      '--no-install',
      'vitest',
      'run',
      'ki/src/animation-library/__tests__',
    ],
  ],
  ['node', ['scripts/render-animation-library.mjs', 'plan']],
];

for (const [command, args] of checks) {
  await run(command, args);
}

console.log('\nAnimation-Library-Verifikation vollständig erfolgreich.');
