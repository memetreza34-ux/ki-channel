import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {
  CapacityBar,
  ContextWindow,
  MessageCard,
  Rail,
  SceneShell,
  clampProgress,
} from './components';
import {localBeatFrame, localResultFrame, type ContextSceneId} from './sync';
import {contextPalette} from './style';

const beatProgress = (sceneId: ContextSceneId, beatId: string, frame: number): number =>
  clampProgress(frame, localBeatFrame(sceneId, beatId), localResultFrame(sceneId, beatId));

const ResultLabel: React.FC<{children: React.ReactNode; tone?: 'accent' | 'danger' | 'success'}> = ({children, tone = 'accent'}) => {
  const color = tone === 'danger' ? contextPalette.danger : tone === 'success' ? contextPalette.success : contextPalette.accent;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 18,
        textAlign: 'center',
        color,
        fontSize: 28,
        fontWeight: 950,
        letterSpacing: 0.8,
      }}
    >
      {children}
    </div>
  );
};

export const Scene01Forgetting: React.FC = () => {
  const frame = useCurrentFrame();
  const forget = beatProgress('scene-01', 's1-forgets', frame);
  const windowBeat = beatProgress('scene-01', 's1-window', frame);
  const railOffset = interpolate(forget, [0, 1], [80, -130]);
  const oldOpacity = interpolate(forget, [0, 1], [1, 0.18]);

  return (
    <SceneShell
      title="Warum KI scheinbar vergisst"
      result="NUR INHALT IM FENSTER IST AKTIV"
      resultVisible={windowBeat}
      resultTone="accent"
    >
      <ContextWindow emphasis={windowBeat}>
        <Rail left={-250} top={245} width={1500} offsetX={railOffset}>
          <MessageCard tone="inactive" label="FRÜHER" opacity={oldOpacity} blurPx={forget * 4} />
          <MessageCard tone="active" label="WICHTIGE REGEL" />
          <MessageCard tone="active" label="AKTUELLE AUFGABE" />
          <MessageCard tone="active" />
        </Rail>
      </ContextWindow>
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 300,
          width: 20,
          height: 190,
          borderRadius: 99,
          background: contextPalette.danger,
          opacity: forget,
        }}
      />
    </SceneShell>
  );
};

export const Scene02LimitedSlice: React.FC = () => {
  const frame = useCurrentFrame();
  const unfold = beatProgress('scene-02', 's2-rail', frame);
  const limited = beatProgress('scene-02', 's2-limited', frame);
  const scaleX = interpolate(unfold, [0, 1], [0.56, 1]);

  return (
    <SceneShell
      title="Die KI sieht nur einen Ausschnitt"
      result="DER CHAT IST LÄNGER ALS DAS FENSTER"
      resultVisible={limited}
    >
      <div style={{position: 'absolute', left: -260, right: -260, top: 392, height: 16, borderRadius: 99, background: contextPalette.line, transform: `scaleX(${scaleX})`}} />
      <div style={{position: 'absolute', left: -200, top: 280, display: 'flex', gap: 34, opacity: 0.22 + 0.78 * unfold}}>
        {Array.from({length: 7}).map((_, index) => (
          <MessageCard
            key={index}
            width={230}
            height={150}
            tone={index >= 2 && index <= 4 ? 'active' : 'inactive'}
            opacity={index >= 2 && index <= 4 ? 1 : 1 - limited * 0.55}
            blurPx={index >= 2 && index <= 4 ? 0 : limited * 2.5}
          />
        ))}
      </div>
      <ContextWindow left={236} top={115} width={500} height={570} emphasis={limited} overflowHidden={false}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(125,73,223,0.05)'}} />
      </ContextWindow>
      <div style={{position: 'absolute', left: 16, top: 720, color: contextPalette.muted, fontSize: 25, fontWeight: 850, opacity: limited}}>AUSSERHALB</div>
      <div style={{position: 'absolute', right: 16, top: 720, color: contextPalette.muted, fontSize: 25, fontWeight: 850, opacity: limited}}>AUSSERHALB</div>
    </SceneShell>
  );
};

