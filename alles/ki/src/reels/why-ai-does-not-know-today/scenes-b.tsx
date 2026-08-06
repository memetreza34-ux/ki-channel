import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ResultPill, SceneCanvas, SourceSheet, sceneProgress} from './components';
import {localTodayBeat, localTodayResult, type TodaySceneId} from './sync';
import {todayPalette, todayShadows} from './style';

const bp = (scene: TodaySceneId, beat: string, frame: number): number =>
  sceneProgress(frame, localTodayBeat(scene, beat), localTodayResult(scene, beat));

export const Scene05WebRetrieval: React.FC = () => {
  const frame = useCurrentFrame();
  const web = bp('scene-05', 's5-web', frame);
  const retrieve = bp('scene-05', 's5-retrieve', frame);
  const fresh = bp('scene-05', 's5-fresh', frame);

  return (
    <SceneCanvas heading="Webzugriff holt aktuelle Quellen in den Kontext" icon="web-retrieval" iconProgress={retrieve} accent="green">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 70, top: 250, width: 250, height: 250, borderRadius: '50%', border: `8px solid ${todayPalette.accent}`, background: todayPalette.surface, boxShadow: todayShadows.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 120, height: 120, borderRadius: '50%', border: `7px solid ${todayPalette.accent}`, position: 'relative'}}>
            <div style={{position: 'absolute', width: 72, height: 16, borderRadius: 99, background: todayPalette.accent, right: -52, bottom: -20, transform: 'rotate(45deg)'}} />
          </div>
          <div style={{position: 'absolute', bottom: -48, fontSize: 24, fontWeight: 950}}>WEB-SUCHE</div>
        </div>

        <div style={{position: 'absolute', left: 370, top: 125, width: 410, height: 410, borderRadius: '50%', border: `8px solid ${todayPalette.success}`, background: `radial-gradient(circle at 38% 32%, white, ${todayPalette.successSoft})`, boxShadow: todayShadows.success, transform: `scale(${0.92 + web * 0.08})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 186, height: 8, background: todayPalette.success, opacity: 0.45}} />
          <div style={{position: 'absolute', top: 0, bottom: 0, left: 197, width: 8, background: todayPalette.success, opacity: 0.35}} />
          <div style={{position: 'absolute', inset: 65, borderRadius: '50%', border: `5px solid ${todayPalette.success}`, opacity: 0.45}} />
          <div style={{position: 'absolute', inset: 120, borderRadius: '50%', background: todayPalette.success, opacity: 0.16}} />
        </div>

        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d="M280 365 C390 305 440 270 520 280" fill="none" stroke={todayPalette.accent} strokeWidth="20" strokeLinecap="round" strokeDasharray="430" strokeDashoffset={430 * (1 - web)} />
          <path d="M680 300 C760 340 825 390 870 470" fill="none" stroke={todayPalette.success} strokeWidth="15" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - retrieve)} />
          <circle cx={interpolate(web, [0, 1], [280, 520])} cy={interpolate(web, [0, 1], [365, 280])} r="16" fill={todayPalette.accentBright} opacity={web} />
        </svg>

        <SourceSheet title="QUELLE A" date="HEUTE · 09:40" tone="success" progress={retrieve} style={{position: 'absolute', right: 22, top: 445, transform: `translateX(${(1 - retrieve) * 220}px) rotate(3deg)`}} />
        <SourceSheet title="QUELLE B" date="GESTERN · 18:15" tone="accent" progress={retrieve} style={{position: 'absolute', right: 245, top: 600, transform: `translateY(${(1 - retrieve) * 180}px) rotate(-5deg) scale(.9)`}} />
        <div style={{position: 'absolute', right: 16, top: 438, width: 288, height: 228, borderRadius: 42, border: `7px solid ${todayPalette.success}`, boxShadow: todayShadows.success, opacity: fresh}} />
        <ResultPill text="AKTUELLE QUELLEN GELADEN" progress={fresh} tone="success" style={{position: 'absolute', left: 320, bottom: 35}} />
      </div>
    </SceneCanvas>
  );
};

export const Scene06SourceProof: React.FC = () => {
  const frame = useCurrentFrame();
  const date = bp('scene-06', 's6-date', frame);
  const original = bp('scene-06', 's6-original', frame);
  const unfold = interpolate(original, [0, 1], [0.54, 1]);

  return (
    <SceneCanvas heading="Datum, Quelle und Originalseite sichtbar machen" icon="original-source" iconProgress={original} accent="blue">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 238, top: 72, width: 520, height: 730, borderRadius: 42, background: todayPalette.surface, border: `6px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, transform: `scaleX(${unfold})`, transformOrigin: 'center', overflow: 'hidden'}}>
          <div style={{height: 92, background: todayPalette.dark, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 16}}>
            {[0, 1, 2].map((dot) => <div key={dot} style={{width: 18, height: 18, borderRadius: '50%', background: dot === 0 ? todayPalette.danger : dot === 1 ? todayPalette.warning : todayPalette.success}} />)}
            <div style={{marginLeft: 22, height: 26, flex: 1, borderRadius: 99, background: 'rgba(255,255,255,.25)'}} />
          </div>
          <div style={{padding: '48px 44px', display: 'flex', flexDirection: 'column', gap: 28}}>
            <div style={{fontSize: 39, fontWeight: 980}}>ORIGINALQUELLE</div>
            <div style={{height: 24, width: '100%', borderRadius: 99, background: todayPalette.accent, opacity: 0.5}} />
            <div style={{height: 24, width: '82%', borderRadius: 99, background: todayPalette.line}} />
            <div style={{height: 24, width: '91%', borderRadius: 99, background: todayPalette.line}} />
            <div style={{height: 24, width: '68%', borderRadius: 99, background: todayPalette.line}} />
            <div style={{height: 180, borderRadius: 28, background: todayPalette.ice, border: `3px solid ${todayPalette.iceStrong}`, marginTop: 12}} />
          </div>
        </div>

        {[
          {label: 'DATUM', x: 52, y: 175, color: todayPalette.accent, delay: 0},
          {label: 'QUELLE', x: 736, y: 275, color: todayPalette.success, delay: 0.12},
          {label: 'ZEIT', x: 90, y: 620, color: todayPalette.warning, delay: 0.24},
        ].map((pin) => {
          const p = Math.max(0, Math.min(1, (date - pin.delay) / (1 - pin.delay)));
          return (
            <div key={pin.label} style={{position: 'absolute', left: pin.x, top: pin.y, width: 220, height: 104, borderRadius: 32, background: todayPalette.surface, border: `5px solid ${pin.color}`, boxShadow: todayShadows.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 970, color: pin.color, opacity: p, transform: `translateY(${(1 - p) * 35}px) scale(${0.9 + p * 0.1})`}}>
              {pin.label}
            </div>
          );
        })}

        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: date}}>
          <path d="M272 225 C315 225 330 250 355 285 M736 330 C690 330 675 350 650 385 M310 675 C350 645 365 625 390 590" fill="none" stroke={todayPalette.foreground} strokeWidth="7" strokeLinecap="round" strokeDasharray="12 18" />
        </svg>
        <ResultPill text="ORIGINAL STATT ZUSAMMENFASSUNG" progress={original} tone="success" style={{position: 'absolute', left: 295, bottom: 28}} />
      </div>
    </SceneCanvas>
  );
};

