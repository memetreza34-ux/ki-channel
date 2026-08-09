import {access, readFile} from 'node:fs/promises';

const failures = [];
const warnings = [];

const readJson = async (path) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    failures.push(`${path} fehlt oder enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const readText = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    failures.push(`${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
};

const assertFile = async (path) => {
  try {
    await access(path);
  } catch {
    failures.push(`Pflichtdatei fehlt: ${path}`);
  }
};

const root = await readJson('package.json');
const core = await readJson('core/package.json');
const ki = await readJson('ki/package.json');
const vitest = await readText('vitest.config.ts');
const gemini = await readText('GEMINI.md');

if (root) {
  const expectedWorkspaces = ['core', 'ki'];
  if (JSON.stringify(root.workspaces) !== JSON.stringify(expectedWorkspaces)) {
    failures.push(`package.json workspaces müssen exakt ${expectedWorkspaces.join(', ')} sein.`);
  }
  if (root.name !== 'ki-channel') failures.push('package.json name muss ki-channel sein.');
  if (root.engines?.node !== '>=20 <21') {
    failures.push('package.json muss Node 20 als kanonische Engine festlegen (>=20 <21).');
  }

  const requiredScripts = {
    'ki:reel:structure-check': 'node scripts/check-ki-reel-folder-structure.mjs',
    'repo:wiring-check': 'node scripts/check-repository-wiring.mjs',
    'content:runtime:verify': 'node scripts/verify-content-matched-runtime.mjs',
    'release:verify': 'node scripts/run-content-release.mjs verify',
    'release:smoke': 'node scripts/run-content-release.mjs smoke',
    'release:full': 'node scripts/run-content-release.mjs full',
    'new-video': 'node scripts/new-ki-reel.mjs',
  };
  for (const [name, command] of Object.entries(requiredScripts)) {
    if (root.scripts?.[name] !== command) {
      failures.push(`package.json script ${name} muss exakt "${command}" sein.`);
    }
  }

  const serializedScripts = JSON.stringify(root.scripts ?? {});
  const deadLegacyTargets = [
    'validate-worktree-rules.mjs',
    'validate-channels.mjs',
    'validate-studio-skills.mjs',
    'validate-motion-router.mjs',
    'scripts/typecheck.mjs',
    'scripts/new-channel.sh',
    'route-motion-beats.mjs',
    'prepare-voiceover.mjs',
    'transcribe.mjs',
    'ingest.mjs',
    'icons-index.mjs',
  ];
  for (const target of deadLegacyTargets) {
    if (serializedScripts.includes(target)) failures.push(`Totes Legacy-Skript ist wieder eingetragen: ${target}`);
  }
}

if (core) {
  if (core.name !== '@studio/core') failures.push('core/package.json name muss @studio/core sein.');
  if (core.exports?.['.']?.import !== './brand-kit/index.ts') {
    failures.push('core/package.json muss @studio/core auf ./brand-kit/index.ts exportieren.');
  }
}

if (ki) {
  if (ki.name !== '@studio/ki') failures.push('ki/package.json name muss @studio/ki sein.');
  if (ki.dependencies?.['@studio/core'] !== '*') {
    failures.push('ki/package.json muss @studio/core als Workspace-Abhängigkeit deklarieren.');
  }
}

if (!vitest.includes("'ki/**/*.{test,spec}.{ts,tsx}'")) {
  failures.push('vitest.config.ts muss Tests unter ki/** einschließen.');
}
if (vitest.includes("'channels/**/*.{test,spec}.{ts,tsx}'")) {
  failures.push('vitest.config.ts enthält wieder den entfernten channels/** Legacy-Testpfad.');
}

if (gemini.includes('--workspaces=false')) {
  failures.push('GEMINI.md darf Workspace-Fehler nicht mit --workspaces=false umgehen.');
}
if (gemini.includes('channels/ki')) {
  failures.push('GEMINI.md enthält den entfernten channels/ki Legacy-Pfad.');
}

for (const path of [
  'core/brand-kit/index.ts',
  'ki/brand/brand.ts',
  'ki/AGENTS.md',
  'ki/reels/AGENTS.md',
  'ki/tsconfig.motion.json',
  'ki/tsconfig.animation-library.json',
  'scripts/check-ki-reel-folder-structure.mjs',
  'scripts/prepare-codex-reel.mjs',
  'scripts/verify-content-matched-runtime.mjs',
  'scripts/run-content-release.mjs',
]) {
  await assertFile(path);
}

try {
  await access('package-lock.json');
} catch {
  warnings.push('package-lock.json fehlt noch; Installationen sind bis zur Lockfile-Erzeugung nicht vollständig reproduzierbar.');
}

if (warnings.length > 0) {
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
}

if (failures.length > 0) {
  console.error('Repository-Wiring fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Repository-Wiring bestanden: Workspaces, Kernpfade, Testpfade und kanonische Entry-Points sind konsistent.');
