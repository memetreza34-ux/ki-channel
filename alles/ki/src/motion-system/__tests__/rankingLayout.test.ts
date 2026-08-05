import {describe, expect, it} from 'vitest';
import {
  getRankingBarWidth,
  MAX_RANKING_ITEMS,
  prepareRankingItems,
} from '../components/RankingStage';

describe('Ranking-Layout', () => {
  it('sortiert absteigend und begrenzt die sichtbaren Reihen', () => {
    const items = Array.from({length: 12}, (_, index) => ({
      label: `Modell ${index + 1}`,
      value: index + 1,
    }));
    const prepared = prepareRankingItems(items);

    expect(prepared).toHaveLength(MAX_RANKING_ITEMS);
    expect(prepared[0].value).toBe(12);
    expect(prepared[prepared.length - 1].value).toBe(5);
  });

  it('verändert die ursprüngliche Reihenfolge nicht', () => {
    const items = [
      {label: 'A', value: 1},
      {label: 'B', value: 3},
    ];
    const snapshot = [...items];

    prepareRankingItems(items);
    expect(items).toEqual(snapshot);
  });

  it('begrenzt Balkenbreiten auf 0 bis 100 Prozent', () => {
    expect(getRankingBarWidth(50, 100)).toBe('50%');
    expect(getRankingBarWidth(150, 100)).toBe('100%');
    expect(getRankingBarWidth(-20, 100)).toBe('0%');
  });

  it('behandelt ein Maximum von null sicher', () => {
    expect(getRankingBarWidth(1, 0)).toBe('100%');
  });
});
