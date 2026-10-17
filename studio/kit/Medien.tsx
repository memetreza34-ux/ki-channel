import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, progress} from './motion';
import {useTheme} from './themes';

const isVideo = (src: string) => /\.(mp4|mov|webm|m4v)$/i.test(src);

type FootageProps = {
  /** Pfad in studio/public, z. B. "projekte/mein-video/broll/12345.mp4" oder ein Foto. */
  src: string;
  /** Größe des Ausschnitts; ohne Angabe die ganze Bühne. */
  width?: number;
  height?: number;
  /** Langsamer Zoom von → nach (Ken-Burns). */
  zoom?: [number, number];
  /** Schwenk in % der Breite/Höhe, z. B. [-3, 0] → [3, 0]. */
  pan?: [[number, number], [number, number]];
  /** Färbt das Material leicht in Richtung Designfarbe (0–1). */
  tint?: number;
  /** Dunkelt Ränder ab, lenkt den Blick zur Mitte. */
  vignette?: boolean;
  /** Abdunkeln (0–1), damit Text darüber lesbar bleibt. */
  dim?: number;
  /** Sekunden, die am Anfang des Clips übersprungen werden. */
  startAt?: number;
  playbackRate?: number;
  /** Rahmen mit Rundung und Schatten (statt vollflächig). */
  framed?: boolean;
  /** Clip-Ton (Standard aus). */
  sound?: boolean;
  delay?: number;
  style?: React.CSSProperties;
};

/**
 * B-Roll: Video oder Foto aus studio/public mit Ken-Burns-Bewegung, Einfärbung
 * und optionalem Rahmen. Für Stock-Clips (Pixabay/Pexels), Bildschirmaufnahmen
 * oder eigene Fotos.
 */
export const Footage: React.FC<FootageProps> = ({
  src,
  width,
  height,
  zoom = [1.04, 1.14],
  pan = [
    [0, 0],
    [0, 0],
  ],
  tint = 0,
  vignette = false,
  dim = 0,
  startAt = 0,
  playbackRate = 1,
  framed = false,
  sound = false,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps, width: W, height: H} = useVideoConfig();
  const t = useTheme();
  // Ken-Burns läuft über die ganze Sequenz gleichmäßig weich.
  const p = progress(frame, delay, Math.max(1, durationInFrames - delay), 'inOut');
  const appear = progress(frame, delay, 10, 'soft');
  const z = mix(zoom[0], zoom[1], p);
  const px = mix(pan[0][0], pan[1][0], p);
  const py = mix(pan[0][1], pan[1][1], p);
  const media: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${px}%, ${py}%) scale(${z})`};
  return (
    <div
      style={{
        position: width ? 'relative' : 'absolute',
        inset: width ? undefined : 0,
        width: width ?? W,
        height: height ?? H,
        overflow: 'hidden',
        borderRadius: framed ? 36 * t.radius : 0,
        border: framed && t.border ? t.border : undefined,
        boxShadow: framed ? t.shadow.lift : undefined,
        background: t.c.dark,
        opacity: appear,
        ...style,
      }}
    >
      {isVideo(src) ? (
        <OffthreadVideo src={staticFile(src)} muted={!sound} trimBefore={Math.round(startAt * fps) || undefined} playbackRate={playbackRate} style={media} />
      ) : (
        <Img src={staticFile(src)} style={media} />
      )}
      {tint > 0 ? <div style={{position: 'absolute', inset: 0, background: t.c.accentDeep, mixBlendMode: 'color', opacity: tint}} /> : null}
      {dim > 0 ? <div style={{position: 'absolute', inset: 0, background: '#000', opacity: dim}} /> : null}
      {vignette ? <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)'}} /> : null}
    </div>
  );
};

// ── Illustrationen (z. B. unDraw) ───────────────────────────────────────

const svgCache = new Map<string, Promise<string>>();

type IllustrationProps = {
  /** SVG in studio/public, z. B. "illustrationen/teamwork.svg". */
  src: string;
  width: number;
  height?: number;
  /** Farbe, die durch die Designfarbe ersetzt wird (unDraw-Standard: #6c63ff). */
  replace?: string;
  delay?: number;
};

/** SVG-Illustration, deren Akzentfarbe automatisch zum Design passt. */
export const Illustration: React.FC<IllustrationProps> = ({src, width, height, replace = '#6c63ff', delay = 0}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [handle] = useState(() => delayRender(`Illustration ${src}`));
  useEffect(() => {
    let p = svgCache.get(src);
    if (!p) {
      p = fetch(staticFile(src)).then((r) => {
        if (!r.ok) throw new Error(`Illustration nicht gefunden: studio/public/${src}`);
        return r.text();
      });
      svgCache.set(src, p);
    }
    p.then((text) => {
      setSvg(text);
      continueRender(handle);
    }).catch((err) => cancelRender(err));
  }, [src, handle]);
  const colored = svg ? svg.replace(new RegExp(replace, 'gi'), t.c.accentDeep).replace(/<svg\b/, '<svg width="100%" height="100%"') : '';
  const s = progress(frame, delay, 18, 'out');
  return (
    <div
      style={{width, height: height ?? width * 0.75, opacity: clamp01(s * 1.5), transform: `translateY(${(1 - s) * 40}px) scale(${mix(0.94, 1, s)})`}}
      dangerouslySetInnerHTML={{__html: colored}}
    />
  );
};
