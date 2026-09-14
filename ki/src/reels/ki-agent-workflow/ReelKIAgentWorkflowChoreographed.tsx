import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  FileText,
  Globe2,
  ListChecks,
  LockKeyhole,
  MousePointer2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react';
import {BRAND} from '../../../brand/brand';
import choreographyPlanJson from '../../../reels/2026-09-14_bis_2026-09-20/01_Montag/01_Wie-ein-KI-Agent-Aufgaben-selbststaendig-erledigt/06-projektdateien/CHOREOGRAPHY-PLAN.json';
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {createChoreographyTiming, type ChoreographyPlan, type ResolvedChoreographyBeat} from '../choreographyTiming';
import {StoryProgressRail, StoryTexture} from '../StoryMotion';
import {
  KI_AGENT_WORKFLOW_CUES,
  KI_AGENT_WORKFLOW_SCENES,
} from './contract';

type Props = {
  voiceoverSrc: string;
  showCaptions?: boolean;
  generatedImageSrc?: string;
  generatedBrollSrc?: string;
};

type SceneProps = {
  sceneId: string;
  duration: number;
  accent: string;
  generatedImageSrc?: string;
  generatedBrollSrc?: string;
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const FONT = BRAND.font;
const choreography = createChoreographyTiming(
  KI_AGENT_WORKFLOW_CUES,
  KI_AGENT_WORKFLOW_SCENES,
  choreographyPlanJson as ChoreographyPlan,
);

const Shell: React.FC<React.PropsWithChildren<{accent: string; eyebrow: string; seed: number}>> = ({accent, eyebrow, seed, children}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: BRAND.ink, background: `linear-gradient(180deg, ${BRAND.bg} 0%, ${BRAND.bgDeep} 100%)`, padding: '86px 68px 350px', overflow: 'hidden'}}>
    <StoryTexture seed={seed} color={BRAND.bg} opacity={0.08}/>
    <div style={{position: 'relative', zIndex: 4, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 900, color: accent, letterSpacing: '.05em'}}>
      <span style={{width: 10, height: 10, borderRadius: 99, background: accent, boxShadow: `0 0 0 6px ${accent}18`}}/>
      {eyebrow}
    </div>
    <div style={{position: 'relative', zIndex: 2, flex: 1}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{background: 'rgba(255,255,255,.94)', border: '1px solid rgba(26,26,46,.08)', boxShadow: '0 24px 70px rgba(65,45,105,.12)', borderRadius: 32, ...style}}>{children}</div>
);

const Headline: React.FC<React.PropsWithChildren<{size?: number}>> = ({children, size = 72}) => (
  <div style={{fontSize: size, lineHeight: 1, fontWeight: 950, letterSpacing: '-.048em', marginTop: 24, maxWidth: 930}}>{children}</div>
);

const TimedBeat: React.FC<React.PropsWithChildren<{
  window: ResolvedChoreographyBeat;
  direction?: 'up' | 'left' | 'right' | 'none';
  style?: React.CSSProperties;
}>> = ({window, direction = 'up', style, children}) => {
  const frame = useCurrentFrame();
  if (frame < window.visualStartFrame || frame >= window.visualEndFrame) return null;
  const enter = interpolate(frame, [window.visualStartFrame, Math.max(window.visualStartFrame + 1, window.enterEndFrame)], [0, 1], clamp);
  const exit = interpolate(frame, [window.exitStartFrame, Math.max(window.exitStartFrame + 1, window.visualEndFrame)], [1, 0], clamp);
  const visibility = Math.max(0, Math.min(1, Math.min(enter, exit)));
  const distance = 28 * (1 - enter) + 14 * (1 - exit);
  const transform = direction === 'left'
    ? `translateX(${-distance}px)`
    : direction === 'right'
      ? `translateX(${distance}px)`
      : direction === 'up'
        ? `translateY(${distance}px)`
        : 'none';
  return <div style={{...style, opacity: visibility, transform, willChange: 'transform, opacity'}}>{children}</div>;
};

