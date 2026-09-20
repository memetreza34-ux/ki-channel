import React from 'react';
import {interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {BRAND} from '../../brand/brand';

const PURPLE=BRAND.accentDk;
const ACCENT=BRAND.accent;
const INK=BRAND.ink;
const OK='#4F9D74';
const BAD='#D95C6A';
const MUTED='rgba(26,26,46,.50)';
const stage:React.CSSProperties={position:'absolute',left:90,right:90,top:120,bottom:70,overflow:'hidden'};
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const p=(frame:number,start:number,end:number)=>clamp(interpolate(frame,[start,Math.max(start+1,end)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
const dash=(value:number,length:number)=>length*(1-value);

const Grid:React.FC<{opacity?:number}>=({opacity=.24})=><div style={{position:'absolute',inset:0,opacity,backgroundImage:'linear-gradient(rgba(110,69,201,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.04) 1px,transparent 1px)',backgroundSize:'64px 64px',maskImage:'radial-gradient(circle at 50% 48%,black,rgba(0,0,0,.72) 58%,transparent 88%)'}}/>;

export const HookVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:18,stiffness:120}});
  const split=p(frame,120,330);
  const assemble=p(frame,300,610);
  const labels=[
    {text:'PROBLEM',x:260,y:230},
    {text:'FLOW',x:520,y:610},
    {text:'DATEN',x:960,y:190},
    {text:'TEST',x:1280,y:560},
  ];
  return <div style={stage}>
    <Grid opacity={.20}/>
    <div style={{position:'absolute',left:210,top:310,fontFamily:BRAND.font,fontSize:78,fontWeight:950,letterSpacing:-2.6,color:INK,opacity:enter,transform:`translateX(${-420*split}px) scale(${1-.16*split})`}}>Bau mir eine App.</div>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <circle cx="900" cy="390" r={90+assemble*44} fill="rgba(185,140,255,.12)" stroke={PURPLE} strokeWidth="5" opacity={split}/>
      <circle cx="900" cy="390" r={52+Math.sin(frame/14)*3} fill="#fff" stroke="rgba(110,69,201,.24)" strokeWidth="3" opacity={split}/>
      {labels.map((item,index)=>{
        const local=p(assemble,index*.12,Math.min(1,index*.12+.48));
        return <React.Fragment key={item.text}>
          <path d={`M900 390 Q${(900+item.x)/2} ${(390+item.y)/2+(index%2?55:-55)} ${item.x} ${item.y}`} fill="none" stroke="rgba(110,69,201,.28)" strokeWidth="4" strokeDasharray="560" strokeDashoffset={dash(local,560)}/>
          <circle cx={item.x} cy={item.y} r="62" fill="#fff" stroke={index===3?OK:'rgba(110,69,201,.25)'} strokeWidth="4" opacity={local}/>
          <text x={item.x} y={item.y+8} textAnchor="middle" fontFamily={BRAND.font} fontSize="23" fontWeight="950" fill={index===3?OK:PURPLE} opacity={local}>{item.text}</text>
        </React.Fragment>;
      })}
      <text x="900" y="399" textAnchor="middle" fontFamily={BRAND.font} fontSize="28" fontWeight="950" fill={PURPLE} opacity={split}>APP</text>
    </svg>
    <div style={{position:'absolute',right:185,bottom:82,fontFamily:BRAND.font,fontSize:36,fontWeight:950,color:MUTED,opacity:p(frame,480,650)}}>Ein Prompt ist nur der <span style={{color:PURPLE}}>Startpunkt</span></div>
  </div>;
};

