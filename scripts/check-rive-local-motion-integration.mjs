#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  skill: '.agents/skills/rive-local-motion/SKILL.md',
  workflow: '.agents/workflows/use-rive-local-motion.md',
  media: 'ki/src/reels/StoryMediaLayers.tsx',
  package: 'package.json',
};

const errors = [];
for (const file of Object.values(files)) {
  if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
}
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
const skill = read(files.skill);
const workflow = read(files.workflow);
const media = read(files.media);
const pkg = read(files.package);

for (const token of ['local `.riv`', 'never a release dependency', 'Never use a remote Rive URL', 'Free plan']) {
  if (!skill.includes(token)) errors.push(`Rive skill missing safety token: ${token}`);
}
for (const token of ['RIVE_LOCAL_ASSET_REQUIRED', 'StoryRiveLayer', 'local `staticFile(...)`', 'RIVE_EXPERIMENT_ONLY']) {
  if (!workflow.includes(token)) errors.push(`Rive workflow missing token: ${token}`);
}
for (const token of ['RemotionRiveCanvas', 'StoryRiveLayer', "throw new Error('StoryRiveLayer forbids render-time remote URLs", '<RemotionRiveCanvas src={src} />']) {
  if (!media.includes(token)) errors.push(`StoryMediaLayers missing Rive safety/runtime token: ${token}`);
}
if (!pkg.includes('"@remotion/rive": "4.0.488"')) errors.push('package.json must keep @remotion/rive pinned to the Remotion baseline');
if (!pkg.includes('"@rive-app/canvas-advanced"')) errors.push('package.json missing @rive-app/canvas-advanced runtime');

if (errors.length) {
  console.error('RIVE LOCAL MOTION INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('RIVE LOCAL MOTION INTEGRATION: PASSED');
console.log('mode: optional local .riv only');
console.log('free-editor experiment: allowed');
console.log('new free production export: not assumed');
console.log('remote Rive media during render: forbidden');
console.log('fallback: native Remotion/Lottie/Shapes');
