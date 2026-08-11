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

const p = (frame: number, a: number, b: number) => interpolate(frame, [a,b], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children,style}) => <div style={{background:'#fff',border:'2px solid #E9E1F2',borderRadius:30,boxShadow:'0 18px 46px rgba(52,35,80,.10)',...style}}>{children}</div>;
const Chip: React.FC<{label:string; active?:boolean}> = ({label,active}) => <div style={{padding:'18px 28px',borderRadius:999,background:active?soft:'#fff',border:`2px solid ${active?BRAND.accent:line}`,fontSize:30,fontWeight:850,color:active?purple:ink}}>{label}</div>;

export const BranchingPromptVisual: React.FC = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=spring({frame:f,fps,config:{damping:18,stiffness:130}});
  const branch=p(f,45,125); const cards=['Ton','Länge','Struktur','Inhalt'];
  const coords:[[number,number],[number,number],[number,number],[number,number]]=[[125,610],[315,790],[575,790],[765,610]];
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:270,top:105,width:540,padding:'34px 42px',transform:`scale(${.92+.08*enter})`,opacity:enter,textAlign:'center'}}>
      <div style={{fontSize:25,fontWeight:800,color:muted,marginBottom:12}}>PROMPT</div><div style={{fontSize:48,fontWeight:950,color:ink}}>„Mach das besser“</div>
    </Card>
    <svg width="1080" height="1000" style={{position:'absolute',left:0,top:0,overflow:'visible'}}>
      {coords.map(([x,y],i)=><path key={i} d={`M540 300 C540 ${390+i*10}, ${x+95} ${430+i*15}, ${x+95} ${y}`} fill="none" stroke={i===2?BRAND.accent:line} strokeWidth={i===2?8:5} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900*(1-branch)} opacity={.35+.65*branch}/>) }
    </svg>
    {cards.map((label,i)=>{const local=p(f,85+i*24,135+i*24); const [x,y]=coords[i]; return <Card key={label} style={{position:'absolute',left:x,top:y,width:190,padding:'26px 10px',textAlign:'center',opacity:local,transform:`translateY(${(1-local)*30}px) scale(${.94+.06*local})`,borderColor:i===2?BRAND.accent:'#E9E1F2'}}><div style={{fontSize:31,fontWeight:900,color:i===2?purple:ink}}>{label}</div></Card>})}
    <div style={{position:'absolute',left:220,right:220,top:970,textAlign:'center',fontSize:28,fontWeight:800,color:muted,opacity:p(f,190,235)}}>Ein Satz → mehrere plausible Richtungen</div>
  </div>;
};

export const ChoiceVisual: React.FC = () => {
  const f=useCurrentFrame(); const routes=['Ton','Länge','Struktur','Inhalt'];
  const selected=Math.min(3,Math.floor(p(f,55,190)*4));
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:90,top:130,width:370,padding:34}}><div style={{fontSize:24,fontWeight:800,color:muted}}>DEIN TEXT</div><div style={{fontSize:39,fontWeight:950,marginTop:12}}>„Mach das besser“</div></Card>
    <div style={{position:'absolute',left:505,top:110,width:470}}>{routes.map((r,i)=>{const show=p(f,25+i*18,75+i*18); const focus=i===selected; return <div key={r} style={{marginBottom:22,opacity:show,transform:`translateX(${(1-show)*35}px)`}}><div style={{display:'flex',justifyContent:'space-between',fontSize:27,fontWeight:850,color:focus?purple:ink}}><span>{r}</span><span>{focus?'plausibel':''}</span></div><div style={{height:18,borderRadius:999,background:'#EEE9F3',marginTop:9,overflow:'hidden'}}><div style={{height:'100%',width:`${42+i*9+(focus?18:0)}%`,background:focus?BRAND.accent:'#CFC5DA',borderRadius:999}}/></div></div>})}</div>
    <svg width="1080" height="900" style={{position:'absolute',top:0,left:0}}><path d="M455 240 C560 310, 600 430, 770 500" stroke={purple} strokeWidth="7" fill="none" strokeLinecap="round" opacity={p(f,175,220)}/></svg>
    <Card style={{position:'absolute',left:625,top:500,width:310,padding:30,textAlign:'center',opacity:p(f,180,225),borderColor:danger}}><div style={{fontSize:24,fontWeight:850,color:danger}}>DEIN EIGENTLICHES ZIEL</div><div style={{fontSize:35,fontWeight:950,marginTop:10}}>liegt daneben</div></Card>
    <div style={{position:'absolute',left:110,top:640,width:430,height:190,border:`3px dashed ${danger}`,borderRadius:36,opacity:p(f,205,250),display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:900,color:danger}}>plausibel ≠ dein Ziel</div>
  </div>;
};

