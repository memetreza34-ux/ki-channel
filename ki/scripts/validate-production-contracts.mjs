#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
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
if (/https?:\/\//i.test(root)) fail.push('Root.tsx contains a remote media URL.');
if (!root.includes('runtime-audio/') || !root.includes('staticFile') || !root.includes('.wav')) fail.push('Root.tsx is not wired to PCM WAV runtime audio via staticFile.');

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
  if (text.includes('bottom: 520') || text.includes('bottom: 520px')) fail.push(`${file} still declares legacy bottom:520 caption geometry.`);
}

const ignore = await read('.gitignore');
if (!ignore.includes('public/runtime-audio/')) fail.push('.gitignore does not ignore public/runtime-audio/.');

const sourceFiles = [];
const walk = async (dir) => {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) sourceFiles.push(full);
  }
};
await walk(path.resolve('ki','src','reels'));

for (const file of sourceFiles) {
  const relative = path.relative(process.cwd(),file);
  const text = await readFile(file,'utf8');
  if (/bottom\s*:\s*(?:264|270|360|440|460|500|520)\b/.test(text)) fail.push(`${relative} contains a legacy hard-coded caption bottom value.`);
  if (/from\s+['"][^'"]+\.(?:mp3|wav|m4a|aiff|mp4|mov)['"]/i.test(text)) fail.push(`${relative} directly imports binary media.`);
  if (text.includes('Math.random(')) fail.push(`${relative} uses Math.random() in deterministic render source.`);
}

const studySource = await read('ki/src/reels/chatgpt-study-mode/ReelChatGPTStudyMode.tsx');
if (studySource.includes('http://') || studySource.includes('https://')) fail.push('Study Mode render source contains a remote URL.');
if (!studySource.includes('requires a verified local voiceoverSrc')) fail.push('Study Mode does not fail closed on missing audio.');

if (fail.length) {
  console.error('PRODUCTION CONTRACT AUDIT: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('PRODUCTION CONTRACT AUDIT: PASSED');
console.log(`checked required files: ${mustExist.length}`);
console.log(`checked active contracts: ${activeContracts.length}`);
console.log(`scanned reel source files: ${sourceFiles.length}`);
