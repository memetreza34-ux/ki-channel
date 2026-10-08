import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {easedProgress} from '../../motion/easing';
import {YOUTUBE_VISUAL_LANGUAGE as V} from '../visualLanguage';

const C=V.colors;
const FONT=V.typography;
const stage:React.CSSProperties={position:'absolute',left:80,right:80,top:128,bottom:60,overflow:'hidden'};
const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const p=(frame:number,start:number,end:number,easing:'enter'|'enterEmphasis'|'move'|'exit'='enter')=>
  clamp(easedProgress(frame,start,Math.max(start+1,end),easing));
const px=(value:number)=>`${Math.round(value)}px`;

const SoftField:React.FC<{x:number;y:number;size:number;color:string;opacity?:number}>=({x,y,size,color,opacity=.16})=>
  <div style={{
    position:'absolute',
    left:x-size/2,
    top:y-size/2,
    width:size,
    height:size,
    borderRadius:'50%',
    background:`radial-gradient(circle, ${color} 0%, transparent 68%)`,
    opacity,
    filter:'blur(10px)',
  }}/>;

const Kicker:React.FC<{children:React.ReactNode;dark?:boolean}>=({children,dark=false})=>
  <div style={{
    fontFamily:FONT.body,
    fontSize:17,
    fontWeight:800,
    letterSpacing:2.2,
    color:dark?'rgba(245,247,251,.64)':C.purple,
    textTransform:'uppercase',
  }}>{children}</div>;

const HeroLabel:React.FC<{children:React.ReactNode;dark?:boolean}>=({children,dark=false})=>
  <div style={{
    fontFamily:FONT.display,
    fontSize:56,
    lineHeight:1.02,
    fontWeight:850,
    letterSpacing:-2.5,
    color:dark?C.lightInk:C.ink,
  }}>{children}</div>;

const MiniPill:React.FC<{children:React.ReactNode;tone?:'purple'|'green'|'red'|'blue';dark?:boolean}>=({children,tone='purple',dark=false})=>{
  const toneColor=tone==='green'?C.success:tone==='red'?C.error:tone==='blue'?C.info:C.purple;
  return <div style={{
    padding:'10px 16px',
    borderRadius:999,
    fontFamily:FONT.body,
    fontSize:17,
    fontWeight:800,
    letterSpacing:.4,
    color:dark?C.lightInk:toneColor,
    border:`1px solid ${toneColor}55`,
    background:dark?`${toneColor}20`:`${toneColor}10`,
  }}>{children}</div>;
};

const BlueprintPlane:React.FC<{label:string;value:string;x:number;y:number;progress:number;accent?:string;rotate?:number}>=({
  label,value,x,y,progress,accent=C.purple,rotate=0,
})=><div style={{
  position:'absolute',
  left:x,
  top:y,
  width:330,
  height:196,
  borderRadius:34,
  background:'rgba(255,255,255,.93)',
  border:`2px solid ${accent}38`,
  boxShadow:'0 26px 70px rgba(20,22,33,.10)',
  padding:'28px 30px',
  boxSizing:'border-box',
  opacity:progress,
  translate:`${px((1-progress)*80)} ${px((1-progress)*34)}`,
  rotate:`${rotate*(1-progress)}deg`,
  scale:.88+.12*progress,
}}>
  <Kicker>{label}</Kicker>
  <div style={{marginTop:20,fontFamily:FONT.display,fontWeight:820,fontSize:34,letterSpacing:-1.2,color:C.ink}}>{value}</div>
  <div style={{position:'absolute',left:30,right:30,bottom:26,height:5,borderRadius:999,background:`${accent}18`}}>
    <div style={{width:`${Math.round(progress*100)}%`,height:'100%',borderRadius:999,background:accent}}/>
  </div>
</div>;

