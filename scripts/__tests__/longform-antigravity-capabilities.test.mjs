import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const read = (file) => readFileSync(file, 'utf8');
const nodeCheck = (file) => spawnSync(process.execPath, ['--check', file], {encoding:'utf8'});

test('Longform capability and smoke scripts are valid JavaScript', () => {
  for (const file of [
    'scripts/materialize-longform-media.mjs',
    'scripts/approve-longform-media.mjs',
    'scripts/check-antigravity-longform-capabilities.mjs',
    'scripts/with-media-path.mjs',
    'scripts/with-longform-node20.mjs',
    'scripts/ensure-chrome-devtools.mjs',
    'scripts/scout-wikimedia-commons-video-assets.mjs',
    'scripts/run-longform-capability-smoke.mjs',
    'scripts/run-longform-media-smoke.mjs',
    'scripts/render-ki-longform-master.mjs',
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

test('Longform workflow is wired to dedicated agents, Node 20 and canonical render path', () => {
  const workflow = read('.agents/workflows/longform-full-cycle.md');
  const motionWorkflow = read('.agents/workflows/open-ended-motion-production.md');
  const orchestrator = read('.agents/agents/ki-longform-production-orchestrator/agent.md');
  const engineer = read('.agents/agents/ki-longform-remotion-engineer/agent.md');
  assert.match(workflow, /with-longform-node20\.mjs/);
  assert.match(workflow, /check-antigravity-longform-capabilities\.mjs/);
  assert.match(workflow, /materialize-longform-media\.mjs/);
  assert.match(workflow, /approve-longform-media\.mjs/);
  assert.match(workflow, /render-ki-longform-master\.mjs/);
  assert.match(workflow, /ensure-chrome-devtools\.mjs/);
  assert.match(workflow, /scout-wikimedia-commons-video-assets\.mjs/);
  assert.match(workflow, /ki-longform-remotion-engineer/);
  assert.match(workflow, /open-ended-motion-production\.md/);
  assert.match(motionWorkflow, /OPEN_ENDED_STORY_DRIVEN/);
  assert.match(motionWorkflow, /Official source \/ proof/);
  assert.match(motionWorkflow, /Real B-roll \/ real image/);
  assert.match(orchestrator, /skills\/longform-media-production/);
  assert.match(orchestrator, /with-longform-node20\.mjs/);
  assert.match(orchestrator, /scout-wikimedia-commons-video-assets\.mjs/);
  assert.match(engineer, /OPEN_ENDED_STORY_DRIVEN/);
  assert.match(engineer, /Never give every chapter a fixed equal duration such as 1000 frames/);
});

test('capability checker uses real executable probes and actual production MCP config', () => {
  const checker = read('scripts/check-antigravity-longform-capabilities.mjs');
  assert.match(checker, /\.agents\/plugins\/ki-channel-production\/mcp_config\.json/);
  assert.doesNotMatch(checker, /\.agents\/plugins\/ki-channel\/mcp_config\.json/);
  assert.match(checker, /ffmpeg',\['-version'\]/);
  assert.match(checker, /ffprobe',\['-version'\]/);
  assert.doesNotMatch(checker, /ffmpeg',\['--version'\]/);
  assert.match(checker, /node@20/);
  assert.match(checker, /chromeDevtoolsEndpointReachable/);
  assert.match(checker, /keyFreeRealBrollDiscovery/);
  const mcp = read('.agents/plugins/ki-channel-production/mcp_config.json');
  assert.match(mcp, /chrome-devtools/);
  assert.match(mcp, /remotion-bits/);
  assert.match(mcp, /github/);
});

test('Skia smoke follows the repository and official Remotion bundling contract', () => {
  const config = read('remotion.config.ts');
  const canonicalEntry = read('ki/src/index.ts');
  const smokeEntry = read('ki/src/longform-capability-smoke/index.ts');
  assert.match(config, /enableSkia/);
  assert.match(config, /setChromiumOpenGlRenderer\('angle'\)/);
  assert.match(canonicalEntry, /LoadSkia/);
  assert.match(smokeEntry, /LoadSkia/);
});

test('advanced smoke executes real rendered capabilities independently', () => {
  const root = read('ki/src/longform-capability-smoke/Root.tsx');
  const runner = read('scripts/run-longform-capability-smoke.mjs');
  assert.match(root, /@remotion\/effects\/blur/);
  assert.match(root, /noise2D/);
  assert.match(root, /TransitionSeries/);
  assert.match(root, /SkiaCanvas/);
  assert.match(root, /ThreeCanvas/);
  assert.match(root, /LineChart/);
  assert.match(root, /gsap\.parseEase/);
  assert.match(root, /staticFile\('longform-capability-smoke\/whoosh\.mp3'\)/);
  for (const id of ['LongformSmokeBase','LongformSmokeSkia','LongformSmokeThree','LongformSmokeSfx']) assert.match(runner,new RegExp(id));
  assert.match(runner, /EXECUTED_PASS/);
  assert.match(runner, /@remotion\/sfx/);
});

test('real media smoke cannot fake Wikimedia with a local generated placeholder', () => {
  const mediaSmoke = read('scripts/run-longform-media-smoke.mjs');
  assert.match(mediaSmoke, /scout-wikimedia-commons-video-assets\.mjs/);
  assert.match(mediaSmoke, /--scout=/);
  assert.match(mediaSmoke, /MATERIALIZED_PENDING_REVIEW/);
  assert.match(mediaSmoke, /rightsVerified!==false/);
  assert.doesNotMatch(mediaSmoke, /--local-input/);
  assert.doesNotMatch(mediaSmoke, /color=c=white/);
});

test('canonical master keeps Remotion CLI on the pinned process Node', () => {
  const render = read('scripts/render-ki-longform-master.mjs');
  assert.match(render, /process\.execPath/);
  assert.match(render, /node_modules','\.bin'/);
  assert.match(render, /chromiumGl:'angle'/);
  assert.doesNotMatch(render, /run\(npx/);
});
