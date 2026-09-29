import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {KeyframedMotion} from './KeyframedMotion';
import {MaskedKineticText} from './MaskedKineticText';
import {SampledMotionBlur} from './MotionEffects';
import {SceneMotionOrchestrator} from './SceneMotionOrchestrator';
import {WorldCameraRig, type WorldCameraKeyframe} from './WorldCameraRig';

const bg = '#0E0E13';
const paper = '#F4F0E8';
const ink = '#121217';
const purple = '#7A55D8';
const violet = '#B99BFF';
const green = '#38A278';
const amber = '#E2A74C';

const CAMERA: readonly WorldCameraKeyframe[] = [
  {frame: 0, focusX: 540, focusY: 850, zoom: 1.04},
  {frame: 66, focusX: 540, focusY: 850, zoom: 1.04},
  {frame: 94, focusX: 1640, focusY: 1110, zoom: 0.72, rotation: -0.7},
  {frame: 206, focusX: 1640, focusY: 1110, zoom: 0.78, rotation: 0},
  {frame: 236, focusX: 2440, focusY: 2460, zoom: 0.62, rotation: 0.8},
  {frame: 326, focusX: 2440, focusY: 2460, zoom: 0.9, rotation: 0},
  {frame: 430, focusX: 2440, focusY: 2460, zoom: 0.9, rotation: 0},
  {frame: 449, focusX: 2440, focusY: 2460, zoom: 0.9, rotation: 0},
];

