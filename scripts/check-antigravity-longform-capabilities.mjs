#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import process from 'node:process';

const errors = [];
const warnings = [];
const facts = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const fact = (message) => facts.push(message);
const read = async (p) => existsSync(p) ? readFile(p, 'utf8') : null;
const requireFile = async (p, patterns = []) => {
  if (!existsSync(p)) { fail(`missing required capability file: ${p}`); return null; }
  const text = await readFile(p, 'utf8');
  for (const pattern of patterns) if (!text.includes(pattern)) fail(`${p} missing required contract marker: ${pattern}`);
  return text;
};
const parseJson = (text, name) => {
  if (!text) { fail(`${name} missing.`); return null; }
  try { return JSON.parse(text); }
  catch (error) { fail(`${name} invalid: ${error.message}`); return null; }
};
const commandAvailable = (cmd, args=['--version']) => {
  const result = spawnSync(cmd, args, {encoding:'utf8'});
  return !result.error && result.status === 0;
};

const requiredFiles = [
  '.agents/workflows/longform-full-cycle.md',
  '.agents/workflows/scout-free-assets.md',
  '.agents/workflows/open-ended-motion-production.md',
  '.agents/skills/longform-media-production/SKILL.md',
  '.agents/skills/remotion-storytelling/SKILL.md',
  '.agents/skills/remotion-bits-discovery/SKILL.md',
  '.agents/skills/image-asset-prep/SKILL.md',
  '.agents/skills/video-asset-prep/SKILL.md',
  '.agents/agents/ki-longform-production-orchestrator/agent.md',
  '.agents/agents/ki-longform-remotion-engineer/agent.md',
  'scripts/scout-pexels-assets.mjs',
  'scripts/scout-pixabay-assets.mjs',
  'scripts/scout-wikimedia-commons-assets.mjs',
  'scripts/scout-polyhaven-assets.mjs',
  'scripts/materialize-longform-media.mjs',
  'scripts/approve-longform-media.mjs',
  'scripts/prepare-local-image-asset.mjs',
  'scripts/prepare-longform-video-asset.mjs',
  'scripts/check-ki-longform-render-readiness.mjs',
  'scripts/create-ki-longform-render-lock.mjs',
  'scripts/render-ki-longform-master.mjs',
  'scripts/check-ki-longform-master.mjs',
];
for (const file of requiredFiles) if (!existsSync(file)) fail(`missing required Longform capability: ${file}`);

const workflow = await requireFile('.agents/workflows/longform-full-cycle.md', [
  'check-antigravity-longform-capabilities.mjs',
  'materialize-longform-media.mjs',
  'approve-longform-media.mjs',
  'check-ki-longform-render-readiness.mjs',
  'render-ki-longform-master.mjs',
  'direct Remotion render is a prototype',
  'ki-longform-remotion-engineer',
]);
const mediaSkill = await requireFile('.agents/skills/longform-media-production/SKILL.md', [
  'MATERIALIZED_PENDING_REVIEW',
  'APPROVED',
  'Pexels',
  'Pixabay',
  'Wikimedia Commons',
  'official',
  'SHA-256',
]);
const orchestrator = await requireFile('.agents/agents/ki-longform-production-orchestrator/agent.md', [
  'skills/longform-media-production',
  'longform-full-cycle',
  'check-antigravity-longform-capabilities.mjs',
  'ki-longform-remotion-engineer',
]);
const storyEngineer = await requireFile('.agents/agents/ki-longform-remotion-engineer/agent.md', [
  'skills/longform-media-production',
  'LONGFORM_V1',
  'OPEN_ENDED_STORY_DRIVEN',
  '1000 frames',
]);

const rootPkg = parseJson(await read('package.json'), 'package.json');
const kiPkg = parseJson(await read('ki/package.json'), 'ki/package.json');
const rootDeps = rootPkg ? {...rootPkg.dependencies, ...rootPkg.devDependencies} : {};
const kiDeps = kiPkg ? {...kiPkg.dependencies, ...kiPkg.devDependencies} : {};
const allDeps = {...rootDeps, ...kiDeps};
const requiredDeps = [
  'remotion','@remotion/cli','@remotion/transitions','@remotion/paths','@remotion/shapes','@remotion/motion-blur','@remotion/light-leaks','@remotion/noise','@remotion/lottie','@remotion/rive','@remotion/three',
  '@remotion/effects','@remotion/skia','@remotion/sfx','@shopify/react-native-skia',
  'three','@react-three/fiber','gsap','lottie-web','@rive-app/canvas-advanced','roughjs','recharts','sharp',
];
for (const dep of requiredDeps) if (!allDeps?.[dep]) fail(`missing motion/media dependency: ${dep}`);
if (rootPkg && kiPkg) fact(`motion/effects stack: ${requiredDeps.length} required packages declared across root + ki workspace`);

