/**
 * Text Animation Components
 *
 * Features:
 * - Word-by-word reveal
 * - Character-by-character typewriter
 * - Glitch effect
 * - Blur reveal
 * - Scale bounce
 *
 * Usage:
 * <TextReveal text="Hello World" />
 * <TypewriterText text="Typing effect..." />
 * <GlitchText text="GLITCH" />
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface TextAnimationProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  delay?: number;
}

/**
 * Word-by-word fade and slide up reveal
 */
export const TextReveal: React.FC<TextAnimationProps & { staggerDelay?: number }> = ({
  text,
  fontSize = 64,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  delay = 0,
  staggerDelay = 5,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * staggerDelay;
        const progress = interpolate(frame - wordDelay, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const y = interpolate(progress, [0, 1], [30, 0]);
        const opacity = progress;

        return (
          <span
            key={index}
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              color,
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Character-by-character typewriter effect
 */
export const TypewriterText: React.FC<TextAnimationProps & { speed?: number; showCursor?: boolean }> = ({
  text,
  fontSize = 48,
  color = '#ffffff',
  fontFamily = 'monospace',
  delay = 0,
  speed = 3, // frames per character
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);
  const charsToShow = Math.floor(adjustedFrame / speed);
  const displayText = text.slice(0, charsToShow);

  // Cursor blink
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <span
      style={{
        fontSize,
        fontFamily,
        color,
        fontWeight: 500,
      }}
    >
      {displayText}
      {showCursor && charsToShow < text.length && (
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      )}
    </span>
  );
};

/**
 * Glitch text effect with RGB split
 */
export const GlitchText: React.FC<TextAnimationProps & { intensity?: number }> = ({
  text,
  fontSize = 72,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  // Random glitch offsets (seeded by frame for consistency)
  const glitchActive = frame % 4 === 0 || frame % 7 === 0;
  const offsetX = glitchActive ? (Math.sin(frame * 0.5) * 8 * intensity) : 0;
  const offsetY = glitchActive ? (Math.cos(frame * 0.7) * 4 * intensity) : 0;

  // Occasional big glitch
  const bigGlitch = frame % 30 < 2;
  const bigOffsetX = bigGlitch ? 15 * intensity : 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* Cyan layer */}
      <span
        style={{
          position: 'absolute',
          left: offsetX + bigOffsetX,
          top: offsetY,
          fontSize,
          fontWeight: 900,
          fontFamily,
          color: 'cyan',
          mixBlendMode: 'screen',
          clipPath: glitchActive ? 'inset(0 0 50% 0)' : 'none',
        }}
      >
        {text}
      </span>

      {/* Magenta layer */}
      <span
        style={{
          position: 'absolute',
          left: -offsetX - bigOffsetX,
          top: -offsetY,
          fontSize,
          fontWeight: 900,
          fontFamily,
          color: 'magenta',
          mixBlendMode: 'screen',
          clipPath: glitchActive ? 'inset(50% 0 0 0)' : 'none',
        }}
      >
        {text}
      </span>

      {/* Main text */}
      <span
        style={{
          position: 'relative',
          fontSize,
          fontWeight: 900,
          fontFamily,
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/**
 * Blur reveal effect
 */
export const BlurReveal: React.FC<TextAnimationProps & { blurAmount?: number }> = ({
  text,
  fontSize = 64,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  delay = 0,
  blurAmount = 20,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * 8;
        const progress = interpolate(frame - wordDelay, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const blur = interpolate(progress, [0, 1], [blurAmount, 0]);
        const opacity = progress;

        return (
          <span
            key={index}
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              color,
              opacity,
              filter: `blur(${blur}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Scale bounce entrance
 */
export const ScaleBounce: React.FC<TextAnimationProps> = ({
  text,
  fontSize = 72,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 10,
      stiffness: 200,
    },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        fontFamily,
        color,
        display: 'inline-block',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {text}
    </span>
  );
};

/**
 * Character-by-character scale bounce
 */
export const CharacterBounce: React.FC<TextAnimationProps & { staggerDelay?: number }> = ({
  text,
  fontSize = 64,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  delay = 0,
  staggerDelay = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const characters = text.split('');

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {characters.map((char, index) => {
        const charDelay = delay + index * staggerDelay;

        const scale = spring({
          frame: frame - charDelay,
          fps,
          config: { damping: 12, stiffness: 300 },
        });

        const y = interpolate(
          spring({ frame: frame - charDelay, fps, config: { damping: 12 } }),
          [0, 1],
          [50, 0]
        );

        return (
          <span
            key={index}
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              color,
              display: 'inline-block',
              transform: `scale(${scale}) translateY(${50 - y}px)`,
              marginRight: char === ' ' ? 16 : 2,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Gradient text with animated colors
 */
export const GradientText: React.FC<TextAnimationProps & { colors?: string[] }> = ({
  text,
  fontSize = 72,
  fontFamily = 'Inter, sans-serif',
  colors = ['#667eea', '#764ba2', '#f093fb'],
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 2;

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        fontFamily,
        background: `linear-gradient(${rotation}deg, ${colors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {text}
    </span>
  );
};

/**
 * Split text reveal (top and bottom halves)
 */
export const SplitReveal: React.FC<TextAnimationProps> = ({
  text,
  fontSize = 96,
  color = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const topY = interpolate(progress, [0, 1], [-50, 0]);
  const bottomY = interpolate(progress, [0, 1], [50, 0]);

  const textStyle: React.CSSProperties = {
    fontSize,
    fontWeight: 900,
    fontFamily,
    color,
    position: 'absolute',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ position: 'relative', height: fontSize * 1.2, overflow: 'hidden' }}>
      {/* Top half */}
      <div
        style={{
          ...textStyle,
          clipPath: 'inset(0 0 50% 0)',
          transform: `translateY(${topY}px)`,
        }}
      >
        {text}
      </div>

      {/* Bottom half */}
      <div
        style={{
          ...textStyle,
          clipPath: 'inset(50% 0 0 0)',
          transform: `translateY(${bottomY}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