export const HookVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const prompt=p(frame,0,34,'enterEmphasis');
  const fracture=p(frame,80,190,'move');
  const blueprint=p(frame,180,360,'enter');
  const core=p(frame,330,510,'enterEmphasis');
  const resolve=p(frame,500,690,'move');
  const pulse=p(frame,570,650,'enter');
  return <div style={stage}>
    <SoftField x={1290} y={390} size={760} color="rgba(185,140,255,.62)" opacity={.24}/>
    <div style={{
      position:'absolute',left:58,top:118,width:690,
      opacity:prompt,
      translate:`${px(-70*(1-prompt)-fracture*70)} 0px`,
      scale:1-.07*fracture,
    }}>
      <Kicker>Ein Prompt</Kicker>
      <div style={{marginTop:18,fontFamily:FONT.display,fontSize:116,lineHeight:.91,fontWeight:900,letterSpacing:-6,color:C.ink}}>
        BAU MIR<br/><span style={{color:C.purple}}>EINE APP.</span>
      </div>
      <div style={{marginTop:30,width:560,fontFamily:FONT.body,fontSize:27,lineHeight:1.35,fontWeight:650,color:C.mutedInk}}>
        Klingt wie ein Satz. In Wahrheit braucht eine App ein ganzes System.
      </div>
    </div>

    <BlueprintPlane label="01" value="Problem" x={820} y={88} progress={blueprint} rotate={-3}/>
    <BlueprintPlane label="02" value="Flow" x={1190} y={56} progress={p(frame,220,400)} accent={C.info} rotate={2}/>
    <BlueprintPlane label="03" value="Daten" x={860} y={510} progress={p(frame,260,440)} accent={C.purpleLight} rotate={2}/>
    <BlueprintPlane label="04" value="Tests" x={1230} y={490} progress={p(frame,300,480)} accent={C.success} rotate={-2}/>

    <svg viewBox="0 0 1760 880" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
      <path
        d="M1010 365 C1120 300 1215 300 1320 365 C1428 430 1418 543 1320 602 C1210 666 1092 618 1040 533 C995 460 1008 395 1010 365"
        fill="none"
        stroke="rgba(110,69,201,.16)"
        strokeWidth="64"
        strokeLinecap="round"
        opacity={core}
      />
      <path
        d="M1010 365 C1120 300 1215 300 1320 365 C1428 430 1418 543 1320 602 C1210 666 1092 618 1040 533 C995 460 1008 395 1010 365"
        fill="none"
        stroke={C.purple}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="850"
        strokeDashoffset={850*(1-core)}
      />
    </svg>

    <div style={{
      position:'absolute',left:1040,top:290,width:350,height:350,borderRadius:98,
      display:'grid',placeItems:'center',
      background:resolve>.6
        ?'linear-gradient(145deg,#6E45C9 0%,#8A65DD 60%,#3D8BFF 140%)'
        :'linear-gradient(145deg,#FFFFFF,#F0E8FF)',
      border:'2px solid rgba(110,69,201,.22)',
      boxShadow:`0 40px 110px rgba(78,49,145,${.12+.18*resolve})`,
      opacity:core,
      scale:.72+.28*core+.025*pulse,
      translate:`0px ${px((1-core)*70)}`,
    }}>
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:FONT.body,fontSize:18,fontWeight:850,letterSpacing:3,color:resolve>.6?'rgba(255,255,255,.72)':C.purple}}>SYSTEM</div>
        <div style={{marginTop:13,fontFamily:FONT.display,fontSize:66,fontWeight:900,letterSpacing:-3,color:resolve>.6?'#fff':C.ink}}>APP</div>
      </div>
    </div>

    <div style={{
      position:'absolute',left:118,rigth:0,bottom:38,
      display:'flex',gap:14,opacity:resolve,
    }}>
      <MiniPill>Prompt</MiniPill><MiniPill tone="blue">Struktur</MiniPill><MiniPill tone="green">prüfbares System</MiniPill>
    </div>
  </div>;
};

