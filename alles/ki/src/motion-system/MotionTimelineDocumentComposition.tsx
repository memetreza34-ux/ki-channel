import React, {useMemo} from 'react';
import {MOTION_CANVAS} from './layout';
import {MotionTimelineComposition} from './MotionTimeline';
import {
  createMotionTimelineDocument,
  parseMotionTimelineDocument,
  type MotionTimelineDocument,
} from './serialization';
import {MOTION_TIMELINE_EXAMPLE} from './timelineExamples';

export const MOTION_PRODUCTION_TIMELINE_COMPOSITION_ID =
  'Motion-Timeline-Production';

export type MotionTimelineDocumentCompositionProps = {
  document: MotionTimelineDocument;
};

export const MOTION_PRODUCTION_TIMELINE_DEFAULT_PROPS:
MotionTimelineDocumentCompositionProps = {
  document: createMotionTimelineDocument(MOTION_TIMELINE_EXAMPLE),
};

export const resolveMotionTimelineDocumentProps = (
  props: MotionTimelineDocumentCompositionProps,
) => parseMotionTimelineDocument(props.document);

export const calculateMotionTimelineDocumentMetadata = ({
  props,
}: {
  props: MotionTimelineDocumentCompositionProps;
}) => {
  const timeline = resolveMotionTimelineDocumentProps(props);

  return {
    durationInFrames: timeline.totalDurationInFrames,
    fps: timeline.fps,
    width: MOTION_CANVAS.width,
    height: MOTION_CANVAS.height,
    props: {
      document: createMotionTimelineDocument(timeline),
    },
  };
};

export const MotionTimelineDocumentComposition: React.FC<
  MotionTimelineDocumentCompositionProps
> = ({document}) => {
  const timeline = useMemo(
    () => parseMotionTimelineDocument(document),
    [document],
  );

  return <MotionTimelineComposition timeline={timeline} />;
};