export const ScopeVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=p(frame,20,210);
  const filter=p(frame,190,520);
  const lock=p(frame,500,760);
  const extras=['Chat','Kalender','Team','Statistik','Gamification'];
  return <div style={stage}>
    <Grid opacity={.18}/>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M260 120 H1480 L1110 590 H630 Z" fill="rgba(185,140,255,.06)" stroke="rgba(110,69,201,.20)" strokeWidth="4" opacity={enter}/>
      {[0,1,2].map((index)=><line key={index} x1={420+index*330} y1="135" x2={710+index*195} y2="560" stroke="rgba(110,69,201,.11)" strokeWidth="3" opacity={enter}/>) }
      <path d="M630 590 H1110" stroke={PURPLE} strokeWidth="8" strokeLinecap="round" strokeDasharray="480" strokeDashoffset={dash(lock,480)}/>
    </svg>
    <div style={{position:'absolute',left:185,right:185,top:70,display:'flex',justifyContent:'space-between',opacity:enter}}>{[['NUTZER','Wer?'],['EINGABE','Was kommt rein?'],['ERGEBNIS','Was passiert?']].map(([a,b],index)=><div key={a} style={{width:330,textAlign:'center',transform:`translateY(${(1-enter)*(30+index*12)}px)`}}><div style={{fontFamily:BRAND.font,fontSize:24,fontWeight:950,color:PURPLE}}>{a}</div><div style={{marginTop:10,fontFamily:BRAND.font,fontSize:38,fontWeight:900,color:INK}}>{b}</div></div>)}</div>
    <div style={{position:'absolute',left:375,right:375,top:500,display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap',opacity:filter}}>{extras.map((item,index)=><div key={item} style={{fontFamily:BRAND.font,fontSize:25,fontWeight:850,color:MUTED,textDecoration:'line-through',opacity:.36+.42*(1-filter),transform:`translateY(${filter*(65+index*6)}px) scale(${1-.15*filter})`}}>{item}</div>)}</div>
    <div style={{position:'absolute',left:520,right:520,bottom:76,textAlign:'center',fontFamily:BRAND.font,fontSize:40,fontWeight:950,color:INK,opacity:lock}}>Nur der <span style={{color:PURPLE}}>kleinste sinnvolle Scope</span></div>
  </div>;
};

export const FlowVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const draw=p(frame,40,420);
  const travel=p(frame,300,760);
  const settle=p(frame,720,980);
  const points=[{x:210,y:390,label:'EINGABE'},{x:600,y:210,label:'DATEN'},{x:1030,y:570,label:'AKTION'},{x:1490,y:310,label:'ZUSTAND'}];
  const x=interpolate(travel,[0,.32,.66,1],[210,600,1030,1490]);
  const y=interpolate(travel,[0,.32,.66,1],[390,210,570,310]);
  return <div style={stage}>
    <Grid opacity={.20}/>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M210 390 C390 390 400 210 600 210 S820 570 1030 570 S1260 310 1490 310" fill="none" stroke="rgba(110,69,201,.12)" strokeWidth="30" strokeLinecap="round"/>
      <path d="M210 390 C390 390 400 210 600 210 S820 570 1030 570 S1260 310 1490 310" fill="none" stroke={PURPLE} strokeWidth="8" strokeLinecap="round" strokeDasharray="1700" strokeDashoffset={dash(draw,1700)}/>
      {points.map((point,index)=>{const show=p(draw,index*.18,Math.min(1,index*.18+.32));return <React.Fragment key={point.label}><circle cx={point.x} cy={point.y} r="62" fill="#fff" stroke={index===3?OK:'rgba(110,69,201,.26)'} strokeWidth="4" opacity={show}/><text x={point.x} y={point.y+8} textAnchor="middle" fill={index===3?OK:PURPLE} fontFamily={BRAND.font} fontSize="22" fontWeight="950" opacity={show}>{point.label}</text></React.Fragment>})}
      <circle cx={x} cy={y} r="22" fill={ACCENT} stroke="#fff" strokeWidth="7" opacity={travel}/>
    </svg>
    <div style={{position:'absolute',right:170,bottom:76,fontFamily:BRAND.font,fontSize:38,fontWeight:950,color:INK,opacity:settle}}>Jeder Klick braucht einen <span style={{color:PURPLE}}>sichtbaren Zustand</span></div>
  </div>;
};