export const ScopeVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=p(frame,0,90,'enterEmphasis');
  const flood=p(frame,90,330,'enter');
  const prune=p(frame,360,760,'move');
  const lock=p(frame,780,1160,'enterEmphasis');
  const extras=[
    {label:'Chat',x:118,y:188},
    {label:'Kalender',x:214,y:540},
    {label:'Team',x:510,y:160},
    {label:'Statistik',x:1240,y:168},
    {label:'Gamification',x:1340,y:520},
  ];
  return <div style={stage}>
    <SoftField x={880} y={430} size={920} color="rgba(110,69,201,.42)" opacity={.18}/>
    <div style={{position:'absolute',left:80,top:90,width:520,opacity:enter}}>
      <Kicker>Scope reduzieren</Kicker>
      <HeroLabel>Aus fünf Ideen wird<br/><span style={{color:C.purple}}>eine klare Aufgabe.</span></HeroLabel>
    </div>

    <svg viewBox="0 0 1760 880" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M390 220 L1370 220 L1115 700 L645 700 Z" fill="rgba(110,69,201,.045)" stroke="rgba(110,69,201,.18)" strokeWidth="4" opacity={enter}/>
      <path d="M645 700 H1115" stroke={C.purple} strokeWidth="14" strokeLinecap="round" strokeDasharray="470" strokeDashoffset={470*(1-lock)}/>
      <path d="M880 260 V620" stroke="rgba(110,69,201,.16)" strokeWidth="3" strokeDasharray="12 16" opacity={flood}/>
    </svg>

    {extras.map((item,index)=>{
      const local=p(frame,100+index*34,250+index*34);
      const vanish=p(frame,390+index*42,660+index*42,'move');
      return <div key={item.label} style={{
        position:'absolute',left:item.x,top:item.y,width:260,height:118,borderRadius:28,
        display:'grid',placeItems:'center',
        background:'#fff',border:'2px solid rgba(110,69,201,.16)',
        boxShadow:'0 20px 50px rgba(20,22,33,.08)',
        opacity:local*(1-.82*vanish),
        translate:`${px((880-item.x-130)*vanish*.58)} ${px((425-item.y-59)*vanish*.58)}`,
        scale:1-.32*vanish,
        filter:`blur(${vanish*3}px)`,
        fontFamily:FONT.body,fontSize:27,fontWeight:800,color:C.ink,
      }}>{item.label}</div>;
    })}

    <div style={{
      position:'absolute',left:645,top:260,width:470,height:360,borderRadius:64,
      background:lock>.4?'linear-gradient(145deg,#6E45C9,#855FD8)':'rgba(255,255,255,.94)',
      border:'2px solid rgba(110,69,201,.24)',boxShadow:'0 38px 90px rgba(78,49,145,.18)',
      display:'grid',placeItems:'center',opacity:flood,
      scale:.82+.18*lock,
    }}>
      <div style={{width:350}}>
        <Kicker dark={lock>.4}>Kern-Scope</Kicker>
        <div style={{marginTop:18,fontFamily:FONT.display,fontSize:54,fontWeight:880,letterSpacing:-2.4,color:lock>.4?'#fff':C.ink}}>Nutzer → Eingabe → Ergebnis</div>
        <div style={{marginTop:30,height:10,borderRadius:999,background:lock>.4?'rgba(255,255,255,.18)':'rgba(110,69,201,.10)'}}>
          <div style={{height:'100%',width:`${Math.round(lock*100)}%`,borderRadius:999,background:lock>.4?'#fff':C.purple}}/>
        </div>
      </div>
    </div>

    <div style={{position:'absolute',right:74,bottom:46,opacity:lock}}>
      <MiniPill tone="green">kleinster sinnvoller Scope ✓</MiniPill>
    </div>
  </div>;
};

