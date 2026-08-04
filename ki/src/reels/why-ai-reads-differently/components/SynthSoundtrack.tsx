import React, {useMemo} from 'react';
import {Audio, Sequence} from 'remotion';

const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const bytesToBase64 = (bytes: Uint8Array): string => {
  let result = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1] ?? 0;
    const third = bytes[index + 2] ?? 0;
    const combined = (first << 16) | (second << 8) | third;
    result += BASE64[(combined >> 18) & 63];
    result += BASE64[(combined >> 12) & 63];
    result += index + 1 < bytes.length ? BASE64[(combined >> 6) & 63] : '=';
    result += index + 2 < bytes.length ? BASE64[combined & 63] : '=';
  }
  return result;
};

type ToneOptions = {
  frequency: number;
  durationMs: number;
  volume: number;
  slideTo?: number;
  waveform?: 'sine' | 'triangle' | 'noise';
  seed?: number;
};

const wavCache = new Map<string, string>();

const createToneDataUri = (options: ToneOptions): string => {
  const cacheKey = JSON.stringify(options);
  const cached = wavCache.get(cacheKey);
  if (cached) return cached;

  const sampleRate = 12000;
  const sampleCount = Math.max(1, Math.floor((options.durationMs / 1000) * sampleRate));
  const bytes = new Uint8Array(44 + sampleCount * 2);
  const view = new DataView(bytes.buffer);
  const writeText = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, sampleCount * 2, true);

  let randomState = options.seed ?? 17;
  let phase = 0;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const timeProgress = sampleIndex / Math.max(1, sampleCount - 1);
    const frequency = options.frequency +
      ((options.slideTo ?? options.frequency) - options.frequency) * timeProgress;
    phase += (Math.PI * 2 * frequency) / sampleRate;

    const attack = Math.min(1, sampleIndex / Math.max(1, sampleRate * 0.012));
    const release = Math.min(1, (sampleCount - sampleIndex) / Math.max(1, sampleRate * 0.07));
    const envelope = Math.min(attack, release) * (1 - timeProgress * 0.18);

    let raw = Math.sin(phase);
    if (options.waveform === 'triangle') {
      raw = (2 / Math.PI) * Math.asin(Math.sin(phase));
    } else if (options.waveform === 'noise') {
      randomState = (randomState * 1664525 + 1013904223) >>> 0;
      raw = (randomState / 4294967295) * 2 - 1;
    }

    const sample = Math.max(-1, Math.min(1, raw * envelope * options.volume));
    view.setInt16(44 + sampleIndex * 2, Math.round(sample * 32767), true);
  }

  const uri = `data:audio/wav;base64,${bytesToBase64(bytes)}`;
  wavCache.set(cacheKey, uri);
  return uri;
};

type SoundCue = ToneOptions & {
  frame: number;
  mixVolume?: number;
};

const SOUND_CUES: readonly SoundCue[] = [
  {frame: 1, frequency: 92, slideTo: 58, durationMs: 260, volume: 0.55, waveform: 'sine'},
  {frame: 37, frequency: 860, slideTo: 260, durationMs: 210, volume: 0.32, waveform: 'noise', seed: 41},
  {frame: 72, frequency: 420, slideTo: 780, durationMs: 180, volume: 0.27, waveform: 'triangle'},
  {frame: 122, frequency: 280, slideTo: 920, durationMs: 320, volume: 0.22, waveform: 'sine'},
  {frame: 166, frequency: 1240, slideTo: 680, durationMs: 140, volume: 0.19, waveform: 'triangle'},
  {frame: 231, frequency: 180, slideTo: 520, durationMs: 260, volume: 0.23, waveform: 'noise', seed: 12},
  {frame: 260, frequency: 240, slideTo: 540, durationMs: 300, volume: 0.2, waveform: 'sine'},
  {frame: 318, frequency: 520, slideTo: 360, durationMs: 240, volume: 0.18, waveform: 'triangle'},
  {frame: 382, frequency: 760, slideTo: 440, durationMs: 220, volume: 0.2, waveform: 'sine'},
  {frame: 445, frequency: 290, slideTo: 1050, durationMs: 260, volume: 0.2, waveform: 'triangle'},
  {frame: 505, frequency: 220, slideTo: 310, durationMs: 180, volume: 0.18, waveform: 'triangle'},
  {frame: 563, frequency: 640, slideTo: 720, durationMs: 90, volume: 0.14, waveform: 'sine'},
  {frame: 612, frequency: 820, slideTo: 1160, durationMs: 170, volume: 0.19, waveform: 'triangle'},
  {frame: 664, frequency: 120, slideTo: 260, durationMs: 410, volume: 0.24, waveform: 'sine'},
  {frame: 720, frequency: 330, slideTo: 520, durationMs: 180, volume: 0.17, waveform: 'triangle'},
  {frame: 788, frequency: 420, slideTo: 920, durationMs: 260, volume: 0.19, waveform: 'sine'},
  {frame: 835, frequency: 860, slideTo: 1120, durationMs: 110, volume: 0.16, waveform: 'triangle'},
  {frame: 888, frequency: 980, slideTo: 760, durationMs: 160, volume: 0.16, waveform: 'triangle'},
  {frame: 942, frequency: 150, slideTo: 70, durationMs: 330, volume: 0.28, waveform: 'sine'},
  {frame: 1000, frequency: 520, slideTo: 160, durationMs: 240, volume: 0.26, waveform: 'noise', seed: 91},
  {frame: 1035, frequency: 220, slideTo: 440, durationMs: 360, volume: 0.2, waveform: 'sine'},
] as const;

const CueAudio: React.FC<{cue: SoundCue}> = ({cue}) => {
  const source = useMemo(() => createToneDataUri(cue), [cue]);
  return <Audio src={source} volume={cue.mixVolume ?? 0.72} />;
};

export const SynthSoundtrack: React.FC<{voiceoverSrc?: string}> = ({voiceoverSrc}) => (
  <>
    {voiceoverSrc ? <Audio src={voiceoverSrc} volume={1} /> : null}
    {SOUND_CUES.map((cue, index) => (
      <Sequence key={`${cue.frame}-${index}`} from={cue.frame} durationInFrames={30}>
        <CueAudio cue={cue} />
      </Sequence>
    ))}
  </>
);
