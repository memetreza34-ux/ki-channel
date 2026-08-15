/**
 * assertReelContract.ts — Shared structural validators for reel contract tests.
 *
 * These helpers check INVARIANTS that should hold regardless of exact timing values.
 * Use them instead of hardcoding frame numbers like `toBe(1740)`.
 */
import {expect} from 'vitest';

export interface SceneLike {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  [key: string]: unknown;
}

export interface SubtitleCueLike {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  [key: string]: unknown;
}

/**
 * Assert that scenes form a contiguous, gap-free timeline covering the full duration.
 */
export function assertScenesContiguous(scenes: readonly SceneLike[], durationInFrames: number) {
  expect(scenes.length).toBeGreaterThanOrEqual(1);

  // First scene starts at 0
  expect(scenes[0].startFrame).toBe(0);

  // Each scene starts where the previous one ends
  for (let i = 1; i < scenes.length; i++) {
    expect(scenes[i].startFrame).toBe(scenes[i - 1].endFrame);
  }

  // Last scene ends at duration
  expect(scenes[scenes.length - 1].endFrame).toBe(durationInFrames);

  // All scene IDs are unique
  const ids = scenes.map((s) => s.sceneId);
  expect(new Set(ids).size).toBe(ids.length);
}

/**
 * Assert that every subtitle cue falls within its scene boundaries
 * and that cues within each scene are contiguous.
 */
export function assertSubtitlesWithinScenes(
  subtitles: readonly SubtitleCueLike[],
  scenes: readonly SceneLike[],
) {
  const sceneMap = new Map(scenes.map((s) => [s.sceneId, s]));

  for (const cue of subtitles) {
    const scene = sceneMap.get(cue.sceneId);
    expect(scene).toBeDefined();
    expect(cue.startFrame).toBeGreaterThanOrEqual(scene!.startFrame);
    expect(cue.endFrame).toBeLessThanOrEqual(scene!.endFrame);
    expect(cue.endFrame).toBeGreaterThan(cue.startFrame);
  }

  // Within each scene, cues should be contiguous
  for (const scene of scenes) {
    const sceneCues = subtitles
      .filter((c) => c.sceneId === scene.sceneId)
      .sort((a, b) => a.startFrame - b.startFrame);

    if (sceneCues.length === 0) continue;

    // First cue starts at scene start
    expect(sceneCues[0].startFrame).toBe(scene.startFrame);

    // Last cue ends at scene end
    expect(sceneCues[sceneCues.length - 1].endFrame).toBe(scene.endFrame);

    // No gaps between consecutive cues
    for (let i = 1; i < sceneCues.length; i++) {
      expect(sceneCues[i].startFrame).toBe(sceneCues[i - 1].endFrame);
    }
  }
}

/**
 * Assert vertical production format (1080×1920 @ 30fps).
 */
export function assertVerticalFormat(width: number, height: number, fps: number) {
  expect(width).toBe(1080);
  expect(height).toBe(1920);
  expect(fps).toBe(30);
}
