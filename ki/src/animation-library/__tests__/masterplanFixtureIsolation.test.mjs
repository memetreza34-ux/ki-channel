import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {loadSceneMeaningEnhancer} from '../../../../scripts/load-scene-meaning-enhancer.mjs';
import {getMasterplanFixtureContent} from '../../../../scripts/masterplan-content-release-utils.mjs';

const fixtureConfig = JSON.parse(
  readFileSync(
    resolve('ki/src/animation-library/content-render-fixtures.json'),
    'utf8',
  ),
);

describe('masterplan fixture isolation', () => {
  it('keeps direct fixture labels and values out of canonical production source content', () => {
    expect(Array.isArray(fixtureConfig.fixtures)).toBe(true);
    expect(fixtureConfig.fixtures).toHaveLength(22);

    const fixturesWithDirectValues = fixtureConfig.fixtures.filter((fixture) => {
      const raw = fixture.content ?? fixture;
      return raw.values && Object.keys(raw.values).length > 0;
    });
    expect(fixturesWithDirectValues.length).toBeGreaterThan(0);

    for (const fixture of fixtureConfig.fixtures) {
      const productionSource = getMasterplanFixtureContent(fixture);

      expect(productionSource.spokenText, fixture.animationId).toEqual(
        expect.any(String),
      );
      expect(
        productionSource.spokenText.trim().length,
        fixture.animationId,
      ).toBeGreaterThan(0);
      expect(productionSource, fixture.animationId).not.toHaveProperty('labels');
      expect(productionSource, fixture.animationId).not.toHaveProperty('values');
    }
  });

  it('derives a complete meaning contract from all 22 fixture spoken texts when no explicit contract exists', async () => {
    const enhanceSceneMeaning = await loadSceneMeaningEnhancer();

    for (const fixture of fixtureConfig.fixtures) {
      const productionSource = getMasterplanFixtureContent(fixture);
      const contract =
        productionSource.meaningContract ??
        enhanceSceneMeaning(productionSource.spokenText);

      expect(contract, fixture.animationId).toEqual(expect.any(Object));
      expect(contract.communicationGoal, fixture.animationId).toEqual(
        expect.any(String),
      );
      expect(contract.startState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.visibleChange.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.endState.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(contract.subjectTerms, fixture.animationId).toEqual(expect.any(Array));
      expect(contract.requiredVisualCues.length, fixture.animationId).toBeGreaterThan(0);
    }
  });

  it('proves the cost fixture cannot inject its direct exact numbers into masterplan props', () => {
    const fixture = fixtureConfig.fixtures.find(
      (candidate) =>
        candidate.animationId === 'cost-efficiency-budget-leak-meter-v1',
    );
    expect(fixture).toBeDefined();

    const raw = fixture?.content ?? fixture;
    expect(raw?.values).toBeDefined();
    expect(Object.keys(raw?.values ?? {}).length).toBeGreaterThan(0);

    const productionSource = getMasterplanFixtureContent(fixture);
    expect(productionSource).not.toHaveProperty('values');
    expect(productionSource).not.toHaveProperty('labels');
  });
});
