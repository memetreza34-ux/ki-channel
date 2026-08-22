import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const font = 'Inter, Arial, sans-serif';
const purple = BRAND.accentDk;
const light = BRAND.accent;
const ink = BRAND.ink;
const green = '#238A68';
const red = '#C85161';
const blue = '#4778D0';
const amber = '#C98728';
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const p = (frame:number,a:number,b:number) => interpolate(frame,[a,b],[0,1],clamp);

const GlowGrid: React.FC<{speed?:number}> = ({speed=1}) => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',inset:-120,transform:`translate3d(${Math.sin(frame/45)*18*speed}px,${(frame*0.35*speed)%72}px,0) scale(1.08)`,background:'linear-gradient(rgba(110,69,201,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.05) 1px,transparent 1px)',backgroundSize:'72px 72px',maskImage:'radial-gradient(circle at 50% 45%,black 15%,transparent 70%)'}}/>;
};

const BrandWord: React.FC<{scale?:number}> = ({scale=1}) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame/11)*.015;
  return <div style={{fontFamily:font,fontSize:78*scale,fontWeight:950,letterSpacing:-3*scale,color:ink,transform:`scale(${breathe})`,textShadow:'0 16px 44px rgba(30,24,45,.13)'}}>ChatGPT</div>;
};

const ChatBubble: React.FC<{children:React.ReactNode;ad?:boolean;style?:React.CSSProperties}> = ({children,ad=false,style}) => (
  <div style={{borderRadius:32,padding:'28px 34px',background:ad?'linear-gradient(135deg,#FFF9EE,#FFF3DA)':'#FFFFFF',border:`2px solid ${ad?'rgba(201,135,40,.35)':'rgba(110,69,201,.14)'}`,boxShadow:'0 24px 70px rgba(32,24,55,.12)',fontFamily:font,fontSize:30,fontWeight:800,color:ink,...style}}>
    {ad && <div style={{fontSize:20,fontWeight:950,letterSpacing:2,color:amber,marginBottom:10}}>GESPONSERT</div>}
    {children}
  </div>
);

export const LaunchVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = spring({frame:frame-2,fps,config:{damping:16,stiffness:120}});
  const germany = spring({frame:frame-42,fps,config:{damping:15,stiffness:130}});
  const date = spring({frame:frame-82,fps,config:{damping:14,stiffness:160}});
  const chat = spring({frame:frame-132,fps,config:{damping:17,stiffness:125}});
  const ad = spring({frame:frame-210,fps,config:{damping:13,stiffness:165}});
  return <AbsoluteFill style={{fontFamily:font}}>
    <GlowGrid speed={1.2}/>
    <div style={{position:'absolute',left:80,right:80,top:80,height:330,display:'flex',alignItems:'center',justifyContent:'space-between',transform:`scale(${.88+.12*brand})`,opacity:brand}}>
      <BrandWord scale={1.05}/>
      <div style={{width:210,height:210,borderRadius:'50%',background:'radial-gradient(circle,#F5ECFF,#D8C2FF)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 30px 70px rgba(110,69,201,.22)',transform:`rotate(${(1-germany)*-18}deg) scale(${.7+.3*germany})`}}>
        <div style={{fontSize:74,fontWeight:950,color:purple}}>DE</div>
      </div>
    </div>
    <div style={{position:'absolute',left:92,top:365,transform:`translateY(${(1-date)*45}px) rotate(${(1-date)*-5}deg) scale(${.82+.18*date})`,opacity:date,padding:'18px 28px',borderRadius:20,background:ink,color:'#fff',fontSize:34,fontWeight:950,letterSpacing:2,boxShadow:'0 18px 36px rgba(20,20,35,.18)'}}>24 AUG 2026</div>
    <div style={{position:'absolute',left:70,right:70,top:500,height:520,transform:`perspective(1000px) translateY(${(1-chat)*170}px) rotateX(${(1-chat)*18}deg) scale(${.88+.12*chat})`,opacity:chat}}>
      <ChatBubble style={{position:'absolute',left:35,right:35,top:0,height:150}}>Hier ist eine hilfreiche ChatGPT-Antwort …</ChatBubble>
      <div style={{position:'absolute',left:500,top:150,width:4,height:80,background:`linear-gradient(${purple},transparent)`,opacity:p(frame,178,228)}}/>
      <ChatBubble ad style={{position:'absolute',left:105,right:105,top:230,height:175,transform:`translateY(${(1-ad)*120}px) scale(${.9+.1*ad})`,opacity:ad}}>Passende Anzeige im Chat</ChatBubble>
    </div>
  </AbsoluteFill>;
};

