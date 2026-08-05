import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {inspectMotionStoryboardQuality} from '../quality';
import {
  findMissingStageTimings,
  getStageTimingRequirements,
} from '../stageTimingRequirements';

describe('Stage-Timing-Anforderungen', () => {
  it('alle zehn Standardbeispiele besitzen vollständige Beat-Timings', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      expect(getStageTimingRequirements(storyboard).length).toBeGreaterThan(0);
      expect(findMissingStageTimings(storyboard)).toEqual([]);
    }
  });

  it('erkennt einen entfernten Pflicht-Beat', () => {
    const storyboard = MOTION_EXAMPLES['input-output'];
    const incomplete = {
      ...storyboard,
      beats: storyboard.beats.filter(
        (beat) => !(beat.targetId === 'output' && beat.action === 'show'),
      ),
    };

    const missing = findMissingStageTimings(incomplete);
    expect(missing.map((entry) => entry.key)).toContain('output-show');
  });

  it('meldet fehlende Timings als Qualitätswarnung statt als Renderblocker', () => {
    const storyboard = MOTION_EXAMPLES.comparison;
    const incomplete = {
      ...storyboard,
      beats: storyboard.beats.filter(
        (beat) => !(beat.targetId === 'right' && beat.action === 'highlight'),
      ),
    };

    const report = inspectMotionStoryboardQuality(incomplete);
    expect(report.passed).toBe(true);
    expect(
      report.issues.some(
        (issue) =>
          issue.code === 'missing-stage-timing' &&
          issue.message.includes('right-highlight'),
      ),
    ).toBe(true);
  });

  it('prüft dynamisch jedes Werkzeug der Tool-Orchestrierung', () => {
    const storyboard = MOTION_EXAMPLES['tool-orchestration'];
    const requirements = getStageTimingRequirements(storyboard).map((entry) => entry.key);

    expect(requirements).toContain('browser-show');
    expect(requirements).toContain('browser-connect');
    expect(requirements).toContain('files-show');
    expect(requirements).toContain('files-connect');
  });

  it('verlangt den sichtbaren KI-Core im Fehlerpfad', () => {
    const storyboard = MOTION_EXAMPLES['error-path'];
    const requirements = getStageTimingRequirements(storyboard).map((entry) => entry.key);
    expect(requirements).toContain('ai-show');

    const incomplete = {
      ...storyboard,
      beats: storyboard.beats.filter(
        (beat) => !(beat.targetId === 'ai' && beat.action === 'show'),
      ),
    };
    expect(findMissingStageTimings(incomplete).map((entry) => entry.key)).toContain('ai-show');
  });
});
