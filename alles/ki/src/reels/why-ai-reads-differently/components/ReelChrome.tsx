import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReelSceneId, SubtitleWordCue} from '../contract';
import {SCENE_TITLES} from '../contract';
import {palette, progress, springProgress} from '../visualUtils';

const Title: React.FC<{sceneId: ReelSceneId}> = ({sceneId}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = springProgress({frame, fps, delay: 2, damping: 18});
  const lineProgress = progress(frame, 9, 18);

  return (
    <div
      style={{
        position: 'absolute',
        top: 112,
        left: 90,
        right: 90,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -24}px)`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: 12,
          height: 58,
          borderRadius: 999,
          background: palette.accent,
          transform: `scaleY(${Math.max(0.12, lineProgress)})`,
          transformOrigin: 'top',
          boxShadow: '0 0 26px rgba(135, 87, 232, 0.45)',
        }}
      />
      <div>
        <div
          style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: 4.5,
            color: palette.accent,
            marginBottom: 8,
          }}
        >
          KI KLAR · {sceneId.replace('scene-0', '0')}
        </div>
        <div
          style={{
            fontFamily: 'Arial Narrow, Arial, Helvetica, sans-serif',
            fontSize: sceneId === 'scene-08' ? 48 : 54,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -1.8,
            color: palette.foreground,
            maxWidth: 850,
          }}
        >
          {SCENE_TITLES[sceneId]}
        </div>
      </div>
    </div>
  );
};

const KineticSubtitle: React.FC<{words: readonly SubtitleWordCue[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: 86,
        right: 86,
        bottom: 126,
        minHeight: 150,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          columnGap: 13,
          rowGap: 8,
          padding: '24px 30px 26px',
          borderRadius: 32,
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid rgba(135,87,232,0.15)',
          boxShadow: '0 18px 60px rgba(34, 22, 56, 0.11)',
          backdropFilter: 'blur(18px)',
        }}
      >
        {words.map((word, index) => {
          const reveal = springProgress({
            frame,
            fps,
            delay: word.atFrame,
            damping: 20,
            stiffness: 190,
            mass: 0.55,
          });
          const active = progress(frame, word.atFrame, 8) *
            (1 - progress(frame, word.atFrame + 14, 12));
          const color = word.danger
            ? palette.danger
            : word.accent
              ? palette.accent
              : palette.foreground;
          const scale = interpolate(active, [0, 1], [1, word.accent || word.danger ? 1.09 : 1.03]);

          return (
            <span
              key={`${word.text}-${index}`}
              style={{
                display: 'inline-block',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 42,
                lineHeight: 1.08,
                fontWeight: word.accent || word.danger ? 900 : 720,
                letterSpacing: -1.2,
                color,
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 18}px) scale(${scale})`,
                textShadow: active > 0.15
                  ? `0 0 ${18 * active}px ${word.danger ? 'rgba(255,93,108,.34)' : 'rgba(135,87,232,.30)'}`
                  : 'none',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const ReelChrome: React.FC<{
  sceneId: ReelSceneId;
  subtitleWords: readonly SubtitleWordCue[];
}> = ({sceneId, subtitleWords}) => (
  <>
    <Title sceneId={sceneId} />
    <KineticSubtitle words={subtitleWords} />
  </>
);
