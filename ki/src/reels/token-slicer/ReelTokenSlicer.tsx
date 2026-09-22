import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {assertTokenSlicerVisualDiversity} from './visualProfiles';

export const TOKEN_SLICER_COMPOSITION_ID = 'TokenSlicerReel';
export const TOKEN_SLICER_FPS = 30;
export const TOKEN_SLICER_WIDTH = 1080;
export const TOKEN_SLICER_HEIGHT = 1920;
export const TOKEN_SLICER_DURATION_IN_FRAMES = 1260;

assertTokenSlicerVisualDiversity();

const C = {
  bg: '#F8F7FB',
  ink: '#1A1A2E',
  muted: '#68657A',
  purple: '#6E45C9',
  purpleSoft: '#B98CFF',
  green: '#39B982',
  line: '#E8E3F0',
  white: '#FFFFFF',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const p = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: ease});

const SceneShell: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <AbsoluteFill style={{backgroundColor: C.bg, color: C.ink, fontFamily: 'Arial, Helvetica, sans-serif'}}>
    <div style={{position: 'absolute', top: 122, left: 0, right: 0, textAlign: 'center', fontSize: 34, fontWeight: 900, color: C.purple, letterSpacing: -0.8}}>
      {title}
    </div>
    {children}
  </AbsoluteFill>
);

