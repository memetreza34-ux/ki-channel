import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {easedProgress} from '../../../motion/easing';
import {YOUTUBE_VISUAL_LANGUAGE as V} from '../../visualLanguage';

export const CLAUDE_MOTION_PROOF_ID = 'KI-Claude-Motion-Proof-15s';
export const CLAUDE_MOTION_PROOF_FPS = 30;
export const CLAUDE_MOTION_PROOF_WIDTH = 1920;
export const CLAUDE_MOTION_PROOF_HEIGHT = 1080;
export const CLAUDE_MOTION_PROOF_FRAMES = 450;

const p = (frame: number, a: number, b: number, ease: 'enter'|'enterEmphasis'|'move' = 'enter') =>
  easedProgress(frame, a, b, ease);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (f: number, a: number, b: number) => p(f, a, b);
const font = V.typography.display;
const ink = V.colors.ink;
const purple = V.colors.purple;
const lightPurple = V.colors.purpleLight;
const paper = V.colors.surface;

const StageTag: React.FC<{number: string;label: string;dark?: boolean}> = ({number,label,dark=false}) => (
  <div style={{position:'absolute',top:62,left:88,display:'flex',alignItems:'center',gap:24,zIndex:50}}>
    <span style={{fontFamily:font,fontWeight:850,fontSize:24,letterSpacing:1.6,color:dark?'#B98CFF':purple}}>{number}</span>
    <span style={{width:64,height:2,background:dark?'#A78BFA':purple,opacity:.55}}/>
    <span style={{fontFamily:font,fontWeight:650,letterSpacing:3.6,fontSize:19,color:dark?'#D7CBEF':'#6A6680'}}>{label}</span>
  </div>
);

const PromptScene: React.FC = () => {
  const f=useCurrentFrame();
  const thrust=p(f,30,106,'enterEmphasis');
  const e=p(f,15,34);
  const button=p(f,58,76,'enterEmphasis');
  return <AbsoluteFill style={{background:paper,color:ink,overflow:'hidden'}}>
    <div style={{position:'absolute',right:-240,top:-360,width:1150,height:1150,borderRadius:999,background:'radial-gradient(circle, rgba(172,138,255,.20), transparent 68%)'}}/>
    <StageTag number="01" label="DIE EINGABE"/>
    <div style={{position:'absolute',left:88,top:275,width:610,transform:`translateY(${-34*thrust}px)`}}>
      <div style={{fontFamily:font,fontWeight:850,fontSize:116,lineHeight:.94,letterSpacing:-6}}>EIN<br/><span style={{color:purple}}>PROMPT.</span></div>
      <div style={{height:5,width:lerp(65,360,p(f,22,76)),background:purple,marginTop:40,borderRadius:99}}/>
      <p style={{fontSize:32,lineHeight:1.35,fontWeight:500,color:'#66677C',width:500,marginTop:34}}>Eine Idee. Noch keine funktionierende Software.</p>
    </div>
    <div style={{
      position:'absolute',left:790,top:178,width:1055,height:724,background:'#151725',
      border:'1px solid #41425D',boxShadow:'0 44px 110px rgba(44,37,90,.24)',borderRadius:28,overflow:'hidden',
      transform:`perspective(1600px) rotateY(${lerp(-11,-2,e)}deg) rotateX(${lerp(4,0,thrust)}deg) translateX(${-220*thrust}px) scale(${lerp(.93,1.12,thrust)})`
    }}>
      <div style={{height:69,borderBottom:'1px solid #383951',display:'flex',alignItems:'center',padding:'0 32px',gap:12}}>
        {['#EF6A7B','#F2BC6B','#73D4A0'].map((c,i)=><span key={i} style={{width:14,height:14,background:c,borderRadius:99}}/>)}
        <span style={{fontSize:17,color:'#A1A2BC',marginLeft:26,fontFamily:'monospace'}}>workspace / prompt</span>
      </div>
      <div style={{margin:50,position:'relative',height:525}}>
        <div style={{fontFamily:font,color:'#E9E8FC',fontWeight:700,fontSize:46,lineHeight:1.24,letterSpacing:-1.6}}>Baue eine App, die<br/>meine Aufgaben organisiert.</div>
        <div style={{marginTop:42,display:'flex',gap:14,opacity:lerp(.5,1,e)}}>
          {['Aufgaben','Kalender','Status'].map(t=><span key={t} style={{fontSize:22,color:'#AB9EEB',border:'1px solid #6652A8',padding:'13px 20px',borderRadius:12}}>{t}</span>)}
        </div>
        <div style={{position:'absolute',bottom:4,right:6,background:purple,color:'#FFF',display:'flex',alignItems:'center',gap:16,borderRadius:17,padding:'22px 34px',fontSize:25,fontWeight:750,transform:`scale(${1+.12*button})`,boxShadow:`0 0 ${lerp(0,56,button)}px rgba(176,116,255,.6)`}}>STARTEN <span style={{fontSize:35}}>↗</span></div>
      </div>
    </div>
    <div style={{position:'absolute',left:685,top:650,width:lerp(0,230,p(f,70,104)),height:7,background:'linear-gradient(90deg,transparent,#B98CFF)',borderRadius:40,boxShadow:'0 0 28px #B98CFF'}}/>
  </AbsoluteFill>;
};

