import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const read = (file) => readFileSync(file, 'utf8');
const syntaxOk = (file) => spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});

test('longform runtime and capability scripts parse', () => {
  for (const file of [
    'scripts/check-antigravity-longform-capabilities.mjs',
    'scripts/with-longform-node24.mjs',
    'scripts/with-longform-node20.mjs',
    'scripts/materialize-longform-media.mjs',
    'scripts/approve-longform-media.mjs',
    'scripts/render-ki-longform-master.mjs',
  ]) {
    const result = syntaxOk(file);
    assert.equal(result.status, 0, `${file}: ${result.stderr || result.stdout}`);
  }
});

test('Node 24 LTS is the production runtime contract', () => {
  const checker = read('scripts/check-antigravity-longform-capabilities.mjs');
  const workflow = read('.agents/workflows/longform-full-cycle.md');
  const orchestrator = read('.agents/agents/ki-longform-production-orchestrator/agent.md');
  assert.ok(checker.includes('node@24'));
  assert.ok(checker.includes('node24ProductionRuntime'));
  assert.ok(workflow.includes('with-longform-node24.mjs'));
  assert.ok(orchestrator.includes('with-longform-node24.mjs'));
});

test('legacy Node 20 wrapper only delegates to Node 24', () => {
  const legacy = read('scripts/with-longform-node20.mjs');
  assert.ok(legacy.includes('with-longform-node24.mjs'));
  assert.equal(legacy.includes("'node@20'"), false);
});

test('media materialization and approval stay fail-closed', () => {
  const materialize = read('scripts/materialize-longform-media.mjs');
  const approve = read('scripts/approve-longform-media.mjs');
  assert.ok(materialize.includes('MATERIALIZED_PENDING_REVIEW'));
  assert.ok(materialize.includes('asset.rightsVerified = false'));
  assert.ok(approve.includes('asset.rightsVerified = true'));
  assert.ok(approve.includes("asset.status = 'APPROVED'"));
  assert.ok(approve.includes('SHA-256 mismatch'));
});

test('canonical longform workflow keeps real media and canonical render contracts', () => {
  const workflow = read('.agents/workflows/longform-full-cycle.md');
  const motion = read('.agents/workflows/open-ended-motion-production.md');
  assert.ok(workflow.includes('materialize-longform-media.mjs'));
  assert.ok(workflow.includes('approve-longform-media.mjs'));
  assert.ok(workflow.includes('render-ki-longform-master.mjs'));
  assert.ok(workflow.includes('scout-wikimedia-commons-video-assets.mjs'));
  assert.ok(motion.includes('OPEN_ENDED_STORY_DRIVEN'));
});

test('canonical master stays on the pinned process runtime', () => {
  const render = read('scripts/render-ki-longform-master.mjs');
  assert.ok(render.includes('process.execPath'));
  assert.ok(render.includes("node_modules','.bin'"));
  assert.ok(render.includes("chromiumGl:'angle'"));
});
