import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';

const INK = '#1A1A2E';
const PURPLE = '#6E45C9';
const LAVENDER = '#B98CFF';
const MUTED = '#6A6079';
const GREEN = '#168665';
const RED = '#D34D66';
const BG = '#FBF9FD';

const t = (frame: number, start: number, end: number): number => {
  const x = Math.max(0, Math.min(1, (frame - start) / Math.max(1, end - start)));
  return x * x * (3 - 2 * x);
};
const fmt = (num: number) => new Intl.NumberFormat('de-DE').format(num);

const Heading: React.FC<{number: string; label: string; children: React.ReactNode}> = ({number,label,children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: BG, color: INK, fontFamily: BRAND.font, overflow: 'hidden'}}>
    <div style={{position:'absolute',top:-290,right:-140,width:750,height:750,borderRadius:'50%',background:'radial-gradient(circle,#ECE2FF 0%,rgba(236,226,255,0) 68%)',opacity:.55}}/>
    <div style={{position:'absolute',left:82,top:63,display:'flex',alignItems:'center',gap:22}}>
      <span style={{fontSize:23,fontWeight:900,letterSpacing:3,color:PURPLE}}>KI / {number}</span>
      <span style={{width:44,height:2,background:LAVENDER}}/>
      <span style={{fontSize:29,fontWeight:800,color:MUTED,opacity:.75+.25*t(frame,0,20)}}>{label}</span>
    </div>
    {children}
    <div style={{position:'absolute',left:88,bottom:46,color:'#90869B',fontSize:19,fontWeight:700,letterSpacing:1.5}}>SCHEMATISCHE ILLUSTRATION · KEIN CHATGPT-SCREENSHOT</div>
    <div style={{position:'absolute',right:86,bottom:45,color:PURPLE,fontSize:21,fontWeight:900}}>GPT-6 · INTELLIGENT UI</div>
  </AbsoluteFill>;
};

const Chip: React.FC<{children:React.ReactNode;fill?:string;color?:string}> = ({children,fill='#F2E9FF',color=PURPLE}) =>
  <span style={{background:fill,color,borderRadius:100,padding:'12px 24px',fontWeight:850,fontSize:24,whiteSpace:'nowrap'}}>{children}</span>;

export const HookVisual: React.FC = () => {
  const f=useCurrentFrame();
  const shift=t(f,25,210);
  const chart=t(f,165,435);
  const total=200+Math.round(100*t(f,540,780));
  return <Heading number="01" label="Das neue Chatfenster">
    <div style={{position:'absolute',left:95,top:162,fontSize:82,fontWeight:950,letterSpacing:-4}}>ANTWORT <span style={{color:PURPLE}}>→ WERKZEUG</span></div>
    <div style={{position:'absolute',left:104,top:330,width:650,transform:'translateX('+(-80*shift)+'px)',opacity:1-.48*shift}}>
      <div style={{fontSize:28,color:MUTED,marginBottom:25}}>FRÜHER: TEXT</div>
      {['Ein Sparbetrag hängt vom Monat','und der Anzahl der Monate ab.','Um ihn zu berechnen, kannst du','die Werte miteinander multiplizieren.'].map((line,i)=><div key={line} style={{fontSize:28,lineHeight:1.85,color:'#776F80',opacity:.9-t(f,95+i*20,255)*.56}}>{line}</div>)}
    </div>
    <svg width="1920" height="630" viewBox="0 0 1920 630" style={{position:'absolute',top:270}}>
      <path d="M 740 260 C 900 200 945 200 1100 260" stroke={PURPLE} strokeWidth={13} fill="none" strokeDasharray="20 24" opacity={shift}/>
      <path d="M 1072 235 L 1115 259 L 1072 281" stroke={PURPLE} strokeWidth={15} fill="none" strokeLinecap="round" opacity={shift}/>
      <rect x="1130" y="30" width="695" height="490" rx="42" fill="white" stroke="#E2D4F4" strokeWidth="4" opacity={Math.max(.45,shift)}/>
      <text x="1180" y="105" fontSize="29" fontWeight="900" fill={PURPLE}>JETZT: BEDIENBAR</text>
      <text x="1180" y="194" fontSize="44" fontWeight="900" fill={INK}>Monatlicher Betrag</text>
      <line x1="1190" x2="1735" y1="270" y2="270" stroke="#E0D5EC" strokeWidth="17" strokeLinecap="round"/>
      <line x1="1190" x2={1190+490*chart} y1="270" y2="270" stroke={LAVENDER} strokeWidth="17" strokeLinecap="round"/>
      <circle cx={1190+490*chart} cy="270" r="30" fill={PURPLE} stroke="white" strokeWidth="9"/>
      <text x="1185" y="370" fontSize="30" fill={MUTED}>Beispielrechnung</text>
      <text x="1180" y="466" fontSize="100" fontWeight="950" fill={INK}>{total} €</text>
    </svg>
    <div style={{position:'absolute',left:102,top:876,display:'flex',gap:15}}><Chip>LESEN</Chip><Chip>VERSTEHEN</Chip><Chip fill="#E4F7EE" color={GREEN}>BENUTZEN</Chip></div>
  </Heading>;
};

