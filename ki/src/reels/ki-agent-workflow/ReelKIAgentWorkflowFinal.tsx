import React from 'react';
import {AbsoluteFill} from 'remotion';
import sfxJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/06-projektdateien/sfx-resolved.json';
import {ReelSfxTrack, type ReelResolvedSfxEvent} from '../ReelSfxTrack';
import {ReelKIAgentWorkflowMaster} from './ReelKIAgentWorkflowMaster';

type Props = {
  voiceoverSrc: string;
  showCaptions?: boolean;
  showSfx?: boolean;
  generatedImageSrc?: string;
  generatedBrollSrc?: string;
};

const resolved = sfxJson as {events?: ReelResolvedSfxEvent[]};

export const ReelKIAgentWorkflow: React.FC<Props> = ({showSfx = true, ...props}) => (
  <AbsoluteFill>
    <ReelKIAgentWorkflowMaster {...props}/>
    <ReelSfxTrack events={resolved.events ?? []} enabled={showSfx}/>
  </AbsoluteFill>
);
