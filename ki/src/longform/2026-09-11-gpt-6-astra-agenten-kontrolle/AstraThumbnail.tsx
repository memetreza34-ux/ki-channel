import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ASTRA_COLORS, ASTRA_FONT_STACK} from './design';

export type AstraThumbnailVariant = 'A' | 'B' | 'C';

const ModelCore: React.FC<{size?: number}> = ({size = 220}) => (
  <div style={{width: size, height: size, borderRadius: 999, display: 'grid', placeItems: 'center', background: `radial-gradient(circle at 35% 28%, ${ASTRA_COLORS.lavender}, ${ASTRA_COLORS.purple} 62%, ${ASTRA_COLORS.ink})`, boxShadow: '0 26px 60px rgba(110,69,201,0.28)', color: 'white', fontWeight: 950, fontSize: size * 0.23, letterSpacing: -2}}>ASTRA</div>
);

const ThumbnailA: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.background, fontFamily: ASTRA_FONT_STACK, color: ASTRA_COLORS.ink, padding: 62}}>
    <div style={{fontSize: 72, fontWeight: 950, lineHeight: 0.95, maxWidth: 700}}>JETZT HANDELT<br/>DIE KI</div>
    <div style={{position: 'absolute', left: 90, bottom: 68, display: 'flex', gap: 24, alignItems: 'center'}}>
      {['Browser', 'Datei', 'Code', 'Tool'].map((x, i) => <div key={x} style={{padding: '18px 22px', borderRadius: 18, backgroundColor: ASTRA_COLORS.surface, border: `1px solid ${ASTRA_COLORS.line}`, fontSize: 25, fontWeight: 800, translate: `0 ${i%2===0?-10:10}px`}}>{x}</div>)}
    </div>
    <div style={{position: 'absolute', right: 290, top: 190}}><ModelCore size={250}/></div>
    <div style={{position: 'absolute', right: 72, bottom: 72, width: 330, height: 140, borderRadius: 26, backgroundColor: ASTRA_COLORS.softRisk, border: `4px solid ${ASTRA_COLORS.risk}`, display: 'grid', placeItems: 'center', color: ASTRA_COLORS.risk, fontSize: 29, fontWeight: 950}}>APPROVAL<br/>REQUIRED</div>
  </AbsoluteFill>
);

const ThumbnailB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.background, fontFamily: ASTRA_FONT_STACK, color: ASTRA_COLORS.ink, padding: 62}}>
    <div style={{fontSize: 70, fontWeight: 950, lineHeight: 0.95}}>OPENAI:<br/><span style={{color: ASTRA_COLORS.risk}}>CRITICAL</span></div>
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 68, height: 350, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, alignItems: 'end'}}>
      {[0.24,0.43,0.68,1].map((height, i) => <div key={i} style={{height: 300*height, borderRadius: '24px 24px 12px 12px', backgroundColor: i===3?ASTRA_COLORS.softRisk:ASTRA_COLORS.surface, border: `3px solid ${i===3?ASTRA_COLORS.risk:ASTRA_COLORS.line}`, display: 'grid', placeItems: 'center', fontSize: i===3?30:24, fontWeight: 900, color: i===3?ASTRA_COLORS.risk:ASTRA_COLORS.muted}}>{i===3?'ASTRA':'LEVEL '+(i+1)}</div>)}
    </div>
    <div style={{position: 'absolute', right: 90, top: 66}}><ModelCore size={170}/></div>
  </AbsoluteFill>
);

const ThumbnailC: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: ASTRA_COLORS.background, fontFamily: ASTRA_FONT_STACK, color: ASTRA_COLORS.ink}}>
    <div style={{position: 'absolute', left: 62, top: 58, maxWidth: 760, fontSize: 62, lineHeight: 0.98, fontWeight: 950}}>WIE VIEL<br/>KONTROLLE BLEIBT?</div>
    <div style={{position: 'absolute', right: 120, top: 235}}><ModelCore size={220}/></div>
    {[
      {label:'Permissions',x:820,y:72,tone:ASTRA_COLORS.positive},
      {label:'Sandbox',x:960,y:110,tone:ASTRA_COLORS.positive},
      {label:'Logs',x:850,y:520,tone:ASTRA_COLORS.positive},
      {label:'Monitor',x:1010,y:475,tone:ASTRA_COLORS.positive},
      {label:'Approval',x:680,y:360,tone:ASTRA_COLORS.risk},
    ].map((item) => <div key={item.label} style={{position:'absolute',left:item.x,top:item.y,padding:'16px 22px',borderRadius:999,backgroundColor:'white',border:`3px solid ${item.tone}`,fontSize:24,fontWeight:900,color:item.tone}}>{item.label}</div>)}
  </AbsoluteFill>
);

export const AstraThumbnail: React.FC<{variant: AstraThumbnailVariant}> = ({variant}) => {
  if (variant === 'A') return <ThumbnailA/>;
  if (variant === 'B') return <ThumbnailB/>;
  return <ThumbnailC/>;
};
