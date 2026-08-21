import React from 'react';
import type {TodaySceneId} from './sync';
import {
  Scene01DisconnectedToday,
  Scene02FrozenTraining,
  Scene03WorldMovesOn,
  Scene04OldPatternFillsGap,
} from './scenes-a';
import {
  Scene05WebRetrieval,
  Scene06SourceProof,
  Scene07CrossCheck,
  Scene08FinalRule,
} from './scenes-b';

export const TODAY_SCENE_COMPONENTS = {
  'scene-01': Scene01DisconnectedToday,
  'scene-02': Scene02FrozenTraining,
  'scene-03': Scene03WorldMovesOn,
  'scene-04': Scene04OldPatternFillsGap,
  'scene-05': Scene05WebRetrieval,
  'scene-06': Scene06SourceProof,
  'scene-07': Scene07CrossCheck,
  'scene-08': Scene08FinalRule,
} satisfies Record<TodaySceneId, React.FC>;
