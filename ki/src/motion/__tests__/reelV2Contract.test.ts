import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {afterEach, describe, expect, it} from 'vitest';

const repoRoot = process.cwd();
const newReelScript = resolve(repoRoot, 'scripts/new-ki-reel.mjs');
const structureCheckScript = resolve(repoRoot, 'scripts/check-ki-reel-folder-structure.mjs');
const tempRoots: string[] = [];

const makeRoot = () => {
  const root = mkdtempSync(resolve(tmpdir(), 'ki-channel-v2-'));
  tempRoots.push(root);
  mkdirSync(resolve(root, 'ki/src/reels'), {recursive: true});
  return root;
};

const run = (
  script: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = {},
) => spawnSync(process.execPath, [script, ...args], {
  cwd,
  env: {...process.env, ...env},
  encoding: 'utf8',
});

const findCreatedReel = (root: string) =>
  resolve(
    root,
    'ki/reels/2026-09-21_bis_2026-09-27/01_V2-Test-Reel',
  );

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) rmSync(root, {recursive: true, force: true});
  }
});

describe('V2 reel scaffold and structure contract', () => {
  it('creates the creative, grounding and visual-strategy artifacts and passes the structure check while Phase 1 is open', () => {
    const root = makeRoot();
    const scaffold = run(newReelScript, ['V2 Test Reel', '2026-09-21'], root);

    expect(scaffold.status, scaffold.stderr).toBe(0);

    const reelRoot = findCreatedReel(root);
    const projectRoot = resolve(reelRoot, '06-projektdateien');

    for (const file of [
      'production-contract-v2.json',
      'creative-brief.md',
      'source-ledger.md',
      'visual-strategy.md',
      'creative-review.md',
      'PHASE-STATUS.md',
    ]) {
      expect(existsSync(resolve(projectRoot, file)), file).toBe(true);
    }

    expect(existsSync(resolve(reelRoot, '02-bilder/asset-manifest.json'))).toBe(true);

    const contract = JSON.parse(
      readFileSync(resolve(projectRoot, 'production-contract-v2.json'), 'utf8'),
    ) as {version: number; visualModalities: string[]};

    expect(contract.version).toBe(2);
    expect(contract.visualModalities).toEqual(expect.arrayContaining([
      'REMOTION_NATIVE',
      'REAL_CAPTURE',
      'HYBRID',
      'EXTERNAL_STILL_REQUIRED',
      'EXTERNAL_MOTION_REQUIRED',
    ]));

    const check = run(
      structureCheckScript,
      [],
      repoRoot,
      {KI_REEL_STRUCTURE_ROOT: root},
    );

    expect(check.status, `${check.stdout}\n${check.stderr}`).toBe(0);
    expect(check.stdout).toContain('V2-Reels besitzen Creative-, Grounding- und Visual-Strategie-Verträge');
  });

  it('refuses a V2 reel marked Phase 1 FERTIG while mandatory Phase-1 artifacts are still missing/open', () => {
    const root = makeRoot();
    const scaffold = run(newReelScript, ['V2 Test Reel', '2026-09-21'], root);
    expect(scaffold.status, scaffold.stderr).toBe(0);

    const reelRoot = findCreatedReel(root);
    const phasePath = resolve(reelRoot, '06-projektdateien/PHASE-STATUS.md');
    const phase = readFileSync(phasePath, 'utf8').replace(
      '**Status:** OFFEN',
      '**Status:** FERTIG',
    );
    writeFileSync(phasePath, phase, 'utf8');

    const check = run(
      structureCheckScript,
      [],
      repoRoot,
      {KI_REEL_STRUCTURE_ROOT: root},
    );

    expect(check.status).not.toBe(0);
    expect(check.stderr).toContain('Phase 1 ist FERTIG markiert');
    expect(check.stderr).toContain('reel.json fehlt');
    expect(check.stderr).toContain('animation-plan.md fehlt');
    expect(check.stderr).toContain('voiceover.md fehlt');
    expect(check.stderr).toContain('subtitle-cues.json fehlt');
  });

  it('keeps V2 planning artifacts out of executable source directories', () => {
    const root = makeRoot();
    mkdirSync(resolve(root, 'ki/reels'), {recursive: true});

    const forbidden = resolve(root, 'ki/src/reels/bad-reel/visual-strategy.md');
    mkdirSync(dirname(forbidden), {recursive: true});
    writeFileSync(forbidden, '# must not live here\n', 'utf8');

    const check = run(
      structureCheckScript,
      [],
      repoRoot,
      {KI_REEL_STRUCTURE_ROOT: root},
    );

    expect(check.status).not.toBe(0);
    expect(check.stderr).toContain('Planungsdatei im Source-Bereich');
    expect(check.stderr).toContain('visual-strategy.md');
  });
});
