#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import process from 'node:process';

const [rawTitle, rawDate] = process.argv.slice(2);

const fail = (message) => {
  console.error(`LONGFORM GENERATOR FAILED: ${message}`);
  process.exit(1);
};

if (!rawTitle?.trim()) {
  fail('Aufruf: node scripts/new-ki-longform.mjs "Video Titel" [YYYY-MM-DD]');
}

const parseDate = (value) => {
  if (!value) return new Date();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail('Datum muss YYYY-MM-DD sein.');
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    fail('Ungültiges Datum.');
  }
  return parsed;
};

const slugify = (value) => value
  .trim()
  .replace(/ä/gi, (match) => (match === 'Ä' ? 'Ae' : 'ae'))
  .replace(/ö/gi, (match) => (match === 'Ö' ? 'Oe' : 'oe'))
  .replace(/ü/gi, (match) => (match === 'Ü' ? 'Ue' : 'ue'))
  .replace(/ß/g, 'ss')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const selectedDate = parseDate(rawDate);
const publishDate = selectedDate.toISOString().slice(0, 10);
const title = rawTitle.trim();
const titleSlug = slugify(title);
if (!titleSlug) fail('Titel ergibt keinen gültigen Dateinamen.');

const dateRoot = resolve('ki', 'youtube-longform', publishDate);
await mkdir(dateRoot, {recursive: true});
const entries = await readdir(dateRoot, {withFileTypes: true});
const usedIndexes = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1]))
  .filter(Number.isFinite);
let index = 1;
while (usedIndexes.includes(index)) index += 1;
if (index > 99) fail(`${publishDate} enthält bereits 99 Longform-Pakete.`);

const packageName = `${String(index).padStart(2, '0')}_${titleSlug}`;
const packageRoot = join(dateRoot, packageName);
if (existsSync(packageRoot)) fail(`Paket existiert bereits: ${packageRoot}`);

const sourceSlug = `${publishDate}-${titleSlug}`.toLowerCase();
const sourceRoot = resolve('ki', 'src', 'longform', sourceSlug);
if (existsSync(sourceRoot)) fail(`Source-Ordner existiert bereits: ${sourceRoot}`);

const directories = [
  '01-script-audio',
  '02-visuals',
  '02-visuals/images',
  '02-visuals/broll',
  '02-visuals/official',
  '02-visuals/generated',
  '03-thumbnail',
  '04-metadata',
  '05-export',
  '06-projektdateien',
];
for (const directory of directories) await mkdir(join(packageRoot, directory), {recursive: true});
await mkdir(sourceRoot, {recursive: true});

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const write = (relativePath, content) => writeFile(join(packageRoot, relativePath), content, 'utf8');

await write('README.md', `# ${title}\n\n**Format:** YouTube Longform v1  \n**Datum:** ${publishDate}  \n**Status:** DRAFT  \n**Source:** \`ki/src/longform/${sourceSlug}/\`\n\n## Produktionslogik\n\n1. Research, Kapitel und Claims schließen.\n2. Echtes Voiceover in \`01-script-audio/\` hinterlegen.\n3. Forced Alignment / reale Timings ableiten.\n4. Visuals und B-Roll claim- und storygebunden planen.\n5. Medienrechte/Provenance prüfen und Medien lokal materialisieren.\n6. Remotion-Source bauen; Animation ist story-driven und nicht auf eine Technik-Whitelist begrenzt.\n7. SRT/VTT, Thumbnail-Varianten, Master und Upload-Paket erzeugen.\n8. Technische Gates plus vollständigen visuellen/akustischen Review durchführen.\n\nVertrag: \`ki/youtube-longform/LONGFORM-V1.md\`.\n`);

await write('01-script-audio/SCRIPT.md', `# Sprechertext — ${title}\n\nStatus: DRAFT\n\n> Finalen deutschen Sprechertext hier eintragen. Das Produktions-Voiceover kommt ausschließlich vom Nutzer.\n`);
await write('01-script-audio/CHAPTERS.json', json({
  version: 1,
  status: 'DRAFT',
  chapters: [],
}));
await write('01-script-audio/CLAIMS.json', json({
  version: 1,
  status: 'DRAFT',
  claims: [],
}));

