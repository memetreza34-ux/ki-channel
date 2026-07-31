import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { duckVolumeAt, toFrameWindows } from '../../lib/audio';
import { C, a } from '../tokens';

// ════════════════════════════════════════════════════════════════════════════
//  SOUND-SYSTEM — das „Rezept" für Ton: EINE Stimme oben, ein leises Musik-Bett
//  darunter das automatisch unter der Stimme duckt, plus punktuelle SFX.
//  Alle Dateien in public/<slug>/audio/. Frame-genau & seek-safe (Remotion).
//
//    <Voiceover src="etf/audio/voice.mp3" />
//    <SoundBed  src="etf/audio/bed.mp3" duckSec={[[0, 42]]} />   // duckt 0–42 s
//    <Sfx       src="etf/audio/whoosh.mp3" atSec={3.5} />
// ════════════════════════════════════════════════════════════════════════════
const asSrc = (s: string) => (/^https?:\/\//i.test(s) ? s : staticFile(s));

/** Die Sprecher-Spur — volle Lautstärke, die Referenz für alles andere. */
export const Voiceover: React.FC<{ src: string; volume?: number; playbackRate?: number }> = ({
  src, volume = 1, playbackRate = 1,
}) => (
  <Audio src={asSrc(src)} volume={volume} playbackRate={playbackRate} />
);

/** Musik-Bett, das während der Sprech-Fenster (Sekunden) automatisch leiser wird. */
export const SoundBed: React.FC<{
  src: string;
  baseVolume?: number;                 // ohne Stimme
  duckVolume?: number;                 // unter der Stimme
  duckSec?: Array<[number, number]>;   // Sprech-Fenster in Sekunden (aus Captions/Beats)
  rampSec?: number;                    // weiche Rampe rein/raus
  loop?: boolean;
}> = ({ src, baseVolume = 0.18, duckVolume = 0.06, duckSec = [], rampSec = 0.3, loop = true }) => {
  const { fps } = useVideoConfig();
  const windowsFrames = toFrameWindows(duckSec, fps);
  const rampFrames = Math.round(rampSec * fps);
  return (
    <Audio
      src={asSrc(src)}
      loop={loop}
      volume={(f) => duckVolumeAt(f, { windowsFrames, baseVolume, duckVolume, rampFrames })}
    />
  );
};

/** Ein einzelner Soundeffekt zu einem Zeitpunkt (Sekunden). */
export const Sfx: React.FC<{ src: string; atSec: number; volume?: number }> = ({ src, atSec, volume = 0.6 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(atSec * fps)} name={`Sfx ${src}`}>
      <Audio src={asSrc(src)} volume={volume} />
    </Sequence>
  );
};

// ─── AUDIO VISUALIZER — Balken reagieren auf den Audiopegel (Waveform-Look) ────
// Für Voiceover-Momente, in denen der Ton selbst sichtbar gemacht werden soll.
// Braucht dieselbe Datei wie <Voiceover>/<SoundBed> als src.
export const AudioVisualizer: React.FC<{
  src: string; barCount?: number; width?: number; height?: number; color?: string; gap?: number;
}> = ({ src, barCount = 32, width = 700, height = 140, color = 'var(--accent)', gap = 6 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(asSrc(src));
  if (!audioData) return null;
  const bars = visualizeAudio({ fps, frame: f, audioData, numberOfSamples: barCount });
  const barW = (width - gap * (barCount - 1)) / barCount;
  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', gap }}>
      {bars.map((v, i) => {
        const h = Math.max(4, v * height);
        return (
          <div key={i} style={{ width: barW, height: h, borderRadius: barW / 2, background: color,
            boxShadow: `0 0 12px ${a(color, 0.5)}`, alignSelf: 'center' }} />
        );
      })}
    </div>
  );
};