export const FlowVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const establish=p(frame,0,120,'enterEmphasis');
  const travel=p(frame,120,760,'move');
  const transform=p(frame,650,1020,'enterEmphasis');
  const finish=p(frame,1000,1170,'enter');
  const stations=[
    {x:190,y:475,label:'EINGABE',tone:C.purple},
    {x:620,y:245,label:'DATEN',tone:C.info},
    {x:1080,y:610,label:'AKTION',tone:C.purpleLight},
    {x:1510,y:330,label:'ZUSTAND',tone:C.success},
  ];
  const x=interpolate(travel,[0,.33,.67,1],[190,620,1080,1510]);
  const y=interpolate(travel,[0,.33,.67,1],[475,245,610,330]);
  return <div style={stage}>
    <SoftField x={900} y={430} size={1020} color="rgba(61,139,255,.32)" opacity={.17}/>
    <div style={{position:'absolute',left:70,top:70,width:600,opacity:establish}}>
      <Kicker>Sichtbare Zustände</Kicker>
      <HeroLabel>Ein Klick ist erst verständlich,<br/>wenn <span style={{color:C.info}}>etwas sichtbar passiert.</span></HeroLabel>
    </div>
    <svg viewBox="0 0 1760 880" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M190 475 C370 475 420 245 620 245 S850 610 1080 610 S1300 330 1510 330" fill="none" stroke="rgba(20,22,33,.07)" strokeWidth="72" strokeLinecap="round" opacity={establish}/>
      <path d="M190 475 C370 475 420 245 620 245 S850 610 1080 610 S1300 330 1510 330" fill="none" stroke="rgba(110,69,201,.18)" strokeWidth="18" strokeLinecap="round" opacity={establish}/>
      <path d="M190 475 C370 475 420 245 620 245 S850 610 1080 610 S1300 330 1510 330" fill="none" stroke={C.purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="1900" strokeDashoffset={1900*(1-travel)}/>
      {stations.map((s,index)=>{
        const show=p(frame,30+index*55,160+index*55);
        const active=Math.max(0,1-Math.abs(travel-index/3)*3.3);
        return <React.Fragment key={s.label}>
          <circle cx={s.x} cy={s.y} r={72+active*18} fill="#fff" stroke={s.tone} strokeWidth={4+active*5} opacity={show}/>
          <text x={s.x} y={s.y+8} textAnchor="middle" fontFamily={FONT.body} fontSize="20" fontWeight="850" fill={s.tone} opacity={show}>{s.label}</text>
        </React.Fragment>;
      })}
      <circle cx={x} cy={y} r="34" fill={C.purpleLight} stroke="#fff" strokeWidth="10" opacity={establish}/>
    </svg>
    <div style={{
      position:'absolute',left:interpolate(transform,[0,1],[1240,1260]),top:500,width:340,height:220,borderRadius:42,
      background:transform>.45?'linear-gradient(145deg,#ECF7F1,#FFFFFF)':'#fff',
      border:`2px solid ${transform>.45?C.success+'55':'rgba(110,69,201,.16)'}`,
      boxShadow:'0 26px 70px rgba(20,22,33,.10)',
      opacity:transform,scale:.78+.22*transform,
      padding:'32px 34px',boxSizing:'border-box',
    }}>
      <Kicker>Zustand</Kicker>
      <div style={{marginTop:16,fontFamily:FONT.display,fontSize:38,fontWeight:850,color:transform>.55?C.success:C.ink}}>gespeichert</div>
      <div style={{marginTop:26,height:7,borderRadius:999,background:'rgba(30,131,92,.12)'}}>
        <div style={{height:'100%',width:`${finish*100}%`,borderRadius:999,background:C.success}}/>
      </div>
    </div>
  </div>;
};

