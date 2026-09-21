import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import {usePrototypeContent} from './PrototypeContentContext';
import {easedProgress, followThrough, type MotionEasingName} from '../../motion/easing';

export const PROTOTYPE_PALETTE = {
  background: '#F8F7FB',
  foreground: '#14121A',
  accent: '#8757E8',
  accentSoft: '#C6A8FF',
  success: '#35C58A',
  warning: '#FFB648',
  danger: '#FF5D6C',
  muted: '#746D80',
  white: '#FFFFFF',
  line: '#DED7EA',
} as const;

const PRODUCTION_CONTENT_LIFT_PX = 96;
const PRODUCTION_ANIMATION_CUTOFF_Y = 1440;
const PRODUCTION_ANIMATION_CLIP_BOTTOM_PX = 1920 - PRODUCTION_ANIMATION_CUTOFF_Y;

/**
 * Massstab, damit die ganze Leinwand in den sichtbaren Streifen passt.
 *
 * Die Prototypen sind fuer volle 1920 px gebaut. Die Untertitel-Sperrzone kam
 * spaeter dazu und schneidet bei y=1440 hart ab - die Buehnen enden aber je
 * nach Prototyp bei 1730, 1770 oder sogar 1920. Ergebnis war eine harte Kante
 * quer durch das Bild und halbierte Inhalte.
 *
 * Eine Korrektur pro Prototyp scheidet aus: die Buehnenmasse sind nicht
 * einheitlich. Stattdessen wird die gesamte Ebene einmal so verkleinert, dass
 * auch der unterste denkbare Punkt oberhalb der Schnittkante landet:
 *
 *   y * MASSSTAB - LIFT <= CUTOFF   fuer y = 1920
 *   1920 * 0.8 - 96 = 1440
 *
 * Der frei werdende Streifen unten ist kein Verlust - dort sitzt die Caption.
 */
const PRODUCTION_CONTENT_SCALE =
  (PRODUCTION_ANIMATION_CUTOFF_Y + PRODUCTION_CONTENT_LIFT_PX) / 1920;

/**
 * Zentrale Zeitachse aller Prototypen.
 *
 * Bewusst NICHT linear: eine lineare Rampe hat weder Anlauf noch Auslauf und
 * liest sich als mechanisch. Standard ist eine Ease-out-Kurve - schneller
 * Einsatz, sanftes Einschwingen.
 *
 * Fuer Endlos-Schleifen (Spinner, Marquee) explizit 'loop' uebergeben.
 */
export const prototypeProgress = (
  frame: number,
  start: number,
  end: number,
  easing: MotionEasingName = 'enter',
): number => easedProgress(frame, start, end, easing);

const readableFamily = (value: string): string =>
  value.replace(/[-_]+/g, ' ').toLocaleUpperCase('de-DE');

const contentTitleFromMeaning = (content: NonNullable<ReturnType<typeof usePrototypeContent>>): string => {
  const terms = [
    ...content.meaningContract.resultTerms,
    ...content.meaningContract.subjectTerms,
  ]
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
  const uniqueTerms = [...new Set(terms)].slice(0, 3);
  return uniqueTerms.length > 0
    ? uniqueTerms.join(' · ')
    : 'VISUELLE ERKLÄRUNG';
};

const inferProductionIcon = ({
  explicit,
  family,
}: {
  explicit: string | undefined;
  family: string;
}): string => {
  const supplied = explicit?.trim().toLocaleLowerCase('de-DE');
  if (supplied) return supplied;
  const normalized = family.toLocaleLowerCase('de-DE');
  if (normalized.includes('context')) return 'context';
  if (normalized.includes('relationship') || normalized.includes('network')) return 'connections';
  if (normalized.includes('retrieval') || normalized.includes('search')) return 'search';
  if (normalized.includes('input') || normalized.includes('funnel')) return 'filter';
  if (normalized.includes('generation') || normalized.includes('answer')) return 'spark';
  return 'focus';
};

const ProductionSceneIcon: React.FC<{icon: string}> = ({icon}) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: BRAND.accentDk,
        background: 'rgba(185,140,255,.16)',
        border: '1.5px solid rgba(110,69,201,.22)',
        boxShadow: '0 12px 30px rgba(110,69,201,.14)',
        flex: '0 0 auto',
      }}
    >
      <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true">
        {icon === 'context' ? (
          <>
            <rect x="5" y="7" width="22" height="18" rx="4" {...common} />
            <path d="M9 12h14M9 17h9M9 22h6" {...common} />
          </>
        ) : icon === 'connections' ? (
          <>
            <circle cx="7" cy="16" r="3" {...common} />
            <circle cx="16" cy="8" r="3" {...common} />
            <circle cx="25" cy="16" r="3" {...common} />
            <circle cx="16" cy="25" r="3" {...common} />
            <path d="M9.5 14.2l4-3.6M18.5 10.6l4 3.6M22.2 18.2l-3.7 4.2M13.5 22.4l-3.7-4.2" {...common} />
          </>
        ) : icon === 'search' ? (
          <>
            <circle cx="14" cy="14" r="7" {...common} />
            <path d="M19.5 19.5L26 26M10.5 14h7M14 10.5v7" {...common} />
          </>
        ) : icon === 'filter' ? (
          <>
            <path d="M5 7h22l-8.5 9.5v7l-5 2v-9z" {...common} />
            <path d="M9 11h14" {...common} />
          </>
        ) : icon === 'spark' ? (
          <>
            <path d="M16 4l2.2 7.1L25 14l-6.8 2.9L16 24l-2.2-7.1L7 14l6.8-2.9z" {...common} />
            <path d="M25 5v5M22.5 7.5h5M7 22v4M5 24h4" {...common} />
          </>
        ) : (
          <>
            <circle cx="16" cy="16" r="10" {...common} />
            <circle cx="16" cy="16" r="4" {...common} />
            <path d="M16 3v4M16 25v4M3 16h4M25 16h4" {...common} />
          </>
        )}
      </svg>
    </div>
  );
};

