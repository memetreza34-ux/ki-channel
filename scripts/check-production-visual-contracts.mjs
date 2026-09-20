import {access, readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const ROOT_PATH = resolve('ki/src/Root.tsx');
const rootSource = await readFile(ROOT_PATH, 'utf8');
const failures = [];

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

if (/01-script-audio\/voiceover\.(?:wav|mp3|mp4|m4a|aac|ogg)/i.test(rootSource)) {
  failures.push(
    'Root.tsx darf optionale Phase-2-Voiceover-Dateien nicht statisch importieren; echtes Audio wird in Phase 3 als voiceoverSrc-Prop übergeben.',
  );
}
if (/import\s+voiceover[A-Za-z0-9_]*\s+from\s+['"]/i.test(rootSource)) {
  failures.push(
    'Root.tsx enthält einen direkten Voiceover-Import. Der kanonische Production-Root muss auch ohne Phase-2-Audio bundlen.',
  );
}

const registeredModulePaths = [
  ...rootSource.matchAll(/from\s+['"](\.\/(?:reels|longform)\/[^'"]+)['"]/g),
].map((match) => match[1]);

const uniqueModulePaths = [...new Set(registeredModulePaths)];
if (uniqueModulePaths.length === 0) {
  throw new Error('Root.tsx enthält keine registrierten Production-Reel-/Longform-Module.');
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

if (reelModules.length !== 9) {
  failures.push(
    `Root.tsx erwartet derzeit 9 Short-Form-Production-Module, gefunden: ${reelModules.length}. ` +
      'Wenn ein Reel hinzugefügt oder entfernt wurde, diesen Guard bewusst aktualisieren.',
  );
}
if (longformModules.length !== 1) {
  failures.push(
    `Root.tsx erwartet derzeit 1 Longform-Production-Modul, gefunden: ${longformModules.length}. ` +
      'Wenn Longform erweitert wurde, diesen Guard bewusst aktualisieren.',
  );
}

if (failures.length > 0) {
  console.error('Production-Visual-Contract-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Production-Visual-Contract-Gate bestanden: ${reelModules.length} Short-Form + ${longformModules.length} Longform Module besitzen visualProfiles.ts, einen aktiven Authored-Diversity-Gate und der Root bleibt ohne optionales Phase-2-Audio bundelbar.`,
);
