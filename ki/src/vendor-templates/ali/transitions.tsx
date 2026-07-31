/**
 * Scene Transition Components
 *
 * Features:
 * - Fade transitions
 * - Slide transitions
 * - Zoom transitions
 * - Wipe transitions
 * - Glitch transitions
 *
 * Usage:
 * <FadeTransition progress={0.5}>
 *   <YourScene />
 * </FadeTransition>
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

interface TransitionProps {
  children: React.ReactNode;
  progress: number; // 0 to 1, where 0 = fully visible, 1 = fully exited
}

/**
 * Simple fade out transition
 */
export const FadeTransition: React.FC<TransitionProps> = ({ children, progress }) => {
  const opacity = interpolate(progress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Slide transition (configurable direction)
 */
export const SlideTransition: React.FC<TransitionProps & {
  direction?: 'left' | 'right' | 'up' | 'down';
}> = ({ children, progress, direction = 'left' }) => {
  const { width, height } = useVideoConfig();

  const transforms = {
    left: `translateX(${interpolate(progress, [0, 1], [0, -width])}px)`,
    right: `translateX(${interpolate(progress, [0, 1], [0, width])}px)`,
    up: `translateY(${interpolate(progress, [0, 1], [0, -height])}px)`,
    down: `translateY(${interpolate(progress, [0, 1], [0, height])}px)`,
  };

  return (
    <AbsoluteFill style={{ transform: transforms[direction] }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Zoom out transition
 */
export const ZoomTransition: React.FC<TransitionProps & { zoomOut?: boolean }> = ({
  children,
  progress,
  zoomOut = true,
}) => {
  const scale = zoomOut
    ? interpolate(progress, [0, 1], [1, 0.5])
    : interpolate(progress, [0, 1], [1, 2]);

  const opacity = interpolate(progress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Wipe transition (horizontal or vertical)
 */
export const WipeTransition: React.FC<TransitionProps & {
  direction?: 'horizontal' | 'vertical';
}> = ({ children, progress, direction = 'horizontal' }) => {
  const clipPath = direction === 'horizontal'
    ? `inset(0 ${progress * 100}% 0 0)`
    : `inset(0 0 ${progress * 100}% 0)`;

  return (
    <AbsoluteFill style={{ clipPath }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Circle wipe transition (iris effect)
 */
export const CircleWipeTransition: React.FC<TransitionProps & {
  centerX?: number;
  centerY?: number;
}> = ({ children, progress, centerX = 50, centerY = 50 }) => {
  // Start with full coverage, shrink to 0
  const radius = interpolate(progress, [0, 1], [150, 0]);

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at ${centerX}% ${centerY}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Glitch transition
 */
export const GlitchTransition: React.FC<TransitionProps> = ({ children, progress }) => {
  const frame = useCurrentFrame();

  // Only glitch during the transition
  const glitchIntensity = interpolate(progress, [0, 0.5, 1], [0, 1, 0]);
  const isGlitching = glitchIntensity > 0.1;

  const offsetX = isGlitching ? Math.sin(frame * 2) * 20 * glitchIntensity : 0;
  const skewX = isGlitching ? Math.cos(frame * 3) * 5 * glitchIntensity : 0;

  // Random slice effect
  const sliceHeight = isGlitching ? Math.random() * 100 : 0;
  const sliceOffset = isGlitching ? (Math.random() - 0.5) * 40 * glitchIntensity : 0;

  const opacity = interpolate(progress, [0, 0.9, 1], [1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Main content */}
      <AbsoluteFill
        style={{
          transform: `translateX(${offsetX}px) skewX(${skewX}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Glitch slice overlay */}
      {isGlitching && (
        <AbsoluteFill
          style={{
            clipPath: `inset(${sliceHeight}% 0 ${100 - sliceHeight - 10}% 0)`,
            transform: `translateX(${sliceOffset}px)`,
            mixBlendMode: 'difference',
          }}
        >
          {children}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/**
 * Blur transition
 */
export const BlurTransition: React.FC<TransitionProps & { maxBlur?: number }> = ({
  children,
  progress,
  maxBlur = 20,
}) => {
  const blur = interpolate(progress, [0, 1], [0, maxBlur]);
  const opacity = interpolate(progress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Pixelate transition
 */
export const PixelateTransition: React.FC<TransitionProps> = ({ children, progress }) => {
  // SVG filter for pixelation effect
  const pixelSize = interpolate(progress, [0, 1], [1, 50]);

  return (
    <AbsoluteFill>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="pixelate">
          <feFlood x="4" y="4" height="2" width="2" />
          <feComposite width={pixelSize} height={pixelSize} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={pixelSize / 2} />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          filter: progress > 0.1 ? 'url(#pixelate)' : 'none',
          opacity: interpolate(progress, [0, 0.9, 1], [1, 1, 0]),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Transition wrapper that handles timing automatically
 */
export const TransitionWrapper: React.FC<{
  children: React.ReactNode;
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'circle' | 'glitch' | 'blur';
  transitionDuration?: number; // frames
  direction?: 'left' | 'right' | 'up' | 'down';
}> = ({ children, type, transitionDuration = 15, direction = 'left' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Calculate transition progress (0 at start, transitions at end)
  const exitStart = durationInFrames - transitionDuration;
  const progress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const transitions = {
    fade: <FadeTransition progress={progress}>{children}</FadeTransition>,
    slide: <SlideTransition progress={progress} direction={direction}>{children}</SlideTransition>,
    zoom: <ZoomTransition progress={progress}>{children}</ZoomTransition>,
    wipe: <WipeTransition progress={progress}>{children}</WipeTransition>,
    circle: <CircleWipeTransition progress={progress}>{children}</CircleWipeTransition>,
    glitch: <GlitchTransition progress={progress}>{children}</GlitchTransition>,
    blur: <BlurTransition progress={progress}>{children}</BlurTransition>,
  };

  return transitions[type];
};

/**
 * Crossfade between two scenes
 */
export const Crossfade: React.FC<{
  sceneA: React.ReactNode;
  sceneB: React.ReactNode;
  progress: number; // 0 = sceneA, 1 = sceneB
}> = ({ sceneA, sceneB, progress }) => {
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress }}>
        {sceneA}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>
        {sceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
