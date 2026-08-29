#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = [];
const requiredFiles = [
  'GEMINI.md',
  '.agents/agents.md',
  '.agents/workflows/bootstrap-ki-channel.md',
  '.agents/workflows/finish-ki-reel.md',
  '.agents/workflows/verify-ki-reel.md',
  '.agents/skills/remotion-storytelling/SKILL.md',
  '.agents/skills/remotion-bits-discovery/SKILL.md',
  '.agents/plugins/ki-channel-production/plugin.json',
  '.agents/plugins/ki-channel-production/mcp_config.json',
  '.agents/plugins/ki-channel-production/hooks.json',
  '.agents/plugins/ki-channel-production/rules/production.md',
  '.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md',
  'scripts/antigravity-lightweight-check.mjs',
  'scripts/list-antigravity-capabilities.mjs',
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
const allowedPluginKeys = new Set(['$schema', 'name', 'description']);
for (const key of Object.keys(plugin || {})) if (!allowedPluginKeys.has(key)) fail.push(`plugin.json contains unsupported key: ${key}`);

const mcp = parseJson('.agents/plugins/ki-channel-production/mcp_config.json');
if (!mcp?.mcpServers?.['chrome-devtools']) fail.push('Chrome DevTools MCP missing');
if (!mcp?.mcpServers?.['remotion-bits']) fail.push('Remotion Bits MCP missing');
if (!mcp?.mcpServers?.github) fail.push('GitHub MCP missing');
if (!String(mcp?.mcpServers?.['chrome-devtools']?.args || '').includes('chrome-devtools-mcp@latest')) fail.push('Chrome DevTools MCP command missing');
if (!String(mcp?.mcpServers?.['remotion-bits']?.args || '').includes('remotion-bits')) fail.push('Remotion Bits MCP command missing');
if (!String(mcp?.mcpServers?.github?.args || '').includes('ghcr.io/github/github-mcp-server')) fail.push('official GitHub MCP image missing');
if (mcp?.mcpServers?.github?.env?.GITHUB_TOOLSETS !== 'repos,pull_requests,issues') fail.push('GitHub MCP toolsets must stay focused on repos,pull_requests,issues');

const hooks = parseJson('.agents/plugins/ki-channel-production/hooks.json');
if (!hooks?.['ki-channel-post-edit']) fail.push('post-edit hook missing');

const pkg = parseJson('package.json');
if (pkg?.scripts?.['antigravity:verify'] !== 'node scripts/check-antigravity-integration.mjs') fail.push('package.json missing antigravity:verify script');
if (pkg?.scripts?.['antigravity:skills'] !== 'node scripts/sync-remotion-agent-skills.mjs add') fail.push('package.json missing antigravity:skills script');
if (pkg?.scripts?.['antigravity:skills:update'] !== 'node scripts/sync-remotion-agent-skills.mjs update') fail.push('package.json missing antigravity:skills:update script');

const capabilityScanner = read('scripts/list-antigravity-capabilities.mjs');
for (const token of ['workspaceSkills', 'workflows', 'plugins', 'mcpServers', 'useEveryRelevantCapability']) {
  if (!capabilityScanner.includes(token)) fail.push(`capability scanner missing ${token}`);
}

const gemini = read('GEMINI.md');
for (const token of ['.agents/agents.md', '.agents/workflows/', 'Chrome DevTools MCP', 'GitHub MCP', 'remotion-storytelling', 'antigravity:verify']) {
  if (!gemini.includes(token)) fail.push(`GEMINI.md missing Antigravity token: ${token}`);
}

const bootstrap = read('.agents/workflows/bootstrap-ki-channel.md');
for (const token of ['antigravity:skills', 'antigravity:verify', 'list-antigravity-capabilities.mjs', 'chrome-devtools', 'remotion-bits', 'github', 'SELECTED FOR THIS TASK']) {
  if (!bootstrap.includes(token)) fail.push(`bootstrap workflow missing ${token}`);
}

const orchestrator = read('.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md');
for (const token of ['list-antigravity-capabilities.mjs', 'every skill', 'remotion-storytelling', 'remotion-bits-discovery', 'Remotion Bits MCP', 'Chrome DevTools MCP', 'GitHub MCP', 'PHASE 2']) {
  if (!orchestrator.toLowerCase().includes(token.toLowerCase())) fail.push(`orchestrator skill missing ${token}`);
}

if (fail.length) {
  console.error('ANTIGRAVITY INTEGRATION: FAILED');
  for (const issue of fail) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('ANTIGRAVITY INTEGRATION: PASSED');
console.log('workspace agents: configured');
console.log('capability discovery: configured');
console.log('workflows: bootstrap + finish + verify');
console.log('plugin: ki-channel-production');
console.log('MCP: Chrome DevTools + Remotion Bits + GitHub');
console.log('hooks: lightweight post-edit guard');
console.log('skills: repo-specific + Remotion Bits discovery + official Remotion sync path');
