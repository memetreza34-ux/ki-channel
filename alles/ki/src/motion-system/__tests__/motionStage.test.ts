import React from 'react';
import {describe, expect, it} from 'vitest';
import {MOTION_EXAMPLES} from '../examples';
import {MotionStage} from '../MotionStage';

describe('Exhaustiver Motion-Stage-Renderer', () => {
  it('liefert für alle zehn Visualtypen ein gültiges React-Element', () => {
    for (const storyboard of Object.values(MOTION_EXAMPLES)) {
      const stage = MotionStage({storyboard});
      expect(React.isValidElement(stage)).toBe(true);
    }
  });

  it('übergibt dem Fehlerpfad das sichtbare KI-Label und dessen Beat-Frame', () => {
    const storyboard = MOTION_EXAMPLES['error-path'];
    const stage = MotionStage({storyboard});
    expect(React.isValidElement(stage)).toBe(true);

    if (!React.isValidElement(stage)) return;
    const props = stage.props as {
      aiLabel?: string;
      timings?: {aiFrame?: number};
    };
    const expectedAiFrame = storyboard.beats.find(
      (beat) => beat.targetId === 'ai' && beat.action === 'show',
    )?.atFrame;

    expect(props.aiLabel).toBe('KI');
    expect(props.timings?.aiFrame).toBe(expectedAiFrame);
  });
});
