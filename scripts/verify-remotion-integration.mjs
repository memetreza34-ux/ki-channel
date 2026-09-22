#!/usr/bin/env node
import {access, readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const failures = [];
const warnings = [];

const readText = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    failures.push(`${path} fehlt oder ist nicht lesbar: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
};

const readJson = async (path) => {
  const text = await readText(path);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    failures.push(`${path} enthält ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const requireFile = async (path) => {
  if (!(await exists(path))) failures.push(`Pflichtdatei fehlt: ${path}`);
};

const requireMarkers = (label, text, markers) => {
  for (const marker of markers) {
    if (!text.includes(marker)) failures.push(`${label}: Pflichtmarker fehlt: ${marker}`);
  }
};

const walkSource = async (root) => {
  if (!(await exists(root))) return [];
  const files = [];
  for (const entry of await readdir(root, {withFileTypes: true})) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await walkSource(path));
    else if (/\.(?:ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
};

const root = await readJson('package.json');
const studioEntry = await readText('ki/src/index.ts');
const studioRoot = await readText('ki/src/Root.tsx');
const productionEntry = await readText('ki/src/production-entry.tsx');
const productionRoot = await readText('ki/src/ProductionRoot.tsx');
const toolsRouting = await readText('ki/gehirn/WERKZEUGE.md');
const orchestrationSkill = await readText('ki/skills/remotion-production-orchestration/SKILL.md');
const builderAgent = await readText('.agents/agents/remotion-production-builder/agent.md');
const reviewerAgent = await readText('.agents/agents/remotion-release-reviewer/agent.md');

for (const path of [
  'ki/src/index.ts',
  'ki/src/Root.tsx',
  'ki/src/ProductionRoot.tsx',
  'ki/src/production-entry.tsx',
  'ki/skills/remotion-production-orchestration/SKILL.md',
  '.agents/agents/remotion-production-builder/agent.md',
  '.agents/agents/remotion-release-reviewer/agent.md',
  'ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md',
  'ki/gehirn/POST_RENDER_REVIEW.md',
  'ki/gehirn/CREATIVE_QA.md',
]) await requireFile(path);

if (root) {
  const sections = [root.dependencies ?? {}, root.devDependencies ?? {}, root.optionalDependencies ?? {}];
  const packages = Object.assign({}, ...sections);
  const remotionVersion = packages.remotion;

  if (!remotionVersion) {
    failures.push('package.json: `remotion` fehlt.');
  } else {
    if (/^[~^]/.test(remotionVersion)) {
      failures.push(`package.json: remotion muss exakt gepinnt sein, gefunden: ${remotionVersion}`);
    }

    const remotionPackages = Object.entries(packages)
      .filter(([name]) => name === 'remotion' || name.startsWith('@remotion/'));

    for (const [name, version] of remotionPackages) {
      if (version !== remotionVersion) {
        failures.push(`Remotion-Versionsmismatch: ${name}=${version}, erwartet ${remotionVersion}.`);
      }
      if (/^[~^]/.test(String(version))) {
        failures.push(`${name} muss exakt gepinnt sein, gefunden: ${version}.`);
      }
    }

    const requiredPackages = [
      'remotion',
      '@remotion/cli',
      '@remotion/captions',
      '@remotion/media-utils',
      '@remotion/paths',
      '@remotion/shapes',
      '@remotion/three',
      '@remotion/transitions',
    ];
    for (const name of requiredPackages) {
      if (!packages[name]) failures.push(`Remotion-Basispaket fehlt: ${name}.`);
    }
  }

  const requiredScripts = {
    'remotion:integration-check': 'node scripts/verify-remotion-integration.mjs',
    'remotion:studio': 'npx --no-install remotion studio ki/src/index.ts --no-open',
    'remotion:studio:poll': 'npx --no-install remotion studio ki/src/index.ts --no-open --webpack-poll 1000',
    'remotion:versions': 'npx --no-install remotion versions',
    'remotion:readiness': 'npm run remotion:integration-check && npm run remotion:versions && npm run motion:verify',
  };
  for (const [name, expected] of Object.entries(requiredScripts)) {
    if (root.scripts?.[name] !== expected) {
      failures.push(`package.json script ${name} muss exakt "${expected}" sein.`);
    }
  }
}

requireMarkers('ki/src/index.ts', studioEntry, ['registerRoot', 'RemotionRoot']);
requireMarkers('ki/src/Root.tsx', studioRoot, ['ProductionRoot', 'MotionPreviewRoot']);
requireMarkers('ki/src/production-entry.tsx', productionEntry, ['ProductionRoot', 'registerRoot(ProductionRoot)']);
requireMarkers('ki/src/ProductionRoot.tsx', productionRoot, ['Composition', 'KI-Production-Reels']);

if (productionEntry.includes('MotionPreviewRoot') || productionEntry.includes('motion-system/')) {
  failures.push('production-entry.tsx darf MotionPreviewRoot/motion-system nicht importieren.');
}
if (/from\s+['"]\.\/(?:reels|longform)\//.test(studioRoot)) {
  failures.push('Root.tsx darf Production-Reels nicht direkt registrieren; das gehört in ProductionRoot.tsx.');
}

const officialSkillNames = [
  'remotion-best-practices',
  'remotion-markup',
  'remotion-interactivity',
  'remotion-captions',
  'remotion-studio',
  'remotion-render',
  'remotion-docs',
  'remotion-upgrade',
];
for (const skill of officialSkillNames) {
  if (!toolsRouting.includes(skill) && !orchestrationSkill.includes(skill)) {
    failures.push(`Offizieller Remotion-Skill ist nicht geroutet: ${skill}.`);
  }
}

requireMarkers('WERKZEUGE.md', toolsRouting, [
  'remotion-production-orchestration',
  'remotion-production-builder',
  'remotion-release-reviewer',
]);
requireMarkers('remotion-production-orchestration', orchestrationSkill, [
  'remotion-best-practices',
  'remotion-markup',
  'remotion-captions',
  'remotion-studio',
  'remotion-render',
  'production-entry.tsx',
  'remotion:readiness',
]);
requireMarkers('remotion-production-builder', builderAgent, [
  'remotion:integration-check',
  'remotion:readiness',
  'remotion-release-reviewer',
  'PHASE 2 AUDIO FEHLT',
]);
requireMarkers('remotion-release-reviewer', reviewerAgent, [
  'RELEASE REVIEW: PASS',
  'RELEASE REVIEW: FAIL',
  'remotion:readiness',
]);

const productionFiles = [
  ...await walkSource('ki/src/reels'),
  ...await walkSource('ki/src/longform'),
];
for (const path of productionFiles) {
  const source = await readText(path);
  if (/Math\.random\s*\(/.test(source)) {
    failures.push(`${path}: Math.random() ist in Production-Remotion nicht deterministisch.`);
  }
  if (/@keyframes\b/.test(source)) {
    failures.push(`${path}: CSS @keyframes gefunden; Render-Timing muss framebasiert sein.`);
  }
  if (/\b(?:animation|animationName|transition|transitionProperty)\s*:/.test(source)) {
    warnings.push(`${path}: moegliches CSS-Animation/Transition-Timing gefunden; manuell gegen Remotion-Frame-Timing pruefen.`);
  }
}

if (warnings.length > 0) {
  console.warn('Remotion-Integrationswarnungen:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length > 0) {
  console.error('Remotion-Integrationscheck fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Remotion-Integrationscheck bestanden. Production-Dateien geprueft: ${productionFiles.length}.`);
