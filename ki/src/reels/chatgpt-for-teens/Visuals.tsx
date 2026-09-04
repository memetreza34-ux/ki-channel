import React, {type CSSProperties} from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  BookOpenCheck,
  BrainCircuit,
  CircleCheck,
  Clock3,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRoundCog,
} from 'lucide-react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TEEN_PALETTE as C, TEEN_VISIBLE_COPY as COPY} from './contract';

const p = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

const Panel: React.FC<{children: React.ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(255,255,255,.94)',
      border: '1px solid rgba(16,32,51,.10)',
      borderRadius: 34,
      boxShadow: '0 28px 80px rgba(16,32,51,.16)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{children: React.ReactNode; bg: string; color?: string; style?: CSSProperties}> = ({children, bg, color = C.ink, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 17px',
      borderRadius: 999,
      background: bg,
      color,
      fontWeight: 850,
      fontSize: 25,
      letterSpacing: -.5,
      ...style,
    }}
  >
    {children}
  </div>
);

const ChatBubble: React.FC<{
  children: React.ReactNode;
  side?: 'user' | 'assistant';
  accent?: string;
  style?: CSSProperties;
}> = ({children, side = 'assistant', accent = C.cyan, style}) => (
  <div
    style={{
      alignSelf: side === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '84%',
      padding: '18px 22px',
      borderRadius: side === 'user' ? '24px 24px 7px 24px' : '24px 24px 24px 7px',
      background: side === 'user' ? accent : C.white,
      color: side === 'user' ? C.white : C.ink,
      border: side === 'assistant' ? '1px solid rgba(16,32,51,.08)' : 'none',
      boxShadow: '0 12px 28px rgba(16,32,51,.10)',
      fontSize: 27,
      lineHeight: 1.25,
      fontWeight: 680,
      ...style,
    }}
  >
    {children}
  </div>
);

const AppTopBar: React.FC<{badge?: React.ReactNode}> = ({badge}) => (
  <div
    style={{
      height: 84,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 26px',
      borderBottom: '1px solid rgba(16,32,51,.08)',
      background: 'rgba(255,255,255,.94)',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: C.graphite,
          color: C.white,
        }}
      >
        <Sparkles size={24}/>
      </div>
      <div style={{fontSize: 31, fontWeight: 900, letterSpacing: -1.2}}>{COPY.brand}</div>
    </div>
    {badge}
  </div>
);

const Phone: React.FC<{children: React.ReactNode; style?: CSSProperties}> = ({children, style}) => (
  <div
    style={{
      width: 700,
      height: 990,
      borderRadius: 64,
      padding: 15,
      background: '#111827',
      boxShadow: '0 45px 110px rgba(15,23,42,.34)',
      ...style,
    }}
  >
    <div style={{height: '100%', borderRadius: 50, overflow: 'hidden', background: '#F8FAFC', position: 'relative'}}>
      {children}
    </div>
  </div>
);

