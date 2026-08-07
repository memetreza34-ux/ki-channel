import {describe, expect, it} from 'vitest';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import {
  assertPrototypeRenderProps,
  createPrototypeRenderProps,
} from '../prototypeRenderPayload';

describe('content-matched prototype render payload', () => {
  it('serializes the exact sentence and executable meaning contract', () => {
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';
    const meaningContract = enhanceSceneMeaning(spokenText);
    const props = createPrototypeRenderProps({
      spokenText,
      meaningContract,
      labels: {
        slowPath: 'Serieller Dienst',
        fastPath: 'Paralleler Dienst',
      },
      values: {
        slowLatency: 780,
        fastLatency: 340,
      },
    });

    assertPrototypeRenderProps(props);
    expect(props.content.spokenText).toBe(spokenText);
    expect(props.content.meaningContract).toEqual(meaningContract);
    expect(props.content.title).toContain('hoher');
    expect(props.content.labels?.slowPath).toBe('Serieller Dienst');
    expect(props.content.values?.fastLatency).toBe(340);
    expect(JSON.parse(JSON.stringify(props))).toEqual(props);
  });

  it('rejects incomplete semantic payloads', () => {
    const spokenText = 'Die Daten verändern sich sichtbar.';
    const meaningContract = {
      ...enhanceSceneMeaning(spokenText),
      visibleChange: '',
    };

    expect(() =>
      createPrototypeRenderProps({spokenText, meaningContract}),
    ).toThrow(/visibleChange/);
    expect(() =>
      createPrototypeRenderProps({
        spokenText: '   ',
        meaningContract: enhanceSceneMeaning(spokenText),
      }),
    ).toThrow(/spokenText/);
  });
});
