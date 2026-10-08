import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const read = async (path) => readFile(resolve(path),'utf8');

test('Claude Code entry point and both production skills exist', async () => {
  const [entry,director,critic] = await Promise.all([
    read('CLAUDE.md'),
    read('.claude/skills/motion-director/SKILL.md'),
    read('.claude/skills/creative-critic/SKILL.md'),
  ]);
  assert.match(entry,/Opus 5\.5/);
  assert.match(entry,/REPO-STATE\.md/);
  assert.match(entry,/Remotion/);
  assert.match(director,/State A/);
  assert.match(director,/State C/);
  assert.match(critic,/Human Creative/i);
  assert.match(critic,/MP4/);
});

test('15 second pilot has deterministic four shot storyboard and production registration', async () => {
  const [source,root,presets,guide] = await Promise.all([
    read('ki/src/longform/ai-app-workflow/motionProof/MotionProof.tsx'),
    read('ki/src/ProductionRoot.tsx'),
    read('scripts/visual-review-presets.mjs'),
    read('ki/gehirn/CLAUDE_MOTION_BENCHMARK.md'),
  ]);
  assert.match(source,/CLAUDE_MOTION_PROOF_FRAMES = 450/);
  assert.match(source,/CLAUDE_MOTION_PROOF_FPS = 30/);
  for(const stage of ['PromptScene','CoreScene','AppScene','ValidateScene']) assert.match(source,new RegExp('const '+stage));
  assert.equal((source.match(/<Sequence from=/g)||[]).length,4);
  assert.match(root,/id={CLAUDE_MOTION_PROOF_ID}/);
  assert.match(presets,/claudeMotionProof:/);
  assert.match(presets,/layout: 'landscape'/);
  assert.match(guide,/baseline/);
});

test('YouTube production now uses Claude Code, not Antigravity', async () => {
  const contract=await read('ki/youtube-longform/AGENTS.md');
  assert.match(contract,/Phase 3 — Claude Code/);
  assert.match(contract,/motion-director/);
  assert.match(contract,/creative-critic/);
  assert.doesNotMatch(contract,/### Phase 3 — Codex \/ Antigravity/);
});
