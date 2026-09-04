import React, {type CSSProperties} from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  CircleCheck,
  Copy,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Sparkles,
  TimerReset,
  X,
} from 'lucide-react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {STUDY_PALETTE as C} from './contract';

const p = (frame:number, from:number, to:number) => interpolate(frame,[from,to],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

const Panel: React.FC<{children:React.ReactNode;style?:CSSProperties}> = ({children,style}) => (
  <div style={{background:'rgba(255,255,255,.94)',border:'1px solid rgba(16,32,51,.10)',borderRadius:34,boxShadow:'0 28px 80px rgba(16,32,51,.15)',...style}}>{children}</div>
);

const Pill: React.FC<{children:React.ReactNode;bg:string;color?:string;style?:CSSProperties}> = ({children,bg,color=C.ink,style}) => (
  <div style={{display:'inline-flex',alignItems:'center',gap:9,padding:'10px 16px',borderRadius:999,background:bg,color,fontSize:24,fontWeight:850,letterSpacing:-.4,...style}}>{children}</div>
);

const ChatBubble: React.FC<{children:React.ReactNode;side?:'user'|'assistant';accent?:string;style?:CSSProperties}> = ({children,side='assistant',accent=C.cyan,style}) => (
  <div style={{alignSelf:side==='user'?'flex-end':'flex-start',maxWidth:'84%',padding:'18px 22px',borderRadius:side==='user'?'24px 24px 7px 24px':'24px 24px 24px 7px',background:side==='user'?accent:C.white,color:side==='user'?C.white:C.ink,border:side==='assistant'?'1px solid rgba(16,32,51,.08)':'none',boxShadow:'0 12px 28px rgba(16,32,51,.10)',fontSize:27,lineHeight:1.25,fontWeight:680,...style}}>{children}</div>
);

const AppTopBar: React.FC<{mode?:string;accent?:string}> = ({mode='ChatGPT',accent=C.graphite}) => (
  <div style={{height:82,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',borderBottom:'1px solid rgba(16,32,51,.08)',background:'rgba(255,255,255,.96)'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:42,height:42,borderRadius:14,display:'grid',placeItems:'center',background:C.graphite,color:C.white}}><Sparkles size={23}/></div>
      <div style={{fontSize:30,fontWeight:920,letterSpacing:-1.1,color:C.ink}}>ChatGPT</div>
    </div>
    <Pill bg={`${accent}18`} color={accent}>{mode}</Pill>
  </div>
);

const Phone: React.FC<{children:React.ReactNode;style?:CSSProperties}> = ({children,style}) => (
  <div style={{width:700,height:1010,borderRadius:64,padding:15,background:'#101827',boxShadow:'0 48px 120px rgba(15,23,42,.32)',...style}}>
    <div style={{height:'100%',borderRadius:49,overflow:'hidden',background:'#F8FAFC',position:'relative'}}>{children}</div>
  </div>
);

export const StudySwitchVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:17,stiffness:115}});
  const answer=p(frame,35,105);
  const stop=p(frame,120,185);
  const study=p(frame,175,255);
  const features=p(frame,245,360);
  const tilt=interpolate(study,[0,1],[-4,1.5]);
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 16% 14%,${C.yellowSoft},transparent 28%),radial-gradient(circle at 86% 28%,${C.cyanSoft},transparent 38%),linear-gradient(145deg,#F8FBFF,#EAF8FB)`,overflow:'hidden'}}>
      <div style={{position:'absolute',width:470,height:470,borderRadius:'50%',right:-130,top:520,background:C.cyan,opacity:.08}}/>
      <Phone style={{position:'absolute',left:190,top:255,transform:`translateY(${(1-enter)*80}px) rotate(${tilt}deg) scale(${.90+enter*.10})`}}>
        <AppTopBar mode={study>.55?'STUDY MODE':'STANDARD'} accent={study>.55?C.green:C.graphite}/>
        <div style={{padding:30,height:'calc(100% - 82px)',display:'flex',flexDirection:'column',gap:18,position:'relative'}}>
          <ChatBubble side="user" accent={C.blue}>Löse diese Aufgabe für mich.</ChatBubble>
          <div style={{position:'relative',minHeight:130}}>
            <ChatBubble style={{opacity:answer*(1-stop*.75),transform:`translateY(${(1-answer)*20}px)`}}>Die fertige Lösung ist …</ChatBubble>
            <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',opacity:stop}}>
              <Pill bg={C.redSoft} color={C.red}><X size={28}/>Nicht nur vorsagen</Pill>
            </div>
          </div>
          <div style={{height:74,borderRadius:24,border:`2px solid ${study>.5?C.green:'#CBD5E1'}`,background:C.white,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 21px',transform:`scale(${.96+study*.04})`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,fontSize:27,fontWeight:900,color:C.ink}}><GraduationCap color={C.green} size={31}/>Study Mode</div>
            <div style={{width:118,height:48,borderRadius:999,background:study>.5?C.green:'#CBD5E1',padding:5,position:'relative'}}><div style={{position:'absolute',top:5,left:5+study*70,width:38,height:38,borderRadius:'50%',background:C.white,boxShadow:'0 4px 12px rgba(0,0,0,.16)'}}/></div>
          </div>
          <div style={{marginTop:8,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,opacity:features,transform:`translateY(${(1-features)*36}px)`}}>
            {[{label:'Fragen',c:C.cyan,i:<HelpCircle size={28}/>},{label:'Schritte',c:C.green,i:<BookOpenCheck size={28}/>},{label:'Check',c:C.purple,i:<CircleCheck size={28}/>}].map((item)=><div key={item.label} style={{height:112,borderRadius:25,background:`${item.c}13`,border:`1px solid ${item.c}35`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,color:item.c,fontSize:24,fontWeight:900}}>{item.i}{item.label}</div>)}
          </div>
          <div style={{marginTop:'auto',height:64,borderRadius:22,background:C.greenSoft,color:C.green,display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:25,fontWeight:900,opacity:study}}><BrainCircuit size={29}/>VERSTEHEN STATT NUR KOPIEREN</div>
        </div>
      </Phone>
      <div style={{position:'absolute',left:70,top:1350,opacity:p(frame,270,360),transform:`translateY(${(1-p(frame,270,360))*35}px)`}}><Pill bg={C.graphite} color={C.white}><Sparkles size={27}/>STUDY MODE AKTIV</Pill></div>
    </AbsoluteFill>
  );
};

export const InstantAnswerVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const prompt=p(frame,15,60);
  const answer=p(frame,55,145);
  const speed=p(frame,115,205);
  const learn=p(frame,190,300);
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 80% 18%,${C.orangeSoft},transparent 30%),linear-gradient(150deg,#FFFDF8,#F5F8FC)`,overflow:'hidden'}}>
      <div style={{position:'absolute',left:58,right:58,top:265,bottom:480,display:'grid',gridTemplateColumns:'1.08fr .92fr',gap:26}}>
        <Panel style={{padding:24,overflow:'hidden'}}>
          <AppTopBar mode="STANDARD" accent={C.orange}/>
          <div style={{padding:'26px 6px',display:'flex',flexDirection:'column',gap:18}}>
            <ChatBubble side="user" accent={C.orange} style={{opacity:prompt,transform:`translateX(${(1-prompt)*80}px)`}}>Was ist 3x + 5 = 20?</ChatBubble>
            <ChatBubble style={{opacity:answer,transform:`translateY(${(1-answer)*28}px)`}}>3x = 15 → x = 5.</ChatBubble>
            <Pill bg={C.orangeSoft} color={C.orange} style={{alignSelf:'flex-start',opacity:speed}}><TimerReset size={28}/>SOFORTANTWORT</Pill>
          </div>
        </Panel>
        <div style={{display:'flex',flexDirection:'column',gap:22}}>
          <Panel style={{flex:1,padding:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontSize:25,fontWeight:850,color:'#64748B'}}>Geschwindigkeit</div>
            <div style={{fontSize:66,fontWeight:950,letterSpacing:-3,color:C.orange,marginTop:12}}>SCHNELL</div>
            <div style={{height:18,borderRadius:999,background:'#E8EDF3',marginTop:26,overflow:'hidden'}}><div style={{height:'100%',width:`${speed*94}%`,background:C.orange,borderRadius:999}}/></div>
          </Panel>
          <Panel style={{flex:1,padding:28,display:'flex',flexDirection:'column',justifyContent:'center',border:`2px solid ${C.red}35`}}>
            <div style={{fontSize:25,fontWeight:850,color:'#64748B'}}>Eigenes Verständnis</div>
            <div style={{fontSize:62,fontWeight:950,letterSpacing:-3,color:C.red,marginTop:12}}>NIEDRIG</div>
            <div style={{height:18,borderRadius:999,background:'#E8EDF3',marginTop:26,overflow:'hidden'}}><div style={{height:'100%',width:`${10+learn*18}%`,background:C.red,borderRadius:999}}/></div>
          </Panel>
        </div>
      </div>
      <div style={{position:'absolute',left:110,right:110,top:1370,textAlign:'center',opacity:p(frame,245,320)}}><Pill bg={C.graphite} color={C.white} style={{fontSize:28}}><Copy size={29}/>Antwort bekommen ≠ verstanden</Pill></div>
    </AbsoluteFill>
  );
};

