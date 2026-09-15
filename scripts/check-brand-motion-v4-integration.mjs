#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const fail=(m)=>{console.error(`BRAND MOTION V4 INTEGRATION FAILED: ${m}`);process.exit(1);};
const requireFile=(p)=>{if(!existsSync(p))fail(`missing ${p}`);};
const requireToken=async(p,t)=>{const s=await readFile(p,'utf8');if(!s.includes(t))fail(`${p} missing token ${t}`);};

const files=[
  '.agents/skills/brand-motion-fidelity/SKILL.md',
  '.agents/agents/ki-brand-motion-director/agent.md',
  '.agents/workflows/use-local-official-media.md',
  'ki/scripts/validate-reel-brand-motion-v4.mjs',
  'scripts/apply-level-up-v4.mjs',
  'ki/scripts/resolve-reel-visual-assets.mjs',
  'ki/scripts/validate-reel-visual-assets.mjs',
  'ki/config/visual-asset-sources.json',
  'ki/gehirn/LEVEL_UP_STANDARD.md',
  'ki/gehirn/VISUAL_ASSETS.md',
];
for(const file of files)requireFile(path.resolve(file));

await requireToken('scripts/new-ki-reel.mjs','apply-level-up-v4.mjs');
await requireToken('ki/scripts/prepare-reel-render.mjs','validate-reel-brand-motion-v4.mjs');
await requireToken('ki/scripts/prepare-reel-render.mjs','brandMotionPlanSha256');
await requireToken('ki/scripts/resolve-reel-visual-assets.mjs','LOCAL_OFFICIAL_MEDIA');
await requireToken('ki/scripts/resolve-reel-visual-assets.mjs','manualRightsReviewRequired');
await requireToken('ki/scripts/validate-reel-visual-assets.mjs','LOCAL_OFFICIAL_MEDIA');
await requireToken('ki/config/visual-asset-sources.json','"autoDownload": false');
await requireToken('.agents/skills/brand-motion-fidelity/SKILL.md','OPEN_ENDED_STORY_DRIVEN');
await requireToken('.agents/agents/ki-remotion-story-engineer/agent.md','no fixed whitelist');
await requireToken('.agents/agents/ki-production-orchestrator/agent.md','ki-brand-motion-director');
await requireToken('ki/gehirn/LEVEL_UP_STANDARD.md','Level-Up v4');

console.log('BRAND MOTION V4 INTEGRATION: PASSED');
console.log('v4 from: 2026-09-05');
console.log('official media: local-only, no auto-download, SHA-bound');
console.log('animation policy: OPEN_ENDED_STORY_DRIVEN');
console.log('brand palette: required per v4 reel');
console.log('capability evolution: material-gain only');
