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

const scaffoldReel = (root: string) => {
  const result = run(newReelScript, ['V2 Test Reel', '2026-09-21'], root);
  expect(result.status, result.stderr).toBe(0);
  return findCreatedReel(root);
};

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) rmSync(root, {recursive: true, force: true});
  }
});

describe('V2 reel scaffold and structure contract', () => {
  it('creates creative, grounding and visual-strategy artifacts and passes while Phase 1 is open', () => {
    const root = makeRoot();
    const reelRoot = scaffoldReel(root);
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
    expect(check.stdout).toContain('V2-Reels besitzen geprüfte Creative-, Grounding-, Visual-Strategy- und Review-Verträge');
  });

  it('refuses Phase 1 FERTIG while mandatory Phase-1 artifacts are missing or still open', () => {
    const root = makeRoot();
    const reelRoot = scaffoldReel(root);
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
    expect(check.stderr).toContain('Datei steht aber noch auf OFFEN');
  });

  it('refuses Phase 3 FERTIG without a PASS creative review, real voiceover and resolved required assets', () => {
    const root = makeRoot();
    const reelRoot = scaffoldReel(root);
    const projectRoot = resolve(reelRoot, '06-projektdateien');
    const phasePath = resolve(projectRoot, 'PHASE-STATUS.md');

    const phase = readFileSync(phasePath, 'utf8')
      .replace('## Phase 3 — Codex / Antigravity\n\n**Status:** WARTET AUF PHASE 2', '## Phase 3 — Codex / Antigravity\n\n**Status:** FERTIG');
    writeFileSync(phasePath, phase, 'utf8');

    writeFileSync(
      resolve(reelRoot, '02-bilder/asset-manifest.json'),
      JSON.stringify({version: 2, assets: [{id: 'hero', status: 'MISSING_REQUIRED'}]}, null, 2),
      'utf8',
    );

    const check = run(
      structureCheckScript,
      [],
      repoRoot,
      {KI_REEL_STRUCTURE_ROOT: root},
    );

    expect(check.status).not.toBe(0);
    expect(check.stderr).toContain('Phase 3 darf nicht FERTIG sein, solange Phase 1 nicht FERTIG ist');
    expect(check.stderr).toContain('Creative Review ist aber nicht PASS');
    expect(check.stderr).toContain('echtes voiceover.wav/mp3 fehlt');
    expect(check.stderr).toContain('enthält aber noch MISSING_REQUIRED');
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
