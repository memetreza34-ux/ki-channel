import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND} from '../../../brand/brand';
import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/01_Warum-KI-auf-dieselbe-Frage-anders-antwortet/06-projektdateien/reel.json';
import subtitleJson from '../../../reels/2026-09-21_bis_2026-09-27/01_Warum-KI-auf-dieselbe-Frage-anders-antwortet/03-caption/subtitle-cues.json';
import {
  assertReelCaptionTimeline,
  findCaptionAtMs,
  type ReelCaption,
} from '../captionContract';
import {
  REEL_CAPTION_SAFE,
  REEL_CAPTION_WRAPPER_STYLE,
} from '../captionSafe';
import {assertSamePromptVisualDiversity} from './visualProfiles';

export type SamePromptScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: string;
  visualId: string;
};

const reel = reelJson as {
  slug: string;
  format: {width: number; height: number; fps: number; durationInFrames: number};
  scenes: SamePromptScene[];
};
const captions = (subtitleJson as {fps: number; captions: ReelCaption[]}).captions;

export const SAME_PROMPT_COMPOSITION_ID = 'KI-SamePrompt-DifferentAnswer';
export const SAME_PROMPT_WIDTH = reel.format.width;
export const SAME_PROMPT_HEIGHT = reel.format.height;
export const SAME_PROMPT_FPS = reel.format.fps;
export const SAME_PROMPT_DURATION_IN_FRAMES = reel.format.durationInFrames;
export const SAME_PROMPT_SCENES = Object.freeze(reel.scenes.map((scene) => Object.freeze({...scene})));
export const SAME_PROMPT_CAPTIONS = Object.freeze(captions.map((caption) => Object.freeze({...caption})));

const PURPLE = BRAND.accentDk;
const PURPLE_SOFT = BRAND.accent;
const INK = BRAND.ink;
const GREEN = '#35C58A';
const ORANGE = '#F3A34B';
const RED = '#E45C64';
const MUTED = '#777184';
const LINE = '#E8E2F2';

const progress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const SceneShell: React.FC<{scene: SamePromptScene; children: React.ReactNode}> = ({scene, children}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 32%, ${BRAND.bgDeep} 0%, ${BRAND.bg} 48%, #FFFFFF 100%)`,
      color: INK,
      fontFamily: BRAND.font,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 112,
        left: 92,
        right: 92,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        color: PURPLE,
        fontSize: 45,
        fontWeight: 900,
        letterSpacing: -1.3,
        textAlign: 'center',
      }}
    >
      <span style={{fontSize: 39, lineHeight: 1}}>{scene.icon}</span>
      <span>{scene.headline}</span>
    </div>
    {children}
  </AbsoluteFill>
);

const Token: React.FC<{
  text: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  active?: boolean;
  tone?: 'purple' | 'green' | 'orange';
}> = ({text, x, y, scale = 1, opacity = 1, active = false, tone = 'purple'}) => {
  const color = tone === 'green' ? GREEN : tone === 'orange' ? ORANGE : PURPLE;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        minWidth: 116,
        padding: '16px 24px',
        borderRadius: 999,
        border: `3px solid ${active ? color : `${color}66`}`,
        background: active ? color : 'rgba(255,255,255,0.94)',
        color: active ? '#FFFFFF' : INK,
        fontSize: 30,
        fontWeight: 900,
        textAlign: 'center',
        boxShadow: active ? `0 18px 55px ${color}44` : '0 14px 34px rgba(43,34,61,0.08)',
      }}
    >
      {text}
    </div>
  );
};