await write('02-visuals/MEDIA-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  policy: {
    renderTimeRemoteDownloadsAllowed: false,
    rightsVerificationRequired: true,
    localMaterializationRequired: true,
    generatedMediaMayProveRealWorldClaims: false,
    approvedSourceTypes: [
      'USER_PROVIDED',
      'OFFICIAL_SOURCE',
      'WIKIMEDIA_COMMONS',
      'OPEN_LICENSE_VERIFIED',
      'LICENSED_SOURCE_VERIFIED',
      'GENERATED_NON_EVIDENTIARY'
    ]
  },
  assets: [],
}));
for (const directory of ['images', 'broll', 'official', 'generated']) {
  await write(`02-visuals/${directory}/.gitkeep`, '');
}

await write('03-thumbnail/THUMBNAIL-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  promise: '',
  variants: [
    {id: 'A', concept: '', status: 'DRAFT'},
    {id: 'B', concept: '', status: 'DRAFT'},
    {id: 'C', concept: '', status: 'DRAFT'}
  ],
  selectedVariant: null,
}));

await write('04-metadata/YOUTUBE.md', `# YouTube-Metadaten\n\n## Titel\n\nTBD\n\n## Beschreibung\n\nTBD\n\n## Kapitel\n\nWerden nach finalem Voice-Lock aus den realen Timings erzeugt.\n\n## Untertitel\n\nFinale \`.srt\`- und \`.vtt\`-Dateien gehören ins Export-Paket.\n`);
await write('05-export/.gitkeep', '');

await write('06-projektdateien/LONGFORM-VERSION.json', json({
  version: 1,
  contract: 'LONGFORM_V1',
  publishDate,
  title,
  sourceSlug,
  format: {width: 1920, height: 1080, fps: 30, aspectRatio: '16:9'},
  animationFreedom: 'OPEN_ENDED_STORY_DRIVEN',
  status: 'DRAFT',
}));
await write('06-projektdateien/RELEASE-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  requiredDeliverables: [
    'video.mp4',
    'thumbnail-selected.png',
    'title.txt',
    'description.md',
    'chapters.txt',
    'subtitles.srt',
    'subtitles.vtt',
    'transcript.txt',
    'sources.md',
    'manifest.json'
  ],
  technicalChecksComplete: false,
  visualReviewComplete: false,
  audioReviewComplete: false,
  sourceReviewComplete: false,
}));
await write('06-projektdateien/REVIEW-CHECKLIST.md', `# Longform Final Review\n\n- [ ] finales Voiceover vorhanden und real gemessen\n- [ ] Kapitel folgen dem realen Voiceover\n- [ ] alle faktischen Claims in CLAIMS.json geprüft\n- [ ] alle externen Medien in MEDIA-PLAN.json mit Herkunft/Rechten dokumentiert\n- [ ] keine Remote-Medien werden zur Renderzeit geladen\n- [ ] reale Claims werden nicht durch KI-generierte Fake-Belege dargestellt\n- [ ] Motion-Dichte folgt der Story; keine Dauerbewegung als Selbstzweck\n- [ ] B-Roll/Bilder/3D/UI/Charts sind sinnvoll lesbar auf Laptop und TV\n- [ ] SFX unterstützen Bedeutung und erzeugen keine Fatigue\n- [ ] SRT und VTT geprüft\n- [ ] Thumbnail-Varianten geprüft; gewählte Variante hält das Video-Versprechen ein\n- [ ] Smoke/TypeScript/Test/Render nur als bestanden markiert, wenn tatsächlich ausgeführt\n- [ ] kompletter Master einmal visuell und akustisch geprüft\n`);

await writeFile(join(sourceRoot, 'README.md'), `# ${title} — Remotion Source\n\nProduktionspaket: \`ki/youtube-longform/${publishDate}/${packageName}/\`\n\nDieser Ordner ist für den ausführbaren Longform-Source vorgesehen. Vor Implementierung \`ki/src/longform/AGENTS.md\` und \`ki/youtube-longform/LONGFORM-V1.md\` lesen.\n`, 'utf8');

console.log('LONGFORM V1 PACKAGE CREATED');
console.log(`package: ${packageRoot}`);
console.log(`source: ${sourceRoot}`);
console.log('next: research → chapters/claims → voiceover → timing → media/motion → render/review/export');
