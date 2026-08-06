#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const finalMode = args.includes('--final');
if (!projectArg) {
  console.error('Nutzung: node scripts/validate-reel-v3.mjs <reel-ordner> [--final]');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const fileExists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readText = (file) => fs.readFileSync(file, 'utf8');
const asNumber = (value) => Number(value);

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  console.error(`Reel-Ordner fehlt: ${projectRoot}`);
  process.exit(1);
}

const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
const syncFile = path.join(projectRoot, 'timeline', 'final-sync.json');
const scriptFile = path.join(projectRoot, '01-voice-script', 'script-fliesstext.txt');
const beatsFile = path.join(projectRoot, '03-szenen', 'semantic-beats.json');

for (const file of [packageFile, syncFile, scriptFile, beatsFile]) {
  if (!fileExists(file)) fail(`Pflichtdatei fehlt: ${path.relative(projectRoot, file)}`);
}

let reel = null;
let sync = null;
let beatsDocument = null;
try { if (fileExists(packageFile)) reel = readJson(packageFile); } catch (error) { fail(`Reel-Vertrag ungültig: ${error.message}`); }
try { if (fileExists(syncFile)) sync = readJson(syncFile); } catch (error) { fail(`final-sync.json ungültig: ${error.message}`); }
try { if (fileExists(beatsFile)) beatsDocument = readJson(beatsFile); } catch (error) { fail(`semantic-beats.json ungültig: ${error.message}`); }

let wordCount = null;
let sentenceCount = null;
if (fileExists(scriptFile)) {
  const script = readText(scriptFile).trim();
  wordCount = script.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  sentenceCount = script.match(/[.!?](?:\s|$)/g)?.length ?? 0;
  if (wordCount < 125 || wordCount > 145) fail(`Script hat ${wordCount} Wörter; erlaubt sind 125 bis 145.`);
  if (sentenceCount !== 16) fail(`Acht Szenen benötigen genau 16 kurze Sätze; gefunden: ${sentenceCount}.`);
}

if (reel) {
  if (reel.standardId !== 'ki-animation-only-reel-v3') fail(`standardId muss ki-animation-only-reel-v3 sein; gefunden: ${reel.standardId}.`);
  if (asNumber(reel.composition?.width) !== 1080 || asNumber(reel.composition?.height) !== 1920 || asNumber(reel.composition?.fps) !== 30) fail('Format muss 1080 × 1920 bei 30 FPS sein.');
  const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
  if (scenes.length !== 8) fail(`Dieses Reel benötigt acht Szenen; gefunden: ${scenes.length}.`);
  if (asNumber(reel.editorial?.sentencesPerScene) !== 2) fail('sentencesPerScene muss 2 sein.');
  if (asNumber(reel.audio?.playbackRate) !== 1) fail('Playback muss 1,00x sein.');
  if (reel.audio?.music !== false || !['off', false].includes(reel.audio?.soundMode)) fail('Musik und Soundeffekte müssen aus sein.');
  if (reel.media?.generatedSceneImagesAllowed !== false || reel.media?.stockSceneImagesAllowed !== false) fail('Szenenbilder und Stockbilder sind nicht erlaubt.');
  if (reel.captions?.mode !== 'dual-sentence-active-word') fail('Caption-Modus muss dual-sentence-active-word sein.');
  if (asNumber(reel.captions?.sentencesVisible) !== 2) fail('Es müssen genau zwei Untertitelsätze sichtbar sein.');
  if (reel.captions?.fullTextVisibleImmediately !== true) fail('Beide Sätze müssen sofort vollständig sichtbar sein.');
  if (reel.captions?.wordByWordRevealAllowed !== false) fail('Wort-für-Wort-Aufbau ist verboten.');
  if (reel.captions?.activeWordHighlight !== 'violet') fail('Das aktive Wort muss violett sein.');
  if (reel.captions?.progressIndicator !== 'none') fail('Eine Fortschrittslinie ist nicht erlaubt.');
  const bottomPx = asNumber(reel.captions?.bottomPx);
  if (bottomPx < 245 || bottomPx > 285) fail(`Untertitel müssen 245 bis 285 px über dem unteren Rand stehen; gefunden: ${bottomPx}.`);
  if (asNumber(reel.visual?.primaryVisualAreaPercentMin) < 60) fail('Das Hauptvisual muss mindestens ungefähr 60 Prozent der Animationsfläche nutzen.');
  if (asNumber(reel.visual?.primaryObjectsPerScene) !== 1) fail('Pro Szene ist genau ein Hauptobjekt erlaubt.');
  if (asNumber(reel.visual?.maximumSupportingElementsPerScene) > 2) fail('Maximal zwei unterstützende Elemente pro Szene.');
  if (reel.visual?.miniDashboardsAllowed !== false) fail('Mini-Dashboards müssen deaktiviert sein.');
  if (asNumber(reel.motion?.maximumStrongSimultaneousMotions) > 2) fail('Maximal zwei starke Bewegungen gleichzeitig.');
  if (asNumber(reel.motion?.maximumSemanticBeatsPerScene) > 3) fail('Maximal drei Sinnbeats pro Szene.');
}

