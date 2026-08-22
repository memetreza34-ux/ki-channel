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
const amber = '#C9842C';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const lerp = (frame: number, input: number[], output: number[]) => interpolate(frame, input, output, clamp);
const appear = (frame: number, start: number, duration = 16) => lerp(frame, [start, start + duration], [0, 1]);
const pulse = (frame: number, speed = 10, amount = 0.025) => 1 + Math.sin(frame / speed) * amount;

const DepthBackground: React.FC<{tone?: 'purple' | 'red' | 'green' | 'blue'}> = ({tone = 'purple'}) => {
  const frame = useCurrentFrame();
  const color = tone === 'red' ? red : tone === 'green' ? green : tone === 'blue' ? blue : purple;
  const drift = Math.sin(frame / 44) * 36;
  const drift2 = Math.cos(frame / 51) * 48;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 920, height: 920, borderRadius: '50%', left: -270 + drift, top: 30 + drift2 * .4, background: `radial-gradient(circle, ${color}20 0%, ${color}08 45%, transparent 72%)`, filter: 'blur(12px)'}} />
      <div style={{position: 'absolute', width: 800, height: 800, borderRadius: '50%', right: -280 - drift2, top: 340 - drift * .5, background: `radial-gradient(circle, ${lightPurple}24 0%, transparent 70%)`, filter: 'blur(18px)'}} />
      <div style={{position: 'absolute', inset: -80, opacity: .28, transform: `perspective(900px) rotateX(66deg) translateY(${180 + Math.sin(frame / 36) * 16}px)`, transformOrigin: '50% 52%'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${color}18 1px, transparent 1px), linear-gradient(90deg, ${color}18 1px, transparent 1px)`, backgroundSize: '76px 76px'}} />
      </div>
    </AbsoluteFill>
  );
};

const BrandWordmark: React.FC<{progress: number}> = ({progress}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: progress, transform: `translateY(${(1 - progress) * 28}px) scale(${.88 + progress * .12})`}}>
    <div style={{width: 62, height: 62, borderRadius: 19, border: `4px solid ${purple}`, display: 'grid', placeItems: 'center', boxShadow: `0 12px 35px ${purple}22`, background: '#FFFFFFCC'}}>
      <div style={{width: 26, height: 26, borderRadius: '50%', border: `6px double ${purple}`, transform: `rotate(${progress * 135}deg)`}} />
    </div>
    <div style={{fontFamily: font, fontSize: 54, fontWeight: 950, letterSpacing: -2, color: ink}}>OpenAI</div>
  </div>
);

const Core: React.FC<{label?: string; size?: number; glow?: string}> = ({label = 'ASTRA', size = 220, glow = purple}) => {
  const frame = useCurrentFrame();
  const breathe = pulse(frame, 11, .022);
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `scale(${breathe})`}}>
      <div style={{position: 'absolute', inset: -34, borderRadius: '50%', background: `radial-gradient(circle, ${glow}34 0%, transparent 70%)`, filter: 'blur(10px)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 34% 28%, #FFFFFF 0%, ${lightPurple}66 35%, ${purple} 100%)`, boxShadow: `0 34px 90px ${glow}38, inset 0 0 0 5px rgba(255,255,255,.72)`}} />
      <div style={{position: 'absolute', inset: -13, borderRadius: '50%', border: `2px solid ${glow}45`}} />
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: font, fontSize: size * .17, fontWeight: 950, color: ink, letterSpacing: 2}}>{label}</div>
    </div>
  );
};

const Badge: React.FC<{text: string; color?: string; inverse?: boolean; scale?: number}> = ({text, color = purple, inverse = false, scale = 1}) => (
  <div style={{padding: `${13 * scale}px ${22 * scale}px`, borderRadius: 999, border: `2px solid ${color}${inverse ? '00' : '55'}`, background: inverse ? color : `${color}15`, color: inverse ? 'white' : color, fontFamily: font, fontSize: 25 * scale, fontWeight: 950, letterSpacing: .3, boxShadow: `0 16px 38px ${color}1C`}}>{text}</div>
);

