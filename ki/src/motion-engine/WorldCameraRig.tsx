import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

export type CameraEasingPreset = 'cinematic' | 'snappy' | 'linear';

export type WorldCameraKeyframe = {
  frame: number;
  focusX: number;
  focusY: number;
  zoom: number;
  rotation?: number;
  z?: number;
};

export type WorldCameraRigProps = React.PropsWithChildren<{
  keyframes: readonly WorldCameraKeyframe[];
  viewportWidth?: number;
  viewportHeight?: number;
  worldWidth: number;
  worldHeight: number;
  easing?: CameraEasingPreset;
  background?: string;
  style?: React.CSSProperties;
}>;

const easingMap: Record<CameraEasingPreset, (value: number) => number> = {
  cinematic: Easing.bezier(0.22, 0.61, 0.36, 1),
  snappy: Easing.bezier(0.16, 1, 0.3, 1),
  linear: Easing.linear,
};

const assertTimeline = (keyframes: readonly WorldCameraKeyframe[]) => {
  if (keyframes.length < 1) throw new Error('WorldCameraRig requires at least one keyframe');
  for (let index = 1; index < keyframes.length; index += 1) {
    if (keyframes[index].frame <= keyframes[index - 1].frame) {
      throw new Error('WorldCameraRig keyframes must use strictly increasing frame values');
    }
  }
};

const poseAtFrame = (
  frame: number,
  keyframes: readonly WorldCameraKeyframe[],
  easing: CameraEasingPreset,
): Required<Omit<WorldCameraKeyframe, 'frame'>> => {
  assertTimeline(keyframes);
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (frame <= first.frame) {
    return {
      focusX: first.focusX,
      focusY: first.focusY,
      zoom: first.zoom,
      rotation: first.rotation ?? 0,
      z: first.z ?? 0,
    };
  }
  if (frame >= last.frame) {
    return {
      focusX: last.focusX,
      focusY: last.focusY,
      zoom: last.zoom,
      rotation: last.rotation ?? 0,
      z: last.z ?? 0,
    };
  }

  let index = 0;
  while (index < keyframes.length - 1 && keyframes[index + 1].frame <= frame) index += 1;
  const from = keyframes[index];
  const to = keyframes[index + 1];
  const options = {easing: easingMap[easing]};
  return {
    focusX: interpolate(frame, [from.frame, to.frame], [from.focusX, to.focusX], options),
    focusY: interpolate(frame, [from.frame, to.frame], [from.focusY, to.focusY], options),
    zoom: interpolate(frame, [from.frame, to.frame], [from.zoom, to.zoom], options),
    rotation: interpolate(frame, [from.frame, to.frame], [from.rotation ?? 0, to.rotation ?? 0], options),
    z: interpolate(frame, [from.frame, to.frame], [from.z ?? 0, to.z ?? 0], options),
  };
};

export const WorldCameraRig: React.FC<WorldCameraRigProps> = ({
  keyframes,
  viewportWidth = 1080,
  viewportHeight = 1920,
  worldWidth,
  worldHeight,
  easing = 'cinematic',
  background = '#0D0D12',
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const pose = poseAtFrame(frame, keyframes, easing);

  return (
    <div
      data-motion-engine="world-camera-rig"
      style={{position: 'absolute', inset: 0, overflow: 'hidden', background, perspective: 1600, ...style}}
    >
      <div
        style={{
          position: 'absolute',
          left: viewportWidth / 2,
          top: viewportHeight / 2,
          transform: `translateZ(${pose.z}px) rotate(${pose.rotation}deg) scale(${pose.zoom})`,
          transformOrigin: '0 0',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div
          data-motion-engine="continuous-world"
          style={{
            position: 'absolute',
            width: worldWidth,
            height: worldHeight,
            transform: `translate3d(${-pose.focusX}px, ${-pose.focusY}px, 0)`,
            transformOrigin: '0 0',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const resolveWorldCameraPose = poseAtFrame;