const HookSplit: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 22);
  const fork = progress(frame, 18, 68);
  const answers = progress(frame, 52, 92);
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', left: 250, top: 330, width: 580, textAlign: 'center', opacity: enter, transform: `translateY(${(1 - enter) * 38}px)`}}>
        <div style={{fontSize: 22, fontWeight: 900, color: PURPLE, letterSpacing: 2.5}}>IDENTISCHER PROMPT</div>
        <div style={{marginTop: 14, fontSize: 52, fontWeight: 950}}>„Erklär KI kurz.“</div>
      </div>
      <svg width="1080" height="900" viewBox="0 0 1080 900" style={{position: 'absolute', left: 0, top: 390}}>
        <path d="M540 120 C540 260 350 280 270 455" fill="none" stroke={PURPLE} strokeWidth="13" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fork} />
        <path d="M540 120 C540 260 730 280 810 455" fill="none" stroke={GREEN} strokeWidth="13" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fork} />
        <circle cx="540" cy="120" r={30 + fork * 8} fill={PURPLE} />
        <circle cx="270" cy="455" r={20 + answers * 13} fill={PURPLE} opacity={answers} />
        <circle cx="810" cy="455" r={20 + answers * 13} fill={GREEN} opacity={answers} />
      </svg>
      <div style={{position: 'absolute', left: 110, top: 925, width: 360, opacity: answers, transform: `translateX(${(1 - answers) * -45}px)`}}>
        <div style={{fontSize: 22, color: PURPLE, fontWeight: 900}}>ANTWORT A</div>
        <div style={{marginTop: 10, fontSize: 43, lineHeight: 1.08, fontWeight: 950}}>„KI hilft dir, Muster zu nutzen.“</div>
      </div>
      <div style={{position: 'absolute', right: 90, top: 925, width: 380, textAlign: 'right', opacity: answers, transform: `translateX(${(1 - answers) * 45}px)`}}>
        <div style={{fontSize: 22, color: GREEN, fontWeight: 900}}>ANTWORT B</div>
        <div style={{marginTop: 10, fontSize: 43, lineHeight: 1.08, fontWeight: 950}}>„KI erzeugt passende Fortsetzungen.“</div>
      </div>
    </SceneShell>
  );
};

const ProbabilityField: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const field = progress(frame, 8, 54);
  const settle = progress(frame, 55, 105);
  const candidates = [
    {text: 'kann', x: 280, y: 630, s: 1.12, tone: 'purple' as const},
    {text: 'wird', x: 800, y: 610, s: 0.98, tone: 'green' as const},
    {text: 'ist', x: 330, y: 930, s: 0.84, tone: 'orange' as const},
    {text: 'bleibt', x: 770, y: 930, s: 0.72, tone: 'purple' as const},
  ];
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', color: MUTED, fontSize: 21, fontWeight: 850, letterSpacing: 2}}>BEISPIEL-TOKENS · KEINE MESSWERTE</div>
      <svg width="1080" height="820" viewBox="0 0 1080 820" style={{position: 'absolute', left: 0, top: 370, opacity: field}}>
        {candidates.map((candidate, index) => (
          <line key={candidate.text} x1="540" y1="335" x2={candidate.x} y2={candidate.y - 370} stroke={index % 2 ? `${GREEN}44` : `${PURPLE}44`} strokeWidth={4 + index} strokeDasharray="12 16" />
        ))}
        <circle cx="540" cy="335" r={112 + settle * 13} fill="rgba(110,69,201,0.08)" stroke={PURPLE_SOFT} strokeWidth="5" />
        <circle cx="540" cy="335" r={72} fill={PURPLE} />
      </svg>
      <div style={{position: 'absolute', top: 650, left: 390, width: 300, textAlign: 'center', color: '#FFFFFF', fontSize: 24, fontWeight: 950, letterSpacing: 1.5, opacity: field}}>NÄCHSTER<br />TOKEN</div>
      {candidates.map((candidate, index) => {
        const show = progress(frame, 22 + index * 8, 54 + index * 8);
        return <Token key={candidate.text} text={candidate.text} x={candidate.x} y={candidate.y} scale={(0.65 + 0.35 * show) * candidate.s} opacity={show} tone={candidate.tone} />;
      })}
      <div style={{position: 'absolute', top: 1120, left: 170, right: 170, textAlign: 'center', fontSize: 34, lineHeight: 1.15, fontWeight: 900, opacity: settle}}>Mehrere Fortsetzungen können gleichzeitig plausibel sein.</div>
    </SceneShell>
  );
};

