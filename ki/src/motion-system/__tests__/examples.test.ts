import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLE_LIST, MOTION_EXAMPLES} from '../examples';
import {motionStoryboardSchema, motionVisualTypeSchema} from '../schema';

describe('MOTION_EXAMPLES', () => {
  it('enthält genau ein Beispiel pro Visualtyp', () => {
    expect(Object.keys(MOTION_EXAMPLES).sort()).toEqual([...motionVisualTypeSchema.options].sort());
  });

  it('alle Beispiele sind valide und typkonsistent', () => {
    for (const [type, storyboard] of Object.entries(MOTION_EXAMPLES)) {
      expect(storyboard.visualType).toBe(type);
      expect(() => motionStoryboardSchema.parse(storyboard)).not.toThrow();
    }
  });

  it('die Listenansicht enthält zehn Storyboards', () => {
    expect(MOTION_EXAMPLE_LIST).toHaveLength(10);
  });
});
