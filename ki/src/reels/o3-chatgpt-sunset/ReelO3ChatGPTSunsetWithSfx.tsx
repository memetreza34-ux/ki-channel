import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {ReelO3ChatGPTSunset as VisualReel} from './ReelO3ChatGPTSunset';
import {O3_SUNSET_SFX} from './contract';

type Props = {
  voiceoverSrc: string;
  showCaptions?: boolean;
  showSfx?: boolean;
};

export const ReelO3ChatGPTSunsetWithSfx: React.FC<Props> = ({
  voiceoverSrc,
  showCaptions = true,
  showSfx = true,
}) => (
  <AbsoluteFill>
    <VisualReel voiceoverSrc={voiceoverSrc} showCaptions={showCaptions} />
    <ReelSfxTrack events={O3_SUNSET_SFX} enabled={showSfx} />
  </AbsoluteFill>
);
