#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const files = {
  mcp: '.agents/plugins/ki-channel-production/mcp_config.json',
  skill: '.agents/skills/lottie-creator-motion/SKILL.md',
  workflow: '.agents/workflows/create-lottie-motion.md',
};
for (const file of Object.values(files)) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);

const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';
let mcp = null;
try { mcp = JSON.parse(read(files.mcp)); } catch (error) { errors.push(`invalid MCP JSON: ${error.message}`); }

const creator = mcp?.mcpServers?.['lottiefiles-creator'];
if (!creator) errors.push('lottiefiles-creator MCP missing');
if (creator?.command !== 'npx') errors.push('Lottie Creator MCP command must be npx');
if (!Array.isArray(creator?.args) || !creator.args.includes('@lottiefiles/creator-mcp@0.2.1')) errors.push('Lottie Creator MCP must stay pinned to @lottiefiles/creator-mcp@0.2.1');
if (creator?.disabled !== true) errors.push('Lottie Creator MCP must be disabled by default');

const skill = read(files.skill);
for (const token of ['disabled: true', 'native Remotion', 'not automatically production-approved', 'Never use a remote LottieFiles CDN/URL at render time']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`Lottie skill missing safety token: ${token}`);
}

const workflow = read(files.workflow);
for (const token of ['# /create-lottie-motion', 'enable `lottiefiles-creator` only', 'Do **not** automatically wire', 'Disable `lottiefiles-creator` again', 'LOTTIE_AUTHORED_LOCAL_REVIEW_REQUIRED']) {
  if (!workflow.includes(token)) errors.push(`Lottie workflow missing token: ${token}`);
}

if (errors.length) {
  console.error('LOTTIE CREATOR INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('LOTTIE CREATOR INTEGRATION: PASSED');
console.log('MCP: @lottiefiles/creator-mcp@0.2.1');
console.log('default state: disabled');
console.log('production authority: local Remotion + explicit review only');
console.log('remote Lottie render URLs: forbidden');
