import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {REEL_CAPTION_SAFE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {
  OPENAI_CYBER_PAUSE_SCENES,
  OPENAI_CYBER_PAUSE_SUBTITLES,
  type OpenAICyberPauseCue,
  type OpenAICyberPauseIcon,
  type OpenAICyberPauseScene,
} from './contract';
import {
  CapabilitySafetyVisual,
  IsolationVisual,
  PacingThresholdVisual,
  ThreeSafeguardsVisual,
  TrainingPauseVisual,
} from './Visuals';

const font = 'Inter, Arial, sans-serif';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const visualByScene: Record<string, React.FC> = {
  'cyber-01': PacingThresholdVisual,
  'cyber-02': TrainingPauseVisual,
  'cyber-03': ThreeSafeguardsVisual,
  'cyber-04': IsolationVisual,
  'cyber-05': CapabilitySafetyVisual,
};

const iconPaths: Record<OpenAICyberPauseIcon, React.ReactNode> = {
  brake: <><path d="M5 22h22"/><path d="M8 8h16l-2 9H10z"/><path d="M16 4v4"/></>,
  pause: <><rect x="7" y="5" width="6" height="22" rx="2"/><rect x="19" y="5" width="6" height="22" rx="2"/></>,
  shield: <><path d="M16 4l10 4v7c0 6-4 10-10 13C10 25 6 21 6 15V8z"/><path d="M11 16l3 3 7-8"/></>,
  sandbox: <><rect x="5" y="6" width="22" height="20" rx="4"/><path d="M10 12h12M10 17h7M23 18v5M20.5 20.5H26"/></>,
  balance: <><path d="M16 5v22M8 9h16M8 9L4 18h8zM24 9l-4 9h8zM10 27h12"/></>,
};

const Header: React.FC<{scene: OpenAICyberPauseScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [.25, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 88, zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: enter, transform: `translateY(${(1-enter)*-18}px)`}}>
      <div style={{width: 74, height: 74, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(185,140,255,.16)', border: '1.5px solid rgba(110,69,201,.25)', color: BRAND.accentDk, boxShadow: '0 12px 30px rgba(110,69,201,.12)'}}>
        <svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon]}</svg>
      </div>
      <div style={{maxWidth: 820, textAlign: 'center', fontFamily: font, fontSize: scene.headline.length > 27 ? 48 : 56, lineHeight: 1.02, fontWeight: 950, letterSpacing: -1.7, color: BRAND.accentDk, textShadow: '0 7px 22px rgba(110,69,201,.10)'}}>{scene.headline}</div>
    </div>
  );
};

const activeWordIndex = (frame: number, cue: OpenAICyberPauseCue, count: number): number => {
  if (count <= 1) return 0;
  if (cue.words?.length === count) {
    const exact = cue.words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);
    if (exact >= 0) return exact;
  }
  const progress = interpolate(frame, [cue.startFrame, Math.max(cue.startFrame + 1, cue.endFrame - 1)], [0, 1], clamp);
  return Math.min(count - 1, Math.floor(progress * count));
};

const buildCaptionGroups = (words: string[], maxWords = REEL_CAPTION_SAFE.maxWordsPerGroup): number[][] => {
  const groups: number[][] = [];
  let current: number[] = [];
  words.forEach((word, index) => {
    current.push(index);
    const hardBreak = /[.!?][”“\"')\]]?$/.test(word);
    const softBreak = /[,;:][”“\"')\]]?$/.test(word) && current.length >= 4;
    if (hardBreak || softBreak || current.length >= maxWords) {
      groups.push(current);
      current = [];
    }
  });
  if (current.length) groups.push(current);
  return groups;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = OPENAI_CYBER_PAUSE_SUBTITLES.find((candidate) => frame >= candidate.startFrame && frame < candidate.endFrame);
  if (!cue) return null;
  const words = cue.words?.length ? cue.words.map((word) => word.text) : cue.text.trim().split(/\s+/).filter(Boolean);
  const active = activeWordIndex(frame, cue, words.length);
  const groups = buildCaptionGroups(words);
  const visible = groups.find((group) => group.includes(active)) ?? groups[0] ?? [];
  const fade = Math.min(
    interpolate(frame, [cue.startFrame, cue.startFrame + 4], [0, 1], clamp),
    interpolate(frame, [cue.endFrame - 4, cue.endFrame], [1, 0], clamp),
  );
  return (
    <div style={{...REEL_CAPTION_WRAPPER_STYLE, opacity: fade}}>
      <div style={{width: '100%', maxWidth: REEL_CAPTION_SAFE.maxWidth, textAlign: 'center', fontFamily: font, fontSize: 50, fontWeight: 850, lineHeight: 1.14, letterSpacing: -.8, color: BRAND.ink, textShadow: '0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>
        {visible.map((index, visibleIndex) => (
          <React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${index}`}>
            <span style={{display: 'inline-block', color: index === active ? BRAND.accentDk : BRAND.ink, transform: `scale(${index === active ? 1.04 : 1})`, transformOrigin: '50% 70%'}}>{words[index]}</span>
            {visibleIndex < visible.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const SceneLayer: React.FC<{scene: OpenAICyberPauseScene}> = ({scene}) => {
  const Visual = visualByScene[scene.sceneId];
  if (!Visual) throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);
  return (
    <AbsoluteFill>
      <Header scene={scene} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, height: REEL_CAPTION_SAFE.preferredVisualEndYMax - 220, overflow: 'hidden', zIndex: 20}}>
        <Visual />
      </div>
    </AbsoluteFill>
  );
};

export type ReelOpenAICyberPauseProps = {voiceoverSrc?: string; showCaptions?: boolean};

export const ReelOpenAICyberPause: React.FC<ReelOpenAICyberPauseProps> = ({voiceoverSrc, showCaptions = true}) => {
  const scenes = useMemo(() => OPENAI_CYBER_PAUSE_SCENES, []);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 32%, #FFFFFF 0%, #FBF9FD 56%, #F1EDF7 100%)', color: BRAND.ink, overflow: 'hidden', fontFamily: font}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(rgba(110,69,201,.024) 1px, transparent 1px),linear-gradient(90deg,rgba(110,69,201,.024) 1px,transparent 1px)', backgroundSize: '72px 72px', maskImage: 'linear-gradient(to bottom,transparent 0%,black 12%,black 70%,transparent 86%)'}} />
      {scenes.map((scene) => (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={`${scene.sceneId}-NEW_BUILD`}>
          <SceneLayer scene={scene} />
        </Sequence>
      ))}
      {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
      {showCaptions ? <Captions /> : null}
    </AbsoluteFill>
  );
};
