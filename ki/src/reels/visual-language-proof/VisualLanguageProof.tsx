import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const VISUAL_LANGUAGE_PROOF_ID = 'VisualLanguageProofVertical';
export const VISUAL_LANGUAGE_PROOF_FPS = 30;
export const VISUAL_LANGUAGE_PROOF_WIDTH = 1080;
export const VISUAL_LANGUAGE_PROOF_HEIGHT = 1920;
export const VISUAL_LANGUAGE_PROOF_DURATION_IN_FRAMES = 360;

const C = {
  bg: '#F6F7FB',
  ink: '#102033',
  purple: '#7457D8',
  blue: '#3F7DF2',
  green: '#2EA56D',
  amber: '#F1A93A',
  white: '#FFFFFF',
  muted: '#687386',
  line: '#DDE3ED',
};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

type IconName = 'spark' | 'search' | 'link' | 'video' | 'chart' | 'shield' | 'bot' | 'check';

const Icon: React.FC<{name: IconName; size?: number}> = ({name, size = 52}) => {
  const common = {width: size, height: size, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (name === 'search') return <svg {...common}><circle cx="21" cy="21" r="11"/><path d="m30 30 10 10"/></svg>;
  if (name === 'link') return <svg {...common}><path d="M19 29 14 34a8 8 0 0 1-11-11l7-7a8 8 0 0 1 11 0"/><path d="m29 19 5-5a8 8 0 1 1 11 11l-7 7a8 8 0 0 1-11 0"/><path d="m16 32 16-16"/></svg>;
  if (name === 'video') return <svg {...common}><rect x="5" y="9" width="29" height="30" rx="7"/><path d="m34 18 9-5v22l-9-5Z"/></svg>;
  if (name === 'chart') return <svg {...common}><path d="M7 40h35"/><path d="M11 34V23M21 34V14M31 34V20M41 34V8"/></svg>;
  if (name === 'shield') return <svg {...common}><path d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11Z"/><path d="m17 24 5 5 10-11"/></svg>;
  if (name === 'bot') return <svg {...common}><rect x="8" y="13" width="32" height="25" rx="8"/><path d="M24 13V7M19 7h10"/><circle cx="18" cy="25" r="2" fill="currentColor" stroke="none"/><circle cx="30" cy="25" r="2" fill="currentColor" stroke="none"/><path d="M17 32h14"/></svg>;
  if (name === 'check') return <svg {...common}><circle cx="24" cy="24" r="18"/><path d="m15 24 6 6 12-13"/></svg>;
  return <svg {...common}><path d="m24 5 3.5 11.5L39 20l-11.5 3.5L24 35l-3.5-11.5L9 20l11.5-3.5Z"/><path d="m38 31 1.5 5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-2Z"/></svg>;
};

const Tag: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-flex', padding: '10px 15px', borderRadius: 999, background: '#EEE9FF', color: C.purple, fontSize: 22, fontWeight: 900, letterSpacing: .8}}>{children}</div>
);

