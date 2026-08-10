import React from 'react';
import {Audio} from 'remotion';
export const SoundBed: React.FC<{intensity?: 'low' | 'high'}> = () => null;
export const Voiceover: React.FC<{src: string}> = ({src}) => <Audio src={src} />;
export const Sfx: React.FC = () => null;
export const AudioVisualizer: React.FC = () => null;
