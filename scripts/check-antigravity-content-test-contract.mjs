import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];
const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) failures.push(`${label}: erwartet ${fragment}`);
};
const requireExcludes = (source, fragment, label) => {
  if (source.includes(fragment)) failures.push(`${label}: darf alten Pfad nicht enthalten: ${fragment}`);
};

const gemini = read('GEMINI.md');
const rule = read('.agents/rules/content-grounding.md');
const skill = read('.agents/skills/content-grounding-test/SKILL.md');
const agent = read('.agents/agents/content-test-runner/agent.md');
const runner = read('scripts/run-antigravity-content-test.mjs');
const reelSkill = read('.agents/skills/build-context-overload-reel/SKILL.md');
const reelAgent = read('.agents/agents/context-overload-reel-builder/agent.md');
const structureValidator = read('scripts/check-ki-reel-folder-structure.mjs');

const groundingCommands = [
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
  for (const command of groundingCommands) requireContains(source, command, label);
}

for (const [label, source] of [
  ['GEMINI.md', gemini],
  ['workspace rule', rule],
  ['reel build skill', reelSkill],
  ['reel build agent', reelAgent],
  ['Antigravity one-command runner', runner],
]) {
  requireContains(source, 'check-ki-reel-folder-structure.mjs', label);
}

const canonicalPackage =
  'ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht';
for (const [label, source] of [
  ['GEMINI.md', gemini],
  ['reel build skill', reelSkill],
  ['reel build agent', reelAgent],
]) {
  requireContains(source, canonicalPackage, label);
  requireExcludes(source, '`ki/src/reels/antigravity-context-overload/`\n\nRead the nested', label);
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
]) requireContains(skill, required, 'content-grounding skill');

for (const required of [
  'name: content-test-runner',
  'run_command',
  'view_file',
  'replace_file_content',
  'content-grounding-test',
]) requireContains(agent, required, 'content-test agent');

for (const required of [
  'AGENTS.md',
  '.agents/skills/content-grounding-test/SKILL.md',
  '94 Cent -> 28 Cent',
  '780 ms -> 340 ms',
  'node scripts/run-antigravity-content-test.mjs',
]) requireContains(gemini, required, 'GEMINI.md');

for (const required of [
  'scripts/check-ki-reel-folder-structure.mjs',
  'scripts/check-antigravity-content-test-contract.mjs',
  'scripts/check-masterplan-production-inputs.mjs',
  'scripts/check-first-content-grounding-test-contract.mjs',
  'scripts/run-first-content-grounding-test.mjs',
  'scale-performance-latency-tunnel-race-v1',
  'out/antigravity-content-test',
  "status: 'passed'",
  'initialCost !== 94',
  'optimizedCost !== 28',
  'slowLatency !== 780',
  'fastLatency !== 340',
]) requireContains(runner, required, 'Antigravity one-command runner');

for (const required of [
  'YYYY-MM-DD_bis_YYYY-MM-DD',
  '01-script-audio',
  '06-projektdateien',
  'SOURCE_FORBIDDEN_PLANNING_MARKERS',
  'Reel-Projekte dürfen niemals direkt unter ki/',
]) requireContains(structureValidator, required, 'KI reel structure validator');

if (failures.length > 0) {
  console.error('Antigravity-Content-Test-Vertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Antigravity-Content-Test-Vertrag bestanden: Grounding-Test und erster Reel-Builder sind an die dauerhafte Wochen-/01–06-Struktur gebunden; Planungs- und Source-Pfade bleiben getrennt.',
);
