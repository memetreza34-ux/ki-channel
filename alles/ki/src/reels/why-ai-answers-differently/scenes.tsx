import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {AnswerCard, ProbabilityTile, PromptCard, ResultBadge, SceneShell, Stage, prog} from './components';
import {localAnswerBeat, localAnswerResult, type AnswerSceneId} from './sync';
import {answerPalette, answerShadows} from './style';

const bp = (scene: AnswerSceneId, beat: string, frame: number): number =>
  prog(frame, localAnswerBeat(scene, beat), localAnswerResult(scene, beat));

export const Scene01SameQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const question = bp('scene-01', 's1-question', frame);
  const split = bp('scene-01', 's1-split', frame);
  return (
    <SceneShell title="Gleiche Frage, zwei Antwortwege" icon="split" iconProgress={split}>
      <Stage>
        <div style={{position: 'absolute', left: 170, right: 170, top: 55, height: 240, borderRadius: 120, background: `radial-gradient(circle, rgba(108,53,215,${0.18 + question * 0.18}), transparent 70%)`}} />
        <PromptCard text="DIESELBE FRAGE" style={{position: 'absolute', left: 226, top: 90, transform: `translateY(${(1 - question) * -90}px) scale(${0.88 + question * 0.12})`}} opacity={question} />
        <div style={{position: 'absolute', left: 450, top: 352, width: 112, height: 112, borderRadius: '50%', background: answerPalette.foreground, border: `8px solid ${answerPalette.accent}`, boxShadow: answerShadows.accent, opacity: question, transform: `scale(${0.7 + split * 0.3})`}} />
        <svg viewBox="0 0 1012 1160" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d="M506 462 C506 560 262 540 240 660" fill="none" stroke={answerPalette.success} strokeWidth="22" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - split)} />
          <path d="M506 462 C506 560 750 540 772 660" fill="none" stroke={answerPalette.danger} strokeWidth="22" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - split)} />
        </svg>
        <AnswerCard label="ANTWORT A" fact="eine plausible Formulierung" tone="success" opacity={split} style={{position: 'absolute', left: 34, top: 650, transform: `translateX(${(1 - split) * 250}px) scale(${0.86 + split * 0.14})`}} />
        <AnswerCard label="ANTWORT B" fact="eine andere plausible Formulierung" tone="accent" opacity={split} style={{position: 'absolute', right: 34, top: 650, transform: `translateX(${(1 - split) * -250}px) scale(${0.86 + split * 0.14})`}} />
        <ResultBadge text="GLEICHER START · ZWEI MÖGLICHE AUSGÄNGE" visible={split} style={{position: 'absolute', left: 238, bottom: 44}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene02Probabilities: React.FC = () => {
  const frame = useCurrentFrame();
  const options = bp('scene-02', 's2-options', frame);
  const probabilities = bp('scene-02', 's2-probabilities', frame);
  const candidates = [
    {word: 'KLAR', percent: 0.76, left: 50, top: 115},
    {word: 'DIREKT', percent: 0.58, left: 542, top: 115},
    {word: 'PRÄZISE', percent: 0.42, left: 50, top: 420},
    {word: 'EINFACH', percent: 0.25, left: 542, top: 420},
  ];
  return (
    <SceneShell title="Mehrere Wörter konkurrieren" icon="probability" iconProgress={probabilities}>
      <Stage>
        <div style={{position: 'absolute', left: 210, right: 210, top: 360, height: 420, borderRadius: '50%', background: `radial-gradient(circle, rgba(108,53,215,${0.12 + probabilities * 0.2}), transparent 66%)`}} />
        {candidates.map((candidate, index) => {
          const visible = prog(frame, localAnswerBeat('scene-02', 's2-options') + index * 7, localAnswerResult('scene-02', 's2-options') + index * 7);
          return <ProbabilityTile key={candidate.word} word={candidate.word} percent={candidate.percent} active={index === 0 && probabilities > 0.15} visible={visible} style={{position: 'absolute', left: candidate.left, top: candidate.top, transform: `translateY(${(1 - visible) * 45}px) scale(${0.88 + visible * 0.08 + (index === 0 ? probabilities * 0.08 : 0)})`}} />;
        })}
        <div style={{position: 'absolute', left: 392, top: 745, width: 228, height: 228, borderRadius: '50%', border: `8px solid ${answerPalette.accent}`, background: answerPalette.accentSoft, boxShadow: answerShadows.accent, opacity: probabilities, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 980, color: answerPalette.accentDark}}>AUSWAHL</div>
        <ResultBadge text="WAHRSCHEINLICHER HEISST NICHT EINZIG MÖGLICH" visible={probabilities} style={{position: 'absolute', left: 205, bottom: 36}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene03RandomChoice: React.FC = () => {
  const frame = useCurrentFrame();
  const random = bp('scene-03', 's3-random', frame);
  const branches = bp('scene-03', 's3-branches', frame);
  const pulseX = interpolate(branches, [0, 1], [506, 790]);
  const pulseY = interpolate(branches, [0, 1], [430, 730]);
  const targets = [
    {x: 180, y: 760, color: answerPalette.cyan},
    {x: 506, y: 900, color: answerPalette.accent},
    {x: 832, y: 760, color: answerPalette.warning},
  ];
  return (
    <SceneShell title="Ein Impuls wählt einen Pfad" icon="route" iconProgress={branches}>
      <Stage>
        <div style={{position: 'absolute', left: 436, top: 80, width: 140, height: 140, borderRadius: '50%', background: answerPalette.foreground, border: `9px solid ${answerPalette.accent}`, boxShadow: answerShadows.accent, opacity: random, transform: `scale(${0.72 + random * 0.28})`}} />
        <svg viewBox="0 0 1012 1160" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          {targets.map((target, index) => <path key={target.x} d={`M506 220 C506 430 ${target.x} 450 ${target.x} ${target.y}`} fill="none" stroke={index === 2 ? answerPalette.accent : target.color} strokeWidth={index === 2 ? 24 : 14} strokeLinecap="round" opacity={index === 2 ? 0.35 + branches * 0.65 : 0.28 * (1 - branches * 0.65)} strokeDasharray="900" strokeDashoffset={900 * (1 - random)} />)}
        </svg>
        {targets.map((target, index) => <div key={target.x} style={{position: 'absolute', left: target.x - 90, top: target.y - 90, width: 180, height: 180, borderRadius: 52, border: `7px solid ${index === 2 ? answerPalette.accent : target.color}`, background: index === 2 ? answerPalette.accentSoft : answerPalette.surface, boxShadow: index === 2 ? answerShadows.accent : answerShadows.card, opacity: random, transform: `scale(${index === 2 ? 0.86 + branches * 0.22 : 0.9 - branches * 0.08})`}} />)}
        <div style={{position: 'absolute', left: pulseX - 34, top: pulseY - 34, width: 68, height: 68, borderRadius: '50%', background: answerPalette.accentBright, boxShadow: '0 0 46px rgba(185,140,255,.9)', opacity: random, transform: `scale(${0.8 + branches * 0.25})`}} />
        <ResultBadge text="EINER VON MEHREREN WEGEN WIRD AKTIV" visible={branches} style={{position: 'absolute', left: 250, bottom: 34}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene04Temperature: React.FC = () => {
  const frame = useCurrentFrame();
  const high = bp('scene-04', 's4-high', frame);
  const low = bp('scene-04', 's4-low', frame);
  const value = Math.max(0, Math.min(1, high * (1 - low)));
  const angle = -120 + value * 240;
  const spread = 52 + value * 300;
  const points = Array.from({length: 9}, (_, index) => {
    const theta = (Math.PI * 2 * index) / 9;
    return {x: 506 + Math.cos(theta) * spread, y: 790 + Math.sin(theta) * spread * 0.5};
  });
  return (
    <SceneShell title="Kreativität steuert die Streuung" icon="temperature" iconProgress={Math.max(high, low)}>
      <Stage>
        <div style={{position: 'absolute', left: 286, top: 75, width: 440, height: 440, borderRadius: '50%', border: `18px solid ${answerPalette.lineStrong}`, background: 'radial-gradient(circle,#FFFFFF 28%,#E8DDFA 100%)', boxShadow: answerShadows.card}}>
          <div style={{position: 'absolute', left: 208, top: 208, width: 168, height: 20, borderRadius: 99, background: value > 0.5 ? answerPalette.danger : answerPalette.success, transformOrigin: '10px 10px', transform: `rotate(${angle}deg)`, boxShadow: '0 0 28px rgba(108,53,215,.35)'}} />
          <div style={{position: 'absolute', left: 177, top: 177, width: 86, height: 86, borderRadius: '50%', background: answerPalette.foreground, border: '8px solid #FFFFFF'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 54, textAlign: 'center', fontSize: 44, fontWeight: 980, color: value > 0.5 ? answerPalette.danger : answerPalette.success}}>{value > 0.5 ? 'HOCH' : 'NIEDRIG'}</div>
        </div>
        <div style={{position: 'absolute', inset: 0}}>{points.map((point, index) => <div key={index} style={{position: 'absolute', left: point.x - 28, top: point.y - 28, width: 56, height: 56, borderRadius: '50%', background: index === 0 ? answerPalette.accent : index % 2 === 0 ? answerPalette.cyan : answerPalette.warning, boxShadow: answerShadows.card, transform: `scale(${0.82 + Math.max(high, low) * 0.18})`}} />)}</div>
        <ResultBadge text={value > 0.5 ? 'MEHR MÖGLICHE FORMULIERUNGEN' : 'ENGERE, STABILERE AUSWAHL'} tone={value > 0.5 ? 'danger' : 'success'} visible={Math.max(high, low)} style={{position: 'absolute', left: value > 0.5 ? 262 : 300, bottom: 34}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene05WordingShift: React.FC = () => {
  const frame = useCurrentFrame();
  const wording = bp('scene-05', 's5-wording', frame);
  const shift = bp('scene-05', 's5-shift', frame);
  const candidates = [
    {label: 'KNAPP', startX: 120, endX: 710, startY: 640, endY: 780, startScale: 1.18, endScale: 0.88, color: answerPalette.warning},
    {label: 'DETAIL', startX: 690, endX: 120, startY: 760, endY: 610, startScale: 0.86, endScale: 1.18, color: answerPalette.accent},
    {label: 'BEISPIEL', startX: 410, endX: 410, startY: 890, endY: 830, startScale: 0.82, endScale: 1.05, color: answerPalette.cyan},
  ];
  return (
    <SceneShell title="Ein Wort verschiebt die ganze Auswahl" icon="token" iconProgress={shift}>
      <Stage>
        <div style={{position: 'absolute', left: 115, right: 115, top: 130, height: 240, borderRadius: 56, background: answerPalette.surface, border: `5px solid ${answerPalette.accent}`, boxShadow: answerShadows.accent, opacity: wording, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, fontSize: 42, fontWeight: 970}}>ERKLÄRE ES <div style={{position: 'relative', width: 260, height: 105}}><div style={{position: 'absolute', inset: 0, borderRadius: 30, background: answerPalette.warningSoft, border: `5px solid ${answerPalette.warning}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: answerPalette.warning, opacity: 1 - shift, transform: `rotate(${shift * -8}deg) scale(${1 - shift * 0.12})`}}>KURZ</div><div style={{position: 'absolute', inset: 0, borderRadius: 30, background: answerPalette.foreground, border: `5px solid ${answerPalette.accentBright}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', opacity: shift, transform: `rotate(${(1 - shift) * 8}deg) scale(${0.88 + shift * 0.12})`}}>PRÄZISE</div></div></div>
        <div style={{position: 'absolute', left: 376, top: 305, width: 260, height: 260, borderRadius: '50%', border: `10px solid ${answerPalette.accent}`, opacity: shift * 0.55, transform: `scale(${0.5 + shift * 1.5})`}} />
        {candidates.map((candidate) => {
          const x = interpolate(shift, [0, 1], [candidate.startX, candidate.endX]);
          const y = interpolate(shift, [0, 1], [candidate.startY, candidate.endY]);
          const scale = interpolate(shift, [0, 1], [candidate.startScale, candidate.endScale]);
          return <div key={candidate.label} style={{position: 'absolute', left: x, top: y, width: 250, height: 150, borderRadius: 42, border: `6px solid ${candidate.color}`, background: `${candidate.color}18`, boxShadow: answerShadows.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 35, fontWeight: 980, color: candidate.color, opacity: wording, transform: `scale(${scale})`}}>{candidate.label}</div>;
        })}
        <ResultBadge text="KLEINE WORTÄNDERUNG · NEUE PRIORITÄTEN" visible={shift} style={{position: 'absolute', left: 256, bottom: 34}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene06Facts: React.FC = () => {
  const frame = useCurrentFrame();
  const notWrong = bp('scene-06', 's6-not-wrong', frame);
  const consistent = bp('scene-06', 's6-consistent', frame);
  return (
    <SceneShell title="Anderer Wortlaut kann trotzdem richtig sein" icon="shield" iconProgress={consistent}>
      <Stage>
        <AnswerCard label="FORMULIERUNG A" fact="kurz erklärt · FAKT 42" tone="success" opacity={notWrong} style={{position: 'absolute', left: 28, top: 180, transform: `translateX(${(1 - notWrong) * -220}px)`}} />
        <AnswerCard label="FORMULIERUNG B" fact="anders erklärt · FAKT 42" tone="accent" opacity={notWrong} style={{position: 'absolute', right: 28, top: 180, transform: `translateX(${(1 - notWrong) * 220}px)`}} />
        <svg viewBox="0 0 1012 1160" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <path d="M238 450 C238 590 506 560 506 690" fill="none" stroke={answerPalette.success} strokeWidth="20" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - consistent)} />
          <path d="M774 450 C774 590 506 560 506 690" fill="none" stroke={answerPalette.success} strokeWidth="20" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500 * (1 - consistent)} />
        </svg>
        <div style={{position: 'absolute', left: 326, top: 660, width: 360, height: 300, borderRadius: '50%', border: `10px solid ${answerPalette.success}`, background: answerPalette.successSoft, boxShadow: answerShadows.success, opacity: consistent, transform: `scale(${0.75 + consistent * 0.25})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}><div style={{fontSize: 72, fontWeight: 980, color: answerPalette.success}}>42</div><div style={{fontSize: 29, fontWeight: 970, color: answerPalette.success}}>GEMEINSAMER FAKT</div></div>
        <ResultBadge text="FORMULIERUNG ANDERS · FAKT GLEICH" tone="success" visible={consistent} style={{position: 'absolute', left: 294, bottom: 30}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene07StableSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const goal = bp('scene-07', 's7-goal', frame);
  const settings = bp('scene-07', 's7-settings', frame);
  const context = bp('scene-07', 's7-context', frame);
  const modules = [
    {label: 'ZIEL', left: 30, top: 100, visible: goal, color: answerPalette.accent},
    {label: 'FORMAT', left: 366, top: 100, visible: goal, color: answerPalette.cyan},
    {label: 'GRENZEN', left: 702, top: 100, visible: goal, color: answerPalette.warning},
    {label: 'EINSTELLUNGEN', left: 80, top: 410, visible: settings, color: answerPalette.success},
    {label: 'AUSGANGSKONTEXT', left: 612, top: 410, visible: context, color: answerPalette.accent},
  ];
  return (
    <SceneShell title="Stabile Bedingungen erzeugen stabile Antworten" icon="lock" iconProgress={context}>
      <Stage>
        {modules.map((module, index) => <div key={module.label} style={{position: 'absolute', left: module.left, top: module.top, width: index < 3 ? 280 : 320, height: 175, borderRadius: 42, border: `6px solid ${module.color}`, background: `${module.color}18`, boxShadow: answerShadows.card, opacity: module.visible, transform: `translateY(${(1 - module.visible) * (index % 2 === 0 ? -80 : 80)}px) scale(${0.86 + module.visible * 0.14})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 980, color: module.color, textAlign: 'center'}}>{module.label}</div>)}
        <div style={{position: 'absolute', left: 386, top: 390, width: 240, height: 240, borderRadius: 58, background: answerPalette.foreground, border: `9px solid ${answerPalette.accentBright}`, boxShadow: answerShadows.dark, opacity: context, transform: `scale(${0.72 + context * 0.28})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 38, fontWeight: 980, textAlign: 'center'}}>STABILER<br />KERN</div>
        <svg viewBox="0 0 1012 1160" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}><path d="M506 630 V785" fill="none" stroke={answerPalette.accent} strokeWidth="22" strokeLinecap="round" opacity={context} /><path d="M475 750 L506 785 L537 750" fill="none" stroke={answerPalette.accent} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" opacity={context} /></svg>
        <AnswerCard label="ANTWORT 1" fact="nahezu gleich" tone="success" opacity={context} style={{position: 'absolute', left: 54, top: 820, width: 400, height: 230, transform: `translateX(${(1 - context) * -160}px)`}} />
        <AnswerCard label="ANTWORT 2" fact="nahezu gleich" tone="success" opacity={context} style={{position: 'absolute', right: 54, top: 820, width: 400, height: 230, transform: `translateX(${(1 - context) * 160}px)`}} />
      </Stage>
    </SceneShell>
  );
};

export const Scene08Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const compare = bp('scene-08', 's8-compare', frame);
  const normal = bp('scene-08', 's8-normal', frame);
  const warning = bp('scene-08', 's8-warning', frame);
  const lensX = interpolate(compare, [0, 1], [120, 740]);
  return (
    <SceneShell title="Formulierungen vergleichen, Fakten prüfen" icon="compare" iconProgress={warning}>
      <Stage>
        <AnswerCard label="ANTWORT A" fact="Wortlaut anders · Fakt 42" tone="success" opacity={compare} style={{position: 'absolute', left: 24, top: 125, width: 460, height: 330, transform: `translateX(${(1 - compare) * -240}px)`}} />
        <AnswerCard label="ANTWORT B" fact="anders erklärt · Fakt 42" tone="success" opacity={compare} style={{position: 'absolute', right: 24, top: 125, width: 460, height: 330, transform: `translateX(${(1 - compare) * 240}px)`}} />
        <div style={{position: 'absolute', left: lensX, top: 300, width: 180, height: 180, borderRadius: '50%', border: `10px solid ${answerPalette.accent}`, background: 'rgba(255,255,255,.38)', backdropFilter: 'blur(3px)', boxShadow: answerShadows.accent, opacity: compare}}><div style={{position: 'absolute', right: -75, bottom: -55, width: 105, height: 22, borderRadius: 99, background: answerPalette.accent, transform: 'rotate(45deg)'}} /></div>
        <div style={{position: 'absolute', left: 160, right: 160, top: 590, height: 160, borderRadius: 44, border: `6px solid ${answerPalette.success}`, background: answerPalette.successSoft, boxShadow: answerShadows.success, opacity: normal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 980, color: answerPalette.success, textAlign: 'center'}}>FORMULIERUNG ANDERS<br />FAKT GLEICH</div>
        <div style={{position: 'absolute', left: 160, right: 160, top: 805, height: 190, borderRadius: 44, border: `7px solid ${answerPalette.danger}`, background: answerPalette.dangerSoft, boxShadow: answerShadows.danger, opacity: warning, transform: `scale(${0.86 + warning * 0.14})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 980, color: answerPalette.danger, textAlign: 'center'}}>WIDERSPRUCH BEI FAKTEN<br />= WARNSIGNAL</div>
      </Stage>
    </SceneShell>
  );
};

export const ANSWER_SCENE_COMPONENTS = {
  'scene-01': Scene01SameQuestion,
  'scene-02': Scene02Probabilities,
  'scene-03': Scene03RandomChoice,
  'scene-04': Scene04Temperature,
  'scene-05': Scene05WordingShift,
  'scene-06': Scene06Facts,
  'scene-07': Scene07StableSetup,
  'scene-08': Scene08Compare,
} satisfies Record<AnswerSceneId, React.FC>;
