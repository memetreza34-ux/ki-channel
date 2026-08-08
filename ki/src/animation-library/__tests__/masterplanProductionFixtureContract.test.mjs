import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {loadSceneMeaningEnhancer} from '../../../../scripts/load-scene-meaning-enhancer.mjs';

const readJson = (path) =>
  JSON.parse(readFileSync(resolve(path), 'utf8'));

const fixtureConfig = readJson(
  'ki/src/animation-library/masterplan-content-fixtures.json',
);
const renderConfig = readJson(
  'ki/src/animation-library/prototype-render-config.json',
);

const EXPECTED_FAMILY_BY_ID = {
  'retrieval-search-knowledge-magnet-v1': 'retrieval-search',
  'cost-efficiency-budget-leak-meter-v1': 'cost-efficiency',
  'context-window-context-window-train-v1': 'context-window',
  'decision-logic-decision-tree-burst-v1': 'decision-logic',
  'human-ai-collaboration-human-ai-relay-v1': 'human-ai-collaboration',
  'learning-update-knowledge-tree-graft-v1': 'learning-update',
  'tokenization-magnetic-phrase-slicer-v1': 'tokenization',
  'data-transformation-vector-prism-converter-v1': 'data-transformation',
  'ranking-dynamic-podium-rise-v1': 'ranking',
  'process-flow-subway-workflow-map-v1': 'process-flow',
  'input-output-funnel-compression-output-v1': 'input-output',
  'error-detection-anomaly-xray-scanner-v1': 'error-detection',
  'semantic-space-meaning-terrain-v1': 'semantic-space',
  'relationship-network-dependency-bridge-builder-v1': 'relationship-network',
  'probability-probability-fluid-columns-v1': 'probability',
  'model-processing-residual-river-v1': 'model-processing',
  'generation-answer-loom-v1': 'generation',
  'risk-contrast-confidence-glass-crack-v1': 'risk-contrast',
  'security-privacy-encryption-vault-layers-v1': 'security-privacy',
  'scale-performance-latency-tunnel-race-v1': 'scale-performance',
  'time-change-timeline-microscope-v1': 'time-change',
  'comparison-benchmark-racetrack-v1': 'comparison',
};

describe('masterplan production fixture contract', () => {
  it('covers exactly the same 22 ids as the production prototype render config', () => {
    expect(fixtureConfig.version).toBe(1);
    expect(fixtureConfig.fixtures).toHaveLength(22);
    expect(renderConfig.prototypes).toHaveLength(22);

    const fixtureIds = fixtureConfig.fixtures
      .map((fixture) => fixture.animationId)
      .sort();
    const renderIds = renderConfig.prototypes
      .map((prototype) => prototype.animationId)
      .sort();

    expect(new Set(fixtureIds).size).toBe(22);
    expect(fixtureIds).toEqual(renderIds);
    expect(Object.keys(EXPECTED_FAMILY_BY_ID).sort()).toEqual(renderIds);
  });

  it('contains spoken production inputs only, never direct runtime labels or values', () => {
    for (const fixture of fixtureConfig.fixtures) {
      expect(Object.keys(fixture).sort(), fixture.animationId).toEqual([
        'animationId',
        'spokenText',
      ]);
      expect(fixture.spokenText.trim().length, fixture.animationId).toBeGreaterThan(20);
      expect(fixture, fixture.animationId).not.toHaveProperty('labels');
      expect(fixture, fixture.animationId).not.toHaveProperty('values');
      expect(fixture, fixture.animationId).not.toHaveProperty('content');
      expect(fixture, fixture.animationId).not.toHaveProperty('props');
    }
  });

  it('derives a complete meaning contract for every production fixture', async () => {
    const enhanceSceneMeaning = await loadSceneMeaningEnhancer();

    for (const fixture of fixtureConfig.fixtures) {
      const contract = enhanceSceneMeaning(fixture.spokenText);
      expect(contract, fixture.animationId).toEqual(expect.any(Object));
      expect(contract.communicationGoal, fixture.animationId).toEqual(
        expect.any(String),
      );
      expect(contract.startState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.visibleChange.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.endState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.requiredVisualCues.length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.forbiddenVisualCues, fixture.animationId).toEqual(expect.any(Array));
    }
  });

  it('keeps precision-sensitive examples grounded in the actual spoken text', () => {
    const byId = new Map(
      fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture.spokenText]),
    );

    expect(byId.get('cost-efficiency-budget-leak-meter-v1')).toMatch(/94\s*Cent/i);
    expect(byId.get('cost-efficiency-budget-leak-meter-v1')).toMatch(/28\s*Cent/i);
    expect(byId.get('cost-efficiency-budget-leak-meter-v1')).toMatch(/sink|senk|reduzier|spar/i);

    expect(byId.get('probability-probability-fluid-columns-v1')).toMatch(/66\s*Prozent/i);
    expect(byId.get('scale-performance-latency-tunnel-race-v1')).toMatch(/780\s*Millisekunden/i);
    expect(byId.get('scale-performance-latency-tunnel-race-v1')).toMatch(/340\s*Millisekunden/i);
    expect(byId.get('ranking-dynamic-podium-rise-v1')).toMatch(/Platz\s+eins/i);
    expect(byId.get('comparison-benchmark-racetrack-v1')).toMatch(/gewinnt\s+Modell\s+B/i);
  });

  it('keeps one expected visual family contract per production id', async () => {
    const enhanceSceneMeaning = await loadSceneMeaningEnhancer();

    for (const fixture of fixtureConfig.fixtures) {
      const expectedFamily = EXPECTED_FAMILY_BY_ID[fixture.animationId];
      const contract = enhanceSceneMeaning(fixture.spokenText);
      expect(expectedFamily, fixture.animationId).toBeTruthy();
      expect(
        contract.preferredVisualFamilies,
        `${fixture.animationId} -> ${contract.preferredVisualFamilies.join(', ')}`,
      ).toContain(expectedFamily);
    }
  });
});