export const RepoVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const layers=p(frame,20,360);
  const history=p(frame,330,720);
  const resolve=p(frame,690,930);
  const files=['ui/','logic/','data/','components/'];
  return <div style={{...stage,perspective:1100}}>
    <Grid opacity={.18}/>
    <div style={{position:'absolute',left:180,top:110,width:650,height:530,transformStyle:'preserve-3d',transform:`rotateX(${interpolate(layers,[0,1],[16,6])}deg) rotateY(${interpolate(layers,[0,1],[-10,4])}deg)`}}>
      {files.map((file,index)=>{const local=p(layers,index*.14,Math.min(1,index*.14+.38));return <div key={file} style={{position:'absolute',left:80+index*48,top:90+index*78,width:430,height:100,borderRadius:26,background:index===0?'linear-gradient(135deg,#EEE4FF,#FFFFFF)':'#fff',border:'2px solid rgba(110,69,201,.18)',boxShadow:'0 18px 40px rgba(26,26,46,.08)',display:'flex',alignItems:'center',paddingLeft:34,fontFamily:BRAND.font,fontSize:30,fontWeight:900,color:index===0?PURPLE:INK,opacity:local,transform:`translateZ(${index*32}px) translateX(${(1-local)*(index%2?70:-70)}px)`}}>{file}</div>})}
    </div>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M940 420 H1540" stroke="rgba(110,69,201,.12)" strokeWidth="22" strokeLinecap="round"/>
      <path d="M940 420 H1540" stroke={PURPLE} strokeWidth="7" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={dash(history,600)}/>
      {[980,1160,1340,1520].map((x,index)=><React.Fragment key={x}><circle cx={x} cy="420" r="28" fill={history>index/4?PURPLE:'#E3DBEA'} stroke="#fff" strokeWidth="8"/><text x={x} y="485" textAnchor="middle" fill={MUTED} fontFamily={BRAND.font} fontSize="20" fontWeight="900" opacity={history}>c{index+1}</text></React.Fragment>)}
    </svg>
    <div style={{position:'absolute',right:165,top:190,fontFamily:BRAND.font,fontSize:28,fontWeight:950,color:PURPLE,opacity:history}}>VERSIONEN</div>
    <div style={{position:'absolute',right:150,bottom:74,fontFamily:BRAND.font,fontSize:38,fontWeight:950,color:INK,opacity:resolve}}>Repo = Struktur + <span style={{color:PURPLE}}>Gedächtnis</span></div>
  </div>;
};

export const BuildVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const brief=p(frame,0,420);
  const compile=p(frame,390,850);
  const confirm=p(frame,820,1180);
  const fields=['IST-ZUSTAND','ÄNDERUNG','GRENZE','TEST'];
  return <div style={stage}>
    <Grid opacity={.22}/>
    <div style={{position:'absolute',left:120,top:120,width:560}}>{fields.map((field,index)=>{const local=p(brief,index*.14,Math.min(1,index*.14+.42));return <div key={field} style={{height:92,marginBottom:18,display:'flex',alignItems:'center',gap:24,opacity:local,transform:`translateX(${(1-local)*-50}px)`}}><div style={{width:54,height:54,borderRadius:'50%',background:index<=Math.floor(brief*4)?PURPLE:'rgba(110,69,201,.12)',color:'#fff',display:'grid',placeItems:'center',fontFamily:BRAND.font,fontWeight:950,fontSize:22}}>{index+1}</div><div style={{fontFamily:BRAND.font,fontSize:30,fontWeight:900,color:index<=Math.floor(brief*4)?INK:MUTED}}>{field}</div></div>})}</div>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M690 390 C850 390 850 240 1010 240 C1180 240 1180 540 1360 540" fill="none" stroke="rgba(110,69,201,.12)" strokeWidth="28" strokeLinecap="round"/>
      <path d="M690 390 C850 390 850 240 1010 240 C1180 240 1180 540 1360 540" fill="none" stroke={PURPLE} strokeWidth="8" strokeLinecap="round" strokeDasharray="980" strokeDashoffset={dash(compile,980)}/>
      <circle cx="1360" cy="540" r="88" fill={confirm>.6?'rgba(79,157,116,.12)':'#fff'} stroke={confirm>.6?OK:'rgba(110,69,201,.24)'} strokeWidth="5" opacity={compile}/>
      <text x="1360" y="548" textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="950" fill={confirm>.6?OK:PURPLE} opacity={compile}>{confirm>.6?'BESTANDEN':'BUILD'}</text>
    </svg>
    <div style={{position:'absolute',left:740,top:310,fontFamily:BRAND.font,fontSize:27,fontWeight:900,color:MUTED,opacity:compile}}>konkrete Änderung</div>
    <div style={{position:'absolute',right:150,bottom:70,fontFamily:BRAND.font,fontSize:38,fontWeight:950,color:INK,opacity:confirm}}>Kleine Schritte sind <span style={{color:OK}}>prüfbar</span></div>
  </div>;
};

