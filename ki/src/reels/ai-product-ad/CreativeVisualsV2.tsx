import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';

const purple=BRAND.accentDk;
const accent=BRAND.accent;
const soft='#EFE7FF';
const muted='#746E7D';
const line='#DDD4E8';
const danger='#D85D67';
const success='#36A779';
const ink=BRAND.ink;
const p=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

const Product:React.FC<{scale?:number;color?:string;label?:string;glow?:boolean}>=({scale=1,color=purple,label='NOVA',glow=false})=><div style={{width:190*scale,height:330*scale,borderRadius:46*scale,background:`linear-gradient(160deg,#fff 0%,${soft} 52%,#fff 100%)`,border:`5px solid ${color}`,boxShadow:glow?`0 0 70px ${color}44`:'0 20px 44px rgba(61,42,89,.13)',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{position:'absolute',top:24*scale,width:92*scale,height:13*scale,borderRadius:999,background:color,opacity:.25}}/><div style={{fontSize:40*scale,fontWeight:950,letterSpacing:1.5,color}}>{label}</div><div style={{position:'absolute',bottom:34*scale,width:66*scale,height:66*scale,borderRadius:'50%',background:color,opacity:.15}}/></div>;

export const VaguePromptVisual:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const enter=spring({frame:f,fps,config:{damping:18,stiffness:125}});const split=p(f,115,310);const variants=[{name:'Luxus',color:'#6E45C9',angle:-25},{name:'Neon',color:'#9A50E8',angle:0},{name:'Natur',color:'#4F8F72',angle:25}];return <div style={{position:'absolute',inset:0}}>
  <div style={{position:'absolute',left:100,top:275,opacity:.3+.7*enter,transform:`scale(${.82+.18*enter})`}}><Product scale={1.28} glow/></div>
  <div style={{position:'absolute',left:70,top:760,width:330,fontSize:31,fontWeight:950,color:danger,opacity:p(f,230,330)}}>„Mach daraus Werbung“<br/><span style={{fontSize:26,color:muted}}>zu viele mögliche Richtungen</span></div>
  <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>{variants.map((v,i)=>{const targetX=625+i*145;const targetY=250+Math.abs(i-1)*170;const show=p(f,100+i*26,160+i*26);return <path key={v.name} d={`M380 450 C500 450, 500 ${targetY}, ${targetX} ${targetY}`} fill="none" stroke={v.color} strokeWidth="7" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520*(1-show*split)}/>})}</svg>
  {variants.map((v,i)=>{const show=p(f,130+i*28,185+i*28);return <div key={v.name} style={{position:'absolute',left:545+i*145,top:125+Math.abs(i-1)*170,opacity:show,transform:`rotate(${v.angle*(1-split)}deg) scale(${.68+.25*show})`}}><Product scale={.58} color={v.color} label={i===1?'N0VA':'NOVA'}/><div style={{marginTop:10,textAlign:'center',fontSize:24,fontWeight:950,color:v.color}}>{v.name}</div></div>})}
  <div style={{position:'absolute',right:90,top:910,fontSize:38,fontWeight:950,color:danger,opacity:p(f,315,385)}}>schön ≠ gezielt</div>
</div>};

