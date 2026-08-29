#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = [];
const agentNames = [
  'ki-production-orchestrator',
  'ki-fact-researcher',
  'ki-retention-story-auditor',
  'ki-motion-researcher',
  'ki-remotion-story-engineer',
  'ki-audio-sync-engineer',
  'ki-visual-qa-auditor',
  'ki-release-verifier',
  'ki-dependency-auditor',
];
const workflows = [
  'bootstrap-ki-channel',
  'sync-chatgpt-handoff',
  'parallel-audit-ki-reel',
  'maximize-ki-reel',
  'visual-qa-ki-reel',
  'finish-ki-reel',
  'verify-ki-reel',
  'audit-remotion-upgrade',
];
const requiredFiles = [
  'GEMINI.md',
  '.agents/agents.md',
  '.agents/ANTIGRAVITY-LOCAL-SETUP.md',
  ...agentNames.map((name) => `.agents/agents/${name}/agent.md`),
  ...workflows.map((name) => `.agents/workflows/${name}.md`),
  '.agents/skills/remotion-storytelling/SKILL.md',
  '.agents/skills/remotion-bits-discovery/SKILL.md',
  '.agents/plugins/ki-channel-production/plugin.json',
  '.agents/plugins/ki-channel-production/mcp_config.json',
  '.agents/plugins/ki-channel-production/hooks.json',
  '.agents/plugins/ki-channel-production/rules/production.md',
  '.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md',
  'scripts/antigravity-lightweight-check.mjs',
  'scripts/antigravity-safety-gate.mjs',
  'scripts/antigravity-session-reminder.mjs',
  'scripts/antigravity-stop-guard.mjs',
  'scripts/list-antigravity-capabilities.mjs',
  'scripts/sync-remotion-agent-skills.mjs',
  'scripts/render-story-beat-stills.mjs',
  'scripts/analyze-story-beat-visual-deltas.mjs',
  'scripts/run-antigravity-headless-audit.mjs',
  'scripts/antigravity-audit.schema.json',
];

for (const file of requiredFiles) if (!existsSync(path.resolve(root, file))) fail.push(`missing ${file}`);

const read = (file) => readFileSync(path.resolve(root, file), 'utf8');
const parseJson = (file) => {
  try { return JSON.parse(read(file)); }
  catch (error) { fail.push(`${file} invalid JSON: ${error.message}`); return null; }
};
const requireTokens = (file, tokens, {caseInsensitive = false} = {}) => {
  if (!existsSync(path.resolve(root, file))) return;
  let source = read(file);
  if (caseInsensitive) source = source.toLowerCase();
  for (const raw of tokens) {
    const token = caseInsensitive ? raw.toLowerCase() : raw;
    if (!source.includes(token)) fail.push(`${file} missing token: ${raw}`);
  }
};

const plugin = parseJson('.agents/plugins/ki-channel-production/plugin.json');
if (plugin?.name !== 'ki-channel-production') fail.push('plugin.json name must be ki-channel-production');
const allowedPluginKeys = new Set(['$schema', 'name', 'description']);
for (const key of Object.keys(plugin || {})) if (!allowedPluginKeys.has(key)) fail.push(`plugin.json contains unsupported key: ${key}`);

const mcp = parseJson('.agents/plugins/ki-channel-production/mcp_config.json');
for (const name of ['chrome-devtools', 'remotion-bits', 'github']) if (!mcp?.mcpServers?.[name]) fail.push(`MCP missing: ${name}`);
if (!String(mcp?.mcpServers?.['chrome-devtools']?.args || '').includes('chrome-devtools-mcp@latest')) fail.push('Chrome DevTools MCP command missing');
if (!String(mcp?.mcpServers?.['remotion-bits']?.args || '').includes('remotion-bits')) fail.push('Remotion Bits MCP command missing');
if (!String(mcp?.mcpServers?.github?.args || '').includes('ghcr.io/github/github-mcp-server')) fail.push('official GitHub MCP image missing');
if (mcp?.mcpServers?.github?.env?.GITHUB_TOOLSETS !== 'repos,pull_requests,issues') fail.push('GitHub MCP toolsets must stay focused on repos,pull_requests,issues');