export const TestVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const scan=p(frame,60,520);
  const detect=p(frame,440,760);
  const patch=p(frame,730,1060);
  const verify=p(frame,1030,1320);
  const scanX=interpolate(scan,[0,1],[420,1320]);
  return <div style={stage}>
    <Grid opacity={.16}/>
    <div style={{position:'absolute',left:320,top:105,width:1080,height:560,borderRadius:48,border:'3px solid rgba(110,69,201,.20)',background:'rgba(255,255,255,.72)',overflow:'hidden'}}>
      <div style={{position:'absolute',left:70,right:70,top:70,height:65,borderRadius:20,background:'rgba(185,140,255,.12)'}}/>
      <div style={{position:'absolute',left:100,top:190,width:580,height:260,borderRadius:30,border:'2px solid rgba(110,69,201,.16)'}}/>
      <div style={{position:'absolute',right:100,top:210,width:220,height:90,borderRadius:24,background:PURPLE}}/>
      <div style={{position:'absolute',left:scanX-320,top:0,width:120,height:'100%',background:'linear-gradient(90deg,transparent,rgba(185,140,255,.24),transparent)',borderLeft:'2px solid rgba(110,69,201,.32)',borderRight:'2px solid rgba(110,69,201,.18)'}}/>
      <div style={{position:'absolute',left:640,top:180,width:95,height:95,borderRadius:'50%',border:`4px solid ${patch>.65?OK:BAD}`,background:patch>.65?'rgba(79,157,116,.12)':'rgba(217,92,106,.12)',opacity:detect,transform:`scale(${.82+.18*detect})`}}/>
    </div>
    <div style={{position:'absolute',left:250,top:690,fontFamily:BRAND.font,fontSize:29,fontWeight:900,color:detect?BAD:MUTED,opacity:detect}}>FEHLER REPRODUZIERT</div>
    <div style={{position:'absolute',left:720,top:690,fontFamily:BRAND.font,fontSize:29,fontWeight:900,color:PURPLE,opacity:patch}}>LOKAL PATCHEN</div>
    <div style={{position:'absolute',right:210,top:690,fontFamily:BRAND.font,fontSize:29,fontWeight:950,color:OK,opacity:verify}}>✓ VERIFIZIERT</div>
  </div>;
};

