import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {easedProgress} from '../../motion/easing';

const OK='#4F9D74';
const BAD='#D95C6A';
const PURPLE=BRAND.accentDk;
const ACCENT=BRAND.accent;
const INK=BRAND.ink;
const MUTED='rgba(26,26,46,.52)';
const stage:React.CSSProperties={position:'absolute',inset:'18px 38px 28px',overflow:'hidden'};
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const progress=(frame:number,start:number,end:number)=>clamp(easedProgress(frame, start, Math.max(start+1,end)));
const dash=(value:number,length:number)=>length*(1-value);

const Grid:React.FC<{opacity?:number}>=({opacity=.3})=><div style={{position:'absolute',inset:0,opacity,backgroundImage:'linear-gradient(rgba(110,69,201,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(110,69,201,.04) 1px,transparent 1px)',backgroundSize:'52px 52px',maskImage:'radial-gradient(circle at 50% 48%,black,rgba(0,0,0,.78) 58%,transparent 88%)'}}/>;

export const FolderMemoryVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=progress(frame,0,55);
  const open=progress(frame,45,165);
  const files=progress(frame,135,250);
  const history=progress(frame,235,385);
  const lidRotate=interpolate(open,[0,1],[0,-56]);
  const fileData=[
    {name:'app.tsx',kind:'CODE',x:270,delay:0},
    {name:'hero.png',kind:'BILD',x:455,delay:.18},
    {name:'README',kind:'DOC',x:640,delay:.36},
  ];
  return <div style={{...stage,perspective:1050}}>
    <Grid opacity={.22}/>
    <div style={{position:'absolute',left:145,top:160,width:710,height:560,transformStyle:'preserve-3d',transform:`translateY(${(1-enter)*42}px) rotateX(${interpolate(enter,[0,1],[12,3])}deg) rotateZ(-1deg)`}}>
      <div style={{position:'absolute',left:62,right:62,bottom:34,height:355,borderRadius:'34px 34px 58px 58px',background:'linear-gradient(160deg,#F7F2FF,#E8DDFB)',border:'3px solid rgba(110,69,201,.24)',boxShadow:'0 42px 85px rgba(26,26,46,.13)',transform:'translateZ(-22px)'}}/>
      <div style={{position:'absolute',left:88,top:12,width:245,height:96,borderRadius:'28px 28px 10px 10px',background:'#E7DAFA',border:'3px solid rgba(110,69,201,.22)',transformOrigin:'bottom left',transform:`rotateX(${lidRotate}deg) translateZ(28px)`}}/>
      <div style={{position:'absolute',left:62,right:62,top:94,height:285,borderRadius:'42px 42px 24px 24px',background:'linear-gradient(180deg,#FFFFFF,#F3EDFD)',border:'3px solid rgba(110,69,201,.24)',transformOrigin:'bottom center',transform:`rotateX(${lidRotate*.82}deg) translateZ(46px)`,boxShadow:'0 28px 48px rgba(26,26,46,.10)'}}/>
      {fileData.map((file,index)=>{
        const local=progress(files,file.delay,Math.min(1,file.delay+.42));
        return <div key={file.name} style={{position:'absolute',left:file.x-145,top:235-interpolate(local,[0,1],[0,155+index*18]),width:160,height:190,borderRadius:24,background:index===0?'linear-gradient(180deg,#EEE4FF,#FFFFFF)':'#fff',border:'2px solid rgba(110,69,201,.18)',boxShadow:'0 18px 36px rgba(26,26,46,.09)',opacity:local,transform:`translateZ(${70+index*22}px) rotateZ(${(index-1)*3}deg)`}}>
          <div style={{height:44,borderRadius:'22px 22px 0 0',background:index===0?'rgba(185,140,255,.32)':'rgba(26,26,46,.06)',fontFamily:BRAND.font,fontSize:20,fontWeight:950,color:index===0?PURPLE:MUTED,display:'flex',alignItems:'center',justifyContent:'center'}}>{file.kind}</div>
          <div style={{position:'absolute',left:16,right:16,bottom:26,fontFamily:BRAND.font,fontSize:24,fontWeight:900,color:INK,textAlign:'center'}}>{file.name}</div>
        </div>;
      })}
    </div>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
      <path d="M180 858 C350 805 650 805 820 858" fill="none" stroke="rgba(110,69,201,.14)" strokeWidth="24" strokeLinecap="round"/>
      <path d="M180 858 C350 805 650 805 820 858" fill="none" stroke={PURPLE} strokeWidth="7" strokeLinecap="round" strokeDasharray="780" strokeDashoffset={dash(history,780)}/>
      {[210,390,580,790].map((x,index)=><circle key={x} cx={x} cy={840+(index%2?0:18)} r={15+index*2} fill={index===3?PURPLE:ACCENT} opacity={progress(history,index*.18,Math.min(1,index*.18+.28))}/>) }
    </svg>
    <div style={{position:'absolute',left:160,right:160,bottom:58,textAlign:'center',fontFamily:BRAND.font,fontSize:34,fontWeight:950,color:INK,opacity:history}}>Ordner + <span style={{color:PURPLE}}>Versionsgedächtnis</span></div>
  </div>;
};

