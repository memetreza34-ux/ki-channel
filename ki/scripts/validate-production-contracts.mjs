#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const fail = [];
const mustExist = [
  'ki/gehirn/AUDIO_PIPELINE.md',
  'ki/gehirn/CAPTION_SAFE_POSITION.md',
  'ki/src/reels/captionSafe.ts',
  'ki/scripts/prepare-reel-audio.mjs',
  'ki/scripts/prepare-reel-render.mjs',
  'ki/scripts/validate-voice-locked-captions.mjs',
  'ki/scripts/validate-motion-readability-review.mjs',
  'ki/scripts/validate-final-video.mjs',
  'ki/scripts/finalize-reel-export.mjs',
  'ki/scripts/validate-reel-export-package.mjs',
];
for (const file of mustExist) if (!existsSync(path.resolve(file))) fail.push(`missing required production file: ${file}`);

const read = async (file) => readFile(path.resolve(file),'utf8');

const root = await read('ki/src/Root.tsx');
if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|mp4)['"]/i.test(root)) fail.push('Root.tsx contains a static binary audio/video import.');
if (/aidocmaker|storage\.googleapis\.com|https?:\/\//i.test(root)) fail.push('Root.tsx contains a remote media URL.');
if (!/runtime-audio/.test(root) || !/staticFile/.test(root)) fail.push('Root.tsx is not wired to prepared runtime audio via staticFile.');

const caption = await read('ki/src/reels/captionSafe.ts');
for (const [needle,label] of [
  ['bottom: 250','caption bottom 250'],
  ['horizontalInset: 104','caption horizontal inset 104'],
  ['maxWidth: 860','caption max width 860'],
  ['REEL_CAPTION_GLASS_STYLE','shared glass caption style'],
]) if (!caption.includes(needle)) fail.push(`captionSafe.ts missing ${label}.`);

const activeContracts = [
  'AGENTS.md',
  'ki/AGENTS.md',
  'ki/gehirn/MASTER.md',
  'ki/gehirn/REELS.md',
  'ki/gehirn/CAPTION_SAFE_POSITION.md',
  'ki/gehirn/PRODUKTIONSABLAUF.md',
  'ki/reels/AGENTS.md',
  'ki/src/reels/AGENTS.md',
];
for (const file of activeContracts) {
  const text = await read(file);
  if (/bottom:\s*520|`bottom:\s*520px`|\*\*`bottom:\s*520px`\*\*/i.test(text)) fail.push(`${file} still declares legacy bottom:520 caption geometry.`);
  if (/Phase\s*2\s*[—-]\s*Mensch[^\n]*(?:ausschließlich|nur)\s+(?:das\s+)?(?:echte\s+)?Voiceover/i.test(text)) fail.push(`${file} still declares Human-only Phase 2 audio.`);
  if (/untertitel\s+ohne\s+(?:weiße\s+)?(?:box|caption-card|hintergrundkarte)/i.test(text)) fail.push(`${file} still conflicts with canonical glass caption style.`);
}

const ignore = await read('.gitignore');
if (!ignore.includes('public/runtime-audio/')) fail.push('.gitignore does not ignore public/runtime-audio/.');

const studySource = await read('ki/src/reels/chatgpt-study-mode/ReelChatGPTStudyMode.tsx');
if (/https?:\/\//i.test(studySource)) fail.push('Study Mode render source contains a remote URL.');
if (!/requires a verified local voiceoverSrc/.test(studySource)) fail.push('Study Mode does not fail closed on missing audio.');

if (fail.length) {
  console.error('PRODUCTION CONTRACT AUDIT: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('PRODUCTION CONTRACT AUDIT: PASSED');
console.log(`checked required files: ${mustExist.length}`);
console.log(`checked active contracts: ${activeContracts.length}`);
