#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const id = 'VisualLanguageProofVertical';
const outDir = path.resolve('out', 'visual-language-proof');
const output = path.join(outDir, 'visual-language-proof-vertical.mp4');
const entry = path.resolve('ki', 'src', 'reels', 'visual-language-proof', 'entry.tsx');
const remotionBin = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'remotion.cmd' : 'remotion');

await mkdir(outDir, {recursive: true});
if (Number(process.versions.node.split('.')[0]) !== 20) {
  console.error(`VISUAL LANGUAGE PROOF BLOCKED: Node 20 required, got ${process.versions.node}. Use scripts/with-longform-node20.mjs.`);
  process.exit(1);
}
if (!existsSync(remotionBin)) {
  console.error('VISUAL LANGUAGE PROOF BLOCKED: local Remotion CLI missing.');
  process.exit(1);
}
if (!existsSync(entry)) {
  console.error('VISUAL LANGUAGE PROOF BLOCKED: entry.tsx missing.');
  process.exit(1);
}

const args = ['render', entry, id, output, '--codec=h264', '--crf=18', '--pixel-format=yuv420p', '--overwrite', '--concurrency=1'];
const result = process.platform === 'win32'
  ? spawnSync(remotionBin, args, {stdio: 'inherit', env: process.env})
  : spawnSync(process.execPath, [remotionBin, ...args], {stdio: 'inherit', env: process.env});

if (result.status !== 0 || !existsSync(output) || statSync(output).size < 1024) {
  console.error('VISUAL LANGUAGE PROOF: FAILED');
  process.exit(1);
}

const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt', '-of', 'json', output], {encoding: 'utf8'});
if (probe.status !== 0) {
  console.error('VISUAL LANGUAGE PROOF: ffprobe failed');
  process.exit(1);
}
const metadata = JSON.parse(probe.stdout);
const video = metadata.streams?.find((stream) => stream.codec_type === 'video');
const duration = Number(metadata.format?.duration || 0);
if (!video || Number(video.width) !== 1080 || Number(video.height) !== 1920 || video.pix_fmt !== 'yuv420p' || Math.abs(duration - 12) > .3) {
  console.error(`VISUAL LANGUAGE PROOF: technical contract failed\n${probe.stdout}`);
  process.exit(1);
}
console.log(probe.stdout);
console.log(`VISUAL LANGUAGE PROOF: READY FOR VISUAL REVIEW — ${path.relative(process.cwd(), output)}`);
