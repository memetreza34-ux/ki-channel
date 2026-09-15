import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  AlertTriangle,
  ArrowRight,
  Braces,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Code2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Orbit,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ReelSfxTrack} from '../ReelSfxTrack';
import {SourceProofCard} from '../ReelVisualMotion';
import {
  ImpactNumber,
  StoryBeat,
  StoryCamera,
  StoryChapterLabel,
  StoryCutFlash,
  StoryProgressRail,
  StoryTexture,
} from '../StoryMotion';
import {
  OPENAI_CURSOR_CUES,
  OPENAI_CURSOR_SCENES,
  OPENAI_CURSOR_SFX,
  type OpenAICursorCue,
} from './contract';

type Props = {voiceoverSrc: string; showCaptions?: boolean; showSfx?: boolean};
type SceneProps = {duration: number; accent: string};
type Window = {start: number; end: number};

const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const at = (duration: number, ratio: number) => Math.max(0, Math.round(duration * ratio));
const between = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const sceneFor = (sceneId: string) => OPENAI_CURSOR_SCENES.find((scene) => scene.sceneId === sceneId);
const sentenceWindow = (
  sceneId: string,
  sentenceId: string,
  duration: number,
  fallbackStartRatio: number,
  fallbackEndRatio: number,
): Window => {
  const scene = sceneFor(sceneId);
  const matches = OPENAI_CURSOR_CUES.filter((cue) => cue.sceneId === sceneId && cue.sentenceId === sentenceId);
  if (scene && matches.length) {
    const start = Math.min(...matches.map((cue) => cue.startFrame)) - scene.startFrame;
    const end = Math.max(...matches.map((cue) => cue.endFrame)) - scene.startFrame;
    return {
      start: between(Math.round(start), 0, Math.max(0, duration - 1)),
      end: between(Math.round(end), 1, duration),
    };
  }
  return {start: at(duration, fallbackStartRatio), end: at(duration, fallbackEndRatio)};
};
const cueAt = (window: Window, progress: number) => Math.round(window.start + (window.end - window.start) * between(progress, 0, 1));

const AmbientField: React.FC<{accent: string; seed?: number}> = ({accent, seed = 0}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame + seed * 13) * 0.018) * 24;
  const drift2 = Math.cos((frame + seed * 17) * 0.014) * 18;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: -160 + drift,
          top: 280 + drift2,
          width: 520,
          height: 520,
          borderRadius: 999,
          background: `radial-gradient(circle, ${accent}18 0%, ${accent}08 38%, transparent 72%)`,
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -220 - drift2,
          bottom: 310 + drift,
          width: 660,
          height: 660,
          borderRadius: 999,
          background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage: 'radial-gradient(circle, rgba(16,32,51,.18) 1.1px, transparent 1.2px)',
          backgroundSize: '34px 34px',
          backgroundPosition: `${drift * 0.25}px ${drift2 * 0.25}px`,
          maskImage: 'linear-gradient(180deg, transparent 2%, black 22%, black 78%, transparent 96%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Shell: React.FC<React.PropsWithChildren<{accent: string; eyebrow: string; seed?: number}>> = ({
  accent,
  eyebrow,
  seed = 6,
  children,
}) => (
  <AbsoluteFill
    style={{
      fontFamily: FONT,
      color: '#102033',
      background: 'linear-gradient(180deg,#FCFEFF 0%,#EFF5FA 100%)',
      padding: '88px 68px 0',
      overflow: 'hidden',
    }}
  >
    <StoryTexture seed={seed} opacity={0.08} />
    <AmbientField accent={accent} seed={seed} />
    <div style={{position: 'relative', zIndex: 5}}>
      <StoryChapterLabel accent={accent}>{eyebrow}</StoryChapterLabel>
    </div>
    <div style={{position: 'relative', zIndex: 4, flex: 1}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(255,255,255,.94)',
      border: '1px solid rgba(16,32,51,.09)',
      boxShadow: '0 24px 70px rgba(20,42,70,.12)',
      borderRadius: 34,
      ...style,
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<React.PropsWithChildren<{size?: number; width?: number}>> = ({children, size = 72, width = 940}) => (
  <div style={{fontSize: size, lineHeight: 1.01, fontWeight: 950, letterSpacing: '-.045em', marginTop: 28, maxWidth: width}}>
    {children}
  </div>
);

const MetaPill: React.FC<{label: string; value: string; accent: string; icon?: React.ReactNode}> = ({label, value, accent, icon}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      borderRadius: 18,
      background: 'rgba(255,255,255,.86)',
      border: '1px solid rgba(16,32,51,.08)',
      boxShadow: '0 10px 28px rgba(16,32,51,.08)',
      fontSize: 18,
      fontWeight: 900,
      letterSpacing: '.025em',
    }}
  >
    <span style={{color: accent, display: 'grid', placeItems: 'center'}}>{icon ?? <CircleDot size={18} />}</span>
    <span style={{opacity: 0.52}}>{label}</span>
    <span style={{color: accent}}>{value}</span>
  </div>
);

