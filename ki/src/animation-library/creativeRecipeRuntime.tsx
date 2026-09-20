import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../brand/brand';
import {
  CREATIVE_RECIPE_IDS,
  type CreativeRecipeId,
} from './creativeRecipeCatalog';
import {
  CameraStage,
  DepthLayer,
  MotionReveal,
  PulseHalo,
  animatedStrokeDashoffset,
  type CameraStageMode,
} from './creativeMotionPrimitives';
import type {AnimationBuildSpec} from './proposalCompiler';

export type CreativeRecipeRuntimeProps = {
  spec: AnimationBuildSpec;
  showRecipeLabel?: boolean;
};

const purple = BRAND.accentDk;
const accent = BRAND.accent;
const ink = BRAND.ink;
const soft = '#EFE7FF';
const line = '#D9CFE7';
const muted = '#716A7C';
const success = '#35A779';
const danger = '#E35D6A';

const p = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clampText = (value: string, maximum = 28): string => {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= maximum) return compact;
  return `${compact.slice(0, Math.max(1, maximum - 1)).trim()}…`;
};

const runtimeTerms = (spec: AnimationBuildSpec) => {
  const contract = spec.contentContract;
  const subject = clampText(
    contract?.subjectTerms[0] ?? spec.semanticTags[0] ?? 'Ausgang',
  );
  const action = clampText(
    contract?.actionTerms[0] ?? spec.semanticTags[1] ?? 'Veränderung',
  );
  const result = clampText(
    contract?.resultTerms[0] ?? spec.semanticTags[2] ?? 'Ergebnis',
  );
  return {subject, action, result};
};

const cameraForRecipe: Record<CreativeRecipeId, CameraStageMode> = {
  'object-morph-stage': 'push',
  'path-trace-field': 'pan-left',
  'network-bloom': 'parallax',
  'xray-overlay': 'push',
  'typographic-construct': 'locked',
  'cutaway-stack': 'pan-right',
  'depth-corridor': 'push',
  'ui-state-machine': 'parallax',
};

export const isCreativeRecipeRuntimeSupported = (
  recipeId: string,
): recipeId is CreativeRecipeId =>
  (CREATIVE_RECIPE_IDS as readonly string[]).includes(recipeId);