export const RepoVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const reveal=p(frame,0,160,'enterEmphasis');
  const depth=p(frame,140,620,'move');
  const history=p(frame,540,940,'enter');
  const resolve=p(frame,900,1160,'enterEmphasis');
  const files=[
    {name:'ui/',tone:C.purple},
    {name:'logic/',tone:C.info},
    {name:'data/',tone:C.purpleLight},
    {name:'components/',tone:C.success},
  ];
  return <div style={{...stage,perspective:1300}}>
    <SoftField x={650} y={420} size={980} color="rgba(110,69,201,.38)" opacity={.20}/>
    <div style={{position:'absolute',right:75,top:92,width:560,opacity:reveal}}>
      <Kicker>Repository</Kicker>
      <HeroLabel>Der Code bekommt<br/><span style={{color:C.purple}}>Gedächtnis.</span></HeroLabel>
    </div>
    <div style={{
      position:'absolute',left:80,top:95,width:840,height:680,
      transformStyle:'preserve-3d',
      rotate:`x ${14-9*depth}deg y ${-13+8*depth}deg`,
      translate:`${px(-30*(1-reveal))} ${px(25*(1-reveal))}`,
    }}>
      {files.map((file,index)=>{
        const local=p(frame,30+index*55,180+index*55);
        const spread=depth*(index*76);
        return <div key={file.name} style={{
          position:'absolute',left:90+index*42,top:90+index*74,width:570,height:152,borderRadius:36,
          background:index===0?'linear-gradient(145deg,#EEE6FF,#FFFFFF)':'rgba(255,255,255,.96)',
          border:`2px solid ${file.tone}44`,
          boxShadow:'0 28px 70px rgba(20,22,33,.11)',
          opacity:local,
          translate:`${px((1-local)*(index%2?-90:90))} 0px ${px(spread)}`,
          display:'flex',alignItems:'center',gap:26,padding:'0 34px',boxSizing:'border-box',
        }}>
          <div style={{width:54,height:54,borderRadius:18,background:`${file.tone}18`,border:`1px solid ${file.tone}44`}}/>
          <div style={{fontFamily:FONT.code,fontSize:32,fontWeight:760,color:C.ink}}>{file.name}</div>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',right:86,top:390,width:600,height:300,opacity:history}}>
      <Kicker>Versionen</Kicker>
      <div style={{position:'absolute',left:0,right:0,top:105,height:16,borderRadius:999,background:'rgba(110,69,201,.10)'}}>
        <div style={{width:`${history*100}%`,height:'100%',borderRadius:999,background:`linear-gradient(90deg,${C.purple},${C.info})`}}/>
      </div>
      {[0,1,2,3].map((index)=>{
        const active=history>(index+.15)/4;
        return <div key={index} style={{
          position:'absolute',left:20+index*170,top:78,width:68,height:68,borderRadius:'50%',
          display:'grid',placeItems:'center',background:active?C.purple:'#fff',
          border:'7px solid #fff',boxShadow:'0 8px 28px rgba(20,22,33,.11)',
          fontFamily:FONT.code,fontWeight:800,fontSize:17,color:active?'#fff':C.mutedInk,
        }}>c{index+1}</div>;
      })}
      <div style={{position:'absolute',left:0,top:190,fontFamily:FONT.display,fontSize:36,fontWeight:820,color:C.ink,opacity:resolve}}>
        Struktur + Historie = <span style={{color:C.purple}}>Kontext</span>
      </div>
    </div>
  </div>;
};

export const BuildVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const brief=p(frame,0,180,'enterEmphasis');
  const route=p(frame,170,760,'move');
  const build=p(frame,640,1120,'enterEmphasis');
  const verify=p(frame,1100,1540,'move');
  const fields=['IST-ZUSTAND','ÄNDERUNG','GRENZE','TEST'];
  return <div style={stage}>
    <SoftField x={1260} y={430} size={900} color="rgba(185,140,255,.42)" opacity={.22}/>
    <div style={{position:'absolute',left:60,top:70,width:570,opacity:brief}}>
      <Kicker>Kleine Schritte</Kicker>
      <HeroLabel>Der Build bekommt<br/><span style={{color:C.purple}}>klare Grenzen.</span></HeroLabel>
    </div>
    <div style={{position:'absolute',left:78,top:330,width:560}}>
      {fields.map((field,index)=>{
        const local=p(frame,40+index*45,200+index*45);
        const sent=p(frame,300+index*110,560+index*110,'move');
        return <div key={field} style={{
          height:88,marginBottom:16,borderRadius:25,
          display:'flex',alignItems:'center',gap:20,padding:'0 24px',boxSizing:'border-box',
          background:'#fff',border:'1px solid rgba(110,69,201,.16)',
          boxShadow:'0 14px 40px rgba(20,22,33,.07)',
          opacity:local*(1-.52*sent),
          translate:`${px(sent*380)} 0px`,
        }}>
          <div style={{width:44,height:44,borderRadius:14,display:'grid',placeItems:'center',background:C.purple,color:'#fff',fontFamily:FONT.body,fontWeight:850}}>{index+1}</div>
          <div style={{fontFamily:FONT.body,fontSize:25,fontWeight:800,color:C.ink}}>{field}</div>
        </div>;
      })}
    </div>
    <svg viewBox="0 0 1760 880" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M650 520 C850 520 900 300 1080 300 S1320 520 1460 520" fill="none" stroke="rgba(110,69,201,.10)" strokeWidth="60" strokeLinecap="round"/>
      <path d="M650 520 C850 520 900 300 1080 300 S1320 520 1460 520" fill="none" stroke={C.purple} strokeWidth="8" strokeLinecap="round" strokeDasharray="1050" strokeDashoffset={1050*(1-route)}/>
    </svg>
    <div style={{
      position:'absolute',right:88,top:240,width:500,height:500,borderRadius:96,
      background:verify>.5?'linear-gradient(145deg,#1E835C,#2D9F73)':'linear-gradient(145deg,#6E45C9,#9270E0)',
      boxShadow:`0 40px 100px rgba(78,49,145,${.15+.12*build})`,
      display:'grid',placeItems:'center',opacity:build,
      translate:`0px ${px((1-build)*85)}`,scale:.76+.24*build,
    }}>
      <div style={{textAlign:'center',width:360}}>
        <Kicker dark>Build</Kicker>
        <div style={{marginTop:20,fontFamily:FONT.display,fontSize:64,fontWeight:900,letterSpacing:-3,color:'#fff'}}>
          {verify>.62?'BESTANDEN':'BAUEN'}
        </div>
        <div style={{marginTop:34,height:9,borderRadius:999,background:'rgba(255,255,255,.18)'}}>
          <div style={{height:'100%',width:`${Math.round(Math.max(build,verify)*100)}%`,borderRadius:999,background:'#fff'}}/>
        </div>
      </div>
    </div>
  </div>;
};

export const TestVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=p(frame,0,140,'enterEmphasis');
  const scan=p(frame,110,620,'move');
  const detect=p(frame,500,820,'enterEmphasis');
  const patch=p(frame,790,1120,'move');
  const verify=p(frame,1080,1450,'enterEmphasis');
  return <div style={stage}>
    <div style={{position:'absolute',left:58,top:70,width:560,opacity:enter}}>
      <Kicker>Testen</Kicker>
      <HeroLabel>Fehler müssen<br/><span style={{color:C.error}}>sichtbar werden.</span></HeroLabel>
    </div>
    <div style={{
      position:'absolute',left:570,top:82,width:1060,height:690,borderRadius:54,
      background:'#fff',border:'2px solid rgba(20,22,33,.10)',
      boxShadow:'0 36px 100px rgba(20,22,33,.12)',overflow:'hidden',
      opacity:enter,translate:`${px((1-enter)*90)} 0px`,
    }}>
      <div style={{height:76,borderBottom:'1px solid rgba(20,22,33,.08)',display:'flex',alignItems:'center',gap:10,padding:'0 28px'}}>
        {[0,1,2].map(i=><div key={i} style={{width:13,height:13,borderRadius:'50%',background:i===0?C.error:i===1?'#E5B94E':C.success}}/>)}
        <div style={{marginLeft:18,fontFamily:FONT.code,fontSize:18,color:C.mutedInk}}>app.local / test</div>
      </div>
      <div style={{position:'absolute',left:70,top:150,width:620,height:390,borderRadius:36,background:'linear-gradient(145deg,#F5F7FB,#FFFFFF)',border:'1px solid rgba(20,22,33,.07)'}}>
        <div style={{position:'absolute',left:52,top:48,width:320,height:28,borderRadius:12,background:'rgba(110,69,201,.13)'}}/>
        <div style={{position:'absolute',left:52,top:110,width:500,height:190,borderRadius:30,border:'2px solid rgba(110,69,201,.13)'}}/>
        <div style={{
          position:'absolute',left:405,top:125,width:130,height:130,borderRadius:36,
          background:verify>.55?'rgba(30,131,92,.15)':'rgba(217,92,106,.16)',
          border:`4px solid ${verify>.55?C.success:C.error}`,
          opacity:detect,
          scale:.78+.22*detect,
        }}/>
      </div>
      <div style={{position:'absolute',right:80,top:178,width:210,height:84,borderRadius:25,background:C.purple}}/>
      <div style={{position:'absolute',right:80,top:300,width:210,height:20,borderRadius:999,background:'rgba(20,22,33,.09)'}}/>
      <div style={{position:'absolute',right:80,top:344,width:160,height:20,borderRadius:999,background:'rgba(20,22,33,.07)'}}/>
      <div style={{
        position:'absolute',left:interpolate(scan,[0,1],[0,940]),top:76,width:150,height:614,
        background:'linear-gradient(90deg,transparent,rgba(61,139,255,.22),transparent)',
        borderLeft:'2px solid rgba(61,139,255,.45)',opacity:scan,
      }}/>
      <div style={{
        position:'absolute',left:0,right:0,bottom:0,height:verify*180,
        background:'linear-gradient(180deg,rgba(30,131,92,0),rgba(30,131,92,.12))',
      }}/>
    </div>
    <div style={{position:'absolute',left:88,bottom:94,display:'flex',gap:14,opacity:detect}}>
      <MiniPill tone="red">Fehler reproduziert</MiniPill>
      <div style={{opacity:patch}}><MiniPill>lokal patchen</MiniPill></div>
      <div style={{opacity:verify}}><MiniPill tone="green">erneut prüfen ✓</MiniPill></div>
    </div>
  </div>;
};

