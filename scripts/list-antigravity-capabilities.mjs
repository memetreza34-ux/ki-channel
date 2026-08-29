#!/usr/bin/env node
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rel = (...parts) => path.resolve(root, ...parts);
const dirs = (dir) => existsSync(dir)
  ? readdirSync(dir, {withFileTypes: true}).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  : [];
const files = (dir, extension = '') => existsSync(dir)
  ? readdirSync(dir, {withFileTypes: true}).filter((entry) => entry.isFile() && (!extension || entry.name.endsWith(extension))).map((entry) => entry.name).sort()
  : [];

const workspaceSkills = dirs(rel('.agents', 'skills'));
const workflows = files(rel('.agents', 'workflows'), '.md').map((name) => name.replace(/\.md$/, ''));
const plugins = dirs(rel('.agents', 'plugins'));
const pluginSkills = [];
const pluginRules = [];
const pluginMcps = new Set();
const pluginHooks = [];

for (const plugin of plugins) {
  const pluginRoot = rel('.agents', 'plugins', plugin);
  for (const skill of dirs(path.join(pluginRoot, 'skills'))) pluginSkills.push(`${plugin}/${skill}`);
  for (const rule of files(path.join(pluginRoot, 'rules'), '.md')) pluginRules.push(`${plugin}/${rule}`);
  const mcpPath = path.join(pluginRoot, 'mcp_config.json');
  if (existsSync(mcpPath)) {
    const data = JSON.parse(readFileSync(mcpPath, 'utf8'));
    for (const name of Object.keys(data?.mcpServers || {})) pluginMcps.add(name);
  }
  const hooksPath = path.join(pluginRoot, 'hooks.json');
  if (existsSync(hooksPath)) {
    const data = JSON.parse(readFileSync(hooksPath, 'utf8'));
    for (const name of Object.keys(data || {})) pluginHooks.push(`${plugin}/${name}`);
  }
}

const capability = {
  generatedFrom: 'repository-static-config',
  workspaceAgents: existsSync(rel('.agents', 'agents.md')) ? ['.agents/agents.md'] : [],
  workspaceSkills,
  workflows,
  plugins,
  pluginSkills: pluginSkills.sort(),
  pluginRules: pluginRules.sort(),
  mcpServers: [...pluginMcps].sort(),
  hooks: pluginHooks.sort(),
  selectionPolicy: {
    useEveryRelevantCapability: true,
    activateIrrelevantCapabilities: false,
    reason: 'Use every capability that materially improves the current KI-channel task; avoid unrelated tools that add latency or tool-selection noise.'
  }
};

console.log(JSON.stringify(capability, null, 2));
