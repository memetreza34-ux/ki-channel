import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const accent = BRAND.accent;
const soft = '#EFE7FF';
const line = '#D8CCE9';
const muted = '#6F6879';
const danger = '#E35D6A';
const success = '#35A779';

const p = (frame:number,start:number,end:number):number =>
  interpolate(frame,[start,end],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export const IdeaToPrototypeVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:18,stiffness:118}});
  const morph=p(frame,55,205);
  const warn=p(frame,205,292);
  const habits=['Wasser','Lesen','Sport'];
  return <div style={{position:'absolute',inset:0}}>
    <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
      <defs>
        <linearGradient id="ideaBeam" x1="0" x2="1"><stop offset="0%" stopColor={accent}/><stop offset="100%" stopColor={purple}/></linearGradient>
      </defs>
      <circle cx="245" cy="465" r={118+enter*10} fill={soft} stroke={accent} strokeWidth="6"/>
      <path d="M215 430 C215 370 275 370 275 430 C275 464 248 476 248 510 H242 C242 476 215 464 215 430" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round"/>
      <path d="M225 525 H265 M232 547 H258" stroke={purple} strokeWidth="8" strokeLinecap="round"/>
      <text x="245" y="650" textAnchor="middle" fontFamily={BRAND.font} fontSize="28" fontWeight="900" fill={muted}>IDEE</text>
      <text x="245" y="700" textAnchor="middle" fontFamily={BRAND.font} fontSize="36" fontWeight="950" fill={ink}>Gewohnheiten</text>
      <path d="M370 465 C470 330 545 330 650 465" fill="none" stroke="url(#ideaBeam)" strokeWidth="16" strokeLinecap="round" strokeDasharray="510" strokeDashoffset={510*(1-morph)}/>
      {[0,1,2].map((i)=><circle key={i} cx={430+i*82} cy={420-i*24} r="9" fill={purple} opacity={p(frame,75+i*28,115+i*28)}/>) }
      <rect x="650" y="150" width="330" height="690" rx="58" fill="#fff" stroke={accent} strokeWidth="7" opacity={.25+.75*morph}/>
      <rect x="685" y="205" width="260" height="88" rx="26" fill={soft}/>
      <text x="715" y="260" fontFamily={BRAND.font} fontSize="34" fontWeight="950" fill={purple}>Heute</text>
      {habits.map((habit,i)=>{
        const y=340+i*125; const show=p(frame,100+i*30,145+i*30);
        return <g key={habit} opacity={show}>
          <circle cx="720" cy={y+35} r="25" fill={i<2?'rgba(53,167,121,.16)':'#F0ECF4'} stroke={i<2?success:line} strokeWidth="4"/>
          <path d={`M708 ${y+35} l9 10 18-22`} fill="none" stroke={i<2?success:muted} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="765" y={y+45} fontFamily={BRAND.font} fontSize="30" fontWeight="900" fill={ink}>{habit}</text>
        </g>;
      })}
      <rect x="690" y="735" width="250" height="66" rx="28" fill={purple}/>
      <text x="815" y="778" textAnchor="middle" fontFamily={BRAND.font} fontSize="28" fontWeight="950" fill="#fff">+ Eintrag</text>
    </svg>
    <div style={{position:'absolute',left:105,top:830,width:410,padding:'20px 26px',borderRadius:24,background:warn>.55?'rgba(227,93,106,.10)':soft,border:`2px solid ${warn>.55?danger:accent}`,fontSize:28,fontWeight:950,color:warn>.55?danger:purple,opacity:p(frame,170,220)}}>
      „Schreib mir eine App“ → {warn>.55?'zu offen':'erste Richtung'}
    </div>
  </div>;
};