export const SeparationVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const split = spring({frame:frame-30,fps:30,config:{damping:16,stiffness:130}});
  const badge = spring({frame:frame-92,fps:30,config:{damping:13,stiffness:170}});
  const arrow = p(frame,140,205);
  const impact = spring({frame:frame-205,fps:30,config:{damping:12,stiffness:180}});
  return <AbsoluteFill style={{fontFamily:font}}>
    <GlowGrid speed={.8}/>
    <div style={{position:'absolute',left:70,right:70,top:130,bottom:120}}>
      <div style={{position:'absolute',left:0,right:0,top:65,transform:`translateY(${-90*split}px)`}}><ChatBubble>CHATGPT-ANTWORT</ChatBubble></div>
      <div style={{position:'absolute',left:80,right:80,top:430,transform:`translateY(${110*split}px)`}}><ChatBubble ad><span style={{opacity:badge}}>WERBUNG</span></ChatBubble></div>
      <div style={{position:'absolute',left:30,right:30,top:345,height:7,borderRadius:999,background:`linear-gradient(90deg,transparent,${purple},transparent)`,boxShadow:`0 0 ${30+30*split}px rgba(110,69,201,.35)`,opacity:split}}/>
      <div style={{position:'absolute',right:100,top:290,padding:'14px 20px',borderRadius:16,background:'#FFF7E8',border:'2px solid rgba(201,135,40,.4)',color:amber,fontSize:24,fontWeight:950,transform:`scale(${.7+.3*badge}) rotate(${(1-badge)*8}deg)`,opacity:badge}}>GESPONSERT</div>
      <div style={{position:'absolute',left:250,top:520,width:580,height:10,borderRadius:999,background:'#E7E2ED',transform:'rotate(-22deg)',transformOrigin:'left center',overflow:'visible',opacity:arrow}}>
        <div style={{width:`${arrow*88}%`,height:'100%',borderRadius:999,background:red,boxShadow:'0 0 28px rgba(200,81,97,.3)'}}/>
        <div style={{position:'absolute',right:50,top:-28,width:68,height:68,borderRadius:'50%',background:'#FFF3F5',border:`4px solid ${red}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,fontWeight:950,color:red,transform:`scale(${.6+.4*impact})`}}>×</div>
      </div>
      <div style={{position:'absolute',left:120,right:120,bottom:40,textAlign:'center',fontSize:38,fontWeight:950,color:purple,opacity:p(frame,205,255),transform:`translateY(${(1-p(frame,205,255))*24}px)`}}>ANTWORT BLEIBT GETRENNT</div>
    </div>
  </AbsoluteFill>;
};

export const PlansVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const plans = ['FREE','GO','PLUS','PRO','ENTERPRISE'];
  const carousel = p(frame,0,85);
  const flip = p(frame,90,165);
  const toggle = spring({frame:frame-205,fps:30,config:{damping:15,stiffness:150}});
  const limit = p(frame,235,315);
  return <AbsoluteFill style={{fontFamily:font}}>
    <GlowGrid speed={1}/>
    <div style={{position:'absolute',left:30,right:30,top:120,height:610,display:'flex',alignItems:'center',justifyContent:'center',gap:18,perspective:1000}}>
      {plans.map((name,i)=>{
        const isAd=i<2; const x=(i-2)*182; const z=Math.abs(i-2); const local=Math.max(0,Math.min(1,carousel*1.4-i*.08));
        return <div key={name} style={{position:'absolute',width:170,height:250,borderRadius:30,background:isAd?'linear-gradient(180deg,#FFF9ED,#FFF2D5)':'linear-gradient(180deg,#FFFFFF,#F6F2FC)',border:`2px solid ${isAd?'rgba(201,135,40,.35)':'rgba(110,69,201,.18)'}`,boxShadow:'0 28px 65px rgba(35,24,60,.13)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:22,transform:`translateX(${x*local}px) translateZ(${-z*60}px) rotateY(${(1-local)*(i<2?-28:28)}deg) scale(${.65+.35*local})`,opacity:local}}>
          <div style={{fontSize:27,fontWeight:950,color:ink}}>{name}</div>
          <div style={{padding:'9px 13px',borderRadius:999,background:isAd?'#FFF0C8':'#EEE7FA',color:isAd?amber:purple,fontSize:18,fontWeight:950,transform:`scale(${.9+.1*flip})`}}>{isAd?'ADS':'AD-FREE'}</div>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',left:150,right:150,top:780,height:260,borderRadius:40,background:'#fff',border:'1px solid rgba(110,69,201,.16)',boxShadow:'0 26px 70px rgba(35,24,60,.12)',padding:34,opacity:toggle,transform:`translateY(${(1-toggle)*70}px) scale(${.9+.1*toggle})`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontSize:29,fontWeight:950}}>FREE: Werbung</div><div style={{width:110,height:56,borderRadius:999,background:'#DDD5E8',padding:6,display:'flex',justifyContent:'flex-start'}}><div style={{width:44,height:44,borderRadius:'50%',background:'#fff',boxShadow:'0 5px 14px rgba(0,0,0,.18)',transform:`translateX(${toggle>.8?0:48}px)`}}/></div></div>
      <div style={{marginTop:38,fontSize:22,fontWeight:850,color:'#777181'}}>NUTZUNGSLIMIT</div>
      <div style={{height:17,borderRadius:999,background:'#ECE8F1',marginTop:14,overflow:'hidden'}}><div style={{height:'100%',width:`${100-50*limit}%`,background:`linear-gradient(90deg,${purple},${light})`}}/></div>
    </div>
  </AbsoluteFill>;
};

export const PrivacyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const core = spring({frame:frame-20,fps:30,config:{damping:17}});
  const advertiser = spring({frame:frame-105,fps:30,config:{damping:17}});
  const wall = spring({frame:frame-165,fps:30,config:{damping:14,stiffness:165}});
  const pass = p(frame,220,300);
  const packets = ['THEMA','CHATS','AD-KLICKS'];
  return <AbsoluteFill style={{fontFamily:font}}>
    <GlowGrid speed={1.1}/>
    <div style={{position:'absolute',left:55,right:55,top:120,bottom:110}}>
      <div style={{position:'absolute',left:80,top:220,width:330,height:330,borderRadius:'50%',background:`radial-gradient(circle,#fff 0%,${light}66 40%,${purple} 100%)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 35px 80px rgba(110,69,201,.25)',transform:`scale(${.75+.25*core})`,opacity:core}}><div style={{fontSize:34,fontWeight:950,color:ink,textAlign:'center'}}>RELEVANZ<br/>ENGINE</div></div>
      {packets.map((t,i)=>{const q=p(frame,30+i*40,115+i*40);return <div key={t} style={{position:'absolute',left:20+q*130,top:110+i*165,padding:'16px 22px',borderRadius:18,background:'#fff',border:'2px solid rgba(110,69,201,.18)',fontSize:21,fontWeight:950,color:purple,boxShadow:'0 15px 35px rgba(35,24,60,.10)',opacity:q}}>{t}</div>})}
      <div style={{position:'absolute',right:40,top:245,width:290,height:210,borderRadius:36,background:'#F8F8FA',border:'2px solid rgba(30,30,45,.14)',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:27,fontWeight:950,color:ink,opacity:advertiser,transform:`translateX(${(1-advertiser)*100}px)`}}>WERBE-<br/>TREIBENDER</div>
      <div style={{position:'absolute',left:500,top:90,width:18,height:650,borderRadius:999,background:`linear-gradient(180deg,${purple},#39206F)`,boxShadow:'0 0 0 12px rgba(110,69,201,.08),0 0 45px rgba(110,69,201,.25)',transform:`scaleY(${wall})`,transformOrigin:'center',opacity:wall}}/>
      <div style={{position:'absolute',left:375,top:625,padding:'12px 18px',borderRadius:14,background:'#FFF1F4',color:red,fontSize:22,fontWeight:950,opacity:wall}}>ROHE CHATS ✕</div>
      {['VIEWS','KLICKS'].map((t,i)=> <div key={t} style={{position:'absolute',left:480+pass*(180+i*80),top:520+i*70,padding:'11px 16px',borderRadius:14,background:'#ECF8F3',color:green,fontSize:20,fontWeight:950,opacity:pass}}>{t}</div>)}
    </div>
  </AbsoluteFill>;
};

export const ChannelVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const hub = spring({frame:frame-28,fps:30,config:{damping:16,stiffness:120}});
  const orbit = p(frame,60,170);
  const market = spring({frame:frame-185,fps:30,config:{damping:13,stiffness:150}});
  const end = p(frame,240,320);
  const labels=['VERGLEICHEN','PLANEN','ENTSCHEIDEN'];
  return <AbsoluteFill style={{fontFamily:font}}>
    <GlowGrid speed={1.35}/>
    <div style={{position:'absolute',left:80,right:80,top:100,height:820,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:350,height:350,borderRadius:'50%',background:`radial-gradient(circle at 35% 30%,#fff,${light}77 40%,${purple})`,boxShadow:'0 40px 95px rgba(110,69,201,.28)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:`scale(${.7+.3*hub}) rotate(${(1-hub)*-8}deg)`,opacity:hub}}><BrandWord scale={.52}/><div style={{marginTop:8,fontSize:29,fontWeight:950,color:'#fff'}}>ADS</div></div>
      {labels.map((t,i)=>{const angle=(frame*.012)+(i*Math.PI*2/3); const radius=270*orbit; return <div key={t} style={{position:'absolute',left:410+Math.cos(angle)*radius,top:380+Math.sin(angle)*radius,padding:'15px 22px',borderRadius:18,background:'#fff',border:'2px solid rgba(110,69,201,.16)',boxShadow:'0 18px 40px rgba(35,24,60,.12)',fontSize:21,fontWeight:950,color:purple,transform:'translate(-50%,-50%)'}}>{t}</div>})}
      <div style={{position:'absolute',left:65,top:650,fontSize:30,fontWeight:900,color:'#777181',opacity:market}}>EUROPA</div>
      <div style={{position:'absolute',right:65,top:625,padding:'24px 32px',borderRadius:26,background:ink,color:'#fff',fontSize:50,fontWeight:950,letterSpacing:-1,transform:`scale(${.72+.28*market}) rotate(${(1-market)*5}deg)`,opacity:market,boxShadow:'0 24px 60px rgba(20,20,35,.22)'}}>31 MÄRKTE</div>
      <div style={{position:'absolute',left:120,right:120,bottom:-20,textAlign:'center',fontSize:36,fontWeight:950,color:purple,opacity:end,transform:`translateY(${(1-end)*24}px)`}}>WERBUNG AM ENTSCHEIDUNGSMOMENT</div>
    </div>
  </AbsoluteFill>;
};