const hooks = parseJson('.agents/plugins/ki-channel-production/hooks.json');
for (const name of ['ki-channel-session-context', 'ki-channel-safety-gate', 'ki-channel-post-edit', 'ki-channel-stop-guard']) {
  if (!hooks?.[name]) fail.push(`hook missing: ${name}`);
}
const safetyMatcher = String(hooks?.['ki-channel-safety-gate']?.PreToolUse?.[0]?.matcher || '');
for (const tool of ['run_command', 'write_to_file', 'replace_file_content', 'multi_replace_file_content']) if (!safetyMatcher.includes(tool)) fail.push(`PreToolUse safety matcher missing ${tool}`);
const postMatcher = String(hooks?.['ki-channel-post-edit']?.PostToolUse?.[0]?.matcher || '');
for (const tool of ['write_to_file', 'replace_file_content', 'multi_replace_file_content']) if (!postMatcher.includes(tool)) fail.push(`PostToolUse matcher missing ${tool}`);
if (/edit_file|create_file/.test(postMatcher)) fail.push('PostToolUse matcher contains obsolete edit_file/create_file tool names');
if (!hooks?.['ki-channel-session-context']?.PreInvocation) fail.push('PreInvocation session hook missing');
if (!hooks?.['ki-channel-stop-guard']?.Stop) fail.push('Stop guard hook missing');

const pkg = parseJson('package.json');
const expectedScripts = {
  'antigravity:verify': 'node scripts/check-antigravity-integration.mjs',
  'antigravity:capabilities': 'node scripts/list-antigravity-capabilities.mjs',
  'antigravity:skills': 'node scripts/sync-remotion-agent-skills.mjs add',
  'antigravity:skills:update': 'node scripts/sync-remotion-agent-skills.mjs update',
  'antigravity:story-stills': 'node scripts/render-story-beat-stills.mjs',
  'antigravity:audit': 'node scripts/run-antigravity-headless-audit.mjs',
};
for (const [name, command] of Object.entries(expectedScripts)) if (pkg?.scripts?.[name] !== command) fail.push(`package.json missing/wrong ${name} script`);

const auditSchema = parseJson('scripts/antigravity-audit.schema.json');
if (auditSchema?.type !== 'object') fail.push('headless audit schema must be an object schema');
for (const field of ['mode', 'target', 'overallStatus', 'summary', 'checks', 'blockers', 'recommendedNextActions']) if (!auditSchema?.required?.includes(field)) fail.push(`headless audit schema missing required field ${field}`);

for (const name of agentNames) requireTokens(`.agents/agents/${name}/agent.md`, [`name: ${name}`, 'subagent: true', '# System Prompt']);
requireTokens('.agents/agents/ki-production-orchestrator/agent.md', ['mainAgent: true', 'invoke_subagent', 'manage_subagents', 'ki-fact-researcher', 'ki-motion-researcher', 'ki-release-verifier']);
requireTokens('.agents/agents/ki-retention-story-auditor/agent.md', ['TOP DROP-OFF RISKS', 'VISUAL GRAMMAR REPETITION', 'REQUIRES_RETURN_TO_PHASE_2']);
requireTokens('.agents/agents/ki-audio-sync-engineer/agent.md', ['PHASE 2 — WARTET AUF NUTZER-AUDIO', 'Never synthesize', 'forced alignment'], {caseInsensitive: true});
requireTokens('.agents/agents/ki-visual-qa-auditor/agent.md', ['NOT ENOUGH EVIDENCE', 'Source code alone is never enough']);
requireTokens('.agents/agents/ki-release-verifier/agent.md', ['fail-closed', 'NOT RUN', 'BLOCKED'], {caseInsensitive: true});

requireTokens('scripts/antigravity-safety-gate.mjs', ['01-script-audio', 'Production voiceover is user-owned Phase 2 input', 'Remote production voiceover download is forbidden', "respond('deny'", "respond('force_ask'"]);
requireTokens('scripts/antigravity-session-reminder.mjs', ['invocationNum', 'antigravity:capabilities', 'single-writer policy']);
requireTokens('scripts/antigravity-stop-guard.mjs', ['fullyIdle', "decision: 'continue'"]);
requireTokens('scripts/antigravity-lightweight-check.mjs', ['git', 'status', '--porcelain', 'package.json', 'check-antigravity-integration.mjs']);
requireTokens('scripts/render-story-beat-stills.mjs', ['story-beats', "'remotion', 'still'", '--frame=', 'manifest.json']);
requireTokens('scripts/analyze-story-beat-visual-deltas.mjs', ['SUSPICIOUS_STATIC', 'normalizedMeanAbsoluteDelta', 'visual-delta-report.json', 'diagnostic signal only']);
requireTokens('scripts/run-antigravity-headless-audit.mjs', ["'--output-format', 'json'", "'--json-schema'", "'--agent'", "'--sandbox'", 'structured_output', 'ki-release-verifier']);
if (read('scripts/run-antigravity-headless-audit.mjs').includes('--dangerously-skip-permissions')) fail.push('headless audit must never use --dangerously-skip-permissions');

