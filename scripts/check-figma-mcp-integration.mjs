#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const required = [
  '.agents/plugins/ki-channel-production/mcp_config.json',
  '.agents/skills/figma-design-reference/SKILL.md',
  '.agents/workflows/inspect-figma-reference.md',
  '.agents/agents/ki-motion-researcher/agent.md',
];

for (const file of required) if (!existsSync(path.resolve(root, file))) errors.push(`missing ${file}`);
const read = (file) => existsSync(path.resolve(root, file)) ? readFileSync(path.resolve(root, file), 'utf8') : '';

let config = null;
try { config = JSON.parse(read('.agents/plugins/ki-channel-production/mcp_config.json')); }
catch (error) { errors.push(`mcp_config.json invalid JSON: ${error.message}`); }

const figma = config?.mcpServers?.figma;
if (!figma) errors.push('figma MCP missing');
if (figma?.serverUrl !== 'https://mcp.figma.com/mcp') errors.push('figma MCP must use official remote serverUrl');
if (figma?.disabled !== true) errors.push('figma MCP must stay disabled by default');
const disabledTools = new Set(figma?.disabledTools || []);
for (const tool of ['add_code_connect_map', 'create_new_file', 'download_assets', 'generate_diagram', 'generate_figma_design']) {
  if (!disabledTools.has(tool)) errors.push(`figma MCP must disable ${tool}`);
}
if ('url' in (figma || {}) || 'httpUrl' in (figma || {})) errors.push('figma MCP must use modern serverUrl, not url/httpUrl');

const skill = read('.agents/skills/figma-design-reference/SKILL.md');
for (const token of ['reference/context source', 'disabled by default', 'write/create/download tools disabled', 'do not let Figma availability block Remotion production']) {
  if (!skill.toLowerCase().includes(token.toLowerCase())) errors.push(`figma skill missing safety token: ${token}`);
}

const workflow = read('.agents/workflows/inspect-figma-reference.md');
for (const token of ['# /inspect-figma-reference', 'https://mcp.figma.com/mcp', 'Keep the configured write/create/download tools disabled', 'disable Figma again']) {
  if (!workflow.includes(token)) errors.push(`figma workflow missing token: ${token}`);
}

const motionResearcher = read('.agents/agents/ki-motion-researcher/agent.md');
for (const token of ['skills/figma-design-reference', 'Figma is reference-only', 'never make render depend on Figma']) {
  if (!motionResearcher.includes(token)) errors.push(`motion researcher missing Figma routing token: ${token}`);
}

if (errors.length) {
  console.error('FIGMA MCP INTEGRATION: FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('FIGMA MCP INTEGRATION: PASSED');
console.log('server: official remote https://mcp.figma.com/mcp');
console.log('default: disabled');
console.log('mode: read-oriented design reference');
console.log('write/create/download tools: disabled');
console.log('production render dependency: none');
