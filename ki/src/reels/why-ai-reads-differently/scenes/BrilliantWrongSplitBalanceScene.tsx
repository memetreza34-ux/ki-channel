import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

export const BrilliantWrongSplitBalanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = progress(frame, 0, 26);
  const confidence = progress(frame, 18, 30) * (1 - progress(frame, 52, 22));
  const warning = progress(frame, 48, 28);
  const tilt = interpolate(warning, [0, 1], [-7, 10]);
  const cta = progress(frame, 82, 24);

  return (
    <SceneShell sceneId="scene-08" background="radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F4F0FA 50%, #E8E1F2 100%)">
      <div style={{position: 'absolute', left: 86, right: 86, top: 345, bottom: 330}}>
        <GlassPanel style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              left: 38,
              top: 28,
              fontFamily: 'monospace',
              fontSize: 19,
              fontWeight: 800,
              color: palette.muted,
              letterSpacing: 2,
            }}
          >
            ANSWER CONFIDENCE ≠ TRUTH
          </div>

          <div
            style={{
              position: 'absolute',
              left: 72,
              right: 72,
              top: 155,
              height: 410,
              transform: `rotate(${tilt}deg)`,
              transformOrigin: '50% 88%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 40,
                width: '47%',
                height: 280,
                borderRadius: 34,
                background: 'linear-gradient(145deg, rgba(53,197,138,.20), rgba(255,255,255,.95))',
                border: '2px solid rgba(53,197,138,.42)',
                boxShadow: `0 20px 55px rgba(53,197,138,${0.12 + confidence * 0.16})`,
                clipPath: `inset(0 ${100 - split * 100}% 0 0 round 34px)`,
                padding: '36px 30px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 900, color: palette.success, letterSpacing: 1}}>KLINGT RICHTIG</div>
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 38, lineHeight: 1.14, fontWeight: 900, color: palette.foreground, marginTop: 30}}>„Die Antwort ist klar und überzeugend.“</div>
              <div style={{marginTop: 28, display: 'flex', gap: 8}}>
                {Array.from({length: 5}, (_, index) => (
                  <div key={index} style={{width: 42, height: 12, borderRadius: 999, background: palette.success, opacity: 0.35 + index * 0.12}} />
                ))}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 40,
                width: '47%',
                height: 280,
                borderRadius: 34,
                background: 'linear-gradient(145deg, rgba(255,93,108,.18), rgba(255,255,255,.95))',
                border: '2px solid rgba(255,93,108,.42)',
                boxShadow: `0 20px 60px rgba(255,93,108,${0.12 + warning * 0.18})`,
                clipPath: `inset(0 0 0 ${100 - split * 100}% round 34px)`,
                padding: '36px 30px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 900, color: palette.danger, letterSpacing: 1}}>KANN FALSCH SEIN</div>
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 38, lineHeight: 1.14, fontWeight: 900, color: palette.foreground, marginTop: 30}}>„Eine sichere Formulierung ist noch kein Beweis.“</div>
              <div
                style={{
                  marginTop: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 18px',
                  borderRadius: 18,
                  background: 'rgba(255,93,108,.12)',
                  color: palette.danger,
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 21,
                  fontWeight: 900,
                  opacity: warning,
                  transform: `scale(${0.8 + warning * 0.2})`,
                }}
              >
                ! QUELLE FEHLT
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 34,
                width: 520,
                height: 18,
                borderRadius: 999,
                background: palette.foreground,
                transform: 'translateX(-50%)',
                boxShadow: '0 12px 30px rgba(20,18,26,.22)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -36,
                width: 30,
                height: 110,
                background: palette.foreground,
                transform: 'translateX(-50%)',
                clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 80,
              right: 80,
              top: 655,
              padding: '30px 34px',
              borderRadius: 30,
              background: `linear-gradient(135deg, ${palette.foreground}, #2D2540)`,
              boxShadow: '0 24px 70px rgba(20,18,26,.24)',
              opacity: cta,
              transform: `translateY(${(1 - cta) * 48}px) scale(${0.93 + cta * 0.07})`,
              textAlign: 'center',
            }}
          >
            <div style={{fontFamily: 'Arial Narrow, Arial, sans-serif', fontSize: 52, fontWeight: 900, letterSpacing: -1.2, color: palette.white}}>KI-ANTWORTEN PRÜFEN</div>
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 750, marginTop: 12, color: palette.accentSoft}}>Klang ist kein Wahrheitsbeweis.</div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 36,
              transform: `translateX(-50%) scale(${0.85 + cta * 0.15})`,
              opacity: cta,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: 'Arial, sans-serif',
              fontSize: 20,
              fontWeight: 850,
              color: palette.muted,
            }}
          >
            <span style={{width: 12, height: 12, borderRadius: 999, background: palette.accent, boxShadow: '0 0 18px rgba(135,87,232,.5)'}} />
            KI KLAR
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
