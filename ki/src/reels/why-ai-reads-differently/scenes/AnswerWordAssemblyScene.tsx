import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress, seededRange, springProgress} from '../visualUtils';

const ANSWER_WORDS = ['KI', 'setzt', 'Muster', 'Wort', 'für', 'Wort', 'fort.'] as const;

export const AnswerWordAssemblyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sentenceResolve = progress(frame, 102, 34);
  const splitPreparation = progress(frame, 128, 20);

  return (
    <SceneShell sceneId="scene-07" background="radial-gradient(circle at 45% 46%, #FFFFFF 0%, #F5F1FC 50%, #E8E1F4 100%)">
      <div style={{position: 'absolute', left: 86, right: 86, top: 360, bottom: 340}}>
        <GlassPanel style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 36,
              top: 28,
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 800,
              color: palette.muted,
              letterSpacing: 2,
            }}
          >
            AUTOREGRESSIVE OUTPUT · ONE TOKEN AT A TIME
          </div>

          <div
            style={{
              position: 'absolute',
              left: 68,
              right: 68,
              top: 190,
              minHeight: 430,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignContent: 'center',
              gap: 18,
              transform: `perspective(900px) rotateY(${splitPreparation * -8}deg) scale(${1 - splitPreparation * 0.04})`,
            }}
          >
            {ANSWER_WORDS.map((word, index) => {
              const delay = 8 + index * 15;
              const enter = springProgress({
                frame,
                fps,
                delay,
                damping: 17,
                stiffness: 190,
                mass: 0.62,
              });
              const fromX = seededRange(index + 10, -420, 420);
              const fromY = seededRange(index + 40, -300, 360);
              const depth = seededRange(index + 70, -420, 180);
              const active = progress(frame, delay, 8) * (1 - progress(frame, delay + 14, 10));
              return (
                <div
                  key={`${word}-${index}`}
                  style={{
                    position: 'relative',
                    opacity: enter,
                    transform: `translate3d(${(1 - enter) * fromX}px, ${(1 - enter) * fromY}px, ${(1 - enter) * depth}px) scale(${0.66 + enter * 0.34 + active * 0.06})`,
                  }}
                >
                  <TokenCapsule
                    text={word}
                    accent={word === 'KI' || word === 'Muster' || index === ANSWER_WORDS.length - 1}
                    style={{
                      minWidth: word.length > 5 ? 165 : 104,
                      fontSize: 38,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 14,
                      right: 14,
                      bottom: -9,
                      height: 8,
                      borderRadius: 999,
                      background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
                      opacity: active,
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 90,
              right: 90,
              top: 665,
              height: 7,
              borderRadius: 999,
              background: palette.line,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${sentenceResolve * 100}%`,
                height: '100%',
                borderRadius: 999,
                background: `linear-gradient(90deg, ${palette.accentSoft}, ${palette.accent})`,
                boxShadow: '0 0 18px rgba(135,87,232,.4)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 76,
              right: 76,
              top: 730,
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 18,
              alignItems: 'center',
              opacity: progress(frame, 90, 24),
            }}
          >
            <div style={{height: 2, background: 'linear-gradient(90deg, transparent, rgba(135,87,232,.35))'}} />
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 900, color: palette.foreground, letterSpacing: 2}}>MUSTER WIRD FORTGESETZT</div>
            <div style={{height: 2, background: 'linear-gradient(90deg, rgba(135,87,232,.35), transparent)'}} />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 125,
              right: 125,
              bottom: 54,
              display: 'flex',
              justifyContent: 'space-around',
              opacity: sentenceResolve,
            }}
          >
            {['Alternative A', 'Alternative B', 'Alternative C'].map((label, index) => (
              <div
                key={label}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 16,
                  fontWeight: 700,
                  color: palette.muted,
                  opacity: 0.55 - index * 0.1,
                  transform: `translateY(${index * 10}px)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