export const StructurePlanVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const nodes=[
    {label:'ZIEL',value:'Gewohnheiten',x:190,y:250},
    {label:'UI',value:'Übersicht',x:820,y:250},
    {label:'EINGABE',value:'Eintrag',x:190,y:760},
    {label:'LOGIK',value:'Fortschritt',x:820,y:760},
  ];
  return <div style={{position:'absolute',inset:0}}>
    <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
      <circle cx="540" cy="510" r="125" fill={soft} stroke={accent} strokeWidth="6"/>
      <text x="540" y="493" textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="850" fill={muted}>APP-PLAN</text>
      <text x="540" y="542" textAnchor="middle" fontFamily={BRAND.font} fontSize="39" fontWeight="950" fill={purple}>erst strukturieren</text>
      {nodes.map((node,i)=>{
        const show=p(frame,18+i*42,65+i*42);
        const path=`M540 510 Q${(540+node.x)/2} ${(510+node.y)/2+(i%2===0?-55:55)} ${node.x} ${node.y}`;
        return <React.Fragment key={node.label}>
          <path d={path} fill="none" stroke={i===3?purple:line} strokeWidth={i===3?8:5} strokeLinecap="round" strokeDasharray="500" strokeDashoffset={500*(1-show)}/>
          <circle cx={node.x} cy={node.y} r="91" fill="#fff" stroke={i===3?accent:line} strokeWidth="5" opacity={show}/>
          <text x={node.x} y={node.y-9} textAnchor="middle" fontFamily={BRAND.font} fontSize="22" fontWeight="900" fill={i===3?purple:muted} opacity={show}>{node.label}</text>
          <text x={node.x} y={node.y+31} textAnchor="middle" fontFamily={BRAND.font} fontSize="27" fontWeight="950" fill={ink} opacity={show}>{node.value}</text>
        </React.Fragment>;
      })}
    </svg>
    <div style={{position:'absolute',left:250,right:250,top:930,textAlign:'center',fontSize:34,fontWeight:950,color:purple,opacity:p(frame,205,270)}}>Ziel → Oberfläche → Eingabe → Logik</div>
  </div>;
};

export const CodeAssemblyVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const separate=p(frame,25,115); const assemble=p(frame,120,270);
  const modules=[
    {label:'UI',x:150,y:300,color:accent},
    {label:'DATEN',x:150,y:520,color:'#9F87D8'},
    {label:'LOGIK',x:150,y:740,color:purple},
  ];
  return <div style={{position:'absolute',inset:0,perspective:900}}>
    <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
      {modules.map((module,i)=>{
        const show=p(frame,20+i*34,65+i*34);
        return <g key={module.label} opacity={show}>
          <rect x={module.x} y={module.y} width="250" height="130" rx="26" fill="#fff" stroke={module.color} strokeWidth="5"/>
          <text x={module.x+125} y={module.y+78} textAnchor="middle" fontFamily={BRAND.font} fontSize="31" fontWeight="950" fill={module.color}>{module.label}</text>
          <path d={`M400 ${module.y+65} C510 ${module.y+65}, 525 ${500+i*18}, 650 ${500+i*18}`} fill="none" stroke={module.color} strokeWidth="7" strokeLinecap="round" strokeDasharray="390" strokeDashoffset={390*(1-assemble)}/>
        </g>;
      })}
      <rect x="650" y="200" width="285" height="650" rx="54" fill="#fff" stroke={accent} strokeWidth="7" opacity={.2+.8*assemble}/>
      <rect x="683" y="245" width="219" height="76" rx="23" fill={soft}/>
      <text x="705" y="295" fontFamily={BRAND.font} fontSize="31" fontWeight="950" fill={purple}>Heute</text>
      {[0,1,2].map((i)=><g key={i} opacity={p(frame,145+i*35,190+i*35)}><rect x="685" y={365+i*120} width="215" height="88" rx="22" fill="#F7F4FA"/><circle cx="720" cy={409+i*120} r="19" fill={i<2?success:'#D6CCDE'}/><rect x="755" y={397+i*120} width={110+i*12} height="22" rx="11" fill="#BDAFCB"/></g>)}
      <rect x="690" y="745" width="205" height="62" rx="25" fill={purple}/>
    </svg>
    <div style={{position:'absolute',left:90,top:905,width:390,fontSize:29,fontWeight:900,color:muted,opacity:separate}}>Bausteine statt Monolith</div>
    <div style={{position:'absolute',right:105,top:905,width:370,textAlign:'right',fontSize:32,fontWeight:950,color:purple,opacity:p(frame,225,285)}}>Module → Prototyp</div>
  </div>;
};

