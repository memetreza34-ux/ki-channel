import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
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
import {REEL_CAPTION_GLASS_STYLE, REEL_CAPTION_WRAPPER_STYLE} from '../captionSafe';
import {ImpactNumber, StoryBeat, StoryCamera, StoryProgressRail, StoryTexture} from '../StoryMotion';
import {createVoiceTiming} from '../voiceTiming';
import {
  KI_AGENT_WORKFLOW_CUES,
  KI_AGENT_WORKFLOW_SCENES,
  type KIAgentWorkflowCue,
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
const voice = createVoiceTiming(KI_AGENT_WORKFLOW_CUES, KI_AGENT_WORKFLOW_SCENES);

const Shell: React.FC<React.PropsWithChildren<{accent: string; eyebrow: string; seed: number}>> = ({accent, eyebrow, seed, children}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: BRAND.ink, background: `linear-gradient(180deg, ${BRAND.bg} 0%, ${BRAND.bgDeep} 100%)`, padding: '86px 68px 350px', overflow: 'hidden'}}>
    <StoryTexture seed={seed} color={BRAND.bg} opacity={0.08} />
    <div style={{position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 900, color: accent, letterSpacing: '.05em'}}>
      <span style={{width: 10, height: 10, borderRadius: 99, background: accent, boxShadow: `0 0 0 6px ${accent}18`}} />
      {eyebrow}
    </div>
    <div style={{position: 'relative', zIndex: 2, flex: 1}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{background: 'rgba(255,255,255,.94)', border: '1px solid rgba(26,26,46,.08)', boxShadow: '0 24px 70px rgba(65,45,105,.12)', borderRadius: 32, ...style}}>{children}</div>
);

const Headline: React.FC<React.PropsWithChildren<{size?: number}>> = ({children, size = 72}) => (
  <div style={{fontSize: size, lineHeight: 1.0, fontWeight: 950, letterSpacing: '-.048em', marginTop: 24, maxWidth: 930}}>{children}</div>
);

const MediaImage: React.FC<{src?: string; duration: number}> = ({src, duration}) => {
  const frame = useCurrentFrame();
  if (!src) return null;
  const scale = interpolate(frame, [0, Math.max(1, duration)], [1.02, 1.10], clamp);
  const y = interpolate(frame, [0, Math.max(1, duration)], [0, -16], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${y}px) scale(${scale})`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(243,240,250,.78))'}} />
    </div>
  );
};

const MediaVideo: React.FC<{src?: string}> = ({src}) => {
  if (!src) return null;
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: 34, overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,46,.08), rgba(26,26,46,.56))'}} />
    </div>
  );
};

const Scene1: React.FC<SceneProps> = ({sceneId, duration, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const goalAt = voice.phraseFrame(sceneId, 's01', 'nur das Ziel', 0.24);
  const searchAt = voice.phraseFrame(sceneId, 's01', 'Finde drei passende Lieferanten', 0.52);
  const compareAt = voice.phraseFrame(sceneId, 's01', 'Angebote zusammen', 0.72);
  const agentAt = voice.sentenceWindow(sceneId, 's02', 0.80, 0.98).start;
  const core = spring({frame: frame - goalAt, fps, config: {damping: 15, stiffness: 180, mass: 0.72}});
  const branch = interpolate(frame, [searchAt, Math.max(searchAt + 1, agentAt)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="01 • DAS ZIEL" seed={7}>
      <StoryBeat startFrame={Math.max(0, goalAt - 10)} role="HOOK"><Headline>Du gibst nicht jeden Schritt vor.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 34}}>
        <StoryCamera startFrame={0} endFrame={duration} fromScale={0.98} toScale={1.04} fromY={10} toY={-12}>
          <Card style={{position: 'absolute', left: 70, right: 70, top: 80, padding: 34, transform: `scale(${0.92 + 0.08 * core})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, color: accent, fontSize: 22, fontWeight: 900}}><Target size={34} /> ZIEL</div>
            <div style={{fontSize: 43, lineHeight: 1.08, fontWeight: 950, marginTop: 18}}>3 Lieferanten finden.<br/>Angebote vergleichen.</div>
          </Card>
        </StoryCamera>
        <StoryBeat startFrame={searchAt} direction="left" role="CHANGE" style={{position: 'absolute', left: 86, top: 400}}><Card style={{padding: '18px 22px', fontSize: 22, fontWeight: 850}}>1. suchen</Card></StoryBeat>
        <StoryBeat startFrame={Math.min(duration - 1, searchAt + 10)} role="CHANGE" style={{position: 'absolute', left: 390, top: 400}}><Card style={{padding: '18px 22px', fontSize: 22, fontWeight: 850}}>2. lesen</Card></StoryBeat>
        <StoryBeat startFrame={compareAt} direction="right" role="CHANGE" style={{position: 'absolute', right: 86, top: 400}}><Card style={{padding: '18px 22px', fontSize: 22, fontWeight: 850}}>3. vergleichen</Card></StoryBeat>
        <div style={{position: 'absolute', left: 230, right: 230, top: 548, height: 8, borderRadius: 99, background: '#E8E3F2', overflow: 'hidden'}}><div style={{height: '100%', width: `${branch * 100}%`, background: accent, borderRadius: 99}} /></div>
        <StoryBeat startFrame={agentAt} role="PROOF" style={{position: 'absolute', left: 210, right: 210, top: 610}}>
          <Card style={{padding: 34, textAlign: 'center', border: `2px solid ${accent}30`}}><Bot size={70} color={accent} /><div style={{fontSize: 36, fontWeight: 950, marginTop: 12}}>KI-AGENT</div><div style={{fontSize: 23, opacity: 0.62, marginTop: 8}}>Ziel statt Einzelschritte</div></Card>
        </StoryBeat>
        <StoryBeat startFrame={Math.min(duration - 1, agentAt + 8)} role="PAYOFF" style={{position: 'absolute', left: 0, right: 0, top: 900}}><ImpactNumber value="ZIEL" label="statt Schritt-für-Schritt" accent={accent} startFrame={Math.min(duration - 1, agentAt + 8)} size={104} /></StoryBeat>
      </div>
    </Shell>
  );
};