export const BranchVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const split=p(frame,40,300);
  const work=p(frame,270,560);
  const review=p(frame,540,780);
  const merge=p(frame,760,980);
  return <div style={{...stage,perspective:1150}}>
    <Grid opacity={.18}/>
    <div style={{position:'absolute',left:170,right:170,top:125,height:560,transformStyle:'preserve-3d',transform:`rotateX(${interpolate(split,[0,1],[14,5])}deg)`}}>
      <div style={{position:'absolute',left:40,right:40,top:85,height:94,borderRadius:47,background:'linear-gradient(90deg,#F1ECF8,#FFFFFF)',border:'3px solid rgba(110,69,201,.20)'}}/>
      <div style={{position:'absolute',left:100,right:150,top:315,height:94,borderRadius:47,background:'linear-gradient(90deg,#F7F2FF,#EBDDFF)',border:'3px solid rgba(185,140,255,.34)',opacity:split,transform:`translateZ(${55*split}px) translateY(${(1-split)*-130}px)`}}/>
      <div style={{position:'absolute',left:90,top:110,fontFamily:BRAND.font,fontSize:28,fontWeight:950,color:PURPLE}}>MAIN · STABIL</div>
      <div style={{position:'absolute',left:150,top:340,fontFamily:BRAND.font,fontSize:28,fontWeight:950,color:ACCENT,opacity:split}}>EXPERIMENT</div>
      <div style={{position:'absolute',left:260+work*510,top:327,width:68,height:68,borderRadius:'50%',background:ACCENT,opacity:split}}/>
      <div style={{position:'absolute',right:155,top:235,width:180,height:180,borderRadius:'50%',border:'4px dashed rgba(110,69,201,.30)',display:'grid',placeItems:'center',opacity:review,transform:`translateZ(${95*review}px)`}}><div style={{fontFamily:BRAND.font,fontSize:23,fontWeight:950,color:PURPLE,textAlign:'center'}}>PULL<br/>REQUEST</div></div>
      <div style={{position:'absolute',right:75,top:64,width:120,height:120,borderRadius:'50%',border:`4px solid ${merge>.7?OK:'rgba(110,69,201,.20)'}`,background:merge>.7?'rgba(79,157,116,.12)':'#fff',display:'grid',placeItems:'center',fontFamily:BRAND.font,fontSize:23,fontWeight:950,color:merge>.7?OK:MUTED,opacity:review}}>MERGE</div>
      <svg viewBox="0 0 1400 560" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><path d="M780 362 C1020 362 1120 210 1240 130" fill="none" stroke={OK} strokeWidth="8" strokeLinecap="round" strokeDasharray="620" strokeDashoffset={dash(merge,620)} opacity={review}/></svg>
    </div>
    <div style={{position:'absolute',right:160,bottom:72,fontFamily:BRAND.font,fontSize:38,fontWeight:950,color:INK,opacity:merge}}>Experimentieren ohne <span style={{color:PURPLE}}>Main zu gefährden</span></div>
  </div>;
};

export const FinishVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const nodes=p(frame,20,420);
  const connect=p(frame,390,820);
  const resolve=p(frame,790,1180);
  const items=[
    {label:'PROBLEM',x:300,y:220},
    {label:'FLOW',x:600,y:540},
    {label:'REPO',x:900,y:180},
    {label:'BUILD',x:1190,y:540},
    {label:'TEST',x:1490,y:230},
  ];
  return <div style={stage}>
    <Grid opacity={.22}/>
    <svg viewBox="0 0 1740 790" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {items.map((item,index)=>{const local=p(nodes,index*.12,Math.min(1,index*.12+.42));return <React.Fragment key={item.label}><path d={`M870 390 Q${(870+item.x)/2} ${(390+item.y)/2+(index%2?45:-45)} ${item.x} ${item.y}`} fill="none" stroke="rgba(110,69,201,.24)" strokeWidth="4" strokeDasharray="560" strokeDashoffset={dash(connect,560)}/><circle cx={item.x} cy={item.y} r="66" fill="#fff" stroke={item.label==='TEST'?OK:'rgba(110,69,201,.24)'} strokeWidth="4" opacity={local}/><text x={item.x} y={item.y+8} textAnchor="middle" fontFamily={BRAND.font} fontSize="22" fontWeight="950" fill={item.label==='TEST'?OK:PURPLE} opacity={local}>{item.label}</text></React.Fragment>})}
      <circle cx="870" cy="390" r={100+resolve*35} fill="rgba(185,140,255,.10)" stroke={PURPLE} strokeWidth="5" opacity={connect}/>
      <circle cx="870" cy="390" r="58" fill={resolve>.65?'rgba(79,157,116,.14)':'#fff'} stroke={resolve>.65?OK:PURPLE} strokeWidth="4" opacity={connect}/>
      <text x="870" y="398" textAnchor="middle" fontFamily={BRAND.font} fontSize="24" fontWeight="950" fill={resolve>.65?OK:PURPLE} opacity={connect}>{resolve>.65?'✓':'APP'}</text>
    </svg>
    <div style={{position:'absolute',left:410,right:410,bottom:62,textAlign:'center',fontFamily:BRAND.font,fontSize:40,fontWeight:950,color:INK,opacity:resolve}}>Fertig heißt: <span style={{color:OK}}>nachvollziehbar überprüft</span></div>
  </div>;
};
