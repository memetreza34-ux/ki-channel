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
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleX,
  GitBranch,
  RefreshCw,
} from 'lucide-react';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {O3_SUNSET_CUES, O3_SUNSET_SCENES} from './contract';

type Props = {
  voiceoverSrc: string;
  showCaptions?: boolean;
};

const FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const Shell: React.FC<React.PropsWithChildren<{accent: string; eyebrow: string}>> = ({accent, eyebrow, children}) => (
  <AbsoluteFill
    style={{
      fontFamily: FONT,
      color: '#102033',
      background: 'linear-gradient(180deg,#F8FBFF 0%,#EEF4FA 100%)',
      padding: '112px 82px 0',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        alignSelf: 'flex-start',
        padding: '12px 18px',
        borderRadius: 999,
        background: 'rgba(255,255,255,.78)',
        border: '1px solid rgba(16,32,51,.08)',
        boxShadow: '0 10px 30px rgba(16,32,51,.08)',
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: '.04em',
        color: accent,
      }}
    >
      {eyebrow}
    </div>
    {children}
  </AbsoluteFill>
);

const BigTitle: React.FC<{children: React.ReactNode; maxWidth?: number}> = ({children, maxWidth = 880}) => (
  <div style={{fontSize: 78, lineHeight: 1.02, fontWeight: 900, letterSpacing: '-.045em', maxWidth, marginTop: 54}}>
    {children}
  </div>
);

const GlassCard: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(255,255,255,.82)',
      border: '1px solid rgba(16,32,51,.08)',
      boxShadow: '0 26px 80px rgba(20,42,70,.12)',
      borderRadius: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

const Scene1: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tile = spring({frame, fps, config: {damping: 18, stiffness: 160}});
  const stamp = spring({frame: frame - 36, fps, config: {damping: 14, stiffness: 180}});
  const dateOpacity = interpolate(frame, [18, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell accent={accent} eyebrow="OPENAI • HEUTE">
      <BigTitle>o3 verschwindet heute aus ChatGPT.</BigTitle>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 105}}>
        <GlassCard
          style={{
            width: 760,
            height: 520,
            padding: 44,
            transform: `scale(${0.88 + tile * 0.12}) translateY(${(1 - tile) * 26}px)`,
            position: 'relative',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontSize: 34, fontWeight: 800}}>Modellauswahl</div>
            <div style={{fontSize: 22, opacity: .55}}>ChatGPT</div>
          </div>
          <div style={{marginTop: 66, display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{width: 92, height: 92, borderRadius: 28, background: '#111827', color: 'white', display: 'grid', placeItems: 'center', fontSize: 42, fontWeight: 900}}>o3</div>
            <div>
              <div style={{fontSize: 52, fontWeight: 900}}>OpenAI o3</div>
              <div style={{fontSize: 27, marginTop: 8, opacity: .58}}>Reasoning-Modell</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 44, bottom: 46, fontSize: 29, fontWeight: 850, opacity: dateOpacity}}>26. AUGUST 2026</div>
          <div
            style={{
              position: 'absolute',
              right: 38,
              bottom: 40,
              border: `7px solid ${accent}`,
              color: accent,
              borderRadius: 20,
              padding: '13px 20px',
              fontSize: 35,
              fontWeight: 950,
              letterSpacing: '.04em',
              transform: `rotate(-7deg) scale(${stamp})`,
              opacity: stamp,
            }}
          >
            HEUTE ENDE
          </div>
        </GlassCard>
      </div>
    </Shell>
  );
};