const StationHalo: React.FC<{x: number; y: number; size: number; tone: string}> = ({x, y, size, tone}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${tone}`,
      boxShadow: `0 0 120px ${tone}`,
      opacity: 0.24,
    }}
  />
);

const HeroSignal: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = interpolate(frame, [0, 58, 150, 265, 340], [0, 0.2, 0.52, 0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const width = interpolate(phase, [0, 0.35, 0.7, 1], [168, 132, 92, 220]);
  const height = interpolate(phase, [0, 0.35, 0.7, 1], [112, 132, 92, 128]);
  const radius = interpolate(phase, [0, 0.35, 0.7, 1], [30, 66, 46, 30]);
  const tone = phase < 0.72 ? purple : green;

  return (
    <SampledMotionBlur shutterAngle={120} samples={5}>
      <KeyframedMotion
        easing="cinematic"
        states={[
          {frame: 0, x: 150, y: 1040, z: 20, scale: 0.86, rotate: -8, opacity: 0},
          {frame: 14, x: 190, y: 1010, z: 40, scale: 1, rotate: -4, opacity: 1},
          {frame: 54, x: 505, y: 830, z: 180, scale: 1.1, rotate: 0},
          {frame: 70, x: 540, y: 850, z: 80, scale: 0.78},
          {frame: 100, x: 1080, y: 940, z: 50, scale: 0.88},
          {frame: 154, x: 1650, y: 1110, z: 190, scale: 1.06},
          {frame: 204, x: 1850, y: 1290, z: 60, scale: 0.92},
          {frame: 238, x: 2140, y: 1900, z: 20, scale: 0.82},
          {frame: 286, x: 2420, y: 2420, z: 190, scale: 1.08},
          {frame: 330, x: 2550, y: 2500, z: 80, scale: 1},
          {frame: 430, x: 2550, y: 2500, z: 80, scale: 1},
        ]}
      >
        <div
          style={{
            width,
            height,
            marginLeft: -width / 2,
            marginTop: -height / 2,
            borderRadius: radius,
            background: phase < 0.72
              ? 'linear-gradient(145deg,#F7F2FF,#C8AEFF)'
              : 'linear-gradient(145deg,#E8FFF6,#8FD9BC)',
            border: `3px solid ${tone}`,
            boxShadow: `0 34px 90px ${tone}55, inset 0 2px 0 rgba(255,255,255,.9)`,
            display: 'grid',
            placeItems: 'center',
            color: ink,
            fontSize: phase < 0.72 ? 28 : 24,
            fontWeight: 950,
            letterSpacing: -1,
          }}
        >
          {phase < 0.3 ? 'INPUT' : phase < 0.75 ? '•' : 'OUTPUT'}
        </div>
      </KeyframedMotion>
    </SampledMotionBlur>
  );
};

const InputStation: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [42, 58, 72], [1, 1.12, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <StationHalo x={540} y={850} size={620} tone="rgba(122,85,216,.45)" />
      <div
        style={{
          position: 'absolute',
          left: 360,
          top: 670,
          width: 360,
          height: 360,
          borderRadius: 112,
          background: 'linear-gradient(145deg,#FFFFFF,#D7CFCA)',
          boxShadow: '0 55px 150px rgba(0,0,0,.26)',
          transform: `scale(${pulse})`,
          transformOrigin: '50% 50%',
        }}
      >
        <div style={{position: 'absolute', left: 80, right: 80, top: 174, height: 12, borderRadius: 20, background: frame >= 56 ? purple : '#8F8883'}} />
      </div>
      <MaskedKineticText
        lines={['01']}
        startFrame={0}
        x={260}
        y={350}
        width={200}
        fontSize={88}
        color={paper}
      />
    </>
  );
};

const mosaicTargets = [
  [-330, -230, 190, 190],
  [-120, -230, 400, 190],
  [300, -230, 190, 190],
  [-330, -20, 250, 390],
  [-60, -20, 250, 180],
  [210, -20, 280, 180],
  [-60, 180, 180, 190],
  [140, 180, 350, 190],
] as const;

const ProcessStation: React.FC = () => (
  <>
    <StationHalo x={1640} y={1110} size={900} tone="rgba(185,155,255,.32)" />
    <MaskedKineticText
      lines={['02']}
      startFrame={96}
      x={1210}
      y={470}
      width={200}
      fontSize={92}
      color={paper}
    />
    {mosaicTargets.map(([targetX, targetY, targetW, targetH], index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const gridX = -330 + col * 210;
      const gridY = -160 + row * 220;
      const cascadeX = -420 + index * 118;
      const cascadeY = 250 + index * 34;
      return (
        <KeyframedMotion
          key={index}
          staggerIndex={index}
          staggerFrames={3}
          easing="cinematic"
          states={[
            {frame: 108, x: 1640 + gridX, y: 1110 + gridY, z: -120, scale: 0.66, rotateY: -28, opacity: 0},
            {frame: 132, x: 1640 + gridX, y: 1110 + gridY, z: 0, scale: 1, rotateY: 0, opacity: 1},
            {frame: 166, x: 1640 + targetX, y: 1110 + targetY, z: index === 1 ? 130 : 30, scaleX: targetW / 190, scaleY: targetH / 190, rotateY: 0},
            {frame: 188, x: 1640 + targetX, y: 1110 + targetY, z: index === 1 ? 130 : 30, scaleX: targetW / 190, scaleY: targetH / 190},
            {frame: 214, x: 1640 + cascadeX, y: 1110 + cascadeY, z: (index - 4) * 52, scaleX: 0.84, scaleY: 0.84, rotate: -14 + index * 4, rotateX: -8},
          ]}
          style={{width: 190, height: 190, marginLeft: -95, marginTop: -95}}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 28,
              background: index === 1 ? 'linear-gradient(145deg,#D8C4FF,#8C65E6)' : 'linear-gradient(145deg,#252330,#17161E)',
              border: '2px solid rgba(255,255,255,.12)',
              boxShadow: '0 28px 70px rgba(0,0,0,.34)',
            }}
          />
        </KeyframedMotion>
      );
    })}
  </>
);

const PayoffStation: React.FC = () => {
  const pieces = Array.from({length: 9}, (_, index) => index);
  return (
    <>
      <StationHalo x={2440} y={2460} size={980} tone="rgba(56,162,120,.32)" />
      <MaskedKineticText
        lines={['03']}
        startFrame={238}
        x={2020}
        y={1780}
        width={200}
        fontSize={92}
        color={paper}
      />
      {pieces.map((index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const finalX = 2240 + col * 200;
        const finalY = 2260 + row * 200;
        const scatterX = 2440 + (col - 1) * 520 + (row - 1) * 120;
        const scatterY = 2460 + (row - 1) * 470 - (col - 1) * 90;
        return (
          <KeyframedMotion
            key={index}
            staggerIndex={index}
            staggerFrames={4}
            easing="snappy"
            states={[
              {frame: 242, x: scatterX, y: scatterY, z: -240 + index * 70, rotateX: -80 + index * 12, rotateY: 120 - index * 18, rotateZ: -36 + index * 9, scale: 0.72, opacity: 0},
              {frame: 274, x: scatterX, y: scatterY, z: -80 + index * 28, rotateX: -36 + index * 6, rotateY: 48 - index * 8, rotateZ: -18 + index * 4, scale: 0.9, opacity: 1},
              {frame: 318, x: finalX, y: finalY, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.04},
              {frame: 342, x: finalX, y: finalY, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1},
              {frame: 430, x: finalX, y: finalY, z: 0, scale: 1},
            ]}
            style={{width: 176, height: 176, marginLeft: -88, marginTop: -88}}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 24,
                background: index === 4 ? `linear-gradient(145deg,${green},#9EE1C8)` : 'linear-gradient(145deg,#F6F1E9,#CFC8C0)',
                border: index === 4 ? `3px solid ${green}` : '2px solid rgba(0,0,0,.12)',
                boxShadow: '0 30px 78px rgba(0,0,0,.3)',
              }}
            />
          </KeyframedMotion>
        );
      })}
      <KeyframedMotion
        states={[
          {frame: 300, x: 2440, y: 2780, opacity: 0, scale: 0.86},
          {frame: 346, x: 2440, y: 2780, opacity: 1, scale: 1.04},
          {frame: 370, x: 2440, y: 2780, opacity: 1, scale: 1},
          {frame: 430, x: 2440, y: 2780, opacity: 1, scale: 1},
        ]}
      >
        <div
          style={{
            width: 420,
            height: 88,
            marginLeft: -210,
            marginTop: -44,
            borderRadius: 44,
            background: amber,
            boxShadow: '0 26px 70px rgba(226,167,76,.28)',
          }}
        />
      </KeyframedMotion>
    </>
  );
};

export const MOTION_ENGINE_LAB_ID = 'KI-MotionEngine-V1';
export const MOTION_ENGINE_LAB_FPS = 30;
export const MOTION_ENGINE_LAB_DURATION = 450;

export const MotionEngineLab: React.FC = () => (
  <SceneMotionOrchestrator
    durationInFrames={MOTION_ENGINE_LAB_DURATION}
    beats={[
      {id: 'impact', startFrame: 0, endFrame: 94, role: 'impact'},
      {id: 'transform', startFrame: 95, endFrame: 235, role: 'reveal'},
      {id: 'reassemble', startFrame: 236, endFrame: 449, role: 'settle'},
    ]}
  >
    {() => (
      <AbsoluteFill style={{background: bg, fontFamily: 'Inter, Arial, sans-serif'}}>
        <WorldCameraRig
          keyframes={CAMERA}
          worldWidth={3200}
          worldHeight={3400}
          background={bg}
        >
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,.055) 1px,transparent 0)', backgroundSize: '54px 54px'}} />
          <InputStation />
          <ProcessStation />
          <PayoffStation />
          <HeroSignal />
        </WorldCameraRig>
      </AbsoluteFill>
    )}
  </SceneMotionOrchestrator>
);
