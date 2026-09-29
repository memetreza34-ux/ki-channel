import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {CinematicCameraRig} from './CinematicCameraRig';
import {ChoreographedObject} from './ChoreographedObject';
import {AliveHold, DirectionalBlur, ImpactShake, SampledMotionBlur} from './MotionEffects';
import {SceneMotionOrchestrator} from './SceneMotionOrchestrator';

const ink = '#111116';
const paper = '#F5F1EA';
const purple = '#6E45C9';
const violet = '#B98CFF';
const green = '#2B8A68';

const DataTile: React.FC<{label: string; tone?: 'purple' | 'green'}> = ({label, tone = 'purple'}) => (
  <div
    style={{
      width: 230,
      height: 138,
      borderRadius: 24,
      background: 'linear-gradient(145deg,rgba(255,255,255,.98),rgba(244,239,232,.92))',
      border: `2px solid ${tone === 'green' ? 'rgba(43,138,104,.32)' : 'rgba(110,69,201,.28)'}`,
      boxShadow: '0 24px 70px rgba(25,20,30,.16)',
      display: 'grid',
      placeItems: 'center',
      fontSize: 28,
      fontWeight: 950,
      color: tone === 'green' ? green : purple,
      letterSpacing: -0.8,
    }}
  >
    {label}
  </div>
);

const ModelCore: React.FC<{active?: boolean}> = ({active = false}) => (
  <div
    style={{
      width: 360,
      height: 360,
      borderRadius: 108,
      background: active
        ? 'linear-gradient(145deg,#FCFAF4,#DCCBFF 72%,#B98CFF)'
        : 'linear-gradient(145deg,#FFFFFF,#DCD6CE 74%)',
      border: '2px solid rgba(20,18,24,.08)',
      boxShadow: active
        ? '0 55px 130px rgba(110,69,201,.26), inset 0 2px 0 rgba(255,255,255,.9)'
        : '0 55px 130px rgba(25,20,30,.20), inset 0 2px 0 rgba(255,255,255,.9)',
      position: 'relative',
    }}
  >
    <div style={{position: 'absolute', left: 82, right: 82, top: 172, height: 12, borderRadius: 12, background: active ? purple : '#98918A'}} />
  </div>
);

const ImpactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const activate = interpolate(frame, [60, 86], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: paper, fontFamily: 'Inter, Arial, sans-serif'}}>
      <ImpactShake impactFrame={62} amplitude={24}>
        <CinematicCameraRig move="impact-push" startFrame={0} impactFrame={62} endFrame={118} intensity={1.05}>
          <div style={{position: 'absolute', left: 520, top: 760, transform: 'translate(-50%,-50%)'}}>
            <ModelCore active={activate > 0.35} />
          </div>
          <SampledMotionBlur shutterAngle={130} samples={5}>
            <DirectionalBlur startFrame={18} peakFrame={48} endFrame={65} maxBlur={7}>
              <ChoreographedObject
                path={[[80, 920], [220, 720], [330, 610], [430, 735]]}
                anticipationStart={0}
                launchFrame={18}
                impactFrame={62}
                settleFrame={92}
                endFrame={149}
                faceVelocity
                impactScale={1.14}
              >
                <DataTile label="PROMPT" />
              </ChoreographedObject>
            </DirectionalBlur>
          </SampledMotionBlur>
          <div style={{position: 'absolute', left: 120, right: 120, top: 250, fontSize: 86, fontWeight: 950, lineHeight: .92, letterSpacing: -4, color: ink}}>
            EIN IMPACT.<br />KEIN FADE-IN.
          </div>
        </CinematicCameraRig>
      </ImpactShake>
    </AbsoluteFill>
  );
};

const RoutingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const route = interpolate(frame, [25, 115], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#15131A', fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden'}}>
      <CinematicCameraRig move="orbit-right" startFrame={0} endFrame={145} intensity={1.2}>
        <div style={{position: 'absolute', left: 110, top: 250, color: '#F8F5F0', fontSize: 72, fontWeight: 950, letterSpacing: -3}}>KAMERA FOLGT DEM PROZESS</div>
        <svg viewBox="0 0 1080 1200" style={{position: 'absolute', left: 0, top: 390, width: 1080, height: 1200}}>
          <path d="M100 650 C260 310 460 970 650 570 S890 420 1030 260" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="34" strokeLinecap="round" />
          <path d="M100 650 C260 310 460 970 650 570 S890 420 1030 260" fill="none" stroke={violet} strokeWidth="10" strokeLinecap="round" strokeDasharray="1500" strokeDashoffset={1500 * (1 - route)} />
        </svg>
        <SampledMotionBlur shutterAngle={100} samples={4}>
          <ChoreographedObject
            path={[[100, 1040], [330, 560], [710, 980], [980, 650]]}
            anticipationStart={2}
            launchFrame={25}
            impactFrame={112}
            settleFrame={132}
            endFrame={149}
            baseScale={0.82}
            aliveAmplitude={1.5}
          >
            <DataTile label="DATEN" />
          </ChoreographedObject>
        </SampledMotionBlur>
        <AliveHold startFrame={118} amplitudeX={5} amplitudeY={4} rotateAmplitude={0.5}>
          <div style={{position: 'absolute', left: 710, top: 905}}><DataTile label="OUTPUT" tone="green" /></div>
        </AliveHold>
      </CinematicCameraRig>
    </AbsoluteFill>
  );
};

const PushThroughScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [72, 126], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#0F0E13', fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden'}}>
      <CinematicCameraRig move="push-through" startFrame={0} endFrame={132} intensity={1.2}>
        <div style={{position: 'absolute', left: 540, top: 760, width: 600, height: 600, marginLeft: -300, marginTop: -300, borderRadius: '50%', border: '70px solid #403A46', boxShadow: 'inset 0 0 0 4px rgba(255,255,255,.06),0 60px 150px rgba(0,0,0,.55)'}} />
        <div style={{position: 'absolute', left: 540, top: 760, width: 310, height: 310, marginLeft: -155, marginTop: -155, borderRadius: '50%', border: `34px solid ${purple}`, opacity: .95}} />
        <div style={{position: 'absolute', left: 110, top: 230, width: 840, fontSize: 78, fontWeight: 950, color: '#F8F5F0', letterSpacing: -3.6, lineHeight: .94}}>PUSH-THROUGH<br />STATT SLIDE-WECHSEL</div>
        <div style={{position: 'absolute', left: 650, top: 820, width: 300, opacity: reveal}}>
          <AliveHold startFrame={82} amplitudeX={3} amplitudeY={5} rotateAmplitude={0.3}>
            <DataTile label="NEUE SZENE" tone="green" />
          </AliveHold>
        </div>
      </CinematicCameraRig>
    </AbsoluteFill>
  );
};

export const MOTION_ENGINE_LAB_ID = 'KI-MotionEngine-V1';
export const MOTION_ENGINE_LAB_FPS = 30;
export const MOTION_ENGINE_LAB_DURATION = 450;

export const MotionEngineLab: React.FC = () => (
  <SceneMotionOrchestrator
    durationInFrames={MOTION_ENGINE_LAB_DURATION}
    beats={[
      {id: 'impact', startFrame: 0, endFrame: 149, role: 'impact'},
      {id: 'route', startFrame: 150, endFrame: 299, role: 'reveal'},
      {id: 'push-through', startFrame: 300, endFrame: 449, role: 'settle'},
    ]}
  >
    {() => (
      <AbsoluteFill>
        <Sequence from={0} durationInFrames={150} layout="none"><ImpactScene /></Sequence>
        <Sequence from={150} durationInFrames={150} layout="none"><RoutingScene /></Sequence>
        <Sequence from={300} durationInFrames={150} layout="none"><PushThroughScene /></Sequence>
      </AbsoluteFill>
    )}
  </SceneMotionOrchestrator>
);
