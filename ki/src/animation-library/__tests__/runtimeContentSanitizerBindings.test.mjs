import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const read = (path) => readFileSync(resolve(path), 'utf8');

describe('runtime content grounding bindings', () => {
  it('keeps derive -> sanitize -> associate -> props in the channel masterplan', () => {
    const source = read('ki/src/animation-library/channelReelMasterPlan.ts');
    const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
    const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
    const associationIndex = source.indexOf('associatePrototypeRuntimeContent({');
    const propsIndex = source.indexOf('createPrototypeRenderProps({');

    expect(deriveIndex).toBeGreaterThanOrEqual(0);
    expect(sanitizeIndex).toBeGreaterThan(deriveIndex);
    expect(associationIndex).toBeGreaterThan(sanitizeIndex);
    expect(propsIndex).toBeGreaterThan(associationIndex);
  });

  it('makes exact-vs-relative runtime flags visible in cost and latency prototypes', () => {
    const budget = read('ki/src/animation-library/prototypes/BudgetLeakMeterPrototype.tsx');
    const latency = read('ki/src/animation-library/prototypes/LatencyTunnelRacePrototype.tsx');

    for (const fragment of ['measurementExact', 'KOSTEN GESENKT', 'KOSTENTREIBER']) {
      expect(budget).toContain(fragment);
    }
    for (const fragment of ['measurementExact', 'latencyUnit', 'KÜRZERE LAUFZEIT']) {
      expect(latency).toContain(fragment);
    }
  });

  it('prevents ungrounded probability percentages and winner claims', () => {
    const probability = read(
      'ki/src/animation-library/prototypes/ProbabilityFluidColumnsPrototype.tsx',
    );
    for (const fragment of [
      'probabilityOutcomeGrounded',
      'candidate1ProbabilityExact',
      'KEIN UNBELEGTER GEWINNER',
      'KEINE EXAKTE WAHRSCHEINLICHKEIT GENANNT',
    ]) {
      expect(probability).toContain(fragment);
    }
  });

  it('prevents ungrounded ranking scores and winners', () => {
    const ranking = read(
      'ki/src/animation-library/prototypes/DynamicPodiumRisePrototype.tsx',
    );
    for (const fragment of [
      'rankingOutcomeGrounded',
      'candidate1ScoreExact',
      'POSITION OFFEN',
      'KEIN UNBELEGTER SIEGER',
    ]) {
      expect(ranking).toContain(fragment);
    }
  });

  it('prevents ungrounded benchmark scores and winners', () => {
    const benchmark = read(
      'ki/src/animation-library/prototypes/BenchmarkRacetrackPrototype.tsx',
    );
    for (const fragment of [
      'comparisonOutcomeGrounded',
      'competitor1ScoreExact',
      'VERGLEICH ABGESCHLOSSEN',
      'VERGLICHEN ✓',
    ]) {
      expect(benchmark).toContain(fragment);
    }
  });

  it('keeps the exact masterplan release on derive -> sanitize -> associate -> props', () => {
    const render = read('scripts/render-masterplan-content-release.mjs');
    const verify = read('scripts/verify-masterplan-content-release.mjs');

    for (const source of [render, verify]) {
      expect(source).toContain('loadPrototypeRuntimeContentDeriver');
      expect(source).toContain('loadPrototypeRuntimeContentSanitizer');
      expect(source).toContain('loadPrototypeRuntimeContentAssociation');
      expect(source).toContain('loadCreatePrototypeRenderProps');
      expect(source.indexOf('sanitizePrototypeRuntimeContent({')).toBeGreaterThan(
        source.indexOf('derivePrototypeRuntimeContent({'),
      );
      expect(source.indexOf('associatePrototypeRuntimeContent({')).toBeGreaterThan(
        source.indexOf('sanitizePrototypeRuntimeContent({'),
      );
      expect(source.indexOf('createPrototypeRenderProps({')).toBeGreaterThan(
        source.indexOf('associatePrototypeRuntimeContent({'),
      );
    }
  });

  it('fingerprints sanitizer and association plus their runtime loaders for release freshness', () => {
    const source = read('scripts/masterplan-content-release-utils.mjs');
    expect(source).toContain('prototypeRuntimeContentSanitizer.ts');
    expect(source).toContain('prototypeRuntimeContentAssociation.ts');
    expect(source).toContain('load-prototype-runtime-content-sanitizer.mjs');
    expect(source).toContain('load-prototype-runtime-content-association.mjs');
  });
});
