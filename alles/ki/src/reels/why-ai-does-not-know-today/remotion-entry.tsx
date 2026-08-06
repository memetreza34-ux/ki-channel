import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CoverWhyAIDoesNotKnowToday} from './CoverWhyAIDoesNotKnowToday';
import {ReelWhyAIDoesNotKnowToday} from './ReelWhyAIDoesNotKnowToday';
import {
  TODAY_COMPOSITION_ID,
  TODAY_COVER_ID,
  TODAY_DURATION,
  TODAY_FPS,
  TODAY_HEIGHT,
  TODAY_WIDTH,
} from './sync';

const TodayRoot: React.FC = () => (
  <>
    <Composition
      id={TODAY_COMPOSITION_ID}
      component={ReelWhyAIDoesNotKnowToday}
      defaultProps={{muteVoiceover: false}}
      durationInFrames={TODAY_DURATION}
      fps={TODAY_FPS}
      width={TODAY_WIDTH}
      height={TODAY_HEIGHT}
    />
    <Composition
      id={TODAY_COVER_ID}
      component={CoverWhyAIDoesNotKnowToday}
      durationInFrames={1}
      fps={TODAY_FPS}
      width={TODAY_WIDTH}
      height={TODAY_HEIGHT}
    />
  </>
);

registerRoot(TodayRoot);
