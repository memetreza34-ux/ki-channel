import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND} from '../../../brand/brand';
import type {AgentLoopChapterId} from './contract';

// Remotion-native Kapitel-Icons: reine SVG-Pfade, keine Bitmaps.
// Jedes Icon zeigt die Mechanik des Kapitels, nicht bloss Dekoration.
const ICON_PATHS: Record<AgentLoopChapterId, React.ReactNode> = {
  // Funke — was einen Agenten anders macht
  hook: (
    <>
      <path d="M16 3l2.6 8.4L27 14l-8.4 2.6L16 25l-2.6-8.4L5 14l8.4-2.6z" />
      <path d="M25 4v4M23 6h4M7 23v3M5.5 24.5h3" />
    </>
  ),
  // Zwei Waagschalen — Chatbot gegen Agent
  compare: (
    <>
      <path d="M16 5v22M8 27h16" />
      <path d="M6 11h20" />
      <path d="M6 11l-3 7a3.2 3.2 0 006 0z" />
      <path d="M26 11l3 7a3.2 3.2 0 01-6 0z" />
    </>
  ),
  // Bausteine — die vier Bausteine
  anatomy: (
    <>
      <rect x="4" y="4" width="10" height="10" rx="2.5" />
      <rect x="18" y="4" width="10" height="10" rx="2.5" />
      <rect x="4" y="18" width="10" height="10" rx="2.5" />
      <rect x="18" y="18" width="10" height="10" rx="2.5" />
    </>
  ),
  // Kreislauf — der Agenten-Loop
  loop: (
    <>
      <path d="M27 16a11 11 0 11-3.6-8.1" />
      <path d="M27 5v7h-7" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  // Ablauf mit Schritten — ein konkretes Beispiel
  example: (
    <>
      <path d="M5 8h14M5 16h10M5 24h16" />
      <circle cx="26" cy="8" r="2.5" />
      <circle cx="22" cy="16" r="2.5" />
      <circle cx="27" cy="24" r="2.5" />
    </>
  ),
  // Werkzeug — warum Werkzeuge entscheidend sind
  tools: (
    <>
      <path d="M21.5 4.5a6.5 6.5 0 00-8.2 8.2L4 22v6h6l9.3-9.3a6.5 6.5 0 008.2-8.2l-4.4 4.4-3.6-.6-.6-3.6z" />
    </>
  ),
  // Warndreieck — wo Agenten scheitern
  risks: (
    <>
      <path d="M16 5L29 27H3z" />
      <path d="M16 13v6M16 23h.01" />
    </>
  ),
  // Schild mit Haken — Kontrolle und Freigaben
  guardrails: (
    <>
      <path d="M16 3l11 4v9c0 7-4.7 11.4-11 13-6.3-1.6-11-6-11-13V7z" />
      <path d="M11 16l3.5 3.5L21 13" />
    </>
  ),
  // Zielscheibe — wann ein Agent sinnvoll ist
  fit: (
    <>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="16" cy="16" r="1.6" />
    </>
  ),
};

const ChapterIcon: React.FC<{id: AgentLoopChapterId; progress: number}> = ({id, progress}) => (
  <svg
    width="46"
    height="46"
    viewBox="0 0 32 32"
    fill="none"
    stroke={BRAND.accentDk}
    strokeWidth={2.1}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      // Der Pfad zeichnet sich einmal ein, statt nur aufzupoppen.
      strokeDasharray: 140,
      strokeDashoffset: 140 * (1 - progress),
    }}
  >
    {ICON_PATHS[id]}
  </svg>
);

/**
 * Kapitel-Kopf: Icon und Titel mittig, dauerhaft sichtbar.
 *
 * Bewusst dauerhaft — der Zuschauer soll jederzeit wissen, in welchem
 * Kapitel er ist. Nach dem Auftritt bleibt der Kopf ruhig stehen und
 * nimmt sich optisch zurueck, damit die Szene darunter fuehrt.
 */
export const ChapterHeader: React.FC<{
  id: AgentLoopChapterId;
  index: number;
  title: string;
}> = ({id, index, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, mass: 0.6}, durationInFrames: 26});
  const iconDraw = interpolate(frame, [6, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Nach dem Auftritt leicht zurueckgenommen, aber nie ausgeblendet.
  const settle = interpolate(frame, [40, 70], [1, 0.82], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const underline = interpolate(frame, [18, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 54,
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity: settle,
        transform: `translateY(${(1 - enter) * -18}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 24,
            background: 'rgba(185,140,255,.16)',
            border: '1.5px solid rgba(110,69,201,.22)',
            display: 'grid',
            placeItems: 'center',
            transform: `scale(${0.82 + enter * 0.18})`,
          }}
        >
          <ChapterIcon id={id} progress={iconDraw} />
        </div>
        <div
          style={{
            fontFamily: BRAND.font.body,
            fontWeight: 900,
            fontSize: 46,
            letterSpacing: -1.4,
            color: BRAND.accentDk,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div
          style={{
            height: 3,
            width: 220 * underline,
            borderRadius: 3,
            background: `linear-gradient(90deg, rgba(110,69,201,0), ${BRAND.accent}, rgba(110,69,201,0))`,
          }}
        />
        <div
          style={{
            fontFamily: BRAND.font.body,
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: 3,
            color: 'rgba(26,26,46,.42)',
          }}
        >
          KAPITEL {String(index + 1).padStart(2, '0')}
        </div>
        <div
          style={{
            height: 3,
            width: 220 * underline,
            borderRadius: 3,
            background: `linear-gradient(90deg, rgba(110,69,201,0), ${BRAND.accent}, rgba(110,69,201,0))`,
          }}
        />
      </div>
    </div>
  );
};