const CoreScene: React.FC = () => {
  const f=useCurrentFrame();
  const appear=p(f,2,24,'enterEmphasis');
  const separate=p(f,22,76,'move');
  const organize=p(f,75,113,'enterEmphasis');
  const r=190+90*separate;
  return <AbsoluteFill style={{background:'#10121D',overflow:'hidden',color:'#F5F5FF'}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 52% 46%, rgba(121,85,235,.31), transparent 53%)'}}/>
    <StageTag number="02" label="DIE TRANSFORMATION" dark/>
    <div style={{position:'absolute',top:199,left:96,fontFamily:font,fontSize:84,fontWeight:830,lineHeight:1,letterSpacing:-4}}>AUS TEXT<br/><span style={{color:'#B998FF'}}>WIRD SYSTEM.</span></div>
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0}}>
      <defs>
        <radialGradient id="proof-core">
          <stop stopColor="#D7BEFF"/><stop offset=".45" stopColor="#8154EA"/><stop offset="1" stopColor="#36205C"/>
        </radialGradient>
        <linearGradient id="proof-line" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A58CF7" stopOpacity=".08"/><stop offset=".5" stopColor="#9B79FA"/><stop offset="1" stopColor="#C9A3FF" stopOpacity=".85"/>
        </linearGradient>
      </defs>
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{
        const angle=(Math.PI*2*i)/12-.25;
        const x=1125+Math.cos(angle)*(r+240);
        const y=542+Math.sin(angle)*(r+144);
        const t=p(f,16+i*3,66+i*3);
        return <g key={i}>
          <path d={`M1125 542 Q${1125+Math.cos(angle)*(r*.55)} ${542+Math.sin(angle)*(r*.75)} ${x} ${y}`} fill="none" stroke="url(#proof-line)" strokeWidth={1.6+1.7*t} strokeDasharray="14 9" opacity={appear}/>
          <rect x={lerp(1125,x,t)-35} y={lerp(542,y,t)-19} width={70} height={38} rx={9} fill={i%3===0?'#B89AFF':'#2D254B'} stroke="#9977E1" strokeWidth="2" opacity={appear}/>
          <rect x={lerp(1125,x,t)-22} y={lerp(542,y,t)-3} width={44} height={6} rx={3} fill={i%3===0?'#36234F':'#9C8CD7'} opacity={appear}/>
        </g>;
      })}
      <circle cx="1125" cy="542" r={215+21*Math.sin(separate*Math.PI)} stroke="#C7A7FF" strokeOpacity={.2+.24*organize} strokeWidth="3" fill="none" />
      <circle cx="1125" cy="542" r={157+25*appear} stroke="#C7A7FF" strokeOpacity={.52} strokeWidth="3" fill="none" strokeDasharray="8 16"/>
      <circle cx="1125" cy="542" r={lerp(78,156,appear)} fill="url(#proof-core)" stroke="#CDB8FF" strokeWidth="5"/>
      <path d="M1060 542 L1115 597 L1202 489" fill="none" stroke="#F6F0FF" strokeWidth={lerp(0,13,organize)} strokeLinecap="round" strokeLinejoin="round" opacity={organize}/>
      <circle cx="1125" cy="542" r={lerp(0,36,organize)} fill="#EADAFE" opacity={.4*(1-organize)}/>
      <path d={`M175 807 L${lerp(175,810,separate)} 807`} stroke="#AA83FA" strokeWidth="7" fill="none" strokeLinecap="round"/>
    </svg>
    <div style={{position:'absolute',right:145,bottom:84,color:'#B5A5DA',fontSize:25,letterSpacing:4}}>PLANEN  ·  PRÜFEN  ·  AUSFÜHREN</div>
  </AbsoluteFill>;
};

