#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = [];
const requiredFiles = [
  'GEMINI.md',
  '.agents/agents.md',
  '.agents/workflows/finish-ki-reel.md',
  '.agents/workflows/verify-ki-reel.md',
  '.agents/skills/remotion-storytelling/SKILL.md',
  '.agents/plugins/ki-channel-production/plugin.json',
  '.agents/plugins/ki-channel-production/mcp_config.json',
  '.agents/plugins/ki-channel-production/hooks.json',
  '.agents/plugins/ki-channel-production/rules/production.md',
  '.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md',
  'scripts/antigravity-lightweight-check.mjs',
  'scripts/sync-remotion-agent-skills.mjs',
];

for (const file of requiredFiles) if (!existsSync(path.resolve(root, file))) fail.push(`missing ${file}`);

const read = (file) => readFileSync(path.resolve(root, file), 'utf8');
const parseJson = (file) => {
  try { return JSON.parse(read(file)); }
  catch (error) { fail.push(`${file} invalid JSON: ${error.message}`); return null; }
};

const plugin = parseJson('.agents/plugins/ki-channel-production/plugin.json');
if (plugin?.name !== 'ki-channel-production') fail.push('plugin.json name must be ki-channel-production');

const mcp = parseJson('.agents/plugins/ki-channel-production/mcp_config.json');
if (!mcp?.mcpServers?.['chrome-devtools']) fail.push('Chrome DevTools MCP missing');
if (!mcp?.mcpServers?.github) fail.push('GitHub MCP missing');
if (!String(mcp?.mcpServers?.['chrome-devtools']?.args || '').includes('chrome-devtools-mcp@latest')) fail.push('Chrome DevTools MCP command missing');
if (!String(mcp?.mcpServers?.github?.args || '').includes('ghcr.io/github/github-mcp-server')) fail.push('official GitHub MCP image missing');

const hooks = parseJson('.agents/plugins/ki-channel-production/hooks.json');
if (!hooks?.['ki-channel-post-edit']) fail.push('post-edit hook missing');

const gemini = read('GEMINI.md');
for (const token of ['.agents/agents.md', '.agents/workflows/', 'Chrome DevTools MCP', 'GitHub MCP', 'remotion-storytelling']) {
  if (!gemini.includes(token)) fail.push(`GEMINI.md missing Antigravity token: ${token}`);
}

const orchestrator = read('.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md');
for (const token of ['remotion-storytelling', 'Chrome DevTools MCP', 'GitHub MCP', 'PHASE 2']) {
  if (!orchestrator.includes(token)) fail.push(`orchestrator skill missing ${token}`);
}

if (fail.length) {
  console.error('ANTIGRAVITY INTEGRATION: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('ANTIGRAVITY INTEGRATION: PASSED');
console.log('workspace agents: configured');
console.log('workflows: finish + verify');
console.log('plugin: ki-channel-production');
console.log('MCP: Chrome DevTools + GitHub');
console.log('hooks: lightweight post-edit guard');
console.log('skills: repo-specific + official Remotion sync path');