export const ContentsVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const core=progress(frame,0,70);
  const orbit=progress(frame,55,190);
  const metadata=progress(frame,175,300);
  const angle=interpolate(orbit,[0,1],[-35,18]);
  const items=[
    {kind:'CODE',name:'app.tsx',base:-90},
    {kind:'BILD',name:'hero.png',base:0},
    {kind:'DOC',name:'README',base:90},
    {kind:'CFG',name:'.env',base:180},
  ];
  return <div style={stage}>
    <Grid opacity={.3}/>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <ellipse cx="500" cy="460" rx="320" ry="245" fill="none" stroke="rgba(110,69,201,.12)" strokeWidth="3" strokeDasharray="9 12" opacity={orbit}/>
      <ellipse cx="500" cy="460" rx="230" ry="170" fill="rgba(185,140,255,.05)" stroke="rgba(110,69,201,.10)" strokeWidth="2" opacity={core}/>
      {items.map((item,index)=>{
        const radians=(item.base+angle)*Math.PI/180;
        const x=500+Math.cos(radians)*310;
        const y=460+Math.sin(radians)*225;
        const show=progress(orbit,index*.16,Math.min(1,index*.16+.38));
        return <React.Fragment key={item.kind}>
          <path d={`M500 460 Q${(500+x)/2} ${(460+y)/2-28} ${x} ${y}`} fill="none" stroke="rgba(110,69,201,.28)" strokeWidth="4" opacity={show}/>
          <circle cx={x} cy={y} r="72" fill="#fff" stroke={index===0?PURPLE:'rgba(110,69,201,.24)'} strokeWidth="4" opacity={show}/>
          <text x={x} y={y-8} textAnchor="middle" fill={PURPLE} fontFamily={BRAND.font} fontSize="22" fontWeight="950" opacity={show}>{item.kind}</text>
          <text x={x} y={y+24} textAnchor="middle" fill={INK} fontFamily={BRAND.font} fontSize="19" fontWeight="850" opacity={show}>{item.name}</text>
        </React.Fragment>;
      })}
      <circle cx="500" cy="460" r="105" fill="#fff" stroke={PURPLE} strokeWidth="5" opacity={core}/>
      <circle cx="500" cy="460" r={62+Math.sin(frame/10)*4} fill="rgba(185,140,255,.16)" opacity={core}/>
      <text x="500" y="452" textAnchor="middle" fill={PURPLE} fontFamily={BRAND.font} fontSize="27" fontWeight="950" opacity={core}>REPO</text>
      <text x="500" y="486" textAnchor="middle" fill={MUTED} fontFamily={BRAND.font} fontSize="20" fontWeight="800" opacity={core}>Arbeitskontext</text>
    </svg>
    <div style={{position:'absolute',left:120,right:120,top:780,display:'flex',justifyContent:'space-between',gap:18,opacity:metadata}}>
      {[['ÄNDERUNG','app.tsx'],['ZEIT','07:24'],['PERSON','du']].map(([key,value],index)=><div key={key} style={{flex:1,textAlign:'center',transform:`translateY(${(1-metadata)*(18+index*8)}px)`}}><div style={{fontFamily:BRAND.font,fontSize:22,fontWeight:900,color:MUTED}}>{key}</div><div style={{marginTop:10,fontFamily:BRAND.font,fontSize:32,fontWeight:950,color:index===0?PURPLE:INK}}>{value}</div><div style={{height:4,marginTop:14,borderRadius:99,background:index===0?PURPLE:'rgba(110,69,201,.18)'}}/></div>)}
    </div>
    <div style={{position:'absolute',left:180,right:180,bottom:62,textAlign:'center',fontFamily:BRAND.font,fontSize:33,fontWeight:950,color:INK,opacity:metadata}}>Git speichert <span style={{color:PURPLE}}>Datei + Zeit + Person</span></div>
  </div>;
};

