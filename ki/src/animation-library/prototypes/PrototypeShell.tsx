import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {usePrototypeContent} from './PrototypeContentContext';

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

export const prototypeProgress = (
  frame: number,
  start: number,
  end: number,
): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        width: 58,
        height: 58,
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: PROTOTYPE_PALETTE.accent,
        background: 'rgba(135,87,232,.10)',
        border: '1.5px solid rgba(135,87,232,.20)',
        boxShadow: '0 10px 26px rgba(135,87,232,.10)',
        flex: '0 0 auto',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
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

      {content ? (
        <div
          style={{
            position: 'absolute',
            left: 78,
            right: 78,
            top: 118,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            textAlign: 'center',
            opacity: titleEnter,
            transform: `translateY(${(1 - titleEnter) * -24}px)`,
          }}
        >
          <ProductionSceneIcon icon={productionIcon} />
          <div
            style={{
              maxWidth: 790,
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: displayTitle.length > 30 ? 46 : 52,
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: -1.7,
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
            opacity: titleEnter,
            transform: `translateY(${(1 - titleEnter) * -30}px)`,
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

      {children}

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