const HookSlicer: React.FC = () => {
  const frame = useCurrentFrame();
  const wordIn = p(frame, 0, 50);
  const blade = p(frame, 44, 76);
  const burst = p(frame, 70, 112);
  const depth = interpolate(wordIn, [0, 1], [0.68, 1]);
  return (
    <SceneShell title="KI liest anders">
      <div style={{position: 'absolute', left: 105, right: 105, top: 390, height: 880, perspective: 1200}}>
        <div style={{position: 'absolute', left: '50%', top: 310, transform: `translate(-50%, -50%) scale(${depth}) translateY(${interpolate(wordIn, [0, 1], [-170, 0])}px)`, fontSize: 154, fontWeight: 1000, letterSpacing: -12, color: C.ink, textShadow: '0 24px 55px rgba(38,27,59,.16)'}}>BERLIN</div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 500, height: 250, borderRadius: 70, background: 'linear-gradient(180deg,#FFFFFF,#EFE9F8)', boxShadow: '0 32px 90px rgba(49,32,76,.18)', border: `3px solid ${C.line}`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 112, height: 26, background: C.purple, opacity: .18}} />
          <div style={{position: 'absolute', left: '50%', top: 0, width: 20, height: interpolate(blade, [0, 1], [0, 250]), transform: 'translateX(-50%)', background: `linear-gradient(180deg,${C.purpleSoft},${C.purple})`, boxShadow: `0 0 34px ${C.purpleSoft}`}} />
          <div style={{position: 'absolute', left: '50%', top: 102, width: 690, transform: `translateX(-50%) scale(${1 - burst * .08})`, opacity: 1 - burst, fontSize: 96, fontWeight: 1000, textAlign: 'center', letterSpacing: -7}}>BERLIN</div>
        </div>
        {['BER', 'LI', 'N'].map((part, index) => {
          const offsets = [-245, 0, 245];
          const y = [850, 790, 860][index];
          return (
            <div key={part} style={{position: 'absolute', left: '50%', top: interpolate(burst, [0, 1], [620, y]), transform: `translateX(calc(-50% + ${offsets[index] * burst}px)) rotate(${(index - 1) * 7 * burst}deg) scale(${0.7 + burst * 0.3})`, padding: '22px 32px', borderRadius: 24, background: C.white, border: `3px solid ${C.purpleSoft}`, boxShadow: '0 24px 55px rgba(75,49,112,.15)', opacity: burst, fontSize: 52, fontWeight: 950, color: C.purple}}>{part}</div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const TokenizerFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = p(frame, 8, 58);
  const flow = p(frame, 42, 112);
  return (
    <SceneShell title="Text wird zu Tokens">
      <svg width="1080" height="1200" viewBox="0 0 1080 1200" style={{position: 'absolute', top: 250}}>
        <path d="M120 430 C290 310 420 760 560 590 S800 400 960 660" fill="none" stroke={C.line} strokeWidth="44" strokeLinecap="round" />
        <path d="M120 430 C290 310 420 760 560 590 S800 400 960 660" fill="none" stroke={C.purple} strokeWidth="14" strokeLinecap="round" strokeDasharray="1250" strokeDashoffset={1250 * (1 - flow)} />
      </svg>
      <div style={{position: 'absolute', left: interpolate(flow,[0,1],[80,820]), top: interpolate(flow,[0,1],[640,950]), width: 150, height: 150, borderRadius: 40, background: C.purple, transform: `rotate(${flow * 24}deg)`, boxShadow: '0 24px 55px rgba(110,69,201,.28)'}} />
      <div style={{position: 'absolute', left: 160, right: 160, top: 460, height: 12, background: C.line, overflow: 'hidden', borderRadius: 999}}><div style={{width: `${scan * 100}%`, height: '100%', background: C.green}} /></div>
      <div style={{position: 'absolute', top: 1120, left: 150, right: 150, fontSize: 54, lineHeight: 1.08, textAlign: 'center', fontWeight: 950}}>Nicht Wort für Wort.<br/><span style={{color:C.purple}}>Einheit für Einheit.</span></div>
    </SceneShell>
  );
};

const TokenTypes: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {label:'WORT', value:'Haus', size:220, shape:36},
    {label:'WORTTEIL', value:'ung', size:170, shape:28},
    {label:'ZEICHEN', value:'A', size:120, shape:60},
    {label:'SATZZEICHEN', value:'?', size:100, shape:999},
  ];
  return <SceneShell title="Ein Token kann vieles sein">
    <div style={{position:'absolute', left:80, right:80, top:370, bottom:300, display:'flex', alignItems:'center', justifyContent:'space-around'}}>
      {items.map((item,index)=>{
        const show = spring({frame: frame-index*18, fps:30, config:{damping:18, stiffness:130, mass:.8}});
        return <div key={item.label} style={{width:220, textAlign:'center', opacity:show, transform:`translateY(${(1-show)*110}px) scale(${.72+show*.28})`}}>
          <div style={{margin:'0 auto 28px', width:item.size, height:item.size, maxWidth:210, maxHeight:210, borderRadius:item.shape, background:index%2===0?C.purple:C.white, border:`4px solid ${C.purple}`, display:'flex', alignItems:'center', justifyContent:'center', color:index%2===0?C.white:C.purple, fontSize:58, fontWeight:1000, boxShadow:'0 25px 60px rgba(60,38,94,.13)'}}>{item.value}</div>
          <div style={{fontSize:18, fontWeight:950, letterSpacing:2.5, color:C.muted}}>{item.label}</div>
        </div>;
      })}
    </div>
  </SceneShell>;
};

const EncodingRouting: React.FC = () => {
  const frame = useCurrentFrame();
  const route = p(frame, 18, 112);
  return <SceneShell title="Die Zerlegung kann variieren">
    <div style={{position:'absolute', left:110, right:110, top:410, height:920}}>
      <div style={{position:'absolute', left:'50%', top:70, transform:'translateX(-50%)', fontSize:86, fontWeight:1000}}>TEXT</div>
      <svg width="860" height="760" viewBox="0 0 860 760" style={{position:'absolute', top:150}}>
        <path d="M430 0 C430 180 180 170 180 380 S110 620 110 720" fill="none" stroke={C.purple} strokeWidth="18" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900*(1-route)} />
        <path d="M430 0 C430 180 680 170 680 380 S750 620 750 720" fill="none" stroke={C.green} strokeWidth="18" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900*(1-route)} />
        <circle cx="430" cy="180" r="82" fill={C.white} stroke={C.purpleSoft} strokeWidth="9" />
        <text x="430" y="195" textAnchor="middle" fontSize="34" fontWeight="900" fill={C.ink}>ENCODING</text>
      </svg>
      <div style={{position:'absolute', left:5, bottom:0, display:'flex', gap:14}}>{['▰','▰▰','▰'].map((x,i)=><div key={i} style={{fontSize:46,color:C.purple}}>{x}</div>)}</div>
      <div style={{position:'absolute', right:0, bottom:0, display:'flex', gap:12}}>{['▰▰','▰','▰▰'].map((x,i)=><div key={i} style={{fontSize:42,color:C.green}}>{x}</div>)}</div>
    </div>
  </SceneShell>;
};

