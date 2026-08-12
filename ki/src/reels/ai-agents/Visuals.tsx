import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const soft = '#EFE7FF';
const line = '#D8CCE9';
const muted = '#777083';
const danger = '#E35D6A';
const success = '#35A779';
const p = (f:number,a:number,b:number) => interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:'#fff',border:'2px solid #E9E1F2',borderRadius:30,boxShadow:'0 18px 46px rgba(52,35,80,.10)',...style}}>{children}</div>;

export const ChatVsAgentVisual:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const enter=spring({frame:f,fps,config:{damping:18,stiffness:120}}); const plan=p(f,110,245);
  const steps=[['1','Ziel verstehen'],['2','Schritt planen'],['3','Aktion wählen']] as const;
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:70,top:120,width:400,height:560,padding:32,opacity:enter}}><div style={{fontSize:24,fontWeight:850,color:muted}}>CHATBOT</div><div style={{marginTop:26,padding:24,borderRadius:22,background:'#F6F3F8',fontSize:31,fontWeight:850}}>Deine Nachricht</div><div style={{marginTop:20,padding:24,borderRadius:22,background:soft,fontSize:31,fontWeight:850}}>Antwort</div><div style={{marginTop:110,textAlign:'center',fontSize:28,fontWeight:850,color:muted,opacity:p(f,50,95)}}>wartet auf nächste Eingabe …</div></Card>
    <Card style={{position:'absolute',left:610,top:120,width:400,height:760,padding:32,opacity:enter,borderColor:BRAND.accent}}><div style={{fontSize:24,fontWeight:850,color:purple}}>KI-AGENT</div><div style={{marginTop:24,padding:24,borderRadius:22,background:soft,fontSize:30,fontWeight:900,color:purple}}>Ziel: Aufgabe erledigen</div><div style={{marginTop:34}}>{steps.map(([n,t],i)=>{const show=p(f,105+i*45,145+i*45);return <div key={n} style={{display:'flex',gap:18,alignItems:'center',marginBottom:24,opacity:show,transform:`translateX(${(1-show)*28}px)`}}><div style={{width:58,height:58,borderRadius:20,background:purple,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:950}}>{n}</div><div style={{fontSize:29,fontWeight:900}}>{t}</div></div>})}</div><div style={{height:8,borderRadius:999,background:'#EAE4EF',marginTop:30,overflow:'hidden'}}><div style={{height:'100%',width:`${plan*100}%`,background:purple,borderRadius:999}}/></div></Card>
  </div>;
};

export const ToolUseVisual:React.FC=()=>{
  const f=useCurrentFrame(); const tools=[['⌕','Suche'],['▤','Datei'],['</>','Code'],['▦','Daten']] as const; const centers=[[150,180],[700,180],[150,650],[700,650]];
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:390,top:365,width:300,height:240,padding:28,textAlign:'center',borderColor:BRAND.accent}}><div style={{width:88,height:88,margin:'0 auto',borderRadius:30,background:soft,display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:950,color:purple}}>A</div><div style={{fontSize:31,fontWeight:950,marginTop:18}}>Agent</div></Card>
    <svg width="1080" height="1050" style={{position:'absolute',inset:0}}>{centers.map(([x,y],i)=>{const q=p(f,45+i*35,95+i*35);return <path key={i} d={`M540 485 C540 420, ${x+115} 420, ${x+115} ${y+90}`} fill="none" stroke={i===Math.min(3,Math.floor(p(f,90,250)*4))?purple:line} strokeWidth="7" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700*(1-q)}/>})}</svg>
    {tools.map(([icon,label],i)=>{const show=p(f,35+i*30,80+i*30);const active=i===Math.min(3,Math.floor(p(f,90,250)*4));const [x,y]=centers[i];return <Card key={label} style={{position:'absolute',left:x,top:y,width:230,height:180,padding:24,textAlign:'center',opacity:show,transform:`scale(${.94+.06*show})`,borderColor:active?BRAND.accent:'#E9E1F2'}}><div style={{fontSize:38,fontWeight:950,color:active?purple:ink}}>{icon}</div><div style={{fontSize:29,fontWeight:900,marginTop:14}}>{label}</div></Card>})}
    <div style={{position:'absolute',left:270,right:270,top:890,display:'flex',justifyContent:'center',gap:16,opacity:p(f,225,285)}}>{['Fund','Datei','Resultat'].map((x,i)=><div key={x} style={{padding:'16px 22px',borderRadius:999,background:i===2?soft:'#F4F1F7',fontSize:24,fontWeight:850,color:i===2?purple:ink}}>{x}</div>)}</div>
  </div>;
};

