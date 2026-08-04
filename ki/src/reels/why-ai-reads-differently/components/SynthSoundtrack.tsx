import React, {useMemo} from 'react';
import {Audio, Sequence} from 'remotion';

export type ReelSoundMode = 'off' | 'minimal';

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
  waveform?: 'sine' | 'triangle';
};

const wavCache = new Map<string, string>();

const createToneDataUri = (options: ToneOptions): string => {
  const cacheKey = JSON.stringify(options);
  const cached = wavCache.get(cacheKey);
  if (cached) return cached;

  const sampleRate = 16000;
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

  let phase = 0;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const timeProgress = sampleIndex / Math.max(1, sampleCount - 1);
    const frequency = options.frequency +
      ((options.slideTo ?? options.frequency) - options.frequency) * timeProgress;
    phase += (Math.PI * 2 * frequency) / sampleRate;

    const attack = Math.min(1, sampleIndex / Math.max(1, sampleRate * 0.018));
    const release = Math.min(1, (sampleCount - sampleIndex) / Math.max(1, sampleRate * 0.11));
    const envelope = Math.min(attack, release) * Math.pow(1 - timeProgress, 0.35);
    const raw = options.waveform === 'triangle'
      ? (2 / Math.PI) * Math.asin(Math.sin(phase))
      : Math.sin(phase);
    const sample = Math.max(-1, Math.min(1, raw * envelope * options.volume));
    view.setInt16(44 + sampleIndex * 2, Math.round(sample * 32767), true);
  }

  const uri = `data:audio/wav;base64,${bytesToBase64(bytes)}`;
  wavCache.set(cacheKey, uri);
  return uri;
};

type SoundCue = ToneOptions & {
  frame: number;
  mixVolume: number;
};

const MINIMAL_SOUND_CUES: readonly SoundCue[] = [
  {
    frame: 1,
    frequency: 74,
    slideTo: 58,
    durationMs: 260,
    volume: 0.34,
    waveform: 'sine',
    mixVolume: 0.18,
  },
  {
    frame: 112,
    frequency: 250,
    slideTo: 330,
    durationMs: 95,
    volume: 0.22,
    waveform: 'triangle',
    mixVolume: 0.12,
  },
  {
    frame: 612,
    frequency: 190,
    slideTo: 250,
    durationMs: 145,
    volume: 0.2,
    waveform: 'sine',
    mixVolume: 0.1,
  },
  {
    frame: 995,
    frequency: 138,
    slideTo: 92,
    durationMs: 240,
    volume: 0.24,
    waveform: 'sine',
    mixVolume: 0.12,
  },
] as const;

const CueAudio: React.FC<{cue: SoundCue}> = ({cue}) => {
  const source = useMemo(() => createToneDataUri(cue), [cue]);
  return <Audio src={source} volume={cue.mixVolume} />;
};

export const SynthSoundtrack: React.FC<{
  voiceoverSrc?: string;
  soundMode?: ReelSoundMode;
}> = ({voiceoverSrc, soundMode = 'off'}) => (
  <>
    {voiceoverSrc ? <Audio src={voiceoverSrc} volume={1} /> : null}
    {soundMode === 'minimal'
      ? MINIMAL_SOUND_CUES.map((cue, index) => (
          <Sequence key={`${cue.frame}-${index}`} from={cue.frame} durationInFrames={18}>
            <CueAudio cue={cue} />
          </Sequence>
        ))
      : null}
  </>
);
