import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {enhanceSceneMeaning} from '../../animation-library/extendedMeaningContract';
import {associatePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentAssociation';
import {derivePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentDeriver';
import {createPrototypeRenderProps} from '../../animation-library/prototypeRenderPayload';
import {sanitizePrototypeRuntimeContent} from '../../animation-library/prototypeRuntimeContentSanitizer';
import {
  ANIMATION_PROTOTYPE_REGISTRY,
  type AnimationPrototypeRegistration,
} from '../../animation-library/prototypes/registry';
import type {PrototypeRenderProps} from '../../animation-library/prototypes/PrototypeContentContext';
import reelJson from '../../../reels/2026-08-10_bis_2026-08-16/01_Warum-KI-Dinge-erfindet/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-08-10_bis_2026-08-16/01_Warum-KI-Dinge-erfindet/03-caption/subtitle-cues.json';
import type {ComponentType} from 'react';

export type HallucinationScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  animationId: string;
  spokenText: string;
  headline: string;
  visualLabels: Record<string, string>;
  goal: string;
};

type WordCue = {text: string; startFrame: number; endFrame: number};
export type HallucinationSubtitleCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: WordCue[];
};

const reel = reelJson as {
  slug: string;
  format: {width: number; height: number; fps: number; durationInFrames: number};
  scenes: HallucinationScene[];
};
const subtitles = subtitleJson as {fps: number; cues: HallucinationSubtitleCue[]};

export const HALLUCINATION_COMPOSITION_ID = 'KI-Hallucinations';
export const HALLUCINATION_WIDTH = reel.format.width;
export const HALLUCINATION_HEIGHT = reel.format.height;
export const HALLUCINATION_FPS = reel.format.fps;
export const HALLUCINATION_DURATION_IN_FRAMES = reel.format.durationInFrames;
export const HALLUCINATION_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene, visualLabels: Object.freeze({...scene.visualLabels})})));
export const HALLUCINATION_SUBTITLES = Object.freeze(subtitles.cues.map((cue) => Object.freeze({...cue})));

export const normalizeHallucinationText = (value: string): string =>
  value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');

const registrationByAnimationId = new Map(
  ANIMATION_PROTOTYPE_REGISTRY.map((registration) => [registration.animationId, registration] as const),
);

export type HallucinationSceneRuntime = {
  scene: HallucinationScene;
  registration: AnimationPrototypeRegistration;
  component: ComponentType<PrototypeRenderProps>;
  renderProps: PrototypeRenderProps;
};

export const buildHallucinationSceneRuntime = (scene: HallucinationScene): HallucinationSceneRuntime => {
  const registration = registrationByAnimationId.get(scene.animationId);
  if (!registration) throw new Error(`missing production-ready animation: ${scene.animationId}`);
  if (registration.durationInFrames !== 180 || registration.fps !== 30 || registration.width !== 1080 || registration.height !== 1920) {
    throw new Error(`incompatible production registration: ${scene.animationId}`);
  }
  const meaningContract = enhanceSceneMeaning(scene.spokenText);
  const derived = derivePrototypeRuntimeContent({animationId: scene.animationId, spokenText: scene.spokenText, meaningContract});
  const sanitized = sanitizePrototypeRuntimeContent({animationId: scene.animationId, spokenText: scene.spokenText, derived});
  const associated = associatePrototypeRuntimeContent({animationId: scene.animationId, spokenText: scene.spokenText, content: sanitized});
  const renderProps = createPrototypeRenderProps({
    spokenText: scene.spokenText,
    meaningContract,
    title: scene.headline,
    labels: {...associated.labels, ...scene.visualLabels},
    values: associated.values,
  });
  return {scene, registration, component: registration.component, renderProps};
};