export const FormatVisual: React.FC = () => {
  const f=useCurrentFrame(),progress=t(f,130,480),focus=t(f,530,870);
  return <Heading number="02" label="Das richtige Format">
    <div style={{position:'absolute',left:93,top:175,fontSize:70,fontWeight:950,letterSpacing:-3}}>Nicht jede Antwort braucht <span style={{color:PURPLE}}>eine App.</span></div>
    <div style={{position:'absolute',top:350,left:115,width:730}}>
      <div style={{fontSize:30,fontWeight:900,marginBottom:40,color:MUTED}}>LANGE TEXTANTWORT</div>
      {Array.from({length:7},(_,i)=><div key={i} style={{height:24,width:590+(i%3)*40,borderRadius:20,background:'#D6D0DE',marginBottom:32,opacity:.95-(.75*progress)}}/>)}
      <span style={{fontSize:32,fontWeight:850,color:MUTED,opacity:1-progress}}>Alles nacheinander lesen</span>
    </div>
    <div style={{position:'absolute',top:355,left:980,width:820}}>
      <div style={{fontSize:30,fontWeight:900,marginBottom:28,color:PURPLE}}>PASSENDE DARSTELLUNG</div>
      <div style={{display:'flex',gap:34,alignItems:'flex-end',height:310}}>
        {[["OPTION A",.62],["OPTION B",.92],["OPTION C",.4]].map(([label,val],i)=>{
          const n=Number(val);return <div key={String(label)} style={{flex:1}}>
            <div style={{height:230,display:'flex',alignItems:'flex-end'}}><div style={{height:(n*220*progress)+'px',width:'100%',borderRadius:'20px 20px 6px 6px',background:i===1?PURPLE:'#CFB9EA'}}/></div>
            <div style={{textAlign:'center',fontSize:27,marginTop:20,fontWeight:850,color:i===1?PURPLE:INK}}>{String(label)}</div>
          </div>;
        })}
      </div>
      <div style={{fontSize:31,marginTop:52,fontWeight:850,color:INK,opacity:focus}}>Unterschiede auf einen Blick</div>
    </div>
    <div style={{position:'absolute',left:96,bottom:160,fontSize:36,fontWeight:820,color:PURPLE}}>Manchmal reicht aber auch ein einziger guter Satz.</div>
  </Heading>;
};

