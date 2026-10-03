import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption as WordCaption} from '@remotion/captions';
import {useLayout} from './layout';
import {clamp01, mix, pop, progress} from './motion';
import {useTheme, type Theme} from './themes';

export type {WordCaption};

const useCaptionBox = () => {
  const {safe, isTall} = useLayout();
  return {
    bottom: safe.captionBottom,
    side: isTall ? 104 : safe.side,
    fontSize: isTall ? 54 : 46,
  };
};

const boxStyle = (t: Theme, fontSize: number): React.CSSProperties => ({
  fontFamily: t.font.body,
  fontSize,
  fontWeight: 800,
  lineHeight: 1.18,
  letterSpacing: '-0.015em',
  color: t.c.ink,
  textAlign: 'center',
  background: t.c.surface,
  borderRadius: 28 * t.radius,
  padding: '18px 30px 20px',
  boxShadow: t.shadow.soft,
  border: t.border ?? undefined,
});

type CaptionProps = {
  text: string;
  delay?: number;
  /** Frames sichtbar; ohne Angabe bis Szenenende. */
  duration?: number;
};

/** Untertitel als ganzer Satzblock (ohne Wort-Timing). */
export const Caption: React.FC<CaptionProps> = ({text, delay = 0, duration}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const box = useCaptionBox();
  const enter = progress(frame, delay, 10, 'out');
  const exit = duration === undefined ? 0 : progress(frame, delay + duration - 8, 8, 'in');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginBottom: box.bottom,
          maxWidth: `calc(100% - ${box.side * 2}px)`,
          opacity: enter * (1 - exit),
          transform: `translateY(${(1 - enter) * 14}px)`,
          ...boxStyle(t, box.fontSize),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

type CaptionTrackProps = {
  /** Wort-Timings, z. B. aus `npm run untertitel`. */
  captions: WordCaption[];
  /** Wörter innerhalb dieser Zeitspanne bilden eine Seite. */
  pageMs?: number;
  highlightColor?: string;
};

/** Wortgenaue Untertitel zum Voiceover: aktuelles Wort wird farbig. */
export const CaptionTrack: React.FC<CaptionTrackProps> = ({captions, pageMs = 1100, highlightColor: highlightProp}) => {
  const t = useTheme();
  const highlightColor = highlightProp ?? t.c.accentDeep;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const box = useCaptionBox();
  const {pages} = useMemo(
    () => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: pageMs}),
    [captions, pageMs],
  );
  const nowMs = (frame / fps) * 1000;
  const page = pages.find((p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs);
  if (!page) return null;
  const pageFrame = Math.round((page.startMs / 1000) * fps);
  const s = pop(frame, fps, pageFrame, 'snappy');

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginBottom: box.bottom,
          maxWidth: `calc(100% - ${box.side * 2}px)`,
          whiteSpace: 'pre-wrap',
          opacity: clamp01(s * 2),
          transform: `scale(${mix(0.92, 1, s)})`,
          ...boxStyle(t, box.fontSize),
        }}
      >
        {page.tokens.map((token) => {
          const active = nowMs >= token.fromMs && nowMs < token.toMs;
          return (
            <span key={token.fromMs} style={{color: active ? highlightColor : undefined}}>
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
