import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];
const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) failures.push(`${label}: erwartet ${fragment}`);
};

const gemini = read('GEMINI.md');
const rule = read('.agents/rules/content-grounding.md');
const skill = read('.agents/skills/content-grounding-test/SKILL.md');
const agent = read('.agents/agents/content-test-runner/agent.md');

const commands = [
  'node scripts/check-masterplan-production-inputs.mjs',
  'node scripts/check-first-content-grounding-test-contract.mjs',
  'node scripts/run-first-content-grounding-test.mjs',
  'node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1',
  'node scripts/run-content-release.mjs verify',
];

for (const [label, source] of [
  ['GEMINI.md', gemini],
  ['workspace rule', rule],
  ['content-grounding skill', skill],
  ['content-test agent', agent],
]) {
  for (const command of commands) requireContains(source, command, label);
}

for (const required of [
  'name: content-grounding-test',
  'masterplan-content-fixtures.json',
  'content-render-fixtures.json',
  '94',
  '28',
  '780',
  '340',
  'test-summary.json',
]) {
  requireContains(skill, required, 'content-grounding skill');
}

for (const required of [
  'name: content-test-runner',
  'run_command',
  'view_file',
  'replace_file_content',
  'content-grounding-test',
]) {
  requireContains(agent, required, 'content-test agent');
}

for (const required of [
  'AGENTS.md',
  '.agents/skills/content-grounding-test/SKILL.md',
  '94 Cent -> 28 Cent',
  '780 ms -> 340 ms',
]) {
  requireContains(gemini, required, 'GEMINI.md');
}

if (failures.length > 0) {
  console.error('Antigravity-Content-Test-Vertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Antigravity-Content-Test-Vertrag bestanden: GEMINI.md, Workspace-Rule, Skill und Test-Agent führen reproduzierbar durch Test 0, Test 1, Latenz-Test und technischen Verify.',
);