export const CommitHistoryVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const line=progress(frame,0,130);
  const lens=progress(frame,110,235);
  const rewind=progress(frame,225,330);
  const nodes=[150,365,590,820];
  const lensX=interpolate(lens,[0,1],[345,815]);
  return <div style={stage}>
    <Grid opacity={.2}/>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M150 360 H820" stroke="rgba(110,69,201,.12)" strokeWidth="22" strokeLinecap="round"/>
      <path d="M150 360 H820" stroke={PURPLE} strokeWidth="7" strokeLinecap="round" strokeDasharray="670" strokeDashoffset={dash(line,670)}/>
      {nodes.map((x,index)=>{
        const show=progress(line,index*.2,Math.min(1,index*.2+.3));
        return <React.Fragment key={x}>
          <circle cx={x} cy="360" r={index===3?34:28} fill={index===3?PURPLE:'#fff'} stroke={PURPLE} strokeWidth="6" opacity={show}/>
          <text x={x} y="425" textAnchor="middle" fill={MUTED} fontFamily={BRAND.font} fontSize="21" fontWeight="900" opacity={show}>c{index+1}</text>
        </React.Fragment>;
      })}
      <circle cx={lensX} cy="360" r="86" fill="rgba(255,255,255,.84)" stroke={ACCENT} strokeWidth="6" opacity={lens}/>
      <line x1={lensX+62} y1="420" x2={lensX+125} y2="485" stroke={ACCENT} strokeWidth="13" strokeLinecap="round" opacity={lens}/>
      <path d="M815 360 C760 575 585 700 355 760" fill="none" stroke={OK} strokeWidth="7" strokeDasharray="520" strokeDashoffset={dash(rewind,520)} strokeLinecap="round"/>
      <path d="M355 760 l36 -26 m-36 26 l38 14" stroke={OK} strokeWidth="7" strokeLinecap="round" opacity={rewind}/>
    </svg>
    <div style={{position:'absolute',left:192,right:192,top:535,fontFamily:'monospace',fontSize:30,lineHeight:1.55,opacity:lens}}>
      <div style={{padding:'8px 16px',borderRadius:12,background:'rgba(217,92,106,.08)',color:BAD}}>- button disabled</div>
      <div style={{marginTop:10,padding:'8px 16px',borderRadius:12,background:'rgba(79,157,116,.09)',color:OK}}>+ button enabled</div>
    </div>
    <div style={{position:'absolute',left:170,right:170,bottom:72,textAlign:'center',fontFamily:BRAND.font,fontSize:33,fontWeight:950,color:INK,opacity:rewind}}>Jeder Commit macht einen früheren Zustand <span style={{color:OK}}>auffindbar</span></div>
  </div>;
};