const WordVsToken: React.FC = () => {
  const frame = useCurrentFrame();
  const split = p(frame, 18, 105);
  return <SceneShell title="Wörter ≠ Tokens">
    <div style={{position:'absolute', left:100, right:100, top:430}}>
      <div style={{fontSize:32,fontWeight:950,color:C.muted}}>WÖRTER</div>
      <div style={{marginTop:28, display:'flex', gap:18}}>{['EIN','LANGER','PROMPT'].map(x=><div key={x} style={{flex:1,height:130,borderRadius:24,background:C.ink,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:950}}>{x}</div>)}</div>
      <div style={{marginTop:190,fontSize:32,fontWeight:950,color:C.purple}}>TOKENS</div>
      <div style={{marginTop:28, display:'flex', gap:12, transform:`translateX(${split*24}px)`}}>{[1,2,3,4,5,6].map((x,i)=><div key={x} style={{flex:[1.1,.7,1.35,.65,1,.8][i],height:100,borderRadius:20,background:i%2?C.purpleSoft:C.purple,opacity:.35+split*.65,transform:`translateY(${(i%2?1:-1)*split*28}px)`}} />)}</div>
      <svg width="880" height="220" style={{marginTop:55}}><path d="M40 100 C260 10 590 210 840 100" fill="none" stroke={C.green} strokeWidth="12" strokeDasharray="18 18" opacity={split}/></svg>
    </div>
  </SceneShell>;
};

const CaseSpacing: React.FC = () => {
  const frame = useCurrentFrame();
  const morph = p(frame, 10, 110);
  const samples = ['red',' Red','RED'];
  return <SceneShell title="Schreibweise verändert die Aufteilung">
    <div style={{position:'absolute', left:100, right:100, top:420, bottom:300, display:'flex', flexDirection:'column', justifyContent:'center', gap:64}}>
      {samples.map((text,index)=>{
        const local = p(frame, 8+index*18, 48+index*18);
        return <div key={text} style={{height:190, display:'flex', alignItems:'center', opacity:local, transform:`translateX(${(1-local)*(index%2?-110:110)}px)`}}>
          <div style={{width:270,fontSize:76,fontWeight:1000,whiteSpace:'pre'}}>{text}</div>
          <div style={{flex:1,height:28,borderRadius:999,background:C.line,position:'relative'}}>
            {[.22,.48,.72].slice(0,index+1).map((x,i)=><div key={i} style={{position:'absolute',left:`${(x + (index-1)*morph*.035)*100}%`,top:-38,width:8,height:104,borderRadius:999,background:index===2?C.green:C.purple}} />)}
          </div>
        </div>;
      })}
    </div>
  </SceneShell>;
};

const ModelCore: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = p(frame, 0, 165);
  const pulse = p(frame, 65, 115);
  return <SceneShell title="Das Modell verarbeitet Tokens">
    <svg width="1080" height="1200" viewBox="0 0 1080 1200" style={{position:'absolute',top:270}}>
      {[180,330,480,630,780].map((y,index)=>{
        const x = interpolate(progress,[0,1],[-80,540]);
        return <g key={y}><path d={`M0 ${y} C260 ${y-120}, 330 ${620+(index-2)*50}, 540 620`} fill="none" stroke={index%2?C.purpleSoft:C.purple} strokeWidth="13" opacity={.65}/><circle cx={Math.min(540,x-index*55)} cy={y} r="28" fill={C.purple}/></g>;
      })}
      <circle cx="540" cy="620" r={170+pulse*32} fill="rgba(110,69,201,.08)" stroke={C.purple} strokeWidth="16" />
      <circle cx="540" cy="620" r="92" fill={C.ink} />
      <text x="540" y="635" textAnchor="middle" fontSize="40" fontWeight="900" fill="white">MODELL</text>
      <path d="M710 620 C830 620 860 480 1080 480" fill="none" stroke={C.green} strokeWidth="16" strokeDasharray="500" strokeDashoffset={500*(1-p(frame,95,180))}/>
    </svg>
    <div style={{position:'absolute',left:150,right:150,top:1300,textAlign:'center',fontSize:52,fontWeight:950}}>Input-Tokens <span style={{color:C.purple}}>→</span> Verarbeitung <span style={{color:C.green}}>→</span> Output-Tokens</div>
  </SceneShell>;
};

