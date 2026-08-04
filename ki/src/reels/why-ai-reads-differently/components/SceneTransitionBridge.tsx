import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {REEL_TRANSITIONS} from '../contract';
import {palette, progress} from '../visualUtils';

type TransitionStyle = (typeof REEL_TRANSITIONS)[number]['style'];

const TransitionVisual: React.FC<{style: TransitionStyle}> = ({style}) => {
  const frame = useCurrentFrame();
  const phase = progress(frame, 0, 12);
  const inOut = Math.sin(Math.PI * phase);

  if (style === 'scanner-wipe') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${interpolate(phase, [0, 1], [-12, 102])}%`,
            height: 150,
            background: 'linear-gradient(180deg, transparent, rgba(135,87,232,.5), white, rgba(135,87,232,.45), transparent)',
            filter: 'blur(8px)',
            opacity: inOut,
          }}
        />
      </AbsoluteFill>
    );
  }

  if (style === 'point-tunnel') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80}}>
        {Array.from({length: 18}, (_, index) => {
          const angle = (index / 18) * Math.PI * 2;
          const radius = interpolate(phase, [0, 1], [80, 760]);
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: 540 + Math.cos(angle) * radius,
                top: 960 + Math.sin(angle) * radius * 1.4,
                width: 20 + index % 4 * 7,
                height: 20 + index % 4 * 7,
                borderRadius: 999,
                background: index % 3 === 0 ? palette.accent : palette.accentSoft,
                opacity: inOut,
                transform: `translate(-50%, -50%) scale(${0.7 + phase * 1.8})`,
                boxShadow: '0 0 24px rgba(135,87,232,.45)',
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  if (style === 'thread-pull') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80}}>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          {[-220, -110, 0, 110, 220].map((offset, index) => {
            const dash = 1900;
            const offsetValue = interpolate(phase, [0, 1], [dash, -dash * 0.12]);
            return (
              <path
                key={offset}
                d={`M -80 ${960 + offset} C 260 ${760 + offset}, 820 ${1160 - offset}, 1160 ${960 - offset}`}
                fill="none"
                stroke={index === 2 ? palette.accent : palette.accentSoft}
                strokeWidth={index === 2 ? 18 : 8}
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={offsetValue}
                opacity={inOut * (index === 2 ? 0.9 : 0.55)}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    );
  }

  if (style === 'branch-flash') {
    const scale = interpolate(phase, [0, 0.5, 1], [0.1, 1.25, 2.7]);
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 640,
            height: 640,
            borderRadius: 999,
            background: 'radial-gradient(circle, white 0%, rgba(198,168,255,.88) 35%, rgba(135,87,232,.1) 70%, transparent 74%)',
            opacity: inOut,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>
    );
  }

  if (style === 'layer-lift') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80, overflow: 'hidden'}}>
        {Array.from({length: 5}, (_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 70,
              right: 70,
              top: 300 + index * 250,
              height: 120,
              borderRadius: 34,
              border: `3px solid ${index % 2 === 0 ? palette.accent : palette.accentSoft}`,
              background: 'rgba(255,255,255,.78)',
              opacity: inOut * 0.9,
              transform: `translateY(${interpolate(phase, [0, 1], [550, -700]) + index * -36}px) scale(${1 - index * 0.035})`,
              boxShadow: '0 24px 80px rgba(70,45,120,.15)',
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }

  if (style === 'word-stream') {
    const words = ['MUSTER', 'KONTEXT', 'WORT', 'ANTWORT', 'TOKEN'];
    return (
      <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80, overflow: 'hidden'}}>
        {words.map((word, index) => (
          <div
            key={word}
            style={{
              position: 'absolute',
              left: interpolate(phase, [0, 1], [-500 - index * 140, 1250 + index * 110]),
              top: 500 + index * 210,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 900,
              fontSize: 90 - index * 6,
              letterSpacing: 2,
              color: index % 2 === 0 ? palette.accent : palette.foreground,
              opacity: inOut * 0.82,
              transform: `rotate(${index % 2 === 0 ? -7 : 6}deg)`,
            }}
          >
            {word}
          </div>
        ))}
      </AbsoluteFill>
    );
  }

  const fold = interpolate(phase, [0, 0.5, 1], [0, 50, 100]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 80}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(0 0, ${fold}% 0, ${Math.max(0, fold - 20)}% 100%, 0 100%)`,
          background: palette.success,
          opacity: inOut * 0.72,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(${100 - fold}% 0, 100% 0, 100% 100%, ${Math.min(100, 120 - fold)}% 100%)`,
          background: palette.danger,
          opacity: inOut * 0.72,
        }}
      />
    </AbsoluteFill>
  );
};

export const SceneTransitionBridge: React.FC = () => (
  <>
    {REEL_TRANSITIONS.map((transition) => (
      <Sequence
        key={`${transition.atFrame}-${transition.style}`}
        from={transition.atFrame}
        durationInFrames={12}
      >
        <TransitionVisual style={transition.style} />
      </Sequence>
    ))}
  </>
);
