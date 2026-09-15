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

const workspaceAgents = [];
const agentRoot = rel('.agents', 'agents');
if (existsSync(agentRoot)) {
  for (const entry of readdirSync(agentRoot, {withFileTypes: true})) {
    if (entry.isFile() && entry.name.endsWith('.md')) workspaceAgents.push(entry.name.replace(/\.md$/, ''));
    if (entry.isDirectory() && existsSync(path.join(agentRoot, entry.name, 'agent.md'))) workspaceAgents.push(entry.name);
  }
}
workspaceAgents.sort();

const workspaceSkills = dirs(rel('.agents', 'skills'));
const workflows = files(rel('.agents', 'workflows'), '.md').map((name) => name.replace(/\.md$/, ''));
const plugins = dirs(rel('.agents', 'plugins'));
const pluginSkills = [];
const pluginRules = [];
const pluginAgents = [];
const pluginMcps = new Set();
const pluginHooks = [];

for (const plugin of plugins) {
  const pluginRoot = rel('.agents', 'plugins', plugin);
  for (const skill of dirs(path.join(pluginRoot, 'skills'))) pluginSkills.push(`${plugin}/${skill}`);
  for (const rule of files(path.join(pluginRoot, 'rules'), '.md')) pluginRules.push(`${plugin}/${rule}`);
  for (const agent of dirs(path.join(pluginRoot, 'agents'))) {
    if (existsSync(path.join(pluginRoot, 'agents', agent, 'agent.md'))) pluginAgents.push(`${plugin}/${agent}`);
  }
  for (const agentFile of files(path.join(pluginRoot, 'agents'), '.md')) pluginAgents.push(`${plugin}/${agentFile.replace(/\.md$/, '')}`);
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
  legacyAgentTeamSummary: existsSync(rel('.agents', 'agents.md')) ? '.agents/agents.md' : null,
  workspaceAgents,
  antigravityBuiltInAgents: ['research', 'browser', 'self'],
  workspaceSkills,
  workflows,
  plugins,
  pluginAgents: pluginAgents.sort(),
  pluginSkills: pluginSkills.sort(),
  pluginRules: pluginRules.sort(),
  mcpServers: [...pluginMcps].sort(),
  hooks: pluginHooks.sort(),
  platformCapabilitiesToExploitWhenRelevant: [
    'parallel-subagents',
    'background-tasks',
    'browser-agent',
    'browser-recordings-and-artifacts',
    'plan-mode',
    'terminal-sandbox',
    'permission-engine',
    'headless-structured-output',
    'build-with-google-modern-web-guidance',
    'teamwork-preview-if-user-plan-supports-it'
  ],
  selectionPolicy: {
    useEveryRelevantCapability: true,
    parallelizeIndependentReadOnlyWork: true,
    singleWriterPerWorkingTree: true,
    activateIrrelevantCapabilities: false,
    reason: 'Use every capability that materially improves the current KI-channel task; avoid unrelated tools that add latency, context pollution or tool-selection noise.'
  }
};

console.log(JSON.stringify(capability, null, 2));