export const ArchitectureVisual: React.FC = () => {
  const f=useCurrentFrame(), flow=t(f,60,420),assemble=t(f,290,720),ready=t(f,720,1020);
  const steps=[{x:130,w:340,label:'DEINE FRAGE',sub:'Was will ich wissen?'},{x:565,w:370,label:'DARSTELLUNGSWAHL',sub:'Text, Grafik, Tool?'},{x:1040,w:320,label:'UI-BAUSTEINE',sub:'Diagramm · Regler'},{x:1460,w:320,label:'ANTWORT',sub:'direkt benutzbar'}];
  return <Heading number="03" label="Was hinter Intelligent UI steckt">
    <div style={{position:'absolute',left:88,top:165,fontSize:68,fontWeight:950,letterSpacing:-3}}>Von der Frage zur <span style={{color:PURPLE}}>Oberfläche</span></div>
    <svg width="1920" height="650" viewBox="0 0 1920 650" style={{position:'absolute',top:300}}>
      <path d="M 180 302 H 1744" stroke="#E7DAF5" strokeWidth="15" strokeLinecap="round" fill="none"/>
      <path d="M 180 302 H 1744" stroke={PURPLE} strokeWidth="13" strokeLinecap="round" fill="none" strokeDasharray={1564} strokeDashoffset={1564*(1-flow)}/>
      {steps.map((s,i)=><g key={s.label} opacity={i===0?1:Math.max(.2,t(f,90+i*165,190+i*165))}>
        <rect x={s.x} y={146} width={s.w} height={290} rx={36} fill="white" stroke={i===3?'#99DCC7':'#DFD2F2'} strokeWidth={4}/>
        <circle cx={s.x+s.w/2} cy="170" r="22" fill={i===3?GREEN:PURPLE}/>
        <text x={s.x+s.w/2} y="255" textAnchor="middle" fontSize={Math.min(35,360/s.label.length*2.1)} fontWeight="900" fill={INK}>{s.label}</text>
        <text x={s.x+s.w/2} y="326" textAnchor="middle" fontSize="24" fill={MUTED}>{s.sub}</text>
        {i===2&&<g opacity={assemble}><rect x={s.x+94} y="354" width="53" height="22" rx="11" fill={LAVENDER}/><rect x={s.x+166} y="351" width="50" height="29" rx="8" fill={PURPLE}/></g>}
        {i===3&&<path d="M 1560 357 L 1597 385 L 1665 315" stroke={GREEN} strokeWidth={13} fill="none" strokeLinecap="round" opacity={ready}/>}
      </g>)}
    </svg>
    <div style={{position:'absolute',left:118,top:855,fontSize:31,fontWeight:800,color:MUTED}}>Vereinfacht: native Komponenten + Compiler statt immer nur Fließtext.</div>
  </Heading>;
};

export const SavingsVisual: React.FC = () => {
  const f=useCurrentFrame(),change=t(f,455,720),number=20+Math.round(10*change),total=number*10;
  const grow=t(f,90,345),gain=200+100*change;
  return <Heading number="04" label="Alltagsbeispiel: Sparen">
    <div style={{position:'absolute',left:91,top:158,fontSize:75,fontWeight:950}}>Zahl verändern. <span style={{color:PURPLE}}>Folge sehen.</span></div>
    <div style={{position:'absolute',left:115,top:324,fontSize:30,fontWeight:820,color:MUTED}}>SPARBEISPIEL · OHNE ZINSEN, GEBÜHREN ODER STEUERN</div>
    <div style={{position:'absolute',left:120,top:445,width:620}}>
      <div style={{fontSize:37,fontWeight:830}}>Monatsbetrag</div>
      <div style={{fontSize:128,fontWeight:950,color:PURPLE,marginTop:6}}>{number} €</div>
      <div style={{height:17,background:'#E7DBF4',borderRadius:14,position:'relative',marginTop:38,width:520}}>
        <div style={{height:17,width:(240+250*change)+'px',background:LAVENDER,borderRadius:14}}/>
        <div style={{position:'absolute',left:218+250*change,top:-20,width:58,height:58,background:PURPLE,border:'8px solid white',boxShadow:'0 6px 24px #C0ACDC',borderRadius:'50%'}}/>
      </div>
      <div style={{fontSize:38,marginTop:72,fontWeight:800}}>× 10 Monate = <span style={{color:GREEN}}>{fmt(total)} €</span></div>
    </div>
    <div style={{position:'absolute',left:1100,top:344,display:'flex',gap:90,alignItems:'flex-end',height:470}}>
      {[200,gain].map((v,i)=><div key={i} style={{width:215,textAlign:'center'}}>
        <div style={{fontSize:37,fontWeight:900,marginBottom:14}}>{fmt(Math.round(i===0?200:v))} €</div>
        <div style={{height:(v/300*350*grow)+'px',borderRadius:'29px 29px 6px 6px',background:i===0?'#C6B6E4':GREEN,minHeight:3}}/>
        <div style={{fontSize:24,fontWeight:850,marginTop:16,color:MUTED}}>{i===0?'START':'ANPASSUNG'}</div>
      </div>)}
    </div>
  </Heading>;
};

