import {describe, expect, it} from 'vitest';
import {
  CHANNEL_CONTENT_MODES,
  planChannelContentMode,
} from '../channelContentModes';

describe('KI channel content modes', () => {
  it('covers twenty common KI channel formats', () => {
    expect(CHANNEL_CONTENT_MODES).toHaveLength(20);
    expect(new Set(CHANNEL_CONTENT_MODES.map((mode) => mode.modeId)).size).toBe(20);
    expect(CHANNEL_CONTENT_MODES.every((mode) => mode.requiredMotionLayers.length >= 4)).toBe(true);
  });

  it('recognizes tool tutorials and requires UI animation', () => {
    const plan = planChannelContentMode(
      'So benutzt du Claude: Klicke auf das Menü und öffne die Einstellung.',
    );
    expect(plan.primaryMode.modeId).toBe('tool-ui-tutorial');
    expect(plan.visualSources).toContain('ui-reconstruction');
  });

  it('recognizes benchmark data and requires charts plus sources', () => {
    const plan = planChannelContentMode(
      'Laut Benchmark erreicht das Modell im Test 73 Prozent und ist schneller.',
    );
    expect(plan.primaryMode.modeId).toBe('benchmark-data');
    expect(plan.visualSources).toContain('data-chart');
    expect(plan.visualSources).toContain('source-document');
  });

  it('forbids static zoom-only image treatment', () => {
    const plan = planChannelContentMode('So kannst du mit KI ein Bild erstellen.');
    expect(plan.primaryMode.modeId).toBe('image-generation');
    expect(plan.productionRules.some((rule) => rule.includes('generic zoom'))).toBe(true);
  });
});