export const Scene03WindowMoves: React.FC = () => {
  const frame = useCurrentFrame();
  const newMessage = beatProgress('scene-03', 's3-new', frame);
  const shift = beatProgress('scene-03', 's3-shift', frame);
  const railOffset = interpolate(shift, [0, 1], [120, -120]);
  const newCardX = interpolate(newMessage, [0, 1], [320, 0]);

  return (
    <SceneShell
      title="Neue Nachrichten verschieben das Fenster"
      result="DER AKTUELLE AUSSCHNITT WANDERT"
      resultVisible={shift}
    >
      <ContextWindow emphasis={0.35 + shift * 0.45}>
        <Rail left={-170} top={245} width={1500} offsetX={railOffset}>
          <MessageCard tone="inactive" label="ALT" opacity={0.45} />
          <MessageCard tone="active" />
          <MessageCard tone="active" label="AKTUELL" />
          <MessageCard tone="active" style={{transform: `translateX(${newCardX}px) scale(${0.9 + newMessage * 0.1})`}} label="NEU" />
        </Rail>
      </ContextWindow>
      <div style={{position: 'absolute', left: 170, right: 170, bottom: 32, height: 12, borderRadius: 99, background: contextPalette.line}}>
        <div style={{width: 160, height: 12, borderRadius: 99, background: contextPalette.accent, transform: `translateX(${interpolate(shift, [0, 1], [0, 472])}px)`}} />
      </div>
    </SceneShell>
  );
};