export const LearningVisual: React.FC = () => {
  const f=useCurrentFrame(),close=t(f,270,435),glow=t(f,425,610);
  return <Heading number="05" label="Lernen durch Ausprobieren">
    <div style={{position:'absolute',left:90,top:164,fontSize:74,fontWeight:950}}>Du <span style={{color:PURPLE}}>veränderst</span> die Erklärung.</div>
    <div style={{position:'absolute',left:94,top:280,fontSize:30,color:MUTED,fontWeight:820}}>STROMKREIS · VEREINFACHTE LERNILLUSTRATION</div>
    <svg width="1920" height="665" viewBox="0 0 1920 665" style={{position:'absolute',top:315}}>
      <path d="M 330 180 H 795 M 960 180 H 1550 V 480 H 330 V 180" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round"/>
      <line x1="765" y1="180" x2={916} y2={180-95*(1-close)} stroke={PURPLE} strokeWidth="15" strokeLinecap="round"/>
      <circle cx="767" cy="180" r="18" fill={PURPLE}/>
      <circle cx="960" cy="180" r="18" fill={PURPLE}/>
      <path d="M 380 435 V 525 M 420 455 V 505" stroke={INK} strokeWidth="11" strokeLinecap="round"/>
      <rect x="305" y="368" width="135" height="115" rx="18" fill="#F1EDF8" stroke={PURPLE} strokeWidth="5"/>
      <text x="372" y="437" textAnchor="middle" fontSize="34" fill={PURPLE} fontWeight="850">+</text>
      <circle cx="1538" cy="321" r="76" fill={glow>.1?'#FFF1B7':'white'} stroke={glow>.1?'#E7AB36':INK} strokeWidth="10"/>
      <path d="M 1515 345 Q 1540 282 1566 345" fill="none" stroke="#D4AB40" strokeWidth="9" opacity={glow}/>
      <g stroke="#E8B24E" strokeWidth="9" strokeLinecap="round" opacity={glow}>
        <path d="M 1538 211 V 192 M 1460 244 L 1446 226 M 1615 244 L 1633 224 M 1470 400 L 1454 420 M 1604 402 L 1622 420"/>
      </g>
      <text x="850" y="112" textAnchor="middle" fontSize="30" fontWeight="900" fill={PURPLE}>SCHALTER {glow>.8?'GESCHLOSSEN':'OFFEN'}</text>
      <text x="1040" y="573" fontSize="34" fontWeight="850" fill={glow>.8?GREEN:MUTED}>{glow>.8?'Geschlossener Strompfad → Lampe an':'Unterbrochener Strompfad → Lampe aus'}</text>
    </svg>
  </Heading>;
};

export const LimitsVisual: React.FC = () => {
  const f=useCurrentFrame(),warning=t(f,235,410),fix=t(f,470,660);
  return <Heading number="06" label="Die wichtigste Grenze">
    <div style={{position:'absolute',left:95,top:175,fontSize:70,fontWeight:950}}>Schön gestaltet <span style={{color:RED}}>≠</span> richtig.</div>
    <div style={{position:'absolute',left:120,top:352,width:900,height:440,borderRadius:42,background:'white',border:'4px solid #E7DEF0',boxShadow:'0 23px 76px #E7DDF2'}}>
      <div style={{padding:'38px 54px',fontSize:30,color:MUTED,fontWeight:800}}>BEISPIELRECHNUNG – BITTE PRÜFEN</div>
      <div style={{padding:'14px 55px',fontSize:95,fontWeight:950,letterSpacing:-4}}>12 € + 8 € = <span style={{color:fix>.9?GREEN:RED}}>{fix>.9?'20':'21'} €</span></div>
      <div style={{display:'flex',gap:24,padding:'38px 55px',fontSize:32,color:fix>.9?GREEN:RED,fontWeight:850}}>
        <span>{fix>.9?'KORRIGIERT':'ZAHL ERST PRÜFEN'}</span>
      </div>
    </div>
    <svg width="470" height="450" viewBox="0 0 470 450" style={{position:'absolute',right:115,top:363}}>
      <circle cx="235" cy="195" r="154" fill={fix>.8?'#DDF4E9':'#FCE3E8'} stroke={fix>.8?GREEN:RED} strokeWidth="17" opacity={.2+.8*warning}/>
      <text x="235" y="280" fontWeight="950" fontSize="212" textAnchor="middle" fill={fix>.8?GREEN:RED}>{fix>.8?'✓':'!'}</text>
    </svg>
    <div style={{position:'absolute',left:120,top:852,fontSize:32,fontWeight:800,color:MUTED}}>Bei Geld, Gesundheit oder wichtigen Entscheidungen: Quellen & Zahlen kontrollieren.</div>
  </Heading>;
};

