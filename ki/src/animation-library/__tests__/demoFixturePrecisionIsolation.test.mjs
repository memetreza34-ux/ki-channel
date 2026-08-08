import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {loadSceneMeaningEnhancer} from '../../../../scripts/load-scene-meaning-enhancer.mjs';
import {loadPrototypeRuntimeContentAssociation} from '../../../../scripts/load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from '../../../../scripts/load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from '../../../../scripts/load-prototype-runtime-content-sanitizer.mjs';
import {getMasterplanFixtureContent} from '../../../../scripts/masterplan-content-release-utils.mjs';

const fixtureConfig = JSON.parse(
  readFileSync(
    resolve('ki/src/animation-library/content-render-fixtures.json'),
    'utf8',
  ),
);

const fixtureById = new Map(
  fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]),
);

const groundFixture = async (animationId) => {
  const fixture = fixtureById.get(animationId);
  if (!fixture) throw new Error(`Fixture fehlt: ${animationId}`);

  const raw = fixture.content ?? fixture;
  const source = getMasterplanFixtureContent(fixture);
  const enhanceSceneMeaning = await loadSceneMeaningEnhancer();
  const derivePrototypeRuntimeContent =
    await loadPrototypeRuntimeContentDeriver();
  const sanitizePrototypeRuntimeContent =
    await loadPrototypeRuntimeContentSanitizer();
  const associatePrototypeRuntimeContent =
    await loadPrototypeRuntimeContentAssociation();
  const meaningContract =
    source.meaningContract ?? enhanceSceneMeaning(source.spokenText);
  const derived = derivePrototypeRuntimeContent({
    animationId,
    spokenText: source.spokenText,
    meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId,
    spokenText: source.spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId,
    spokenText: source.spokenText,
    content: sanitized,
  });

  return {raw, source, meaningContract, associated};
};

describe('demo fixture precision isolation', () => {
  it('strips direct cost fixture numbers when the spoken sentence never states them', async () => {
    const animationId = 'cost-efficiency-budget-leak-meter-v1';
    const {raw, source, associated} = await groundFixture(animationId);

    expect(raw.values?.initialCost).toBe(94);
    expect(raw.values?.optimizedCost).toBe(28);
    expect(source).not.toHaveProperty('values');
    expect(source).not.toHaveProperty('labels');
    expect(source.spokenText).not.toMatch(/94|28/);

    expect(associated.values.measurementExact ?? 0).toBe(0);
    expect(associated.values.initialCost).toBeUndefined();
    expect(associated.values.optimizedCost).toBeUndefined();
    expect(associated.values.leak1Amount).toBeUndefined();
    expect(associated.values.leak2Amount).toBeUndefined();
    expect(associated.values.leak3Amount).toBeUndefined();
  });

  it('keeps latency exact only because both measurements are actually spoken', async () => {
    const animationId = 'scale-performance-latency-tunnel-race-v1';
    const {raw, source, associated} = await groundFixture(animationId);

    expect(raw.values?.slowLatency).toBe(780);
    expect(raw.values?.fastLatency).toBe(340);
    expect(source).not.toHaveProperty('values');
    expect(source.spokenText).toMatch(/780\s*Millisekunden/i);
    expect(source.spokenText).toMatch(/340\s*Millisekunden/i);

    expect(associated.values.measurementExact).toBe(1);
    expect(associated.values.slowLatency).toBe(780);
    expect(associated.values.fastLatency).toBe(340);
    expect(associated.labels.latencyUnit).toBe('ms');
  });

  it('does not inherit demo ranking scores when the speaker only names the winner', async () => {
    const animationId = 'ranking-dynamic-podium-rise-v1';
    const {raw, source, associated} = await groundFixture(animationId);

    expect(raw.values?.candidate1Score).toBeDefined();
    expect(source).not.toHaveProperty('values');
    expect(source.spokenText).not.toMatch(/96|88|74/);

    expect(associated.values.candidate1ScoreExact ?? 0).toBe(0);
    expect(associated.values.candidate2ScoreExact ?? 0).toBe(0);
    expect(associated.values.candidate3ScoreExact ?? 0).toBe(0);
  });

  it('does not inherit demo benchmark scores when no score is spoken', async () => {
    const animationId = 'comparison-benchmark-racetrack-v1';
    const {raw, source, associated} = await groundFixture(animationId);

    expect(raw.values?.competitor1Final).toBe(42);
    expect(raw.values?.competitor2Final).toBe(57);
    expect(source).not.toHaveProperty('values');
    expect(source.spokenText).not.toMatch(/42|57/);

    expect(associated.values.competitor1ScoreExact ?? 0).toBe(0);
    expect(associated.values.competitor2ScoreExact ?? 0).toBe(0);
  });
});
