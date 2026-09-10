import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Circle as RemotionCircle} from '@remotion/shapes';
import {blur} from '@remotion/effects/blur';
import {noise2D} from '@remotion/noise';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {SkiaCanvas} from '@remotion/skia';
import {Circle as SkiaCircle, Fill} from '@shopify/react-native-skia';
import {ThreeCanvas} from '@remotion/three';
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {gsap} from 'gsap';

const BG = '#F7F7F5';
const DARK = '#1A1A2E';
const PURPLE = '#6E45C9';
const LIGHT_PURPLE = '#B98CFF';

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily:'Inter, Arial, sans-serif',fontSize:48,fontWeight:700,color:DARK}}>{children}</div>
);

const BaseSceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps,frame,config:{damping:18,stiffness:140}});
  const xNoise = noise2D('longform-capability-smoke', frame / 18, 0) * 18;
  const progress = interpolate(frame,[0,50],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const eased = gsap.parseEase('power2.inOut')(progress);
  return (
    <AbsoluteFill style={{backgroundColor:BG,alignItems:'center',justifyContent:'center'}}>
      <div style={{transform:`translateX(${xNoise}px) scale(${0.82 + enter * 0.18})`,opacity:enter}}>
        <RemotionCircle
          radius={150}
          fill={LIGHT_PURPLE}
          effects={[blur({radius:4 + eased * 8})]}
          pixelDensity={1}
        />
      </div>
      <div style={{position:'absolute',bottom:120}}><Label>Remotion + Effects + Noise + GSAP</Label></div>
    </AbsoluteFill>
  );
};

const BaseSceneB: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:'#FFFFFF',padding:120}}>
    <Label>Transitions + Recharts</Label>
    <div style={{width:'100%',height:650,marginTop:80}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[
          {name:'A',value:20},{name:'B',value:52},{name:'C',value:38},{name:'D',value:82},{name:'E',value:68},
        ]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke={PURPLE} strokeWidth={8} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </AbsoluteFill>
);

export const LongformSmokeBase: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={45}>
      <BaseSceneA />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:10})} />
    <TransitionSeries.Sequence durationInFrames={45}>
      <BaseSceneB />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

export const LongformSmokeSkia: React.FC = () => {
  const frame = useCurrentFrame();
  const radius = interpolate(frame,[0,59],[70,260],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const cx = interpolate(frame,[0,59],[500,1420],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor:BG}}>
      <SkiaCanvas width={1920} height={1080}>
        <Fill color={BG} />
        <SkiaCircle cx={cx} cy={540} r={radius} color={PURPLE} />
      </SkiaCanvas>
      <div style={{position:'absolute',left:120,bottom:100}}><Label>Skia real render</Label></div>
    </AbsoluteFill>
  );
};

const ThreeObject: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = frame / 18;
  const bob = Math.sin(frame / 10) * 0.25;
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4,6,5]} intensity={2.2} />
      <mesh rotation={[rotation * 0.35,rotation,rotation * 0.2]} position={[0,bob,0]}>
        <boxGeometry args={[2.2,2.2,2.2]} />
        <meshStandardMaterial color={PURPLE} roughness={0.35} metalness={0.15} />
      </mesh>
    </>
  );
};

export const LongformSmokeThree: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:BG}}>
    <ThreeCanvas width={1920} height={1080} camera={{position:[0,0,6],fov:42}}>
      <ThreeObject />
    </ThreeCanvas>
    <div style={{position:'absolute',left:120,bottom:100}}><Label>Three.js / R3F real render</Label></div>
  </AbsoluteFill>
);

export const LongformSmokeSfx: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:BG,alignItems:'center',justifyContent:'center'}}>
    <Label>Local SFX render</Label>
    <Sequence from={8}>
      <Audio src={staticFile('longform-capability-smoke/whoosh.mp3')} volume={0.22} />
    </Sequence>
  </AbsoluteFill>
);

export const LongformCapabilitySmokeRoot: React.FC = () => (
  <>
    <Composition id="LongformSmokeBase" component={LongformSmokeBase} durationInFrames={80} fps={30} width={1920} height={1080} />
    <Composition id="LongformSmokeSkia" component={LongformSmokeSkia} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="LongformSmokeThree" component={LongformSmokeThree} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="LongformSmokeSfx" component={LongformSmokeSfx} durationInFrames={45} fps={30} width={1920} height={1080} />
  </>
);
