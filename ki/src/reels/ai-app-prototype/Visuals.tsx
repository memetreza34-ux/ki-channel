import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const ink = BRAND.ink;
const purple = BRAND.accentDk;
const soft = '#EFE7FF';
const line = '#D8CCE9';
const muted = '#6F6879';
const danger = '#E35D6A';
const success = '#35A779';
const p = (f:number,a:number,b:number) => interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:'#fff',border:'2px solid #E8DFF2',borderRadius:32,boxShadow:'0 18px 46px rgba(52,35,80,.10)',...style}}>{children}</div>;

export const IdeaToPrototypeVisual:React.FC=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame:f,fps,config:{damping:19,stiffness:120}}); const connect=p(f,45,125); const warn=p(f,185,270);
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:70,top:150,width:390,height:600,padding:34,opacity:.36+.64*enter,transform:`translateY(${(1-enter)*18}px)`}}>
      <div style={{fontSize:29,fontWeight:900,color:purple}}>IDEE</div>
      <div style={{fontSize:46,fontWeight:950,lineHeight:1.08,marginTop:34}}>Gewohnheiten einfacher verfolgen</div>
      <div style={{marginTop:46,padding:'24px 26px',borderRadius:24,background:warn>.55?'rgba(227,93,106,.10)':soft,border:`2px solid ${warn>.55?danger:'transparent'}`}}>
        <div style={{fontSize:28,fontWeight:850,color:warn>.55?danger:muted}}>PROMPT</div>
        <div style={{fontSize:34,fontWeight:950,marginTop:10}}>„Schreib mir eine App“</div>
        <div style={{fontSize:30,fontWeight:900,marginTop:20,color:danger,opacity:warn}}>zu offen</div>
      </div>
    </Card>
    <svg width="1080" height="1050" style={{position:'absolute',inset:0}}><path d="M465 455 C535 455 545 455 610 455" fill="none" stroke={purple} strokeWidth="10" strokeLinecap="round" strokeDasharray="180" strokeDashoffset={180*(1-connect)}/><path d="M590 430 L620 455 L590 480" fill="none" stroke={purple} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={connect}/></svg>
    <Card style={{position:'absolute',left:610,top:95,width:400,height:770,padding:28,opacity:.28+.72*p(f,25,105),borderColor:BRAND.accent}}>
      <div style={{fontSize:28,fontWeight:900,color:purple}}>APP-PROTOTYP</div>
      <div style={{marginTop:26,height:94,borderRadius:26,background:soft,padding:24,fontSize:35,fontWeight:950}}>Heute</div>
      {[['Wasser','3/5'],['Lesen','1/1'],['Sport','0/1']].map(([a,b],i)=><div key={a} style={{marginTop:22,padding:'24px 22px',borderRadius:24,background:'#F8F5FB',display:'flex',justifyContent:'space-between',alignItems:'center',opacity:p(f,70+i*28,110+i*28)}}><span style={{fontSize:32,fontWeight:900}}>{a}</span><span style={{fontSize:30,fontWeight:950,color:i<2?success:muted}}>{b}</span></div>)}
      <div style={{position:'absolute',left:28,right:28,bottom:30,padding:'22px 24px',borderRadius:24,background:purple,color:'#fff',fontSize:32,fontWeight:950,textAlign:'center'}}>+ Eintrag</div>
    </Card>
  </div>;
};

export const StructurePlanVisual:React.FC=()=>{
  const f=useCurrentFrame(); const tiles=[['ZIEL','Gewohnheiten'],['UI','Übersicht'],['EINGABE','Eintrag'],['LOGIK','Fortschritt']] as const;
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:75,top:115,width:930,height:830,padding:34,borderColor:BRAND.accent}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:29,fontWeight:900,color:purple}}>APP-PLAN</div><div style={{fontSize:40,fontWeight:950,marginTop:8}}>Erst festlegen, dann bauen</div></div><div style={{width:120,height:120,borderRadius:34,background:soft,display:'flex',alignItems:'center',justifyContent:'center',fontSize:50,fontWeight:950,color:purple}}>1→4</div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:42}}>{tiles.map(([label,value],i)=>{const show=.18+.82*p(f,18+i*44,58+i*44);const active=p(f,35+i*44,80+i*44);return <div key={label} style={{height:235,borderRadius:28,border:`3px solid ${active>.55?BRAND.accent:'#E7DFF0'}`,background:active>.55?soft:'#FAF8FC',padding:28,opacity:show,transform:`scale(${.96+.04*show})`}}><div style={{fontSize:28,fontWeight:900,color:active>.55?purple:muted}}>{label}</div><div style={{fontSize:39,fontWeight:950,marginTop:42}}>{value}</div></div>})}</div>
      <div style={{marginTop:28,height:16,borderRadius:999,background:'#ECE7F0',overflow:'hidden'}}><div style={{height:'100%',width:`${p(f,35,250)*100}%`,background:purple,borderRadius:999}}/></div>
    </Card>
  </div>;
};

