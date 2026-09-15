import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm, writeFile, mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const repoRoot = resolve(process.cwd());
const generator = join(repoRoot, 'scripts', 'new-ki-longform.mjs');
const structureCheck = join(repoRoot, 'scripts', 'check-ki-longform-structure.mjs');
const releaseCheck = join(repoRoot, 'scripts', 'check-ki-longform-release.mjs');

const run = (script, args, cwd) => spawnSync(process.execPath, [script, ...args], {
  cwd,
  encoding: 'utf8',
});

const createFixture = async () => {
  const root = await mkdtemp(join(tmpdir(), 'ki-longform-v1-'));
  const generated = run(generator, ['Longform Vertrag Test', '2026-09-05'], root);
  assert.equal(generated.status, 0, generated.stderr || generated.stdout);
  const packageRoot = join(root, 'ki', 'youtube-longform', '2026-09-05', '01_Longform-Vertrag-Test');
  return {root, packageRoot};
};

test('Longform-v1 generator creates a package accepted by the structural gate', async () => {
  const {root, packageRoot} = await createFixture();
  try {
    const result = run(structureCheck, [], root);
    assert.equal(result.status, 0, result.stderr || result.stdout);

    const version = JSON.parse(await readFile(join(packageRoot, '06-projektdateien', 'LONGFORM-VERSION.json'), 'utf8'));
    assert.equal(version.contract, 'LONGFORM_V1');
    assert.equal(version.format.width, 1920);
    assert.equal(version.format.height, 1080);
    assert.equal(version.format.fps, 30);
    assert.equal(version.animationFreedom, 'OPEN_ENDED_STORY_DRIVEN');
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('Longform-v1 structural gate rejects remote URLs disguised as local media', async () => {
  const {root, packageRoot} = await createFixture();
  try {
    const mediaPath = join(packageRoot, '02-visuals', 'MEDIA-PLAN.json');
    const media = JSON.parse(await readFile(mediaPath, 'utf8'));
    media.assets = [{
      assetId: 'media-001',
      chapterId: 'chapter-01',
      purpose: 'Regression test',
      mediaType: 'VIDEO',
      sourceType: 'OFFICIAL_SOURCE',
      sourceUrl: 'https://example.com/source',
      localFile: 'https://example.com/video.mp4',
      sha256: 'a'.repeat(64),
      rightsVerified: true,
      status: 'APPROVED',
    }];
    await writeFile(mediaPath, `${JSON.stringify(media, null, 2)}\n`, 'utf8');

    const result = run(structureCheck, [], root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /localFile darf keine Remote-URL sein/);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('Longform-v1 release gate refuses a freshly generated DRAFT package', async () => {
  const {root, packageRoot} = await createFixture();
  try {
    const result = run(releaseCheck, [packageRoot], root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /RELEASE-PLAN\.status muss READY sein/);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('Longform-v1 release gate rejects media paths escaping the package', async () => {
  const {root, packageRoot} = await createFixture();
  try {
    const outsideDir = join(root, 'outside');
    await mkdir(outsideDir, {recursive: true});
    await writeFile(join(outsideDir, 'outside.mp4'), 'not-a-real-video-but-non-empty', 'utf8');

    const mediaPath = join(packageRoot, '02-visuals', 'MEDIA-PLAN.json');
    const media = JSON.parse(await readFile(mediaPath, 'utf8'));
    media.status = 'READY';
    media.assets = [{
      assetId: 'escape-001',
      chapterId: 'chapter-01',
      purpose: 'Path containment regression test',
      mediaType: 'VIDEO',
      sourceType: 'USER_PROVIDED',
      localFile: '../../../../../../outside/outside.mp4',
      sha256: 'a'.repeat(64),
      rightsVerified: true,
      status: 'APPROVED',
      requiredForRender: true,
    }];
    await writeFile(mediaPath, `${JSON.stringify(media, null, 2)}\n`, 'utf8');

    const result = run(releaseCheck, [packageRoot], root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /localFile verlässt das Longform-Paket/);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('Longform-v1 release contract keeps render-lock and Git-HEAD integrity checks', async () => {
  const source = await readFile(releaseCheck, 'utf8');
  assert.match(source, /renderLock\.gitHead/);
  assert.match(source, /Git-HEAD weicht vom Render-Lock ab/);
  assert.match(source, /RENDER-LOCK-SHA stimmt nicht mehr/);
  assert.match(source, /Export-Pfad verlässt 05-export/);
  assert.match(source, /Review-Master liegt außerhalb des Longform-Pakets/);
});
