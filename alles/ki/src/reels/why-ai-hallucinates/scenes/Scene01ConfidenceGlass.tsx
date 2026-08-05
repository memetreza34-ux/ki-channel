import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {AssetImage, Pill, SceneFrame, clampProgress} from '../components/ReelChrome';
import {palette} from '../style';

export const Scene01ConfidenceGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = clampProgress(frame, 11, 38);
  const tilt = interpolate(frame, [67, 88], [0, -5], {extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const crack = clampProgress(frame, 89, 110);
  const label = clampProgress(frame, 103, 118);
  const fragment = clampProgress(frame, 116, 125);
  const circumference = 2 * Math.PI * 270;
  return (
    <SceneFrame sceneId="scene-01" kicker="HALLUZINATION">
      <div style={{position:'absolute',inset:0,borderRadius:46,overflow:'hidden'}}>
        <AssetImage assetId="scene01" objectFit="cover" />
        <svg viewBox="0 0 964 1250" style={{position:'absolute',inset:0,width:'100%',height:'100%',transform:`rotate(${tilt}deg)`}}>
          <circle cx="482" cy="580" r="270" fill="none" stroke={palette.accent} strokeWidth="16" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-ring)} opacity={.9} />
          <path d="M 360 510 L 438 565 L 405 640 L 520 706 L 488 792 L 600 858" fill="none" stroke={palette.danger} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="570" strokeDashoffset={570*(1-crack)} />
        </svg>
        <Pill tone="danger" style={{position:'absolute',left:'50%',top:'72%',transform:`translateX(-50%) translateY(${(1-label)*24}px)`,opacity:label}}>NICHT BELEGT</Pill>
        <div style={{position:'absolute',right:interpolate(fragment,[0,1],[410,-80]),top:interpolate(fragment,[0,1],[780,690]),width:62,height:74,background:palette.accent,clipPath:'polygon(15% 0,100% 25%,70% 100%,0 72%)',opacity:fragment,transform:`rotate(${fragment*46}deg)`}} />
      </div>
    </SceneFrame>
  );
};
