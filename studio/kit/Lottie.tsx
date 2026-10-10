import React, {useEffect, useState} from 'react';
import {Lottie as RemotionLottie, type LottieAnimationData} from '@remotion/lottie';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, mix, pop} from './motion';
import {useTheme} from './themes';

/**
 * Lottie-Animationen aus `studio/public/lottie/`:
 *   emoji/<name>  animierte Google-Emojis (CC BY 4.0 → Namensnennung in die Videobeschreibung!)
 *   ui/<name>     animierte UI-Icons aus react-useanimations (MIT), einfarbig → lassen sich einfärben
 * Alle Namen: `npm run icons -- --lottie`. Ansehen: Composition `Lottie-Katalog`.
 */

const cache = new Map<string, Promise<LottieAnimationData>>();

const loadLottie = (name: string) => {
  let p = cache.get(name);
  if (!p) {
    p = fetch(staticFile(`lottie/${name}.json`)).then((r) => {
      if (!r.ok) throw new Error(`Lottie "${name}" nicht gefunden (studio/public/lottie/${name}.json)`);
      return r.json() as Promise<LottieAnimationData>;
    });
    cache.set(name, p);
  }
  return p;
};

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Färbt alle festen Füll- und Linienfarben einer Animation um (für einfarbige UI-Icons). */
const recolor = (data: LottieAnimationData, hex: string): LottieAnimationData => {
  const [r, g, b] = hexToRgb(hex);
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') {
      const o = node as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(o)) out[k] = walk(v);
      if ((o.ty === 'fl' || o.ty === 'st') && out.c && typeof out.c === 'object') {
        const c = out.c as {a?: number; k?: unknown};
        if (c.a === 0 && Array.isArray(c.k)) out.c = {...c, k: [r, g, b, (c.k as number[])[3] ?? 1]};
      }
      return out;
    }
    return node;
  };
  return walk(data) as LottieAnimationData;
};

type LottieProps = {
  /** z. B. "emoji/rakete" oder "ui/checkmark". */
  name: string;
  size?: number;
  delay?: number;
  loop?: boolean;
  playbackRate?: number;
  /** Einfärben (sinnvoll für `ui/…`). `accent` = Akzentfarbe des Designs. */
  color?: 'accent' | 'ink' | string;
  /** Kurz einfedern statt hart erscheinen. */
  popIn?: boolean;
  style?: React.CSSProperties;
};

export const Lottie: React.FC<LottieProps> = ({name, size = 240, delay = 0, loop = false, playbackRate = 1, color, popIn = true, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender(`Lottie ${name}`));
  const tint = color === 'accent' ? t.c.accentDeep : color === 'ink' ? t.c.ink : color;

  useEffect(() => {
    loadLottie(name)
      .then((d) => {
        setData(tint ? recolor(d, tint) : d);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [name, tint, handle]);

  const s = popIn ? pop(frame, fps, delay, 'snappy') : 1;
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        transform: `scale(${mix(0.5, 1, Math.max(0, s))})`,
        opacity: frame < delay ? 0 : clamp01(s * 2),
        ...style,
      }}
    >
      {data ? <RemotionLottie animationData={data} loop={loop} playbackRate={playbackRate} from={delay} style={{width: size, height: size}} /> : null}
    </div>
  );
};