export const CreativeBriefVisual:React.FC=()=>{const f=useCurrentFrame();const orbit=p(f,20,250);const storyboard=p(f,210,415);const items=[{label:'PRODUKT',sub:'Nutzen',angle:-150},{label:'ZIELGRUPPE',sub:'für wen?',angle:-30},{label:'STIMMUNG',sub:'clean · premium',angle:90}];return <div style={{position:'absolute',inset:0}}>
  <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
    <circle cx="540" cy="370" r="132" fill={soft} stroke={accent} strokeWidth="6"/>
    <text x="540" y="354" textAnchor="middle" fontFamily={BRAND.font} fontSize="23" fontWeight="850" fill={muted}>CREATIVE</text><text x="540" y="402" textAnchor="middle" fontFamily={BRAND.font} fontSize="39" fontWeight="950" fill={purple}>BRIEF</text>
    {items.map((item,i)=>{const r=260;const a=item.angle*Math.PI/180;const x=540+Math.cos(a)*r;const y=370+Math.sin(a)*r;const show=p(f,20+i*45,70+i*45);return <g key={item.label} opacity={show}><path d={`M540 370 L${x} ${y}`} stroke={i===2?purple:line} strokeWidth={i===2?8:5} strokeDasharray="280" strokeDashoffset={280*(1-orbit)}/><circle cx={x} cy={y} r="86" fill="#fff" stroke={i===2?accent:line} strokeWidth="5"/><text x={x} y={y-7} textAnchor="middle" fontFamily={BRAND.font} fontSize="20" fontWeight="950" fill={i===2?purple:muted}>{item.label}</text><text x={x} y={y+31} textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="900" fill={ink}>{item.sub}</text></g>})}
    <path d="M125 835 H955" stroke="#E9E3EE" strokeWidth="28" strokeLinecap="round"/>
    <path d="M125 835 H955" stroke={purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="830" strokeDashoffset={830*(1-storyboard)}/>
    {['Einstieg','Produkt','Nutzen','Detail','Abschluss'].map((label,i)=>{const x=145+i*202;const show=p(f,220+i*35,260+i*35);return <g key={label} opacity={show}><circle cx={x} cy="835" r="45" fill={i===1?soft:'#fff'} stroke={i===1?accent:line} strokeWidth="4"/><text x={x} y="915" textAnchor="middle" fontFamily={BRAND.font} fontSize="20" fontWeight="900" fill={i===1?purple:muted}>{label}</text></g>})}
  </svg>
</div>};

export const ConsistentKeyframesVisual:React.FC=()=>{const f=useCurrentFrame();const lock=p(f,35,170);const fix=p(f,130,225);const positions=[160,405,650,895];return <div style={{position:'absolute',inset:0}}>
  <svg width="1080" height="1100" style={{position:'absolute',inset:0}}><path d="M135 620 H930" stroke={line} strokeWidth="6" strokeDasharray="16 14"/><path d="M135 620 H930" stroke={success} strokeWidth="8" strokeDasharray="795" strokeDashoffset={795*(1-fix)} opacity={p(f,115,180)}/></svg>
  {positions.map((x,i)=>{const show=p(f,20+i*22,60+i*22);const bad=i===2&&fix<.62;return <div key={x} style={{position:'absolute',left:x-78,top:245+(i%2)*35,opacity:show,transform:`translateY(${(1-lock)*(i%2?28:-22)}px) rotate(${bad?4*(1-fix):0}deg)`}}><Product scale={.72} color={bad?danger:purple} label={bad?'N0VA':'NOVA'}/><div style={{marginTop:16,textAlign:'center',fontSize:23,fontWeight:950,color:bad?danger:muted}}>{['Hero','Nutzen','Detail','Finale'][i]}</div></div>})}
  <div style={{position:'absolute',left:220,right:220,top:880,textAlign:'center',fontSize:36,fontWeight:950,color:fix>.8?success:danger,opacity:p(f,105,165)}}>{fix>.8?'Form · Farbe · Umgebung bleiben stabil ✓':'Konsistenz wird geprüft'}</div>
</div>};

export const MotionAssemblyVisual:React.FC=()=>{const f=useCurrentFrame();const flow=p(f,20,150);const rotate=interpolate(flow,[0,1],[0,18]);const trail=p(f,45,150);return <div style={{position:'absolute',inset:0}}>
  <div style={{position:'absolute',left:105,top:250,transform:`rotate(${rotate*.15}deg) scale(${.92+.08*flow})`}}><Product scale={1.08}/></div>
  <svg width="1080" height="1100" style={{position:'absolute',inset:0}}><path d="M355 470 C500 260 660 680 855 430" fill="none" stroke="#E7E0EC" strokeWidth="30" strokeLinecap="round"/><path d="M355 470 C500 260 660 680 855 430" fill="none" stroke={purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="770" strokeDashoffset={770*(1-trail)}/><path d="M815 400 L860 430 L815 465" fill="none" stroke={purple} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={flow}/></svg>
  <div style={{position:'absolute',right:85,top:235,transform:`rotate(${-rotate*.28}deg) scale(${.8+.2*flow})`,opacity:p(f,45,110)}}><Product scale={1.08} glow/></div>
  <div style={{position:'absolute',left:120,right:120,top:820,display:'flex',justifyContent:'space-between'}}>{['Hero','Drehung','Detail','Finale'].map((label,i)=><div key={label} style={{fontSize:25,fontWeight:950,color:trail>(i+1)/4*.82?purple:muted,opacity:p(f,25+i*18,55+i*18)}}>{label}</div>)}</div>
  <div style={{position:'absolute',left:180,right:180,top:900,textAlign:'center',fontSize:34,fontWeight:950,color:purple,opacity:p(f,105,155)}}>Keyframes → kontrollierte Bewegung</div>
</div>};

export const QualityControlVisual:React.FC=()=>{const f=useCurrentFrame();const scan=p(f,25,235);const fix=p(f,190,390);const workflow=p(f,335,570);const finish=p(f,535,645);const scanY=interpolate(scan,[0,1],[245,760]);const checks=[{label:'LOGO',x:290,y:360},{label:'TEXT',x:760,y:410},{label:'PRODUKT',x:330,y:660},{label:'ÜBERGANG',x:750,y:705}];return <div style={{position:'absolute',inset:0}}>
  <div style={{position:'absolute',left:405,top:225}}><Product scale={1.25} glow={finish>.5}/></div>
  <svg width="1080" height="1100" style={{position:'absolute',inset:0}}>
    <line x1="145" x2="935" y1={scanY} y2={scanY} stroke={fix>.55?success:danger} strokeWidth="9" opacity={scan}/><rect x="145" y={scanY-18} width="790" height="36" fill={fix>.55?'rgba(54,167,121,.07)':'rgba(216,93,103,.07)'} opacity={scan}/>
    {checks.map((check,i)=>{const seen=p(f,55+i*45,105+i*45);const ok=p(f,205+i*40,265+i*40);return <g key={check.label} opacity={seen}><circle cx={check.x} cy={check.y} r="42" fill={ok>.6?'rgba(54,167,121,.14)':'rgba(216,93,103,.12)'} stroke={ok>.6?success:danger} strokeWidth="5"/><text x={check.x} y={check.y+9} textAnchor="middle" fontFamily={BRAND.font} fontSize="25" fontWeight="950" fill={ok>.6?success:danger}>{ok>.6?'✓':'!'}</text><text x={check.x} y={check.y+78} textAnchor="middle" fontFamily={BRAND.font} fontSize="20" fontWeight="900" fill={ok>.6?success:danger}>{check.label}</text></g>})}
    <path d="M130 915 H950" stroke={line} strokeWidth="26" strokeLinecap="round"/><path d="M130 915 H950" stroke={purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="820" strokeDashoffset={820*(1-workflow)}/>
    {['Produkt','Bildsprache','Keyframes','Motion','Korrektur'].map((label,i)=>{const x=145+i*198;return <g key={label} opacity={p(f,335+i*28,375+i*28)}><circle cx={x} cy="915" r="38" fill={workflow>(i+1)/5*.82?soft:'#fff'} stroke={workflow>(i+1)/5*.82?accent:line} strokeWidth="4"/><text x={x} y="990" textAnchor="middle" fontFamily={BRAND.font} fontSize="19" fontWeight="900" fill={workflow>(i+1)/5*.82?purple:muted}>{label}</text></g>})}
  </svg>
  <div style={{position:'absolute',left:190,right:190,top:1030,textAlign:'center',fontSize:35,fontWeight:950,color:success,opacity:finish}}>gezielt aufgebaute KI-Werbung ✓</div>
</div>};