const LogoCard: React.FC<{label: string; sub: string; accent: string; icon: React.ReactNode; detail?: string}> = ({
  label,
  sub,
  accent,
  icon,
  detail,
}) => (
  <Card style={{padding: 28, minHeight: 210, display: 'flex', alignItems: 'center', gap: 22}}>
    <div style={{width: 74, height: 74, borderRadius: 24, display: 'grid', placeItems: 'center', background: `${accent}15`, color: accent}}>{icon}</div>
    <div style={{minWidth: 0}}>
      <div style={{fontSize: 35, fontWeight: 950}}>{label}</div>
      <div style={{fontSize: 22, opacity: 0.55, marginTop: 5}}>{sub}</div>
      {detail ? <div style={{fontSize: 17, opacity: 0.42, marginTop: 10, fontWeight: 800}}>{detail}</div> : null}
    </div>
  </Card>
);

const SparkBurst: React.FC<{atFrame: number; accent: string; left: number; top: number}> = ({atFrame, accent, left, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - atFrame, fps, config: {damping: 13, stiffness: 260, mass: 0.52}});
  const fade = interpolate(frame, [atFrame + 4, atFrame + 26], [1, 0], clamp);
  if (frame < atFrame || fade <= 0) return null;
  return (
    <div style={{position: 'absolute', left, top, width: 10, height: 10, pointerEvents: 'none', zIndex: 18}}>
      {Array.from({length: 8}).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 8;
        const distance = 24 + p * 58;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: Math.cos(angle) * distance,
              top: Math.sin(angle) * distance,
              width: 32,
              height: 5,
              borderRadius: 99,
              background: accent,
              opacity: fade,
              transform: `rotate(${angle}rad) scaleX(${0.35 + p * 0.65})`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}
    </div>
  );
};

