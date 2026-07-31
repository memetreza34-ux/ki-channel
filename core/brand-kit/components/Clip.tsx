import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from 'remotion';

// ════════════════════════════════════════════════════════════════════════════
//  <Clip> — plattform-neutrales Abspielen von EXTERNEM Footage:
//  AI-Clips/Bilder (Flow / Higgsfield / Veo / Sora / Wan …) ODER Stock-B-Roll (Pexels …).
//  Das Studio bleibt so von jeder Plattform UNABHÄNGIG: heute Flow, morgen was
//  anderes — der Baustein bleibt gleich, nur die Datei + der clips.json-Eintrag
//  (Herkunft/Lizenz/Prompt, Schema `Clip` in @studio/core/lib/schemas) wechseln.
//
//  Erkennt Bild vs. Video automatisch an der Dateiendung (.png/.jpg/.jpeg/.webp
//  → <Img>, sonst → <OffthreadVideo>) — EIN Baustein für externes Footage, siehe
//  ASSET-QUELLEN.md „Standbilder". Standbilder NIE pur zeigen, sondern mit
//  <KenBurns>/<ParallaxLayer> ummanteln, sonst wirkt's wie reingepastet.
//
//  Datei in public/<slug>/clips/ ablegen, hier per Pfad laden.
//  <Clip src="etf/clips/intro.mp4" fit="cover" frame />
//  <KenBurns durFrames={90}><Clip src="etf/clips/hero.png" fit="cover" /></KenBurns>
// ════════════════════════════════════════════════════════════════════════════
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
export const Clip: React.FC<{
  src: string;                       // Pfad rel. zu public/ ODER absolute http(s)-URL
  fit?: 'cover' | 'contain';         // cover = formatfüllend (Default), contain = ganz sichtbar
  radius?: number;                   // abgerundete Ecken
  frame?: boolean;                   // themed Rahmen + Glow (var(--accent))
  muted?: boolean;                   // Default true — Ton kommt aus dem Voiceover
  startFrom?: number;                // Sekunden ins Quellvideo hinein starten
  endAt?: number;                    // Sekunden im Quellvideo, an dem Schluss ist
  playbackRate?: number;
  style?: React.CSSProperties;
}> = ({
  src, fit = 'cover', radius = 0, frame = false, muted = true,
  startFrom, endAt, playbackRate = 1, style,
}) => {
  const isUrl = /^https?:\/\//i.test(src);
  const source = isUrl ? src : staticFile(src);
  const isImage = IMAGE_EXT.test(src);
  const fps = 30; // Studio-Standard; OffthreadVideo erwartet Frames für Trim
  return (
    <AbsoluteFill
      style={{
        borderRadius: radius,
        overflow: 'hidden',
        boxShadow: frame ? `0 0 0 2px var(--accent), 0 0 60px -10px var(--accent)` : undefined,
        ...style,
      }}
    >
      {isImage ? (
        <Img src={source} style={{ width: '100%', height: '100%', objectFit: fit }} />
      ) : (
        <OffthreadVideo
          src={source}
          muted={muted}
          playbackRate={playbackRate}
          trimBefore={startFrom != null ? Math.round(startFrom * fps) : undefined}
          trimAfter={endAt != null ? Math.round(endAt * fps) : undefined}
          style={{ width: '100%', height: '100%', objectFit: fit }}
        />
      )}
    </AbsoluteFill>
  );
};