export const ConstraintCollapseVisual: React.FC = () => {
  const f=useCurrentFrame();
  const chips=[['Ziel',45],['Kontext',95],['Grenzen',145]] as const;
  const collapse=p(f,150,255);
  const endpoints=[170,360,540,720,900];
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:150,right:150,top:105,display:'flex',justifyContent:'center',gap:18}}>{chips.map(([label,start])=><div key={label} style={{opacity:p(f,start,start+32),transform:`translateY(${(1-p(f,start,start+32))*22}px)`}}><Chip label={label} active={p(f,start,start+32)>.8}/></div>)}</div>
    <Card style={{position:'absolute',left:390,top:280,width:300,padding:28,textAlign:'center'}}><div style={{fontSize:36,fontWeight:950}}>dein Prompt</div></Card>
    <svg width="1080" height="900" style={{position:'absolute',left:0,top:0}}>{endpoints.map((x,i)=>{const isCenter=i===2; const op=isCenter?1:1-collapse; const ex=isCenter?x:interpolate(collapse,[0,1],[x,540]); return <path key={i} d={`M540 390 C540 500, ${ex} 530, ${ex} 690`} stroke={isCenter?purple:line} strokeWidth={isCenter?9:5} fill="none" strokeLinecap="round" opacity={op}/>})}</svg>
    {endpoints.map((x,i)=>{const isCenter=i===2; const op=isCenter?1:1-collapse; const ex=isCenter?x:interpolate(collapse,[0,1],[x,540]); const scale=isCenter ? .98 + .02*collapse : 1 - .18*collapse; return <div key={i} style={{position:'absolute',left:ex-55,top:680,width:110,height:110,borderRadius:32,background:isCenter?soft:'#fff',border:`2px solid ${isCenter?BRAND.accent:line}`,opacity:op,transform:`scale(${scale})`}}/>})}
    <div style={{position:'absolute',left:250,right:250,top:850,textAlign:'center',fontSize:38,fontWeight:950,color:purple,opacity:p(f,235,285)}}>eine klare Richtung</div>
  </div>;
};

export const ExampleAnchorVisual: React.FC = () => {
  const f=useCurrentFrame(); const dock=p(f,55,125); const build=p(f,145,270);
  return <div style={{position:'absolute',inset:0}}>
    <Card style={{position:'absolute',left:85,top:110,width:400,padding:30}}><div style={{fontSize:23,fontWeight:800,color:muted}}>PROMPT</div><div style={{fontSize:35,fontWeight:950,marginTop:10}}>„Fass das zusammen“</div></Card>
    <Card style={{position:'absolute',left:interpolate(dock,[0,1],[760,560]),top:100,width:430,padding:28,opacity:p(f,20,70),borderColor:BRAND.accent}}><div style={{fontSize:23,fontWeight:850,color:purple}}>BEISPIEL</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:18}}><div style={{height:42,borderRadius:12,background:soft}}/><div style={{height:42,borderRadius:12,background:'#EDE8F2'}}/><div style={{gridColumn:'1 / 3',height:82,borderRadius:14,background:'#F4F1F7'}}/></div></Card>
    <div style={{position:'absolute',left:490,top:285,fontSize:52,color:purple,opacity:p(f,100,145)}}>↓</div>
    <Card style={{position:'absolute',left:205,top:430,width:670,height:390,padding:34}}><div style={{fontSize:23,fontWeight:850,color:muted}}>OUTPUT</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginTop:26}}><div style={{height:62,borderRadius:14,background:soft,transform:`scaleX(${build})`,transformOrigin:'left'}}/><div style={{height:62,borderRadius:14,background:'#EDE8F2',transform:`scaleX(${p(f,175,245)})`,transformOrigin:'left'}}/><div style={{gridColumn:'1 / 3',height:145,borderRadius:16,background:'#F4F1F7',transform:`scaleX(${p(f,205,285)})`,transformOrigin:'left'}}/></div></Card>
    <div style={{position:'absolute',left:230,right:230,top:885,textAlign:'center',fontSize:31,fontWeight:900,color:purple,opacity:p(f,260,315)}}>Beispiel → gewünschte Form wird sichtbar</div>
  </div>;
};

export const ThreeStepPromptVisual: React.FC = () => {
  const f=useCurrentFrame(); const steps=[['1','Ziel','Was soll erreicht werden?'],['2','Kontext','Was muss die KI wissen?'],['3','Format','Wie soll die Antwort aussehen?']] as const;
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',left:120,right:120,top:90}}>{steps.map(([n,title,sub],i)=>{const show=p(f,30+i*55,75+i*55); return <Card key={title} style={{height:150,marginBottom:24,padding:'24px 30px',display:'flex',alignItems:'center',gap:25,opacity:show,transform:`translateX(${(1-show)*45}px)`,borderColor:show>.95?BRAND.accent:'#E9E1F2'}}><div style={{width:66,height:66,borderRadius:22,background:soft,display:'flex',alignItems:'center',justifyContent:'center',fontSize:31,fontWeight:950,color:purple}}>{n}</div><div><div style={{fontSize:36,fontWeight:950}}>{title}</div><div style={{fontSize:25,fontWeight:750,color:muted,marginTop:6}}>{sub}</div></div></Card>})}</div>
    <div style={{position:'absolute',left:260,right:260,top:690,height:9,borderRadius:999,background:'#EAE4EF',overflow:'hidden',opacity:p(f,190,230)}}><div style={{height:'100%',width:`${p(f,215,285)*100}%`,background:purple,borderRadius:999}}/></div>
    <Card style={{position:'absolute',left:285,top:760,width:510,padding:34,textAlign:'center',opacity:p(f,245,300),borderColor:success}}><div style={{fontSize:26,fontWeight:850,color:success}}>KLARE AUFGABE</div><div style={{fontSize:40,fontWeight:950,marginTop:10}}>Weniger Rätsel.<br/>Mehr Richtung.</div></Card>
  </div>;
};