const AppScene:React.FC=()=>{
  const f=useCurrentFrame();
  const build=p(f,5,48,'enterEmphasis');
  const fill=p(f,37,85,'move');
  const chart=p(f,52,112,'enterEmphasis');
  return <AbsoluteFill style={{background:'#F2F2F8',color:ink,overflow:'hidden'}}>
    <StageTag number="03" label="DIE UMSETZUNG"/>
    <div style={{position:'absolute',right:86,top:85,fontSize:26,color:'#756C8D',letterSpacing:2}}>AUS PLAN WIRD PRODUKT</div>
    <div style={{position:'absolute',top:180,left:104,width:1710,height:761,background:'#FFF',borderRadius:28,
      border:'1px solid #DFDDEC',boxShadow:'0 55px 95px rgba(32,24,71,.19)',overflow:'hidden',
      transform:`perspective(1900px) rotateX(${lerp(10,0,build)}deg) scale(${lerp(.78,1,build)}) translateY(${lerp(130,0,build)}px)`,
      opacity:Math.max(.3,build)}}>
      <div style={{height:77,background:'#F9F9FC',borderBottom:'1px solid #E8E7F0',display:'flex',alignItems:'center',paddingLeft:38,gap:14}}>
        {['#E4A5AF','#EAD29B','#9FD5C0'].map((color,i)=><span key={i} style={{width:14,height:14,borderRadius:99,background:color}}/>)}
        <span style={{fontSize:22,fontWeight:800,color:purple,marginLeft:45}}>FLOWBOARD</span>
        <span style={{fontSize:18,color:'#9A97AD',marginLeft:'auto',marginRight:48}}>Workspace · Demo</span>
      </div>
      <div style={{display:'flex',height:'calc(100% - 77px)'}}>
        <div style={{width:295,background:'#F8F7FC',borderRight:'1px solid #ECEBF4',padding:'45px 30px',fontSize:23}}>
          <div style={{padding:'20px 25px',borderRadius:12,background:'#EBE5FB',color:purple,fontWeight:800}}>Übersicht</div>
          {['Aufgaben','Kalender','Berichte'].map((x,i)=><div key={x} style={{padding:'24px 25px',color:'#6D7086',opacity:p(f,24+i*6,44+i*6)}}>{x}</div>)}
        </div>
        <div style={{flex:1,padding:'54px 65px'}}>
          <div style={{fontFamily:font,fontSize:65,fontWeight:850,letterSpacing:-2.7}}>Dein Überblick</div>
          <div style={{fontSize:24,marginTop:5,color:'#9192A4'}}>Aufgaben werden strukturiert, statt vergessen.</div>
          <div style={{display:'flex',gap:30,marginTop:40}}>
            {[['OFFEN','12'],['IN ARBEIT','04'],['ERLEDIGT','18']].map(([label,value],i)=>(
              <div key={label} style={{width:350,height:132,borderRadius:17,background:i===2?'#ECF8F2':'#F6F3FD',padding:'22px 30px',transform:`translateY(${lerp(80,0,p(f,38+i*8,65+i*8))}px)`,opacity:p(f,32+i*8,58+i*8)}}>
                <div style={{fontSize:16,letterSpacing:2,fontWeight:700,color:'#86849B'}}>{label}</div>
                <div style={{fontSize:58,fontWeight:850,letterSpacing:-2.5,color:i===2?'#1D8B67':purple}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:35,marginTop:38}}>
            <div style={{width:770,height:236,background:'#F8F8FD',borderRadius:20,padding:'20px 30px'}}>
              <div style={{fontSize:20,fontWeight:750,color:'#62617C'}}>Aktivität</div>
              <svg viewBox="0 0 700 175" width="700" height="175">
                <path d="M5 143 L120 119 L210 129 L318 66 L432 85 L541 25 L690 5" stroke="#8155DC" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="1000" strokeDashoffset={1000*(1-chart)}/>
                <path d="M5 143 L120 119 L210 129 L318 66 L432 85 L541 25 L690 5 L690 174 L5 174 Z" fill="#C7B0F9" opacity={.15*chart}/>
              </svg>
            </div>
            <div style={{flex:1,padding:'28px 24px',background:'#EDF9F2',borderRadius:20,transform:`scale(${lerp(.8,1,fill)})`,opacity:fill}}>
              <div style={{fontSize:22,color:'#197452',fontWeight:700}}>Prüfstatus</div>
              <div style={{fontSize:42,fontWeight:850,color:'#218460',marginTop:35}}>Bereit ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{position:'absolute',height:9,width:lerp(0,900,p(f,0,118)),left:88,bottom:70,background:'linear-gradient(90deg,#6E45C9,#B98CFF)',borderRadius:50}}/>
  </AbsoluteFill>;
};

const ValidateScene:React.FC=()=>{
  const f=useCurrentFrame();
  const arrival=p(f,0,26,'enterEmphasis');
  const close=p(f,24,78,'move');
  const reveal=p(f,60,100,'enterEmphasis');
  const outro=p(f,90,110);
  return <AbsoluteFill style={{background:'#12131A',color:'#F8F8FC',overflow:'hidden'}}>
    <div style={{position:'absolute',left:950,top:250,width:1000,height:1000,borderRadius:999,background:'radial-gradient(circle,#1F674F33,transparent 62%)'}}/>
    <StageTag number="04" label="DAS ERGEBNIS" dark/>
    <div style={{position:'absolute',left:85,top:300,fontFamily:font,fontWeight:850,fontSize:115,lineHeight:.99,letterSpacing:-6,opacity:arrival}}>
      AUS IDEE<br/><span style={{color:'#B89FFF'}}>WIRD EIN<br/>PRODUKT.</span>
    </div>
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',top:0}}>
      <defs><linearGradient id="validate" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#99F1BD"/><stop offset="1" stopColor="#30AD78"/></linearGradient></defs>
      <circle cx="1380" cy="510" r={lerp(205,250,close)} fill="#1C3930" stroke="#346F57" strokeWidth="4" opacity={arrival}/>
      <circle cx="1380" cy="510" r="208" fill="none" stroke="url(#validate)" strokeWidth="17" strokeDasharray="1310" strokeDashoffset={1310*(1-close)} strokeLinecap="round" transform="rotate(-90 1380 510)"/>
      <path d="M1268 502 L1340 577 L1500 409" fill="none" stroke="#A8F5CB" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="470" strokeDashoffset={470*(1-reveal)}/>
      {[0,1,2,3].map(i=>{const angle=(Math.PI/2)*i+.4;const dist=lerp(170,360,close);return <circle key={i} cx={1380+Math.cos(angle)*dist} cy={510+Math.sin(angle)*dist} r={8+5*close} fill="#73DAB0" opacity={.2+.8*close}/>})}
    </svg>
    <div style={{position:'absolute',left:92,bottom:125,width:970,height:80,fontSize:32,fontWeight:700,color:'#A7C7B8',opacity:reveal}}>
      GEPLANT <span style={{color:'#69D4A2'}}>→</span> GEBAUT <span style={{color:'#69D4A2'}}>→</span> GEPRÜFT
    </div>
    <div style={{position:'absolute',left:90,bottom:80,height:5,width:lerp(0,900,outro),borderRadius:50,background:'#71DCAE',opacity:outro}}/>
  </AbsoluteFill>;
};

export const ClaudeMotionProof:React.FC=()=>{
  return <AbsoluteFill style={{width:1920,height:1080,fontFamily:font,overflow:'hidden'}}>
    <Sequence from={0} durationInFrames={125}><PromptScene/></Sequence>
    <Sequence from={108} durationInFrames={135}><CoreScene/></Sequence>
    <Sequence from={227} durationInFrames={126}><AppScene/></Sequence>
    <Sequence from={340} durationInFrames={110}><ValidateScene/></Sequence>
  </AbsoluteFill>;
};