export const CodeAssemblyVisual:React.FC=()=>{
  const f=useCurrentFrame(); const split=p(f,35,105); const modules=[['UI','Ansicht'],['DATEN','Einträge'],['LOGIK','Fortschritt']] as const;
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:70,top:120,width:420,height:720,padding:30}}>
      <div style={{fontSize:28,fontWeight:900,color:muted}}>CODE</div>
      <div style={{marginTop:28,height:180,borderRadius:28,background:'#F3EEF7',padding:28,opacity:1-split*.55,transform:`scale(${1-.08*split})`}}><div style={{fontSize:34,fontWeight:950}}>Ein großer Block?</div><div style={{height:16,width:'86%',background:'#C8BBD8',borderRadius:999,marginTop:32}}/><div style={{height:16,width:'68%',background:'#C8BBD8',borderRadius:999,marginTop:18}}/><div style={{height:16,width:'78%',background:'#C8BBD8',borderRadius:999,marginTop:18}}/></div>
      <div style={{marginTop:28,display:'grid',gap:18}}>{modules.map(([label,value],i)=>{const show=p(f,70+i*45,120+i*45);return <div key={label} style={{padding:'24px 26px',borderRadius:24,background:i===0?soft:'#FAF8FC',border:'2px solid #E5DAEF',opacity:show,transform:`translateX(${(1-show)*38}px)`}}><div style={{fontSize:28,fontWeight:900,color:purple}}>{label}</div><div style={{fontSize:34,fontWeight:950,marginTop:7}}>{value}</div></div>})}</div>
    </Card>
    <svg width="1080" height="1050" style={{position:'absolute',inset:0}}><path d="M500 520 C555 520 565 520 625 520" fill="none" stroke={purple} strokeWidth="10" strokeLinecap="round" strokeDasharray="190" strokeDashoffset={190*(1-p(f,145,235))}/></svg>
    <Card style={{position:'absolute',left:625,top:105,width:385,height:760,padding:28,borderColor:BRAND.accent,opacity:.25+.75*p(f,105,210)}}>
      <div style={{fontSize:28,fontWeight:900,color:purple}}>PROTOTYP</div><div style={{marginTop:28,padding:26,borderRadius:26,background:soft,fontSize:38,fontWeight:950}}>Heute</div>
      {[0,1,2].map((i)=><div key={i} style={{marginTop:22,height:112,borderRadius:24,background:'#F8F5FB',display:'flex',alignItems:'center',padding:'0 24px',gap:20,opacity:p(f,125+i*35,175+i*35)}}><div style={{width:44,height:44,borderRadius:14,background:i<2?purple:'#D5CCDF'}}/><div style={{height:18,width:i===0?190:i===1?150:180,borderRadius:999,background:'#BEB2CC'}}/></div>)}
      <div style={{position:'absolute',left:28,right:28,bottom:32,height:78,borderRadius:24,background:purple}}/>
    </Card>
  </div>;
};