const MediaImage: React.FC<{src?: string; duration: number}> = ({src, duration}) => {
  const frame = useCurrentFrame();
  if (!src) return null;
  const scale = interpolate(frame, [0, Math.max(1, duration)], [1.02, 1.10], clamp);
  const y = interpolate(frame, [0, Math.max(1, duration)], [0, -16], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${y}px) scale(${scale})`}}/>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(243,240,250,.78))'}}/>
    </div>
  );
};

const MediaVideo: React.FC<{src?: string}> = ({src}) => src ? (
  <div style={{position: 'absolute', inset: 0, borderRadius: 34, overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,46,.08), rgba(26,26,46,.56))'}}/>
  </div>
) : null;

const Scene1: React.FC<SceneProps> = ({sceneId, accent}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's1-headline');
  const goal = choreography.local(sceneId, 's1-goal');
  const search = choreography.local(sceneId, 's1-search');
  const compare = choreography.local(sceneId, 's1-compare');
  const agent = choreography.local(sceneId, 's1-agent');
  const branch = interpolate(frame, [search.visualStartFrame, Math.max(search.visualStartFrame + 1, compare.visualStartFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="01 • DAS ZIEL" seed={7}>
      <TimedBeat window={headline}><Headline>Du gibst nicht jeden Schritt vor.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 34}}>
        <TimedBeat window={goal} style={{position: 'absolute', left: 70, right: 70, top: 80}}>
          <Card style={{padding: 34}}><div style={{display: 'flex', alignItems: 'center', gap: 16, color: accent, fontSize: 22, fontWeight: 900}}><Target size={34}/> ZIEL</div><div style={{fontSize: 43, lineHeight: 1.08, fontWeight: 950, marginTop: 18}}>3 Lieferanten finden.<br/>Angebote vergleichen.</div></Card>
        </TimedBeat>
        <TimedBeat window={search} direction="left" style={{position: 'absolute', left: 90, top: 410}}><Card style={{padding: '20px 26px', fontSize: 24, fontWeight: 900}}>FINDEN</Card></TimedBeat>
        <TimedBeat window={compare} direction="right" style={{position: 'absolute', right: 90, top: 410}}><Card style={{padding: '20px 26px', fontSize: 24, fontWeight: 900}}>ZUSAMMENFASSEN</Card></TimedBeat>
        <div style={{position: 'absolute', left: 230, right: 230, top: 560, height: 8, borderRadius: 99, background: '#E8E3F2', overflow: 'hidden'}}><div style={{height: '100%', width: `${branch * 100}%`, background: accent, borderRadius: 99}}/></div>
        <TimedBeat window={agent} style={{position: 'absolute', left: 210, right: 210, top: 640}}>
          <Card style={{padding: 34, textAlign: 'center', border: `2px solid ${accent}30`}}><Bot size={70} color={accent}/><div style={{fontSize: 36, fontWeight: 950, marginTop: 12}}>KI-AGENT</div><div style={{fontSize: 23, opacity: .62, marginTop: 8}}>Ziel statt Einzelschritte</div></Card>
        </TimedBeat>
      </div>
    </Shell>
  );
};

const Scene2: React.FC<SceneProps> = ({sceneId, duration, accent, generatedImageSrc}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's2-headline');
  const parts = choreography.local(sceneId, 's2-parts');
  const tool = choreography.local(sceneId, 's2-tool');
  const web = choreography.local(sceneId, 's2-web');
  const files = choreography.local(sceneId, 's2-files');
  const save = choreography.local(sceneId, 's2-save');
  const rows = [
    {window: web, label: 'Web', icon: <Globe2 size={30}/>, color: '#2E90FA'},
    {window: files, label: 'Dateien', icon: <FileText size={30}/>, color: '#F79009'},
    {window: save, label: 'Zwischenergebnisse', icon: <Database size={30}/>, color: '#12B76A'},
  ];
  const progress = interpolate(frame, [parts.visualStartFrame, Math.max(parts.visualStartFrame + 1, save.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="02 • PLAN + TOOLS" seed={10}>
      <TimedBeat window={headline}><Headline size={66}>Der Agent zerlegt das Ziel.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <TimedBeat window={parts} style={{position: 'absolute', inset: '40px 18px 210px'}}>
          <Card style={{position: 'absolute', inset: 0, padding: 28, overflow: 'hidden'}}>
            <MediaImage src={generatedImageSrc} duration={duration}/>
            <div style={{position: 'relative', zIndex: 2}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 950}}><ListChecks size={34} color={accent}/> TEILAUFGABEN</div>
              <div style={{marginTop: 28, display: 'grid', gap: 18}}>{rows.map((row) => (
                <TimedBeat key={row.label} window={row.window} direction="right">
                  <div style={{display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 18, alignItems: 'center', padding: 22, borderRadius: 24, background: 'rgba(255,255,255,.90)', border: '1px solid rgba(26,26,46,.08)'}}>
                    <div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', color: row.color, background: `${row.color}14`}}>{row.icon}</div><div style={{fontSize: 25, fontWeight: 950}}>{row.label}</div><CheckCircle2 size={30} color={row.color}/>
                  </div>
                </TimedBeat>
              ))}</div>
              <div style={{marginTop: 30}}><StoryProgressRail progress={progress} accent={accent} height={12}/></div>
            </div>
          </Card>
        </TimedBeat>
        <TimedBeat window={tool} style={{position: 'absolute', left: 90, right: 90, bottom: 70}}><Card style={{padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 27, fontWeight: 950}}><Wrench color={accent}/> TOOL WÄHLEN → AUSFÜHREN</Card></TimedBeat>
      </div>
    </Shell>
  );
};

const Scene3: React.FC<SceneProps> = ({sceneId, accent, generatedBrollSrc}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's3-headline');
  const retry = choreography.local(sceneId, 's3-retry');
  const next = choreography.local(sceneId, 's3-next');
  const other = choreography.local(sceneId, 's3-other');
  const loop = interpolate(frame, [headline.visualStartFrame, Math.max(headline.visualStartFrame + 1, other.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="03 • DER LOOP" seed={13}>
      <TimedBeat window={headline}><Headline size={66}>Reicht das Ergebnis schon?</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 26}}>
        <Card style={{position: 'absolute', left: 35, right: 35, top: 40, height: 650, padding: 28, overflow: 'hidden', background: generatedBrollSrc ? '#111827' : 'rgba(255,255,255,.94)'}}>
          <MediaVideo src={generatedBrollSrc}/>
          <div style={{position: 'relative', zIndex: 2, height: '100%', display: 'grid', placeItems: 'center'}}><div style={{position: 'relative', width: 520, height: 520, borderRadius: 999, border: '3px solid rgba(185,140,255,.22)', background: generatedBrollSrc ? 'rgba(17,24,39,.38)' : 'rgba(185,140,255,.07)'}}>
            <div style={{position: 'absolute', inset: 64, borderRadius: 999, border: `14px solid ${accent}20`, borderTopColor: accent, transform: `rotate(${loop * 520}deg)`}}/>
            <div style={{position: 'absolute', left: 165, top: 54, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Wrench size={42} color={accent}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>AUSFÜHREN</div></div>
            <div style={{position: 'absolute', right: 54, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Search size={42} color="#2E90FA"/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>PRÜFEN</div></div>
            <div style={{position: 'absolute', left: 190, bottom: 52, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><RefreshCcw size={42} color={frame >= retry.visualStartFrame ? '#F79009' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>RETRY</div></div>
            <div style={{position: 'absolute', left: 55, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><CheckCircle2 size={42} color={frame < retry.visualStartFrame ? '#12B76A' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>FERTIG?</div></div>
          </div></div>
        </Card>
        <TimedBeat window={retry} direction="left" style={{position: 'absolute', left: 80, top: 730}}><Card style={{padding: '18px 28px', fontSize: 25, fontWeight: 950, color: '#F04438'}}>NEIN → neuer Versuch</Card></TimedBeat>
        <TimedBeat window={next} style={{position: 'absolute', left: 350, top: 875}}><RefreshCcw size={62} color={accent}/></TimedBeat>
        <TimedBeat window={other} direction="right" style={{position: 'absolute', right: 80, top: 930}}><Card style={{padding: '18px 28px', fontSize: 25, fontWeight: 950, color: '#F79009'}}>ODER → anderer Weg</Card></TimedBeat>
      </div>
    </Shell>
  );
};

const Scene4: React.FC<SceneProps> = ({sceneId, accent}) => {
  const headline = choreography.local(sceneId, 's4-headline');
  const model = choreography.local(sceneId, 's4-model');
  const rules = choreography.local(sceneId, 's4-rules');
  const tools = choreography.local(sceneId, 's4-tools');
  const permission = choreography.local(sceneId, 's4-permission');
  const limits = choreography.local(sceneId, 's4-limits');
  const gates = [
    {window: model, label: 'MODELL', icon: <Bot size={34}/>, color: BRAND.accentDk},
    {window: rules, label: 'REGELN', icon: <ListChecks size={34}/>, color: '#F79009'},
    {window: tools, label: 'ERLAUBTE TOOLS', icon: <Wrench size={34}/>, color: '#2E90FA'},
  ];
  return (
    <Shell accent={accent} eyebrow="04 • GUARDRAILS" seed={18}>
      <TimedBeat window={headline}><Headline size={64}>Ein Agent denkt nicht wie ein Mensch.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 24}}>
        <Card style={{position: 'absolute', left: 35, right: 35, top: 45, padding: 28}}><div style={{display: 'grid', gap: 18}}>{gates.map((gate) => (
          <TimedBeat key={gate.label} window={gate.window} direction="left"><div style={{display: 'grid', gridTemplateColumns: '70px 1fr auto', alignItems: 'center', gap: 18, padding: 20, borderRadius: 22, background: `${gate.color}0D`}}><div style={{width: 60, height: 60, borderRadius: 20, display: 'grid', placeItems: 'center', color: gate.color, background: 'white'}}>{gate.icon}</div><div style={{fontSize: 27, fontWeight: 950}}>{gate.label}</div><CheckCircle2 color={gate.color} size={30}/></div></TimedBeat>
        ))}</div></Card>
        <TimedBeat window={permission} style={{position: 'absolute', left: 100, right: 100, top: 610}}><Card style={{padding: 30, textAlign: 'center', border: '2px solid rgba(240,68,56,.18)'}}><LockKeyhole size={58} color="#F04438"/><div style={{fontSize: 31, fontWeight: 950, marginTop: 12}}>Berechtigungen begrenzen Aktionen.</div></Card></TimedBeat>
        <TimedBeat window={limits} style={{position: 'absolute', left: 120, right: 120, top: 840}}><Card style={{padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div style={{display: 'flex', gap: 14, alignItems: 'center', fontSize: 26, fontWeight: 950}}><ShieldCheck color={accent}/> Klare Grenzen</div><div style={{width: 100, height: 52, borderRadius: 99, background: '#12B76A', padding: 6, display: 'flex', justifyContent: 'flex-end'}}><div style={{width: 40, height: 40, borderRadius: 99, background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,.12)'}}/></div></Card></TimedBeat>
      </div>
    </Shell>
  );
};

const Scene5: React.FC<SceneProps> = ({sceneId, accent}) => {
  const frame = useCurrentFrame();
  const headline = choreography.local(sceneId, 's5-headline');
  const goal = choreography.local(sceneId, 's5-goal');
  const plan = choreography.local(sceneId, 's5-plan');
  const tool = choreography.local(sceneId, 's5-tool');
  const check = choreography.local(sceneId, 's5-check');
  const loop = choreography.local(sceneId, 's5-loop');
  const action = choreography.local(sceneId, 's5-action');
  const steps = [
    {window: goal, label: 'ZIEL', icon: <Target size={32}/>},
    {window: plan, label: 'PLAN', icon: <ListChecks size={32}/>},
    {window: tool, label: 'TOOL', icon: <Wrench size={32}/>},
    {window: check, label: 'CHECK', icon: <Search size={32}/>},
    {window: loop, label: 'LOOP', icon: <RefreshCcw size={32}/>},
  ];
  const progress = interpolate(frame, [goal.visualStartFrame, Math.max(goal.visualStartFrame + 1, loop.speechEndFrame)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="05 • WORKFLOW" seed={22}>
      <TimedBeat window={headline}><Headline size={66}>So sieht der Ablauf aus.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <Card style={{position: 'absolute', left: 20, right: 20, top: 85, padding: 30}}>
          <div style={{display: 'grid', gap: 20}}>{steps.map((step) => (
            <TimedBeat key={step.label} window={step.window} direction="right"><div style={{display: 'grid', gridTemplateColumns: '64px 1fr auto', alignItems: 'center', gap: 18, padding: 18, borderRadius: 22, background: `${accent}12`}}><div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', color: accent, background: 'white'}}>{step.icon}</div><div style={{fontSize: 28, fontWeight: 950}}>{step.label}</div><CheckCircle2 color={accent}/></div></TimedBeat>
          ))}</div>
          <div style={{marginTop: 30}}><StoryProgressRail progress={progress} accent={accent} height={14}/></div>
        </Card>
        <TimedBeat window={action} style={{position: 'absolute', left: 70, right: 70, bottom: 55}}><Card style={{padding: 28, textAlign: 'center'}}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 29, fontWeight: 950}}><MousePointer2 color={accent}/> CHAT <ArrowRight/> AKTION</div></Card></TimedBeat>
      </div>
    </Shell>
  );
};

const Scene6: React.FC<SceneProps> = ({sceneId, accent}) => {
  const headline = choreography.local(sceneId, 's6-headline');
  const result = choreography.local(sceneId, 's6-result');
  const actions = choreography.local(sceneId, 's6-actions');
  const control = choreography.local(sceneId, 's6-control');
  const protocol = choreography.local(sceneId, 's6-protocol');
  const approval = choreography.local(sceneId, 's6-approval');
  const guards = [
    {window: control, label: 'KONTROLLE', icon: <ShieldCheck/>},
    {window: protocol, label: 'PROTOKOLL', icon: <Database/>},
    {window: approval, label: 'FREIGABE', icon: <LockKeyhole/>},
  ];
  return (
    <Shell accent={accent} eyebrow="06 • ERGEBNIS" seed={27}>
      <TimedBeat window={headline}><Headline size={66}>Nicht nur Antwort. Fertige Arbeit.</Headline></TimedBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 28}}>
        <TimedBeat window={result} style={{position: 'absolute', left: 70, right: 70, top: 55}}>
          <Card style={{padding: 34}}><div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, fontWeight: 900, color: accent}}><FileText/> LIEFERANTENVERGLEICH</div><div style={{fontSize: 44, fontWeight: 950, marginTop: 18}}>Arbeitsergebnis</div><div style={{display: 'grid', gap: 16, marginTop: 30}}>{['3 Anbieter gefunden','Angebote strukturiert','Unterschiede zusammengefasst'].map((label) => <div key={label} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, fontWeight: 850, padding: 18, borderRadius: 20, background: '#F7F5FB'}}><CheckCircle2 color="#12B76A"/> {label}</div>)}</div></Card>
        </TimedBeat>
        <div style={{position: 'absolute', left: 55, right: 55, top: 640, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14}}>{guards.map((guard) => (
          <TimedBeat key={guard.label} window={guard.window}><Card style={{padding: 22, textAlign: 'center', fontSize: 19, fontWeight: 950, color: accent}}><div style={{display: 'grid', placeItems: 'center', marginBottom: 10}}>{guard.icon}</div>{guard.label}</Card></TimedBeat>
        ))}</div>
        <TimedBeat window={actions} style={{position: 'absolute', left: 0, right: 0, top: 900}}><div style={{textAlign: 'center'}}><div style={{fontSize: 86, lineHeight: 1, fontWeight: 950, color: accent}}>KI + AKTION</div><div style={{fontSize: 22, fontWeight: 850, marginTop: 12}}>das macht Agenten spannend</div></div></TimedBeat>
        <TimedBeat window={approval} style={{position: 'absolute', left: 180, right: 180, top: 1030}}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 20, fontWeight: 900, color: accent}}><Sparkles size={24}/> Autonomie braucht Grenzen.</div></TimedBeat>
      </div>
    </Shell>
  );
};

const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = KI_AGENT_WORKFLOW_CUES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  return <div style={{...REEL_CAPTION_WRAPPER_STYLE, zIndex: 80}}><div style={{...REEL_CAPTION_GLASS_STYLE, fontFamily: FONT}}>{cue.text}</div></div>;
};

export const ReelKIAgentWorkflowChoreographed: React.FC<Props> = ({voiceoverSrc, showCaptions = true, generatedImageSrc, generatedBrollSrc}) => (
  <AbsoluteFill style={{background: BRAND.bgDeep}}>
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc}/> : null}
    {KI_AGENT_WORKFLOW_SCENES.map((scene, index) => {
      const Scene = sceneComponents[index];
      if (!Scene) return null;
      return (
        <Sequence key={scene.sceneId} from={scene.startFrame} durationInFrames={scene.endFrame - scene.startFrame} name={scene.title}>
          <Scene sceneId={scene.sceneId} duration={scene.endFrame - scene.startFrame} accent={scene.accent} generatedImageSrc={generatedImageSrc} generatedBrollSrc={generatedBrollSrc}/>
        </Sequence>
      );
    })}
    {showCaptions ? <CaptionLayer/> : null}
  </AbsoluteFill>
);
