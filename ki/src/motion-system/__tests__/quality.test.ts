import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {inspectMotionStoryboardQuality} from '../quality';

describe('Motion-Qualitätsprüfung', () => {
  it('alle Standardbeispiele bestehen ohne Qualitätsfehler', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const report = inspectMotionStoryboardQuality(storyboard);
      expect(report.passed).toBe(true);
      expect(report.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    }
  });

  it('erkennt fehlende sichtbare Labels', () => {
    const storyboard = MOTION_EXAMPLES['input-output'];
    const report = inspectMotionStoryboardQuality({...storyboard, labels: []});
    expect(report.passed).toBe(false);
    expect(report.issues.some((issue) => issue.code === 'missing-labels')).toBe(true);
  });

  it('warnt vor sehr langen Sätzen und Labels', () => {
    const storyboard = MOTION_EXAMPLES['input-output'];
    const report = inspectMotionStoryboardQuality({
      ...storyboard,
      sentence: 'x'.repeat(141),
      elements: storyboard.elements.map((element, index) =>
        index === 0 ? {...element, label: 'Sehr lange Beschriftung für eine Karte'} : element,
      ),
    });

    expect(report.passed).toBe(true);
    expect(report.issues.some((issue) => issue.code === 'sentence-too-long')).toBe(true);
    expect(report.issues.some((issue) => issue.code === 'label-too-long')).toBe(true);
  });

  it('blockiert extrem lange Sätze außerhalb der sicheren Caption-Grenze', () => {
    const storyboard = MOTION_EXAMPLES['input-output'];
    const report = inspectMotionStoryboardQuality({
      ...storyboard,
      sentence: 'x'.repeat(221),
    });

    expect(report.passed).toBe(false);
    expect(
      report.issues.some(
        (issue) => issue.code === 'sentence-too-long' && issue.severity === 'error',
      ),
    ).toBe(true);
  });

  it('warnt vor zusammengefallenen Folgeaktionen auf demselben Frame', () => {
    const storyboard = MOTION_EXAMPLES.comparison;
    const rightShow = storyboard.beats.find(
      (beat) => beat.targetId === 'right' && beat.action === 'show',
    );
    const collapsed = {
      ...storyboard,
      beats: storyboard.beats.map((beat) =>
        beat.targetId === 'right' && beat.action === 'highlight' && rightShow
          ? {...beat, atFrame: rightShow.atFrame}
          : beat,
      ),
    };

    const report = inspectMotionStoryboardQuality(collapsed);
    expect(report.passed).toBe(true);
    expect(report.issues.some((issue) => issue.code === 'collapsed-beat-timing')).toBe(true);
  });

  it('warnt, wenn eine Stage mehr Elemente erhält als sie darstellen kann', () => {
    const storyboard = MOTION_EXAMPLES['tool-orchestration'];
    const report = inspectMotionStoryboardQuality({
      ...storyboard,
      elements: [
        ...storyboard.elements,
        {id: 'email', kind: 'tool' as const, label: 'E-Mail', emphasis: 'normal' as const},
        {id: 'calendar', kind: 'tool' as const, label: 'Kalender', emphasis: 'normal' as const},
      ],
    });

    expect(report.passed).toBe(true);
    expect(report.issues.some((issue) => issue.code === 'stage-item-limit')).toBe(true);
  });
});