const Scene2: React.FC<SceneProps> = ({sceneId, duration, accent, generatedImageSrc}) => {
  const frame = useCurrentFrame();
  const partsAt = voice.phraseFrame(sceneId, 's03', 'Teilaufgaben', 0.10);
  const toolAt = voice.phraseFrame(sceneId, 's03', 'welches Werkzeug', 0.30);
  const webAt = voice.phraseFrame(sceneId, 's03', 'Webseiten', 0.52);
  const filesAt = voice.phraseFrame(sceneId, 's03', 'Dateien', 0.66);
  const saveAt = voice.phraseFrame(sceneId, 's03', 'Zwischenergebnisse', 0.84);
  const anchors = [webAt, filesAt, saveAt];
  const progress = interpolate(frame, [partsAt, Math.max(partsAt + 1, saveAt + 12)], [0, 1], clamp);
  const tools = [
    {label: 'Web', icon: <Globe2 size={30} />, color: '#2E90FA'},
    {label: 'Dateien', icon: <FileText size={30} />, color: '#F79009'},
    {label: 'Notizen', icon: <Database size={30} />, color: '#12B76A'},
  ];
  return (
    <Shell accent={accent} eyebrow="02 • PLAN + TOOLS" seed={10}>
      <StoryBeat startFrame={Math.max(0, partsAt - 8)} role="PROOF"><Headline size={66}>Der Agent zerlegt das Ziel.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <Card style={{position: 'absolute', inset: '40px 18px 210px', padding: 28, overflow: 'hidden'}}>
          <MediaImage src={generatedImageSrc} duration={duration} />
          <div style={{position: 'relative', zIndex: 2}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 950}}><ListChecks size={34} color={accent} /> TEILAUFGABEN</div>
            <div style={{marginTop: 28, display: 'grid', gap: 18}}>
              {tools.map((tool, index) => (
                <StoryBeat key={tool.label} startFrame={anchors[index]} direction="right" role="PROOF">
                  <div style={{display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 18, alignItems: 'center', padding: 22, borderRadius: 24, background: 'rgba(255,255,255,.90)', border: '1px solid rgba(26,26,46,.08)'}}>
                    <div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', color: tool.color, background: `${tool.color}14`}}>{tool.icon}</div>
                    <div><div style={{fontSize: 26, fontWeight: 950}}>{tool.label}</div><div style={{fontSize: 19, opacity: .55, marginTop: 4}}>passendes Werkzeug wählen</div></div>
                    <CheckCircle2 size={30} color={frame >= anchors[index] ? '#12B76A' : '#D0D5DD'} />
                  </div>
                </StoryBeat>
              ))}
            </div>
            <div style={{marginTop: 30}}><StoryProgressRail progress={progress} accent={accent} height={12} /></div>
          </div>
        </Card>
        <StoryBeat startFrame={toolAt} role="CHANGE" style={{position: 'absolute', left: 90, right: 90, bottom: 70}}><Card style={{padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 27, fontWeight: 950}}><Wrench color={accent} /> TOOL AUSWÄHLEN → AUSFÜHREN</Card></StoryBeat>
      </div>
    </Shell>
  );
};