const mcpText = await read('.agents/plugins/ki-channel/mcp_config.json');
if (!mcpText) fail('.agents/plugins/ki-channel/mcp_config.json missing.');
else {
  for (const marker of ['chrome-devtools','github','remotion-bits']) if (!mcpText.includes(marker)) fail(`Antigravity MCP config missing ${marker}.`);
  fact('MCP config declares chrome-devtools, github and remotion-bits');
}

if (!commandAvailable('ffmpeg')) fail('ffmpeg is not available in PATH; video materialization/mastering cannot run.');
else fact('ffmpeg available');
if (!commandAvailable('ffprobe')) fail('ffprobe is not available in PATH; media/audio validation cannot run.');
else fact('ffprobe available');
if (!commandAvailable('git')) fail('git is not available in PATH; source-lock checks cannot run.');
else fact('git available');

const major = Number(process.versions.node.split('.')[0]);
if (major !== 20) warn(`repository declares Node 20; current runtime is Node ${process.versions.node}. Validate compatibility before production.`);
else fact(`Node ${process.versions.node} matches repository major`);

if (!process.env.PEXELS_API_KEY) warn('PEXELS_API_KEY missing in current process. Pexels scout unavailable until key is configured; this does not block Wikimedia/browser/local media paths.');
else fact('PEXELS_API_KEY present');
if (!process.env.PIXABAY_API_KEY) warn('PIXABAY_API_KEY missing in current process. Pixabay scout unavailable until key is configured; this does not block Wikimedia/browser/local media paths.');
else fact('PIXABAY_API_KEY present');

if (workflow && mediaSkill && orchestrator && storyEngineer) fact('Dedicated Antigravity Longform workflow is wired into a Longform orchestrator + writer');
fact('No repo-native text-to-image model is declared. Longform can use sourced/local images and procedural Remotion/3D/Skia visuals; external generative-image creation is a separate capability and must not be falsely claimed.');

const report = {
  version: 2,
  status: errors.length ? 'BLOCKED' : 'READY',
  checkedAt: new Date().toISOString(),
  capabilities: {
    researchAndWebSourceDiscovery: Boolean(orchestrator?.includes('search_web') && orchestrator?.includes('read_url_content')),
    officialBrowserProofPath: Boolean(mcpText?.includes('chrome-devtools') && mediaSkill?.includes('official')),
    pexelsDiscovery: existsSync('scripts/scout-pexels-assets.mjs'),
    pixabayDiscovery: existsSync('scripts/scout-pixabay-assets.mjs'),
    wikimediaDiscovery: existsSync('scripts/scout-wikimedia-commons-assets.mjs'),
    polyhavenDiscovery: existsSync('scripts/scout-polyhaven-assets.mjs'),
    controlledMaterialization: existsSync('scripts/materialize-longform-media.mjs'),
    explicitShaBoundApproval: existsSync('scripts/approve-longform-media.mjs'),
    imagePreparationAndUse: existsSync('scripts/prepare-local-image-asset.mjs'),
    longformVideoBrollPreparationAndUse: existsSync('scripts/prepare-longform-video-asset.mjs'),
    remotionEffects: Boolean(allDeps['@remotion/effects'] && allDeps['@remotion/motion-blur'] && allDeps['@remotion/transitions']),
    skia: Boolean(allDeps['@remotion/skia'] && allDeps['@shopify/react-native-skia']),
    threeAndR3f: Boolean(allDeps['@remotion/three'] && allDeps.three && allDeps['@react-three/fiber']),
    lottie: Boolean(allDeps['@remotion/lottie'] && allDeps['lottie-web']),
    rive: Boolean(allDeps['@remotion/rive'] && allDeps['@rive-app/canvas-advanced']),
    sfx: Boolean(allDeps['@remotion/sfx']),
    gsap: Boolean(allDeps.gsap),
    chartsAndIllustration: Boolean(allDeps.recharts && allDeps.roughjs),
    openEndedRemotionMotion: Boolean(storyEngineer?.includes('OPEN_ENDED_STORY_DRIVEN')),
    repoNativeTextToImageModel: false,
    canonicalPreRenderGate: existsSync('scripts/check-ki-longform-render-readiness.mjs'),
    canonicalMasterRender: existsSync('scripts/render-ki-longform-master.mjs'),
    postRenderMasterQa: existsSync('scripts/check-ki-longform-master.mjs'),
  },
  facts,
  warnings,
  errors,
};

console.log(JSON.stringify(report, null, 2));
for (const message of warnings) console.warn(`LONGFORM CAPABILITY WARNING: ${message}`);
if (errors.length) {
  console.error(`ANTIGRAVITY LONGFORM CAPABILITIES: BLOCKED (${errors.length})`);
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}
console.log('ANTIGRAVITY LONGFORM CAPABILITIES: READY');
console.log('This proves repository/runtime wiring only. Provider keys, a specific media download, a TSX build and a final render still require their own real execution evidence.');
