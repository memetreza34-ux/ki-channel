import React from 'react';
import {Lottie} from '@remotion/lottie';
import {RemotionRiveCanvas} from '@remotion/rive';
import {SkiaCanvas} from '@remotion/skia';
import {Circle, Fill} from '@shopify/react-native-skia';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const StoryThreeHero: React.FC<{
  accent: string;
  startFrame?: number;
  endFrame?: number;
  style?: React.CSSProperties;
}> = ({accent, startFrame = 0, endFrame = 180, style}) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [startFrame, endFrame], [-0.5, 0.8], clamp);
  const lift = interpolate(frame, [startFrame, endFrame], [-0.15, 0.16], clamp);
  return (
    <div style={{position: 'relative', width: '100%', height: '100%', ...style}}>
      <ThreeCanvas width={680} height={680} camera={{position: [0, 0, 6], fov: 42}}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 4, 5]} intensity={2.1} />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color={accent} />
        <group rotation={[rotation * 0.3, rotation, rotation * 0.18]} position={[0, lift, 0]}>
          <mesh>
            <icosahedronGeometry args={[1.55, 2]} />
            <meshStandardMaterial color={accent} metalness={0.68} roughness={0.18} />
          </mesh>
          <mesh scale={1.28}>
            <icosahedronGeometry args={[1.55, 1]} />
            <meshStandardMaterial color="#FFFFFF" wireframe transparent opacity={0.26} />
          </mesh>
        </group>
      </ThreeCanvas>
    </div>
  );
};

type LottieData = React.ComponentProps<typeof Lottie>['animationData'];

export const StoryLottieLayer: React.FC<{
  animationData: LottieData;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({animationData, opacity = 1, style}) => (
  <AbsoluteFill style={{opacity, pointerEvents: 'none', ...style}}>
    <Lottie animationData={animationData} />
  </AbsoluteFill>
);

export const StoryRiveLayer: React.FC<{
  src: string;
  style?: React.CSSProperties;
}> = ({src, style}) => {
  if (/^https?:\/\//i.test(src)) {
    throw new Error('StoryRiveLayer forbids render-time remote URLs. Resolve the .riv file locally and pass staticFile(...).');
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none', ...style}}>
      <RemotionRiveCanvas src={src} />
    </AbsoluteFill>
  );
};

export const StorySkiaBackdrop: React.FC<{
  accent: string;
  background?: string;
  startFrame?: number;
}> = ({accent, background = '#F7FAFC', startFrame = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const radius = interpolate(frame, [startFrame, startFrame + 120], [180, 460], clamp);
  const x = interpolate(frame, [startFrame, startFrame + 160], [width * 0.72, width * 0.48], clamp);
  const y = interpolate(frame, [startFrame, startFrame + 160], [height * 0.24, height * 0.36], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.18}}>
      <SkiaCanvas width={width} height={height}>
        <Fill color={background} />
        <Circle cx={x} cy={y} r={radius} color={`${accent}30`} />
      </SkiaCanvas>
    </AbsoluteFill>
  );
};
