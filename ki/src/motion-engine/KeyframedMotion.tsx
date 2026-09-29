import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

export type MotionEasingPreset = 'cinematic' | 'snappy' | 'smooth' | 'linear';

export type MotionState = {
  frame: number;
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  opacity?: number;
  blur?: number;
  borderRadius?: number;
};

export type KeyframedMotionProps = React.PropsWithChildren<{
  states: readonly MotionState[];
  easing?: MotionEasingPreset;
  staggerIndex?: number;
  staggerFrames?: number;
  style?: React.CSSProperties;
}>;

const easingMap: Record<MotionEasingPreset, (value: number) => number> = {
  cinematic: Easing.bezier(0.22, 0.61, 0.36, 1),
  snappy: Easing.bezier(0.16, 1, 0.3, 1),
  smooth: Easing.inOut(Easing.cubic),
  linear: Easing.linear,
};

const numericKeys = [
  'x',
  'y',
  'z',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'opacity',
  'blur',
  'borderRadius',
] as const;

type NumericKey = (typeof numericKeys)[number];

type ResolvedMotionState = Required<Omit<MotionState, 'frame'>>;

const defaults: ResolvedMotionState = {
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  opacity: 1,
  blur: 0,
  borderRadius: 0,
};

const assertStates = (states: readonly MotionState[]) => {
  if (states.length < 1) throw new Error('KeyframedMotion requires at least one state');
  for (let index = 1; index < states.length; index += 1) {
    if (states[index].frame <= states[index - 1].frame) {
      throw new Error('KeyframedMotion states must use strictly increasing frame values');
    }
  }
};

const resolveValue = (
  key: NumericKey,
  state: MotionState,
  previous: ResolvedMotionState,
): number => state[key] ?? previous[key];

const materializeStates = (states: readonly MotionState[]): Array<MotionState & ResolvedMotionState> => {
  assertStates(states);
  let previous = {...defaults};
  return states.map((state) => {
    const resolved = {...previous};
    for (const key of numericKeys) resolved[key] = resolveValue(key, state, previous);
    previous = resolved;
    return {...state, ...resolved};
  });
};

export const resolveMotionState = (
  frame: number,
  states: readonly MotionState[],
  easing: MotionEasingPreset = 'cinematic',
): ResolvedMotionState => {
  const resolved = materializeStates(states);
  const first = resolved[0];
  const last = resolved[resolved.length - 1];
  if (frame <= first.frame) return numericKeys.reduce((acc, key) => ({...acc, [key]: first[key]}), {} as ResolvedMotionState);
  if (frame >= last.frame) return numericKeys.reduce((acc, key) => ({...acc, [key]: last[key]}), {} as ResolvedMotionState);

  let index = 0;
  while (index < resolved.length - 1 && resolved[index + 1].frame <= frame) index += 1;
  const from = resolved[index];
  const to = resolved[index + 1];
  const options = {easing: easingMap[easing]};

  return numericKeys.reduce((acc, key) => {
    acc[key] = interpolate(frame, [from.frame, to.frame], [from[key], to[key]], options);
    return acc;
  }, {...defaults} as ResolvedMotionState);
};

export const KeyframedMotion: React.FC<KeyframedMotionProps> = ({
  states,
  easing = 'cinematic',
  staggerIndex = 0,
  staggerFrames = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame() - staggerIndex * staggerFrames;
  const motion = resolveMotionState(frame, states, easing);
  return (
    <div
      data-motion-engine="keyframed-motion"
      data-stagger-index={staggerIndex}
      style={{
        position: 'absolute',
        opacity: motion.opacity,
        filter: motion.blur > 0 ? `blur(${motion.blur}px)` : undefined,
        borderRadius: motion.borderRadius,
        transform: `translate3d(${motion.x}px, ${motion.y}px, ${motion.z}px) rotate(${motion.rotate}deg) rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) rotateZ(${motion.rotateZ}deg) scale(${motion.scale}) scaleX(${motion.scaleX}) scaleY(${motion.scaleY})`,
        transformStyle: 'preserve-3d',
        willChange: 'transform,opacity,filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const holdState = (frame: number, state: Omit<MotionState, 'frame'>): MotionState => ({frame, ...state});
