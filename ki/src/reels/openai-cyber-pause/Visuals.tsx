import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const font = 'Inter, Arial, sans-serif';
const purple = BRAND.accentDk;
const lightPurple = BRAND.accent;
const ink = BRAND.ink;
const green = '#2F9E73';
const red = '#C84D5A';
const blue = '#4477C4';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const fadeIn = (frame: number, start = 0, duration = 18) => interpolate(frame, [start, start + duration], [0, 1], clamp);

const Core: React.FC<{label?: string; scale?: number}> = ({label = 'ASTRA', scale = 1}) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 12) * 0.018;
  return (
    <div style={{position: 'relative', width: 190 * scale, height: 190 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 12 * scale, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${lightPurple}55 38%, ${purple} 100%)`, boxShadow: `0 28px 70px rgba(110,69,201,.24), inset 0 0 0 ${3 * scale}px rgba(255,255,255,.75)`, transform: `scale(${breathe})`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `${2 * scale}px solid rgba(110,69,201,.2)`}} />
      <div style={{zIndex: 2, fontFamily: font, fontSize: 31 * scale, fontWeight: 900, letterSpacing: 2 * scale, color: ink}}>{label}</div>
    </div>
  );
};

const Pill: React.FC<{text: string; tone?: 'purple' | 'green' | 'red' | 'blue'; active?: boolean}> = ({text, tone = 'purple', active = true}) => {
  const color = tone === 'green' ? green : tone === 'red' ? red : tone === 'blue' ? blue : purple;
  return <div style={{padding: '15px 24px', borderRadius: 999, border: `2px solid ${color}${active ? '55' : '28'}`, background: active ? `${color}18` : '#F5F3F8', color: active ? color : '#8C8796', fontFamily: font, fontSize: 27, fontWeight: 850, letterSpacing: .2, boxShadow: active ? `0 12px 32px ${color}18` : 'none'}}>{text}</div>;
};

export const PacingThresholdVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const trackProgress = interpolate(frame, [0, 110, 180, 324], [0.05, 0.62, 0.78, 0.8], clamp);
  const barrier = spring({frame: frame - 92, fps: 30, config: {damping: 18, stiffness: 150}});
  const threshold = fadeIn(frame, 118, 24);
  const x = 120 + trackProgress * 720;
  return (
    <AbsoluteFill style={{fontFamily: font}}>
      <div style={{position: 'absolute', left: 95, right: 95, top: 330, height: 500, borderRadius: 48, background: 'linear-gradient(180deg,#FFFFFF,#F7F3FC)', border: '1px solid rgba(110,69,201,.12)', boxShadow: '0 28px 80px rgba(45,30,80,.10)'}}>
        <div style={{position: 'absolute', left: 62, right: 62, top: 282, height: 18, borderRadius: 999, background: '#E7E3ED'}} />
        {[0,1,2,3].map((i) => <div key={i} style={{position: 'absolute', left: 84 + i * 146, top: 220, width: 82, height: 4, borderRadius: 999, background: purple, opacity: interpolate(frame, [10 + i * 8, 80 + i * 8], [.12, .55], clamp)}} />)}
        <div style={{position: 'absolute', left: x, top: 198, transform: 'translateX(-50%)'}}><Core scale={.78}/></div>
        <div style={{position: 'absolute', left: 770, top: 105, opacity: threshold, transform: `translateY(${(1-threshold)*18}px)`}}>
          <Pill text="CRITICAL CYBER" tone="red" />
        </div>
        <div style={{position: 'absolute', left: 812, top: 205, width: 12, height: 172, borderRadius: 999, background: red, opacity: threshold * .78, boxShadow: '0 0 0 8px rgba(200,77,90,.08)'}} />
        <div style={{position: 'absolute', left: 735, top: 235, width: 190, height: 88, borderRadius: 22, background: 'white', border: `3px solid ${purple}`, boxShadow: '0 20px 45px rgba(110,69,201,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1-barrier)*120}px) scale(${.94 + barrier*.06})`, opacity: barrier}}>
          <div style={{fontSize: 30, fontWeight: 950, color: purple}}>PACE ↓</div>
        </div>
        <div style={{position: 'absolute', left: 65, bottom: 55, right: 65, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Pill text="CAPABILITY" />
          <div style={{fontSize: 27, fontWeight: 800, color: '#777181'}}>bewusst verlangsamt</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TrainingPauseVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const pauseIn = spring({frame: frame - 72, fps: 30, config: {damping: 17, stiffness: 130}});
  const holdIn = spring({frame: frame - 190, fps: 30, config: {damping: 18, stiffness: 125}});
  const lineFill = interpolate(frame, [0, 130], [0.08, .62], clamp);
  return (
    <AbsoluteFill style={{fontFamily: font}}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 310, height: 560, borderRadius: 50, background: '#FFFFFF', border: '1px solid rgba(110,69,201,.12)', boxShadow: '0 30px 85px rgba(45,30,80,.10)', padding: 58}}>
        <div style={{fontSize: 28, fontWeight: 850, color: '#777181', marginBottom: 34}}>FRONTIER RL TRAINING</div>
        <div style={{position: 'relative', height: 155}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 62, height: 10, borderRadius: 999, background: '#E8E4EE'}} />
          <div style={{position: 'absolute', left: 0, top: 62, width: `${lineFill*100}%`, height: 10, borderRadius: 999, background: `linear-gradient(90deg,${lightPurple},${purple})`}} />
          {[0,1,2].map((i) => <div key={i} style={{position: 'absolute', left: i*190, top: 23, width: 145, height: 84, borderRadius: 20, background: '#F4F0FA', border: '2px solid rgba(110,69,201,.16)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24, fontWeight: 900, color: purple}}>RL {i+1}</div>)}
          <div style={{position: 'absolute', left: 510, top: 7, width: 220, height: 115, borderRadius: 26, background: '#FFF6EA', border: '2px solid rgba(205,132,44,.35)', boxShadow: '0 18px 36px rgba(205,132,44,.12)', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', justifyContent: 'center', transform: `scale(${.78 + .22*pauseIn})`, opacity: pauseIn}}>
            <div style={{fontSize: 39, fontWeight: 950, color: '#A7661C'}}>Ⅱ</div><div style={{fontSize: 25, fontWeight: 900, color: '#80511D'}}>2 WOCHEN</div>
          </div>
        </div>
        <div style={{height: 1, background: '#ECE8F1', margin: '30px 0 34px'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: holdIn, transform: `translateY(${(1-holdIn)*32}px)`}}>
          <div style={{width: 170, height: 112, borderRadius: 27, background: `linear-gradient(135deg,${purple},#4E2C99)`, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 22px 45px rgba(110,69,201,.20)'}}><div style={{fontSize: 23,fontWeight:800,opacity:.8}}>GRÖSSTER</div><div style={{fontSize: 31,fontWeight:950}}>RL RUN</div></div>
          <div style={{fontSize: 42, color: '#AEA8B7'}}>→</div>
          <div style={{flex: 1, height: 112, borderRadius: 27, border: '3px solid rgba(200,77,90,.34)', background: '#FFF7F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px'}}><div style={{fontSize: 27,fontWeight:850,color:ink}}>Status</div><Pill text="HOLD" tone="red" /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ThreeSafeguardsVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phases = [spring({frame: frame-20,fps,config:{damping:17}}), spring({frame:frame-72,fps,config:{damping:17}}), spring({frame:frame-124,fps,config:{damping:17}})];
  const labels = [
    {name:'MONITORING', note:'erkennen', color: blue},
    {name:'ALIGNMENT', note:'Verhalten lenken', color: purple},
    {name:'SECURITY', note:'Zugriff begrenzen', color: green},
  ];
  const scan = interpolate(frame, [160, 340], [0, 1], clamp);
  return (
    <AbsoluteFill style={{fontFamily: font}}>
      <div style={{position:'absolute',left:72,right:72,top:250,height:720,display:'flex',alignItems:'center',justifyContent:'center'}}>
        {labels.map((l,i)=>{
          const size=300+i*155; const p=phases[i];
          return <div key={l.name} style={{position:'absolute',width:size,height:size,borderRadius:'50%',border:`${4-i}px solid ${l.color}${i===0?'AA':'88'}`,boxShadow:`0 0 0 ${Math.max(2,10-i*2)}px ${l.color}0F`,opacity:p,transform:`scale(${.82+.18*p})`}} />;
        })}
        <Core scale={.92}/>
        <div style={{position:'absolute',left:18,top:96,display:'flex',flexDirection:'column',gap:18}}>{labels.map((l,i)=><div key={l.name} style={{display:'flex',alignItems:'center',gap:13,opacity:phases[i],transform:`translateX(${(1-phases[i])*-18}px)`}}><div style={{width:15,height:15,borderRadius:'50%',background:l.color,boxShadow:`0 0 0 7px ${l.color}18`}}/><div><div style={{fontSize:25,fontWeight:950,color:l.color}}>{l.name}</div><div style={{fontSize:22,fontWeight:700,color:'#777181'}}>{l.note}</div></div></div>)}</div>
        <div style={{position:'absolute',right:25,bottom:65,width:260,height:150,borderRadius:30,background:'#FFFFFF',border:'1px solid rgba(110,69,201,.15)',boxShadow:'0 20px 50px rgba(45,30,80,.10)',padding:24,opacity:fadeIn(frame,170,26)}}>
          <div style={{fontSize:22,fontWeight:850,color:'#777181',marginBottom:14}}>LIVE CHECK</div>
          <div style={{height:13,borderRadius:999,background:'#E7E3ED',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(7,scan*100)}%`,background:`linear-gradient(90deg,${blue},${purple},${green})`}}/></div>
          <div style={{marginTop:18,fontSize:24,fontWeight:900,color:scan>.72?green:purple}}>{scan>.72?'SAFEGUARDS ACTIVE':'ANALYSING…'}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const IsolationVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const sandbox = spring({frame:frame-25,fps:30,config:{damping:17,stiffness:120}});
  const net = fadeIn(frame,82,24);
  const monitor = interpolate(frame,[132,280],[0,1],clamp);
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <div style={{position:'absolute',left:80,right:80,top:285,height:650}}>
        <div style={{position:'absolute',left:70,top:62,width:510,height:420,borderRadius:45,background:'#FFFFFF',border:`4px solid ${purple}`,boxShadow:'0 30px 70px rgba(110,69,201,.13)',transform:`scale(${.94+.06*sandbox})`,opacity:sandbox}}>
          <div style={{position:'absolute',left:26,top:24}}><Pill text="STRICT SANDBOX" /></div>
          <div style={{position:'absolute',left:160,top:112}}><Core scale={.68}/></div>
          <div style={{position:'absolute',left:45,bottom:40,right:45,display:'flex',gap:14,justifyContent:'center'}}><Pill text="CODE" tone="blue"/><Pill text="TOOLS" tone="purple"/></div>
        </div>
        <div style={{position:'absolute',left:570,top:235,width:150,height:8,borderRadius:999,background:'#D9D4E1',opacity:net}}><div style={{position:'absolute',left:56,top:-18,width:38,height:38,borderRadius:12,background:'#FFF4F5',border:`2px solid ${red}`,display:'flex',alignItems:'center',justifyContent:'center',color:red,fontWeight:950}}>×</div></div>
        <div style={{position:'absolute',right:0,top:172,width:185,height:130,borderRadius:33,background:'#F5F7FB',border:'2px solid rgba(68,119,196,.22)',display:'flex',alignItems:'center',justifyContent:'center',opacity:net}}><div style={{fontSize:25,fontWeight:900,color:blue}}>NETWORK</div></div>
        <div style={{position:'absolute',left:55,right:10,bottom:0,display:'flex',alignItems:'center',gap:14}}>
          {['ACTIVITY','DETECT','REVIEW'].map((t,i)=>{const p=Math.max(0,Math.min(1,monitor*3-i));return <React.Fragment key={t}><div style={{width:190,height:98,borderRadius:25,background:p>.65?'#F0FBF6':'#F7F5FA',border:`2px solid ${p>.65?green+'66':'rgba(110,69,201,.12)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:23,fontWeight:900,color:p>.65?green:'#88818F',transform:`translateY(${(1-p)*18}px)`,opacity:.35+.65*p}}>{t}</div>{i<2?<div style={{fontSize:32,color:purple,opacity:p}}>→</div>:null}</React.Fragment>})}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CapabilitySafetyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const myth = fadeIn(frame,0,18) * interpolate(frame,[105,145],[1,0],clamp);
  const strike = interpolate(frame,[55,112],[0,1],clamp);
  const cap = interpolate(frame,[132,300],[.15,.94],clamp);
  const safety = interpolate(frame,[165,325],[.12,.94],clamp);
  const done = fadeIn(frame,276,32);
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <div style={{position:'absolute',left:95,right:95,top:270,height:710}}>
        <div style={{position:'absolute',left:90,right:90,top:10,height:100,display:'flex',alignItems:'center',justifyContent:'center',opacity:myth}}>
          <div style={{position:'relative',fontSize:38,fontWeight:950,color:red,letterSpacing:.3}}>AUSSER KONTROLLE?<div style={{position:'absolute',left:-14,right:-14,top:'52%',height:7,borderRadius:999,background:red,transformOrigin:'left center',transform:`scaleX(${strike}) rotate(-4deg)`}}/></div>
        </div>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:575,borderRadius:48,background:'#FFFFFF',border:'1px solid rgba(110,69,201,.12)',boxShadow:'0 30px 80px rgba(45,30,80,.10)',display:'flex',alignItems:'flex-end',justifyContent:'center',gap:115,padding:'50px 80px'}}>
          {[{label:'FÄHIGKEIT',value:cap,color:purple},{label:'SCHUTZ',value:safety,color:green}].map((b)=> <div key={b.label} style={{width:260,height:450,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',gap:18}}>
            <div style={{fontSize:27,fontWeight:950,color:b.color}}>{b.label}</div>
            <div style={{width:150,height:360,borderRadius:34,background:'#F0EDF4',display:'flex',alignItems:'flex-end',overflow:'hidden',boxShadow:'inset 0 0 0 2px rgba(30,20,50,.04)'}}><div style={{width:'100%',height:`${Math.max(8,b.value*100)}%`,background:`linear-gradient(180deg,${b.color}CC,${b.color})`,borderRadius:'28px 28px 24px 24px',boxShadow:`0 -10px 28px ${b.color}28`}}/></div>
          </div>)}
          <div style={{position:'absolute',right:60,top:48,opacity:done,transform:`scale(${.9+.1*done})`}}><Pill text="MUSS MITWACHSEN ✓" tone="green"/></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