if (beatsDocument) {
  const scenePlans = Array.isArray(beatsDocument.scenes) ? beatsDocument.scenes : [];
  if (scenePlans.length !== 8) fail(`semantic-beats.json benötigt acht Szenen; gefunden: ${scenePlans.length}.`);
  for (const scene of scenePlans) {
    const beats = Array.isArray(scene.beats) ? scene.beats : [];
    if (!scene.primaryObject) fail(`${scene.id}: primaryObject fehlt.`);
    if (beats.length < 1 || beats.length > 3) fail(`${scene.id}: 1 bis 3 Sinnbeats erforderlich; gefunden: ${beats.length}.`);
    for (const beat of beats) {
      for (const key of ['expression', 'visualReaction', 'transcriptTrigger', 'resultState']) {
        if (typeof beat?.[key] !== 'string' || beat[key].trim() === '') fail(`${scene.id}/${beat.id ?? 'Beat'}: ${key} fehlt.`);
      }
    }
  }
}

let maximumTriggerOffsetFrames = null;
let maximumBoundaryOffsetFrames = null;
let outroHoldSeconds = null;
let captionWordCount = 0;

if (sync) {
  const pairs = Array.isArray(sync.captionPairs) ? sync.captionPairs : [];
  if (pairs.length !== 8) fail(`final-sync benötigt acht Caption-Paare; gefunden: ${pairs.length}.`);
  for (const pair of pairs) {
    if (pair.mode !== 'dual-sentence-active-word') fail(`${pair.id}: falscher Caption-Modus.`);
    if (!Array.isArray(pair.sentences) || pair.sentences.length !== 2) fail(`${pair.id}: exakt zwei Sätze erforderlich.`);
    const bottomPx = asNumber(pair.bottomPx);
    if (bottomPx < 245 || bottomPx > 285) fail(`${pair.id}: bottomPx muss 245 bis 285 sein.`);
    for (const sentence of pair.sentences ?? []) {
      const words = Array.isArray(sentence.words) ? sentence.words : [];
      captionWordCount += words.length;
      if (!sentence.text || words.length === 0) fail(`${sentence.id ?? pair.id}: Satztext oder Wortzeiten fehlen.`);
      let cursor = asNumber(sentence.startFrame);
      for (const word of words) {
        const start = asNumber(word.startFrame);
        const end = asNumber(word.endFrame);
        if (!word.text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) fail(`${sentence.id}: ungültiges Wort-Timing.`);
        if (start < cursor) fail(`${sentence.id}: Wortzeiten überlappen oder sind unsortiert.`);
        if (start < asNumber(sentence.startFrame) || end > asNumber(sentence.endFrame)) fail(`${sentence.id}: Wort liegt außerhalb der Satzzeit.`);
        cursor = end;
      }
    }
  }

  if (finalMode) {
    if (sync.status !== 'final-transcript-aligned') fail('Finaler Modus benötigt status final-transcript-aligned.');
    const speechStart = asNumber(sync.audio?.speechStartSeconds);
    const speechEnd = asNumber(sync.audio?.speechEndSeconds);
    const durationFrames = asNumber(sync.composition?.durationInFrames);
    if (![speechStart, speechEnd, durationFrames].every(Number.isFinite)) fail('Finale Audio- oder Composition-Zeiten fehlen.');
    if (speechStart > 0.6) fail(`Sprachbeginn ${speechStart.toFixed(2)} s; maximal 0,60 s.`);
    outroHoldSeconds = durationFrames / 30 - speechEnd;
    if (outroHoldSeconds < 1.2 || outroHoldSeconds > 2.2) fail(`Schluss-Hold ${outroHoldSeconds.toFixed(2)} s; erlaubt 1,2 bis 2,2 s.`);

    const syncScenes = Array.isArray(sync.scenes) ? sync.scenes : [];
    if (syncScenes.length !== 8) fail(`final-sync benötigt acht Szenen; gefunden: ${syncScenes.length}.`);
    let cursor = 0;
    let boundaryMax = 0;
    for (const scene of syncScenes) {
      const start = asNumber(scene.startFrame);
      const end = asNumber(scene.endFrame);
      if (start !== cursor) fail(`${scene.id}: finale Szenen sind nicht lückenlos.`);
      if (end <= start) fail(`${scene.id}: ungültige finale Szenendauer.`);
      if (asNumber(scene.resultHoldFrames) < 30) fail(`${scene.id}: Ergebnis-Hold unter einer Sekunde.`);
      boundaryMax = Math.max(boundaryMax, Math.abs(end - asNumber(scene.boundaryReferenceFrame)));
      cursor = end;
    }
    if (cursor !== durationFrames) fail('Letzte Szene endet nicht am Composition-Ende.');
    maximumBoundaryOffsetFrames = boundaryMax;
    if (boundaryMax > 6) fail(`Szenengrenzen-Abweichung ${boundaryMax} Frames; maximal 6.`);

    const finalBeats = Array.isArray(sync.beats) ? sync.beats : [];
    let triggerMax = 0;
    const perScene = new Map();
    for (const beat of finalBeats) {
      const offset = Math.abs(asNumber(beat.animationStartFrame) - asNumber(beat.transcriptStartFrame));
      triggerMax = Math.max(triggerMax, offset);
      perScene.set(beat.sceneId, (perScene.get(beat.sceneId) ?? 0) + 1);
    }
    for (const [sceneId, count] of perScene) if (count < 1 || count > 3) fail(`${sceneId}: finale Beat-Zahl ${count}; erlaubt 1 bis 3.`);
    maximumTriggerOffsetFrames = triggerMax;
    if (triggerMax > 5) fail(`Trigger-Abweichung ${triggerMax} Frames; maximal 5.`);

    const firstPairStart = Math.min(...pairs.map((pair) => asNumber(pair.startFrame)));
    const speechStartFrame = Math.round(speechStart * 30);
    if (firstPairStart > speechStartFrame + 3) fail(`Erstes Untertitelpaar startet ${firstPairStart - speechStartFrame} Frames zu spät.`);
  } else if (sync.status === 'final-transcript-aligned') {
    warn('Planungsprüfung verwendet bereits finale Sync-Daten.');
  }
}

