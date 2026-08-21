import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ResultPill, SceneCanvas, sceneProgress} from './components';
import {localTodayBeat, localTodayResult, type TodaySceneId} from './sync';
import {todayPalette, todayShadows} from './style';

const bp = (scene: TodaySceneId, beat: string, frame: number): number =>
  sceneProgress(frame, localTodayBeat(scene, beat), localTodayResult(scene, beat));

export const Scene01DisconnectedToday: React.FC = () => {
  const frame = useCurrentFrame();
  const today = bp('scene-01', 's1-today', frame);
  const gap = bp('scene-01', 's1-live-gap', frame);
  const cable = interpolate(gap, [0, 1], [0, 0.83]);

  return (
    <SceneCanvas heading="Warum kennt KI das Heute nicht automatisch?" icon="broken-live-clock" iconProgress={gap}>
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 70, top: 250, width: 330, height: 330, borderRadius: '50%', background: `radial-gradient(circle at 40% 32%, ${todayPalette.accentSoft}, ${todayPalette.dark} 72%)`, border: `8px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 185, height: 215, borderRadius: 28, border: '5px solid rgba(255,255,255,.82)', background: 'rgba(255,255,255,.12)', display: 'flex', flexDirection: 'column', gap: 22, padding: 27, boxSizing: 'border-box'}}>
            {[1, 2, 3, 4].map((line) => <div key={line} style={{height: 18, width: `${100 - line * 9}%`, borderRadius: 99, background: line === 1 ? todayPalette.accentBright : 'rgba(255,255,255,.58)'}} />)}
          </div>
          <div style={{position: 'absolute', bottom: -58, fontSize: 26, fontWeight: 950}}>KI-WISSEN</div>
        </div>

        <div style={{position: 'absolute', right: 55, top: 190, width: 370, height: 370, borderRadius: '50%', border: `9px solid ${todayPalette.success}`, background: `radial-gradient(circle at 42% 35%, #FFFFFF, ${todayPalette.successSoft} 72%)`, boxShadow: todayShadows.success, transform: `scale(${0.92 + today * 0.08})`}}>
          <div style={{position: 'absolute', inset: 45, borderRadius: '50%', border: `4px solid ${todayPalette.success}`, opacity: 0.5}} />
          <div style={{position: 'absolute', left: 178, top: 64, width: 14, height: 122, borderRadius: 99, background: todayPalette.foreground, transformOrigin: '7px 120px', transform: `rotate(${interpolate(today, [0, 1], [-35, 54])}deg)`}} />
          <div style={{position: 'absolute', left: 178, top: 112, width: 14, height: 92, borderRadius: 99, background: todayPalette.accent, transformOrigin: '7px 72px', transform: `rotate(${interpolate(today, [0, 1], [18, 138])}deg)`}} />
          <div style={{position: 'absolute', left: 111, right: 111, bottom: 72, height: 72, borderRadius: 22, background: todayPalette.surface, border: `4px solid ${todayPalette.success}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 970, color: todayPalette.success}}>HEUTE</div>
          <div style={{position: 'absolute', bottom: -58, left: 0, right: 0, textAlign: 'center', fontSize: 26, fontWeight: 950}}>LIVE-WELT</div>
        </div>

        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
          <path d="M397 418 C500 350 570 350 650 390" fill="none" stroke={todayPalette.line} strokeWidth="24" strokeLinecap="round" />
          <path d="M397 418 C500 350 570 350 650 390" fill="none" stroke={todayPalette.accent} strokeWidth="15" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cable} />
          <circle cx="641" cy="393" r={10 + gap * 12} fill={todayPalette.danger} opacity={gap} />
          <circle cx="680" cy="383" r={10 + gap * 12} fill={todayPalette.danger} opacity={gap} />
        </svg>

        <div style={{position: 'absolute', left: 483, top: 330, width: 86, height: 86, borderRadius: '50%', border: `4px dashed ${todayPalette.danger}`, opacity: gap, transform: `scale(${0.7 + gap * 0.3})`}} />
        <ResultPill text="NICHT AUTOMATISCH LIVE VERBUNDEN" progress={gap} tone="danger" style={{position: 'absolute', left: 270, bottom: 70}} />
      </div>
    </SceneCanvas>
  );
};

export const Scene02FrozenTraining: React.FC = () => {
  const frame = useCurrentFrame();
  const training = bp('scene-02', 's2-training', frame);
  const freeze = bp('scene-02', 's2-freeze', frame);

  return (
    <SceneCanvas heading="Training friert Wissen zu einem Datenstand ein" icon="frozen-archive" iconProgress={freeze} accent="blue">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 68, top: 130, width: 270, height: 640, overflow: 'hidden'}}>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const y = interpolate(training, [0, 1], [-120 + index * 115, 125 + index * 72]);
            return (
              <div key={index} style={{position: 'absolute', left: index % 2 ? 55 : 0, top: y, width: 180 + (index % 2) * 42, height: 74, borderRadius: 22, border: `3px solid ${todayPalette.accent}`, background: todayPalette.surface, boxShadow: todayShadows.soft, opacity: 0.25 + training * 0.75, transform: `rotate(${index % 2 ? 5 : -4}deg)`}}>
                <div style={{position: 'absolute', left: 18, right: 18, top: 19, height: 13, borderRadius: 99, background: todayPalette.accent, opacity: 0.4}} />
                <div style={{position: 'absolute', left: 18, width: 90, top: 43, height: 11, borderRadius: 99, background: todayPalette.line}} />
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', left: 300, top: 95, width: 470, height: 690, clipPath: 'polygon(18% 0, 82% 0, 100% 18%, 94% 84%, 74% 100%, 22% 96%, 0 78%, 4% 20%)', background: `linear-gradient(145deg, rgba(255,255,255,.95), ${todayPalette.ice} 42%, rgba(93,184,235,.48))`, border: `8px solid ${todayPalette.iceStrong}`, boxShadow: todayShadows.ice, transform: `scale(${0.88 + training * 0.12})`}}>
          <div style={{position: 'absolute', inset: 55, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32, opacity: training}}>
            <div style={{fontSize: 43, fontWeight: 980, textAlign: 'center', color: todayPalette.foreground}}>TRAININGSDATEN</div>
            {[1, 2, 3, 4, 5].map((line) => <div key={line} style={{height: 25, width: `${104 - line * 9}%`, margin: '0 auto', borderRadius: 99, background: line < 3 ? todayPalette.accent : todayPalette.line, opacity: 0.42}} />)}
          </div>
          <svg viewBox="0 0 470 690" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: freeze}}>
            <path d="M40 80 L210 260 L85 420 L260 640 M430 60 L280 240 L410 390 L260 640 M95 15 L190 160 L320 30 M20 530 L150 470 L50 650" fill="none" stroke="white" strokeWidth="9" opacity="0.78" />
          </svg>
          <div style={{position: 'absolute', left: 92, right: 92, bottom: 65, height: 78, borderRadius: 26, background: 'rgba(255,255,255,.78)', border: `4px solid ${todayPalette.iceStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 970, color: '#277EAE', opacity: freeze}}>FESTER DATENSTAND</div>
        </div>

        <div style={{position: 'absolute', right: 28, top: 180, width: 155, height: 530, borderLeft: `5px solid ${todayPalette.warning}`, overflow: 'hidden'}}>
          {[0, 1, 2, 3, 4].map((index) => <div key={index} style={{position: 'absolute', left: 22, top: 30 + index * 112 + training * 34, width: 112, height: 58, borderRadius: 18, background: todayPalette.warningSoft, border: `3px solid ${todayPalette.warning}`, fontSize: 17, fontWeight: 900, color: todayPalette.warning, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>LIVE +{index + 1}</div>)}
        </div>

        <ResultPill text="ARCHIV STATT LIVETICKER" progress={freeze} tone="warning" style={{position: 'absolute', left: 340, bottom: 40}} />
      </div>
    </SceneCanvas>
  );
};

export const Scene03WorldMovesOn: React.FC = () => {
  const frame = useCurrentFrame();
  const updates = bp('scene-03', 's3-updates', frame);
  const blocked = bp('scene-03', 's3-blocked', frame);

  return (
    <SceneCanvas heading="Die Welt läuft nach dem Datenstand weiter" icon="future-gate" iconProgress={blocked} accent="amber">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 55, top: 355, width: 885, height: 26, borderRadius: 99, background: todayPalette.line}} />
        <div style={{position: 'absolute', left: 310, top: 160, width: 60, height: 500, borderRadius: 28, background: todayPalette.dangerSoft, border: `6px solid ${todayPalette.danger}`, boxShadow: todayShadows.danger, transform: `scaleY(${0.82 + blocked * 0.18})`}}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 8, right: 8, top: 35 + i * 92, height: 18, borderRadius: 99, background: todayPalette.danger}} />)}
          <div style={{position: 'absolute', top: -55, left: -55, width: 170, textAlign: 'center', fontSize: 24, fontWeight: 960, color: todayPalette.danger}}>WISSENSGRENZE</div>
        </div>

        <div style={{position: 'absolute', left: 70, top: 248, width: 190, height: 190, borderRadius: '50%', background: todayPalette.dark, border: `7px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 92, height: 92, borderRadius: 28, background: todayPalette.accent, transform: `rotate(${blocked * 45}deg)`}} />
          <div style={{position: 'absolute', bottom: -48, fontSize: 24, fontWeight: 950}}>KI</div>
        </div>

        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d="M255 343 C280 343 290 343 310 343" fill="none" stroke={todayPalette.accent} strokeWidth="18" strokeLinecap="round" />
          <path d="M365 343 C480 280 560 260 680 240" fill="none" stroke={todayPalette.warning} strokeWidth="13" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - updates)} />
          <path d="M365 343 C490 343 610 343 810 343" fill="none" stroke={todayPalette.warning} strokeWidth="13" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - updates)} />
          <path d="M365 343 C490 405 600 440 760 520" fill="none" stroke={todayPalette.warning} strokeWidth="13" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - updates)} />
        </svg>

        {[
          {label: 'UPDATE', x: 615, y: 170},
          {label: 'PREIS', x: 760, y: 285},
          {label: 'EREIGNIS', x: 690, y: 485},
        ].map((item, index) => (
          <div key={item.label} style={{position: 'absolute', left: item.x + (1 - updates) * 190, top: item.y, width: 210, height: 98, borderRadius: 30, background: todayPalette.warningSoft, border: `4px solid ${todayPalette.warning}`, boxShadow: todayShadows.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 970, color: todayPalette.warning, opacity: updates, transform: `rotate(${index === 1 ? 3 : -3}deg)`}}>
            {item.label}
          </div>
        ))}

        <div style={{position: 'absolute', left: 252, top: 250, width: 120, height: 190, background: `linear-gradient(90deg, transparent, ${todayPalette.dangerSoft})`, opacity: blocked}} />
        <ResultPill text="NEUE WELT AUSSERHALB DES WISSENS" progress={blocked} tone="danger" style={{position: 'absolute', left: 265, bottom: 72}} />
      </div>
    </SceneCanvas>
  );
};

export const Scene04OldPatternFillsGap: React.FC = () => {
  const frame = useCurrentFrame();
  const gap = bp('scene-04', 's4-gap', frame);
  const confident = bp('scene-04', 's4-confident', frame);
  const insertX = interpolate(gap, [0, 1], [-360, 0]);

  return (
    <SceneCanvas heading="Alte Muster füllen fehlende Informationen" icon="pattern-gap" iconProgress={gap} accent="red">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 112, top: 118, width: 772, height: 650, borderRadius: 62, border: `6px solid ${todayPalette.line}`, background: todayPalette.surface, boxShadow: todayShadows.soft, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 58, top: 58, fontSize: 32, fontWeight: 970, color: todayPalette.foreground}}>ANTWORT</div>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} style={{position: 'absolute', left: 58, top: 135 + index * 92, width: index === 3 ? 420 : 650, height: 28, borderRadius: 99, background: index === 0 ? todayPalette.accentSoft : todayPalette.line, opacity: index === 0 ? 0.85 : 0.65}} />
          ))}
          <div style={{position: 'absolute', left: 300, top: 207, width: 245, height: 210, borderRadius: 36, border: `6px dashed ${todayPalette.danger}`, background: todayPalette.background, boxShadow: `0 0 42px ${todayPalette.dangerSoft}`}}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 970, color: todayPalette.danger}}>INFORMATION FEHLT</div>
          </div>
          <div style={{position: 'absolute', left: 58, bottom: 62, width: 650, height: 28, borderRadius: 99, background: todayPalette.line, opacity: 0.65}} />
        </div>

        <div style={{position: 'absolute', left: 412, top: 325, width: 245, height: 210, borderRadius: 36, background: todayPalette.accentSoft, border: `6px solid ${todayPalette.accent}`, boxShadow: todayShadows.accent, opacity: gap, transform: `translateX(${insertX}px) rotate(${interpolate(gap, [0, 1], [-18, 0])}deg)`}}>
          <div style={{position: 'absolute', inset: 25, background: `repeating-linear-gradient(45deg, ${todayPalette.accent} 0 15px, transparent 15px 30px)`, opacity: 0.22, borderRadius: 18}} />
          <div style={{position: 'absolute', left: 28, right: 28, bottom: 30, textAlign: 'center', fontSize: 25, fontWeight: 970, color: todayPalette.accent}}>ALTES MUSTER</div>
        </div>

        <div style={{position: 'absolute', left: 245, top: 225, width: 506, height: 410, borderRadius: 70, border: `13px solid ${todayPalette.accent}`, boxShadow: `0 0 ${45 + confident * 60}px rgba(109,58,219,.48)`, opacity: confident * 0.8, transform: `scale(${0.72 + confident * 0.28})`}} />
        <svg viewBox="0 0 996 950" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: confident}}>
          <path d="M500 225 L462 345 L536 432 L478 540 L548 635" fill="none" stroke={todayPalette.danger} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <ResultPill text="PLAUSIBEL · ABER VERALTET" progress={confident} tone="danger" style={{position: 'absolute', left: 340, bottom: 58}} />
      </div>
    </SceneCanvas>
  );
};