export const AvailabilityVisual: React.FC = () => {
  const f=useCurrentFrame();
  const modes=[
    {title:'CHAT',detail:'GPT-6 · geeigneter Zugang',value:'MÖGLICH',color:GREEN},
    {title:'WORK',detail:'separater Arbeitsbereich',value:'NICHT HIER',color:RED},
    {title:'VOICE',detail:'Sprachmodus',value:'NICHT HIER',color:RED}
  ];
  return <Heading number="07" label="Verfügbarkeit im Oktober 2026">
    <div style={{position:'absolute',left:91,top:152,fontSize:71,fontWeight:950}}>Nicht in <span style={{color:PURPLE}}>jedem Modus</span> verfügbar.</div>
    <div style={{position:'absolute',top:338,left:130,right:140,display:'grid',gap:28}}>
      {modes.map((m,i)=>{
        const opacity=.1+.9*t(f,45+i*185,185+i*185);
        return <div key={m.title} style={{display:'grid',gridTemplateColumns:'290px 1fr 250px',alignItems:'center',gap:38,height:145,opacity,background:i===0?'#ECF9F2':'#F5F1F7',borderRadius:30,padding:'0 40px'}}>
          <div style={{fontSize:55,fontWeight:950,color:INK}}>{m.title}</div>
          <div style={{fontSize:32,fontWeight:700,color:MUTED}}>{m.detail}</div>
          <div style={{fontSize:29,fontWeight:950,color:m.color}}>{m.value}</div>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',left:140,top:890,fontSize:25,fontWeight:780,color:MUTED}}>Einführung schrittweise · Plattform, Modell und Einstellungen können abweichen · Quelle: OpenAI</div>
  </Heading>;
};

export const PayoffVisual: React.FC = () => {
  const f=useCurrentFrame();
  const topics=[
    {title:'LESEN',sub:'kurze Antwort',icon:'Aa',color:'#EAE2F7'},
    {title:'VERSTEHEN',sub:'Diagramm',icon:'◔',color:'#DBEDE5'},
    {title:'BENUTZEN',sub:'kleines Werkzeug',icon:'↗',color:'#F5E2EE'}
  ];
  return <Heading number="08" label="Der eigentliche Wandel">
    <div style={{position:'absolute',left:92,top:167,fontSize:74,fontWeight:950}}>Die Antwort passt <span style={{color:PURPLE}}>zur Aufgabe.</span></div>
    <div style={{position:'absolute',top:362,left:105,right:105,display:'flex',gap:35}}>
      {topics.map((topic,i)=><div key={topic.title} style={{flex:1,height:390,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderRadius:44,background:topic.color,transform:'translateY('+((1-t(f,55+i*125,285+i*125))*130)+'px)',opacity:.25+.75*t(f,55+i*125,285+i*125)}}>
        <div style={{fontSize:122,fontWeight:950,color:INK,lineHeight:1}}>{topic.icon}</div>
        <div style={{fontSize:45,fontWeight:950,color:INK,marginTop:24}}>{topic.title}</div>
        <div style={{fontSize:25,color:MUTED,fontWeight:800,marginTop:15}}>{topic.sub}</div>
      </div>)}
    </div>
    <div style={{position:'absolute',left:120,top:866,fontSize:37,fontWeight:850,color:PURPLE,opacity:t(f,390,650)}}>Nicht nur: „Erklär es mir.“ Sondern: „Zeig es mir so, dass ich es ausprobieren kann.“</div>
  </Heading>;
};
