import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GlassPanel, SceneShell, TokenCapsule} from '../components/SceneShell';
import {palette, progress, springProgress} from '../visualUtils';

const ANSWER_STEPS = [
  {word: 'KI', alternatives: ['Das', 'Ein'], score: 78},
  {word: 'setzt', alternatives: ['liest', 'prüft'], score: 61},
  {word: 'Muster', alternatives: ['Daten', 'Regeln'], score: 74},
  {word: 'Wort', alternatives: ['Satz', 'Token'], score: 67},
  {word: 'für', alternatives: ['nach', 'mit'], score: 83},
  {word: 'Wort', alternatives: ['Schritt', 'Token'], score: 72},
  {word: 'fort.', alternatives: ['zusammen.', 'um.'], score: 69},
] as const;

const CANDIDATE_COLORS = [palette.accent, palette.success, palette.warning] as const;

export const AnswerWordAssemblyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const buildProgress = progress(frame, 6, 102);
  const currentIndex = Math.min(
    ANSWER_STEPS.length - 1,
    Math.floor(buildProgress * ANSWER_STEPS.length),
  );
  const currentStep = ANSWER_STEPS[currentIndex];
  const currentStepStart = 6 + currentIndex * 14;
  const candidateEnter = progress(frame, currentStepStart, 6);
  const candidateExit = progress(frame, currentStepStart + 10, 5);
  const candidateOpacity = candidateEnter * (1 - candidateExit * 0.75);
  const sentenceResolve = progress(frame, 108, 24);
  const splitPreparation = progress(frame, 130, 16);

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
            AUTOREGRESSIVE OUTPUT · EIN WORT PRO SCHRITT
          </div>

          <div
            style={{
              position: 'absolute',
              left: 54,
              right: 54,
              top: 116,
              height: 330,
              padding: '34px 34px 30px',
              borderRadius: 30,
              background: 'linear-gradient(180deg, rgba(125,73,223,.065), rgba(255,255,255,.75))',
              border: '1px solid rgba(125,73,223,.17)',
              transform: `perspective(900px) rotateY(${splitPreparation * -5}deg) scale(${1 - splitPreparation * 0.025})`,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignContent: 'center',
                gap: 14,
                minHeight: 215,
              }}
            >
              {ANSWER_STEPS.map((step, index) => {
                const delay = 6 + index * 14;
                const enter = springProgress({
                  frame,
                  fps,
                  delay,
                  damping: 18,
                  stiffness: 180,
                  mass: 0.62,
                });
                const active = progress(frame, delay, 6) *
                  (1 - progress(frame, delay + 10, 8));
                return (
                  <div
                    key={`${step.word}-${index}`}
                    style={{
                      position: 'relative',
                      opacity: enter,
                      transform: `translateY(${(1 - enter) * 86}px) scale(${0.82 + enter * 0.18 + active * 0.04})`,
                    }}
                  >
                    <TokenCapsule
                      text={step.word}
                      accent={index === 0 || index === 2 || index === ANSWER_STEPS.length - 1}
                      style={{
                        minWidth: step.word.length > 5 ? 160 : 96,
                        fontSize: 35,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: -8,
                        height: 6,
                        borderRadius: 999,
                        background: palette.accent,
                        opacity: active,
                        boxShadow: '0 0 14px rgba(125,73,223,.38)',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: 'absolute',
                left: 34,
                right: 34,
                bottom: 24,
                height: 7,
                borderRadius: 999,
                background: palette.line,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${buildProgress * 100}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${palette.accentSoft}, ${palette.accent})`,
                  boxShadow: '0 0 16px rgba(125,73,223,.34)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 54,
              right: 54,
              top: 480,
              height: 420,
              padding: '26px 28px',
              borderRadius: 30,
              background: 'rgba(255,255,255,.76)',
              border: '1px solid rgba(125,73,223,.15)',
              boxSizing: 'border-box',
              opacity: 1 - sentenceResolve,
              transform: `translateY(${sentenceResolve * 34}px)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 25, fontWeight: 900, color: palette.foreground}}>MÖGLICHE NÄCHSTE WÖRTER</div>
              <div style={{fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: palette.accent}}>SCHRITT {currentIndex + 1}/{ANSWER_STEPS.length}</div>
            </div>

            {[currentStep.word, ...currentStep.alternatives].map((candidate, index) => {
              const score = index === 0
                ? currentStep.score
                : Math.max(8, currentStep.score - 22 - index * 11);
              const rowEnter = progress(frame, currentStepStart + index * 2, 6);
              return (
                <div
                  key={`${currentIndex}-${candidate}-${index}`}
                  style={{
                    height: 92,
                    marginBottom: 13,
                    padding: '0 20px',
                    borderRadius: 24,
                    display: 'grid',
                    gridTemplateColumns: '170px 1fr 68px',
                    gap: 18,
                    alignItems: 'center',
                    background: index === 0 ? 'rgba(125,73,223,.095)' : 'rgba(245,243,249,.9)',
                    border: `2px solid ${index === 0 ? palette.accent : palette.line}`,
                    opacity: candidateOpacity * rowEnter,
                    transform: `translateX(${(1 - rowEnter) * (index % 2 === 0 ? -34 : 34)}px) scale(${index === 0 ? 1 + candidateEnter * 0.012 : 1})`,
                  }}
                >
                  <div style={{fontFamily: 'Arial, sans-serif', fontSize: 29, fontWeight: 900, color: index === 0 ? palette.accent : palette.foreground}}>{candidate}</div>
                  <div style={{height: 12, borderRadius: 999, background: palette.line, overflow: 'hidden'}}>
                    <div
                      style={{
                        width: `${score * candidateEnter}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: CANDIDATE_COLORS[index],
                      }}
                    />
                  </div>
                  <div style={{fontFamily: 'monospace', fontSize: 24, fontWeight: 900, textAlign: 'right', color: CANDIDATE_COLORS[index]}}>{Math.round(score * candidateEnter)}%</div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 92,
              right: 92,
              top: 560,
              padding: '44px 36px',
              borderRadius: 32,
              background: `linear-gradient(135deg, ${palette.foreground}, #302743)`,
              color: palette.white,
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(20,18,26,.22)',
              opacity: sentenceResolve,
              transform: `translateY(${(1 - sentenceResolve) * 55}px) scale(${0.9 + sentenceResolve * 0.1})`,
            }}
          >
            <div style={{fontFamily: 'Arial Narrow, Arial, sans-serif', fontSize: 46, fontWeight: 900, letterSpacing: -1}}>SATZ VOLLSTÄNDIG</div>
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 760, color: palette.accentSoft, marginTop: 12}}>Jedes Wort wurde einzeln ausgewählt.</div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 76,
              right: 76,
              bottom: 30,
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 16,
              alignItems: 'center',
              opacity: progress(frame, 82, 20),
            }}
          >
            <div style={{height: 2, background: 'linear-gradient(90deg, transparent, rgba(125,73,223,.38))'}} />
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 900, color: palette.foreground, letterSpacing: 1.6}}>MUSTER WIRD WORT FÜR WORT FORTGESETZT</div>
            <div style={{height: 2, background: 'linear-gradient(90deg, rgba(125,73,223,.38), transparent)'}} />
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