export const BranchPullRequestVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const split=progress(frame,0,70);
  const feature=progress(frame,55,150);
  const review=progress(frame,135,235);
  const merge=progress(frame,215,310);
  return <div style={{...stage,perspective:1000}}>
    <Grid opacity={.2}/>
    <div style={{position:'absolute',left:110,right:110,top:145,height:650,transformStyle:'preserve-3d',transform:`rotateX(${interpolate(split,[0,1],[14,5])}deg)`}}>
      <div style={{position:'absolute',left:40,right:40,top:105,height:92,borderRadius:46,background:'linear-gradient(90deg,#EFE8FA,#FFFFFF)',border:'3px solid rgba(110,69,201,.22)',transform:'translateZ(0px)'}}/>
      <div style={{position:'absolute',left:95,right:95,top:315,height:92,borderRadius:46,background:'linear-gradient(90deg,#FAF6FF,#EEE3FF)',border:'3px solid rgba(185,140,255,.32)',opacity:split,transform:`translateZ(${35*split}px) translateY(${(1-split)*-110}px)`}}/>
      <div style={{position:'absolute',left:78,top:127,fontFamily:BRAND.font,fontSize:28,fontWeight:950,color:PURPLE}}>MAIN · STABIL</div>
      <div style={{position:'absolute',left:132,top:337,fontFamily:BRAND.font,fontSize:28,fontWeight:950,color:ACCENT,opacity:split}}>FEATURE · GETRENNT</div>
      <div style={{position:'absolute',left:160+feature*350,top:326,width:70,height:70,borderRadius:'50%',background:ACCENT,boxShadow:'0 14px 32px rgba(110,69,201,.18)',opacity:split}}/>
      <div style={{position:'absolute',left:570,top:270,width:190,height:190,borderRadius:'50%',border:'4px dashed rgba(110,69,201,.28)',display:'flex',alignItems:'center',justifyContent:'center',opacity:review,transform:`translateZ(${80*review}px) scale(${.88+.12*review})`}}>
        <div style={{width:126,height:126,borderRadius:'50%',background:'#fff',border:'4px solid rgba(110,69,201,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:BRAND.font,fontSize:24,fontWeight:950,color:PURPLE,textAlign:'center'}}>PULL<br/>REQUEST</div>
      </div>
      <div style={{position:'absolute',left:620,top:82,width:118,height:118,borderRadius:'50%',background:merge>.7?'rgba(79,157,116,.14)':'rgba(185,140,255,.12)',border:`4px solid ${merge>.7?OK:'rgba(110,69,201,.22)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:BRAND.font,fontSize:24,fontWeight:950,color:merge>.7?OK:MUTED,opacity:review}}>MERGE</div>
      <svg viewBox="0 0 800 650" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        <path d="M190 365 C320 365 420 355 565 365 C650 365 650 195 690 160" fill="none" stroke={OK} strokeWidth="8" strokeLinecap="round" strokeDasharray="760" strokeDashoffset={dash(merge,760)} opacity={review}/>
      </svg>
    </div>
    <div style={{position:'absolute',left:170,right:170,bottom:70,textAlign:'center',fontFamily:BRAND.font,fontSize:32,fontWeight:950,color:INK,opacity:merge}}>Neue Arbeit bleibt getrennt, bis sie <span style={{color:OK}}>geprüft</span> ist</div>
  </div>;
};

export const RepositoryWholeVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const build=progress(frame,0,155);
  const bind=progress(frame,130,285);
  const share=progress(frame,270,420);
  const finish=progress(frame,390,505);
  const layers=[
    {label:'DATEIEN',z:0,y:520,rotate:-5},
    {label:'VERLAUF',z:46,y:430,rotate:3},
    {label:'TEAM',z:92,y:340,rotate:-2},
  ];
  return <div style={{...stage,perspective:1150}}>
    <Grid opacity={.24}/>
    <div style={{position:'absolute',left:185,right:185,top:110,height:730,transformStyle:'preserve-3d',transform:`rotateX(${interpolate(build,[0,1],[18,7])}deg) rotateY(${interpolate(build,[0,1],[-12,5])}deg)`}}>
      {layers.map((layer,index)=>{
        const local=progress(build,index*.18,Math.min(1,index*.18+.44));
        return <div key={layer.label} style={{position:'absolute',left:58,right:58,top:layer.y-interpolate(bind,[0,1],[0,index*105]),height:150,borderRadius:38,background:index===2?'linear-gradient(135deg,#EFE4FF,#FFFFFF)':'rgba(255,255,255,.88)',border:`3px solid ${index===1?'rgba(110,69,201,.34)':'rgba(110,69,201,.20)'}`,boxShadow:'0 28px 55px rgba(26,26,46,.10)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:BRAND.font,fontSize:38,fontWeight:950,color:index===1?PURPLE:INK,opacity:local,transform:`translateZ(${layer.z*bind}px) rotateZ(${layer.rotate*(1-bind)}deg) translateY(${(1-local)*36}px)`}}>{layer.label}</div>;
      })}
      <div style={{position:'absolute',left:155,right:155,top:540-interpolate(bind,[0,1],[0,315]),height:260,borderRadius:62,border:'5px solid rgba(110,69,201,.28)',background:'rgba(185,140,255,.08)',opacity:bind,transform:`translateZ(${150*bind}px) scale(${.82+.18*bind})`}}/>
      <div style={{position:'absolute',left:255,right:255,top:620-interpolate(bind,[0,1],[0,385]),height:92,borderRadius:46,background:PURPLE,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:BRAND.font,fontSize:32,fontWeight:950,color:'#fff',opacity:bind,transform:`translateZ(${190*bind}px)`}}>REPOSITORY</div>
    </div>
    <svg viewBox="0 0 1000 1120" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
      <path d="M500 720 C500 855 700 865 815 900" fill="none" stroke="rgba(110,69,201,.14)" strokeWidth="22" strokeLinecap="round"/>
      <path d="M500 720 C500 855 700 865 815 900" fill="none" stroke={PURPLE} strokeWidth="7" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={dash(share,500)}/>
      <circle cx="830" cy="905" r="54" fill="#fff" stroke={PURPLE} strokeWidth="5" opacity={share}/>
      <text x="830" y="914" textAnchor="middle" fill={PURPLE} fontFamily={BRAND.font} fontSize="26" fontWeight="950" opacity={share}>DU</text>
    </svg>
    <div style={{position:'absolute',left:145,right:145,bottom:54,textAlign:'center',fontFamily:BRAND.font,fontSize:34,fontWeight:950,color:INK,opacity:finish}}>Dateien + Geschichte + Team = <span style={{color:PURPLE}}>Projektentwicklung</span></div>
  </div>;
};