export const GuidedStepsVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const split=p(frame,25,95);
  const step1=p(frame,85,145);
  const step2=p(frame,125,195);
  const question=p(frame,175,250);
  const quiz=p(frame,235,330);
  const progress=p(frame,280,390);
  const cards=[
    {label:'1  Verstehen',c:C.cyan,icon:<BrainCircuit size={34}/>,e:step1},
    {label:'2  Schritt lösen',c:C.green,icon:<BookOpenCheck size={34}/>,e:step2},
    {label:'3  Rückfrage',c:C.blue,icon:<HelpCircle size={34}/>,e:question},
    {label:'4  Mini-Quiz',c:C.purple,icon:<CircleCheck size={34}/>,e:quiz},
  ];
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 18% 16%,${C.greenSoft},transparent 34%),radial-gradient(circle at 86% 68%,${C.blueSoft},transparent 34%),linear-gradient(145deg,#F8FFFB,#F5F8FF)`,overflow:'hidden'}}>
      <Panel style={{position:'absolute',left:70,right:70,top:265,height:220,padding:28,display:'flex',alignItems:'center',gap:24,transform:`scale(${1-split*.06}) translateY(${-split*24}px)`,opacity:1-split*.18}}>
        <div style={{width:74,height:74,borderRadius:24,display:'grid',placeItems:'center',background:C.orangeSoft,color:C.orange}}><MessageCircle size={38}/></div>
        <div><div style={{fontSize:23,fontWeight:850,color:'#64748B'}}>Eine einzelne Endantwort</div><div style={{fontSize:38,fontWeight:950,color:C.ink,marginTop:6}}>wird zum Lernpfad</div></div>
      </Panel>
      <div style={{position:'absolute',left:78,right:78,top:535,display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {cards.map((card,i)=><Panel key={card.label} style={{height:245,padding:26,borderTop:`7px solid ${card.c}`,opacity:card.e,transform:`translate(${(i%2===0?-1:1)*(1-card.e)*70}px,${(1-card.e)*35}px) scale(${.94+card.e*.06})`}}>
          <div style={{width:66,height:66,borderRadius:21,display:'grid',placeItems:'center',background:`${card.c}16`,color:card.c}}>{card.icon}</div>
          <div style={{fontSize:32,fontWeight:940,color:C.ink,marginTop:20}}>{card.label}</div>
          <div style={{height:12,borderRadius:999,background:'#E4EAF0',marginTop:26,overflow:'hidden'}}><div style={{height:'100%',width:`${card.e*100}%`,background:card.c}}/></div>
        </Panel>)}
      </div>
      <div style={{position:'absolute',left:110,right:110,top:1120,height:170,borderRadius:38,background:C.graphite,color:C.white,padding:'0 32px',display:'flex',alignItems:'center',gap:25,opacity:progress,transform:`translateY(${(1-progress)*55}px)`}}>
        <GraduationCap size={56} color={C.green}/><div style={{flex:1}}><div style={{fontSize:28,fontWeight:900}}>GEFÜHRTER PROZESS</div><div style={{height:13,borderRadius:999,background:'rgba(255,255,255,.15)',marginTop:18,overflow:'hidden'}}><div style={{height:'100%',width:`${progress*100}%`,background:`linear-gradient(90deg,${C.cyan},${C.green})`}}/></div></div><Check size={42} color={C.green}/>
      </div>
    </AbsoluteFill>
  );
};

export const UnderstandPathVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const copy=p(frame,20,80);
  const understand=p(frame,70,170);
  const nodes=p(frame,135,220);
  const result=p(frame,190,238);
  return (
    <AbsoluteFill style={{background:`linear-gradient(145deg,#111A2C,#102D3C 58%,#123F39)`,color:C.white,overflow:'hidden'}}>
      <div style={{position:'absolute',left:74,right:74,top:300,display:'grid',gridTemplateColumns:'1fr 1fr',gap:34}}>
        <div style={{position:'relative',height:820}}>
          <Pill bg='rgba(226,74,87,.18)' color='#FF9BA4'><Copy size={28}/>KOPIEREN</Pill>
          <div style={{position:'absolute',left:46,top:125,width:`${copy*330}px`,height:16,borderRadius:999,background:C.red,boxShadow:`0 0 26px ${C.red}66`}}/>
          <div style={{position:'absolute',left:340,top:91,width:88,height:88,borderRadius:26,display:'grid',placeItems:'center',background:C.red,opacity:copy,transform:`scale(${.7+copy*.3})`}}><X size={45}/></div>
          <div style={{position:'absolute',left:28,top:250,right:28,padding:26,borderRadius:31,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',opacity:copy}}><div style={{fontSize:25,fontWeight:850,color:'#B8C4D6'}}>Kurzer Weg</div><div style={{fontSize:42,fontWeight:950,marginTop:9}}>Antwort da.</div><div style={{fontSize:29,fontWeight:850,color:'#FF9BA4',marginTop:18}}>Verständnis?</div></div>
        </div>
        <div style={{position:'relative',height:820}}>
          <Pill bg='rgba(32,178,107,.18)' color='#8EF0BA'><BrainCircuit size={28}/>VERSTEHEN</Pill>
          <div style={{position:'absolute',left:45,top:130,width:12,height:`${understand*480}px`,borderRadius:999,background:`linear-gradient(${C.cyan},${C.green})`,boxShadow:`0 0 26px ${C.green}55`}}/>
          {[{y:112,t:'Frage',c:C.cyan},{y:272,t:'Schritt',c:C.blue},{y:432,t:'Prüfen',c:C.green}].map((n,i)=>{const e=p(frame,100+i*28,155+i*28);return <div key={n.t} style={{position:'absolute',left:0,top:n.y,width:235,height:96,borderRadius:28,background:'rgba(255,255,255,.10)',border:`1px solid ${n.c}88`,display:'flex',alignItems:'center',gap:14,padding:'0 18px',opacity:e,transform:`translateX(${(1-e)*60}px)`}}><div style={{width:46,height:46,borderRadius:15,display:'grid',placeItems:'center',background:n.c,color:C.white,fontWeight:950}}>{i+1}</div><span style={{fontSize:27,fontWeight:900}}>{n.t}</span></div>})}
          <div style={{position:'absolute',left:0,top:630,right:0,borderRadius:34,background:C.green,padding:30,opacity:result,transform:`scale(${.9+result*.1})`,boxShadow:`0 24px 70px ${C.green}44`}}><div style={{fontSize:24,fontWeight:850}}>ERGEBNIS</div><div style={{fontSize:48,fontWeight:960,letterSpacing:-2,marginTop:6}}>VERSTANDEN ✓</div></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BalancedEndingVisual: React.FC = () => {
  const frame=useCurrentFrame();
  const caveat=p(frame,20,85);
  const benefits=p(frame,75,200);
  const hero=p(frame,190,300);
  const cta=p(frame,285,390);
  const items=[
    {label:'Fragen stellen',c:C.cyan,icon:<HelpCircle size={34}/>},
    {label:'Schrittweise erklären',c:C.green,icon:<BookOpenCheck size={34}/>},
    {label:'Verständnis prüfen',c:C.purple,icon:<CircleCheck size={34}/>},
  ];
  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 15% 20%,${C.purpleSoft},transparent 31%),radial-gradient(circle at 86% 65%,${C.cyanSoft},transparent 34%),linear-gradient(150deg,#FCFBFF,#F4FAFF)`,overflow:'hidden'}}>
      <div style={{position:'absolute',left:80,right:80,top:285}}>
        <Panel style={{height:170,padding:'0 30px',display:'flex',alignItems:'center',justifyContent:'space-between',opacity:caveat,transform:`translateY(${(1-caveat)*35}px)`}}>
          <div><div style={{fontSize:24,fontWeight:850,color:'#64748B'}}>Ehrliche Einordnung</div><div style={{fontSize:46,fontWeight:950,letterSpacing:-1.8,color:C.ink,marginTop:5}}>Nicht perfekt.</div></div>
          <Pill bg={C.orangeSoft} color={C.orange}><Lightbulb size={29}/>Lernhilfe</Pill>
        </Panel>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:18,marginTop:26}}>
          {items.map((item,i)=>{const e=p(frame,85+i*34,145+i*34);return <Panel key={item.label} style={{height:145,padding:'0 28px',display:'flex',alignItems:'center',gap:22,borderLeft:`8px solid ${item.c}`,opacity:e,transform:`translateX(${(1-e)*70}px)`}}><div style={{width:62,height:62,borderRadius:21,display:'grid',placeItems:'center',background:`${item.c}15`,color:item.c}}>{item.icon}</div><div style={{fontSize:33,fontWeight:930,color:C.ink}}>{item.label}</div><Check size={32} color={item.c} style={{marginLeft:'auto'}}/></Panel>})}
        </div>
      </div>
      <div style={{position:'absolute',left:120,right:120,top:955,height:255,borderRadius:44,background:C.graphite,color:C.white,display:'flex',alignItems:'center',padding:'0 38px',gap:26,opacity:hero,transform:`translateY(${(1-hero)*50}px) scale(${.94+hero*.06})`,boxShadow:'0 35px 90px rgba(16,32,51,.25)'}}>
        <div style={{width:105,height:105,borderRadius:34,display:'grid',placeItems:'center',background:`linear-gradient(145deg,${C.cyan},${C.green})`}}><GraduationCap size={58}/></div>
        <div><div style={{fontSize:25,fontWeight:850,color:'#BFD3E8'}}>STUDY MODE</div><div style={{fontSize:45,fontWeight:960,letterSpacing:-1.8,marginTop:5}}>Mehr lernen.<br/>Weniger Copy-Paste.</div></div>
      </div>
      <div style={{position:'absolute',left:110,right:110,top:1320,textAlign:'center',opacity:cta,transform:`translateY(${(1-cta)*35}px)`}}><Pill bg={C.purple} color={C.white} style={{fontSize:31,padding:'18px 26px'}}>Würdest du so eher lernen? <ArrowRight size={33}/></Pill></div>
    </AbsoluteFill>
  );
};
