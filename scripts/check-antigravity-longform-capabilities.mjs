#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

// Antigravity non-interactive shells on macOS may omit Homebrew from PATH.
// Extend only with conventional executable directories; never install binaries here.
const mediaBinDirs = ['/opt/homebrew/bin','/usr/local/bin','/opt/local/bin','/usr/bin','/bin'].filter(existsSync);
const currentPathParts = String(process.env.PATH || '').split(path.delimiter).filter(Boolean);
for (const dir of mediaBinDirs.reverse()) if (!currentPathParts.includes(dir)) currentPathParts.unshift(dir);
process.env.PATH = currentPathParts.join(path.delimiter);

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
  const result = spawnSync(cmd, args, {encoding:'utf8', env:process.env});
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
  '.agents/plugins/ki-channel-production/mcp_config.json',
  'scripts/with-media-path.mjs',
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
const motionWorkflow = await requireFile('.agents/workflows/open-ended-motion-production.md', [
  'OPEN_ENDED_STORY_DRIVEN',
  'Official source / proof',
  'Real B-roll / real image',
  'Motion-purpose test',
  '1000 frames per chapter',
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

const mcpPath = '.agents/plugins/ki-channel-production/mcp_config.json';
const mcpText = await read(mcpPath);
if (!mcpText) fail(`${mcpPath} missing.`);
else {
  for (const marker of ['chrome-devtools','github','remotion-bits']) if (!mcpText.includes(marker)) fail(`Antigravity MCP config missing ${marker}.`);
  fact(`MCP config declares chrome-devtools, github and remotion-bits at ${mcpPath}`);
}

let chromeDevtoolsReachable = false;
try {
  const response = await fetch('http://127.0.0.1:9222/json/version', {signal: AbortSignal.timeout(1500)});
  chromeDevtoolsReachable = response.ok;
} catch {}
if (chromeDevtoolsReachable) fact('Chrome DevTools endpoint reachable at 127.0.0.1:9222');
else warn('Chrome DevTools MCP is configured, but the browser endpoint at 127.0.0.1:9222 is not currently reachable. Start/restart Chrome with remote debugging before an official-browser-proof task.');

if (!commandAvailable('ffmpeg')) fail(`ffmpeg is unavailable even after conventional PATH recovery: ${process.env.PATH}`);
else fact('ffmpeg available after portable PATH recovery');
if (!commandAvailable('ffprobe')) fail(`ffprobe is unavailable even after conventional PATH recovery: ${process.env.PATH}`);
else fact('ffprobe available after portable PATH recovery');
if (!commandAvailable('git')) fail('git is not available in PATH; source-lock checks cannot run.');
else fact('git available');
if (!commandAvailable(process.platform === 'win32' ? 'npx.cmd' : 'npx')) fail('npx is not available; Remotion/MCP command execution cannot run.');
else fact('npx available');

const major = Number(process.versions.node.split('.')[0]);
if (major !== 20) warn(`repository declares Node 20; current runtime is Node ${process.versions.node}. Use Node 20 for production validation when possible.`);
else fact(`Node ${process.versions.node} matches repository major`);

if (!process.env.PEXELS_API_KEY) warn('PEXELS_API_KEY missing. Pexels scout is unavailable until a free local key is configured in .env.local; Wikimedia/browser/local media paths remain available.');
else fact('PEXELS_API_KEY present');
if (!process.env.PIXABAY_API_KEY) warn('PIXABAY_API_KEY missing. Pixabay scout is unavailable until a free local key is configured in .env.local; Wikimedia/browser/local media paths remain available.');
else fact('PIXABAY_API_KEY present');

if (workflow && motionWorkflow && mediaSkill && orchestrator && storyEngineer) fact('Dedicated Antigravity Longform orchestration, media production and story-driven motion workflows are wired');
fact('No repo-native text-to-image model is declared. Longform can use sourced/local images and procedural Remotion/3D/Skia visuals; external generative-image creation is a separate capability and must not be falsely claimed.');

const report = {
  version: 3,
  status: errors.length ? 'BLOCKED' : warnings.length ? 'READY_WITH_WARNINGS' : 'READY',
  checkedAt: new Date().toISOString(),
  capabilities: {
    researchAndWebSourceDiscovery: Boolean(orchestrator?.includes('search_web') && orchestrator?.includes('read_url_content')),
    chromeDevtoolsMcpConfigured: Boolean(mcpText?.includes('chrome-devtools')),
    chromeDevtoolsEndpointReachable: chromeDevtoolsReachable,
    officialBrowserProofPath: Boolean(mcpText?.includes('chrome-devtools') && mediaSkill?.includes('official') && chromeDevtoolsReachable),
    pexelsDiscoveryConfigured: existsSync('scripts/scout-pexels-assets.mjs'),
    pexelsDiscoveryRuntimeReady: Boolean(process.env.PEXELS_API_KEY),
    pixabayDiscoveryConfigured: existsSync('scripts/scout-pixabay-assets.mjs'),
    pixabayDiscoveryRuntimeReady: Boolean(process.env.PIXABAY_API_KEY),
    wikimediaDiscovery: existsSync('scripts/scout-wikimedia-commons-assets.mjs'),
    polyhavenDiscovery: existsSync('scripts/scout-polyhaven-assets.mjs'),
    controlledMaterialization: existsSync('scripts/materialize-longform-media.mjs'),
    explicitShaBoundApproval: existsSync('scripts/approve-longform-media.mjs'),
    imagePreparationAndUse: existsSync('scripts/prepare-local-image-asset.mjs'),
    longformVideoBrollPreparationAndUse: existsSync('scripts/prepare-longform-video-asset.mjs'),
    portableMediaBinaryPath: existsSync('scripts/with-media-path.mjs'),
    remotionEffects: Boolean(allDeps['@remotion/effects'] && allDeps['@remotion/motion-blur'] && allDeps['@remotion/transitions']),
    skia: Boolean(allDeps['@remotion/skia'] && allDeps['@shopify/react-native-skia']),
    threeAndR3f: Boolean(allDeps['@remotion/three'] && allDeps.three && allDeps['@react-three/fiber']),
    lottie: Boolean(allDeps['@remotion/lottie'] && allDeps['lottie-web']),
    rive: Boolean(allDeps['@remotion/rive'] && allDeps['@rive-app/canvas-advanced']),
    sfx: Boolean(allDeps['@remotion/sfx']),
    gsap: Boolean(allDeps.gsap),
    chartsAndIllustration: Boolean(allDeps.recharts && allDeps.roughjs),
    openEndedRemotionMotion: Boolean(storyEngineer?.includes('OPEN_ENDED_STORY_DRIVEN') && motionWorkflow),
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
console.log(`ANTIGRAVITY LONGFORM CAPABILITIES: ${report.status}`);
console.log('This proves repository/runtime wiring only. Provider keys, a specific media download, a TSX build and a final render still require their own real execution evidence.');