export const TestFixVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const scan=p(frame,35,265); const repair=p(frame,175,330);
  const scanY=interpolate(scan,[0,1],[245,810]);
  const problems=[
    {label:'Button',y:365,x:270},
    {label:'Daten',y:555,x:665},
    {label:'Mobile',y:720,x:365},
  ];
  return <div style={{position:'absolute',inset:0}}>
    <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
      <rect x="195" y="160" width="690" height="720" rx="54" fill="#fff" stroke={line} strokeWidth="6"/>
      <rect x="240" y="220" width="600" height="88" rx="25" fill={soft}/>
      <rect x="240" y="350" width="600" height="145" rx="28" fill="#F7F4FA"/>
      <rect x="240" y="530" width={repair>.65?600:660} height="145" rx="28" fill={repair>.45?'rgba(53,167,121,.09)':'rgba(227,93,106,.08)'} stroke={repair>.45?success:danger} strokeWidth="4"/>
      <rect x="240" y="710" width="600" height="105" rx="28" fill="#F7F4FA"/>
      <line x1="210" x2="870" y1={scanY} y2={scanY} stroke={purple} strokeWidth="9" opacity={scan}/>
      <rect x="210" y={scanY-20} width="660" height="40" fill="rgba(185,140,255,.08)" opacity={scan}/>
      {problems.map((problem,i)=>{
        const seen=p(frame,75+i*50,115+i*50); const fixed=p(frame,190+i*35,240+i*35);
        return <g key={problem.label} opacity={seen}>
          <circle cx={problem.x} cy={problem.y} r="28" fill={fixed>.55?'rgba(53,167,121,.15)':'rgba(227,93,106,.14)'} stroke={fixed>.55?success:danger} strokeWidth="5"/>
          <text x={problem.x} y={problem.y+9} textAnchor="middle" fontFamily={BRAND.font} fontSize="24" fontWeight="950" fill={fixed>.55?success:danger}>{fixed>.55?'✓':'!'}</text>
          <text x={problem.x+48} y={problem.y+9} fontFamily={BRAND.font} fontSize="26" fontWeight="900" fill={fixed>.55?success:danger}>{problem.label}</text>
        </g>;
      })}
    </svg>
    <div style={{position:'absolute',left:205,right:205,top:930,textAlign:'center',fontSize:36,fontWeight:950,color:repair>.72?success:danger}}>{repair>.72?'Fehler erkannt → korrigiert':'Testen deckt Fehler auf'}</div>
  </div>;
};

export const WorkflowVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const path=p(frame,25,390); const approval=p(frame,125,205); const done=p(frame,390,485);
  const steps=[
    {label:'IDEE',x:135,y:570},
    {label:'STRUKTUR',x:325,y:420},
    {label:'CODE',x:525,y:590},
    {label:'TEST',x:720,y:420},
    {label:'FIX',x:915,y:570},
  ];
  return <div style={{position:'absolute',inset:0}}>
    <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
      <path d="M135 570 C230 570 250 420 325 420 C405 420 445 590 525 590 C610 590 640 420 720 420 C810 420 825 570 915 570" fill="none" stroke="#E7E0EC" strokeWidth="32" strokeLinecap="round"/>
      <path d="M135 570 C230 570 250 420 325 420 C405 420 445 590 525 590 C610 590 640 420 720 420 C810 420 825 570 915 570" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round" strokeDasharray="1180" strokeDashoffset={1180*(1-path)}/>
      {steps.map((step,i)=>{
        const show=p(frame,28+i*54,72+i*54); const active=path>i/5;
        return <g key={step.label} opacity={show}>
          <circle cx={step.x} cy={step.y} r={active?62:52} fill={active?soft:'#fff'} stroke={active?accent:line} strokeWidth="5"/>
          <text x={step.x} y={step.y+9} textAnchor="middle" fontFamily={BRAND.font} fontSize="22" fontWeight="950" fill={active?purple:muted}>{step.label}</text>
        </g>;
      })}
      <path d="M720 420 C720 685 610 760 540 790" fill="none" stroke={danger} strokeWidth="6" strokeDasharray="15 13" opacity={p(frame,92,150)}/>
      <circle cx="540" cy="830" r="88" fill={approval>.6?'rgba(53,167,121,.12)':'rgba(227,93,106,.08)'} stroke={approval>.6?success:danger} strokeWidth="6" opacity={p(frame,105,160)}/>
      <text x="540" y="820" textAnchor="middle" fontFamily={BRAND.font} fontSize="22" fontWeight="850" fill={approval>.6?success:danger}>DU</text>
      <text x="540" y="855" textAnchor="middle" fontFamily={BRAND.font} fontSize="27" fontWeight="950" fill={approval>.6?success:danger}>{approval>.6?'freigeben':'prüfen'}</text>
      <circle cx="915" cy="570" r={72+done*18} fill="rgba(53,167,121,.08)" stroke={success} strokeWidth="7" opacity={done}/>
    </svg>
    <div style={{position:'absolute',left:210,right:210,top:950,textAlign:'center',fontSize:39,fontWeight:950,color:success,opacity:done}}>brauchbarer Prototyp ✓</div>
  </div>;
};