export const BranchVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=p(frame,0,130,'enterEmphasis');
  const split=p(frame,120,360,'move');
  const work=p(frame,340,600,'move');
  const review=p(frame,560,720,'enterEmphasis');
  const merge=p(frame,700,880,'move');
  return <div style={stage}>
    <SoftField x={960} y={430} size={1060} color="rgba(61,139,255,.30)" opacity={.16}/>
    <div style={{position:'absolute',left:72,top:68,width:560,opacity:enter}}>
      <Kicker>Experimentieren</Kicker>
      <HeroLabel>Main bleibt stabil,<br/>während <span style={{color:C.purple}}>du testest.</span></HeroLabel>
    </div>
    <div style={{position:'absolute',left:530,right:80,top:190,height:520,perspective:1200}}>
      <div style={{
        position:'absolute',left:80,right:80,top:80,height:150,borderRadius:60,
        background:'linear-gradient(90deg,#FFFFFF,#F0F2F7)',
        border:'2px solid rgba(20,22,33,.10)',boxShadow:'0 30px 70px rgba(20,22,33,.09)',
        rotate:`x ${6-3*split}deg`,
      }}>
        <div style={{position:'absolute',left:45,top:50,fontFamily:FONT.body,fontSize:25,fontWeight:850,color:C.ink}}>MAIN · STABIL</div>
        <div style={{position:'absolute',right:45,top:49}}><MiniPill tone="green">geschützt</MiniPill></div>
      </div>
      <div style={{
        position:'absolute',left:130,right:40,top:270,height:164,borderRadius:62,
        background:'linear-gradient(90deg,#EEE6FF,#FCFAFF)',
        border:'2px solid rgba(110,69,201,.28)',boxShadow:'0 34px 80px rgba(78,49,145,.13)',
        opacity:split,
        translate:`0px ${px((1-split)*-140)} ${px(split*55)}`,
      }}>
        <div style={{position:'absolute',left:45,top:52,fontFamily:FONT.body,fontSize:25,fontWeight:850,color:C.purple}}>EXPERIMENT</div>
        <div style={{position:'absolute',left:260+work*420,top:48,width:68,height:68,borderRadius:22,background:C.purpleLight,boxShadow:'0 10px 30px rgba(110,69,201,.24)'}}/>
      </div>
      <div style={{
        position:'absolute',right:30,top:165,width:210,height:210,borderRadius:58,
        display:'grid',placeItems:'center',background:'#fff',
        border:`4px solid ${merge>.55?C.success:'rgba(110,69,201,.24)'}`,
        boxShadow:'0 28px 70px rgba(20,22,33,.10)',
        opacity:review,scale:.78+.22*review,
      }}>
        <div style={{textAlign:'center'}}>
          <Kicker>Review</Kicker>
          <div style={{marginTop:12,fontFamily:FONT.display,fontSize:34,fontWeight:880,color:merge>.55?C.success:C.purple}}>{merge>.55?'MERGED':'PULL REQUEST'}</div>
        </div>
      </div>
    </div>
    <svg viewBox="0 0 1760 880" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <path d="M1100 650 C1380 650 1500 530 1510 380" fill="none" stroke={C.success} strokeWidth="10" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600*(1-merge)} opacity={review}/>
    </svg>
  </div>;
};

