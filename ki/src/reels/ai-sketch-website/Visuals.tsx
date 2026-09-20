import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';

const OK='#4F9D74';
const BAD='#D95C6A';
const PURPLE=BRAND.accentDk;
const ACCENT=BRAND.accent;
const INK=BRAND.ink;
const MUTED='rgba(26,26,46,.58)';
const LINE='rgba(110,69,201,.18)';
const SOFT='rgba(185,140,255,.12)';
const stage:React.CSSProperties={position:'absolute',inset:'20px 40px 28px',overflow:'hidden'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const p=(frame:number,start:number,end:number)=>clamp(interpolate(frame,[start,Math.max(start+1,end)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
const dash=(progress:number,length:number)=>length*(1-progress);

const GridGlow:React.FC<{opacity?:number}>=({opacity=.42})=><div style={{position:'absolute',inset:0,opacity,backgroundImage:'linear-gradient(rgba(110,69,201,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.045) 1px,transparent 1px)',backgroundSize:'48px 48px',maskImage:'radial-gradient(circle at 50% 48%,black 0%,rgba(0,0,0,.78) 55%,transparent 86%)'}}/>;

export const SketchMeaningVisual:React.FC=()=>{
  const f=useCurrentFrame();
  const enter=p(f,0,70);
  const scan=p(f,65,250);
  const settle=p(f,230,340);
  const scanY=interpolate(scan,[0,1],[210,805]);
  const roles=[
    {label:'NAVIGATION',x:190,y:270,anchorX:355,anchorY:286,threshold:.10},
    {label:'ÜBERSCHRIFT',x:690,y:405,anchorX:605,anchorY:430,threshold:.32},
    {label:'EINGABE',x:165,y:625,anchorX:370,anchorY:635,threshold:.60},
    {label:'AKTION',x:725,y:760,anchorX:640,anchorY:748,threshold:.80},
  ];
  return <div style={stage}>
    <GridGlow opacity={.28}/>
    <div style={{position:'absolute',left:168,top:110,width:680,height:760,transform:`translateY(${(1-enter)*28}px) rotate(${interpolate(settle,[0,1],[-2.2,-.6])}deg) scale(${.94+.06*enter})`,transformOrigin:'50% 50%'}}>
      <svg viewBox="0 0 680 760" width="680" height="760" style={{filter:'drop-shadow(0 24px 34px rgba(26,26,46,.09))'}}>
        <path d="M62 42 Q335 20 618 48 L635 710 Q350 734 48 705 Z" fill="#fff" stroke="rgba(26,26,46,.16)" strokeWidth="4"/>
        <path d="M92 105 Q338 91 587 108 L590 176 Q344 187 90 174 Z" fill="none" stroke="rgba(26,26,46,.48)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M94 220 Q337 200 586 222 L582 405 Q344 422 96 399 Z" fill="none" stroke="rgba(26,26,46,.48)" strokeWidth="5"/>
        <path d="M145 478 Q342 461 538 477 L538 548 Q335 560 145 544 Z" fill="none" stroke="rgba(26,26,46,.48)" strokeWidth="5"/>
        <path d="M248 610 Q343 596 432 612 L430 680 Q338 691 246 675 Z" fill="none" stroke="rgba(26,26,46,.48)" strokeWidth="5"/>
        <path d="M118 250 Q300 235 510 248" stroke="rgba(26,26,46,.18)" strokeWidth="10" strokeLinecap="round"/>
        <path d="M118 292 Q255 280 420 290" stroke="rgba(26,26,46,.12)" strokeWidth="10" strokeLinecap="round"/>
        <line x1="60" x2="625" y1={scanY-110} y2={scanY-110} stroke={PURPLE} strokeWidth="5" opacity={.9}/>
        <rect x="58" y={scanY-150} width="570" height="80" fill="rgba(185,140,255,.08)"/>
      </svg>
    </div>
    {roles.map((role,index)=>{
      const visible=p(scan,Math.max(0,role.threshold-.08),Math.min(1,role.threshold+.06));
      return <React.Fragment key={role.label}>
        <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
          <path d={`M${role.x+(role.x<500?155:0)} ${role.y+14} C${role.x<500?role.x+230:role.x-50} ${role.y+14}, ${role.anchorX+(role.x<500?-40:40)} ${role.anchorY}, ${role.anchorX} ${role.anchorY}`} fill="none" stroke={PURPLE} strokeWidth="3" strokeDasharray="10 9" opacity={visible*.72}/>
          <circle cx={role.anchorX} cy={role.anchorY} r="8" fill={PURPLE} opacity={visible}/>
        </svg>
        <div style={{position:'absolute',left:role.x,top:role.y,minWidth:155,fontFamily:BRAND.font,fontWeight:900,fontSize:24,letterSpacing:.5,color:PURPLE,opacity:visible,transform:`translateY(${(1-visible)*10}px)`}}>{role.label}</div>
      </React.Fragment>;
    })}
    <div style={{position:'absolute',left:180,right:180,bottom:60,textAlign:'center',fontFamily:BRAND.font,fontSize:34,fontWeight:950,color:INK,opacity:p(f,280,380)}}>Die Skizze wird zu <span style={{color:PURPLE}}>Bedeutung</span></div>
  </div>;
};

export const StructureVisual:React.FC=()=>{
  const f=useCurrentFrame();
  const draw=p(f,18,170);
  const branch=p(f,145,270);
  const resolve=p(f,255,360);
  const nodes=[
    {id:'HEADER',x:220,y:310,r:64},
    {id:'HERO',x:500,y:225,r:70},
    {id:'FORM',x:780,y:315,r:68},
    {id:'FOOTER',x:500,y:720,r:66},
  ];
  return <div style={stage}>
    <GridGlow opacity={.34}/>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <circle cx="500" cy="470" r="112" fill="rgba(185,140,255,.10)" stroke={PURPLE} strokeWidth="5"/>
      <circle cx="500" cy="470" r="78" fill="#fff" stroke={LINE} strokeWidth="3"/>
      {nodes.map((node,index)=>{
        const local=p(draw,index*.18,Math.min(1,index*.18+.42));
        return <React.Fragment key={node.id}>
          <path d={`M500 470 Q${(500+node.x)/2+(index%2?45:-45)} ${(470+node.y)/2} ${node.x} ${node.y}`} fill="none" stroke={index===2?ACCENT:'rgba(110,69,201,.34)'} strokeWidth={index===2?6:4} strokeDasharray="440" strokeDashoffset={dash(local,440)} strokeLinecap="round"/>
          <circle cx={node.x} cy={node.y} r={node.r} fill="#fff" stroke={index===2?PURPLE:'rgba(110,69,201,.28)'} strokeWidth="4" opacity={local}/>
          <text x={node.x} y={node.y+8} textAnchor="middle" fill={index===2?PURPLE:INK} fontFamily={BRAND.font} fontSize="24" fontWeight="900" opacity={local}>{node.id}</text>
        </React.Fragment>;
      })}
      <path d="M780 383 C770 525 708 590 635 650" fill="none" stroke={PURPLE} strokeWidth="5" strokeDasharray="340" strokeDashoffset={dash(branch,340)} strokeLinecap="round"/>
      <path d="M780 383 C840 510 842 650 790 765" fill="none" stroke={PURPLE} strokeWidth="5" strokeDasharray="360" strokeDashoffset={dash(branch,360)} strokeLinecap="round"/>
      <circle cx="635" cy="650" r="48" fill="#fff" stroke={ACCENT} strokeWidth="4" opacity={branch}/>
      <circle cx="790" cy="765" r="48" fill="#fff" stroke={OK} strokeWidth="4" opacity={branch}/>
      <text x="635" y="658" textAnchor="middle" fill={INK} fontFamily={BRAND.font} fontSize="21" fontWeight="900" opacity={branch}>INPUT</text>
      <text x="790" y="773" textAnchor="middle" fill={OK} fontFamily={BRAND.font} fontSize="21" fontWeight="900" opacity={branch}>BUTTON</text>
      <path d="M790 813 C728 884 630 900 560 884" fill="none" stroke={OK} strokeWidth="7" strokeDasharray="250" strokeDashoffset={dash(resolve,250)} strokeLinecap="round"/>
      <path d="M575 855 L548 885 L584 900" fill="none" stroke={OK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity={resolve}/>
    </svg>
    <div style={{position:'absolute',left:420,top:430,width:160,textAlign:'center',fontFamily:BRAND.font,fontWeight:950,fontSize:29,color:PURPLE}}>SEITE</div>
    <div style={{position:'absolute',left:220,right:220,bottom:70,textAlign:'center',fontFamily:BRAND.font,fontWeight:900,fontSize:30,color:MUTED,opacity:p(f,230,330)}}>Struktur = <span style={{color:PURPLE}}>Beziehungen</span>, nicht nur Kästen</div>
  </div>;
};

export const LayoutVisual:React.FC=()=>{
  const f=useCurrentFrame();
  const morph=p(f,20,220);
  const hierarchy=p(f,185,310);
  const planeY=interpolate(morph,[0,1],[190,150]);
  const tilt=interpolate(morph,[0,1],[10,3]);
  const rough=[
    {x:115,y:95,w:580,h:70,dx:-28,dy:18},
    {x:175,y:230,w:455,h:105,dx:35,dy:-12},
    {x:120,y:410,w:570,h:88,dx:-18,dy:24},
    {x:290,y:570,w:230,h:92,dx:44,dy:-16},
  ];
  return <div style={{...stage,perspective:1100}}>
    <GridGlow opacity={.22}/>
    <div style={{position:'absolute',left:125,right:125,top:planeY,height:760,transformStyle:'preserve-3d',transform:`rotateX(${tilt}deg) rotateZ(${interpolate(morph,[0,1],[-2.6,0])}deg)`,transformOrigin:'50% 30%'}}>
      <div style={{position:'absolute',inset:0,borderRadius:44,background:'rgba(255,255,255,.80)',border:`3px solid ${interpolate(morph,[0,1],[.18,.34])>0.25?'rgba(110,69,201,.34)':'rgba(26,26,46,.18)'}`,boxShadow:'0 40px 90px rgba(26,26,46,.11)',transform:'translateZ(-35px)'}}/>
      <div style={{position:'absolute',left:55,right:55,top:50,height:18,borderRadius:20,background:'rgba(110,69,201,.10)'}}/>
      {rough.map((item,index)=>{
        const x=item.x+interpolate(morph,[0,1],[item.dx,0]);
        const y=item.y+interpolate(morph,[0,1],[item.dy,0]);
        const color=index===3?PURPLE:index===1?'rgba(110,69,201,.24)':'rgba(26,26,46,.15)';
        return <div key={index} style={{position:'absolute',left:x,top:y,width:item.w,height:item.h,borderRadius:index===3?30:20,border:index===3?'none':'3px solid rgba(110,69,201,.18)',background:index===3?PURPLE:'rgba(255,255,255,.72)',boxShadow:index===3?`0 20px 42px rgba(110,69,201,${.10+.16*morph})`:'none',transform:`translateZ(${index*12}px)`,opacity:.55+.45*morph}}>
          {index===1?<div style={{width:`${interpolate(hierarchy,[0,1],[60,86])}%`,height:16,borderRadius:20,background:color,margin:'30px auto 0'}}/>:null}
        </div>;
      })}
      {[{label:'24px',x:72,y:335},{label:'48px',x:715,y:440},{label:'3×',x:690,y:635}].map((guide,index)=><div key={guide.label} style={{position:'absolute',left:guide.x,top:guide.y,fontFamily:BRAND.font,fontSize:22,fontWeight:900,color:PURPLE,opacity:hierarchy,transform:`translateZ(${55+index*10}px)`}}>{guide.label}</div>)}
    </div>
    <div style={{position:'absolute',left:170,right:170,bottom:52,display:'flex',justifyContent:'space-between',fontFamily:BRAND.font,fontSize:26,fontWeight:900,color:MUTED,opacity:hierarchy}}><span>ABSTAND</span><span style={{color:PURPLE}}>HIERARCHIE</span><span>GRÖSSE</span></div>
  </div>;
};

export const FunctionVisual:React.FC=()=>{
  const f=useCurrentFrame();
  const draw=p(f,20,190);
  const travel=p(f,105,265);
  const resolve=p(f,245,340);
  const x=interpolate(travel,[0,.42,.72,1],[145,405,665,850]);
  const y=interpolate(travel,[0,.42,.72,1],[470,300,620,435]);
  return <div style={stage}>
    <GridGlow opacity={.25}/>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M145 470 C265 470 300 300 405 300 S555 620 665 620 S745 435 850 435" fill="none" stroke="rgba(110,69,201,.13)" strokeWidth="32" strokeLinecap="round"/>
      <path d="M145 470 C265 470 300 300 405 300 S555 620 665 620 S745 435 850 435" fill="none" stroke={PURPLE} strokeWidth="8" strokeLinecap="round" strokeDasharray="1020" strokeDashoffset={dash(draw,1020)}/>
      {[{x:145,y:470,label:'KLICK'},{x:405,y:300,label:'EVENT'},{x:665,y:620,label:'LOGIK'},{x:850,y:435,label:'AKTION'}].map((node,index)=>{
        const show=p(f,25+index*42,75+index*42);
        return <React.Fragment key={node.label}>
          <circle cx={node.x} cy={node.y} r={index===3?68:58} fill="#fff" stroke={index===3?OK:ACCENT} strokeWidth="5" opacity={show}/>
          <text x={node.x} y={node.y+8} textAnchor="middle" fill={index===3?OK:INK} fontFamily={BRAND.font} fontWeight="900" fontSize={index===3?23:21} opacity={show}>{node.label}</text>
        </React.Fragment>;
      })}
      <circle cx={x} cy={y} r="18" fill={PURPLE}/>
      <circle cx={x} cy={y} r="38" fill="none" stroke="rgba(110,69,201,.16)" strokeWidth="12"/>
      <circle cx="850" cy="435" r={interpolate(resolve,[0,1],[78,112])} fill="none" stroke={OK} strokeWidth="5" opacity={resolve*(1-resolve*.45)}/>
    </svg>
    <div style={{position:'absolute',left:190,right:190,bottom:68,textAlign:'center',fontFamily:BRAND.font,fontSize:33,fontWeight:950,color:resolve>.65?OK:INK,opacity:p(f,205,300)}}>{resolve>.65?'Funktion bestätigt':'Aussehen → Verhalten'}</div>
  </div>;
};

export const TestPrototypeVisual:React.FC=()=>{
  const f=useCurrentFrame();
  const scan=p(f,15,185);
  const bug=p(f,120,225);
  const patch=p(f,215,350);
  const verified=p(f,340,455);
  const scanY=interpolate(scan,[0,1],[180,780]);
  const mobileShift=interpolate(patch,[0,1],[30,0]);
  return <div style={{...stage,perspective:1050}}>
    <GridGlow opacity={.25}/>
    <div style={{position:'absolute',left:115,top:150,width:500,height:600,border:'4px solid rgba(26,26,46,.20)',borderRadius:34,background:'rgba(255,255,255,.72)',boxShadow:'0 28px 70px rgba(26,26,46,.08)',transform:'rotateY(5deg) translateZ(10px)'}}>
      <div style={{position:'absolute',left:28,right:28,top:28,height:54,borderRadius:14,background:SOFT}}/>
      <div style={{position:'absolute',left:52,right:52,top:135,height:230,border:'3px solid rgba(110,69,201,.18)',borderRadius:24}}/>
      <div style={{position:'absolute',left:145,right:145,bottom:78,height:72,borderRadius:24,background:PURPLE}}/>
      <div style={{position:'absolute',left:28,top:100,fontFamily:BRAND.font,fontWeight:900,fontSize:23,color:MUTED}}>DESKTOP</div>
    </div>
    <div style={{position:'absolute',right:125,top:205,width:255,height:510,border:`5px solid ${bug>.35&&patch<.72?BAD:'rgba(26,26,46,.22)'}`,borderRadius:48,background:'rgba(255,255,255,.78)',boxShadow:'0 28px 70px rgba(26,26,46,.08)',transform:`rotateY(-8deg) translateZ(45px)`}}>
      <div style={{position:'absolute',left:24,right:24,top:45,height:50,borderRadius:14,background:SOFT}}/>
      <div style={{position:'absolute',left:28+mobileShift,right:28-mobileShift,top:145,height:180,border:`3px solid ${bug>.35&&patch<.72?BAD:'rgba(110,69,201,.18)'}`,borderRadius:22,transition:'none'}}/>
      <div style={{position:'absolute',left:50,right:50,bottom:62,height:66,borderRadius:23,background:PURPLE}}/>
      <div style={{position:'absolute',left:26,top:108,fontFamily:BRAND.font,fontWeight:900,fontSize:21,color:MUTED}}>MOBILE</div>
    </div>
    <div style={{position:'absolute',left:78,right:78,top:scanY,height:6,borderRadius:99,background:bug>.4&&patch<.7?BAD:PURPLE,boxShadow:`0 0 30px ${bug>.4&&patch<.7?'rgba(217,92,106,.35)':'rgba(110,69,201,.28)'}`}}/>
    <div style={{position:'absolute',left:80,right:80,top:scanY-46,height:48,background:'linear-gradient(to bottom,transparent,rgba(185,140,255,.10))'}}/>
    <div style={{position:'absolute',left:650,top:520,width:170,fontFamily:BRAND.font,fontWeight:950,fontSize:26,color:BAD,opacity:bug*(1-patch)}}>↳ MOBILE-BUG</div>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
      <path d="M760 570 C700 710 590 760 500 840" fill="none" stroke={OK} strokeWidth="7" strokeDasharray="360" strokeDashoffset={dash(patch,360)} strokeLinecap="round"/>
      <circle cx="500" cy="840" r="72" fill="rgba(79,157,116,.10)" stroke={OK} strokeWidth="5" opacity={patch}/>
      <path d="M468 840 l22 24 46-54" fill="none" stroke={OK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={verified}/>
    </svg>
    <div style={{position:'absolute',left:205,right:205,bottom:48,textAlign:'center',fontFamily:BRAND.font,fontWeight:950,fontSize:34,color:verified>.7?OK:INK,opacity:p(f,260,390)}}>{verified>.7?'Gezielt repariert · verifiziert':'Fehler lokalisieren → nur dort korrigieren'}</div>
  </div>;
};
