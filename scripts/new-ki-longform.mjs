#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import process from 'node:process';

const [rawTitle, rawDate] = process.argv.slice(2);
const fail = (message) => { console.error(`LONGFORM GENERATOR FAILED: ${message}`); process.exit(1); };
if (!rawTitle?.trim()) fail('Aufruf: node scripts/new-ki-longform.mjs "Video Titel" [YYYY-MM-DD]');

const parseDate = (value) => {
  if (!value) return new Date();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail('Datum muss YYYY-MM-DD sein.');
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail('Ungültiges Datum.');
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
const usedIndexes = entries.filter((entry) => entry.isDirectory()).map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1])).filter(Number.isFinite);
let index = 1;
while (usedIndexes.includes(index)) index += 1;
if (index > 99) fail(`${publishDate} enthält bereits 99 Longform-Pakete.`);
const packageName = `${String(index).padStart(2, '0')}_${titleSlug}`;
const packageRoot = join(dateRoot, packageName);
if (existsSync(packageRoot)) fail(`Paket existiert bereits: ${packageRoot}`);
const sourceSlug = `${publishDate}-${titleSlug}`.toLowerCase();
const sourceRoot = resolve('ki', 'src', 'longform', sourceSlug);
if (existsSync(sourceRoot)) fail(`Source-Ordner existiert bereits: ${sourceRoot}`);

for (const directory of [
  '01-script-audio', '02-visuals', '02-visuals/images', '02-visuals/broll', '02-visuals/official', '02-visuals/generated',
  '03-thumbnail', '04-metadata', '05-export', '06-projektdateien',
]) await mkdir(join(packageRoot, directory), {recursive: true});
await mkdir(sourceRoot, {recursive: true});

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const write = (relativePath, content) => writeFile(join(packageRoot, relativePath), content, 'utf8');

await write('README.md', `# ${title}\n\n**Format:** YouTube Longform v1  \n**Datum:** ${publishDate}  \n**Status:** DRAFT  \n**Source:** \`ki/src/longform/${sourceSlug}/\`\n\n## Produktionslogik\n\n1. Research, Claims, Kapitel und finalen Sprechertext schließen.\n2. Exakten gesprochenen Text in \`01-script-audio/VOICEOVER.txt\` und dieselben Sätze in \`CHAPTER-VOICE-MAP.json\` pflegen.\n3. \`CHOREOGRAPHY-PLAN.json\` semantisch planen: Sprachintervall + Visual ENTER/HOLD/EXIT + optional SFX.\n4. Nutzer legt nur das finale \`voiceover.wav|mp3\` ab.\n5. \`node scripts/sync-ki-longform.mjs <package>\` erzeugt Forced Alignment, unabhängigen Gegencheck, voice-gelockte Kapitel, Untertitel, aufgelöste Choreografie und \`TIMELINE-AUDIT.md\`.\n6. Visuals/B-Roll claim- und storygebunden materialisieren und freigeben.\n7. Remotion-Source muss \`createLongformChoreographyTiming()\` und die exakte \`CHOREOGRAPHY-RESOLVED.json\` konsumieren.\n8. Kanonischen Render ausschließlich über \`render-ki-longform-master.mjs\`; Render-Gate blockiert fehlenden Sync.\n\nVerträge: \`ki/youtube-longform/LONGFORM-V1.md\` und \`ki/youtube-longform/LONGFORM-SYNC.md\`.\n`);

await write('01-script-audio/SCRIPT.md', `# Sprechertext — ${title}\n\nStatus: DRAFT\n\n> Finalen deutschen Sprechertext hier redaktionell bearbeiten. Vor Aufnahme denselben finalen Wortlaut ohne Markdown in \`VOICEOVER.txt\` übernehmen und exakt in \`CHAPTER-VOICE-MAP.json\` segmentieren.\n`);
await write('01-script-audio/VOICEOVER.txt', '');
await write('01-script-audio/CHAPTER-VOICE-MAP.json', json({
  version: 1,
  status: 'DRAFT',
  rule: 'Concatenating every sentence.text in chapter order must reconstruct VOICEOVER.txt exactly after whitespace normalization.',
  chapters: [],
}));
await write('01-script-audio/CHAPTERS.json', json({version: 1, status: 'DRAFT', chapters: []}));
await write('01-script-audio/CLAIMS.json', json({version: 1, status: 'DRAFT', claims: []}));

await write('02-visuals/MEDIA-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  policy: {
    renderTimeRemoteDownloadsAllowed: false,
    rightsVerificationRequired: true,
    localMaterializationRequired: true,
    generatedMediaMayProveRealWorldClaims: false,
    approvedSourceTypes: ['USER_PROVIDED', 'OFFICIAL_SOURCE', 'WIKIMEDIA_COMMONS', 'OPEN_LICENSE_VERIFIED', 'LICENSED_SOURCE_VERIFIED', 'GENERATED_NON_EVIDENTIARY'],
  },
  assets: [],
}));
for (const directory of ['images', 'broll', 'official', 'generated']) await write(`02-visuals/${directory}/.gitkeep`, '');

await write('03-thumbnail/THUMBNAIL-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  promise: '',
  variants: [{id: 'A', concept: '', status: 'DRAFT'}, {id: 'B', concept: '', status: 'DRAFT'}, {id: 'C', concept: '', status: 'DRAFT'}],
  selectedVariant: null,
}));
await write('04-metadata/YOUTUBE.md', `# YouTube-Metadaten\n\n## Titel\n\nTBD\n\n## Beschreibung\n\nTBD\n\n## Kapitel\n\nWerden nach finalem Voice-Lock aus den realen Timings erzeugt.\n\n## Untertitel\n\n\`sync-ki-longform.mjs\` erzeugt voice-gelockte \`subtitles.srt\`, \`subtitles.vtt\` und \`transcript.txt\`.\n`);
await write('05-export/.gitkeep', '');