export const FinishVisual:React.FC=()=>{
  const frame=useCurrentFrame();
  const enter=p(frame,0,170,'enterEmphasis');
  const gather=p(frame,160,620,'move');
  const lock=p(frame,560,930,'enterEmphasis');
  const verify=p(frame,900,1280,'enterEmphasis');
  const items=[
    {label:'PROBLEM',x:250,y:220,tone:C.purple},
    {label:'FLOW',x:400,y:650,tone:C.info},
    {label:'REPO',x:760,y:160,tone:C.purpleLight},
    {label:'BUILD',x:1350,y:650,tone:C.purple},
    {label:'TEST',x:1510,y:220,tone:C.success},
  ];
  return <div style={{position:'absolute',inset:'-128px -80px -60px -80px',background:`radial-gradient(circle at 50% 48%,#242038 0%,${C.darkSurface} 58%,#0B0C12 100%)`,overflow:'hidden'}}>
    <SoftField x={960} y={540} size={1000} color="rgba(185,140,255,.50)" opacity={.25}/>
    <div style={{position:'absolute',left:115,top:220,width:570,opacity:enter}}>
      <Kicker dark>Finale</Kicker>
      <HeroLabel dark>Fertig heißt nicht:<br/><span style={{color:C.purpleLight}}>„es läuft“.</span></HeroLabel>
      <div style={{marginTop:25,fontFamily:FONT.body,fontSize:27,lineHeight:1.35,fontWeight:650,color:'rgba(245,247,251,.62)'}}>
        Fertig heißt: nachvollziehbar überprüft.
      </div>
    </div>
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {items.map((item,index)=>{
        const show=p(frame,40+index*45,190+index*45);
        const tx=960+(item.x-960)*(1-gather*.52);
        const ty=540+(item.y-540)*(1-gather*.52);
        return <React.Fragment key={item.label}>
          <path d={`M${tx} ${ty} Q${(tx+960)/2} ${(ty+540)/2+(index%2?70:-70)} 960 540`} fill="none" stroke={item.tone} strokeOpacity={.20+.45*gather} strokeWidth="5" strokeDasharray="700" strokeDashoffset={700*(1-gather)}/>
          <circle cx={tx} cy={ty} r={64+24*gather} fill={C.darkRaised} stroke={item.tone} strokeWidth="4" opacity={show}/>
          <text x={tx} y={ty+8} textAnchor="middle" fontFamily={FONT.body} fontSize="19" fontWeight="850" fill={C.lightInk} opacity={show}>{item.label}</text>
        </React.Fragment>;
      })}
      <circle cx="960" cy="540" r={145+105*lock} fill="rgba(110,69,201,.13)" stroke={C.purpleLight} strokeWidth="5" opacity={lock}/>
      <circle cx="960" cy="540" r={98+32*verify} fill={verify>.55?C.success:C.purple} stroke="#fff" strokeWidth="8" opacity={lock}/>
    </svg>
    <div style={{
      position:'absolute',left:800,top:380,width:320,height:320,
      display:'grid',placeItems:'center',textAlign:'center',
      opacity:lock,scale:.72+.28*lock,
    }}>
      <div>
        <div style={{fontFamily:FONT.body,fontSize:18,fontWeight:850,letterSpacing:3,color:'rgba(255,255,255,.65)'}}>SYSTEM</div>
        <div style={{marginTop:10,fontFamily:FONT.display,fontSize:64,fontWeight:900,letterSpacing:-3,color:'#fff'}}>APP</div>
        <div style={{marginTop:16,fontFamily:FONT.body,fontSize:21,fontWeight:800,color:verify>.55?'#C8FFE3':'rgba(255,255,255,.68)'}}>
          {verify>.55?'✓ VERIFIZIERT':'wird geprüft'}
        </div>
      </div>
    </div>
    <div style={{position:'absolute',right:112,bottom:92,opacity:verify}}>
      <MiniPill tone="green" dark>nachvollziehbar überprüft</MiniPill>
    </div>
  </div>;
};
