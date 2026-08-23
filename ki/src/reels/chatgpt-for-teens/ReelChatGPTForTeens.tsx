import React from 'react';
import {GraduationCap, LockKeyhole, ScanSearch, ShieldCheck, Sparkles} from 'lucide-react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {
  CHATGPT_TEENS_SCENES,
  CHATGPT_TEENS_SUBTITLES,
  TEEN_PALETTE as C,
  type TeenCue,
  type TeenScene,
} from './contract';
import {AgeEstimateVisual, ParentPrivacyVisual, SafetyPauseVisual, StudyModeVisual, TeenSwitchVisual} from './Visuals';

const visualByScene: Record<TeenScene['sceneId'], React.FC> = {
  scene1: TeenSwitchVisual,
  scene2: AgeEstimateVisual,
  scene3: StudyModeVisual,
  scene4: SafetyPauseVisual,
  scene5: ParentPrivacyVisual,
};

const iconByScene: Record<TeenScene['sceneId'], React.ReactNode> = {
  scene1: <Sparkles size={32}/>,
  scene2: <ScanSearch size={32}/>,
  scene3: <GraduationCap size={32}/>,
  scene4: <ShieldCheck size={32}/>,
  scene5: <LockKeyhole size={32}/>,
};

const SceneHeader: React.FC<{scene: TeenScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 58,
        right: 58,
        top: 112,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enter,
        transform: `translateY(${(1-enter)*-14}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 15,
          padding: '10px 18px 10px 12px',
          borderRadius: 25,
          background: 'rgba(255,255,255,.78)',
          border: '1px solid rgba(255,255,255,.72)',
          boxShadow: '0 12px 34px rgba(16,32,51,.10)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 19,
            display: 'grid',
            placeItems: 'center',
            background: scene.surface,
            color: scene.accent,
            border: `1.5px solid ${scene.accent}42`,
          }}
        >
          {iconByScene[scene.sceneId]}
        </div>
        <div
          style={{
            fontFamily: BRAND.font,
            fontSize: scene.headline.length > 25 ? 37 : 43,
            lineHeight: 1.03,
            fontWeight: 950,
            letterSpacing: -1.45,
            color: C.ink,
            textAlign: 'center',
          }}
        >
          {scene.headline}
        </div>
      </div>
    </div>
  );
};

const activeWordIndex = (frame: number, cue: TeenCue, count: number) => {
  if (count <= 1) return 0;
  if (cue.words?.length === count) {
    const exact = cue.words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);
    if (exact >= 0) return exact;
  }
  return 0;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CHATGPT_TEENS_SUBTITLES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  const scene = CHATGPT_TEENS_SCENES.find((item) => item.sceneId === cue.sceneId);
  const words = cue.words?.length ? cue.words.map((word) => word.text) : cue.text.trim().split(/\s+/);
  const active = activeWordIndex(frame, cue, words.length);
  const alpha = Math.min(
    interpolate(frame,[cue.startFrame,cue.startFrame+3],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
    interpolate(frame,[cue.endFrame-3,cue.endFrame],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
  );
  const accent = scene?.accent ?? C.purple;
  return (
    <div
      style={{
        position: 'absolute',
        left: REEL_CAPTION_SAFE.horizontalInset,
        right: REEL_CAPTION_SAFE.horizontalInset,
        bottom: 250,
        zIndex: 220,
        display: 'flex',
        justifyContent: 'center',
        opacity: alpha,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          textAlign: 'center',
          fontFamily: BRAND.font,
          fontSize: 44,
          fontWeight: 880,
          lineHeight: 1.16,
          letterSpacing: -.6,
          color: C.ink,
          textShadow: '0 1px 2px rgba(255,255,255,.5),0 8px 28px rgba(16,32,51,.14)',
          background: 'rgba(255,255,255,.58)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,.62)',
          borderRadius: 26,
          padding: '15px 22px 17px',
          boxShadow: '0 12px 34px rgba(16,32,51,.10)',
        }}
      >
        {words.map((word,index)=><React.Fragment key={`${cue.id}-${index}`}><span style={{display:'inline-block',color:index===active?accent:C.ink,transform:`scale(${index===active?1.045:1})`,transformOrigin:'50% 75%'}}>{word}</span>{index < words.length-1 ? ' ' : null}</React.Fragment>)}
      </div>
    </div>
  );
};

const SceneLayer: React.FC<{scene: TeenScene}> = ({scene}) => {
  const Visual = visualByScene[scene.sceneId];
  if (!Visual) throw new Error(`Missing isolated teen visual for ${scene.sceneId}`);
  return (
    <AbsoluteFill>
      <Visual/>
      <SceneHeader scene={scene}/>
    </AbsoluteFill>
  );
};

export type ReelChatGPTForTeensProps = {voiceoverSrc?: string; showCaptions?: boolean};

export const ReelChatGPTForTeens: React.FC<ReelChatGPTForTeensProps> = ({voiceoverSrc, showCaptions = true}) => (
  <AbsoluteFill style={{background:'#F8FAFC',color:C.ink,fontFamily:BRAND.font,overflow:'hidden'}}>
    {CHATGPT_TEENS_SCENES.map((scene)=><Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame-scene.startFrame} name={`TEENS-${scene.sceneId}-NEW_BUILD`}><SceneLayer scene={scene}/></Sequence>)}
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc}/> : null}
    {showCaptions ? <Captions/> : null}
  </AbsoluteFill>
);
