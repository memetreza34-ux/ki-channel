import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Sparkles} from 'lucide';
import {Background, Caption, CaptionTrack, COLORS, Headline, Pill, SafeArea} from '../../kit';
import type {Project} from '../types';
import untertitel from './untertitel.json';

/** Voiceover in studio/public/projekte/__SLUG__/ ablegen und hier eintragen, z. B. 'projekte/__SLUG__/voiceover.mp3'. */
const VOICEOVER: string | null = null;

/** Szenen in Frames (30 fps). Nach dem Voiceover an die echten Zeiten anpassen. */
const SCENES = {
  hook: {from: 0, duration: 90},
};

const Hook: React.FC = () => (
  <AbsoluteFill>
    <SafeArea gap={48}>
      <Pill icon={Sparkles} delay={-8}>
        Thema
      </Pill>
      <Headline text="Hier steht die Hook" size={118} align="center" highlight={['Hook']} marker delay={-12} />
    </SafeArea>
    {VOICEOVER ? null : <Caption text="Gesprochener Satz als Untertitel." />}
  </AbsoluteFill>
);

const Video: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <Background seed="__SLUG__" />
    <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.duration} name="1 Hook">
      <Hook />
    </Sequence>
    {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
    {VOICEOVER ? <CaptionTrack captions={untertitel} /> : null}
  </AbsoluteFill>
);

export const projekt: Project = {
  id: '__ID__',
  component: Video,
  format: 'vertical',
  durationInFrames: SCENES.hook.from + SCENES.hook.duration,
};
