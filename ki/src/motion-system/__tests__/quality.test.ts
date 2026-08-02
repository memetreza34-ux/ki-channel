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
});