const Scene: React.FC<React.PropsWithChildren> = ({children}) => (
  <AbsoluteFill style={{background: C.bg, color: C.ink, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden'}}>{children}</AbsoluteFill>
);

const IconScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items: {name: IconName; label: string; color: string}[] = [
    {name: 'spark', label: 'Idee', color: C.purple},
    {name: 'search', label: 'Recherche', color: C.blue},
    {name: 'link', label: 'Quellen', color: C.green},
    {name: 'video', label: 'B-Roll', color: C.amber},
    {name: 'chart', label: 'Daten', color: C.blue},
    {name: 'shield', label: 'QA', color: C.green},
  ];
  return <Scene>
    <div style={{position: 'absolute', left: 76, top: 110}}><Tag>ICONS · FUNKTIONAL</Tag></div>
    <div style={{position: 'absolute', left: 76, right: 76, top: 225, fontSize: 82, fontWeight: 950, lineHeight: .98, letterSpacing: -4}}>Icons sind Teil der Story.<br/><span style={{color: C.purple}}>Nicht nur Dekoration.</span></div>
    <div style={{position: 'absolute', left: 76, right: 76, top: 600, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 26}}>
      {items.map((item, i) => {
        const p = spring({fps, frame: Math.max(0, frame - 8 - i * 7), config: {damping: 17, stiffness: 170}});
        return <div key={item.label} style={{height: 220, borderRadius: 38, background: C.white, border: `1px solid ${C.line}`, boxShadow: '0 20px 55px rgba(16,32,51,.08)', display: 'flex', alignItems: 'center', gap: 26, padding: '0 28px', opacity: p, transform: `translateY(${(1-p)*34}px) scale(${.93 + p*.07})`}}>
          <div style={{width: 104, height: 104, borderRadius: 30, background: `${item.color}18`, color: item.color, display: 'grid', placeItems: 'center'}}><Icon name={item.name} /></div>
          <div style={{fontSize: 34, fontWeight: 900}}>{item.label}</div>
        </div>;
      })}
    </div>
  </Scene>;
};

const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [10, 82], [0, 1], clamp);
  const nodes = [
    {label: 'Prompt', sub: 'Aufgabe', color: C.blue, icon: 'spark' as IconName},
    {label: 'Agent', sub: 'entscheidet', color: C.purple, icon: 'bot' as IconName},
    {label: 'Tools', sub: 'führt aus', color: C.amber, icon: 'link' as IconName},
    {label: 'Output', sub: 'prüft', color: C.green, icon: 'check' as IconName},
  ];
  return <Scene>
    <div style={{position: 'absolute', left: 76, top: 110}}><Tag>PROZESS · CONNECTORS</Tag></div>
    <div style={{position: 'absolute', left: 76, right: 76, top: 225, fontSize: 82, fontWeight: 950, lineHeight: .98, letterSpacing: -4}}>Ein Ablauf wird<br/><span style={{color: C.purple}}>sichtbar erklärt.</span></div>
    <div style={{position: 'absolute', left: 106, right: 106, top: 590, bottom: 255}}>
      <div style={{position: 'absolute', left: 94, top: 114, bottom: 114, width: 8, borderRadius: 999, background: C.line}} />
      <div style={{position: 'absolute', left: 94, top: 114, width: 8, height: `${progress * 78}%`, borderRadius: 999, background: `linear-gradient(${C.blue},${C.purple},${C.green})`}} />
      {nodes.map((node, i) => {
        const p = spring({fps, frame: Math.max(0, frame - 10 - i * 18), config: {damping: 18, stiffness: 150}});
        return <div key={node.label} style={{position: 'absolute', left: 0, right: 0, top: i * 250, height: 190, display: 'flex', alignItems: 'center', gap: 34, opacity: p, transform: `translateX(${(1-p)*60}px)`}}>
          <div style={{width: 200, display: 'grid', placeItems: 'center', position: 'relative', zIndex: 2}}><div style={{width: 118, height: 118, borderRadius: 36, background: node.color, color: C.white, display: 'grid', placeItems: 'center', boxShadow: `0 20px 50px ${node.color}33`}}><Icon name={node.icon} size={54}/></div></div>
          <div style={{flex: 1, height: 160, borderRadius: 34, background: C.white, border: `1px solid ${C.line}`, padding: '26px 30px', boxShadow: '0 18px 50px rgba(16,32,51,.07)'}}><div style={{fontSize: 42, fontWeight: 950}}>{node.label}</div><div style={{fontSize: 27, color: C.muted, marginTop: 10}}>{node.sub}</div></div>
        </div>;
      })}
    </div>
  </Scene>;
};

const UiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = spring({fps, frame, config: {damping: 18, stiffness: 140}});
  const chart = interpolate(frame, [16, 86], [12, 88], clamp);
  const toggle = frame > 34;
  return <Scene>
    <div style={{position: 'absolute', left: 76, top: 110}}><Tag>UI · ZUSTANDSWECHSEL</Tag></div>
    <div style={{position: 'absolute', left: 76, right: 76, top: 225, fontSize: 80, fontWeight: 950, lineHeight: .98, letterSpacing: -4}}>UI kann die Aussage<br/><span style={{color: C.blue}}>direkt zeigen.</span></div>
    <div style={{position: 'absolute', left: 76, right: 76, top: 585, height: 920, borderRadius: 52, background: C.white, border: `1px solid ${C.line}`, boxShadow: '0 30px 90px rgba(16,32,51,.12)', overflow: 'hidden', transform: `translateY(${(1-card)*45}px) scale(${.96 + card*.04})`, opacity: card}}>
      <div style={{height: 92, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 13, padding: '0 28px'}}>{[C.purple, C.blue, C.green].map((color) => <div key={color} style={{width: 18, height: 18, borderRadius: 999, background: color}} />)}<div style={{marginLeft: 16, height: 38, flex: 1, borderRadius: 14, background: '#F0F3F8'}} /></div>
      <div style={{padding: 34}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div><div style={{fontSize: 38, fontWeight: 950}}>Autonomer Modus</div><div style={{fontSize: 24, color: C.muted, marginTop: 6}}>Agent darf Tools selbst auswählen</div></div><div style={{width: 110, height: 58, borderRadius: 999, padding: 7, background: toggle ? C.green : '#D7DDE7'}}><div style={{width: 44, height: 44, borderRadius: 999, background: C.white, transform: `translateX(${toggle ? 52 : 0}px)`, transition: 'none'}} /></div></div>
        <div style={{marginTop: 36, display: 'grid', gap: 18}}>{['Recherche abgeschlossen', 'Quelle geprüft', 'Visual geplant'].map((label, i) => {const p = spring({fps, frame: Math.max(0, frame - 18 - i * 13), config: {damping: 17, stiffness: 165}}); return <div key={label} style={{height: 108, borderRadius: 28, background: '#F7F9FC', display: 'flex', alignItems: 'center', gap: 22, padding: '0 24px', opacity: p, transform: `translateX(${(1-p)*38}px)`}}><div style={{width: 54, height: 54, borderRadius: 18, display: 'grid', placeItems: 'center', background: '#E9F7EF', color: C.green}}><Icon name="check" size={30}/></div><div style={{fontSize: 29, fontWeight: 850}}>{label}</div></div>;})}</div>
        <div style={{marginTop: 30, height: 210, borderRadius: 30, background: '#F7F9FC', padding: 24}}><div style={{fontSize: 25, color: C.muted, fontWeight: 800}}>Fortschritt</div><div style={{marginTop: 30, height: 22, borderRadius: 999, background: '#E3E8F0', overflow: 'hidden'}}><div style={{height: '100%', width: `${chart}%`, borderRadius: 999, background: `linear-gradient(90deg,${C.purple},${C.blue},${C.green})`}} /></div><div style={{fontSize: 48, fontWeight: 950, marginTop: 22}}>{Math.round(chart)}%</div></div>
      </div>
    </div>
  </Scene>;
};

const CombinedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 145}});
  const pulse = .96 + Math.sin(frame * .12) * .03;
  return <Scene>
    <div style={{position: 'absolute', left: 68, right: 68, top: 110}}><Tag>FINAL · GEMEINSAME VISUELLE SPRACHE</Tag><div style={{fontSize: 74, fontWeight: 950, lineHeight: .98, letterSpacing: -3.7, marginTop: 20}}>Icon + Prozess + UI.<br/><span style={{color: C.purple}}>Ein Beat, eine Aussage.</span></div></div>
    <div style={{position: 'absolute', left: 68, top: 520, width: 220, bottom: 280, display: 'grid', alignContent: 'center', gap: 20}}>{(['search','bot','chart','shield'] as IconName[]).map((name, i) => {const p = spring({fps, frame: Math.max(0, frame - i * 8), config: {damping: 16, stiffness: 170}}); return <div key={name} style={{height: 170, borderRadius: 38, background: C.white, border: `1px solid ${C.line}`, display: 'grid', placeItems: 'center', color: [C.blue,C.purple,C.amber,C.green][i], boxShadow: '0 18px 55px rgba(16,32,51,.08)', transform: `scale(${.82 + p*.18})`}}><Icon name={name} size={60}/></div>;})}</div>
    <div style={{position: 'absolute', left: 330, right: 68, top: 545, height: 420, borderRadius: 44, background: C.white, border: `1px solid ${C.line}`, boxShadow: '0 24px 70px rgba(16,32,51,.09)', padding: 30, opacity: enter, transform: `translateX(${(1-enter)*45}px)`}}>
      <div style={{fontSize: 31, fontWeight: 950}}>Agent Workflow</div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 62}}>{['Input','Agent','Tool','Output'].map((label, i) => <React.Fragment key={label}><div style={{width: 118, height: 118, borderRadius: 34, background: i===1?C.purple:'#F2F4F8', color: i===1?C.white:C.ink, display: 'grid', placeItems: 'center', fontSize: 23, fontWeight: 900, transform: i===1?`scale(${pulse})`:undefined}}>{label}</div>{i<3?<div style={{width: 55, height: 6, borderRadius: 999, background: [C.blue,C.purple,C.green][i]}}/>:null}</React.Fragment>)}</div>
    </div>
    <div style={{position: 'absolute', left: 330, right: 68, top: 1010, height: 430, borderRadius: 44, background: '#101C2C', color: C.white, boxShadow: '0 24px 70px rgba(16,32,51,.16)', padding: 34, opacity: enter}}><div style={{fontSize: 28, opacity: .65}}>STATUS</div><div style={{fontSize: 52, fontWeight: 950, marginTop: 12}}>Aufgabe läuft.</div><div style={{marginTop: 44, display: 'grid', gap: 18}}>{['Recherche', 'Tool-Aufruf', 'Qualitätscheck'].map((x, i) => <div key={x} style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 27, fontWeight: 800}}><div style={{width: 24, height: 24, borderRadius: 999, background: [C.blue,C.purple,C.green][i]}} />{x}</div>)}</div></div>
  </Scene>;
};

export const VisualLanguageProof: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Sequence from={0} durationInFrames={90}><IconScene /></Sequence>
    <Sequence from={90} durationInFrames={90}><ProcessScene /></Sequence>
    <Sequence from={180} durationInFrames={90}><UiScene /></Sequence>
    <Sequence from={270} durationInFrames={90}><CombinedScene /></Sequence>
  </AbsoluteFill>
);