const Scene1: React.FC<SceneProps> = ({duration, accent}) => {
  const frame = useCurrentFrame();
  const s01 = sentenceWindow('scene1', 's01', duration, 0, 0.44);
  const s02 = sentenceWindow('scene1', 's02', duration, 0.44, 1);
  const openAiAt = cueAt(s01, 0.08);
  const cursorAt = cueAt(s01, 0.25);
  const cableAt = cueAt(s01, 0.39);
  const ownerAt = cueAt(s01, 0.72);
  const dateAt = cueAt(s02, 0.08);
  const contractAt = cueAt(s02, 0.30);
  const breakAt = cueAt(s02, 0.63);
  const consequenceAt = cueAt(s02, 0.78);
  const cableProgress = interpolate(frame, [cableAt, ownerAt + 4], [0, 1], clamp);
  const fracture = interpolate(frame, [breakAt - 5, breakAt + 18], [0, 1], clamp);
  const leftWidth = Math.max(0, 100 - fracture * 48);
  const rightWidth = Math.max(0, 100 - fracture * 48);

  return (
    <Shell accent={accent} eyebrow="KAPITEL 1 • DER BRUCH" seed={9}>
      <StoryBeat startFrame={s01.start + 1} role="HOOK"><Headline>OpenAI zieht bei Cursor die Reißleine.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1160, marginTop: 26}}>
        <StoryBeat startFrame={openAiAt} direction="left" role="HOOK" style={{position: 'absolute', left: 0, top: 70, width: 420}}>
          <LogoCard label="OpenAI" sub="Modell-Anbieter" detail="API + direkte Modellintegration" accent="#111827" icon={<Orbit size={44} />} />
        </StoryBeat>
        <StoryBeat startFrame={cursorAt} direction="right" role="HOOK" style={{position: 'absolute', right: 0, top: 70, width: 420}}>
          <LogoCard label="Cursor" sub="Coding Tool" detail="nutzt externe Modellanbieter" accent="#2E90FA" icon={<Code2 size={44} />} />
        </StoryBeat>

        <StoryBeat startFrame={cableAt} role="CHANGE" style={{position: 'absolute', left: 386, right: 386, top: 171, height: 32}}>
          <div style={{position: 'relative', height: 32}}>
            <div style={{position: 'absolute', left: 0, top: 13, width: `${leftWidth}%`, maxWidth: '50%', height: 8, borderRadius: 99, background: '#111827', opacity: cableProgress}} />
            <div style={{position: 'absolute', right: 0, top: 13, width: `${rightWidth}%`, maxWidth: '50%', height: 8, borderRadius: 99, background: '#2E90FA', opacity: cableProgress}} />
            <div style={{position: 'absolute', left: '50%', top: 5, width: 16, height: 16, marginLeft: -8, borderRadius: 99, background: fracture > 0.25 ? accent : '#12B76A', boxShadow: `0 0 0 8px ${fracture > 0.25 ? accent : '#12B76A'}20`}} />
          </div>
        </StoryBeat>
        <SparkBurst atFrame={breakAt} accent={accent} left={470} top={176} />

        <StoryCamera startFrame={ownerAt - 4} endFrame={ownerAt + 36} fromScale={0.94} toScale={1.08} origin="50% 50%">
          <StoryBeat startFrame={ownerAt} direction="down" role="CHANGE" style={{position: 'absolute', left: 210, right: 210, top: 330}}>
            <Card style={{padding: 34, textAlign: 'center', border: `2px solid ${accent}50`}}>
              <Rocket size={76} color={accent} />
              <div style={{fontSize: 50, fontWeight: 950, marginTop: 14}}>SpaceX</div>
              <div style={{fontSize: 25, opacity: 0.58, marginTop: 7}}>neuer Eigentümer von Cursor</div>
              <div style={{display: 'flex', justifyContent: 'center', gap: 12, marginTop: 22}}>
                <MetaPill label="EVENT" value="ACQUISITION" accent={accent} />
                <MetaPill label="EFFECT" value="CONTRACT REVIEW" accent="#7A5AF8" />
              </div>
            </Card>
          </StoryBeat>
        </StoryCamera>

        <StoryBeat startFrame={dateAt} direction="left" role="PROOF" style={{position: 'absolute', left: 20, top: 705}}>
          <MetaPill label="ANKÜNDIGUNG" value="28 AUG 2026" accent={accent} icon={<CalendarDays size={20} />} />
        </StoryBeat>
        <StoryBeat startFrame={contractAt} direction="right" role="CHANGE" style={{position: 'absolute', right: 20, top: 705}}>
          <MetaPill label="STATUS" value="VERTRAG LÄUFT AUS" accent={accent} icon={<Braces size={20} />} />
        </StoryBeat>

        <StoryBeat startFrame={consequenceAt} direction="up" role="CONSEQUENCE" style={{position: 'absolute', left: 72, right: 72, top: 820}}>
          <Card style={{padding: 31, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, border: `2px solid ${accent}34`}}>
            <AlertTriangle size={48} color={accent} />
            <div>
              <div style={{fontSize: 36, fontWeight: 950}}>DIREKTER MODELLVERTRAG WIRD ABGEWICKELT</div>
              <div style={{fontSize: 21, opacity: 0.5, marginTop: 7, fontWeight: 800}}>nicht: Cursor verschwindet komplett</div>
            </div>
          </Card>
        </StoryBeat>
      </div>
      <StoryCutFlash atFrame={Math.max(0, duration - 11)} accent="#FFF4F2" durationFrames={7} />
    </Shell>
  );
};