export const TestFixVisual:React.FC=()=>{
  const f=useCurrentFrame(); const stage=Math.min(2,Math.floor(p(f,55,285)*3)); const items=[['BUTTON','reagiert falsch'],['DATEN','fehlen'],['MOBILE','Layout bricht']] as const;
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:65,top:100,width:420,height:820,padding:28,borderColor:stage===2?success:BRAND.accent}}>
      <div style={{fontSize:28,fontWeight:900,color:purple}}>APP-TEST</div><div style={{marginTop:26,padding:24,borderRadius:24,background:soft,fontSize:37,fontWeight:950}}>Vorschau</div>
      <div style={{marginTop:28,height:390,borderRadius:28,border:'3px solid #E6DDEC',overflow:'hidden',position:'relative',background:'#FAF8FC'}}><div style={{position:'absolute',left:24,right:stage<2?-32:24,top:28,height:82,borderRadius:20,background:'#EDE5F6',transition:'none'}}/><div style={{position:'absolute',left:24,right:24,top:132,height:82,borderRadius:20,background:'#F2EDF7'}}/><div style={{position:'absolute',left:24,right:24,top:236,height:82,borderRadius:20,background:stage>=1?'#E9F6F0':'#F8E8EA'}}/><div style={{position:'absolute',left:24,right:24,bottom:24,height:62,borderRadius:20,background:stage===0?danger:purple}}/></div>
      <div style={{marginTop:28,fontSize:32,fontWeight:950,color:stage===2?success:danger}}>{stage===2?'Layout stabil ✓':'Test läuft …'}</div>
    </Card>
    <Card style={{position:'absolute',left:540,top:135,width:470,height:735,padding:30}}><div style={{fontSize:29,fontWeight:900,color:muted}}>PRÜFPUNKTE</div><div style={{marginTop:28,display:'grid',gap:22}}>{items.map(([label,desc],i)=>{const shown=p(f,18+i*55,55+i*55);const fixed=stage>i || (stage===2&&i===2);return <div key={label} style={{padding:'26px 24px',borderRadius:26,border:`3px solid ${fixed?success:stage===i?danger:'#E7DFF0'}`,background:fixed?'rgba(53,167,121,.07)':stage===i?'rgba(227,93,106,.07)':'#FAF8FC',opacity:.28+.72*shown}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:30,fontWeight:950,color:fixed?success:stage===i?danger:ink}}>{label}</span><span style={{fontSize:34,fontWeight:950,color:fixed?success:danger}}>{fixed?'✓':'!'}</span></div><div style={{fontSize:31,fontWeight:850,marginTop:14,color:muted}}>{fixed?'korrigiert':desc}</div></div>})}</div></Card>
  </div>;
};

export const WorkflowVisual:React.FC=()=>{
  const f=useCurrentFrame(); const propose=p(f,20,95); const gate=p(f,95,180); const flow=p(f,185,390); const done=p(f,390,445); const steps=['IDEE','STRUKTUR','CODE','TEST','FIX'] as const; const active=Math.min(4,Math.floor(flow*5));
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:70,right:70,top:95,display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
      <Card style={{height:290,padding:30,borderColor:BRAND.accent,opacity:.32+.68*propose}}><div style={{fontSize:28,fontWeight:900,color:purple}}>KI-VORSCHLAG</div><div style={{fontSize:38,fontWeight:950,marginTop:30}}>Fehler gefunden</div><div style={{marginTop:26,padding:'18px 22px',borderRadius:20,background:soft,fontSize:31,fontWeight:900}}>Änderung vorschlagen</div></Card>
      <Card style={{height:290,padding:30,borderColor:gate>.72?success:'#E8DFF2',opacity:.25+.75*p(f,70,145)}}><div style={{fontSize:28,fontWeight:900,color:muted}}>FREIGABE</div><div style={{fontSize:38,fontWeight:950,marginTop:30}}>Du entscheidest</div><div style={{marginTop:26,padding:'18px 22px',borderRadius:20,background:gate>.72?'rgba(53,167,121,.10)':'#F5F1F8',fontSize:31,fontWeight:950,color:gate>.72?success:purple}}>{gate>.72?'Übernehmen ✓':'Prüfen'}</div></Card>
    </div>
    <Card style={{position:'absolute',left:70,right:70,top:430,height:390,padding:30}}><div style={{fontSize:29,fontWeight:900,color:purple}}>WORKFLOW</div><div style={{display:'flex',gap:14,marginTop:38,alignItems:'center'}}>{steps.map((s,i)=>{const on=flow>0&&(i<=active);return <React.Fragment key={s}><div style={{flex:1,height:150,borderRadius:26,border:`3px solid ${on?BRAND.accent:'#E7DFF0'}`,background:on?soft:'#FAF8FC',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:950,color:on?purple:muted,transform:`translateY(${on?-8:0}px)`}}>{s}</div>{i<steps.length-1?<div style={{fontSize:32,fontWeight:950,color:on?purple:line}}>›</div>:null}</React.Fragment>})}</div></Card>
    <Card style={{position:'absolute',left:225,right:225,top:860,height:180,padding:28,textAlign:'center',opacity:done,borderColor:success,transform:`translateY(${(1-done)*20}px)`}}><div style={{fontSize:28,fontWeight:900,color:success}}>ERGEBNIS</div><div style={{fontSize:40,fontWeight:950,marginTop:14}}>brauchbarer Prototyp ✓</div></Card>
  </div>;
};