export const PrototypeShell: React.FC<{
  family: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({family, title, subtitle, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const content = usePrototypeContent();
  const progress = prototypeProgress(frame, 0, durationInFrames - 1);
  const titleEnter = prototypeProgress(frame, 0, 18);
  // Nachlauf: Augenbraue, Titel und Unterzeile sind ein gestapelter Block.
  // Kommen sie auf demselben Frame zur Ruhe, liest das Auge ein einziges
  // flaches Ereignis. Gestaffelt liest es drei Stufen einer Aussage.
  const eyebrowEnter = prototypeProgress(frame, followThrough(0, 0), 18);
  const headlineEnter = prototypeProgress(frame, followThrough(0, 1), 20);
  const subtitleEnter = prototypeProgress(frame, followThrough(0, 2), 22);
  const displayFamily = readableFamily(family);
  const displayTitle = content
    ? content.title?.trim() || contentTitleFromMeaning(content)
    : title;
  const productionIcon = content
    ? inferProductionIcon({explicit: content.labels.shellIcon, family})
    : 'focus';

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F8F7FB 48%, #EDE8F5 100%)',
        color: PROTOTYPE_PALETTE.foreground,
        overflow: 'hidden',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(rgba(135,87,232,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(135,87,232,.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 18%, black 84%, transparent 100%)',
        }}
      />

      {/*
        Textur-Ebene der Bewegungshierarchie: unterschwellig, kontrastarm,
        unbewegt. Die grossflaechigen Lila-Verlaeufe auf 1080x1920 neigen zu
        Banding, besonders nach der Plattform-Kompression. Feines Korn bricht
        die Stufen auf. Gekachelt statt bildfuellend, damit der Filter pro Frame
        bezahlbar bleibt.
      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27180%27%20height%3D%27180%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.8%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3CfeColorMatrix%20type%3D%27saturate%27%20values%3D%270%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27180%27%20height%3D%27180%27%20filter%3D%27url%28%23n%29%27%2F%3E%3C%2Fsvg%3E")`,
          backgroundSize: '180px 180px',
          opacity: 0.035,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {content ? (
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 64,
            top: 104,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            textAlign: 'center',
            opacity: titleEnter,
            transform: `translateY(${(1 - titleEnter) * -24}px)`,
          }}
        >
          <ProductionSceneIcon icon={productionIcon} />
          <div
            style={{
              maxWidth: 820,
              color: BRAND.accentDk,
              fontFamily: BRAND.font,
              fontSize: displayTitle.length > 30 ? 50 : 58,
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: -1.8,
              textShadow: '0 7px 22px rgba(110,69,201,.12)',
            }}
          >
            {displayTitle}
          </div>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: 88,
            right: 88,
            top: 105,
            zIndex: 20,
          }}
        >
          <div
            style={{
              color: PROTOTYPE_PALETTE.accent,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 4,
              textTransform: 'uppercase',
              opacity: eyebrowEnter,
              transform: `translateY(${(1 - eyebrowEnter) * -30}px)`,
            }}
          >
            ANIMATION LIBRARY · {displayFamily}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: displayTitle.length > 38 ? 50 : 60,
              lineHeight: 0.96,
              fontWeight: 900,
              letterSpacing: -2,
              maxWidth: 900,
              opacity: headlineEnter,
              transform: `translateY(${(1 - headlineEnter) * -30}px)`,
            }}
          >
            {displayTitle}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: subtitle.length > 120 ? 21 : 25,
              lineHeight: 1.25,
              fontWeight: 700,
              color: PROTOTYPE_PALETTE.muted,
              maxWidth: 860,
              opacity: subtitleEnter,
              transform: `translateY(${(1 - subtitleEnter) * -30}px)`,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: content
            ? `inset(0 0 ${PRODUCTION_ANIMATION_CLIP_BOTTOM_PX}px 0)`
            : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: content
              ? `translateY(-${PRODUCTION_CONTENT_LIFT_PX}px) scale(${PRODUCTION_CONTENT_SCALE})`
              : undefined,
            // Waagerecht mittig, senkrecht oben verankert: die Breite bleibt
            // zentriert, und oben bleibt der Abstand zur Ueberschrift gleich.
            transformOrigin: content ? '50% 0' : undefined,
          }}
        >
          {children}
        </div>
      </div>

      {!content ? (
        <div
          style={{
            position: 'absolute',
            left: 74,
            right: 74,
            bottom: 72,
            height: 8,
            borderRadius: 999,
            background: 'rgba(135,87,232,.10)',
            overflow: 'hidden',
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${PROTOTYPE_PALETTE.accentSoft}, ${PROTOTYPE_PALETTE.accent})`,
              boxShadow: '0 0 20px rgba(135,87,232,.45)',
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const GlassSurface: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      borderRadius: 36,
      background: 'rgba(255,255,255,.84)',
      border: '1px solid rgba(135,87,232,.16)',
      boxShadow: '0 24px 75px rgba(51,35,82,.14)',
      backdropFilter: 'blur(20px)',
      ...style,
    }}
  >
    {children}
  </div>
);