const Scene2: React.FC<SceneProps> = ({duration, accent}) => {
  const frame = useCurrentFrame();
  const s03 = sentenceWindow('scene2', 's03', duration, 0, 0.40);
  const s04 = sentenceWindow('scene2', 's04', duration, 0.40, 1);
  const dateStart = cueAt(s03, 0.10);
  const timelineAt = cueAt(s03, 0.28);
  const novAt = cueAt(s03, 0.66);
  const continueAt = cueAt(s04, 0.12);
  const earlyAt = cueAt(s04, 0.74);
  const progress = interpolate(frame, [timelineAt, novAt + 18], [0, 1], clamp);
  const pulse = 0.5 + Math.sin(frame * 0.16) * 0.5;

  return (
    <Shell accent={accent} eyebrow="KAPITEL 2 • DIE FRIST" seed={14}>
      <StoryBeat startFrame={s03.start + 1} role="PROOF"><Headline>12. November? Noch nicht endgültig.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1160, marginTop: 24}}>
        <StoryBeat startFrame={dateStart} direction="left" style={{position: 'absolute', left: 0, top: 78, width: 300}}>
          <Card style={{padding: 28, textAlign: 'center'}}>
            <div style={{fontSize: 20, fontWeight: 900, opacity: 0.45}}>ANKÜNDIGUNG</div>
            <div style={{fontSize: 48, fontWeight: 950, marginTop: 8}}>28. AUG</div>
            <div style={{fontSize: 19, opacity: 0.44, marginTop: 3}}>2026</div>
          </Card>
        </StoryBeat>

        <StoryBeat startFrame={timelineAt} role="CHANGE" style={{position: 'absolute', left: 292, right: 250, top: 150}}>
          <div style={{position: 'relative'}}>
            <StoryProgressRail progress={progress} accent={accent} height={24} />
            <div style={{position: 'absolute', left: `${progress * 100}%`, top: -13, width: 48, height: 48, marginLeft: -24, borderRadius: 99, background: '#fff', border: `4px solid ${accent}`, boxShadow: `0 0 0 ${8 + pulse * 6}px ${accent}14`}} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 19, fontSize: 19, fontWeight: 850, opacity: 0.55}}>
              <span>bestehende OpenAI-Modelle</span><span>vorgeschlagener Übergang</span>
            </div>
          </div>
        </StoryBeat>

        <StoryCamera startFrame={novAt - 4} endFrame={novAt + 36} fromScale={0.9} toScale={1.07}>
          <StoryBeat startFrame={novAt} direction="right" role="PAYOFF" style={{position: 'absolute', right: 0, top: 52, width: 310}}>
            <Card style={{padding: 27, textAlign: 'center', border: `2px solid ${accent}55`}}>
              <ImpactNumber value="12. NOV" label="2026" accent={accent} startFrame={novAt} size={74} />
              <div style={{marginTop: 13, fontSize: 18, fontWeight: 950, color: accent}}>VORGESCHLAGEN</div>
            </Card>
          </StoryBeat>
        </StoryCamera>

        <StoryBeat startFrame={continueAt} direction="up" role="PROOF" style={{position: 'absolute', left: 44, right: 44, top: 410}}>
          <Card style={{padding: 34}}>
            <div style={{display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 24, alignItems: 'center'}}>
              <div style={{width: 82, height: 82, borderRadius: 28, background: '#ECFDF3', color: '#12B76A', display: 'grid', placeItems: 'center'}}><CheckCircle2 size={48} /></div>
              <div>
                <div style={{fontSize: 32, fontWeight: 950}}>HEUTIGE MODELLE: WEITERLAUFEN</div>
                <div style={{fontSize: 22, opacity: 0.52, marginTop: 6}}>laut OpenAIs vorgeschlagenem Übergang</div>
              </div>
              <MetaPill label="MODE" value="CONTINUE" accent="#12B76A" />
            </div>
          </Card>
        </StoryBeat>

        <StoryBeat startFrame={earlyAt} direction="up" role="CONSEQUENCE" style={{position: 'absolute', left: 92, right: 92, top: 700}}>
          <Card style={{padding: 30, border: '1px solid #FEDF89', background: 'rgba(255,247,232,.94)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <AlertTriangle size={48} color={accent} />
              <div>
                <div style={{fontSize: 34, fontWeight: 950}}>CURSOR KÖNNTE FRÜHER STOPPEN</div>
                <div style={{fontSize: 21, opacity: 0.52, marginTop: 6}}>das endgültige Abschaltdatum ist noch nicht bestätigt</div>
              </div>
            </div>
          </Card>
        </StoryBeat>

        <StoryBeat startFrame={cueAt(s04, 0.88)} direction="up" role="PROOF" style={{position: 'absolute', left: 165, right: 165, top: 935, display: 'flex', justifyContent: 'center'}}>
          <MetaPill label="SOURCE STATUS" value="PROPOSED ≠ FINAL" accent={accent} icon={<CircleDot size={20} />} />
        </StoryBeat>
      </div>
    </Shell>
  );
};

