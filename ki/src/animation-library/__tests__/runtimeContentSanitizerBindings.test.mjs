import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const read = (path) => readFileSync(resolve(path), 'utf8');

describe('runtime content sanitizer bindings', () => {
  it('keeps sanitize between derivation and render props in the channel masterplan', () => {
    const source = read('ki/src/animation-library/channelReelMasterPlan.ts');
    const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
    const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
    const propsIndex = source.indexOf('createPrototypeRenderProps({');

    expect(deriveIndex).toBeGreaterThanOrEqual(0);
    expect(sanitizeIndex).toBeGreaterThan(deriveIndex);
    expect(propsIndex).toBeGreaterThan(sanitizeIndex);
  });

  it('makes exact-vs-relative runtime flags visible in both numeric prototypes', () => {
    const budget = read('ki/src/animation-library/prototypes/BudgetLeakMeterPrototype.tsx');
    const latency = read('ki/src/animation-library/prototypes/LatencyTunnelRacePrototype.tsx');

    for (const fragment of ['measurementExact', 'KOSTEN GESENKT', 'KOSTENTREIBER']) {
      expect(budget).toContain(fragment);
    }
    for (const fragment of ['measurementExact', 'latencyUnit', 'KÜRZERE LAUFZEIT']) {
      expect(latency).toContain(fragment);
    }
  });

  it('keeps the exact masterplan release on derive -> sanitize -> props', () => {
    const render = read('scripts/render-masterplan-content-release.mjs');
    const verify = read('scripts/verify-masterplan-content-release.mjs');

    for (const source of [render, verify]) {
      expect(source).toContain('loadPrototypeRuntimeContentDeriver');
      expect(source).toContain('loadPrototypeRuntimeContentSanitizer');
      expect(source).toContain('loadCreatePrototypeRenderProps');
      expect(source.indexOf('sanitizePrototypeRuntimeContent({')).toBeGreaterThan(
        source.indexOf('derivePrototypeRuntimeContent({'),
      );
    }
  });

  it('fingerprints the sanitizer and its runtime loader for release freshness', () => {
    const source = read('scripts/masterplan-content-release-utils.mjs');
    expect(source).toContain('prototypeRuntimeContentSanitizer.ts');
    expect(source).toContain('load-prototype-runtime-content-sanitizer.mjs');
  });
});