if (finalMode) {
  const audioFolder = path.join(projectRoot, '02-audio');
  const supported = new Set(['.wav', '.mp3', '.m4a', '.aac', '.ogg', '.mp4', '.mov', '.webm']);
  const audioFiles = fs.existsSync(audioFolder)
    ? fs.readdirSync(audioFolder).filter((name) => supported.has(path.extname(name).toLowerCase()) && fs.statSync(path.join(audioFolder, name)).size > 0)
    : [];
  if (audioFiles.length !== 1) fail(`02-audio benötigt genau eine Datei; gefunden: ${audioFiles.length}.`);

  const sourceDir = path.resolve(technicalRoot, 'ki', 'src', 'reels', 'why-ai-forgets-earlier-messages');
  if (!fs.existsSync(sourceDir)) fail(`Produktionscode fehlt: ${sourceDir}`);
  else {
    const sourceFiles = [];
    const visit = (directory) => {
      for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(target);
        else if (/\.(?:ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')) sourceFiles.push(target);
      }
    };
    visit(sourceDir);
    const source = sourceFiles.map(readText).join('\n');
    if (!/DualSentenceKaraokeCaption/.test(source)) fail('Produktionscode muss DualSentenceKaraokeCaption verwenden.');
    if (/StableSentenceCaption/.test(source)) fail('Alte StableSentenceCaption darf im v3-Produktionscode nicht aktiv sein.');
    if (/single-violet-line|progressIndicator/.test(source)) fail('Eine Fortschrittslinie ist im v3-Produktionscode nicht erlaubt.');
    if (/visibleCount|slice\s*\(\s*0\s*,/i.test(source)) fail('Wort-für-Wort-Enthüllung ist nicht erlaubt.');
    if (!/(final-sync\.json|CONTEXT_CAPTION_PAIRS)/.test(source)) fail('Produktionscode verweist nicht auf finale Sync-Daten.');
  }
}

const report = {
  version: 1,
  standardId: reel?.standardId ?? null,
  checkedAt: new Date().toISOString(),
  mode: finalMode ? 'final' : 'planning',
  metrics: {wordCount, sentenceCount, captionPairCount: sync?.captionPairs?.length ?? 0, captionWordCount, maximumTriggerOffsetFrames, maximumBoundaryOffsetFrames, outroHoldSeconds},
  errors,
  warnings,
  passed: errors.length === 0,
};

const reviewRoot = path.join(projectRoot, '05-review');
fs.mkdirSync(reviewRoot, {recursive: true});
const reportFile = path.join(reviewRoot, 'v3-standard-report.json');
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

for (const message of warnings) console.warn(`WARNUNG: ${message}`);
for (const message of errors) console.error(`FEHLER: ${message}`);
if (errors.length > 0) process.exit(1);
console.log(`✓ v3-Standard bestanden: ${wordCount} Wörter, ${sync?.captionPairs?.length ?? 0} Untertitelpaare.`);
console.log(`Bericht: ${path.relative(technicalRoot, reportFile)}`);