const Scene3: React.FC<SceneProps> = ({sceneId, duration, accent, generatedBrollSrc}) => {
  const frame = useCurrentFrame();
  const checkAt = voice.sentenceWindow(sceneId, 's04', 0.03, 0.38).start;
  const retryAt = voice.phraseFrame(sceneId, 's05', 'Wenn nicht', 0.43);
  const nextAt = voice.phraseFrame(sceneId, 's05', 'nächsten Schritt', 0.64);
  const otherAt = voice.phraseFrame(sceneId, 's05', 'anderen Weg', 0.84);
  const loop = interpolate(frame, [checkAt, Math.max(checkAt + 1, otherAt + 10)], [0, 1], clamp);
  const retry = frame >= retryAt;
  return (
    <Shell accent={accent} eyebrow="03 • DER LOOP" seed={13}>
      <StoryBeat startFrame={checkAt} role="PROBLEM"><Headline size={66}>Reicht das Ergebnis schon?</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 26}}>
        <Card style={{position: 'absolute', left: 35, right: 35, top: 40, height: 650, padding: 28, overflow: 'hidden', background: generatedBrollSrc ? '#111827' : 'rgba(255,255,255,.94)'}}>
          <MediaVideo src={generatedBrollSrc} />
          <div style={{position: 'relative', zIndex: 2, height: '100%', display: 'grid', placeItems: 'center'}}>
            <div style={{position: 'relative', width: 520, height: 520, borderRadius: 999, border: '3px solid rgba(185,140,255,.22)', background: generatedBrollSrc ? 'rgba(17,24,39,.38)' : 'rgba(185,140,255,.07)'}}>
              <div style={{position: 'absolute', inset: 64, borderRadius: 999, border: `14px solid ${accent}20`, borderTopColor: accent, transform: `rotate(${loop * 520}deg)`}} />
              <div style={{position: 'absolute', left: 165, top: 54, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Wrench size={42} color={accent}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>AUSFÜHREN</div></div>
              <div style={{position: 'absolute', right: 54, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><Search size={42} color="#2E90FA"/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>PRÜFEN</div></div>
              <div style={{position: 'absolute', left: 190, bottom: 52, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><RefreshCcw size={42} color={retry ? '#F79009' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>RETRY</div></div>
              <div style={{position: 'absolute', left: 55, top: 220, textAlign: 'center', color: generatedBrollSrc ? 'white' : BRAND.ink}}><CheckCircle2 size={42} color={frame < retryAt ? '#12B76A' : '#98A2B3'}/><div style={{fontSize: 20, fontWeight: 950, marginTop: 6}}>FERTIG?</div></div>
            </div>
          </div>
        </Card>
        <StoryBeat startFrame={retryAt} direction="left" role="CHANGE" style={{position: 'absolute', left: 80, top: 730}}><Card style={{padding: '18px 28px', fontSize: 25, fontWeight: 950, color: '#F04438'}}>NEIN → nächster Schritt</Card></StoryBeat>
        <StoryBeat startFrame={otherAt} direction="right" role="PAYOFF" style={{position: 'absolute', right: 80, top: 830}}><Card style={{padding: '18px 28px', fontSize: 25, fontWeight: 950, color: '#F79009'}}>ODER → anderer Weg</Card></StoryBeat>
        <StoryBeat startFrame={nextAt} role="CHANGE" style={{position: 'absolute', left: 320, top: 935}}><RefreshCcw size={58} color={accent}/></StoryBeat>
      </div>
    </Shell>
  );
};

const Scene4: React.FC<SceneProps> = ({sceneId, duration, accent}) => {
  const frame = useCurrentFrame();
  const humanAt = voice.sentenceWindow(sceneId, 's06', 0.03, 0.30).start;
  const modelAt = voice.phraseFrame(sceneId, 's07', 'Modell', 0.34);
  const rulesAt = voice.phraseFrame(sceneId, 's07', 'Regeln', 0.47);
  const toolsAt = voice.phraseFrame(sceneId, 's07', 'Tools', 0.60);
  const permissionAt = voice.phraseFrame(sceneId, 's08', 'Berechtigungen', 0.76);
  const limitsAt = voice.phraseFrame(sceneId, 's08', 'Grenzen', 0.90);
  const permission = frame >= permissionAt;
  const gates = [
    {label: 'MODELL', icon: <Bot size={34}/>, color: BRAND.accentDk, at: modelAt},
    {label: 'REGELN', icon: <ListChecks size={34}/>, color: '#F79009', at: rulesAt},
    {label: 'ERLAUBTE TOOLS', icon: <Wrench size={34}/>, color: '#2E90FA', at: toolsAt},
  ];
  return (
    <Shell accent={accent} eyebrow="04 • GUARDRAILS" seed={18}>
      <StoryBeat startFrame={humanAt} role="CONSEQUENCE"><Headline size={64}>Ein Agent denkt nicht wie ein Mensch.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 24}}>
        <StoryBeat startFrame={modelAt} role="PROOF" style={{position: 'absolute', left: 35, right: 35, top: 45}}>
          <Card style={{padding: 28}}><div style={{display: 'grid', gap: 18}}>{gates.map((gate) => (
            <StoryBeat key={gate.label} startFrame={gate.at} direction="left" role="PROOF"><div style={{display: 'grid', gridTemplateColumns: '70px 1fr auto', alignItems: 'center', gap: 18, padding: 20, borderRadius: 22, background: `${gate.color}0D`}}><div style={{width: 60, height: 60, borderRadius: 20, display: 'grid', placeItems: 'center', color: gate.color, background: 'white'}}>{gate.icon}</div><div style={{fontSize: 27, fontWeight: 950}}>{gate.label}</div><CheckCircle2 color={gate.color} size={30}/></div></StoryBeat>
          ))}</div></Card>
        </StoryBeat>
        <StoryBeat startFrame={toolsAt} role="CONSEQUENCE" style={{position: 'absolute', left: 100, right: 100, top: 540}}><Card style={{padding: 30, textAlign: 'center', border: '2px solid rgba(240,68,56,.18)'}}><LockKeyhole size={58} color="#F04438" /><div style={{fontSize: 31, fontWeight: 950, marginTop: 12}}>Tool nicht erlaubt → STOP</div></Card></StoryBeat>
        <StoryBeat startFrame={permissionAt} role="CHANGE" style={{position: 'absolute', left: 120, right: 120, top: 800}}><Card style={{padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><div style={{display: 'flex', gap: 14, alignItems: 'center', fontSize: 26, fontWeight: 950}}><ShieldCheck color={accent}/> Menschliche Freigabe</div><div style={{width: 100, height: 52, borderRadius: 99, background: permission ? '#12B76A' : '#D0D5DD', padding: 6, display: 'flex', justifyContent: permission ? 'flex-end' : 'flex-start'}}><div style={{width: 40, height: 40, borderRadius: 99, background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,.12)'}} /></div></Card></StoryBeat>
        <StoryBeat startFrame={limitsAt} role="PAYOFF" style={{position: 'absolute', left: 250, right: 250, top: 1010}}><div style={{textAlign: 'center', fontSize: 25, fontWeight: 950, color: accent}}>KLARE GRENZEN</div></StoryBeat>
      </div>
    </Shell>
  );
};

const Scene5: React.FC<SceneProps> = ({sceneId, duration, accent}) => {
  const frame = useCurrentFrame();
  const anchors = [
    voice.phraseFrame(sceneId, 's09', 'Ziel verstehen', 0.16),
    voice.phraseFrame(sceneId, 's09', 'planen', 0.29),
    voice.phraseFrame(sceneId, 's09', 'Tool ausführen', 0.43),
    voice.phraseFrame(sceneId, 's09', 'Ergebnis prüfen', 0.58),
    voice.phraseFrame(sceneId, 's09', 'wiederholen', 0.72),
  ];
  const actionAt = voice.phraseFrame(sceneId, 's10', 'Handeln', 0.90);
  const steps = [
    {label:'ZIEL', icon:<Target size={32}/>},
    {label:'PLAN', icon:<ListChecks size={32}/>},
    {label:'TOOL', icon:<Wrench size={32}/>},
    {label:'CHECK', icon:<Search size={32}/>},
    {label:'LOOP', icon:<RefreshCcw size={32}/>},
  ];
  const progress = interpolate(frame, [anchors[0], Math.max(anchors[0] + 1, actionAt)], [0, 1], clamp);
  return (
    <Shell accent={accent} eyebrow="05 • WORKFLOW" seed={22}>
      <StoryBeat startFrame={Math.max(0, anchors[0] - 8)} role="PROOF"><Headline size={66}>So sieht der Ablauf aus.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 30}}>
        <StoryCamera startFrame={0} endFrame={duration} fromScale={0.98} toScale={1.04} origin="50% 45%">
          <Card style={{position: 'absolute', left: 20, right: 20, top: 85, padding: 30}}>
            <div style={{display: 'grid', gap: 20}}>{steps.map((step, index) => {
              const active = frame >= anchors[index];
              return <StoryBeat key={step.label} startFrame={anchors[index]} direction="right" role={index === steps.length - 1 ? 'CHANGE' : 'PROOF'}><div style={{display: 'grid', gridTemplateColumns: '64px 1fr auto', alignItems: 'center', gap: 18, padding: 18, borderRadius: 22, background: active ? `${accent}12` : '#F7F7FA'}}><div style={{width: 58, height: 58, borderRadius: 20, display: 'grid', placeItems: 'center', color: active ? accent : '#98A2B3', background: 'white'}}>{step.icon}</div><div style={{fontSize: 28, fontWeight: 950}}>{step.label}</div>{active ? <CheckCircle2 color={accent} /> : <ArrowRight color="#C7C9D1" />}</div></StoryBeat>;
            })}</div>
            <div style={{marginTop: 30}}><StoryProgressRail progress={progress} accent={accent} height={14}/></div>
          </Card>
        </StoryCamera>
        <StoryBeat startFrame={actionAt} role="PAYOFF" style={{position: 'absolute', left: 70, right: 70, bottom: 55}}><Card style={{padding: 28, textAlign: 'center'}}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 29, fontWeight: 950}}><MousePointer2 color={accent}/> CHAT <ArrowRight/> AKTION</div></Card></StoryBeat>
      </div>
    </Shell>
  );
};

const Scene6: React.FC<SceneProps> = ({sceneId, duration, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const resultAt = voice.sentenceWindow(sceneId, 's11', 0.03, 0.36).start;
  const actionAt = voice.phraseFrame(sceneId, 's12', 'echten Aktionen', 0.48);
  const controlAt = voice.phraseFrame(sceneId, 's13', 'Kontrolle', 0.72);
  const protocolAt = voice.phraseFrame(sceneId, 's13', 'Protokolle', 0.82);
  const approvalAt = voice.phraseFrame(sceneId, 's13', 'Freigaben', 0.91);
  const settle = spring({frame: frame - resultAt, fps, config: {damping: 16, stiffness: 150, mass: .8}});
  const resultItems = [resultAt + 20, resultAt + 34, resultAt + 48].map((value) => Math.min(duration - 1, value));
  return (
    <Shell accent={accent} eyebrow="06 • ERGEBNIS" seed={27}>
      <StoryBeat startFrame={resultAt} role="PAYOFF"><Headline size={66}>Nicht nur Antwort. Fertige Arbeit.</Headline></StoryBeat>
      <div style={{position: 'relative', height: 1120, marginTop: 28}}>
        <StoryCamera startFrame={0} endFrame={duration} fromScale={0.96} toScale={1.05} fromY={14} toY={-12}>
          <Card style={{position: 'absolute', left: 70, right: 70, top: 55, padding: 34, transform: `scale(${0.92 + settle * .08})`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 23, fontWeight: 900, color: accent}}><FileText/> LIEFERANTENVERGLEICH</div>
            <div style={{fontSize: 44, fontWeight: 950, marginTop: 18}}>Arbeitsergebnis</div>
            <div style={{display: 'grid', gap: 16, marginTop: 30}}>{['3 Anbieter gefunden','Angebote strukturiert','Unterschiede zusammengefasst'].map((label, index) => <StoryBeat key={label} startFrame={resultItems[index]} direction="right" role="PAYOFF"><div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, fontWeight: 850, padding: 18, borderRadius: 20, background: '#F7F5FB'}}><CheckCircle2 color="#12B76A"/> {label}</div></StoryBeat>)}</div>
          </Card>
        </StoryCamera>
        <StoryBeat startFrame={controlAt} role="CONSEQUENCE" style={{position: 'absolute', left: 55, right: 55, top: 640}}><div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14}}>{[
          ['KONTROLLE',<ShieldCheck/>,controlAt],['PROTOKOLL',<Database/>,protocolAt],['FREIGABE',<LockKeyhole/>,approvalAt],
        ].map(([label,icon,at]) => <StoryBeat key={String(label)} startFrame={Number(at)} role="CONSEQUENCE"><Card style={{padding: 22, textAlign: 'center', fontSize: 19, fontWeight: 950, color: accent}}><div style={{display:'grid',placeItems:'center',marginBottom:10}}>{icon as React.ReactNode}</div>{label as string}</Card></StoryBeat>)}</div></StoryBeat>
        <StoryBeat startFrame={actionAt} role="PAYOFF" style={{position: 'absolute', left: 0, right: 0, top: 900}}><ImpactNumber value="KI + AKTION" label="das macht Agenten spannend" accent={accent} startFrame={actionAt} size={86}/></StoryBeat>
        <StoryBeat startFrame={approvalAt} role="PAYOFF" style={{position: 'absolute', left: 180, right: 180, top: 1030}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontSize:20,fontWeight:900,color:accent}}><Sparkles size={24}/> Autonomie braucht Grenzen.</div></StoryBeat>
      </div>
    </Shell>
  );
};

const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

const previewCaptionText = (cue: KIAgentWorkflowCue, frame: number) => {
  if (cue.words?.length) return cue.text;
  const words = cue.text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 6) return cue.text;
  const groups: string[][] = [];
  for (let index = 0; index < words.length; index += 6) groups.push(words.slice(index, index + 6));
  const progress = Math.max(0, Math.min(0.999999, (frame - cue.startFrame) / Math.max(1, cue.endFrame - cue.startFrame)));
  return groups[Math.min(groups.length - 1, Math.floor(progress * groups.length))].join(' ');
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 30) return null;
  const cue = KI_AGENT_WORKFLOW_CUES.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!cue) return null;
  return <div style={{...REEL_CAPTION_WRAPPER_STYLE, zIndex: 80}}><div style={{...REEL_CAPTION_GLASS_STYLE, fontFamily: FONT}}>{previewCaptionText(cue, frame)}</div></div>;
};

export const ReelKIAgentWorkflow: React.FC<Props> = ({voiceoverSrc, showCaptions = true, generatedImageSrc, generatedBrollSrc}) => (
  <AbsoluteFill style={{background: BRAND.bgDeep}}>
    {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
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