export const TeenSwitchVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const scan = p(frame, 18, 68);
  const teen = p(frame, 68, 118);
  const feature = p(frame, 110, 188);
  const tilt = interpolate(teen, [0, 1], [-5, 1.5]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 16% 16%, ${C.yellowSoft} 0%, transparent 28%), radial-gradient(circle at 86% 30%, ${C.cyanSoft} 0%, transparent 40%), linear-gradient(145deg,#F8FBFF 0%,#EAF8FB 100%)`,
        overflow: 'hidden',
      }}
    >
      <div style={{position:'absolute',width:440,height:440,borderRadius:'50%',right:-90,top:260,background:C.cyan,opacity:.10,transform:`scale(${1+teen*.28})`}}/>
      <div style={{position:'absolute',width:250,height:250,borderRadius:'50%',left:-60,bottom:420,background:C.yellow,opacity:.10}}/>

      <Phone
        style={{
          position: 'absolute',
          left: 190,
          top: 245,
          transform: `translateY(${(1-enter)*70}px) rotate(${tilt}deg) scale(${.90+enter*.10})`,
          transformOrigin: '50% 80%',
        }}
      >
        <AppTopBar
          badge={
            <Pill bg={teen > .48 ? C.greenSoft : '#EEF2F7'} color={teen > .48 ? C.green : '#64748B'}>
              {teen > .48 ? COPY.scene1.teen : COPY.scene1.standard}
            </Pill>
          }
        />
        <div style={{padding:30,height:'calc(100% - 84px)',display:'flex',flexDirection:'column',gap:20,position:'relative'}}>
          <ChatBubble side="user" accent={C.blue}>Hilf mir bei einer Aufgabe.</ChatBubble>
          <ChatBubble>Gern. Was möchtest du verstehen?</ChatBubble>
          <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,opacity:feature,transform:`translateY(${(1-feature)*34}px)`}}>
            {[
              {t:COPY.scene1.study,c:C.green,i:<GraduationCap size={28}/>},
              {t:COPY.scene1.safety,c:C.red,i:<ShieldCheck size={28}/>},
              {t:COPY.scene1.pause,c:C.orange,i:<TimerReset size={28}/>},
            ].map((item)=>(
              <div key={item.t} style={{padding:'19px 10px',borderRadius:23,background:`${item.c}15`,border:`1px solid ${item.c}33`,color:item.c,display:'flex',flexDirection:'column',alignItems:'center',gap:8,fontSize:24,fontWeight:850}}>
                {item.i}{item.t}
              </div>
            ))}
          </div>
          <div style={{marginTop:'auto',height:74,borderRadius:24,border:`2px solid ${teen>.48?C.green:'#CBD5E1'}`,background:C.white,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px'}}>
            <span style={{fontWeight:850,fontSize:27}}>Experience</span>
            <div style={{width:178,height:48,borderRadius:999,background:teen>.48?C.green:'#CBD5E1',padding:5,position:'relative'}}>
              <div style={{position:'absolute',top:5,left:5+teen*130,width:38,height:38,borderRadius:'50%',background:C.white,boxShadow:'0 4px 12px rgba(0,0,0,.18)'}}/>
            </div>
          </div>
          <div style={{position:'absolute',left:0,right:0,top:-80+scan*900,height:5,background:`linear-gradient(90deg,transparent,${C.cyan},transparent)`,boxShadow:`0 0 28px ${C.cyan}`,opacity:scan<1?.9:0}}/>
        </div>
      </Phone>

      <div style={{position:'absolute',right:72,top:430,opacity:p(frame,35,82),transform:`translateX(${(1-p(frame,35,82))*70}px)`}}>
        <Pill bg={C.yellowSoft} color='#8A6500'><ScanSearch size={30}/>{COPY.scene1.age}</Pill>
      </div>
      <div style={{position:'absolute',left:70,top:1335,opacity:p(frame,132,190),transform:`translateY(${(1-p(frame,132,190))*36}px)`}}>
        <Pill bg={C.graphite} color={C.white}><Sparkles size={28}/>{COPY.scene1.announcement}</Pill>
      </div>
    </AbsoluteFill>
  );
};