const SamplingSelector: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const spin = progress(frame, 8, 74);
  const lock = progress(frame, 74, 112);
  const angle = interpolate(spin, [0, 1], [-72, 0]);
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', left: 190, top: 390, width: 700, height: 700, borderRadius: 999, border: `5px solid ${LINE}`, background: 'rgba(255,255,255,0.72)', boxShadow: '0 30px 90px rgba(60,42,90,0.08)'}}>
        <Token text="wird" x={350} y={150} scale={0.9} />
        <Token text="kann" x={350} y={55} scale={1 + lock * 0.14} active={lock > 0.45} />
        <Token text="ist" x={555} y={230} scale={0.84} tone="orange" />
        <Token text="bleibt" x={145} y={230} scale={0.78} tone="green" />
        <div style={{position: 'absolute', left: 350, top: 350, width: 190, height: 190, borderRadius: 999, transform: 'translate(-50%, -50%)', background: PURPLE, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 26, lineHeight: 1.05, fontWeight: 950}}>SAMPLING</div>
        <div style={{position: 'absolute', left: 350, top: 350, width: 18, height: 245, borderRadius: 999, background: `linear-gradient(${PURPLE}, ${PURPLE_SOFT})`, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${angle}deg)`, boxShadow: `0 0 24px ${PURPLE}55`}} />
        <div style={{position: 'absolute', left: 350, top: 350, width: 40, height: 40, borderRadius: 999, transform: 'translate(-50%, -50%)', background: '#FFFFFF', border: `8px solid ${PURPLE}`}} />
      </div>
      <div style={{position: 'absolute', top: 1130, left: 130, right: 130, textAlign: 'center', fontSize: 39, fontWeight: 950, opacity: progress(frame, 58, 95)}}>Eine Möglichkeit wird gewählt.</div>
    </SceneShell>
  );
};

const ContextFork: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const travel = progress(frame, 6, 58);
  const fork = progress(frame, 52, 110);
  const tokenX = interpolate(travel, [0, 1], [160, 515]);
  return (
    <SceneShell scene={scene}>
      <svg width="1080" height="900" viewBox="0 0 1080 900" style={{position: 'absolute', top: 350, left: 0}}>
        <path d="M150 380 L520 380" fill="none" stroke={PURPLE} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - travel} />
        <path d="M520 380 C640 380 670 210 850 210" fill="none" stroke={PURPLE} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fork} />
        <path d="M520 380 C640 380 670 555 850 555" fill="none" stroke={GREEN} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fork} />
        <circle cx="520" cy="380" r={28 + fork * 12} fill={ORANGE} />
      </svg>
      <Token text="kann" x={tokenX} y={730} scale={1.05} active />
      <Token text="helfen" x={850} y={560} scale={0.92 + fork * 0.08} opacity={fork} />
      <Token text="verändern" x={850} y={905} scale={0.92 + fork * 0.08} opacity={fork} tone="green" />
      <div style={{position: 'absolute', top: 1085, left: 140, right: 140, textAlign: 'center', fontSize: 34, fontWeight: 900, opacity: fork}}>Neuer Token = neuer Kontext für den nächsten Schritt.</div>
    </SceneShell>
  );
};

const SentenceCascade: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const top = ['KI', 'kann', 'Arbeit', 'vereinfachen'];
  const bottom = ['KI', 'kann', 'Ideen', 'verändern'];
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', top: 350, left: 0, right: 0, textAlign: 'center', color: MUTED, fontSize: 21, fontWeight: 850, letterSpacing: 2}}>ILLUSTRATIVES SATZBEISPIEL</div>
      {[top, bottom].map((words, row) => (
        <div key={row} style={{position: 'absolute', left: 80, right: 80, top: 520 + row * 340, height: 210}}>
          <div style={{position: 'absolute', left: 65, right: 65, top: 102, height: 6, borderRadius: 999, background: row === 0 ? `${PURPLE}33` : `${GREEN}33`}} />
          {words.map((word, index) => {
            const show = progress(frame, 8 + index * 22 + row * 5, 35 + index * 22 + row * 5);
            const x = 105 + index * 235;
            return (
              <React.Fragment key={`${row}-${word}-${index}`}>
                <div style={{position: 'absolute', left: x, top: 105, width: 24, height: 24, borderRadius: 999, background: row === 0 ? PURPLE : GREEN, transform: `translate(-50%, -50%) scale(${show})`, opacity: show}} />
                <div style={{position: 'absolute', left: x, top: 135, width: 205, transform: `translateX(-50%) translateY(${(1 - show) * 28}px)`, opacity: show, textAlign: 'center', fontSize: 33, fontWeight: 950, color: index < 2 ? INK : row === 0 ? PURPLE : GREEN}}>{word}</div>
              </React.Fragment>
            );
          })}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1120, textAlign: 'center', fontSize: 36, fontWeight: 950, opacity: progress(frame, 90, 140)}}>Kleine Abzweigung → anderer Satz</div>
    </SceneShell>
  );
};

const TemperatureFan: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const turn = progress(frame, 12, 115);
  const spread = interpolate(turn, [0, 1], [0.38, 1]);
  const labels = ['kann', 'wird', 'ist', 'bleibt', 'wirkt'];
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', left: 160, right: 160, top: 350, textAlign: 'center', fontSize: 24, color: MUTED, fontWeight: 900, letterSpacing: 2}}>WENN SAMPLING VERWENDET WIRD</div>
      <div style={{position: 'absolute', left: 540, top: 930, width: 430, height: 430, borderRadius: 999, transform: 'translate(-50%, -50%)', border: `6px solid ${LINE}`, background: 'rgba(255,255,255,0.78)'}}>
        <div style={{position: 'absolute', left: 215, top: 215, width: 18, height: 155, borderRadius: 999, background: PURPLE, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${interpolate(turn, [0, 1], [-58, 58])}deg)`, boxShadow: `0 0 30px ${PURPLE}55`}} />
        <div style={{position: 'absolute', left: 215, top: 215, width: 62, height: 62, borderRadius: 999, background: PURPLE, transform: 'translate(-50%, -50%)'}} />
        <div style={{position: 'absolute', left: 52, bottom: 64, color: PURPLE, fontSize: 24, fontWeight: 950}}>ENGER</div>
        <div style={{position: 'absolute', right: 43, bottom: 64, color: GREEN, fontSize: 24, fontWeight: 950}}>BREITER</div>
      </div>
      {labels.map((label, index) => {
        const offset = (index - 2) * 142 * spread;
        const y = 540 + Math.abs(index - 2) * 24 * spread;
        return <Token key={label} text={label} x={540 + offset} y={y} scale={0.72 + (index === 2 ? 0.18 : 0)} opacity={progress(frame, 4 + index * 5, 35 + index * 5)} tone={index % 2 ? 'green' : 'purple'} />;
      })}
      <div style={{position: 'absolute', top: 1160, left: 120, right: 120, textAlign: 'center', fontSize: 35, lineHeight: 1.15, fontWeight: 950}}>Temperatur kann die Verteilung stärker oder schwächer spreizen.</div>
    </SceneShell>
  );
};

