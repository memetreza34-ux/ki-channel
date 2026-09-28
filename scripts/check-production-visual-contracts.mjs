import {access, readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const STUDIO_ROOT_PATH = resolve('ki/src/Root.tsx');
const PRODUCTION_ROOT_PATH = resolve('ki/src/ProductionRoot.tsx');
const PRODUCTION_ENTRY_PATH = resolve('ki/src/production-entry.tsx');

const [studioRootSource, productionRootSource, productionEntrySource] = await Promise.all([
  readFile(STUDIO_ROOT_PATH, 'utf8'),
  readFile(PRODUCTION_ROOT_PATH, 'utf8'),
  readFile(PRODUCTION_ENTRY_PATH, 'utf8'),
]);
const failures = [];

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const hasStaticVoiceoverImport = (source) =>
  /01-script-audio\/voiceover\.(?:wav|mp3|mp4|m4a|aac|ogg)/i.test(source) ||
  /import\s+voiceover[A-Za-z0-9_]*\s+from\s+['"]/i.test(source);

if (hasStaticVoiceoverImport(productionRootSource)) {
  failures.push(
    'ProductionRoot.tsx darf optionale Phase-2-Voiceover-Dateien nicht statisch importieren; echtes Audio wird in Phase 3 als voiceoverSrc-Prop übergeben.',
  );
}
if (!studioRootSource.includes("from './ProductionRoot'")) {
  failures.push('Root.tsx muss ProductionRoot als einzige Production-Registrierung einbinden.');
}
if (!studioRootSource.includes("from './motion-system/MotionPreviewRoot'")) {
  failures.push('Root.tsx muss MotionPreviewRoot nur als Studio-/Preview-Erweiterung einbinden.');
}
if (!studioRootSource.includes("from './art-direction/ArtDirectionPreviewRoot'")) {
  failures.push('Root.tsx muss das Art-Direction Lab ausschließlich als Studio-/Preview-Erweiterung einbinden.');
}
if (/from\s+['"]\.\/(?:reels|longform)\//.test(studioRootSource)) {
  failures.push('Root.tsx darf keine Production-Reels/Longform direkt importieren; diese Liste gehört ausschließlich in ProductionRoot.tsx.');
}
if (!productionEntrySource.includes("from './ProductionRoot'")) {
  failures.push('production-entry.tsx muss ausschließlich den kanonischen ProductionRoot registrieren.');
}
if (!productionEntrySource.includes('registerRoot(ProductionRoot)')) {
  failures.push('production-entry.tsx registriert ProductionRoot nicht.');
}
if (
  productionEntrySource.includes('MotionPreviewRoot') ||
  productionEntrySource.includes('motion-system/') ||
  productionEntrySource.includes('ArtDirectionPreviewRoot') ||
  productionEntrySource.includes('art-direction/')
) {
  failures.push('production-entry.tsx darf keinerlei Motion-/Art-Direction-Preview-System importieren.');
}
if (productionRootSource.includes('ArtDirectionPreviewRoot') || productionRootSource.includes('art-direction/')) {
  failures.push('ProductionRoot.tsx darf das Art-Direction Lab nicht registrieren; es ist nur für Studio-Kalibrierung gedacht.');
}

const registeredModulePaths = [
  ...productionRootSource.matchAll(/from\s+['"](\.\/(?:reels|longform)\/[^'"]+)['"]/g),
].map((match) => match[1]);

const uniqueModulePaths = [...new Set(registeredModulePaths)];
if (uniqueModulePaths.length === 0) {
  throw new Error('ProductionRoot.tsx enthält keine registrierten Production-Reel-/Longform-Module.');
}

for (const modulePath of uniqueModulePaths) {
  const directory = resolve('ki/src', modulePath.replace(/^\.\//, ''));
  if (!(await exists(directory))) {
    failures.push(`${modulePath}: Production-Modulordner fehlt.`);
    continue;
  }

  const visualProfilesPath = resolve(directory, 'visualProfiles.ts');
  if (!(await exists(visualProfilesPath))) {
    failures.push(`${modulePath}: visualProfiles.ts fehlt.`);
    continue;
  }

  const entries = await readdir(directory, {withFileTypes: true});
  const contractCandidates = entries
    .filter((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))
    .map((entry) => resolve(directory, entry.name));
  const sources = await Promise.all(
    contractCandidates.map(async (path) => ({path, source: await readFile(path, 'utf8')})),
  );

  const gateSources = sources.filter(({source}) =>
    source.includes('assertAuthoredVisualDiversity'),
  );
  if (gateSources.length === 0) {
    failures.push(
      `${modulePath}: kein Production-Source erzwingt assertAuthoredVisualDiversity.`,
    );
  }

  const profileSource = await readFile(visualProfilesPath, 'utf8');
  if (!profileSource.includes('fingerprint')) {
    failures.push(`${modulePath}: visualProfiles.ts enthält keine Visual Fingerprints.`);
  }
}

const reelModules = uniqueModulePaths.filter((path) => path.startsWith('./reels/'));
const longformModules = uniqueModulePaths.filter((path) => path.startsWith('./longform/'));

if (reelModules.length !== 13) {
  failures.push(
    `ProductionRoot.tsx erwartet derzeit 13 Short-Form-Production-Module, gefunden: ${reelModules.length}. ` +
      'Wenn ein Reel hinzugefügt oder entfernt wurde, diesen Guard bewusst aktualisieren.',
  );
}
if (longformModules.length !== 1) {
  failures.push(
    `ProductionRoot.tsx erwartet derzeit 1 Longform-Production-Modul, gefunden: ${longformModules.length}. ` +
      'Wenn Longform erweitert wurde, diesen Guard bewusst aktualisieren.',
  );
}

if (failures.length > 0) {
  console.error('Production-Visual-Contract-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Production-Visual-Contract-Gate bestanden: ${reelModules.length} Short-Form + ${longformModules.length} Longform Module besitzen visualProfiles.ts und einen aktiven Authored-Diversity-Gate; Art-Direction-/Motion-Labs bleiben Studio-only und Production bleibt ohne optionales Phase-2-Audio bundelbar.`,
);