export const assertHallucinationContract = (): void => {
  if (reel.slug !== 'ai-hallucinations') throw new Error('unexpected hallucination reel slug');
  if (HALLUCINATION_WIDTH !== 1080 || HALLUCINATION_HEIGHT !== 1920 || HALLUCINATION_FPS !== 30) {
    throw new Error('hallucination reel format must be 1080x1920 @30fps');
  }
  if (HALLUCINATION_SCENES.length !== 5) throw new Error('hallucination reel must contain exactly five scenes');
  let cursor = 0;
  const sceneIds = new Set<string>();
  const animationIds = new Set<string>();
  for (const scene of HALLUCINATION_SCENES) {
    if (sceneIds.has(scene.sceneId)) throw new Error(`duplicate scene id: ${scene.sceneId}`);
    if (animationIds.has(scene.animationId)) throw new Error(`duplicate animation id: ${scene.animationId}`);
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid frame range for ${scene.sceneId}`);
    if (!scene.spokenText.trim() || !scene.headline.trim()) throw new Error(`missing viewer content for ${scene.sceneId}`);
    if (scene.headline.length > 38) throw new Error(`headline too long for ${scene.sceneId}`);
    if (!scene.visualLabels.shellIcon?.trim()) throw new Error(`missing shellIcon for ${scene.sceneId}`);
    buildHallucinationSceneRuntime(scene);
    sceneIds.add(scene.sceneId);
    animationIds.add(scene.animationId);
    cursor = scene.endFrame;
  }
  if (cursor !== HALLUCINATION_DURATION_IN_FRAMES) throw new Error('hallucination scenes do not cover full composition');
  for (const scene of HALLUCINATION_SCENES) {
    const cues = HALLUCINATION_SUBTITLES.filter((cue) => cue.sceneId === scene.sceneId).sort((a, b) => a.startFrame - b.startFrame);
    if (cues.length === 0) throw new Error(`${scene.sceneId} must have at least one subtitle cue`);
    if (cues.some((cue) => cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame)) throw new Error(`subtitle cue outside ${scene.sceneId}`);
    if (normalizeHallucinationText(cues.map((cue) => cue.text).join(' ')) !== normalizeHallucinationText(scene.spokenText)) throw new Error(`subtitle mismatch for ${scene.sceneId}`);
  }
};

assertHallucinationContract();

const edgeFade = (frame: number, startFrame: number, endFrame: number): number => {
  const fadeFrames = 4;
  return Math.min(
    interpolate(frame, [startFrame, startFrame + fadeFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [endFrame - fadeFrames, endFrame], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
};

const activeWordIndex = (frame: number, cue: HallucinationSubtitleCue, wordCount: number): number => {
  if (wordCount <= 1) return 0;
  if (cue.words && cue.words.length === wordCount) {
    const exact = cue.words.findIndex((word) => frame >= word.startFrame && frame < word.endFrame);
    if (exact >= 0) return exact;
  }
  const progress = interpolate(frame, [cue.startFrame, Math.max(cue.startFrame + 1, cue.endFrame - 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return Math.min(wordCount - 1, Math.floor(progress * wordCount));
};

const HallucinationCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = HALLUCINATION_SUBTITLES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  const words = cue.words?.length ? cue.words.map((word) => word.text) : cue.text.trim().split(/\s+/).filter(Boolean);
  const activeIndex = activeWordIndex(frame, cue, words.length);
  return (
    <div style={{position:'absolute',left:76,right:76,bottom:264,zIndex:200,display:'flex',justifyContent:'center',pointerEvents:'none',opacity:edgeFade(frame,cue.startFrame,cue.endFrame)}}>
      <div style={{width:'100%',maxWidth:880,color:BRAND.ink,fontFamily:BRAND.font,fontSize:48,fontWeight:850,lineHeight:1.18,letterSpacing:-0.9,textAlign:'center',textShadow:'0 2px 0 rgba(255,255,255,0.96), 0 0 14px rgba(255,255,255,0.96), 0 8px 30px rgba(26,26,46,0.10)'}}>
        {words.map((word, index) => (
          <React.Fragment key={`${cue.sceneId}-${cue.startFrame}-${index}-${word}`}>
            <span style={{display:'inline-block',color:index === activeIndex ? BRAND.accentDk : BRAND.ink,transform:`scale(${index === activeIndex ? 1.035 : 1})`,transformOrigin:'50% 70%'}}>{word}</span>
            {index < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export type ReelHallucinationsProps = {voiceoverSrc?: string; showCaptions?: boolean};

export const ReelHallucinations: React.FC<ReelHallucinationsProps> = ({voiceoverSrc, showCaptions = true}) => {
  const runtimes = useMemo(() => HALLUCINATION_SCENES.map(buildHallucinationSceneRuntime), []);
  return (
    <AbsoluteFill style={{background:BRAND.bg}}>
      {runtimes.map(({scene, component: Component, renderProps}) => (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={`${scene.sceneId}-${scene.animationId}`}>
          <Component {...renderProps} />
        </Sequence>
      ))}
      {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
      {showCaptions ? <HallucinationCaptions /> : null}
    </AbsoluteFill>
  );
};
