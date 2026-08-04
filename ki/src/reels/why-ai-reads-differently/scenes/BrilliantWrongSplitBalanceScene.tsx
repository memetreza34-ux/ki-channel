import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GlassPanel, SceneShell} from '../components/SceneShell';
import {palette, progress} from '../visualUtils';

export const BrilliantWrongSplitBalanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = progress(frame, 0, 20);
  const confidence = progress(frame, 14, 24);
  const warning = progress(frame, 42, 24);
  const tilt = interpolate(warning, [0, 1], [-3.5, 5.5]);
  const cta = progress(frame, 78, 24);

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
            SICHERER KLANG ≠ WAHRHEIT
          </div>

          <div
            style={{
              position: 'absolute',
              left: 54,
              right: 54,
              top: 126,
              height: 520,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 74,
                width: 350,
                height: 300,
                borderRadius: 32,
                background: 'linear-gradient(145deg, rgba(40,184,126,.18), rgba(255,255,255,.97))',
                border: '2px solid rgba(40,184,126,.46)',
                boxShadow: `0 20px 54px rgba(40,184,126,${0.1 + confidence * 0.12})`,
                padding: '32px 28px',
                boxSizing: 'border-box',
                opacity: split,
                transform: `translateY(${(1 - split) * 54}px) rotate(${-4 + tilt}deg) scale(${0.9 + split * 0.1})`,
                transformOrigin: '50% 100%',
              }}
            >
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 27, fontWeight: 900, color: palette.success, letterSpacing: 1}}>KLINGT RICHTIG</div>
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 36, lineHeight: 1.12, fontWeight: 900, color: palette.foreground, marginTop: 24}}>„Die Antwort ist klar und überzeugend.“</div>
              <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 10}}>
                <div style={{flex: 1, height: 11, borderRadius: 999, background: 'rgba(40,184,126,.18)', overflow: 'hidden'}}>
                  <div style={{width: `${95 * confidence}%`, height: '100%', borderRadius: 999, background: palette.success}} />
                </div>
                <div style={{fontFamily: 'monospace', fontSize: 20, fontWeight: 900, color: palette.success}}>{Math.round(95 * confidence)}%</div>
              </div>
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 17, fontWeight: 850, color: palette.muted, marginTop: 10}}>SICHER FORMULIERT</div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 92,
                width: 350,
                height: 300,
                borderRadius: 32,
                background: 'linear-gradient(145deg, rgba(242,80,97,.16), rgba(255,255,255,.97))',
                border: '2px solid rgba(242,80,97,.46)',
                boxShadow: `0 20px 58px rgba(242,80,97,${0.1 + warning * 0.15})`,
                padding: '32px 28px',
                boxSizing: 'border-box',
                opacity: split,
                transform: `translateY(${(1 - split) * 54}px) rotate(${4 + tilt}deg) scale(${0.9 + split * 0.1})`,
                transformOrigin: '50% 100%',
              }}
            >
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 27, fontWeight: 900, color: palette.danger, letterSpacing: 1}}>KANN FALSCH SEIN</div>
              <div style={{fontFamily: 'Arial, sans-serif', fontSize: 36, lineHeight: 1.12, fontWeight: 900, color: palette.foreground, marginTop: 24}}>„Eine sichere Formulierung ist noch kein Beweis.“</div>
              <div
                style={{
                  marginTop: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 16,
                  background: 'rgba(242,80,97,.11)',
                  color: palette.danger,
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 20,
                  fontWeight: 900,
                  opacity: warning,
                  transform: `translateY(${(1 - warning) * 12}px) scale(${0.88 + warning * 0.12})`,
                }}
              >
                ! QUELLE FEHLT
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 420,
                width: 520,
                height: 18,
                borderRadius: 999,
                background: palette.foreground,
                transform: `translateX(-50%) rotate(${tilt}deg)`,
                transformOrigin: '50% 50%',
                boxShadow: '0 12px 28px rgba(20,18,26,.20)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 420,
                width: 34,
                height: 104,
                background: palette.foreground,
                transform: 'translateX(-50%)',
                clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 74,
              right: 74,
              top: 676,
              padding: '28px 30px',
              borderRadius: 28,
              background: `linear-gradient(135deg, ${palette.foreground}, #302743)`,
              boxShadow: '0 24px 66px rgba(20,18,26,.22)',
              opacity: cta,
              transform: `translateY(${(1 - cta) * 38}px) scale(${0.94 + cta * 0.06})`,
              textAlign: 'center',
            }}
          >
            <div style={{fontFamily: 'Arial Narrow, Arial, sans-serif', fontSize: 49, fontWeight: 900, letterSpacing: -1.1, color: palette.white}}>KI-ANTWORTEN PRÜFEN</div>
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 23, fontWeight: 760, marginTop: 10, color: palette.accentSoft}}>Klang ist kein Wahrheitsbeweis.</div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 98,
              right: 98,
              top: 866,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              opacity: cta,
            }}
          >
            {['QUELLE', 'DATUM', 'BELEG'].map((label, index) => (
              <div
                key={label}
                style={{
                  height: 70,
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(125,73,223,.075)',
                  border: '1px solid rgba(125,73,223,.20)',
                  color: index === 2 ? palette.accent : palette.foreground,
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 1.3,
                  transform: `translateY(${(1 - cta) * (16 + index * 5)}px)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 30,
              transform: `translateX(-50%) scale(${0.88 + cta * 0.12})`,
              opacity: cta,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'Arial, sans-serif',
              fontSize: 19,
              fontWeight: 850,
              color: palette.muted,
            }}
          >
            <span style={{width: 11, height: 11, borderRadius: 999, background: palette.accent, boxShadow: '0 0 16px rgba(125,73,223,.42)'}} />
            KI KLAR
          </div>
        </GlassPanel>
      </div>
    </SceneShell>
  );
};