export const AgeEstimateVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = p(frame, 20, 125);
  const decision = p(frame, 138, 235);
  const rollout = p(frame, 310, 505);
  const signals = [
    {label:COPY.scene2.topics,color:C.cyan,icon:<MessageCircle size={28}/>},
    {label:COPY.scene2.usageTimes,color:C.orange,icon:<Clock3 size={28}/>},
    {label:COPY.scene2.accountUse,color:C.blue,icon:<UserRoundCog size={28}/>},
    {label:COPY.scene2.accountAge,color:C.purple,icon:<BadgeCheck size={28}/>},
  ];

  return (
    <AbsoluteFill style={{background:'linear-gradient(145deg,#0F1C33 0%,#12294A 55%,#0E3A4C 100%)',color:C.white,overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'56px 56px'}}/>
      <div style={{position:'absolute',width:480,height:480,borderRadius:'50%',right:-160,top:980,background:C.cyan,opacity:.08}}/>
      <Panel style={{position:'absolute',left:70,right:70,top:250,bottom:470,padding:34,background:'rgba(246,250,255,.97)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:14,alignItems:'center',color:C.ink}}>
            <ScanSearch color={C.blue} size={40}/>
            <div>
              <div style={{fontSize:21,fontWeight:800,color:'#64748B'}}>{COPY.scene2.panel}</div>
              <div style={{fontSize:39,fontWeight:950,letterSpacing:-1.2}}>{COPY.scene2.estimate}</div>
            </div>
          </div>
          <Pill bg={decision>.65?C.greenSoft:C.blueSoft} color={decision>.65?C.green:C.blue}>{decision>.65?COPY.scene2.active:'SCAN'}</Pill>
        </div>

        <div style={{marginTop:32,display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          {signals.map((s,i)=>{
            const e=p(frame,38+i*22,90+i*22);
            return (
              <div key={s.label} style={{height:104,borderRadius:27,background:`${s.color}12`,border:`1px solid ${s.color}33`,display:'flex',alignItems:'center',gap:17,padding:'0 20px',color:C.ink,opacity:e,transform:`translateY(${(1-e)*28}px)`}}>
                <div style={{width:54,height:54,borderRadius:17,display:'grid',placeItems:'center',background:s.color,color:C.white}}>{s.icon}</div>
                <span style={{fontSize:25,fontWeight:850}}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{marginTop:34,display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:24,alignItems:'stretch'}}>
          <div style={{borderRadius:32,background:'#F1F5F9',padding:26,position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:22,fontWeight:800,color:'#64748B'}}>Signale</div>
            <div style={{height:18,borderRadius:999,background:'#DCE4EE',marginTop:25,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${12+scan*78}%`,background:`linear-gradient(90deg,${C.cyan},${C.blue})`,borderRadius:999}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontWeight:850,color:'#64748B'}}>
              <span>18+</span><span style={{color:C.red}}>{COPY.scene2.threshold}</span>
            </div>
            <div style={{marginTop:26,fontSize:62,fontWeight:950,letterSpacing:-3,color:decision>.45?C.red:C.blue,transform:`scale(${1+decision*.05})`}}>{decision>.45?COPY.scene2.threshold:'…'}</div>
          </div>
          <div style={{borderRadius:32,background:decision>.55?C.greenSoft:C.white,border:`2px solid ${decision>.55?C.green:'#DCE4EE'}`,padding:26,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',transform:`scale(${.92+decision*.08})`}}>
            <ShieldCheck size={74} color={decision>.55?C.green:'#94A3B8'}/>
            <div style={{fontSize:27,fontWeight:900,marginTop:14,color:C.ink}}>{COPY.scene2.experience}</div>
            <div style={{fontSize:31,fontWeight:950,color:decision>.55?C.green:'#94A3B8',marginTop:6}}>{decision>.55?COPY.scene2.active:'BEREIT'}</div>
          </div>
        </div>

        <div style={{marginTop:30,borderRadius:28,background:'#0F3E8C',color:C.white,padding:'20px 24px',display:'flex',alignItems:'center',gap:18,opacity:rollout,transform:`translateY(${(1-rollout)*25}px)`}}>
          <div style={{width:58,height:58,borderRadius:18,display:'grid',placeItems:'center',background:C.yellow,color:'#17345F',fontWeight:950,fontSize:25}}>{COPY.scene2.eu}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:25}}>{COPY.scene2.rollout}</div>
            <div style={{height:7,borderRadius:999,background:'rgba(255,255,255,.18)',marginTop:12,overflow:'hidden'}}><div style={{height:'100%',width:`${rollout*100}%`,background:C.yellow}}/></div>
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

export const StudyModeVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const shortcut = p(frame, 22, 92);
  const mode = p(frame, 86, 150);
  const steps = p(frame, 142, 250);
  const quiz = p(frame, 232, 330);

  return (
    <AbsoluteFill style={{background:`radial-gradient(circle at 18% 18%,${C.orangeSoft},transparent 32%),radial-gradient(circle at 82% 65%,${C.greenSoft},transparent 38%),linear-gradient(155deg,#FFFBF4,#EAF8EF)`,overflow:'hidden'}}>
      <div style={{position:'absolute',left:60,right:60,top:255,bottom:470,display:'grid',gridTemplateColumns:'.88fr 1.12fr',gap:26}}>
        <Panel style={{padding:26,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <AppTopBar badge={<Pill bg={mode>.5?C.greenSoft:'#EEF2F7'} color={mode>.5?C.green:'#64748B'}><GraduationCap size={27}/>{COPY.scene3.studyMode}</Pill>}/>
          <div style={{padding:'26px 4px',display:'flex',flexDirection:'column',gap:18}}>
            <ChatBubble side="user" accent={C.orange}>{COPY.scene3.prompt}</ChatBubble>
            <div style={{position:'relative'}}>
              <ChatBubble style={{opacity:1-shortcut*.72}}>Hier wäre direkt die fertige Antwort …</ChatBubble>
              <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',opacity:shortcut}}><Pill bg={C.redSoft} color={C.red}><Ban size={30}/>{COPY.scene3.shortcut}</Pill></div>
            </div>
            <div style={{marginTop:8,height:76,borderRadius:24,background:C.greenSoft,border:`1px solid ${C.green}44`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',opacity:mode}}>
              <span style={{fontWeight:900,fontSize:26,color:C.green}}>Study Mode</span>
              <div style={{width:72,height:38,borderRadius:999,background:C.green,padding:4}}><div style={{width:30,height:30,borderRadius:'50%',background:C.white,marginLeft:30}}/></div>
            </div>
          </div>
        </Panel>

        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {[COPY.scene3.step1,COPY.scene3.step2,COPY.scene3.step3].map((label,i)=>{
            const e=p(frame,150+i*24,215+i*24);
            const colors=[C.cyan,C.green,C.blue];
            const soft=[C.cyanSoft,C.greenSoft,C.blueSoft];
            return (
              <Panel key={label} style={{height:150,padding:'0 28px',display:'flex',alignItems:'center',gap:22,opacity:e,transform:`translateX(${(1-e)*60}px)`,borderLeft:`8px solid ${colors[i]}`}}>
                <div style={{width:58,height:58,borderRadius:20,display:'grid',placeItems:'center',background:soft[i],color:colors[i]}}>{i===0?<BrainCircuit size={31}/>:i===1?<BookOpenCheck size={31}/>:<CircleCheck size={31}/>}</div>
                <div style={{fontSize:31,fontWeight:930,color:C.ink}}>{label}</div>
              </Panel>
            );
          })}
          <Panel style={{flex:1,minHeight:170,padding:24,background:quiz>.55?C.yellowSoft:C.white,border:`2px solid ${quiz>.55?C.yellow:'#E2E8F0'}`,opacity:steps,transform:`scale(${.96+quiz*.04})`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Pill bg={C.yellow} color='#503900'>{COPY.scene3.quiz}</Pill>
              <div style={{fontSize:24,fontWeight:900,color:C.green,opacity:quiz}}>{COPY.scene3.understood} ✓</div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:26}}>{[0,1,2].map((i)=><div key={i} style={{height:16,flex:1,borderRadius:999,background:i<Math.ceil(quiz*3)?C.green:'#D9E1EA'}}/>)}</div>
          </Panel>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SafetyPauseVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const danger = p(frame, 8, 42);
  const shield = p(frame, 38, 78);
  const pause = p(frame, 78, 122);

  return (
    <AbsoluteFill style={{background:'radial-gradient(circle at 15% 25%,rgba(226,74,87,.20),transparent 34%),radial-gradient(circle at 85% 65%,rgba(244,197,66,.18),transparent 30%),linear-gradient(145deg,#111C30,#162942)',color:C.white,overflow:'hidden'}}>
      <div style={{position:'absolute',width:420,height:420,borderRadius:'50%',right:-120,bottom:260,background:C.orange,opacity:.08}}/>
      <div style={{position:'absolute',left:70,right:70,top:285,height:760,display:'grid',gridTemplateColumns:'1fr 1fr',gap:30}}>
        <div style={{position:'relative'}}>
          <div style={{position:'absolute',left:20,right:20,top:60,height:290,borderRadius:38,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',padding:28,transform:`translateX(${danger*55}px)`,opacity:.45+.55*danger}}>
            <Pill bg='rgba(226,74,87,.20)' color='#FF9AA2'><MessageCircle size={27}/>{COPY.scene4.sensitive}</Pill>
            <div style={{marginTop:32,height:18,width:'86%',borderRadius:999,background:'rgba(255,255,255,.18)'}}/>
            <div style={{marginTop:15,height:18,width:'68%',borderRadius:999,background:'rgba(255,255,255,.12)'}}/>
          </div>
          <div style={{position:'absolute',left:165,top:118,width:280,height:280,borderRadius:78,background:`linear-gradient(145deg,${C.blue},${C.purple})`,display:'grid',placeItems:'center',boxShadow:`0 25px 80px ${C.blue}66`,transform:`scale(${.55+shield*.45}) rotate(${(1-shield)*-12}deg)`,opacity:shield}}><ShieldCheck size={128}/></div>
          <div style={{position:'absolute',left:80,right:20,top:445,textAlign:'center',opacity:shield}}>
            <div style={{fontSize:38,fontWeight:950}}>{COPY.scene4.protected}</div>
            <div style={{fontSize:25,fontWeight:800,color:'#9FE7FF',marginTop:8}}>{COPY.scene4.blocked}</div>
          </div>
        </div>

        <Panel style={{height:500,marginTop:90,padding:30,background:'rgba(255,255,255,.97)',opacity:pause,transform:`translateY(${(1-pause)*70}px) scale(${.92+pause*.08})`}}>
          <div style={{width:92,height:92,borderRadius:30,display:'grid',placeItems:'center',background:C.yellowSoft,color:'#8C6500'}}><TimerReset size={48}/></div>
          <div style={{fontSize:43,fontWeight:950,letterSpacing:-1.5,color:C.ink,marginTop:28}}>{COPY.scene4.breakTitle}</div>
          <div style={{fontSize:28,fontWeight:720,color:'#64748B',marginTop:12,lineHeight:1.3}}>{COPY.scene4.breakBody}</div>
          <div style={{marginTop:35,height:13,borderRadius:999,background:'#E2E8F0',overflow:'hidden'}}><div style={{height:'100%',width:`${pause*72}%`,background:`linear-gradient(90deg,${C.yellow},${C.orange})`}}/></div>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

export const ParentPrivacyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const controls = p(frame, 15, 95);
  const attempt = p(frame, 115, 210);
  const lock = p(frame, 195, 270);
  const final = p(frame, 290, 390);

  return (
    <AbsoluteFill style={{background:'radial-gradient(circle at 10% 20%,rgba(52,120,246,.10),transparent 30%),radial-gradient(circle at 90% 72%,rgba(244,197,66,.16),transparent 32%),linear-gradient(150deg,#EFF7FF 0%,#F6FBFA 48%,#FFF8EA 100%)',overflow:'hidden'}}>
      <div style={{position:'absolute',left:58,right:58,top:250,bottom:500,display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,transform:`scale(${1-final*.035}) translateY(${final*10}px)`}}>
        <Panel style={{padding:28,borderTop:`7px solid ${C.blue}`}}>
          <div style={{display:'flex',alignItems:'center',gap:15}}>
            <div style={{width:62,height:62,borderRadius:20,display:'grid',placeItems:'center',background:C.blueSoft,color:C.blue}}><UserRoundCog size={34}/></div>
            <div style={{fontSize:32,fontWeight:950,color:C.ink}}>{COPY.scene5.controls}</div>
          </div>
          {[
            {label:COPY.scene5.studyHours,c:C.green},
            {label:COPY.scene5.quietHours,c:C.blue},
          ].map((row,i)=>{
            const e=p(frame,25+i*35,76+i*35);
            return (
              <div key={row.label} style={{marginTop:28,height:108,borderRadius:28,background:'#F8FAFC',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',opacity:e,transform:`translateX(${(1-e)*-35}px)`}}>
                <div style={{display:'flex',alignItems:'center',gap:14,color:C.ink}}>{i===0?<BookOpenCheck color={row.c} size={31}/>:<Clock3 color={row.c} size={31}/>}<span style={{fontSize:27,fontWeight:880}}>{row.label}</span></div>
                <div style={{width:76,height:42,borderRadius:999,background:row.c,padding:5}}><div style={{width:32,height:32,borderRadius:'50%',background:C.white,marginLeft:34}}/></div>
              </div>
            );
          })}
          <div style={{marginTop:30,padding:20,borderRadius:25,background:C.greenSoft,color:C.green,fontSize:25,fontWeight:850,opacity:controls}}><CircleCheck size={26} style={{verticalAlign:'middle',marginRight:10}}/>Einstellungen aktiv</div>
        </Panel>

        <Panel style={{overflow:'hidden',position:'relative',borderTop:`7px solid ${C.cyan}`}}>
          <AppTopBar badge={<Pill bg={C.cyanSoft} color='#087C89'>{COPY.scene5.teenChat}</Pill>}/>
          <div style={{padding:26,display:'flex',flexDirection:'column',gap:18}}>
            <ChatBubble side="user" accent={C.cyan}>Kannst du mir das erklären?</ChatBubble>
            <ChatBubble>Klar – wir gehen es gemeinsam durch.</ChatBubble>
            <ChatBubble style={{width:'68%'}}>Zuerst schauen wir auf …</ChatBubble>
          </div>
          <div style={{position:'absolute',right:22,top:380,width:78,height:78,borderRadius:'50%',background:C.blue,color:C.white,display:'grid',placeItems:'center',boxShadow:'0 12px 30px rgba(52,120,246,.35)',opacity:attempt,transform:`translate(${(1-attempt)*110}px,${(1-attempt)*-90}px)`}}><EyeOff size={38}/></div>
          <div style={{position:'absolute',inset:0,background:`rgba(15,28,48,${lock*.80})`,backdropFilter:`blur(${lock*8}px)`,display:'grid',placeItems:'center',opacity:lock}}>
            <div style={{textAlign:'center',color:C.white,transform:`scale(${.8+lock*.2})`}}>
              <div style={{width:126,height:126,borderRadius:42,display:'grid',placeItems:'center',margin:'0 auto',background:C.red}}><LockKeyhole size={68}/></div>
              <div style={{fontSize:46,fontWeight:950,letterSpacing:-1.5,marginTop:20}}>{COPY.scene5.noAccess}</div>
              <div style={{fontSize:27,fontWeight:800,color:'#CDEBFF',marginTop:8}}>{COPY.scene5.private}</div>
            </div>
          </div>
        </Panel>
      </div>

      <div style={{position:'absolute',left:128,right:128,top:1390,height:150,display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:22,opacity:final,transform:`translateY(${(1-final)*42}px)`}}>
        <Pill bg={C.cyan} color={C.white} style={{justifyContent:'center',fontSize:31,padding:'18px 25px'}}><ShieldCheck size={34}/>{COPY.scene5.teen}</Pill>
        <ArrowRight color={C.graphite} size={42}/>
        <Pill bg={C.graphite} color={C.white} style={{justifyContent:'center',fontSize:31,padding:'18px 25px'}}><BadgeCheck size={34}/>{COPY.scene5.adult}</Pill>
        <div style={{gridColumn:'1 / -1',textAlign:'center',fontSize:25,fontWeight:850,color:'#526176'}}>{COPY.scene5.different}</div>
      </div>
    </AbsoluteFill>
  );
};