export const Scene07CrossCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const compare = bp('scene-07', 's7-compare', frame);
  const check = bp('scene-07', 's7-check', frame);

  return (
    <SceneCanvas heading="Mehrere Quellen prüfen, bevor du entscheidest" icon="cross-check" iconProgress={check} accent="green">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 45, top: 160, width: 340, height: 540, borderRadius: 48, background: `linear-gradient(165deg, ${todayPalette.surface}, ${todayPalette.accentSoft})`, border: `6px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, transform: `translateX(${(1 - compare) * -220}px)`}}>
          <div style={{fontSize: 33, fontWeight: 980, color: todayPalette.accent, padding: '38px'}}>QUELLE 1</div>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 24, width: `${76 - i * 7}%`, margin: '0 38px 28px', borderRadius: 99, background: i === 1 ? todayPalette.success : todayPalette.line, opacity: 0.55}} />)}
          <div style={{position: 'absolute', left: 70, right: 70, bottom: 55, height: 100, borderRadius: 28, background: todayPalette.successSoft, border: `4px solid ${todayPalette.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 960, color: todayPalette.success}}>FAKT 42</div>
        </div>

        <div style={{position: 'absolute', right: 45, top: 160, width: 340, height: 540, borderRadius: 48, background: `linear-gradient(195deg, ${todayPalette.surface}, ${todayPalette.successSoft})`, border: `6px solid ${todayPalette.success}`, boxShadow: todayShadows.success, transform: `translateX(${(1 - compare) * 220}px)`}}>
          <div style={{fontSize: 33, fontWeight: 980, color: todayPalette.success, padding: '38px'}}>QUELLE 2</div>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 24, width: `${70 + i * 4}%`, margin: '0 38px 28px', borderRadius: 99, background: i === 2 ? todayPalette.success : todayPalette.line, opacity: 0.55}} />)}
          <div style={{position: 'absolute', left: 70, right: 70, bottom: 55, height: 100, borderRadius: 28, background: todayPalette.successSoft, border: `4px solid ${todayPalette.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 960, color: todayPalette.success}}>FAKT 42</div>
        </div>

        <div style={{position: 'absolute', left: 410, top: 295, width: 176, height: 260, clipPath: 'polygon(50% 0, 100% 24%, 82% 100%, 18% 100%, 0 24%)', background: `linear-gradient(180deg, ${todayPalette.accentSoft}, ${todayPalette.surface})`, border: `8px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, opacity: compare, transform: `scale(${0.82 + compare * 0.18})`}}>
          <div style={{position: 'absolute', left: 51, top: 78, width: 74, height: 74, borderRadius: '50%', background: todayPalette.success, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48, fontWeight: 980, opacity: check}}>✓</div>
        </div>

        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: compare}}>
          <path d="M385 430 C420 430 430 430 460 430 M611 430 C580 430 565 430 538 430" fill="none" stroke={todayPalette.success} strokeWidth="16" strokeLinecap="round" />
        </svg>

        <div style={{position: 'absolute', left: 245, right: 245, bottom: 58, height: 118, borderRadius: 36, background: todayPalette.successSoft, border: `5px solid ${todayPalette.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 970, color: todayPalette.success, opacity: check, boxShadow: todayShadows.success}}>ZWEI QUELLEN · EIN BESTÄTIGTER FAKT</div>
      </div>
    </SceneCanvas>
  );
};

export const Scene08FinalRule: React.FC = () => {
  const frame = useCurrentFrame();
  const source = bp('scene-08', 's8-source', frame);
  const proof = bp('scene-08', 's8-proof', frame);
  const original = bp('scene-08', 's8-original', frame);

  const steps = [
    {label: 'SUCHEN', color: todayPalette.accent, x: 100, delay: 0},
    {label: 'DATUM', color: todayPalette.warning, x: 385, delay: 0.18},
    {label: 'ORIGINAL', color: todayPalette.success, x: 670, delay: 0.36},
  ];

  return (
    <SceneCanvas heading="Aktuelle Sicherheit braucht einen sichtbaren Beweis" icon="freshness-scanner" iconProgress={proof} accent="violet">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 185, top: 70, width: 626, height: 360, borderRadius: 58, background: todayPalette.dark, boxShadow: todayShadows.accent, border: `8px solid ${todayPalette.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.92 + source * 0.08})`}}>
          <div style={{fontSize: 62, lineHeight: 1, fontWeight: 980, color: 'white', textAlign: 'center', letterSpacing: -2.5}}>SICHER<br />KLINGEN</div>
          <div style={{position: 'absolute', right: 55, top: 52, width: 110, height: 110, borderRadius: '50%', background: todayPalette.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 66, fontWeight: 980, opacity: proof, transform: `rotate(${proof * 10}deg)`}}>?</div>
          <div style={{position: 'absolute', left: 80, right: 80, bottom: 42, height: 12, borderRadius: 99, background: todayPalette.danger, transform: `scaleX(${proof})`}} />
        </div>

        <div style={{position: 'absolute', left: 60, right: 60, top: 505, height: 260}}>
          {steps.map((step, index) => {
            const p = Math.max(0, Math.min(1, (original - step.delay) / (1 - step.delay)));
            return (
              <React.Fragment key={step.label}>
                <div style={{position: 'absolute', left: step.x, top: 35, width: 225, height: 185, borderRadius: 48, background: todayPalette.surface, border: `6px solid ${step.color}`, boxShadow: todayShadows.soft, opacity: p, transform: `translateY(${(1 - p) * 70}px) scale(${0.9 + p * 0.1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 31, fontWeight: 980, color: step.color}}>
                  {step.label}
                </div>
                {index < steps.length - 1 ? <div style={{position: 'absolute', left: step.x + 225, top: 119, width: 60, height: 16, borderRadius: 99, background: todayPalette.line, opacity: p}} /> : null}
              </React.Fragment>
            );
          })}
        </div>

        <ResultPill text="TONFALL IST KEIN BEWEIS" progress={proof} tone="danger" style={{position: 'absolute', left: 346, top: 445}} />
        <ResultPill text="SUCHEN · DATUM PRÜFEN · ORIGINAL ÖFFNEN" progress={original} tone="success" style={{position: 'absolute', left: 220, bottom: 25}} />
      </div>
    </SceneCanvas>
  );
};
