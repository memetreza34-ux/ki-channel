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
  ['node', ['--check', 'scripts/edge-case-release-utils.mjs']],
  ['node', ['--check', 'scripts/render-content-motion-edge-cases.mjs']],
  ['node', ['--check', 'scripts/verify-content-motion-edge-case-renders.mjs']],
  ['node', ['--check', 'scripts/verify-content-matched-runtime.mjs']],
  ['node', ['--check', 'scripts/run-content-release.mjs']],
  ['node', ['--check', 'scripts/verify-content-release-summary.mjs']],
  ['node', ['--check', 'scripts/content-release-status.mjs']],
  ['node', ['--check', 'scripts/finalize-content-release.mjs']],
  ['node', ['--check', 'scripts/check-content-release-worktree-contract.mjs']],
  ['node', ['--check', 'scripts/check-content-release-status-contract.mjs']],
  ['node', ['--check', 'scripts/check-masterplan-production-inputs.mjs']],
  ['node', ['--check', 'scripts/check-masterplan-production-fixtures.mjs']],
  ['node', ['--check', 'scripts/run-first-content-grounding-test.mjs']],
  ['node', ['--check', 'scripts/check-first-content-grounding-test-contract.mjs']],
  ['node', ['--check', 'scripts/check-native-prototype-bindings.mjs']],
  ['node', ['--check', 'scripts/check-production-derived-runtime-keys.mjs']],
  ['node', ['--check', 'scripts/check-content-motion-edge-cases.mjs']],
  ['node', ['--check', 'scripts/check-canonical-content-release-paths.mjs']],
  ['node', ['--check', 'scripts/check-content-review-finalization-path.mjs']],
  ['node', ['--check', 'scripts/build-content-review-gallery.mjs']],
  ['node', ['--check', 'scripts/verify-content-review-gallery.mjs']],
  ['node', ['--check', 'scripts/verify-content-visual-review.mjs']],
  ['node', ['--check', 'scripts/load-scene-meaning-enhancer.mjs']],
  ['node', ['--check', 'scripts/load-prototype-runtime-content-deriver.mjs']],
  ['node', ['--check', 'scripts/load-prototype-runtime-content-sanitizer.mjs']],
  ['node', ['--check', 'scripts/load-prototype-runtime-content-association.mjs']],
  ['node', ['--check', 'scripts/load-prototype-render-payload.mjs']],
  ['node', ['--check', 'scripts/render-masterplan-content-release.mjs']],
  ['node', ['--check', 'scripts/verify-masterplan-content-release.mjs']],
  ['node', ['--check', 'scripts/render-all-content-release.mjs']],
  ['node', ['--check', 'scripts/verify-all-content-release.mjs']],
  ['node', ['--check', 'scripts/render-complete-content-release.mjs']],
  ['node', ['--check', 'scripts/verify-complete-content-release.mjs']],
  ['node', ['scripts/check-masterplan-production-inputs.mjs']],
  ['node', ['scripts/check-masterplan-production-fixtures.mjs']],
  ['node', ['scripts/check-first-content-grounding-test-contract.mjs']],
  ['node', ['scripts/check-native-prototype-bindings.mjs']],
  ['node', ['scripts/check-production-derived-runtime-keys.mjs']],
  ['node', ['scripts/check-content-motion-edge-cases.mjs']],
  ['node', ['scripts/check-canonical-content-release-paths.mjs']],
  ['node', ['scripts/check-content-review-finalization-path.mjs']],
  ['node', ['scripts/check-content-release-worktree-contract.mjs']],
  ['node', ['scripts/check-content-release-status-contract.mjs']],
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
  ['node', ['scripts/render-content-motion-edge-cases.mjs', 'plan']],
  ['node', ['scripts/render-masterplan-content-release.mjs', 'plan']],
  ['node', ['scripts/verify-masterplan-content-release.mjs']],
];

for (const [command, args] of checks) {
  await run(command, args);
}

console.log('\nAnimation-Library-Verifikation vollständig erfolgreich.');
