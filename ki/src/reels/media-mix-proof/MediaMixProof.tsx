import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const MEDIA_MIX_PROOF_ID = 'MediaMixProofVertical';
export const MEDIA_MIX_PROOF_FPS = 30;
export const MEDIA_MIX_PROOF_WIDTH = 1080;
export const MEDIA_MIX_PROOF_HEIGHT = 1920;
export const MEDIA_MIX_PROOF_DURATION_IN_FRAMES = 360;

const C = {
  bg: '#F7F7F5',
  ink: '#132033',
  purple: '#7657D6',
  blue: '#3C7EF3',
  green: '#2FA36B',
  white: '#FFFFFF',
  muted: '#6E7584',
};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Pill: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.purple}) => (
  <div style={{display: 'inline-flex', padding: '12px 18px', borderRadius: 999, background: `${color}16`, color, fontSize: 24, fontWeight: 900, letterSpacing: 1.1}}>{children}</div>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 150}});
  const orbit = interpolate(frame, [0, 90], [-18, 26], clamp);
  return (
    <AbsoluteFill style={{background: C.bg, color: C.ink, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 86, top: 170}}><Pill>REMOTION · HYBRID TEST</Pill></div>
      <div style={{position: 'absolute', left: 86, right: 70, top: 290, transform: `translateY(${(1 - enter) * 50}px)`, opacity: enter}}>
        <div style={{fontSize: 106, lineHeight: .94, fontWeight: 950, letterSpacing: -6}}>Nicht nur Animation.</div>
        <div style={{fontSize: 106, lineHeight: .94, fontWeight: 950, letterSpacing: -6, color: C.purple, marginTop: 16}}>Bild + B-Roll + Motion.</div>
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 780, height: 650}}>
        {[0, 1, 2].map((i) => {
          const p = spring({fps, frame: Math.max(0, frame - 10 - i * 9), config: {damping: 16, stiffness: 170}});
          const labels = ['REMOTION', 'BILD', 'B-ROLL'];
          const colors = [C.purple, C.blue, C.green];
          return <div key={labels[i]} style={{position: 'absolute', left: 120 + i * 225, top: 170 + (i % 2) * 110, width: 270, height: 270, borderRadius: 72, background: C.white, boxShadow: '0 28px 80px rgba(19,32,51,.12)', border: `3px solid ${colors[i]}28`, display: 'grid', placeItems: 'center', color: colors[i], fontSize: 29, fontWeight: 950, transform: `translateY(${(1-p)*70}px) rotate(${orbit * (i === 1 ? -.22 : .18)}deg) scale(${.75 + p * .25})`, opacity: p}}>{labels[i]}</div>;
        })}
      </div>
      <div style={{position: 'absolute', left: 86, right: 86, bottom: 210, fontSize: 35, lineHeight: 1.35, color: C.muted}}>Ein echter 9:16-Techniktest für den KI-Kanal.</div>
    </AbsoluteFill>
  );
};

const ImageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 105], [1.02, 1.18], clamp);
  const pan = interpolate(frame, [0, 105], [25, -55], clamp);
  const card = spring({fps: 30, frame, config: {damping: 18, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: 'Inter, system-ui, sans-serif', color: C.ink}}>
      <div style={{position: 'absolute', left: 80, top: 115}}><Pill color={C.blue}>ECHTES BILD</Pill></div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 230, fontSize: 70, lineHeight: 1.02, fontWeight: 950, letterSpacing: -3.5}}>Ein Foto wird zum bewegten Story-Layer.</div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 520, height: 970, borderRadius: 52, overflow: 'hidden', boxShadow: '0 30px 90px rgba(19,32,51,.17)', opacity: card, transform: `scale(${.94 + card * .06})`}}>
        <Img src={staticFile('showcase/laptop-on-desk.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translateX(${pan}px) scale(${zoom})`}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(10,16,28,.82) 100%)'}} />
        <div style={{position: 'absolute', left: 44, right: 44, bottom: 48, color: C.white}}>
          <div style={{fontSize: 24, fontWeight: 800, opacity: .8}}>CC0 · LOKAL VOR RENDER MATERIALISIERT</div>
          <div style={{fontSize: 52, lineHeight: 1.05, fontWeight: 950, marginTop: 10}}>Ken-Burns, Crop und Text bleiben Remotion-native.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrollScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 105], [1.05, 1.18], clamp);
  const label = spring({fps: 30, frame: Math.max(0, frame - 8), config: {damping: 17, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: '#0C1220', fontFamily: 'Inter, system-ui, sans-serif', color: C.white, overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile('showcase/speed-typing-dvorak.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,12,21,.20),rgba(8,12,21,.18) 38%,rgba(8,12,21,.90) 100%)'}} />
      <div style={{position: 'absolute', left: 72, top: 120, opacity: label, transform: `translateY(${(1-label)*30}px)`}}><Pill color={C.green}>ECHTE B-ROLL · CC0</Pill></div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 320}}>
        <div style={{fontSize: 82, fontWeight: 950, lineHeight: .98, letterSpacing: -4}}>Video läuft im Hintergrund.</div>
        <div style={{fontSize: 82, fontWeight: 950, lineHeight: .98, letterSpacing: -4, color: '#7EE2AD', marginTop: 10}}>Motion erklärt darüber.</div>
        <div style={{marginTop: 30, height: 10, borderRadius: 999, background: 'rgba(255,255,255,.22)', overflow: 'hidden'}}><div style={{height: '100%', width: `${interpolate(frame,[0,105],[8,100],clamp)}%`, background: '#7EE2AD'}} /></div>
      </div>
    </AbsoluteFill>
  );
};

const MixScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 18, stiffness: 145}});
  const progress = interpolate(frame, [0, 105], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: 'Inter, system-ui, sans-serif', color: C.ink}}>
      <div style={{position: 'absolute', left: 68, right: 68, top: 105}}><Pill>ALLES ZUSAMMEN</Pill><div style={{fontSize: 70, fontWeight: 950, lineHeight: 1, letterSpacing: -3.2, marginTop: 24}}>So soll ein Reel-Beat aussehen.</div></div>
      <div style={{position: 'absolute', left: 68, top: 430, width: 575, height: 880, borderRadius: 46, overflow: 'hidden', boxShadow: '0 30px 80px rgba(19,32,51,.16)', transform: `translateY(${(1-enter)*45}px) scale(${.95 + enter*.05})`}}>
        <OffthreadVideo src={staticFile('showcase/speed-typing-dvorak.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 + progress*.08})`}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 48%,rgba(7,12,20,.78))'}} />
        <div style={{position: 'absolute', left: 28, bottom: 32, color: C.white, fontSize: 32, fontWeight: 900}}>B-Roll</div>
      </div>
      <div style={{position: 'absolute', right: 68, top: 510, width: 350, height: 480, borderRadius: 42, overflow: 'hidden', boxShadow: '0 26px 70px rgba(19,32,51,.15)', transform: `translateX(${(1-enter)*45}px)`}}>
        <Img src={staticFile('showcase/user-remotion-studio.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.03 + progress*.10})`}} />
        <div style={{position: 'absolute', left: 20, bottom: 20, padding: '9px 13px', borderRadius: 14, background: 'rgba(255,255,255,.9)', fontSize: 22, fontWeight: 900}}>Bild</div>
      </div>
      <div style={{position: 'absolute', right: 68, top: 1035, width: 350, height: 275, borderRadius: 42, background: C.white, boxShadow: '0 26px 70px rgba(19,32,51,.12)', display: 'grid', placeItems: 'center', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${35+progress*35}% 42%, rgba(118,87,214,.28), transparent 38%)`}} />
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16}}>{['A','→','B'].map((x,i)=><div key={`${x}-${i}`} style={{width: i===1?56:88,height:88,borderRadius:i===1?0:28,display:'grid',placeItems:'center',background:i===1?'transparent':i===0?C.purple:C.blue,color:i===1?C.ink:C.white,fontSize:38,fontWeight:950,transform:`scale(${i===1?1:.85+enter*.15})`}}>{x}</div>)}</div>
        <div style={{position: 'absolute', left: 20, bottom: 18, fontSize: 22, fontWeight: 900, color: C.purple}}>Remotion-Motion</div>
      </div>
      <div style={{position: 'absolute', left: 68, right: 68, bottom: 250, padding: '30px 34px', borderRadius: 34, background: C.ink, color: C.white, fontSize: 38, fontWeight: 900, lineHeight: 1.18}}>70–80 % Motion/UI + gezielte echte Bilder und B-Rolls.</div>
    </AbsoluteFill>
  );
};

export const MediaMixProof: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Sequence from={0} durationInFrames={90}><Hook /></Sequence>
    <Sequence from={90} durationInFrames={90}><ImageScene /></Sequence>
    <Sequence from={180} durationInFrames={90}><BrollScene /></Sequence>
    <Sequence from={270} durationInFrames={90}><MixScene /></Sequence>
  </AbsoluteFill>
);
