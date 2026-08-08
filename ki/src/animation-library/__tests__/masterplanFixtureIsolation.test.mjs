import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {loadSceneMeaningEnhancer} from '../../../../scripts/load-scene-meaning-enhancer.mjs';
import {getMasterplanFixtureContent} from '../../../../scripts/masterplan-content-release-utils.mjs';

const readJson = (path) =>
  JSON.parse(readFileSync(resolve(path), 'utf8'));

const demoFixtureConfig = readJson(
  'ki/src/animation-library/content-render-fixtures.json',
);
const productionFixtureConfig = readJson(
  'ki/src/animation-library/masterplan-content-fixtures.json',
);

describe('masterplan fixture isolation', () => {
  it('keeps demo fixture labels and values out of canonical production source content', () => {
    expect(demoFixtureConfig.fixtures).toHaveLength(22);

    const fixturesWithDirectValues = demoFixtureConfig.fixtures.filter((fixture) => {
      const raw = fixture.content ?? fixture;
      return raw.values && Object.keys(raw.values).length > 0;
    });
    expect(fixturesWithDirectValues.length).toBeGreaterThan(0);

    for (const fixture of demoFixtureConfig.fixtures) {
      const extracted = getMasterplanFixtureContent(fixture);
      expect(extracted.spokenText, fixture.animationId).toEqual(expect.any(String));
      expect(extracted, fixture.animationId).not.toHaveProperty('labels');
      expect(extracted, fixture.animationId).not.toHaveProperty('values');
    }
  });

  it('accepts the flat production fixture shape and still exposes semantic input only', () => {
    expect(productionFixtureConfig.fixtures).toHaveLength(22);

    for (const fixture of productionFixtureConfig.fixtures) {
      const extracted = getMasterplanFixtureContent(fixture);
      expect(extracted.spokenText, fixture.animationId).toBe(fixture.spokenText);
      expect(extracted.meaningContract, fixture.animationId).toBeNull();
      expect(extracted, fixture.animationId).not.toHaveProperty('labels');
      expect(extracted, fixture.animationId).not.toHaveProperty('values');
    }
  });

  it('derives complete meaning from all 22 production spoken texts', async () => {
    const enhanceSceneMeaning = await loadSceneMeaningEnhancer();

    for (const fixture of productionFixtureConfig.fixtures) {
      const extracted = getMasterplanFixtureContent(fixture);
      const contract = enhanceSceneMeaning(extracted.spokenText);

      expect(contract.communicationGoal, fixture.animationId).toEqual(expect.any(String));
      expect(contract.startState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.visibleChange.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.endState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.requiredVisualCues.length, fixture.animationId).toBeGreaterThan(0);
    }
  });

  it('proves demo exact values and production exact values are separate data sources', () => {
    const demoFixture = demoFixtureConfig.fixtures.find(
      (fixture) => fixture.animationId === 'cost-efficiency-budget-leak-meter-v1',
    );
    const productionFixture = productionFixtureConfig.fixtures.find(
      (fixture) => fixture.animationId === 'cost-efficiency-budget-leak-meter-v1',
    );

    expect(demoFixture?.content?.values?.initialCost).toBe(94);
    expect(demoFixture?.content?.values?.optimizedCost).toBe(28);
    expect(productionFixture).not.toHaveProperty('values');
    expect(productionFixture.spokenText).toContain('94 Cent');
    expect(productionFixture.spokenText).toContain('28 Cent');
  });
});
