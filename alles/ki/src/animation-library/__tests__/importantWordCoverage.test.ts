import {describe, expect, it} from 'vitest';
import {completeImportantWordCoverage} from '../importantWordCoverage';

describe('important word coverage', () => {
  it('animates every detected important word while limiting strong motion', () => {
    const plan = completeImportantWordCoverage({
      sceneId: 'scene-01',
      spokenText: 'ChatGPT prüft 73 Prozent der Quellen, weil eine überzeugende Antwort nicht automatisch richtig ist.',
      durationInFrames: 180,
    });

    expect(plan.criticalBeatCount).toBeGreaterThanOrEqual(6);
    expect(plan.coveredCriticalBeatCount).toBe(plan.criticalBeatCount);
    expect(plan.importantBeatCoverage).toBe(1);
    expect(plan.strongMotionCount).toBeLessThanOrEqual(3);
    expect(plan.beats.some((beat) => beat.role === 'tool')).toBe(true);
    expect(plan.beats.some((beat) => beat.role === 'quantity')).toBe(true);
    expect(plan.beats.some((beat) => beat.role === 'source')).toBe(true);
    expect(plan.beats.some((beat) => beat.role === 'negation')).toBe(true);
  });

  it('keeps all beat times inside the stable scene window', () => {
    const plan = completeImportantWordCoverage({
      sceneId: 'scene-02',
      spokenText: 'Zuerst zerlegt das Modell den Text, danach wird daraus Schritt für Schritt die Antwort.',
      durationInFrames: 150,
    });

    expect(plan.beats.every((beat) => beat.atFrame >= plan.startHoldFrames)).toBe(true);
    expect(plan.beats.every((beat) => beat.atFrame < 150 - plan.endHoldFrames)).toBe(true);
  });
});
