import {describe, expect, it} from 'vitest';
import {
  createProcessChainLayout,
  PROCESS_CHAIN_LAYOUT,
} from '../components/ProcessChainStage';

describe('Process-Chain-Layout', () => {
  it('hält vier Karten vollständig innerhalb des 880-Pixel-Bereichs', () => {
    const layout = createProcessChainLayout(4);
    const last = layout[layout.length - 1];

    expect(layout).toHaveLength(4);
    expect(last).toBeDefined();
    expect((last?.left ?? 0) + PROCESS_CHAIN_LAYOUT.cardWidth).toBeLessThanOrEqual(
      PROCESS_CHAIN_LAYOUT.width,
    );
  });

  it('verteilt zwei Karten an den beiden Außenkanten', () => {
    const layout = createProcessChainLayout(2);

    expect(layout[0].left).toBe(0);
    expect(layout[1].left + PROCESS_CHAIN_LAYOUT.cardWidth).toBe(
      PROCESS_CHAIN_LAYOUT.width,
    );
    expect(layout[0].connectorWidth).toBeGreaterThan(0);
  });

  it('begrenzt externe Eingaben auf maximal vier Schritte', () => {
    expect(createProcessChainLayout(10)).toHaveLength(4);
    expect(createProcessChainLayout(-2)).toEqual([]);
  });

  it('erzeugt keine negativen Connector-Breiten', () => {
    for (const count of [1, 2, 3, 4]) {
      expect(
        createProcessChainLayout(count).every((item) => item.connectorWidth >= 0),
      ).toBe(true);
    }
  });
});