const Scene3: React.FC<SceneProps> = ({duration, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s05 = sentenceWindow('scene3', 's05', duration, 0, 0.33);
  const s06 = sentenceWindow('scene3', 's06', duration, 0.33, 0.67);
  const s07 = sentenceWindow('scene3', 's07', duration, 0.67, 1);
  const contractAt = cueAt(s05, 0.12);
  const safetyAt = cueAt(s05, 0.42);
  const scanAt = cueAt(s05, 0.64);
  const astraAt = cueAt(s06, 0.16);
  const lockAt = cueAt(s06, 0.62);
  const finalAt = cueAt(s07, 0.36);
  const sourceAt = cueAt(s07, 0.72);
  const scan = interpolate(frame, [scanAt, scanAt + Math.max(18, at(duration, 0.13))], [0, 1], clamp);
  const astraTravel = interpolate(frame, [astraAt, lockAt], [0, 1], clamp);
  const bounce = spring({frame: frame - lockAt, fps, config: {damping: 9, stiffness: 250, mass: 0.5}});
  const astraX = astraTravel < 1 ? interpolate(astraTravel, [0, 1], [40, 640], clamp) : 640 - Math.min(1, bounce) * 48;

  return (
    <Shell accent={accent} eyebrow="KAPITEL 3 • WARUM?" seed={23}>
      <StoryBeat startFrame={s05.start + 1} role="PROBLEM"><Headline>Vertrag + Sicherheit werden zum Gate.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1160, marginTop: 20}}>
        <StoryBeat startFrame={contractAt} direction="left" role="PROBLEM" style={{position: 'absolute', left: 0, top: 60, width: 430}}>
          <LogoCard label="VERTRAG" sub="Terms & Kontrolle" detail="Zugangsbedingungen" accent={accent} icon={<Braces size={44} />} />
        </StoryBeat>
        <StoryBeat startFrame={safetyAt} direction="right" role="PROBLEM" style={{position: 'absolute', right: 0, top: 60, width: 430}}>
          <LogoCard label="SICHERHEIT" sub="Safety at scale" detail="Anbieter-Risikoprüfung" accent="#12B76A" icon={<ShieldCheck size={44} />} />
        </StoryBeat>

        <StoryBeat startFrame={scanAt} role="PROOF" style={{position: 'absolute', left: 60, right: 60, top: 330, height: 250}}>
          <Card style={{position: 'relative', height: 250, overflow: 'hidden', padding: 30}}>
            <div style={{fontSize: 21, fontWeight: 950, color: accent}}>OPENAIs BEGRÜNDUNG</div>
            <div style={{fontSize: 31, fontWeight: 900, lineHeight: 1.2, marginTop: 15, maxWidth: 760}}>Nach dem Eigentümerwechsel könne man die Einhaltung eigener Bedingungen nicht ausreichend sicherstellen.</div>
            <div style={{position: 'absolute', left: `${scan * 100}%`, top: 0, bottom: 0, width: 3, background: accent, boxShadow: `0 0 24px 5px ${accent}55`}} />
            <div style={{position: 'absolute', right: 24, bottom: 20}}><MetaPill label="CLAIM" value="OPENAI" accent={accent} /></div>
          </Card>
        </StoryBeat>

        <StoryBeat startFrame={astraAt} direction="left" role="CHANGE" style={{position: 'absolute', left: 0, right: 0, top: 640, height: 190}}>
          <div style={{position: 'relative', height: 190}}>
            <div style={{position: 'absolute', left: 20, right: 20, top: 90, height: 8, borderRadius: 99, background: 'rgba(122,90,248,.14)'}} />
            <div style={{position: 'absolute', left: astraX, top: 34, width: 210}}>
              <Card style={{padding: 22, display: 'flex', alignItems: 'center', gap: 13, border: `2px solid ${accent}45`}}>
                <Sparkles size={34} color={accent} /><div><div style={{fontSize: 29, fontWeight: 950}}>ASTRA</div><div style={{fontSize: 17, opacity: 0.48}}>kommendes Modell</div></div>
              </Card>
            </div>
            <StoryBeat startFrame={lockAt} direction="right" role="CONSEQUENCE" style={{position: 'absolute', right: 72, top: 10}}>
              <div style={{width: 150, height: 150, borderRadius: 34, background: '#FFF4F2', border: '2px solid #FDA29B', display: 'grid', placeItems: 'center', color: '#D92D20', boxShadow: '0 18px 44px rgba(217,45,32,.13)'}}>
                <div style={{textAlign: 'center'}}><LockKeyhole size={56} /><div style={{fontSize: 18, fontWeight: 950, marginTop: 8}}>CURSOR</div></div>
              </div>
            </StoryBeat>
          </div>
        </StoryBeat>
        <SparkBurst atFrame={lockAt} accent="#F04438" left={760} top={735} />

        <StoryBeat startFrame={finalAt} direction="up" role="PROOF" style={{position: 'absolute', left: 72, right: 72, top: 875}}>
          <Card style={{padding: 28, display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', background: '#FFF7E8', color: '#F79009'}}><AlertTriangle size={34} /></div>
            <div style={{flex: 1}}><div style={{fontSize: 30, fontWeight: 950}}>FINALER ABSCHALTTERMIN: NICHT BESTÄTIGT</div><div style={{fontSize: 20, opacity: 0.5, marginTop: 5}}>Stand der OpenAI-Mitteilung</div></div>
            <MetaPill label="STATE" value="PENDING" accent="#F79009" />
          </Card>
        </StoryBeat>
        <StoryBeat startFrame={sourceAt} direction="up" role="PROOF" style={{position: 'absolute', left: 120, right: 120, top: 1030}}>
          <SourceProofCard source="openai.com" date="28.08.2026" label="Decision on Cursor after SpaceX acquisition" accent={accent} startFrame={sourceAt} />
        </StoryBeat>
      </div>
    </Shell>
  );
};

const Route: React.FC<{index: string; title: string; sub: string; accent: string; icon: React.ReactNode}> = ({index, title, sub, accent, icon}) => (
  <Card style={{padding: 24, display: 'grid', gridTemplateColumns: '62px 1fr auto', alignItems: 'center', gap: 18}}>
    <div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', background: `${accent}15`, color: accent}}>{icon}</div>
    <div><div style={{fontSize: 30, fontWeight: 950}}>{title}</div><div style={{fontSize: 20, opacity: 0.52, marginTop: 3}}>{sub}</div></div>
    <div style={{display: 'grid', placeItems: 'center', gap: 6}}><CheckCircle2 size={34} color="#12B76A" /><div style={{fontSize: 15, fontWeight: 950, opacity: 0.42}}>{index}</div></div>
  </Card>
);

const Scene4: React.FC<SceneProps> = ({duration, accent}) => {
  const frame = useCurrentFrame();
  const s08 = sentenceWindow('scene4', 's08', duration, 0, 0.24);
  const s09 = sentenceWindow('scene4', 's09', duration, 0.24, 1);
  const cursorAt = cueAt(s08, 0.22);
  const routesIntroAt = cueAt(s09, 0.18);
  const route1At = cueAt(s09, 0.50);
  const route2At = cueAt(s09, 0.68);
  const route3At = cueAt(s09, 0.84);
  const proofAt = cueAt(s09, 0.94);
  const routeProgress = interpolate(frame, [routesIntroAt, route3At + 12], [0, 1], clamp);

  return (
    <Shell accent={accent} eyebrow="KAPITEL 4 • DREI WEGE" seed={31}>
      <StoryBeat startFrame={s08.start + 1} role="CHANGE"><Headline>Cursor bleibt. Der Zugang nimmt Umwege.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1160, marginTop: 18}}>
        <StoryCamera startFrame={cursorAt - 2} endFrame={cursorAt + 32} fromScale={0.92} toScale={1.06}>
          <StoryBeat startFrame={cursorAt} direction="down" role="CHANGE" style={{position: 'absolute', left: 250, right: 250, top: 30}}>
            <Card style={{padding: 26, textAlign: 'center', border: `2px solid ${accent}38`}}>
              <Code2 size={58} color={accent} /><div style={{fontSize: 23, fontWeight: 900, opacity: 0.48, marginTop: 8}}>CURSOR</div><div style={{fontSize: 47, fontWeight: 950, marginTop: 3}}>APP BLEIBT</div>
            </Card>
          </StoryBeat>
        </StoryCamera>

        <StoryBeat startFrame={routesIntroAt} role="CHANGE" style={{position: 'absolute', left: 476, top: 260, width: 10, height: 650}}>
          <div style={{position: 'absolute', left: 2, top: 0, width: 6, height: `${routeProgress * 100}%`, borderRadius: 99, background: `linear-gradient(180deg,${accent},#7A5AF8,#12B76A)`, boxShadow: '0 0 18px rgba(46,144,250,.18)'}} />
        </StoryBeat>
        {[0, 1, 2].map((index) => {
          const top = 360 + index * 225;
          const start = [route1At, route2At, route3At][index];
          const colors = [accent, '#7A5AF8', '#12B76A'];
          return <StoryBeat key={index} startFrame={start} role="CHANGE" style={{position: 'absolute', left: 434, top: top + 43, width: 92}}><div style={{height: 6, borderRadius: 99, background: colors[index]}} /></StoryBeat>;
        })}

        <StoryBeat startFrame={route1At} direction="left" role="CONSEQUENCE" style={{position: 'absolute', left: 0, right: 0, top: 330}}>
          <Route index="1/3" title="Eigener API-Key" sub="OpenAI API direkt verbinden" accent={accent} icon={<KeyRound size={36} />} />
        </StoryBeat>
        <StoryBeat startFrame={route2At} direction="right" role="CONSEQUENCE" style={{position: 'absolute', left: 0, right: 0, top: 555}}>
          <Route index="2/3" title="Codex IDE Extension" sub="Codex direkt in Cursor nutzen" accent="#7A5AF8" icon={<Code2 size={36} />} />
        </StoryBeat>
        <StoryBeat startFrame={route3At} direction="left" role="PAYOFF" style={{position: 'absolute', left: 0, right: 0, top: 780}}>
          <Route index="3/3" title="AI Gateway" sub="kompatiblen Anbieter verbinden" accent="#12B76A" icon={<Network size={36} />} />
        </StoryBeat>

        <StoryBeat startFrame={proofAt} direction="up" role="PROOF" style={{position: 'absolute', left: 120, right: 120, top: 1015}}>
          <SourceProofCard source="help.openai.com" date="30.08.2026" label="Using OpenAI models in Cursor" accent={accent} startFrame={proofAt} />
        </StoryBeat>
      </div>
    </Shell>
  );
};

