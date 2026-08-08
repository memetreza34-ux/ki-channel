import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {getMasterplanFixtureContent} from '../../../../scripts/masterplan-content-release-utils.mjs';

const fixtureConfig = JSON.parse(
  readFileSync(
    resolve('ki/src/animation-library/content-render-fixtures.json'),
    'utf8',
  ),
);

describe('masterplan fixture isolation', () => {
  it('keeps direct fixture labels and values out of the canonical production source content', () => {
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
      expect(productionSource.spokenText.trim().length, fixture.animationId).toBeGreaterThan(0);
      expect(productionSource.meaningContract, fixture.animationId).toEqual(
        expect.any(Object),
      );
      expect(productionSource, fixture.animationId).not.toHaveProperty('labels');
      expect(productionSource, fixture.animationId).not.toHaveProperty('values');
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
