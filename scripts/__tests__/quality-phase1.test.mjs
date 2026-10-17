import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const runner = resolve('scripts/phase1-chat-links.mjs');

const makeFixture = async ({status = 'FERTIG', imageStatus = 'NICHT BENÖTIGT - REMOTION_NATIVE', addImage = true, longform = false} = {}) => {
  const root = await mkdtemp(join(tmpdir(), 'phase-one-handoff-'));
  const video = longform
    ? 'ki/youtube-longform/2026-10-17/01_Longform-Test'
    : 'ki/reels/2026-10-12_bis_2026-10-18/01_Test-Video';
  const imageDir = longform ? '02-visuals' : '02-bilder';
  await mkdir(join(root, video, imageDir), {recursive: true});
  await mkdir(join(root, video, '01-script-audio'), {recursive: true});
  await mkdir(join(root, video, '06-projektdateien'), {recursive: true});
  await writeFile(join(root, video, '06-projektdateien/PHASE-STATUS.md'),
    '# Produktionsstatus\n\n## Phase 1 — ChatGPT\n\n**Status:** ' + status + '\n\n## Phase 2 — Mensch\n**Status:** WARTET\n');
  if (addImage) await writeFile(join(root, video, imageDir, 'image-prompts.md'),
    '# Bildkonzept\n\n**Status:** ' + imageStatus + '\n\nKeine externen Bilder erforderlich. Diagramme aus Remotion.\n');
  await writeFile(join(root, video, '01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt'),
    'Dies ist ein vollständiger finaler Sprechertext zum Testen der Phase-1-Link-Übergabe, ohne Platzhalter.');
  const run = () => spawnSync(process.execPath, [runner, video, '--ref=feature/video-test'], {cwd: root, encoding: 'utf8'});
  return {root, run};
};

test('fertiges Reel liefert genau Bildprompt- und Skript-Dateilink', async () => {
  const f = await makeFixture();
  try {
    const p = f.run();
    assert.equal(p.status, 0, p.stderr);
    assert.match(p.stdout, /Bildprompt-Link.*\/02-bilder\/image-prompts\.md/);
    assert.match(p.stdout, /Skript-Link.*\/01-script-audio\/VOICEOVER-ZUM-KOPIEREN\.txt/);
    assert.match(p.stdout, /blob\/feature\/video-test\//);
    assert.match(p.stdout, /Keine externen Bilder erforderlich/);
  } finally {await rm(f.root, {recursive: true, force: true});}
});

test('kein Handoff ohne nachgewiesenen Phase-1-Status', async () => {
  const f = await makeFixture({status: 'WARTET AUF PHASE 1 CI'});
  try {
    const p = f.run();
    assert.notEqual(p.status, 0);
    assert.match(p.stderr, /BLOCKIERT/);
    assert.doesNotMatch(p.stdout, /Bildprompt-Link/);
  } finally {await rm(f.root, {recursive: true, force: true});}
});

test('kein Link zu einer fehlenden Bilddatei', async () => {
  const f = await makeFixture({addImage: false});
  try {
    const p = f.run();
    assert.notEqual(p.status, 0);
    assert.match(p.stderr, /BLOCKIERT/);
  } finally {await rm(f.root, {recursive: true, force: true});}
});

test('kein Handoff mit unfertigem Bildprompt', async () => {
  const f = await makeFixture({imageStatus: 'OFFEN'});
  try {
    const p = f.run();
    assert.notEqual(p.status, 0);
    assert.match(p.stderr, /noch offen/);
  } finally {await rm(f.root, {recursive: true, force: true});}
});

test('Longform verweist auf 02-visuals', async () => {
  const f = await makeFixture({longform: true, status: 'CODE- UND PLANUNGSGRUNDLAGE VOLLSTÄNDIG ANGELEGT'});
  try {
    const p = f.run();
    assert.equal(p.status, 0, p.stderr);
    assert.match(p.stdout, /ki\/youtube-longform\/2026-10-17\/01_Longform-Test\/02-visuals\/image-prompts\.md/);
  } finally {await rm(f.root, {recursive: true, force: true});}
});