const Gate: React.FC<{label: string; detail: string; accent: string; icon: React.ReactNode}> = ({label, detail, accent, icon}) => (
  <div style={{height: 225, borderRadius: 32, background: 'rgba(255,255,255,.95)', border: `2px solid ${accent}35`, boxShadow: '0 18px 52px rgba(16,32,51,.10)', display: 'grid', placeItems: 'center', textAlign: 'center', color: '#102033'}}>
    <div><div style={{color: accent, marginBottom: 13, display: 'grid', placeItems: 'center'}}>{icon}</div><div style={{fontSize: 29, fontWeight: 950}}>{label}</div><div style={{fontSize: 17, opacity: 0.45, marginTop: 7, fontWeight: 800}}>{detail}</div></div>
  </div>
);

const Scene5: React.FC<SceneProps> = ({duration, accent}) => {
  const frame = useCurrentFrame();
  const s10 = sentenceWindow('scene5', 's10', duration, 0, 0.45);
  const s11 = sentenceWindow('scene5', 's11', duration, 0.45, 1);
  const modelAt = cueAt(s10, 0.18);
  const notEnoughAt = cueAt(s10, 0.72);
  const contractAt = cueAt(s11, 0.10);
  const safetyAt = cueAt(s11, 0.28);
  const ownerAt = cueAt(s11, 0.48);
  const flowAt = cueAt(s11, 0.67);
  const payoffAt = cueAt(s11, 0.85);
  const pulse = interpolate(frame, [flowAt, Math.max(flowAt + 1, duration - 8)], [0, 1], clamp);

  return (
    <Shell accent={accent} eyebrow="KAPITEL 5 • DER GRÖSSERE PUNKT" seed={41}>
      <StoryBeat startFrame={s10.start + 1} role="PROBLEM"><Headline>Das beste Modell allein reicht nicht.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1160, marginTop: 18}}>
        <StoryCamera startFrame={modelAt - 2} endFrame={notEnoughAt + 24} fromScale={0.95} toScale={1.07} origin="18% 40%">
          <StoryBeat startFrame={modelAt} direction="left" role="PROBLEM" style={{position: 'absolute', left: 0, top: 75, width: 286}}>
            <Gate label="MODELL" detail="Qualität & Leistung" accent="#2E90FA" icon={<Orbit size={50} />} />
          </StoryBeat>
        </StoryCamera>
        <StoryBeat startFrame={notEnoughAt} direction="up" role="CHANGE" style={{position: 'absolute', left: 300, top: 120}}>
          <div style={{fontSize: 25, fontWeight: 950, color: '#667085', display: 'flex', alignItems: 'center', gap: 10}}><Zap size={26} color={accent} /> ALLEIN NICHT GENUG</div>
        </StoryBeat>
        <StoryBeat startFrame={contractAt} direction="up" role="CONSEQUENCE" style={{position: 'absolute', left: 337, top: 75, width: 286}}>
          <Gate label="VERTRAG" detail="Terms & Zugang" accent="#F79009" icon={<Braces size={50} />} />
        </StoryBeat>
        <StoryBeat startFrame={safetyAt} direction="down" role="CONSEQUENCE" style={{position: 'absolute', right: 0, top: 75, width: 286}}>
          <Gate label="SICHERHEIT" detail="Risiko & Kontrolle" accent="#7A5AF8" icon={<ShieldCheck size={50} />} />
        </StoryBeat>
        <StoryBeat startFrame={ownerAt} direction="right" role="CONSEQUENCE" style={{position: 'absolute', left: 337, top: 355, width: 286}}>
          <Gate label="EIGENTÜMER" detail="Ownership change" accent="#F04438" icon={<Rocket size={50} />} />
        </StoryBeat>

        <StoryBeat startFrame={flowAt} role="CHANGE" style={{position: 'absolute', left: 85, right: 85, top: 665}}>
          <Card style={{padding: 30, position: 'relative', overflow: 'hidden'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: 15}}>
              <div style={{textAlign: 'center'}}><Layers3 size={44} color="#2E90FA" /><div style={{fontSize: 22, fontWeight: 950, marginTop: 8}}>MODELL</div></div>
              <ArrowRight size={36} color="#98A2B3" />
              <div style={{textAlign: 'center'}}><ShieldCheck size={44} color="#7A5AF8" /><div style={{fontSize: 22, fontWeight: 950, marginTop: 8}}>ZUGANG</div></div>
              <ArrowRight size={36} color="#98A2B3" />
              <div style={{textAlign: 'center'}}><Code2 size={44} color={accent} /><div style={{fontSize: 22, fontWeight: 950, marginTop: 8}}>DEIN TOOL</div></div>
            </div>
            <div style={{position: 'absolute', left: 32, right: 32, bottom: 16, height: 5, borderRadius: 99, background: 'rgba(18,183,106,.12)'}}>
              <div style={{height: '100%', width: `${pulse * 100}%`, borderRadius: 99, background: accent, boxShadow: `0 0 18px ${accent}66`}} />
            </div>
          </Card>
        </StoryBeat>

        <StoryBeat startFrame={payoffAt} direction="up" role="PAYOFF" style={{position: 'absolute', left: 42, right: 42, top: 940}}>
          <Card style={{padding: 30, textAlign: 'center', border: `2px solid ${accent}35`}}>
            <div style={{display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', fontSize: 20, fontWeight: 950, color: accent}}><Sparkles size={24} /> DER PAYOFF</div>
            <div style={{fontSize: 38, lineHeight: 1.08, fontWeight: 950, marginTop: 12}}>PLATTFORM-BEZIEHUNGEN BESTIMMEN MIT, WELCHE KI DU DIREKT NUTZEN KANNST.</div>
          </Card>
        </StoryBeat>
      </div>
      <StoryCutFlash atFrame={Math.max(0, duration - 10)} accent="#ECFDF3" durationFrames={7} />
    </Shell>
  );
};

