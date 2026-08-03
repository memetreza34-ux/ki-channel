import {describe, expect, it} from 'vitest';
import {MOTION_CANVAS} from '../layout';
import {
  calculateMotionTimelineDocumentMetadata,
  MOTION_PRODUCTION_TIMELINE_COMPOSITION_ID,
  MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS,
  resolveMotionTimelineDocumentProps,
} from '../MotionTimelineDocumentComposition';
import {createMotionTimelineDocument} from '../serialization';
import {buildMotionTimeline} from '../timeline';
import {MOTION_TIMELINE_EXAMPLE} from '../timelineExamples';

describe('Dynamische Produktions-Timeline-Composition', () => {
  it('verwendet die Timeline-Demo als valide Vorschaukonfiguration', () => {
    const timeline = resolveMotionTimelineDocumentProps(
      MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS,
    );

    expect(MOTION_PRODUCTION_TIMELINE_COMPOSITION_ID).toBe(
      'Motion-Timeline-Production',
    );
    expect(timeline).toEqual(MOTION_TIMELINE_EXAMPLE);
  });

  it('leitet Dauer, FPS und Canvas aus dem übergebenen Dokument ab', () => {
    const timeline = buildMotionTimeline({
      fps: 60,
      gapFrames: 18,
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
      ],
    });
    const document = createMotionTimelineDocument(timeline);
    const metadata = calculateMotionTimelineDocumentMetadata({
      props: {document},
    });

    expect(metadata.durationInFrames).toBe(timeline.totalDurationInFrames);
    expect(metadata.fps).toBe(60);
    expect(metadata.width).toBe(MOTION_CANVAS.width);
    expect(metadata.height).toBe(MOTION_CANVAS.height);
    expect(metadata.props.document).toEqual(document);
  });

  it('blockiert manipulierte Dokumente bereits bei der Metadatenauflösung', () => {
    const document = structuredClone(
      MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS.document,
    );
    document.totalDurationInFrames += 1;

    expect(() =>
      calculateMotionTimelineDocumentMetadata({props: {document}}),
    ).toThrow();
  });
});
