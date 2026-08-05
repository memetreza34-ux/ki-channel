/**
 * Audio Visualizer Components
 *
 * Features:
 * - Bar visualizer (classic equalizer)
 * - Circular/radial visualizer
 * - Waveform display
 * - Customizable colors and sizes
 *
 * Requirements:
 * npm install @remotion/media-utils
 */

import { useCurrentFrame, useVideoConfig, AbsoluteFill, staticFile } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

interface VisualizerProps {
  audioSrc: string;
  color?: string;
  barCount?: number;
}

/**
 * Classic bar visualizer (equalizer style)
 */
export const BarVisualizer: React.FC<VisualizerProps> = ({
  audioSrc,
  color = '#667eea',
  barCount = 32,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);

  if (!audioData) {
    return null;
  }

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 300,
        gap: 4,
      }}
    >
      {visualization.map((amplitude, index) => {
        const height = amplitude * 280 + 20;
        const hue = (index / barCount) * 60; // Gradient effect

        return (
          <div
            key={index}
            style={{
              width: Math.max(800 / barCount - 4, 8),
              height,
              background: `linear-gradient(180deg, ${color}, hsl(${hue + 240}, 70%, 50%))`,
              borderRadius: 4,
              transition: 'height 0.05s ease',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Circular/radial audio visualizer
 */
export const CircularVisualizer: React.FC<VisualizerProps & { radius?: number }> = ({
  audioSrc,
  color = '#667eea',
  barCount = 48,
  radius = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);

  if (!audioData) {
    return null;
  }

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
  });

  const centerX = 400;
  const centerY = 300;

  return (
    <svg width={800} height={600} viewBox="0 0 800 600">
      {/* Background circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius - 10}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={2}
      />

      {/* Visualization bars */}
      {visualization.map((amplitude, index) => {
        const angle = (index / barCount) * Math.PI * 2 - Math.PI / 2;
        const barLength = amplitude * 100 + 10;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${amplitude * 10}px ${color})`,
            }}
          />
        );
      })}

      {/* Inner glow */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius - 20}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.5}
        style={{
          filter: `blur(4px)`,
        }}
      />
    </svg>
  );
};

/**
 * Waveform visualizer (oscilloscope style)
 */
export const WaveformVisualizer: React.FC<VisualizerProps & { height?: number }> = ({
  audioSrc,
  color = '#00ff88',
  barCount = 128,
  height = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const audioData = useAudioData(audioSrc);

  if (!audioData) {
    return null;
  }

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
  });

  // Create SVG path
  const points = visualization.map((amp, i) => {
    const x = (i / (barCount - 1)) * 800;
    const y = 100 + (amp - 0.5) * height * 2;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg width={800} height={height} viewBox={`0 0 800 ${height}`}>
      {/* Glow effect */}
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth={4}
        style={{
          filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})`,
        }}
      />
      {/* Main line */}
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Mirrored bar visualizer (like Spotify)
 */
export const MirroredBarVisualizer: React.FC<VisualizerProps> = ({
  audioSrc,
  color = '#1DB954',
  barCount = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);

  if (!audioData) {
    return null;
  }

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        gap: 2,
      }}
    >
      {visualization.map((amplitude, index) => {
        const height = amplitude * 140;

        return (
          <div
            key={index}
            style={{
              width: Math.max(600 / barCount - 2, 4),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Top bar */}
            <div
              style={{
                width: '100%',
                height,
                background: color,
                borderRadius: 2,
                transform: 'scaleY(-1)',
                transformOrigin: 'bottom',
              }}
            />
            {/* Bottom bar (mirrored) */}
            <div
              style={{
                width: '100%',
                height,
                background: color,
                borderRadius: 2,
                opacity: 0.5,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Complete audio visualizer composition
 */
export const AudioVisualizerComposition: React.FC<{
  audioSrc: string;
  visualizerType?: 'bars' | 'circular' | 'waveform' | 'mirrored';
  backgroundColor?: string;
  accentColor?: string;
}> = ({
  audioSrc,
  visualizerType = 'bars',
  backgroundColor = '#0a0a0a',
  accentColor = '#667eea',
}) => {
  const VisualizerComponent = {
    bars: BarVisualizer,
    circular: CircularVisualizer,
    waveform: WaveformVisualizer,
    mirrored: MirroredBarVisualizer,
  }[visualizerType];

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <VisualizerComponent audioSrc={audioSrc} color={accentColor} />
    </AbsoluteFill>
  );
};
