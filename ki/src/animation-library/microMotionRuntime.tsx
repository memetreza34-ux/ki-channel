import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  getMicroMotionMechanism,
  type MicroMotionMechanism,
} from './microMotionCatalog';
import {
  GlassSurface,
  PROTOTYPE_PALETTE,
  PrototypeShell,
  prototypeProgress,
} from './prototypes/PrototypeShell';

export type SemanticMicroMotionProps = {
  mechanismId: string;
  text?: string;
  secondaryText?: string;
  value?: number;
};

const clamp = (value: number): number => Math.max(0, Math.min(1, value));

const KineticTypeVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  text: string;
}> = ({mechanism, text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 180, mass: 0.7}});
  const accent = prototypeProgress(frame, 20, 42);
  const isStrike = mechanism.mechanismId.includes('strike');
  const isExpand = mechanism.mechanismId.includes('width');
  const isBracket = mechanism.mechanismId.includes('bracket');

  return (
    <div style={{position:'absolute',left:90,right:90,top:670,textAlign:'center'}}>
      <div
        style={{
          display:'inline-block',
          position:'relative',
          padding:isBracket?'24px 42px':'18px 24px',
          fontSize:94,
          lineHeight:1,
          fontWeight:900,
          letterSpacing:-3,
          color:isStrike?PROTOTYPE_PALETTE.danger:PROTOTYPE_PALETTE.foreground,
          opacity:enter,
          transform:`translateY(${(1-enter)*45}px) scaleX(${isExpand?0.82+accent*0.18:1}) scale(${0.86+enter*0.14})`,
        }}
      >
        {text}
        {isStrike ? (
          <div style={{position:'absolute',left:0,right:0,top:'52%',height:11,borderRadius:999,background:PROTOTYPE_PALETTE.danger,transform:`scaleX(${accent})`,transformOrigin:'left',boxShadow:'0 0 22px rgba(255,93,108,.45)'}} />
        ) : null}
        {isBracket ? (
          <>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:16,borderLeft:`5px solid ${PROTOTYPE_PALETTE.accent}`,borderTop:`5px solid ${PROTOTYPE_PALETTE.accent}`,borderBottom:`5px solid ${PROTOTYPE_PALETTE.accent}`,transform:`scaleY(${accent})`}} />
            <div style={{position:'absolute',right:0,top:0,bottom:0,width:16,borderRight:`5px solid ${PROTOTYPE_PALETTE.accent}`,borderTop:`5px solid ${PROTOTYPE_PALETTE.accent}`,borderBottom:`5px solid ${PROTOTYPE_PALETTE.accent}`,transform:`scaleY(${accent})`}} />
          </>
        ) : null}
      </div>
      <div style={{marginTop:36,fontSize:28,fontWeight:800,color:PROTOTYPE_PALETTE.muted,opacity:accent}}>WICHTIGES WORT · SICHTBAR SYNCHRONISIERT</div>
    </div>
  );
};

const MeasurementVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  value: number;
}> = ({mechanism, value}) => {
  const frame = useCurrentFrame();
  const p = prototypeProgress(frame, 10, 66);
  const displayValue = Math.round(value * p);
  const gauge = mechanism.mechanismId.includes('gauge');
  const stack = mechanism.mechanismId.includes('stack');

  if (gauge) {
    const radius = 190;
    const circumference = Math.PI * radius;
    return (
      <div style={{position:'absolute',left:0,right:0,top:560,display:'flex',justifyContent:'center'}}>
        <svg width="520" height="330" viewBox="0 0 520 330">
          <path d="M 70 270 A 190 190 0 0 1 450 270" fill="none" stroke={PROTOTYPE_PALETTE.line} strokeWidth="34" strokeLinecap="round" />
          <path d="M 70 270 A 190 190 0 0 1 450 270" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth="34" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-p)} style={{filter:'drop-shadow(0 0 16px rgba(135,87,232,.35))'}} />
          <text x="260" y="244" textAnchor="middle" fontSize="86" fontWeight="900" fill={PROTOTYPE_PALETTE.foreground}>{displayValue}%</text>
        </svg>
      </div>
    );
  }

  if (stack) {
    return (
      <div style={{position:'absolute',left:120,right:120,top:570,height:520,display:'flex',alignItems:'flex-end',justifyContent:'center',gap:20}}>
        {Array.from({length:8},(_,index)=>{
          const local=clamp((p*9-index)/1.3);
          return <div key={index} style={{width:76,height:70+index*24,borderRadius:22,background:index%2===0?PROTOTYPE_PALETTE.accent:PROTOTYPE_PALETTE.accentSoft,opacity:local,transform:`translateY(${(1-local)*80}px) scale(${0.8+local*0.2})`,boxShadow:'0 16px 38px rgba(70,45,120,.18)'}} />;
        })}
      </div>
    );
  }

  return (
    <div style={{position:'absolute',left:0,right:0,top:650,textAlign:'center'}}>
      <div style={{fontFamily:'monospace',fontSize:160,fontWeight:900,letterSpacing:-8,color:PROTOTYPE_PALETTE.accent,transform:`translateY(${(1-p)*60}px) scale(${0.82+p*0.18})`}}>{displayValue}</div>
      <div style={{fontSize:28,fontWeight:900,letterSpacing:4,color:PROTOTYPE_PALETTE.muted}}>MESSWERT</div>
    </div>
  );
};

const ConnectorVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  text: string;
  secondaryText: string;
}> = ({mechanism, text, secondaryText}) => {
  const frame = useCurrentFrame();
  const p = prototypeProgress(frame, 12, 64);
  const weighted = mechanism.mechanismId.includes('weight');
  return (
    <div style={{position:'absolute',left:70,right:70,top:540,height:650}}>
      <GlassSurface style={{position:'absolute',left:20,top:170,width:300,height:180,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900}}>{text}</GlassSurface>
      <GlassSurface style={{position:'absolute',right:20,top:330,width:300,height:180,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:900}}>{secondaryText}</GlassSurface>
      <svg width="940" height="650" viewBox="0 0 940 650" style={{position:'absolute',inset:0}}>
        <path d="M 320 260 C 470 180, 520 500, 620 420" fill="none" stroke={PROTOTYPE_PALETTE.accent} strokeWidth={weighted?8+16*p:10} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900*(1-p)} style={{filter:'drop-shadow(0 0 12px rgba(135,87,232,.35))'}} />
        <circle cx={620} cy={420} r={14+10*p} fill={PROTOTYPE_PALETTE.accent} opacity={p} />
      </svg>
    </div>
  );
};

const AnnotationVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  text: string;
}> = ({mechanism, text}) => {
  const frame = useCurrentFrame();
  const p = prototypeProgress(frame, 12, 46);
  const warning = mechanism.mechanismId.includes('warning') || mechanism.mechanismId.includes('risk');
  const source = mechanism.mechanismId.includes('source');
  const check = mechanism.mechanismId.includes('check');
  const color = warning ? PROTOTYPE_PALETTE.danger : check ? PROTOTYPE_PALETTE.success : PROTOTYPE_PALETTE.accent;
  return (
    <div style={{position:'absolute',left:120,right:120,top:650,display:'flex',justifyContent:'center'}}>
      <div style={{minWidth:520,padding:'38px 48px',borderRadius:34,background:'rgba(255,255,255,.9)',border:`3px solid ${color}`,boxShadow:`0 24px 70px ${color}33`,textAlign:'center',opacity:p,transform:`translateY(${(1-p)*50}px) scale(${0.86+p*0.14})`}}>
        <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color}}>{source?'QUELLE':warning?'WARNUNG':check?'ERGEBNIS':'HINWEIS'}</div>
        <div style={{marginTop:18,fontSize:54,fontWeight:900,lineHeight:1.05,color:PROTOTYPE_PALETTE.foreground}}>{text}</div>
        <div style={{margin:'28px auto 0',width:source?220:70,height:source?10:70,borderRadius:source?999:999,background:color,transform:`scale(${p})`,boxShadow:`0 0 24px ${color}55`}} />
      </div>
    </div>
  );
};

const UiSimulationVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  text: string;
}> = ({mechanism, text}) => {
  const frame = useCurrentFrame();
  const panel = prototypeProgress(frame, 0, 20);
  const cursor = prototypeProgress(frame, 18, 52);
  const result = prototypeProgress(frame, 48, 74);
  const command = mechanism.mechanismId.includes('command');
  const scroll = mechanism.mechanismId.includes('scroll');
  const cursorX = interpolate(cursor,[0,1],[160,700]);
  const cursorY = scroll?interpolate(cursor,[0,1],[220,470]):interpolate(cursor,[0,1],[440,250]);
  return (
    <GlassSurface style={{position:'absolute',left:100,right:100,top:470,height:720,overflow:'hidden',opacity:panel,transform:`translateY(${(1-panel)*60}px)`}}>
      <div style={{height:72,borderBottom:`1px solid ${PROTOTYPE_PALETTE.line}`,display:'flex',alignItems:'center',gap:12,padding:'0 24px'}}>
        {[0,1,2].map((dot)=><div key={dot} style={{width:16,height:16,borderRadius:999,background:dot===0?PROTOTYPE_PALETTE.danger:dot===1?PROTOTYPE_PALETTE.warning:PROTOTYPE_PALETTE.success}} />)}
      </div>
      <div style={{padding:40}}>
        <div style={{fontFamily:command?'monospace':'Arial',fontSize:32,fontWeight:800,padding:24,borderRadius:22,background:'#F2EEF8',border:`1px solid ${PROTOTYPE_PALETTE.line}`}}>{command?`> ${text}`:text}</div>
        <div style={{marginTop:32,height:250,borderRadius:26,background:result?`linear-gradient(135deg, ${PROTOTYPE_PALETTE.accent}22, ${PROTOTYPE_PALETTE.success}20)`:'#F7F5FA',border:`2px solid ${result?PROTOTYPE_PALETTE.accent:PROTOTYPE_PALETTE.line}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:900,opacity:0.3+0.7*result}}>ERGEBNIS</div>
      </div>
      <div style={{position:'absolute',left:cursorX,top:cursorY,width:34,height:48,clipPath:'polygon(0 0, 100% 70%, 58% 76%, 45% 100%)',background:PROTOTYPE_PALETTE.foreground,filter:'drop-shadow(0 8px 10px rgba(0,0,0,.2))'}} />
    </GlassSurface>
  );
};

const MainObjectVisual: React.FC<{
  mechanism: MicroMotionMechanism;
  text: string;
  secondaryText: string;
}> = ({mechanism, text, secondaryText}) => {
  const frame = useCurrentFrame();
  const enter = prototypeProgress(frame, 0, 20);
  const action = prototypeProgress(frame, 20, 58);
  const resolve = prototypeProgress(frame, 56, 82);
  const split = mechanism.mechanismId.includes('split') || mechanism.mechanismId.includes('comparison');
  const press = mechanism.mechanismId.includes('press') || mechanism.mechanismId.includes('compress');
  const domino = mechanism.mechanismId.includes('domino');
  const handoff = mechanism.mechanismId.includes('handoff');

  return (
    <div style={{position:'absolute',left:80,right:80,top:520,height:680}}>
      {domino ? Array.from({length:7},(_,index)=>{
        const local=clamp(action*7-index);
        return <div key={index} style={{position:'absolute',left:100+index*105,top:300+Math.sin(index)*40,width:64,height:180,borderRadius:18,background:index===6?PROTOTYPE_PALETTE.success:PROTOTYPE_PALETTE.accent,transformOrigin:'bottom',transform:`rotate(${local*64}deg)`,boxShadow:'0 18px 42px rgba(60,40,100,.18)'}} />;
      }) : (
        <>
          <GlassSurface style={{position:'absolute',left:split?40:110,top:180,width:split?330:360,height:240,display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:900,opacity:enter,transform:`translateX(${handoff?action*260:press?action*100:0}px) scale(${press?1-action*0.18:1})`}}>{text}</GlassSurface>
          <GlassSurface style={{position:'absolute',right:split?40:110,top:split?340:180,width:split?330:360,height:240,display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:900,border:`2px solid ${PROTOTYPE_PALETTE.success}`,opacity:split?action:resolve,transform:`translateY(${(1-(split?action:resolve))*70}px) scale(${0.84+(split?action:resolve)*0.16})`}}>{secondaryText}</GlassSurface>
          <div style={{position:'absolute',left:'50%',top:270,width:100,height:18,borderRadius:999,background:PROTOTYPE_PALETTE.accent,transform:`translateX(-50%) scaleX(${action})`,boxShadow:'0 0 24px rgba(135,87,232,.4)'}} />
        </>
      )}
    </div>
  );
};

const TransitionVisual: React.FC<{
  mechanism: MicroMotionMechanism;
}> = ({mechanism}) => {
  const frame = useCurrentFrame();
  const p = prototypeProgress(frame, 8, 62);
  const hard = mechanism.mechanismId.includes('hard-cut');
  const shape = mechanism.mechanismId.includes('shape');
  if (hard) {
    return <AbsoluteFill style={{background:frame<35?PROTOTYPE_PALETTE.background:PROTOTYPE_PALETTE.foreground,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:70,fontWeight:900,color:frame<35?PROTOTYPE_PALETTE.foreground:PROTOTYPE_PALETTE.white,transform:`scale(${1+Math.sin(Math.PI*p)*0.12})`}}>KLARER SCHNITT</div></AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{overflow:'hidden'}}>
      <div style={{position:'absolute',left:interpolate(p,[0,1],[-320,1180]),top:shape?650:850,width:shape?430:240,height:shape?430:240,borderRadius:shape?80:999,background:PROTOTYPE_PALETTE.accent,transform:`rotate(${shape?p*90:0}deg)`,boxShadow:'0 0 60px rgba(135,87,232,.35)'}} />
    </AbsoluteFill>
  );
};

export const SemanticMicroMotion: React.FC<SemanticMicroMotionProps> = ({
  mechanismId,
  text = 'WICHTIG',
  secondaryText = 'ERGEBNIS',
  value = 73,
}) => {
  const mechanism = getMicroMotionMechanism(mechanismId);
  if (!mechanism) {
    throw new Error(`unknown semantic micro-motion: ${mechanismId}`);
  }

  return (
    <PrototypeShell
      family={`MICRO · ${mechanism.layer}`}
      title={mechanism.mechanismId.replace(/-/g, ' ').toUpperCase()}
      subtitle={mechanism.semanticPurpose}
    >
      {mechanism.layer === 'kinetic-type' ? <KineticTypeVisual mechanism={mechanism} text={text} /> : null}
      {mechanism.layer === 'measurement' ? <MeasurementVisual mechanism={mechanism} value={value} /> : null}
      {mechanism.layer === 'connector' ? <ConnectorVisual mechanism={mechanism} text={text} secondaryText={secondaryText} /> : null}
      {mechanism.layer === 'annotation' ? <AnnotationVisual mechanism={mechanism} text={text} /> : null}
      {mechanism.layer === 'ui-simulation' ? <UiSimulationVisual mechanism={mechanism} text={text} /> : null}
      {mechanism.layer === 'main-object' ? <MainObjectVisual mechanism={mechanism} text={text} secondaryText={secondaryText} /> : null}
      {mechanism.layer === 'transition' ? <TransitionVisual mechanism={mechanism} /> : null}
    </PrototypeShell>
  );
};
