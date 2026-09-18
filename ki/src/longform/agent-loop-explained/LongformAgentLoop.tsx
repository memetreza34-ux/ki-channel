import React, {useMemo} from 'react';
import {AbsoluteFill, Html5Audio, Sequence, useCurrentFrame} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {ChapterHeader} from './ChapterHeader';
import {CHAPTER_SCENES} from './chapterScenes';
import {resolveAnchors} from './anchor';
import {LiveScene, type PlacedItem} from './LiveScene';
import {useSpeech} from './speech';
import {
  AGENT_LOOP_CHAPTERS,
  AGENT_LOOP_DURATION_IN_FRAMES,
  type AgentLoopChapter,
} from './contract';

const ChapterLayer: React.FC<{chapter: AgentLoopChapter; index: number}> = ({chapter, index}) => {
  // Ankerwoerter einmal je Kapitel in Frames aufloesen, nicht je Frame.
  const items = useMemo<PlacedItem[] | null>(() => {
    const planned = CHAPTER_SCENES[chapter.id];
    if (!planned) return null;
    return resolveAnchors(planned, chapter.startFrame, chapter.endFrame) as PlacedItem[];
  }, [chapter.id, chapter.startFrame, chapter.endFrame]);

  return (
    <AbsoluteFill>
      <ChapterHeader id={chapter.id} index={index} title={chapter.title} />
      {/* Die Szene positioniert sich selbst zwischen Kapitelkopf und
          Fortschrittsbalken. Frueher lag hier zusaetzlich eine Verschiebung
          plus Skalierung — zusammen mit der eigenen Box der Szene rutschte
          alles nach unten in den Fortschrittsbalken. */}
      {items ? <LiveScene items={items} offset={chapter.startFrame} /> : null}
    </AbsoluteFill>
  );
};

/**
 * Hintergrund, der mit der Stimme atmet.
 *
 * Bewusst sehr flach gehalten: Der Verlauf wandert langsam und wird beim
 * Sprechen minimal dichter. Das nimmt dem weissen Bild die Starre, ohne mit
 * der Szene zu konkurrieren.
 */
const LiveBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const {energy} = useSpeech(0);
  const x = 50 + Math.sin((frame / 640) * Math.PI * 2) * 6;
  const y = 38 + Math.cos((frame / 780) * Math.PI * 2) * 5;
  const tint = 0.014 + energy * 0.012;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x}% ${y}%, #FFFFFF 0%, #FAF8FC 60%, #F1EDF6 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            `linear-gradient(rgba(110,69,201,${tint}) 1px,transparent 1px),` +
            `linear-gradient(90deg,rgba(110,69,201,${tint}) 1px,transparent 1px)`,
          backgroundSize: '80px 80px',
          // Das Raster driftet um genau eine Zelle und springt dann zurueck —
          // dadurch ist es dauerhaft in Bewegung, ohne je zu "rucken".
          backgroundPosition: `${(frame / 5) % 80}px ${(frame / 7) % 80}px`,
        }}
      />
    </>
  );
};

/** Fortschritt mit Kapitelmarken — man sieht, wo man im Video steht. */
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const total = AGENT_LOOP_DURATION_IN_FRAMES;
  const progress = Math.min(1, frame / total);
  const {pulse} = useSpeech(0);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: 34,
        height: 6,
        borderRadius: 9,
        background: 'rgba(26,26,46,.08)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          borderRadius: 9,
          background: BRAND.accentDk,
        }}
      />
      {AGENT_LOOP_CHAPTERS.slice(1).map((chapter) => (
        <div
          key={chapter.id}
          style={{
            position: 'absolute',
            top: -2,
            left: `${(chapter.startFrame / total) * 100}%`,
            width: 2,
            height: 10,
            borderRadius: 2,
            background: frame >= chapter.startFrame ? BRAND.accentDk : 'rgba(26,26,46,.16)',
          }}
        />
      ))}
      {/* Kopf des Balkens pulst mit der Stimme. */}
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: `${progress * 100}%`,
          width: 10 + pulse * 6,
          height: 10 + pulse * 6,
          marginLeft: -(5 + pulse * 3),
          marginTop: -(5 + pulse * 3),
          borderRadius: 999,
          background: BRAND.accentDk,
          opacity: 0.55 + pulse * 0.45,
        }}
      />
    </div>
  );
};

export type LongformAgentLoopProps = {voiceoverSrc?: string};

export const LongformAgentLoop: React.FC<LongformAgentLoopProps> = ({voiceoverSrc}) => {
  const chapters = useMemo(() => AGENT_LOOP_CHAPTERS, []);
  return (
    <AbsoluteFill
      style={{
        background: '#FFFFFF',
        color: BRAND.ink,
        fontFamily: BRAND.font.body,
        overflow: 'hidden',
      }}
    >
      <LiveBackground />
      {chapters.map((chapter, index) => (
        <Sequence
          key={chapter.id}
          from={chapter.startFrame}
          durationInFrames={chapter.endFrame - chapter.startFrame}
          name={`${chapter.id}-${CHAPTER_SCENES[chapter.id]?.length ?? 0}-bilder`}
        >
          <ChapterLayer chapter={chapter} index={index} />
        </Sequence>
      ))}
      <Progress />
      {voiceoverSrc ? <Html5Audio src={voiceoverSrc} /> : null}
    </AbsoluteFill>
  );
};
