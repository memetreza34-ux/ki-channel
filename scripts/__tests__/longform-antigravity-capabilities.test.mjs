import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const read = (file) => readFileSync(file, 'utf8');
const nodeCheck = (file) => spawnSync(process.execPath, ['--check', file], {encoding:'utf8'});

test('new Longform capability scripts are valid JavaScript', () => {
  for (const file of [
    'scripts/materialize-longform-media.mjs',
    'scripts/approve-longform-media.mjs',
    'scripts/check-antigravity-longform-capabilities.mjs',
    'scripts/with-media-path.mjs',
  ]) {
    const result = nodeCheck(file);
    assert.equal(result.status, 0, `${file}: ${result.stderr || result.stdout}`);
  }
});

test('materialization and approval remain separate fail-closed states', () => {
  const materialize = read('scripts/materialize-longform-media.mjs');
  const approve = read('scripts/approve-longform-media.mjs');
  assert.match(materialize, /asset\.rightsVerified = false/);
  assert.match(materialize, /MATERIALIZED_PENDING_REVIEW/);
  assert.doesNotMatch(materialize, /asset\.rightsVerified = true/);
  assert.match(approve, /asset\.rightsVerified = true/);
  assert.match(approve, /SHA-256 mismatch/);
  assert.match(approve, /asset\.status = 'APPROVED'/);
});

test('Longform workflow is wired to dedicated agents and canonical render path', () => {
  const workflow = read('.agents/workflows/longform-full-cycle.md');
  const motionWorkflow = read('.agents/workflows/open-ended-motion-production.md');
  const orchestrator = read('.agents/agents/ki-longform-production-orchestrator/agent.md');
  const engineer = read('.agents/agents/ki-longform-remotion-engineer/agent.md');
  assert.match(workflow, /check-antigravity-longform-capabilities\.mjs/);
  assert.match(workflow, /materialize-longform-media\.mjs/);
  assert.match(workflow, /approve-longform-media\.mjs/);
  assert.match(workflow, /render-ki-longform-master\.mjs/);
  assert.match(workflow, /with-media-path\.mjs/);
  assert.match(workflow, /ki-longform-remotion-engineer/);
  assert.match(workflow, /open-ended-motion-production\.md/);
  assert.match(motionWorkflow, /OPEN_ENDED_STORY_DRIVEN/);
  assert.match(motionWorkflow, /Official source \/ proof/);
  assert.match(motionWorkflow, /Real B-roll \/ real image/);
  assert.match(orchestrator, /skills\/longform-media-production/);
  assert.match(orchestrator, /open-ended-motion-production\.md/);
  assert.match(engineer, /OPEN_ENDED_STORY_DRIVEN/);
  assert.match(engineer, /open-ended-motion-production\.md/);
  assert.match(engineer, /Never give every chapter a fixed equal duration such as 1000 frames/);
});

test('capability checker uses the actual production plugin MCP config and portable media runtime', () => {
  const checker = read('scripts/check-antigravity-longform-capabilities.mjs');
  assert.match(checker, /\.agents\/plugins\/ki-channel-production\/mcp_config\.json/);
  assert.doesNotMatch(checker, /\.agents\/plugins\/ki-channel\/mcp_config\.json/);
  assert.match(checker, /\/opt\/homebrew\/bin/);
  assert.match(checker, /chromeDevtoolsEndpointReachable/);
  const mcp = read('.agents/plugins/ki-channel-production/mcp_config.json');
  assert.match(mcp, /chrome-devtools/);
  assert.match(mcp, /remotion-bits/);
  assert.match(mcp, /github/);
});