const Scene2: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [20, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const endPop = interpolate(frame, [70, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell accent={accent} eyebrow="WAR ANGEKÜNDIGT">
      <BigTitle>90 Tage Auslaufphase.</BigTitle>
      <GlassCard style={{marginTop: 120, padding: '54px 44px 60px', height: 470, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 850}}>
          <div>28. MAI</div>
          <div style={{color: accent, opacity: endPop}}>26. AUGUST</div>
        </div>
        <div style={{position: 'relative', height: 24, borderRadius: 999, background: '#E3EAF2', marginTop: 90, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${width * 100}%`, background: accent, borderRadius: 999}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34}}>
          <div style={{fontSize: 24, opacity: .58}}>Ankündigung</div>
          <div style={{fontSize: 24, opacity: .58}}>Entfernung aus ChatGPT</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 50, textAlign: 'center', fontSize: 62, fontWeight: 950, color: accent, opacity: endPop}}>90 TAGE</div>
      </GlassCard>
    </Shell>
  );
};

const Scene3: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [36, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const badge = spring({frame: frame - 80, fps: 30, config: {damping: 16, stiffness: 160}});
  return (
    <Shell accent={accent} eyebrow="WAS ÄNDERT SICH?">
      <BigTitle>Betroffen ist nur ChatGPT.</BigTitle>
      <GlassCard style={{marginTop: 92, padding: 38, height: 650, position: 'relative', overflow: 'hidden'}}>
        <div style={{fontSize: 29, fontWeight: 850, marginBottom: 30}}>Modellauswahl</div>
        <div style={{display: 'grid', gap: 18}}>
          <div
            style={{
              height: 130,
              borderRadius: 26,
              background: '#F2F5F9',
              display: 'flex',
              alignItems: 'center',
              padding: '0 28px',
              gap: 20,
              transform: `translateX(${-slide * 760}px)`,
              opacity: 1 - slide * .85,
            }}
          >
            <div style={{width: 66, height: 66, borderRadius: 20, background: '#111827', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 29}}>o3</div>
            <div style={{fontSize: 34, fontWeight: 850}}>OpenAI o3</div>
            <CircleX size={38} style={{marginLeft: 'auto'}} />
          </div>
          <div
            style={{
              height: 130,
              borderRadius: 26,
              background: 'white',
              border: '2px solid rgba(109,93,251,.22)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 28px',
              gap: 20,
              transform: `translateY(${(1 - slide) * 80}px)`,
              opacity: slide,
            }}
          >
            <RefreshCw size={46} color={accent} />
            <div>
              <div style={{fontSize: 34, fontWeight: 850}}>Aktuelles Modell</div>
              <div style={{fontSize: 22, opacity: .56, marginTop: 5}}>weiter in ChatGPT nutzen</div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 38,
            right: 38,
            bottom: 42,
            textAlign: 'center',
            fontSize: 47,
            fontWeight: 950,
            color: accent,
            transform: `scale(${badge})`,
            opacity: badge,
          }}
        >
          NUR CHATGPT
        </div>
      </GlassCard>
    </Shell>
  );
};

const Scene4: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const close = spring({frame: frame - 28, fps: 30, config: {damping: 17, stiffness: 150}});
  const api = spring({frame: frame - 62, fps: 30, config: {damping: 16, stiffness: 170}});
  return (
    <Shell accent={accent} eyebrow="WICHTIGE AUSNAHME">
      <BigTitle>Die API bleibt unverändert.</BigTitle>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 110}}>
        <GlassCard style={{height: 520, padding: 34, position: 'relative'}}>
          <div style={{fontSize: 31, fontWeight: 900}}>ChatGPT</div>
          <div style={{height: 180, display: 'grid', placeItems: 'center'}}>
            <CircleX size={122} strokeWidth={2.3} color="#E24A57" style={{transform: `scale(${close})`, opacity: close}} />
          </div>
          <div style={{fontSize: 28, fontWeight: 850, textAlign: 'center'}}>o3 wird entfernt</div>
        </GlassCard>
        <GlassCard style={{height: 520, padding: 34, position: 'relative'}}>
          <div style={{fontSize: 31, fontWeight: 900}}>API</div>
          <div style={{height: 180, display: 'grid', placeItems: 'center'}}>
            <CheckCircle2 size={122} strokeWidth={2.3} color={accent} style={{transform: `scale(${api})`, opacity: api}} />
          </div>
          <div style={{fontSize: 28, fontWeight: 850, textAlign: 'center'}}>von dieser Änderung nicht betroffen</div>
        </GlassCard>
      </div>
      <div style={{marginTop: 44, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 31, fontWeight: 900, color: accent}}>
        ChatGPT <ArrowRight size={34} /> API bleibt
      </div>
    </Shell>
  );
};

const Scene5: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const rows = [0, 1, 2].map((index) => spring({frame: frame - 18 - index * 22, fps: 30, config: {damping: 17, stiffness: 150}}));
  return (
    <Shell accent={accent} eyebrow="JETZT PRÜFEN">
      <BigTitle>Teste deine o3-Workflows heute einmal neu.</BigTitle>
      <GlassCard style={{marginTop: 82, padding: 36, height: 650}}>
        <div style={{display: 'grid', gap: 20}}>
          {['Prompts', 'Automationen', 'Workflows'].map((label, index) => (
            <div
              key={label}
              style={{
                height: 128,
                borderRadius: 28,
                background: '#F5F8FC',
                display: 'flex',
                alignItems: 'center',
                padding: '0 28px',
                transform: `translateY(${(1 - rows[index]) * 35}px)`,
                opacity: rows[index],
              }}
            >
              <GitBranch size={40} color={accent} />
              <div style={{fontSize: 32, fontWeight: 850, marginLeft: 20}}>{label}</div>
              <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{fontSize: 24, fontWeight: 850, opacity: .48, textDecoration: 'line-through'}}>o3</div>
                <ArrowRight size={28} />
                <div style={{fontSize: 24, fontWeight: 900, color: accent}}>aktuelles Modell</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 52, fontSize: 49, fontWeight: 950, color: accent}}>
          <CalendarDays size={52} /> HEUTE TESTEN
        </div>
      </GlassCard>
    </Shell>
  );
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = O3_SUNSET_CUES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  return (
    <div style={REEL_CAPTION_WRAPPER_STYLE}>
      <div style={{...REEL_CAPTION_GLASS_STYLE, fontFamily: FONT, fontSize: 48, lineHeight: 1.12, fontWeight: 850, letterSpacing: '-.025em', color: '#102033'}}>
        {cue.text}
      </div>
    </div>
  );
};

export const ReelO3ChatGPTSunset: React.FC<Props> = ({voiceoverSrc, showCaptions = true}) => {
  if (!voiceoverSrc?.trim()) {
    throw new Error('KI-O3ChatGPTSunset requires a verified local voiceoverSrc. Production renders may not run silently.');
  }
  const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5];
  return (
    <AbsoluteFill style={{background: '#F8FBFF'}}>
      <Html5Audio src={voiceoverSrc} />
      {O3_SUNSET_SCENES.map((scene, index) => {
        const Component = sceneComponents[index];
        return (
          <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame}>
            <Component accent={scene.accent} />
          </Sequence>
        );
      })}
      {showCaptions ? <CaptionLayer /> : null}
    </AbsoluteFill>
  );
};