export const PlanLoopVisual:React.FC=()=>{
  const f=useCurrentFrame(); const stage=Math.min(2,Math.floor(p(f,35,235)*3)); const nodes=[['1','PLAN','Schritt wählen'],['2','ACT','Tool ausführen'],['3','CHECK','Ergebnis prüfen']] as const; const xs=[90,390,690];
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',top:160,left:0,right:0}}>{nodes.map(([n,label,sub],i)=>{const show=p(f,30+i*45,80+i*45);const active=stage===i;return <Card key={label} style={{position:'absolute',left:xs[i],width:300,height:280,padding:26,opacity:show,borderColor:active?BRAND.accent:'#E9E1F2',transform:`translateY(${active?-10:0}px)`}}><div style={{fontSize:24,fontWeight:900,color:active?purple:muted}}>{n} · {label}</div><div style={{fontSize:34,fontWeight:950,marginTop:48}}>{sub}</div><div style={{height:12,borderRadius:999,background:active?BRAND.accent:'#EDE8F2',marginTop:50}}/></Card>})}</div>
    <svg width="1080" height="1050" style={{position:'absolute',inset:0}}><path d="M240 470 C340 560 430 560 540 470 C650 380 760 380 840 470" fill="none" stroke={purple} strokeWidth="8" strokeLinecap="round" opacity={p(f,120,190)}/><path d="M840 470 C900 650 770 790 540 790 C310 790 180 650 240 470" fill="none" stroke={line} strokeWidth="6" strokeLinecap="round" strokeDasharray="18 16" opacity={p(f,180,250)}/></svg>
    <Card style={{position:'absolute',left:300,top:690,width:480,padding:30,textAlign:'center',opacity:p(f,205,270),borderColor:success}}><div style={{fontSize:25,fontWeight:850,color:success}}>ERGEBNIS</div><div style={{fontSize:36,fontWeight:950,marginTop:10}}>prüfen → nächsten Schritt wählen</div></Card>
  </div>;
};

export const PermissionCascadeVisual:React.FC=()=>{
  const f=useCurrentFrame(); const expand=p(f,35,150); const cascade=p(f,155,285); const actions=['Datei ändern','Mail senden','Daten löschen'] as const;
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:540-(150+210*expand),top:130,width:(300+420*expand),height:(300+420*expand),borderRadius:'50%',border:`5px solid ${expand>.65?danger:BRAND.accent}`,background:expand>.65?'rgba(227,93,106,.05)':'rgba(185,140,255,.08)'}}/>
    <Card style={{position:'absolute',left:390,top:270,width:300,padding:30,textAlign:'center',borderColor:expand>.65?danger:BRAND.accent}}><div style={{fontSize:25,fontWeight:850,color:muted}}>BERECHTIGUNGEN</div><div style={{fontSize:38,fontWeight:950,marginTop:10,color:expand>.65?danger:purple}}>{expand>.65?'zu weit':'begrenzt'}</div></Card>
    <div style={{position:'absolute',left:140,right:140,top:690,display:'flex',gap:18,justifyContent:'center'}}>{actions.map((a,i)=>{const show=p(f,165+i*34,205+i*34);const fail=i<=Math.floor(cascade*3);return <Card key={a} style={{width:245,height:155,padding:20,textAlign:'center',opacity:show,borderColor:fail?danger:'#E9E1F2',transform:`translateY(${fail?10:0}px)`}}><div style={{fontSize:24,fontWeight:950,color:fail?danger:ink}}>{fail?'!':'✓'}</div><div style={{fontSize:24,fontWeight:850,marginTop:18}}>{a}</div></Card>})}</div>
    <div style={{position:'absolute',left:250,right:250,top:900,textAlign:'center',fontSize:31,fontWeight:950,color:danger,opacity:p(f,235,300)}}>ein Fehler → mehrere Folgeaktionen</div>
  </div>;
};

export const GuardrailVisual:React.FC=()=>{
  const f=useCurrentFrame(); const approve=p(f,170,235); const execute=p(f,235,300); const tools=[['Suche',true],['Datei lesen',true],['Löschen',false]] as const;
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:90,top:110,width:360,padding:30}}><div style={{fontSize:24,fontWeight:850,color:purple}}>ERLAUBTE TOOLS</div><div style={{marginTop:24}}>{tools.map(([t,ok],i)=><div key={t} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 0',borderBottom:i<tools.length-1?'1px solid #EEE8F2':'none',opacity:p(f,25+i*25,65+i*25)}}><span style={{fontSize:27,fontWeight:850}}>{t}</span><span style={{width:46,height:28,borderRadius:999,background:ok?success:'#D8D1DD',position:'relative'}}><span style={{position:'absolute',top:4,left:ok?22:4,width:20,height:20,borderRadius:'50%',background:'#fff'}}/></span></div>)}</div></Card>
    <Card style={{position:'absolute',left:560,top:120,width:430,padding:30,textAlign:'center',borderColor:approve>.8?success:BRAND.accent}}><div style={{fontSize:24,fontWeight:850,color:muted}}>KRITISCHE AKTION</div><div style={{fontSize:36,fontWeight:950,marginTop:18}}>vor Ausführung stoppen</div><div style={{marginTop:34,padding:'20px 28px',borderRadius:22,background:approve>.8?'rgba(53,167,121,.12)':soft,fontSize:29,fontWeight:950,color:approve>.8?success:purple}}>{approve>.8?'Mensch bestätigt ✓':'Bestätigung erforderlich'}</div></Card>
    <svg width="1080" height="1000" style={{position:'absolute',inset:0}}><path d="M450 430 C520 430 540 430 560 430" stroke={purple} strokeWidth="8" fill="none" strokeLinecap="round" opacity={p(f,120,165)}/><path d="M775 500 C775 650 650 720 540 720" stroke={success} strokeWidth="8" fill="none" strokeLinecap="round" opacity={execute}/></svg>
    <Card style={{position:'absolute',left:300,top:720,width:480,padding:30,textAlign:'center',opacity:execute,borderColor:success}}><div style={{fontSize:25,fontWeight:850,color:success}}>KONTROLLIERTE AKTION</div><div style={{fontSize:35,fontWeight:950,marginTop:10}}>Sprache → Plan → Tool → Aktion</div></Card>
  </div>;
};
