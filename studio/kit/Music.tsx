import React from 'react';
import {Audio, staticFile, useVideoConfig} from 'remotion';
import type {Caption as WordCaption} from '@remotion/captions';

export type MusicOptions = {
  /** Grundlautstärke der Musik (0–1). */
  volume?: number;
  /** Anteil der Grundlautstärke, solange gesprochen wird. */
  duckTo?: number;
  /** Wort-Timings des Voiceovers; ohne sie wird nicht abgesenkt. */
  captions?: WordCaption[];
  /** ms, über die das Absenken ein-/ausblendet. */
  duckRampMs?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  /** Gesamtlänge in Frames (für das Ausblenden am Ende). */
  durationInFrames: number;
  fps: number;
};

/** Lautstärke der Musik in einem Frame: Ein-/Ausblenden und Absenken unter der Stimme. */
export const musicVolumeAt = (frame: number, o: MusicOptions) => {
  const {volume = 0.5, duckTo = 0.3, captions = [], duckRampMs = 300, fadeInFrames = 15, fadeOutFrames = 30, durationInFrames, fps} = o;
  const fadeIn = fadeInFrames > 0 ? Math.min(1, frame / fadeInFrames) : 1;
  const fadeOut = fadeOutFrames > 0 ? Math.min(1, Math.max(0, (durationInFrames - frame) / fadeOutFrames)) : 1;
  const t = (frame / fps) * 1000;
  let distance = Infinity;
  for (const c of captions) {
    if (t >= c.startMs && t <= c.endMs) {
      distance = 0;
      break;
    }
    distance = Math.min(distance, Math.abs(t - c.startMs), Math.abs(t - c.endMs));
  }
  const speech = Math.max(0, 1 - distance / duckRampMs);
  const duck = 1 - (1 - duckTo) * speech;
  return volume * fadeIn * fadeOut * duck;
};

type MusicProps = Omit<MusicOptions, 'durationInFrames' | 'fps'> & {
  /** Pfad in `studio/public`, z. B. 'musik/ruhig.mp3'. */
  src: string;
  loop?: boolean;
  /** Frames, die am Anfang des Musikstücks übersprungen werden. */
  skipFrames?: number;
};

/** Hintergrundmusik, die unter der Stimme automatisch leiser wird. */
export const Music: React.FC<MusicProps> = ({src, loop = true, skipFrames = 0, ...options}) => {
  const {durationInFrames, fps} = useVideoConfig();
  return (
    <Audio
      src={staticFile(src)}
      loop={loop}
      trimBefore={skipFrames || undefined}
      volume={(f) => musicVolumeAt(f, {...options, durationInFrames, fps})}
    />
  );
};
