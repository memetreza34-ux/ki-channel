import {spawnSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';

describe('production-derived runtime key source gate', () => {
  it('only emits labels and values consumed by the selected prototype source', () => {
    const result = spawnSync(
      process.execPath,
      ['scripts/check-production-derived-runtime-keys.mjs'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        env: process.env,
      },
    );

    expect(
      result.status,
      [result.stdout, result.stderr].filter(Boolean).join('\n'),
    ).toBe(0);
    expect(result.stdout).toContain(
      'Production-Derived-Runtime-Key-Gate bestanden',
    );
  });
});
