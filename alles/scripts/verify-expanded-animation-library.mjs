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
  ['node', ['--check', 'scripts/expanded-animation-library-render-config.mjs']],
  ['node', ['--check', 'scripts/render-expanded-animation-library.mjs']],
  ['node', ['--check', 'scripts/check-expanded-animation-library-renders.mjs']],
  ['npx', ['--no-install', 'tsc', '--noEmit', '-p', 'ki/tsconfig.animation-library.json']],
  ['npx', ['--no-install', 'vitest', 'run', 'ki/src/animation-library/__tests__']],
  ['node', ['--test', 'scripts/__tests__/expanded-animation-library-config.test.mjs']],
  ['node', ['scripts/render-expanded-animation-library.mjs', 'plan']],
];

for (const [command, args] of checks) {
  await run(command, args);
}

console.log('\nErweiterte 44-Animationsbibliothek erfolgreich verifiziert.');
