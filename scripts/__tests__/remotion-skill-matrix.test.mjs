import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {REMOTION_CAPABILITIES} from '../remotion-capability-contract.mjs';

const skills = [
  'remotion-best-practices',
  'remotion-create',
  'remotion-markup',
  'remotion-captions',
  'remotion-multimedia',
  'remotion-render',
  'remotion-studio',
  'remotion-interactivity',
  'remotion-maps',
  'remotion-docs',
  'remotion-saas',
  'remotion-upgrade',
];

const documentedPackages = [
  '@remotion/captions',
  '@remotion/cli',
  '@remotion/effects',
  '@remotion/google-fonts',
  '@remotion/layout-utils',
  '@remotion/light-leaks',
  '@remotion/lottie',
  '@remotion/media-utils',
  '@remotion/motion-blur',
  '@remotion/noise',
  '@remotion/paths',
  '@remotion/rive',
  '@remotion/shapes',
  '@remotion/three',
  '@remotion/transitions',
];

const docPath='ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md';
const gatePath='ki/gehirn/REMOTION_CAPABILITY_GATE.md';

const [doc,gate,packageJson]=await Promise.all([
  readFile(docPath,'utf8'),
  readFile(gatePath,'utf8'),
  readFile('package.json','utf8').then(JSON.parse),
]);

test('canonical Remotion matrix documents every available agent skill',()=>{
  for (const skill of skills) {
    assert.ok(doc.includes(`\`${skill}\``),`${docPath} must document ${skill}`);
  }
});

test('canonical Remotion matrix documents relevant installed Remotion packages',()=>{
  for (const pkg of documentedPackages) {
    assert.ok(packageJson.dependencies?.[pkg],`${pkg} must be installed before being treated as an installed package`);
    assert.ok(doc.includes(`\`${pkg}\``),`${docPath} must document installed package ${pkg}`);
  }
});

test('every executable beat capability is documented in both canonical matrix and hard gate',()=>{
  for (const capability of REMOTION_CAPABILITIES) {
    assert.ok(doc.includes(`\`${capability}\``),`${docPath} must document capability ${capability}`);
    assert.ok(gate.includes(`\`${capability}\``),`${gatePath} must document capability ${capability}`);
  }
});

test('deprecated light leaks cannot silently become a recommended new-production capability',()=>{
  const lightLeakSection=doc.toLowerCase();
  assert.ok(lightLeakSection.includes('@remotion/light-leaks'));
  assert.ok(lightLeakSection.includes('deprecated'));
  assert.ok(!REMOTION_CAPABILITIES.includes('light-leaks'));
});

test('effects stay documented as support and cannot silently become a primary capability',()=>{
  assert.ok(doc.includes('@remotion/effects'));
  assert.ok(doc.includes('Effects zählen **vorerst nicht als eigene Primary Beat-Capability**'));
  assert.ok(!REMOTION_CAPABILITIES.includes('effects'));
});

test('skill version and repo runtime version are explicitly separated',()=>{
  assert.match(doc,/Repo-Runtime:\*\* Remotion `4\.0\.529`/);
  assert.match(doc,/Agent-Skills:\*\* Stand `4\.0\.506`/);
  assert.match(doc,/Skill-Version und installierte Repo-Paketversion sind zwei verschiedene Dinge/);
});
