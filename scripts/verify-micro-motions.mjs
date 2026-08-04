import {spawn} from 'node:child_process';

const run = (command, args) => new Promise((resolvePromise, reject) => {
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

await run('node', ['--check', 'scripts/micro-motion-render-config.mjs']);
await run('node', ['--check', 'scripts/render-micro-motions.mjs']);
await run('node', ['--check', 'scripts/check-micro-motion-renders.mjs']);
await run('node', ['--test', 'scripts/__tests__/micro-motion-config.test.mjs']);
await run('npx', [
  '--no-install',
  'tsc',
  '--noEmit',
  '-p',
  'ki/tsconfig.animation-library.json',
]);
await run('npx', [
  '--no-install',
  'vitest',
  'run',
  'ki/src/animation-library/__tests__/microMotionCatalog.test.ts',
  'ki/src/animation-library/__tests__/importantWordCoverage.test.ts',
  'ki/src/animation-library/__tests__/universalMotionPlan.test.ts',
  'ki/src/animation-library/__tests__/channelContentModes.test.ts',
  'ki/src/animation-library/__tests__/remotionChoreographyCompiler.test.ts',
  'ki/src/animation-library/__tests__/microMotionRuntime.test.ts',
]);
await run('node', ['scripts/render-micro-motions.mjs', 'plan']);

console.log('\nSemantische Mikroanimationen erfolgreich verifiziert.');
