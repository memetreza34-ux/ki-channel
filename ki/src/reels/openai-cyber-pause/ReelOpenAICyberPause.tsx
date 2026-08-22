import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:16, stiffness:135}});
  const iconPulse = 1 + Math.sin(frame / 10) * .025;
  const underline = interpolate(frame, [8, 34], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 74, zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: enter, transform: `translateY(${(1-enter)*-24}px) scale(${.96 + enter*.04})`}}>
      <div style={{width: 76, height: 76, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.76)', border: '2px solid rgba(110,69,201,.25)', color: BRAND.accentDk, boxShadow: '0 16px 42px rgba(110,69,201,.16)', transform:`scale(${iconPulse}) rotate(${Math.sin(frame/25)*2}deg)`}}>
        <svg width="45" height="45" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{iconPaths[scene.icon]}</svg>
      </div>
      <div style={{position:'relative',maxWidth: 820, textAlign: 'center', fontFamily: font, fontSize: scene.headline.length > 27 ? 47 : 54, lineHeight: 1.02, fontWeight: 950, letterSpacing: -1.7, color: BRAND.accentDk, textShadow: '0 7px 22px rgba(110,69,201,.10)'}}>
        {scene.headline}
        <div style={{position:'absolute',left:'12%',right:'12%',bottom:-14,height:5,borderRadius:999,background:`linear-gradient(90deg,transparent,${BRAND.accentDk},transparent)`,transform:`scaleX(${underline})`,boxShadow:'0 0 18px rgba(110,69,201,.28)'}} />
      </div>
    </div>
  );
};

const activeWordIndex = (frame: number, cue: OpenAICyberPauseCue): number => {
  if (!cue.words?.length) return -1;
  return cue.words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);
};

const buildCaptionGroups = (words: string[], maxWords = REEL_CAPTION_SAFE.maxWordsPerGroup): number[][] => {
  const groups: number[][] = [];
  let current: number[] = [];
  words.forEach((word, index) => {
    current.push(index);
    const hardBreak = /[.!?][”“\"')\]]?$/.test(word);
    const phraseBreak = /[,;:][”“\"')\]]?$/.test(word) && current.length >= 2;
    if (hardBreak || phraseBreak || current.length >= maxWords) {
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
  const words = cue.words.map((word) => word.text);
  const active = activeWordIndex(frame, cue);

  // Real pauses in the supplied voiceover remain visually silent instead of
  // using the old proportional fallback that made captions drift ahead/behind.
  if (active < 0) return null;

  const groups = buildCaptionGroups(words);
  const visible = groups.find((group) => group.includes(active)) ?? groups[0] ?? [];
  const activeWord = cue.words[active];
  const fade = Math.min(
    interpolate(frame, [activeWord.startFrame, activeWord.startFrame + 3], [.15, 1], clamp),
    interpolate(frame, [activeWord.endFrame - 2, activeWord.endFrame], [1, .65], clamp),
  );

  return (
    <div style={{...REEL_CAPTION_WRAPPER_STYLE, opacity: fade}}>
      <div style={{width: '100%', maxWidth: REEL_CAPTION_SAFE.maxWidth, textAlign: 'center', fontFamily: font, fontSize: 50, fontWeight: 850, lineHeight: 1.14, letterSpacing: -.8, color: BRAND.ink, textShadow: '0 2px 0 rgba(255,255,255,.98),0 0 15px rgba(255,255,255,.98),0 8px 30px rgba(26,26,46,.10)'}}>
        {visible.map((index, visibleIndex) => (
          <React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${index}`}>
            <span style={{display: 'inline-block', color: index === active ? BRAND.accentDk : BRAND.ink, transform: `translateY(${index === active ? -2 : 0}px) scale(${index === active ? 1.055 : 1})`, transformOrigin: '50% 70%', transition:'none'}}>{words[index]}</span>
            {visibleIndex < visible.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const SceneLayer: React.FC<{scene: OpenAICyberPauseScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const Visual = visualByScene[scene.sceneId];
  if (!Visual) throw new Error(`missing NEW_BUILD visual for ${scene.sceneId}`);
  const entryWipe = interpolate(frame, [0, 14, 30], [1, .35, 0], clamp);
  return (
    <AbsoluteFill>
      <Header scene={scene} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 215, height: REEL_CAPTION_SAFE.preferredVisualEndYMax - 215, overflow: 'hidden', zIndex: 20}}>
        <Visual />
      </div>
      <div style={{position:'absolute',inset:0,zIndex:45,pointerEvents:'none',background:`linear-gradient(100deg,${BRAND.accentDk}18,rgba(255,255,255,.95),${BRAND.accent}22)`,transform:`translateX(${(1-entryWipe)*115}%)`,opacity:entryWipe}} />
    </AbsoluteFill>
  );
};

export type ReelOpenAICyberPauseProps = {voiceoverSrc?: string; showCaptions?: boolean};

export const ReelOpenAICyberPause: React.FC<ReelOpenAICyberPauseProps> = ({voiceoverSrc, showCaptions = true}) => {
  const scenes = useMemo(() => OPENAI_CYBER_PAUSE_SCENES, []);
  const frame = useCurrentFrame();
  const ambientShift = Math.sin(frame / 70) * 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #FAF7FD 50%, #EEE8F6 100%)', color: BRAND.ink, overflow: 'hidden', fontFamily: font, transform:`scale(${1 + ambientShift/1000})`}}>
      {scenes.map((scene) => (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={`${scene.sceneId}-HIGH_ENERGY_NEW_BUILD`}>
          <SceneLayer scene={scene} />
        </Sequence>
      ))}
      {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
      {showCaptions ? <Captions /> : null}
    </AbsoluteFill>
  );
};
