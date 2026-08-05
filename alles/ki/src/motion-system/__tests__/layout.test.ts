import {describe, expect, it} from 'vitest';
import {
  MOTION_CANVAS,
  MOTION_CONTENT_BOUNDS,
  MOTION_SAFE_ZONES,
} from '../layout';
import {PROCESS_CHAIN_LAYOUT} from '../components/ProcessChainStage';

describe('Motion-Canvas-Layout', () => {
  it('verwendet das vertikale 9:16-Format', () => {
    expect(MOTION_CANVAS).toEqual({width: 1080, height: 1920});
    expect(MOTION_CANVAS.width / MOTION_CANVAS.height).toBeCloseTo(9 / 16);
  });

  it('hält die Caption-Safe-Zone innerhalb der Komposition', () => {
    const captionTop =
      MOTION_CANVAS.height -
      MOTION_SAFE_ZONES.captionBottom -
      MOTION_SAFE_ZONES.captionMinHeight;

    expect(captionTop).toBe(MOTION_CONTENT_BOUNDS.bottom);
    expect(captionTop).toBeGreaterThan(MOTION_CONTENT_BOUNDS.top);
    expect(MOTION_SAFE_ZONES.captionBottom).toBeGreaterThan(0);
  });

  it('hält horizontale Inhaltsgrenzen symmetrisch', () => {
    expect(MOTION_CONTENT_BOUNDS.left).toBe(MOTION_SAFE_ZONES.horizontalPadding);
    expect(MOTION_CANVAS.width - MOTION_CONTENT_BOUNDS.right).toBe(
      MOTION_SAFE_ZONES.horizontalPadding,
    );
  });

  it('hält die Prozesskette mit ihrer aktuellen Position im Canvas', () => {
    const processChainX = 100;
    expect(processChainX + PROCESS_CHAIN_LAYOUT.width).toBeLessThanOrEqual(
      MOTION_CANVAS.width,
    );
  });
});