requireTokens('scripts/list-antigravity-capabilities.mjs', ["rel('.agents', 'agents')", 'workspaceAgents', 'antigravityBuiltInAgents', 'parallel-subagents', 'background-tasks', 'browser-agent', 'headless-structured-output', 'singleWriterPerWorkingTree', 'useEveryRelevantCapability']);

for (const workflow of workflows) requireTokens(`.agents/workflows/${workflow}.md`, [`# /${workflow}`]);
requireTokens('.agents/workflows/maximize-ki-reel.md', ['ki-fact-researcher', 'ki-retention-story-auditor', 'ki-motion-researcher', 'ki-dependency-auditor', 'ki-remotion-story-engineer', 'ki-audio-sync-engineer', 'ki-visual-qa-auditor', 'ki-release-verifier']);
requireTokens('.agents/workflows/parallel-audit-ki-reel.md', ['ki-fact-researcher', 'ki-retention-story-auditor', 'ki-motion-researcher', 'ki-dependency-auditor']);
requireTokens('.agents/workflows/visual-qa-ki-reel.md', ['antigravity:story-stills', 'analyze-story-beat-visual-deltas.mjs', 'Chrome DevTools MCP', 'ki-visual-qa-auditor']);
requireTokens('.agents/workflows/sync-chatgpt-handoff.md', ['git fetch --all --prune', 'voiceover.mp3', 'maximize-ki-reel']);
requireTokens('.agents/workflows/audit-remotion-upgrade.md', ['ki-dependency-auditor', 'STAY_PINNED', 'UPGRADE_AFTER_PR28', 'Do not edit package files']);

requireTokens('.agents/ANTIGRAVITY-LOCAL-SETUP.md', ['--dangerously-skip-permissions', 'Modern Web Guidance', '/teamwork-preview', 'antigravity:audit', 'antigravity:story-stills']);
requireTokens('GEMINI.md', ['.agents/agents/', 'antigravity:capabilities', '/bootstrap-ki-channel', '/sync-chatgpt-handoff', '/parallel-audit-ki-reel', '/maximize-ki-reel', '/visual-qa-ki-reel', '/audit-remotion-upgrade', 'Chrome DevTools MCP', 'Remotion Bits MCP', 'GitHub MCP', 'remotion-storytelling', 'analyze-story-beat-visual-deltas.mjs', 'antigravity:audit', 'genau ein Writer'], {caseInsensitive: true});
requireTokens('.agents/workflows/bootstrap-ki-channel.md', ['antigravity:skills', 'antigravity:capabilities', 'antigravity:verify', '/agents', '/hooks', '/mcp', '/tasks', 'chrome-devtools', 'remotion-bits', 'github', 'Modern Web Guidance', 'Teamwork', 'SELECTED FOR THIS TASK']);

const orchestratorSkill = '.agents/plugins/ki-channel-production/skills/ki-reel-orchestrator/SKILL.md';
requireTokens(orchestratorSkill, ['ki-production-orchestrator', 'ki-fact-researcher', 'ki-motion-researcher', 'ki-remotion-story-engineer', 'ki-audio-sync-engineer', 'ki-visual-qa-auditor', 'ki-release-verifier', 'ki-dependency-auditor', 'remotion-storytelling', 'remotion-bits-discovery', 'Remotion Bits MCP', 'Chrome DevTools MCP', 'GitHub MCP', 'PHASE 2', 'antigravity:audit'], {caseInsensitive: true});

if (fail.length) {
  console.error('ANTIGRAVITY INTEGRATION: FAILED');
  for (const issue of [...new Set(fail)]) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('ANTIGRAVITY INTEGRATION: PASSED');
console.log(`custom agents: ${agentNames.length}`);
console.log(`workflows: ${workflows.length}`);
console.log('capability discovery: real agents + skills + workflows + plugins + MCP + hooks');
console.log('plugin: ki-channel-production');
console.log('MCP: Chrome DevTools + Remotion Bits + GitHub');
console.log('hooks: session context + PreTool safety + PostTool regression + Stop guard');
console.log('visual QA: per-story-beat stills + pixel-delta diagnostics wired');
console.log('headless: structured agy audits wired with sandbox and no permission bypass');
console.log('audio boundary: user-production-voiceover guard wired');
