import React from 'react';
import {Composition, Folder} from 'remotion';
import {
  ReelWhyAIReadsDifferently,
  WHY_AI_COMPOSITION_ID,
  WHY_AI_DURATION_IN_FRAMES,
  WHY_AI_FPS,
  WHY_AI_HEIGHT,
  WHY_AI_WIDTH,
} from '../reels/why-ai-reads-differently';
import {
  MOTION_TIMELINE_COMPOSITION_ID,
  toMotionCompositionId,
} from './compositionIds';
import {MOTION_EXAMPLES} from './examples';
import {MOTION_CANVAS} from './layout';
import {MOTION_RENDER_CONFIG} from './renderConfig';
import {MotionScene} from './MotionScene';
import {MotionTimelineComposition} from './MotionTimeline';
import {
  calculateMotionTimelineDocumentMetadata,
  MOTION_PRODUCTION_TIMELINE_COMPOSITION_ID,
  MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS,
  MotionTimelineDocumentComposition,
} from './MotionTimelineDocumentComposition';
import {MOTION_TIMELINE_EXAMPLE} from './timelineExamples';

export {toMotionCompositionId} from './compositionIds';

export const MOTION_PREVIEW_TYPES = [...MOTION_RENDER_CONFIG.visualTypes];

export const MotionPreviewRoot: React.FC = () => (
  <>
    <Folder name="Motion-System-Preview">
      {MOTION_PREVIEW_TYPES.map((type) => {
        const storyboard = MOTION_EXAMPLES[type];
        return (
          <Composition
            key={type}
            id={toMotionCompositionId(type)}
            component={MotionScene}
            defaultProps={{storyboard}}
            durationInFrames={storyboard.durationInFrames}
            fps={storyboard.fps}
            width={MOTION_CANVAS.width}
            height={MOTION_CANVAS.height}
          />
        );
      })}

      <Composition
        id={MOTION_TIMELINE_COMPOSITION_ID}
        component={MotionTimelineComposition}
        defaultProps={{timeline: MOTION_TIMELINE_EXAMPLE}}
        durationInFrames={MOTION_TIMELINE_EXAMPLE.totalDurationInFrames}
        fps={MOTION_TIMELINE_EXAMPLE.fps}
        width={MOTION_CANVAS.width}
        height={MOTION_CANVAS.height}
      />

      <Composition
        id={MOTION_PRODUCTION_TIMELINE_COMPOSITION_ID}
        component={MotionTimelineDocumentComposition}
        defaultProps={MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS}
        calculateMetadata={calculateMotionTimelineDocumentMetadata}
        durationInFrames={MOTION_TIMELINE_EXAMPLE.totalDurationInFrames}
        fps={MOTION_TIMELINE_EXAMPLE.fps}
        width={MOTION_CANVAS.width}
        height={MOTION_CANVAS.height}
      />
    </Folder>

    <Folder name="Reels-Phase-2">
      <Composition
        id={WHY_AI_COMPOSITION_ID}
        component={ReelWhyAIReadsDifferently}
        defaultProps={{showDebugTimeline: false}}
        durationInFrames={WHY_AI_DURATION_IN_FRAMES}
        fps={WHY_AI_FPS}
        width={WHY_AI_WIDTH}
        height={WHY_AI_HEIGHT}
      />
    </Folder>
  </>
);
