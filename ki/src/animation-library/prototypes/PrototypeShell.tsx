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

  // In a production reel the exact spoken sentence already belongs to the caption
  // layer. Repeating it below the headline competes with the animation and creates
  // the same information twice. A production subtitle is therefore opt-in only.
  const displaySubtitle = content
    ? content.labels.shellSubtitle?.trim() || null
    : subtitle;

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

      <div
        style={{
          position: 'absolute',
          left: 88,
          right: 88,
          top: content ? 118 : 105,
          opacity: titleEnter,
          transform: `translateY(${(1 - titleEnter) * -30}px)`,
          zIndex: 20,
        }}
      >
        {!content ? (
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
        ) : null}
        <div
          style={{
            marginTop: content ? 0 : 12,
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
        {displaySubtitle ? (
          <div
            style={{
              marginTop: 18,
              fontSize: displaySubtitle.length > 120 ? 21 : 25,
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
            {displaySubtitle}
          </div>
        ) : null}
      </div>

      {children}

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
