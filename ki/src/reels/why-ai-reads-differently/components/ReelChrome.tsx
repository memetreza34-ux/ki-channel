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
          boxShadow: '0 0 26px rgba(135, 87, 232, 0.34)',
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
            fontSize: sceneId === 'scene-08' ? 46 : 54,
            lineHeight: 0.96,
            fontWeight: 900,
            letterSpacing: -1.8,
            color: palette.foreground,
            maxWidth: 860,
          }}
        >
          {SCENE_TITLES[sceneId]}
        </div>
      </div>
    </div>
  );
};

const MAX_VISIBLE_WORDS = 9;

const KineticSubtitle: React.FC<{words: readonly SubtitleWordCue[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const revealedWords = words
    .map((word, index) => ({word, index}))
    .filter(({word}) => frame >= word.atFrame);
  const visibleWords = revealedWords.slice(-MAX_VISIBLE_WORDS);
  const currentWordIndex = revealedWords.length > 0
    ? revealedWords[revealedWords.length - 1].index
    : -1;
  const containerEnter = progress(frame, 0, 8);

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: 104,
        minHeight: 106,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          columnGap: 11,
          rowGap: 6,
          minWidth: 260,
          maxWidth: 900,
          minHeight: 66,
          padding: '17px 24px 19px',
          borderRadius: 27,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid rgba(135,87,232,0.16)',
          boxShadow: '0 16px 48px rgba(34, 22, 56, 0.10)',
          backdropFilter: 'blur(16px)',
          opacity: containerEnter,
          transform: `translateY(${(1 - containerEnter) * 16}px)`,
        }}
      >
        {visibleWords.map(({word, index}) => {
          const reveal = springProgress({
            frame,
            fps,
            delay: word.atFrame,
            damping: 22,
            stiffness: 185,
            mass: 0.58,
          });
          const active = index === currentWordIndex
            ? progress(frame, word.atFrame, 7) *
              (1 - progress(frame, word.atFrame + 15, 10))
            : 0;
          const color = word.danger
            ? palette.danger
            : word.accent
              ? palette.accent
              : palette.foreground;
          const emphasisScale = word.accent || word.danger ? 1.07 : 1.025;
          const scale = interpolate(active, [0, 1], [1, emphasisScale]);

          return (
            <span
              key={`${word.text}-${index}`}
              style={{
                display: 'inline-block',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: 38,
                lineHeight: 1.08,
                fontWeight: word.accent || word.danger ? 900 : 760,
                letterSpacing: -1,
                color,
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 14}px) scale(${scale})`,
                transformOrigin: 'center bottom',
                textShadow: active > 0.18
                  ? `0 0 ${12 * active}px ${word.danger ? 'rgba(255,93,108,.24)' : 'rgba(135,87,232,.22)'}`
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