export const Scene04OldContentLeaves: React.FC = () => {
  const frame = useCurrentFrame();
  const older = beatProgress('scene-04', 's4-old', frame);
  const out = beatProgress('scene-04', 's4-out', frame);
  const unavailable = beatProgress('scene-04', 's4-unavailable', frame);
  const cardX = interpolate(out, [0, 1], [170, -300]);

  return (
    <SceneShell
      title="Alte Inhalte rutschen hinaus"
      result="FRÜHERE INFORMATION IST NICHT MEHR VERFÜGBAR"
      resultVisible={unavailable}
      resultTone="danger"
    >
      <div style={{position: 'absolute', left: 220, top: 90, width: 14, height: 720, borderRadius: 99, background: contextPalette.danger, opacity: 0.35 + 0.65 * older}} />
      <div style={{position: 'absolute', left: 18, top: 120, width: 180, textAlign: 'center', color: contextPalette.danger, fontSize: 24, fontWeight: 950}}>AUSSERHALB</div>
      <MessageCard
        tone="danger"
        label="FRÜHERE REGEL"
        opacity={1 - out * 0.7}
        blurPx={out * 4}
        style={{position: 'absolute', left: 250, top: 310, transform: `translateX(${cardX}px) scale(${1 - out * 0.08})`}}
      />
      <ContextWindow left={235} top={90} width={690} height={720} emphasis={unavailable}>
        <MessageCard tone="active" label="AKTUELLE FRAGE" style={{position: 'absolute', right: 80, top: 180}} />
        <div style={{position: 'absolute', right: 170, top: 430, width: 260, height: 16, borderRadius: 99, background: contextPalette.accent, opacity: 0.2 + unavailable * 0.8}} />
        <div style={{position: 'absolute', right: 170, top: 480, width: 190, height: 16, borderRadius: 99, background: contextPalette.line}} />
        <div style={{position: 'absolute', left: 20, top: 450, width: 170, height: 6, background: contextPalette.danger, opacity: unavailable}} />
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene05CapacityFills: React.FC = () => {
  const frame = useCurrentFrame();
  const text = beatProgress('scene-05', 's5-text', frame);
  const files = beatProgress('scene-05', 's5-files', frame);
  const answer = beatProgress('scene-05', 's5-answer', frame);
  const fill = Math.min(1, text * 0.42 + files * 0.28 + answer * 0.3);

  return (
    <SceneShell
      title="So wird der Kontext schnell voll"
      result="LANGE INHALTE DRÜCKEN ALTE INFORMATIONEN HINAUS"
      resultVisible={answer}
      resultTone="warning"
    >
      <ContextWindow emphasis={fill}>
        <div style={{position: 'absolute', left: 70, right: 70, top: 150, display: 'flex', alignItems: 'stretch', gap: 22}}>
          <MessageCard
            width={290}
            height={360}
            tone="active"
            label="LANGER TEXT"
            opacity={text}
            scale={0.9 + text * 0.1}
          />
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, width: 190}}>
            <MessageCard width={190} height={165} tone="warning" label="DATEI" opacity={files} scale={0.9 + files * 0.1} />
            <MessageCard width={190} height={165} tone="warning" label="DATEI" opacity={files} scale={0.9 + files * 0.1} />
          </div>
          <MessageCard
            width={210}
            height={360}
            tone={answer > 0.8 ? 'danger' : 'active'}
            label="LANGE ANTWORT"
            opacity={answer}
            scale={0.9 + answer * 0.1}
          />
        </div>
        <CapacityBar fill={fill} />
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene06MissingDetails: React.FC = () => {
  const frame = useCurrentFrame();
  const names = beatProgress('scene-06', 's6-name', frame);
  const rules = beatProgress('scene-06', 's6-rules', frame);
  const decisions = beatProgress('scene-06', 's6-decisions', frame);
  const scan = Math.max(names, rules, decisions);
  const beamX = interpolate(scan, [0, 1], [700, 230]);

  return (
    <SceneShell
      title="Dann fehlen Details vom Anfang"
      result="NAME · REGEL · ENTSCHEIDUNG FEHLEN"
      resultVisible={decisions}
      resultTone="danger"
    >
      <div style={{position: 'absolute', left: 26, top: 210, display: 'flex', flexDirection: 'column', gap: 28}}>
        <MessageCard width={220} height={130} tone="inactive" label="NAME" opacity={0.25 + names * 0.35} />
        <MessageCard width={220} height={130} tone="inactive" label="REGEL" opacity={0.25 + rules * 0.35} />
        <MessageCard width={220} height={130} tone="inactive" label="ENTSCHEIDUNG" opacity={0.25 + decisions * 0.35} />
      </div>
      <ContextWindow left={280} top={95} width={650} height={700} emphasis={scan}>
        <div style={{position: 'absolute', left: beamX - 280, top: 120, width: 10, height: 470, borderRadius: 99, background: contextPalette.accent, boxShadow: '0 0 30px rgba(125,73,223,0.5)'}} />
        <MessageCard tone="active" label="AKTUELLE ANTWORT" style={{position: 'absolute', right: 95, top: 210}} />
        <div style={{position: 'absolute', right: 130, top: 450, width: 230, height: 24, borderRadius: 99, background: contextPalette.danger, opacity: 0.22 + decisions * 0.68}} />
        <div style={{position: 'absolute', right: 130, top: 500, width: 170, height: 24, borderRadius: 99, background: contextPalette.line}} />
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene07KeepImportantVisible: React.FC = () => {
  const frame = useCurrentFrame();
  const summary = beatProgress('scene-07', 's7-summary', frame);
  const repeat = beatProgress('scene-07', 's7-repeat', frame);
  const sections = beatProgress('scene-07', 's7-sections', frame);

  return (
    <SceneShell
      title="So hältst du Wichtiges sichtbar"
      result="WICHTIGER KONTEXT PASST WIEDER INS FENSTER"
      resultVisible={sections}
      resultTone="success"
    >
      <ContextWindow emphasis={0.35 + sections * 0.55}>
        <div style={{position: 'absolute', left: 65, right: 65, top: 150, height: 400}}>
          {[0, 1, 2].map((index) => (
            <MessageCard
              key={index}
              width={210}
              height={145}
              tone="inactive"
              opacity={1 - summary * 0.75}
              scale={1 - summary * 0.18}
              style={{position: 'absolute', left: index * 185, top: index * 54}}
            />
          ))}
          <MessageCard
            width={300}
            height={175}
            tone="success"
            label="KURZE ZUSAMMENFASSUNG"
            opacity={summary}
            scale={0.88 + summary * 0.12}
            style={{position: 'absolute', left: 20, top: 170}}
          />
          <MessageCard
            width={300}
            height={175}
            tone="active"
            label="ZENTRALE VORGABE"
            opacity={repeat}
            scale={0.88 + repeat * 0.12}
            style={{position: 'absolute', right: 20, top: 170}}
          />
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, bottom: 80, display: 'flex', gap: 16, opacity: sections}}>
          {['ABSCHNITT 1', 'AKTUELL', 'ABSCHNITT 3'].map((label, index) => (
            <div key={label} style={{flex: 1, height: 64, borderRadius: 20, background: index === 1 ? contextPalette.accent : contextPalette.line, color: index === 1 ? 'white' : contextPalette.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 950}}>{label}</div>
          ))}
        </div>
      </ContextWindow>
    </SceneShell>
  );
};

export const Scene08VisibleContextCounts: React.FC = () => {
  const frame = useCurrentFrame();
  const context = beatProgress('scene-08', 's8-context', frame);
  const intent = beatProgress('scene-08', 's8-intent', frame);
  const visible = beatProgress('scene-08', 's8-visible', frame);
  const modules = [
    {label: 'ZUSAMMENFASSUNG', tone: 'success' as const},
    {label: 'ZENTRALE VORGABE', tone: 'active' as const},
    {label: 'AKTUELLE AUFGABE', tone: 'active' as const},
  ];

  return (
    <SceneShell
      title="Nur sichtbarer Kontext zählt"
      result="NUR DER SICHTBARE KONTEXT ZÄHLT"
      resultVisible={visible}
      resultTone="success"
    >
      <ContextWindow left={115} top={80} width={742} height={735} emphasis={visible}>
        <div style={{position: 'absolute', left: 92, right: 92, top: 130, display: 'flex', flexDirection: 'column', gap: 28}}>
          {modules.map((module, index) => {
            const moduleProgress = clampProgress(context, index / 3, Math.min(1, index / 3 + 0.45));
            return (
              <MessageCard
                key={module.label}
                width={558}
                height={145}
                tone={module.tone}
                label={module.label}
                opacity={moduleProgress}
                scale={0.9 + moduleProgress * 0.1}
              />
            );
          })}
        </div>
        <div style={{position: 'absolute', right: 36, top: 36, width: 58, height: 58, borderRadius: '50%', border: `5px solid ${contextPalette.danger}`, opacity: intent}}>
          <div style={{position: 'absolute', left: -6, right: -6, top: 24, height: 7, background: contextPalette.danger, transform: 'rotate(-45deg)'}} />
        </div>
        <ResultLabel tone="success">TECHNISCHE GRENZE · KEINE ABSICHT</ResultLabel>
      </ContextWindow>
    </SceneShell>
  );
};

export const CONTEXT_SCENE_COMPONENTS = {
  'scene-01': Scene01Forgetting,
  'scene-02': Scene02LimitedSlice,
  'scene-03': Scene03WindowMoves,
  'scene-04': Scene04OldContentLeaves,
  'scene-05': Scene05CapacityFills,
  'scene-06': Scene06MissingDetails,
  'scene-07': Scene07KeepImportantVisible,
  'scene-08': Scene08VisibleContextCounts,
} satisfies Record<ContextSceneId, React.FC>;