const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5];

const splitCaption = (cue: OpenAICursorCue, frame: number) => {
  const words = cue.text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 8) return cue.text;
  const groups: string[][] = [];
  for (let i = 0; i < words.length; i += 6) groups.push(words.slice(i, i + 6));
  const progress = between((frame - cue.startFrame) / Math.max(1, cue.endFrame - cue.startFrame), 0, 0.999999);
  return groups[Math.min(groups.length - 1, Math.floor(progress * groups.length))].join(' ');
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = OPENAI_CURSOR_CUES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  const text = splitCaption(cue, frame);
  return (
    <div style={{...REEL_CAPTION_WRAPPER_STYLE, zIndex: 80}}>
      <div style={{...REEL_CAPTION_GLASS_STYLE, fontFamily: FONT}}>{text}</div>
    </div>
  );
};

export const ReelOpenAICursorSpaceXContract: React.FC<Props> = ({voiceoverSrc, showCaptions = true, showSfx = true}) => (
  <AbsoluteFill style={{background: '#EFF5FA'}}>
    <Html5Audio src={voiceoverSrc} />
    {OPENAI_CURSOR_SCENES.map((scene, index) => {
      const Scene = sceneComponents[index];
      if (!Scene) return null;
      return (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={scene.title}>
          <Scene duration={scene.endFrame - scene.startFrame} accent={scene.accent} />
        </Sequence>
      );
    })}
    <ReelSfxTrack events={OPENAI_CURSOR_SFX} enabled={showSfx} />
    {showCaptions ? <CaptionLayer /> : null}
  </AbsoluteFill>
);
