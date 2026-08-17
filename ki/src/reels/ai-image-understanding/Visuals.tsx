import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';

const RED = '#C85666';
const GREEN = '#4F9D74';
const MUTED = 'rgba(26,26,46,.48)';
const card: React.CSSProperties = {background: '#fff', border: '2px solid rgba(110,69,201,.18)', borderRadius: 30, boxShadow: '0 24px 70px rgba(26,26,46,.10)'};
const stage: React.CSSProperties = {position: 'absolute', left: 64, right: 64, top: 32, bottom: 32};
const label: React.CSSProperties = {fontFamily: BRAND.font, fontWeight: 900, color: BRAND.ink};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const p = (f: number, a: number, b: number) => clamp(interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

const Chip: React.FC<{text: string; active?: boolean; tone?: 'purple' | 'red' | 'green'}> = ({text, active = true, tone = 'purple'}) => {
  const color = tone === 'red' ? RED : tone === 'green' ? GREEN : BRAND.accentDk;
  return <div style={{padding: '15px 22px', borderRadius: 18, border: `2px solid ${active ? color : 'rgba(26,26,46,.12)'}`, background: active ? `${color}18` : '#fff', ...label, fontSize: 29, color: active ? color : MUTED, textAlign: 'center'}}>{text}</div>;
};

export const PixelsToDataVisual: React.FC = () => {
  const f = useCurrentFrame();
  const categories = p(f, 0, 55);
  const grid = p(f, 70, 145);
  const data = p(f, 155, 260);
  const cells = Array.from({length: 12}, (_, i) => i);
  return <div style={stage}>
    <div style={{position: 'absolute', top: 40, left: 95, right: 95, height: 620, ...card, borderRadius: 44, overflow: 'hidden', background: 'linear-gradient(180deg,#DDE8FF 0%,#F4EDFF 58%,#EEE6DA 58%,#E6DDD1 100%)'}}>
      <div style={{position: 'absolute', left: 82, top: 220, width: 400, height: 280, background: '#A7A0C9', clipPath: 'polygon(0 100%,48% 12%,100% 100%)', opacity: .75}}/>
      <div style={{position: 'absolute', right: 90, top: 160, width: 150, height: 150, borderRadius: '50%', background: '#F0C86C', boxShadow: '0 0 45px rgba(240,200,108,.35)'}}/>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg,#C8D6C0,#B6C7AC)'}}/>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)', opacity: grid}}>
        {cells.map((i) => <div key={i} style={{borderRight: i % 4 === 3 ? 'none' : '3px solid rgba(255,255,255,.86)', borderBottom: i >= 8 ? 'none' : '3px solid rgba(255,255,255,.86)', background: data > .35 ? `rgba(110,69,201,${.05 + (i % 4) * .035})` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{data > .45 && i % 3 === 0 ? <div style={{...label, fontSize: 31, color: '#fff', textShadow: '0 2px 8px rgba(26,26,46,.35)'}}>{['R','G','B','L'][i / 3]}</div> : null}</div>)}
      </div>
    </div>
    <div style={{position: 'absolute', top: 700, left: 65, right: 65, display: 'flex', justifyContent: 'center', gap: 16, opacity: 1 - categories * .35}}><Chip text="KATZE" active={false}/><Chip text="AUTO" active={false}/><Chip text="TEXT" active={false}/></div>
    <div style={{position: 'absolute', top: 700, left: 150, right: 150, ...card, padding: '25px 30px', textAlign: 'center', opacity: grid, transform: `translateY(${(1-grid)*24}px)`}}><div style={{...label, fontSize: 39, color: BRAND.accentDk}}>BILDDATEN</div><div style={{marginTop: 12, ...label, fontSize: 28, color: MUTED}}>Helligkeit · Farbe · Position</div></div>
    <div style={{position: 'absolute', top: 860, left: 175, right: 175, height: 125, borderRadius: 28, background: 'rgba(185,140,255,.14)', border: '2px solid rgba(110,69,201,.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', opacity: data}}>{['R','G','B','L'].map((x, i) => <div key={x} style={{...label, fontSize: 34, color: i === 3 ? BRAND.ink : BRAND.accentDk}}>{x}</div>)}</div>
  </div>;
};

export const FeatureVectorVisual: React.FC = () => {
  const f = useCurrentFrame();
  const tiles = p(f, 0, 75);
  const vectors = p(f, 75, 165);
  const features = p(f, 165, 300);
  const names = ['FORM', 'KANTE', 'FARBE', 'POSITION'];
  return <div style={stage}>
    <div style={{position: 'absolute', top: 35, left: 100, right: 100, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, opacity: .7 + .3 * tiles}}>{Array.from({length: 8}, (_, i) => <div key={i} style={{height: 125, borderRadius: 22, background: i % 2 ? '#EDE4FB' : '#F5F0FC', border: '2px solid rgba(110,69,201,.16)', transform: `translateY(${(1-tiles)*(i%2?22:-18)}px)`}}/>)}</div>
    <div style={{position: 'absolute', top: 335, left: 90, right: 90, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 15, opacity: vectors}}>{[0,1,2,3].map((i) => <div key={i} style={{...card, height: 190, padding: 20, display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 8}}>{[.45,.8,.6,.95].map((h,j) => <div key={j} style={{flex:1,height:`${h*110*(.55+.45*vectors)}px`,borderRadius:12,background:j===i?BRAND.accentDk:'#DCCBF5'}}/>)}</div>)}</div>
    <div style={{position: 'absolute', top: 615, left: 50, right: 50, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>{names.map((name, i) => <div key={name} style={{...card, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp(features * (1.5 - i * .12)), transform: `translateY(${(1-features)*(18+i*5)}px)`, borderColor: features > .72 ? 'rgba(110,69,201,.34)' : 'rgba(110,69,201,.18)'}}><div style={{...label,fontSize:35,color:BRAND.accentDk}}>{name}</div></div>)}</div>
    <div style={{position: 'absolute', top: 970, left: 145, right: 145, height: 12, borderRadius: 12, background: 'rgba(110,69,201,.12)', opacity: features}}><div style={{height:'100%',width:`${features*100}%`,background:BRAND.accentDk,borderRadius:12}}/></div>
  </div>;
};

export const VisionLanguageVisual: React.FC = () => {
  const f = useCurrentFrame();
  const bridge = p(f, 0, 95);
  const answer = p(f, 105, 190);
  const tasks = p(f, 190, 310);
  return <div style={stage}>
    <div style={{position:'absolute',top:100,left:45,width:335,height:420,...card,padding:28}}><div style={{width:'100%',height:230,borderRadius:25,background:'linear-gradient(150deg,#DDE8FF,#EDE3FA 60%,#D7DFC8)',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:44,top:95,width:210,height:130,background:'#9D96C4',clipPath:'polygon(0 100%,50% 5%,100% 100%)'}}/><div style={{position:'absolute',right:34,top:38,width:74,height:74,borderRadius:'50%',background:'#F0C86C'}}/></div><div style={{marginTop:26,...label,fontSize:34,color:BRAND.accentDk,textAlign:'center'}}>VISUELL</div></div>
    <div style={{position:'absolute',top:282,left:380,right:380,height:24,borderRadius:20,background:'rgba(110,69,201,.12)'}}><div style={{height:'100%',width:`${bridge*100}%`,background:BRAND.accentDk,borderRadius:20,boxShadow:'0 0 30px rgba(110,69,201,.32)'}}/></div>
    <div style={{position:'absolute',top:100,right:45,width:335,height:420,...card,padding:28,opacity:.55+.45*bridge}}><div style={{display:'flex',flexDirection:'column',gap:18}}>{['Was sehe ich?','Welcher Text?','Wo ist es?'].map((x,i)=><div key={x} style={{height:76,borderRadius:20,background:i===0?'rgba(185,140,255,.16)':'#F7F5FA',border:'2px solid rgba(110,69,201,.14)',display:'flex',alignItems:'center',padding:'0 20px',...label,fontSize:27,color:i===0?BRAND.accentDk:BRAND.ink}}>{x}</div>)}</div><div style={{marginTop:25,...label,fontSize:34,color:BRAND.accentDk,textAlign:'center'}}>SPRACHE</div></div>
    <div style={{position:'absolute',top:610,left:120,right:120,...card,minHeight:175,padding:30,opacity:answer,transform:`scale(${.94+.06*answer})`}}><div style={{...label,fontSize:27,color:MUTED}}>ANTWORT</div><div style={{marginTop:18,...label,fontSize:38,color:BRAND.accentDk}}>Bildinformation wird beschreibbar</div></div>
    <div style={{position:'absolute',top:860,left:72,right:72,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,opacity:tasks}}>{['FRAGE','TEXT','OBJEKT'].map((x,i)=><div key={x} style={{height:130,borderRadius:26,background:i===Math.min(2,Math.floor(tasks*3))?'rgba(185,140,255,.20)':'#fff',border:'2px solid rgba(110,69,201,.22)',display:'flex',alignItems:'center',justifyContent:'center',...label,fontSize:31,color:BRAND.accentDk}}>{x}</div>)}</div>
  </div>;
};

export const LimitsVisual: React.FC = () => {
  const f = useCurrentFrame();
  const differ = p(f, 0, 65);
  const first = p(f, 70, 155);
  const second = p(f, 155, 255);
  const items = [
    {name:'KLEINE SCHRIFT',on:first},
    {name:'VERDECKT',on:first},
    {name:'PERSPEKTIVE',on:second},
    {name:'RAUM',on:second},
  ];
  return <div style={stage}>
    <div style={{position:'absolute',top:30,left:180,right:180,height:155,...card,display:'flex',alignItems:'center',justifyContent:'space-around'}}><div style={{...label,fontSize:50,color:BRAND.accentDk}}>MENSCH</div><div style={{...label,fontSize:64,color:differ>.5?RED:MUTED}}>{differ>.5?'≠':'='}</div><div style={{...label,fontSize:50,color:BRAND.accentDk}}>MODELL</div></div>
    <div style={{position:'absolute',top:255,left:55,right:55,display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>{items.map((item,i)=><div key={item.name} style={{height:270,borderRadius:34,background:item.on>.55?'rgba(200,86,102,.09)':'#fff',border:`3px solid ${item.on>.55?'rgba(200,86,102,.48)':'rgba(110,69,201,.16)'}`,boxShadow:'0 20px 55px rgba(26,26,46,.08)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:22,transform:`scale(${.97+.03*item.on})`}}><div style={{width:76,height:76,borderRadius:24,background:item.on>.55?'rgba(200,86,102,.12)':'rgba(185,140,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',...label,fontSize:44,color:item.on>.55?RED:BRAND.accentDk}}>{['Aa','◫','◇','↔'][i]}</div><div style={{...label,fontSize:item.name.length>10?29:34,color:item.on>.55?RED:BRAND.ink,textAlign:'center'}}>{item.name}</div></div>)}</div>
    <div style={{position:'absolute',top:885,left:245,right:245,height:115,borderRadius:30,background:'rgba(200,86,102,.10)',border:'2px solid rgba(200,86,102,.28)',display:'flex',alignItems:'center',justifyContent:'center',opacity:second}}><div style={{...label,fontSize:39,color:RED}}>Kann falsch liegen ?</div></div>
  </div>;
};

export const FocusPromptVisual: React.FC = () => {
  const f = useCurrentFrame();
  const task = p(f, 0, 110);
  const region = p(f, 105, 210);
  const format = p(f, 205, 305);
  const focus = p(f, 290, 390);
  const finish = p(f, 380, 470);
  return <div style={stage}>
    <div style={{position:'absolute',top:30,left:65,right:65,height:445,...card,padding:28,display:'grid',gridTemplateColumns:'1fr 1fr',gap:26}}>
      <div style={{borderRadius:30,background:'linear-gradient(150deg,#DDE8FF,#EDE3FA 60%,#D7DFC8)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',left:40,top:145,width:285,height:190,background:'#9D96C4',clipPath:'polygon(0 100%,50% 5%,100% 100%)'}}/>
        <div style={{position:'absolute',right:38,top:48,width:86,height:86,borderRadius:'50%',background:'#F0C86C'}}/>
        <div style={{position:'absolute',left:interpolate(focus,[0,1],[18,115],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),top:interpolate(focus,[0,1],[20,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),width:interpolate(focus,[0,1],[360,180],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),height:interpolate(focus,[0,1],[385,190],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),border:`5px solid ${BRAND.accentDk}`,borderRadius:24,boxShadow:'0 0 0 999px rgba(26,26,46,.08)'}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:18,justifyContent:'center'}}><Chip text="AUFGABE" active={task>.45}/><Chip text="BEREICH" active={region>.45}/><Chip text="FORMAT" active={format>.45}/></div>
    </div>
    <div style={{position:'absolute',top:560,left:175,right:175,height:12,borderRadius:12,background:'rgba(110,69,201,.12)'}}><div style={{height:'100%',width:`${focus*100}%`,background:BRAND.accentDk,borderRadius:12}}/></div>
    <div style={{position:'absolute',top:645,left:120,right:120,...card,minHeight:170,padding:30,textAlign:'center',opacity:focus,transform:`translateY(${(1-focus)*22}px)`}}><div style={{...label,fontSize:28,color:MUTED}}>SUCHFLÄCHE</div><div style={{marginTop:16,...label,fontSize:43,color:BRAND.accentDk}}>KLARER FOKUS</div></div>
    <div style={{position:'absolute',top:875,left:150,right:150,height:130,borderRadius:34,background:'rgba(79,157,116,.12)',border:'3px solid rgba(79,157,116,.40)',display:'flex',alignItems:'center',justifyContent:'center',opacity:finish,transform:`scale(${.94+.06*finish})`}}><div style={{...label,fontSize:42,color:GREEN}}>WENIGER RATEN</div></div>
  </div>;
};