await write('06-projektdateien/CHOREOGRAPHY-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  authorityAfterAudio: '01-script-audio/WORD-TIMINGS.json',
  rules: {
    defaultEnterFrames: 8,
    defaultExitFrames: 8,
    minimumHoldFrames: 6,
    longformPacing: 'Semantic beats may hold for many seconds. Do not create a beat for every word; create a beat when the visual meaning/state should change.',
    alignmentConsensus: {medianStartDeltaMs: 100, p95StartDeltaMs: 220, maxAnchorDeltaMs: 220, maxAnyWordDeltaMs: 450},
  },
  beatSchemaExample: {
    id: 'ch1-b01',
    chapterId: 'chapter-01',
    sentenceId: 'ch1-s01',
    speech: {start: {type: 'PHRASE_START', phrase: 'exakte Wörter'}, end: {type: 'PHRASE_END', phrase: 'exakte Wörter'}},
    visual: {
      kind: 'NATIVE',
      target: 'semantic-target-id',
      start: {ref: 'speechStart', offsetFrames: -4},
      end: {ref: 'chapterEnd', offsetFrames: 0},
      enterFrames: 8,
      exitFrames: 8,
    },
  },
  beats: [],
}));
await write('06-projektdateien/LONGFORM-VERSION.json', json({
  version: 1,
  contract: 'LONGFORM_V1',
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  publishDate,
  title,
  sourceSlug,
  format: {width: 1920, height: 1080, fps: 30, aspectRatio: '16:9'},
  animationFreedom: 'OPEN_ENDED_STORY_DRIVEN',
  timingPolicy: {authority: 'FINAL_USER_VOICEOVER', endHoldFrames: 12},
  timingStatus: 'DRAFT',
  status: 'DRAFT',
}));
await write('06-projektdateien/RELEASE-PLAN.json', json({
  version: 1,
  status: 'DRAFT',
  requiredDeliverables: ['video.mp4', 'thumbnail-selected.png', 'title.txt', 'description.md', 'chapters.txt', 'subtitles.srt', 'subtitles.vtt', 'transcript.txt', 'sources.md', 'manifest.json'],
  technicalChecksComplete: false,
  visualReviewComplete: false,
  audioReviewComplete: false,
  sourceReviewComplete: false,
}));
await write('06-projektdateien/REVIEW-CHECKLIST.md', `# Longform Final Review\n\n- [ ] finales Nutzer-Voiceover vorhanden\n- [ ] VOICEOVER.txt entspricht dem tatsächlich eingesprochenen finalen Text\n- [ ] CHAPTER-VOICE-MAP rekonstruiert VOICEOVER.txt exakt\n- [ ] CHOREOGRAPHY-PLAN ist semantisch vollständig und status READY_FOR_ALIGNMENT oder PLANNED_REQUIRES_AUDIO_ALIGNMENT\n- [ ] WORD-TIMINGS.json = LOCAL_FORCED_ALIGNMENT_ACCEPTED\n- [ ] ALIGNMENT-QUALITY.json = ALIGNMENT_CONSENSUS_PASSED\n- [ ] CHOREOGRAPHY-RESOLVED.json = CHOREOGRAPHY_LOCKED\n- [ ] TIMELINE-AUDIT.md geprüft: Sprache ↔ ENTER/HOLD/EXIT ↔ SFX logisch\n- [ ] Remotion konsumiert createLongformChoreographyTiming + CHOREOGRAPHY-RESOLVED.json\n- [ ] alle faktischen Claims in CLAIMS.json geprüft\n- [ ] alle externen Medien in MEDIA-PLAN.json mit Herkunft/Rechten dokumentiert\n- [ ] keine Remote-Medien zur Renderzeit\n- [ ] reale Claims werden nicht durch KI-generierte Fake-Belege dargestellt\n- [ ] Motion-Dichte folgt der Story; kein Reel-Dauerfeuer\n- [ ] SFX unterstützen Bedeutung und erzeugen keine Fatigue\n- [ ] SRT/VTT/Transcript geprüft\n- [ ] Thumbnail-Varianten geprüft\n- [ ] Tests/Render nur als bestanden markiert, wenn tatsächlich ausgeführt\n- [ ] kompletter Master visuell und akustisch 1x geprüft\n`);

await writeFile(join(sourceRoot, 'README.md'), `# ${title} — Remotion Source\n\nProduktionspaket: \`ki/youtube-longform/${publishDate}/${packageName}/\`\n\nVor Implementierung \`ki/src/longform/AGENTS.md\`, \`ki/youtube-longform/LONGFORM-V1.md\` und \`ki/youtube-longform/LONGFORM-SYNC.md\` lesen. Finaler Source muss die aufgelöste Choreografie über \`createLongformChoreographyTiming()\` konsumieren.\n`, 'utf8');

console.log('LONGFORM V1 + EXPLICIT SYNC PACKAGE CREATED');
console.log(`package: ${packageRoot}`);
console.log(`source: ${sourceRoot}`);
console.log('next: research/script/map/choreography plan → user voiceover → sync-ki-longform → media/source → canonical render/review');