const ReproducibilityRails: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const align = progress(frame, 8, 105);
  const labels = ['PROMPT', 'MODELL', 'EINSTELLUNGEN'];
  const starts = [285, 520, 810];
  const target = 690;
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', left: 110, right: 110, top: 390}}>
        {labels.map((label, index) => {
          const y = index * 220;
          const x = interpolate(align, [0, 1], [starts[index], target]);
          return (
            <div key={label} style={{position: 'absolute', left: 0, right: 0, top: y, height: 150}}>
              <div style={{position: 'absolute', left: 0, top: 58, width: 820, height: 8, borderRadius: 999, background: LINE}} />
              <div style={{position: 'absolute', left: 0, top: 0, color: INK, fontSize: 24, fontWeight: 950, letterSpacing: 2}}>{label}</div>
              <div style={{position: 'absolute', left: x, top: 62, width: 66, height: 66, borderRadius: 18, transform: 'translate(-50%, -50%) rotate(45deg)', background: index === 0 ? PURPLE : index === 1 ? GREEN : ORANGE, boxShadow: '0 16px 38px rgba(30,22,48,0.12)'}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: target, top: 48, width: 5, height: 520, background: PURPLE, opacity: align, transform: 'translateX(-50%)', borderRadius: 999}} />
        <div style={{position: 'absolute', left: target - 95, top: 560, width: 190, textAlign: 'center', color: PURPLE, fontSize: 26, fontWeight: 950, opacity: align}}>FIXIERT</div>
      </div>
      <div style={{position: 'absolute', left: 170, right: 170, top: 1110, display: 'flex', alignItems: 'center', gap: 28, opacity: progress(frame, 82, 128)}}>
        <span style={{fontSize: 32, fontWeight: 950}}>Zufall</span>
        <div style={{flex: 1, height: 20, borderRadius: 999, background: LINE, overflow: 'hidden'}}><div style={{height: '100%', width: `${interpolate(align, [0, 1], [82, 28])}%`, background: PURPLE, borderRadius: 999}} /></div>
        <span style={{fontSize: 44, color: GREEN, fontWeight: 950}}>↓</span>
      </div>
    </SceneShell>
  );
};

const CreativePayoff: React.FC<{scene: SamePromptScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const settle = progress(frame, 0, 72);
  const angle = interpolate(settle, [0, 0.45, 1], [-7, 5, 0]);
  return (
    <SceneShell scene={scene}>
      <div style={{position: 'absolute', left: 130, right: 130, top: 520, height: 500}}>
        <div style={{position: 'absolute', left: 380, top: 235, width: 0, height: 0, borderLeft: '65px solid transparent', borderRight: '65px solid transparent', borderBottom: `150px solid ${INK}`}} />
        <div style={{position: 'absolute', left: 380, top: 190, width: 760, height: 24, borderRadius: 999, background: `linear-gradient(90deg, ${PURPLE}, ${GREEN})`, transformOrigin: '50% 50%', transform: `translateX(-50%) rotate(${angle}deg)`, boxShadow: '0 20px 45px rgba(50,38,74,0.18)'}} />
        <div style={{position: 'absolute', left: 35, top: 40, width: 290, textAlign: 'center', opacity: progress(frame, 10, 35)}}>
          <div style={{fontSize: 26, fontWeight: 950, color: PURPLE}}>ROUTINE</div>
          <div style={{marginTop: 12, fontSize: 43, fontWeight: 950}}>reproduzierbarer</div>
        </div>
        <div style={{position: 'absolute', right: 20, top: 40, width: 300, textAlign: 'center', opacity: progress(frame, 22, 47)}}>
          <div style={{fontSize: 26, fontWeight: 950, color: GREEN}}>KREATIV</div>
          <div style={{marginTop: 12, fontSize: 43, fontWeight: 950}}>mehr Variation</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 100, right: 100, top: 1090, textAlign: 'center', fontSize: 48, fontWeight: 950, opacity: progress(frame, 45, 75)}}>Das Ziel entscheidet.</div>
    </SceneShell>
  );
};