export const PacingThresholdVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brandIn = spring({frame: frame - 2, fps, config: {damping: 17, stiffness: 125}});
  const coreIn = spring({frame: frame - 26, fps, config: {damping: 16, stiffness: 125}});
  const travel = lerp(frame, [34, 125, 260, 355], [0, .32, .78, .82]);
  const thresholdIn = spring({frame: frame - 268, fps, config: {damping: 15, stiffness: 165}});
  const hit = spring({frame: frame - 315, fps, config: {damping: 12, stiffness: 210}});
  const shake = frame > 315 && frame < 335 ? Math.sin((frame - 315) * 1.9) * (1 - (frame - 315) / 20) * 10 : 0;
  const x = 105 + travel * 760;
  const speedLines = Array.from({length: 8});

  return (
    <AbsoluteFill style={{fontFamily: font, transform: `translateX(${shake}px)`}}>
      <DepthBackground tone="red" />
      <div style={{position:'absolute',left:82,top:64}}><BrandWordmark progress={brandIn}/></div>
      <div style={{position:'absolute',left:82,top:168,fontSize:31,fontWeight:850,color:'#736D7E',opacity:appear(frame,18,18)}}>Model capability pacing</div>
      <div style={{position:'absolute',left:58,right:58,top:305,height:560}}>
        <div style={{position:'absolute',left:40,right:40,top:310,height:16,borderRadius:999,background:'#DED8E8',boxShadow:'inset 0 2px 7px rgba(20,10,35,.12)'}} />
        <div style={{position:'absolute',left:40,top:310,width:Math.max(10,travel*790),height:16,borderRadius:999,background:`linear-gradient(90deg,${lightPurple},${purple})`,boxShadow:`0 0 38px ${purple}55`}} />
        {speedLines.map((_,i)=>{
          const p = appear(frame, 42 + i*5, 14);
          return <div key={i} style={{position:'absolute',left:Math.max(20,x-210-i*34),top:230+i*16,width:90+i*10,height:5,borderRadius:999,background:purple,opacity:p*(.5-i*.035)}} />;
        })}
        <div style={{position:'absolute',left:x,top:200,transform:`translateX(-50%) scale(${.65 + coreIn*.35}) rotate(${lerp(frame,[20,180],[0,5])}deg)`,opacity:coreIn}}><Core size={245}/></div>
        <div style={{position:'absolute',left:720,top:24,width:230,height:450,opacity:thresholdIn,transform:`translateY(${(1-thresholdIn)*-70}px) scaleY(${.8+.2*thresholdIn})`}}>
          <div style={{position:'absolute',left:105,top:108,width:14,height:330,borderRadius:999,background:red,boxShadow:`0 0 0 10px ${red}12, 0 0 60px ${red}55`}} />
          <div style={{position:'absolute',top:28,left:-5}}><Badge text="CRITICAL CYBER" color={red} inverse scale={1.08}/></div>
          <div style={{position:'absolute',left:58,top:205,width:108,height:108,borderRadius:30,background:'#FFF',border:`5px solid ${purple}`,boxShadow:`0 28px 75px ${purple}35`,display:'grid',placeItems:'center',fontSize:40,fontWeight:1000,color:purple,transform:`scale(${.7+.3*hit}) rotate(${(1-hit)*-12}deg)`}}>↓</div>
        </div>
        <div style={{position:'absolute',left:42,bottom:18,display:'flex',gap:16,alignItems:'center'}}>
          <Badge text="CAPABILITY ↑" />
          <div style={{fontSize:29,fontWeight:900,color:hit>.4?purple:'#6F6977'}}>bewusst abbremsen</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TrainingPauseVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const conveyor = lerp(frame,[0,130],[0,1]);
  const gate = spring({frame:frame-38,fps,config:{damping:13,stiffness:190}});
  const stamp = spring({frame:frame-244,fps,config:{damping:12,stiffness:190}});
  const camera = lerp(frame,[180,300],[1,1.12]);
  const packets = [0,1,2,3,4];
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <DepthBackground tone="purple" />
      <div style={{position:'absolute',inset:'55px 60px 40px',transform:`scale(${camera})`,transformOrigin:'50% 47%'}}>
        <div style={{position:'absolute',left:40,top:35,fontSize:30,fontWeight:900,color:'#746E7E'}}>FRONTIER RL TRAINING</div>
        <div style={{position:'absolute',left:40,right:40,top:180,height:420,perspective:1000}}>
          <div style={{position:'absolute',left:0,right:0,top:190,height:22,borderRadius:999,background:'#DCD6E6',transform:'rotateX(58deg)',boxShadow:'0 30px 45px rgba(28,18,55,.15)'}} />
          {packets.map((p)=>{
            const phase = ((frame*2.25+p*95)%620)/620;
            const px=20+phase*700;
            return <div key={p} style={{position:'absolute',left:px,top:155,width:64,height:64,borderRadius:18,background:`linear-gradient(145deg,${lightPurple},${purple})`,boxShadow:`0 16px 32px ${purple}30`,transform:`translateY(${Math.sin((frame+p*9)/7)*8}px) rotate(${phase*180}deg)`,opacity:gate>.78&&px>500?.18:1}} />;
          })}
          <div style={{position:'absolute',left:70,top:55,display:'flex',gap:42}}>
            {['RL 1','RL 2','RL 3'].map((t,i)=><div key={t} style={{width:150,height:105,borderRadius:26,background:'#FFFFFFE8',border:`2px solid ${purple}28`,boxShadow:'0 22px 55px rgba(48,30,76,.10)',display:'grid',placeItems:'center',fontSize:27,fontWeight:950,color:purple,opacity:appear(frame,i*11,18),transform:`translateY(${(1-appear(frame,i*11,18))*24}px)`}}>{t}</div>)}
          </div>
          <div style={{position:'absolute',left:580,top:32,width:210,height:330,transform:`translateY(${(1-gate)*-250}px)`}}>
            <div style={{position:'absolute',left:90,top:0,width:26,height:320,borderRadius:14,background:amber,boxShadow:`0 0 50px ${amber}55`}} />
            <div style={{position:'absolute',left:0,top:98,width:210,height:128,borderRadius:34,background:'#FFF4E6',border:`4px solid ${amber}`,boxShadow:'0 28px 70px rgba(165,95,19,.25)',display:'grid',placeItems:'center',transform:`scale(${.8+.2*gate})`}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:43,fontWeight:1000,color:amber}}>Ⅱ</div><div style={{fontSize:27,fontWeight:1000,color:'#7B4B14'}}>2 WOCHEN</div></div>
            </div>
          </div>
        </div>
        <div style={{position:'absolute',left:70,right:70,bottom:75,height:225,borderRadius:46,background:'linear-gradient(135deg,#4D2E92,#7849D4)',boxShadow:'0 35px 85px rgba(75,43,140,.30)',transform:`translateY(${(1-appear(frame,205,22))*70}px)`,opacity:appear(frame,205,22),overflow:'hidden'}}>
          <div style={{position:'absolute',left:34,top:28,fontSize:23,fontWeight:850,color:'#DCCFFF'}}>GRÖSSTER GEPLANTER</div>
          <div style={{position:'absolute',left:34,top:62,fontSize:48,fontWeight:1000,color:'white'}}>FRONTIER RL RUN</div>
          <div style={{position:'absolute',right:35,top:34,width:205,height:155,borderRadius:30,background:'#FFF8F9',border:`5px solid ${red}`,display:'grid',placeItems:'center',transform:`scale(${.35+.65*stamp}) rotate(${(1-stamp)*-16}deg)`,boxShadow:'0 24px 60px rgba(200,77,90,.28)'}}><div style={{fontSize:42,fontWeight:1000,color:red}}>HOLD</div></div>
          <div style={{position:'absolute',left:35,right:285,bottom:30,height:13,borderRadius:999,background:'#FFFFFF30',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,conveyor*100)}%`,background:'#FFFFFF'}} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ThreeSafeguardsVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ringStarts=[125,160,184];
  const colors=[blue,purple,green];
  const labels=['MONITORING','ALIGNMENT','SECURITY'];
  const threat = lerp(frame,[220,420],[0,1]);
  const scanner = ((frame-225)%78+78)%78/78;
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <DepthBackground tone="blue" />
      <div style={{position:'absolute',left:0,right:0,top:80,height:870,display:'grid',placeItems:'center'}}>
        <div style={{position:'relative',width:800,height:800}}>
          {[0,1,2].map(i=>{
            const p=spring({frame:frame-ringStarts[i],fps,config:{damping:15,stiffness:125}});
            const size=340+i*165;
            return <div key={labels[i]} style={{position:'absolute',left:400-size/2,top:400-size/2,width:size,height:size,borderRadius:'50%',border:`${5-i}px solid ${colors[i]}AA`,boxShadow:`0 0 0 ${10-i*2}px ${colors[i]}10,0 0 55px ${colors[i]}20`,opacity:p,transform:`scale(${.68+.32*p}) rotate(${(1-p)*(i%2?18:-18)}deg)`}} />;
          })}
          <div style={{position:'absolute',left:270,top:270}}><Core size={260}/></div>
          {labels.map((label,i)=>{
            const p=spring({frame:frame-ringStarts[i],fps,config:{damping:15,stiffness:130}});
            const positions=[{left:8,top:80},{right:0,top:225},{left:28,bottom:52}][i];
            return <div key={label} style={{position:'absolute',...positions,opacity:p,transform:`scale(${.8+.2*p})`}}><Badge text={label} color={colors[i]} inverse scale={1.05}/></div>;
          })}
          {Array.from({length:7}).map((_,i)=>{
            const start=225+i*15;
            const p=lerp(frame,[start,start+105],[0,1]);
            const x=690-p*315;
            const y=250+i*48 + Math.sin(frame/9+i)*10;
            const blocked=p>.82;
            return <div key={i} style={{position:'absolute',left:x,top:y,width:22,height:22,borderRadius:7,background:blocked?green:red,boxShadow:`0 0 24px ${blocked?green:red}66`,transform:`rotate(${p*180}deg) scale(${blocked?.7:1})`,opacity:p>0?1:0}} />;
          })}
          <div style={{position:'absolute',left:115,top:360,width:570,height:5,background:`linear-gradient(90deg,transparent,${blue},transparent)`,transform:`translateY(${scanner*280-140}px)`,opacity:frame>225?.55:0,boxShadow:`0 0 24px ${blue}`}} />
          <div style={{position:'absolute',right:45,bottom:92,width:265,height:138,borderRadius:34,background:'#FFFFFFE8',border:`2px solid ${green}35`,boxShadow:'0 25px 65px rgba(30,80,60,.14)',padding:24,opacity:appear(frame,260,20)}}>
            <div style={{fontSize:22,fontWeight:900,color:'#756F7C'}}>LIVE CHECK</div>
            <div style={{marginTop:15,height:12,borderRadius:999,background:'#E4DFEA',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(8,threat*100)}%`,background:`linear-gradient(90deg,${blue},${purple},${green})`}} /></div>
            <div style={{marginTop:16,fontSize:25,fontWeight:1000,color:threat>.78?green:purple}}>{threat>.78?'SAFEGUARDS ACTIVE':'ANALYSING…'}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const IsolationVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boxIn=spring({frame:frame-4,fps,config:{damping:15,stiffness:125}});
  const seal=spring({frame:frame-140,fps,config:{damping:13,stiffness:180}});
  const network=lerp(frame,[176,225],[0,1]);
  const review=lerp(frame,[232,315],[0,1]);
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <DepthBackground tone="green" />
      <div style={{position:'absolute',left:54,right:54,top:105,height:820,perspective:1100}}>
        <div style={{position:'absolute',left:130,top:90,width:580,height:530,transform:`rotateY(${-8+boxIn*8}deg) rotateX(${6-boxIn*6}deg) scale(${.78+.22*boxIn})`,transformStyle:'preserve-3d',opacity:boxIn}}>
          <div style={{position:'absolute',inset:0,borderRadius:52,background:'linear-gradient(145deg,#FFFFFFF2,#F4EEFBF4)',border:`5px solid ${purple}`,boxShadow:'0 45px 100px rgba(80,48,130,.24)',overflow:'hidden'}}>
            <div style={{position:'absolute',left:26,top:25}}><Badge text="STRICT SANDBOX" inverse /></div>
            <div style={{position:'absolute',left:174,top:125}}><Core size={235}/></div>
            <div style={{position:'absolute',left:90,right:90,bottom:45,display:'flex',justifyContent:'space-between'}}><Badge text="CODE" color={blue}/><Badge text="TOOLS"/><Badge text="DATA" color={green}/></div>
            <div style={{position:'absolute',left:0,right:0,top:`${lerp(frame,[118,185],[-40,530])}px`,height:7,background:`linear-gradient(90deg,transparent,${green},transparent)`,boxShadow:`0 0 30px ${green}`,opacity:frame>118&&frame<195?.75:0}} />
          </div>
          <div style={{position:'absolute',right:-22,top:185,width:62,height:150,borderRadius:25,background:red,boxShadow:`0 20px 50px ${red}45`,transform:`translateX(${(1-seal)*70}px) scale(${.8+.2*seal})`,opacity:seal,display:'grid',placeItems:'center',color:'white',fontWeight:1000,fontSize:34}}>×</div>
        </div>
        <div style={{position:'absolute',left:620,top:340,width:280,height:10,borderRadius:999,background:'#D8D2E1',opacity:network}}>
          {Array.from({length:4}).map((_,i)=>{
            const p=((frame*4+i*70)%280)/280;
            return <div key={i} style={{position:'absolute',left:p*250,top:-13,width:34,height:34,borderRadius:10,background:p>.55?red:blue,boxShadow:`0 0 22px ${p>.55?red:blue}55`,opacity:p>.62?.15:1}} />;
          })}
        </div>
        <div style={{position:'absolute',right:20,top:268,width:215,height:160,borderRadius:40,background:'#F2F6FC',border:`3px solid ${blue}40`,display:'grid',placeItems:'center',opacity:network,transform:`scale(${.8+.2*network})`}}><div style={{fontSize:27,fontWeight:1000,color:blue}}>NETWORK</div></div>
        <div style={{position:'absolute',left:70,right:40,bottom:10,display:'flex',gap:18,alignItems:'center'}}>
          {['ACTIVITY','DETECT','REVIEW'].map((t,i)=>{
            const p=Math.max(0,Math.min(1,review*3-i));
            return <React.Fragment key={t}><div style={{flex:1,height:112,borderRadius:30,background:p>.55?'#EAF8F1':'#F4F1F7',border:`3px solid ${p>.55?green+'55':'#DAD4E2'}`,display:'grid',placeItems:'center',fontSize:25,fontWeight:1000,color:p>.55?green:'#8B8493',boxShadow:p>.55?`0 20px 45px ${green}18`:'none',transform:`translateY(${(1-p)*16}px)`}}>{t}</div>{i<2?<div style={{fontSize:40,fontWeight:1000,color:green,opacity:p}}>→</div>:null}</React.Fragment>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CapabilitySafetyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const myth=spring({frame:frame-4,fps,config:{damping:13,stiffness:165}});
  const cross=lerp(frame,[92,126],[0,1]);
  const reveal=lerp(frame,[142,178],[0,1]);
  const capability=lerp(frame,[194,322],[.12,1]);
  const safety=lerp(frame,[235,322],[.08,1]);
  const warning=capability-safety>.24;
  return (
    <AbsoluteFill style={{fontFamily:font}}>
      <DepthBackground tone={warning?'red':'green'} />
      <div style={{position:'absolute',left:70,right:70,top:75,height:860}}>
        <div style={{position:'absolute',left:0,right:0,top:40,textAlign:'center',opacity:1-reveal*.92,transform:`scale(${.82+.18*myth}) translateY(${(1-myth)*35}px)`}}>
          <div style={{fontSize:31,fontWeight:950,color:red,letterSpacing:2}}>BEHAUPTUNG</div>
          <div style={{marginTop:24,fontSize:75,fontWeight:1000,letterSpacing:-4,color:ink}}>AUSSER KONTROLLE?</div>
          <div style={{position:'absolute',left:165,right:165,top:95,height:12,borderRadius:999,background:red,transform:`scaleX(${cross}) rotate(-7deg)`,transformOrigin:'0 50%',boxShadow:`0 0 30px ${red}55`}} />
          <div style={{margin:'42px auto 0',width:250,display:'grid',placeItems:'center'}}><Core size={230} glow={red}/></div>
        </div>
        <div style={{position:'absolute',inset:0,opacity:reveal,transform:`translateY(${(1-reveal)*55}px)`}}>
          <div style={{position:'absolute',left:0,right:0,top:10,textAlign:'center'}}><div style={{fontSize:31,fontWeight:900,color:'#756F7D'}}>Was wirklich mitwachsen muss</div></div>
          <div style={{position:'absolute',left:105,right:105,top:120,height:570,display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            {[{name:'FÄHIGKEIT',value:capability,color:purple},{name:'SCHUTZ',value:safety,color:green}].map((bar)=>{
              const h=120+bar.value*340;
              return <div key={bar.name} style={{width:300,height:540,position:'relative',display:'flex',justifyContent:'center',alignItems:'flex-end'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,textAlign:'center',fontSize:29,fontWeight:1000,color:bar.color}}>{bar.name}</div>
                <div style={{width:210,height:460,borderRadius:42,background:'#FFFFFFB5',border:`3px solid ${bar.color}35`,boxShadow:'0 26px 65px rgba(40,28,66,.12)',overflow:'hidden',display:'flex',alignItems:'flex-end'}}>
                  <div style={{width:'100%',height:h,background:`linear-gradient(180deg,${bar.color},${bar.color}CC)`,borderRadius:'38px 38px 0 0',boxShadow:`0 -18px 50px ${bar.color}35`,position:'relative'}}><div style={{position:'absolute',left:0,right:0,top:18,textAlign:'center',color:'white',fontSize:36,fontWeight:1000}}>{Math.round(bar.value*100)}</div></div>
                </div>
              </div>;
            })}
          </div>
          <div style={{position:'absolute',left:145,right:145,bottom:52,height:108,borderRadius:32,background:warning?'#FFF3F4':'#EAF8F1',border:`3px solid ${warning?red:green}55`,display:'grid',placeItems:'center',boxShadow:`0 24px 60px ${warning?red:green}20`,transform:`scale(${pulse(frame,9,.015)})`}}>
            <div style={{fontSize:27,fontWeight:1000,color:warning?red:green,textAlign:'center'}}>{warning?'SCHUTZ MUSS AUFHOLEN':'TRAINING + TESTS MÜSSEN MITWACHSEN ✓'}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