const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const transfer = p(frame, 10, 100);
  const hold = p(frame, 95, 135);
  return <SceneShell title="Was du dir merken solltest">
    <div style={{position:'absolute',left:100,right:100,top:440,bottom:340,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',fontSize:92,fontWeight:1000,color:C.muted,opacity:1-transfer,transform:`translateX(${-transfer*420}px) scale(${1-transfer*.25})`}}>WÖRTER</div>
      <div style={{position:'absolute',fontSize:132,fontWeight:1000,color:C.purple,opacity:transfer,transform:`scale(${.68+transfer*.32})`,letterSpacing:-7}}>TOKENS</div>
      {[0,1,2,3,4,5].map(i=><div key={i} style={{position:'absolute',width:54,height:54,borderRadius:16,background:i%2?C.purpleSoft:C.purple,left:170+i*115,top:690+Math.sin(i)*50,opacity:hold,transform:`translateY(${(1-hold)*120}px) rotate(${(i-2)*7}deg)`}}/>)}
    </div>
    <div style={{position:'absolute',left:100,right:100,bottom:500,textAlign:'center',fontSize:58,lineHeight:1.08,fontWeight:1000}}>Nicht nur Wörter zählen.<br/><span style={{color:C.purple}}>Tokens verstehen.</span></div>
  </SceneShell>;
};

const cues = [
  [0,78,'Für dich ist Berlin ein Wort.'],
  [78,156,'Für eine KI muss das nicht so sein.'],
  [156,276,'Text wird zuerst in Tokens zerlegt.'],
  [276,435,'Ein Token kann Wort, Wortteil, Zeichen oder Satzzeichen sein.'],
  [435,570,'Die genaue Zerlegung hängt von Modell und Kodierung ab.'],
  [570,705,'Tokenanzahl und Wortanzahl sind nicht dasselbe.'],
  [705,840,'Auch Leerzeichen und Großschreibung können die Aufteilung verändern.'],
  [840,1035,'Tokens sind die Einheiten, die das Modell verarbeitet und erzeugt.'],
  [1035,1155,'Lange Prompts zählen deshalb nicht nur nach Wörtern.'],
  [1155,1260,'Entscheidend ist, wie viele Tokens daraus werden.'],
] as const;

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = cues.find(([from,to])=>frame>=from&&frame<to);
  if (!cue) return null;
  return <div style={{position:'absolute',left:104,right:104,bottom:520,textAlign:'center',fontSize:54,lineHeight:1.08,fontWeight:950,color:C.ink,textShadow:'0 2px 0 #fff,0 0 18px rgba(255,255,255,.9)',zIndex:50}}>{cue[2]}</div>;
};

export type ReelTokenSlicerProps = {
  showCaptions?: boolean;
  voiceoverSrc?: string;
};

export const ReelTokenSlicer: React.FC<ReelTokenSlicerProps> = ({showCaptions=true, voiceoverSrc}) => {
  const {fps} = useVideoConfig();
  if (fps !== TOKEN_SLICER_FPS) throw new Error(`TokenSlicerReel expects ${TOKEN_SLICER_FPS}fps`);
  return <AbsoluteFill style={{backgroundColor:C.bg}}>
    {voiceoverSrc ? <Audio src={voiceoverSrc} /> : null}
    <Sequence from={0} durationInFrames={156}><HookSlicer/></Sequence>
    <Sequence from={156} durationInFrames={120}><TokenizerFlow/></Sequence>
    <Sequence from={276} durationInFrames={159}><TokenTypes/></Sequence>
    <Sequence from={435} durationInFrames={135}><EncodingRouting/></Sequence>
    <Sequence from={570} durationInFrames={135}><WordVsToken/></Sequence>
    <Sequence from={705} durationInFrames={135}><CaseSpacing/></Sequence>
    <Sequence from={840} durationInFrames={195}><ModelCore/></Sequence>
    <Sequence from={1035} durationInFrames={225}><Payoff/></Sequence>
    {showCaptions ? <Captions/> : null}
  </AbsoluteFill>;
};