const sceneComponents: Record<string, React.FC<{scene: SamePromptScene}>> = {
  'prompt-split-fork': HookSplit,
  'radial-token-field': ProbabilityField,
  'sampling-selector-ring': SamplingSelector,
  'context-branch-switch': ContextFork,
  'dual-sentence-cascade': SentenceCascade,
  'temperature-distribution-fan': TemperatureFan,
  'settings-alignment-rails': ReproducibilityRails,
  'stability-variation-balance': CreativePayoff,
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const caption = findCaptionAtMs(SAME_PROMPT_CAPTIONS, ms);
  if (!caption) return null;
  const words = caption.text.trim().split(/\s+/).filter(Boolean);
  const cueProgress = interpolate(ms, [caption.startMs, caption.endMs], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const activeIndex = Math.min(words.length - 1, Math.floor(cueProgress * words.length));
  const edge = Math.min(
    interpolate(ms, [caption.startMs, caption.startMs + 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(ms, [caption.endMs - 90, caption.endMs], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  return (
    <div style={{...REEL_CAPTION_WRAPPER_STYLE, opacity: edge}}>
      <div style={{width: '100%', maxWidth: REEL_CAPTION_SAFE.maxWidth, textAlign: 'center', fontFamily: BRAND.font, fontSize: 49, lineHeight: 1.16, fontWeight: 900, letterSpacing: -1, color: INK, textShadow: '0 2px 0 rgba(255,255,255,.95), 0 0 16px rgba(255,255,255,.98), 0 10px 32px rgba(26,26,46,.10)'}}>
        {words.map((word, index) => (
          <React.Fragment key={`${caption.startMs}-${index}-${word}`}>
            <span style={{display: 'inline-block', color: index === activeIndex ? PURPLE : INK, transform: `scale(${index === activeIndex ? 1.035 : 1})`}}>{word}</span>{index < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const assertSamePromptContract = (): void => {
  if (reel.slug !== 'same-prompt-different-answer') throw new Error('unexpected same-prompt reel slug');
  if (SAME_PROMPT_WIDTH !== 1080 || SAME_PROMPT_HEIGHT !== 1920 || SAME_PROMPT_FPS !== 30) throw new Error('same-prompt reel must be 1080x1920 @30fps');
  if (SAME_PROMPT_SCENES.length !== 8) throw new Error('same-prompt reel must contain exactly eight scenes');
  let cursor = 0;
  const visualIds = new Set<string>();
  for (const scene of SAME_PROMPT_SCENES) {
    if (scene.startFrame !== cursor || scene.endFrame <= scene.startFrame) throw new Error(`invalid frame range: ${scene.sceneId}`);
    if (!scene.headline.trim() || !scene.icon.trim()) throw new Error(`missing viewer header: ${scene.sceneId}`);
    if (!sceneComponents[scene.visualId]) throw new Error(`missing scene component: ${scene.visualId}`);
    if (visualIds.has(scene.visualId)) throw new Error(`duplicate visual id: ${scene.visualId}`);
    visualIds.add(scene.visualId);
    cursor = scene.endFrame;
  }
  if (cursor !== SAME_PROMPT_DURATION_IN_FRAMES) throw new Error('scenes do not cover full composition');
  assertReelCaptionTimeline(SAME_PROMPT_CAPTIONS);
  const finalCaption = SAME_PROMPT_CAPTIONS[SAME_PROMPT_CAPTIONS.length - 1];
  if (!finalCaption || finalCaption.endMs > (SAME_PROMPT_DURATION_IN_FRAMES / SAME_PROMPT_FPS) * 1000) throw new Error('captions exceed composition duration');
  assertSamePromptVisualDiversity();
};

assertSamePromptContract();

export type ReelSamePromptDifferentAnswerProps = {
  voiceoverSrc?: string;
  showCaptions?: boolean;
};

export const ReelSamePromptDifferentAnswer: React.FC<ReelSamePromptDifferentAnswerProps> = ({voiceoverSrc, showCaptions = true}) => (
  <AbsoluteFill style={{background: BRAND.bg}}>
    {SAME_PROMPT_SCENES.map((scene) => {
      const Component = sceneComponents[scene.visualId];
      return (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={`${scene.sceneId}-${scene.visualId}`}>
          <Component scene={scene} />
        </Sequence>
      );
    })}
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
    {showCaptions ? <Captions /> : null}
  </AbsoluteFill>
);