const ObjectMorphStage: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const morph = p(frame, durationInFrames * 0.22, durationInFrames * 0.68);
  const resolve = p(frame, durationInFrames * 0.62, durationInFrames * 0.84);
  const width = interpolate(morph, [0, 1], [230, 370]);
  const height = interpolate(morph, [0, 1], [230, 190]);
  const radius = interpolate(morph, [0, 1], [115, 34]);
  const x = interpolate(morph, [0, 1], [315, 540]);
  const rotation = interpolate(morph, [0, 1], [-8, 3]);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      <svg viewBox="0 0 1080 1100" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {[0, 1, 2].map((index) => {
          const orbit = p(frame, 10 + index * 16, 55 + index * 16);
          return (
            <ellipse
              key={index}
              cx="540"
              cy="505"
              rx={250 + index * 82}
              ry={160 + index * 52}
              fill="none"
              stroke={index === 0 ? accent : line}
              strokeWidth={index === 0 ? 5 : 3}
              strokeDasharray={`${26 + index * 6} ${18 + index * 5}`}
              opacity={orbit * (0.65 - index * 0.12)}
              transform={`rotate(${index * 17 - 15} 540 505)`}
            />
          );
        })}
      </svg>

      <MotionReveal startFrame={8} endFrame={42} fromX={-38} style={{position: 'absolute', left: 78, top: 180, width: 300}}>
        <div style={{fontSize: 27, fontWeight: 850, color: muted}}>START</div>
        <div style={{fontSize: 43, lineHeight: 1.04, fontWeight: 950, color: ink, marginTop: 8}}>{subject}</div>
      </MotionReveal>

      <div
        style={{
          position: 'absolute',
          left: x - width / 2,
          top: 390 - height / 2,
          width,
          height,
          borderRadius: radius,
          background: `linear-gradient(145deg, #FFFFFF 0%, ${soft} 62%, #FFFFFF 100%)`,
          border: `5px solid ${morph > 0.55 ? success : accent}`,
          boxShadow: '0 28px 70px rgba(77,50,115,.16)',
          rotate: `${rotation}deg`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 28,
          boxSizing: 'border-box',
        }}
      >
        <div style={{fontSize: 36, lineHeight: 1.04, fontWeight: 950, color: morph > 0.55 ? success : purple}}>
          {morph > 0.52 ? result : subject}
        </div>
      </div>

      <div style={{position: 'absolute', left: 390, top: 710, right: 110, opacity: p(frame, 60, 112)}}>
        <div style={{height: 6, background: line, borderRadius: 99, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${morph * 100}%`, background: purple, borderRadius: 99}} />
        </div>
        <div style={{marginTop: 20, fontSize: 29, fontWeight: 900, color: purple}}>{action}</div>
      </div>

      <div style={{position: 'absolute', right: 84, top: 205, width: 300, textAlign: 'right', opacity: resolve}}>
        <div style={{fontSize: 27, fontWeight: 850, color: success}}>ERGEBNIS</div>
        <div style={{fontSize: 42, lineHeight: 1.04, fontWeight: 950, color: ink, marginTop: 8}}>{result}</div>
      </div>
    </AbsoluteFill>
  );
};

const PathTraceField: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const drawStart = Math.round(durationInFrames * 0.12);
  const drawEnd = Math.round(durationInFrames * 0.67);
  const pathLength = 1040;
  const travel = p(frame, drawStart, drawEnd);
  const markerX = interpolate(travel, [0, 0.38, 0.68, 1], [120, 410, 700, 950]);
  const markerY = interpolate(travel, [0, 0.38, 0.68, 1], [610, 330, 690, 420]);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      <svg viewBox="0 0 1080 1100" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <path d="M120 610 C260 610 285 330 410 330 S565 690 700 690 S825 420 950 420" fill="none" stroke="#ECE5F3" strokeWidth="34" strokeLinecap="round" />
        <path
          d="M120 610 C260 610 285 330 410 330 S565 690 700 690 S825 420 950 420"
          fill="none"
          stroke={purple}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={animatedStrokeDashoffset({frame, startFrame: drawStart, endFrame: drawEnd, length: pathLength})}
        />
        {[{x:120,y:610},{x:410,y:330},{x:700,y:690},{x:950,y:420}].map((node, index) => (
          <g key={index} opacity={p(frame, drawStart + index * 18, drawStart + index * 18 + 28)}>
            <circle cx={node.x} cy={node.y} r="39" fill="#fff" stroke={index === 3 ? success : accent} strokeWidth="5" />
            <circle cx={node.x} cy={node.y} r="12" fill={index === 3 ? success : purple} />
          </g>
        ))}
        <circle cx={markerX} cy={markerY} r="19" fill={purple} />
        <circle cx={markerX} cy={markerY} r="38" fill="none" stroke="rgba(110,69,201,.18)" strokeWidth="14" />
      </svg>
      <div style={{position:'absolute',left:70,top:150,fontSize:34,fontWeight:950,color:ink}}>{subject}</div>
      <div style={{position:'absolute',left:365,top:190,fontSize:29,fontWeight:900,color:purple,opacity:p(frame,50,100)}}>{action}</div>
      <div style={{position:'absolute',right:70,top:720,width:300,textAlign:'right',fontSize:38,lineHeight:1.04,fontWeight:950,color:success,opacity:p(frame,drawEnd-20,drawEnd+28)}}>{result}</div>
    </AbsoluteFill>
  );
};

const NetworkBloom: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const center = {x: 540, y: 510};
  const nodes = [
    {x:210,y:260},{x:520,y:190},{x:855,y:285},
    {x:230,y:735},{x:550,y:820},{x:870,y:690},
  ];
  const prune = p(frame, durationInFrames * 0.58, durationInFrames * 0.78);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      <svg viewBox="0 0 1080 1100" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        {nodes.map((node,index) => {
          const reveal = p(frame, 24 + index * 12, 64 + index * 12);
          const removed = index === 1 || index === 4;
          const visible = reveal * (removed ? 1 - prune : 1);
          return <React.Fragment key={index}>
            <path d={`M${center.x} ${center.y} Q${(center.x+node.x)/2 + (index%2?50:-50)} ${(center.y+node.y)/2} ${node.x} ${node.y}`} fill="none" stroke={removed && prune>.2?danger:line} strokeWidth={removed?4:6} opacity={visible*.9} />
            <circle cx={node.x} cy={node.y} r={34 + (index%3)*5} fill="#fff" stroke={removed && prune>.2?danger:accent} strokeWidth="5" opacity={visible} />
            {!removed ? <PulseHalo x={node.x} y={node.y} radius={20} color={purple} startFrame={55+index*7} periodFrames={68+index*3} /> : null}
          </React.Fragment>;
        })}
        <circle cx={center.x} cy={center.y} r="112" fill={soft} stroke={purple} strokeWidth="6" />
        <circle cx={center.x} cy={center.y} r="82" fill="#fff" stroke={line} strokeWidth="3" />
      </svg>
      <div style={{position:'absolute',left:395,top:452,width:290,textAlign:'center',fontSize:31,lineHeight:1.02,fontWeight:950,color:purple}}>{subject}</div>
      <div style={{position:'absolute',left:340,right:340,top:915,textAlign:'center',fontSize:30,fontWeight:900,color:muted,opacity:p(frame,70,120)}}>{action}</div>
      <div style={{position:'absolute',left:310,right:310,top:980,textAlign:'center',fontSize:38,fontWeight:950,color:success,opacity:p(frame,durationInFrames*.7,durationInFrames*.84)}}>{result}</div>
    </AbsoluteFill>
  );
};

const XRayOverlay: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const scan = p(frame, durationInFrames * 0.16, durationInFrames * 0.63);
  const reveal = p(frame, durationInFrames * 0.34, durationInFrames * 0.68);
  const scanX = interpolate(scan, [0, 1], [210, 875]);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      <svg viewBox="0 0 1080 1100" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        <defs>
          <clipPath id="xray-runtime-window">
            <rect x="190" y="245" width={Math.max(0, scanX - 190)} height="565" rx="58" />
          </clipPath>
        </defs>
        <rect x="190" y="245" width="700" height="565" rx="58" fill="#fff" stroke={accent} strokeWidth="6" />
        <rect x="225" y="280" width="630" height="495" rx="44" fill="#F8F5FB" stroke={line} strokeWidth="3" />
        <g clipPath="url(#xray-runtime-window)" opacity={reveal}>
          <rect x="225" y="280" width="630" height="495" rx="44" fill="rgba(185,140,255,.14)" />
          {[0,1,2,3].map((index)=><path key={index} d={`M285 ${365+index*86} C390 ${300+index*90}, 540 ${445+index*40}, 790 ${340+index*95}`} fill="none" stroke={index===2?danger:purple} strokeWidth={index===2?9:6} strokeLinecap="round" opacity={.85}/>) }
          {[{x:320,y:420},{x:515,y:525},{x:730,y:465},{x:650,y:675}].map((node,index)=><circle key={index} cx={node.x} cy={node.y} r={index===2?30:22} fill={index===2?danger:purple} opacity={.82}/>) }
        </g>
        <rect x={scanX-5} y="255" width="10" height="545" rx="5" fill={reveal>.7?success:danger} />
        <rect x={scanX-30} y="265" width="60" height="525" fill="rgba(185,140,255,.08)" />
      </svg>
      <div style={{position:'absolute',left:235,top:155,fontSize:36,fontWeight:950,color:ink}}>{subject}</div>
      <div style={{position:'absolute',right:205,top:830,fontSize:29,fontWeight:900,color:purple,opacity:p(frame,50,100)}}>{action}</div>
      <div style={{position:'absolute',left:235,right:235,top:925,textAlign:'center',fontSize:40,lineHeight:1.04,fontWeight:950,color:success,opacity:p(frame,durationInFrames*.68,durationInFrames*.84)}}>{result}</div>
    </AbsoluteFill>
  );
};

const TypographicConstruct: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const terms = [subject, action, result];
  const positions = [{x:130,y:300},{x:520,y:500},{x:255,y:720}];
  const lock = p(frame, durationInFrames * 0.62, durationInFrames * 0.82);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      {terms.map((term,index) => {
        const show = p(frame, 18 + index * 34, 62 + index * 34);
        const settleX = interpolate(lock, [0,1], [positions[index].x, 210 + index*105]);
        const settleY = interpolate(lock, [0,1], [positions[index].y, 470 + index*68]);
        return (
          <div key={`${term}-${index}`} style={{position:'absolute',left:settleX,top:settleY,opacity:show,rotate:`${(1-show)*(index===1?8:-7)}deg`,scale:`${.82+.18*show}`}}>
            <div style={{fontSize:index===2?78:68,lineHeight:.94,fontWeight:950,letterSpacing:-2.2,color:index===2?success:index===1?purple:ink,textTransform:'uppercase'}}>{term}</div>
          </div>
        );
      })}
      <svg viewBox="0 0 1080 1100" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:p(frame,90,145)}}>
        <path d="M175 610 C360 525 545 525 820 455" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeDasharray="22 18" />
        <path d="M790 430 L835 452 L800 485" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position:'absolute',left:210,right:210,top:895,textAlign:'center',fontSize:30,fontWeight:900,color:muted,opacity:lock}}>
        Bedeutung wird als Form konstruiert – nicht als Präsentationskarte
      </div>
    </AbsoluteFill>
  );
};

const CutawayStack: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const separate = p(frame, durationInFrames * 0.16, durationInFrames * 0.58);
  const resolve = p(frame, durationInFrames * 0.62, durationInFrames * 0.84);
  const layers = [subject, action, 'Zwischenzustand', result];

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font, perspective: 1000}}>
      <div style={{position:'absolute',inset:'150px 110px 160px',transformStyle:'preserve-3d',rotate:'-5deg'}}>
        {layers.map((label,index) => (
          <DepthLayer key={`${label}-${index}`} depth={index-1.5} progress={separate} spread={82} style={{inset: `${index*28}px ${index*18}px`}}>
            <div style={{position:'absolute',left:90,right:90,top:210+index*55,height:190,borderRadius:32,background:index===3?'rgba(53,167,121,.12)':index===1?soft:'rgba(255,255,255,.92)',border:`4px solid ${index===3?success:index===1?accent:line}`,boxShadow:'0 25px 65px rgba(60,40,90,.10)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 44px',boxSizing:'border-box',opacity:index===3?.4+.6*resolve:1}}>
              <span style={{fontSize:24,fontWeight:900,color:muted}}>LAYER {index+1}</span>
              <span style={{fontSize:34,fontWeight:950,color:index===3?success:ink}}>{label}</span>
            </div>
          </DepthLayer>
        ))}
      </div>
      <div style={{position:'absolute',left:90,top:125,fontSize:39,fontWeight:950,color:purple}}>{subject}</div>
      <div style={{position:'absolute',right:90,bottom:150,width:360,textAlign:'right',fontSize:38,lineHeight:1.04,fontWeight:950,color:success,opacity:resolve}}>{result}</div>
    </AbsoluteFill>
  );
};

const DepthCorridor: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const travel = p(frame, durationInFrames * 0.08, durationInFrames * 0.74);
  const layers = [subject, action, 'Kontext', result];

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font,perspective:900,overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d'}}>
        {layers.map((label,index) => {
          const z = interpolate(travel,[0,1],[-520-index*310,260-index*80]);
          const opacity = Math.max(0.08, Math.min(1, 1 - Math.abs(z-40)/750));
          return (
            <div key={`${label}-${index}`} style={{position:'absolute',left:155,right:155,top:185+index*45,height:520,border:`4px solid ${index===3?success:index===1?accent:line}`,borderRadius:52,background:index===3?'rgba(53,167,121,.08)':'rgba(255,255,255,.74)',boxShadow:'0 30px 80px rgba(50,35,78,.10)',transform:`translateZ(${z}px)`,transformStyle:'preserve-3d',opacity,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontSize:index===3?54:42,fontWeight:950,color:index===3?success:index===1?purple:ink,textAlign:'center',maxWidth:560}}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{position:'absolute',left:110,right:110,bottom:120,textAlign:'center',fontSize:30,fontWeight:900,color:muted,opacity:p(frame,durationInFrames*.56,durationInFrames*.74)}}>Kamera bewegt sich durch Bedeutungsebenen</div>
    </AbsoluteFill>
  );
};

const UIStateMachine: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {subject, action, result} = runtimeTerms(spec);
  const trigger = p(frame, durationInFrames * 0.22, durationInFrames * 0.48);
  const confirm = p(frame, durationInFrames * 0.52, durationInFrames * 0.76);

  return (
    <AbsoluteFill style={{fontFamily: BRAND.font}}>
      <div style={{position:'absolute',left:140,right:140,top:180,height:640,borderRadius:46,border:`5px solid ${confirm>.7?success:accent}`,background:'rgba(255,255,255,.96)',boxShadow:'0 30px 90px rgba(60,40,90,.13)',overflow:'hidden'}}>
        <div style={{height:84,borderBottom:`2px solid ${line}`,display:'flex',alignItems:'center',padding:'0 30px',gap:12}}>
          {[0,1,2].map((index)=><div key={index} style={{width:16,height:16,borderRadius:'50%',background:index===0?accent:line}} />)}
          <div style={{marginLeft:22,fontSize:25,fontWeight:900,color:muted}}>{subject}</div>
        </div>
        <div style={{padding:46}}>
          <div style={{fontSize:27,fontWeight:900,color:muted}}>STATE</div>
          <div style={{fontSize:52,lineHeight:1.02,fontWeight:950,color:trigger>.5?purple:ink,marginTop:12}}>{trigger>.5?action:subject}</div>
          <div style={{marginTop:58,height:16,borderRadius:99,background:'#EEE8F4',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${(12+trigger*58+confirm*30)}%`,background:confirm>.7?success:purple,borderRadius:99}} />
          </div>
          <button type="button" style={{marginTop:58,width:'100%',height:112,borderRadius:30,border:'none',background:trigger>.45?purple:'#E5DDEA',color:'#fff',fontFamily:BRAND.font,fontSize:34,fontWeight:950,boxShadow:trigger>.45?'0 18px 42px rgba(110,69,201,.20)':'none'}}>
            {trigger>.45?'Aktion ausgelöst':'Bereit'}
          </button>
          <div style={{marginTop:42,fontSize:36,fontWeight:950,color:success,opacity:confirm,textAlign:'center'}}>{result} ✓</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RecipeVisual: React.FC<{spec: AnimationBuildSpec}> = ({spec}) => {
  switch (spec.creativeRecipeId) {
    case 'object-morph-stage':
      return <ObjectMorphStage spec={spec} />;
    case 'path-trace-field':
      return <PathTraceField spec={spec} />;
    case 'network-bloom':
      return <NetworkBloom spec={spec} />;
    case 'xray-overlay':
      return <XRayOverlay spec={spec} />;
    case 'typographic-construct':
      return <TypographicConstruct spec={spec} />;
    case 'cutaway-stack':
      return <CutawayStack spec={spec} />;
    case 'depth-corridor':
      return <DepthCorridor spec={spec} />;
    case 'ui-state-machine':
      return <UIStateMachine spec={spec} />;
  }
};

export const CreativeRecipeRuntime: React.FC<CreativeRecipeRuntimeProps> = ({
  spec,
  showRecipeLabel = false,
}) => {
  const {durationInFrames} = useVideoConfig();
  if (!isCreativeRecipeRuntimeSupported(spec.creativeRecipeId)) {
    throw new Error(`unsupported creative recipe runtime: ${spec.creativeRecipeId}`);
  }

  return (
    <AbsoluteFill style={{background:'transparent',color:ink,fontFamily:BRAND.font,overflow:'hidden'}}>
      <CameraStage
        mode={cameraForRecipe[spec.creativeRecipeId]}
        startFrame={0}
        endFrame={Math.max(1, Math.round(durationInFrames * 0.78))}
        intensity={spec.creativeRecipeId === 'depth-corridor' ? 0.45 : 0.7}
      >
        <RecipeVisual spec={spec} />
      </CameraStage>
      {showRecipeLabel ? (
        <div style={{position:'absolute',left:34,bottom:34,padding:'10px 16px',borderRadius:99,background:'rgba(26,26,46,.78)',color:'#fff',fontSize:18,fontWeight:800,letterSpacing:.2}}>
          {spec.creativeRecipeId} · {spec.runtimeMechanisms.join(' + ')}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
