import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS} from '../../kit/theme';
import type {Project} from '../types';
import {KANAL, SERIEN} from '../kanal-look/stil';
import clips from './clips.json';

/**
 * Shorts (1080×1920) aus den fertigen Langvideos: Hook-Frage oben, Ausschnitt in voller Breite, Wort-Untertitel darunter.
 * Ausschnitte und Wortzeiten kommen aus `schneiden.py` → `clips.json` + `public/shorts/<id>.mp4`.
 */

type Wort = [number, number, string];
type Clip = {id: string; quelle: 'strom' | 'luegt' | 'gpt6'; dauer: number; titel: string; woerter: Wort[]};

const LOOK = {
  strom: {akzent: SERIEN.recht.farbe, tint: SERIEN.recht.tint, serie: 'KI erklärt'},
  luegt: {akzent: KANAL.fehler, tint: '#FDE3E4', serie: 'KI erklärt'},
  gpt6: {akzent: SERIEN.news.farbe, tint: SERIEN.news.tint, serie: 'KI-News'},
};

const VIDEO_Y = 650;
const VIDEO_H = 608;

/** Titel mit *Akzentwort*. */
const Titel: React.FC<{text: string; akzent: string}> = ({text, akzent}) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((teil, i) =>
      teil.startsWith('*') ? (
        <span key={i} style={{color: akzent}}>
          {teil.slice(1, -1)}
        </span>
      ) : (
        <React.Fragment key={i}>{teil}</React.Fragment>
      ),
    )}
  </>
);

/** Wörter zu kurzen Zeilen bündeln: max. 3 Wörter, Satzzeichen beendet eine Zeile. */
const zeilen = (woerter: Wort[]) => {
  const raus: Wort[][] = [];
  let cur: Wort[] = [];
  for (const w of woerter) {
    cur.push(w);
    if (cur.length >= 3 || /[.,?!:–]$/.test(w[2]) || cur.map((x) => x[2]).join(' ').length > 18) {
      raus.push(cur);
      cur = [];
    }
  }
  if (cur.length) raus.push(cur);
  return raus;
};

const Untertitel: React.FC<{woerter: Wort[]; akzent: string}> = ({woerter, akzent}) => {
  const t = useCurrentFrame() / FPS;
  const gruppen = zeilen(woerter);
  const idx = gruppen.findIndex((g, i) => t >= g[0][0] - 0.1 && (i === gruppen.length - 1 || t < gruppen[i + 1][0][0] - 0.1));
  if (idx < 0) return null;
  const g = gruppen[idx];
  const jetzt = g.filter((x) => t >= x[0] - 0.05).length - 1;
  if (t > g[g.length - 1][1] + 0.8) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1310, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 80, lineHeight: 1.12, letterSpacing: '-0.03em', color: KANAL.ink}}>
      {g.map((w, i) => {
        const aktiv = t >= w[0] - 0.05;
        return (
          <span key={i} style={{color: aktiv ? KANAL.ink : '#B9BDC4', marginRight: i < g.length - 1 ? '0.25em' : 0}}>
            {i === jetzt ? <span style={{background: akzent, color: '#FFFFFF', borderRadius: 18, padding: '0 14px'}}>{w[2]}</span> : w[2]}
          </span>
        );
      })}
    </div>
  );
};

const Short: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const look = LOOK[clip.quelle];
  const rein = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  return (
    <AbsoluteFill style={{background: KANAL.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 700px at 85% 12%, ${look.tint}, transparent 70%), radial-gradient(800px 600px at 10% 85%, ${look.tint}99, transparent 70%)`}} />
      {/* Serie */}
      <div style={{position: 'absolute', left: 70, top: 230, display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase', color: look.akzent}}>
        <div style={{width: 14, height: 14, borderRadius: '50%', background: look.akzent}} />
        {look.serie}
      </div>
      {/* Hook */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 290,
          height: 330,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          fontSize: 88,
          lineHeight: 1.06,
          letterSpacing: '-0.045em',
          color: KANAL.ink,
          opacity: rein,
          transform: `translateY(${(1 - rein) * 30}px)`,
        }}
      >
        <div>
          <Titel text={clip.titel} akzent={look.akzent} />
        </div>
      </div>
      {/* Ausschnitt */}
      <div style={{position: 'absolute', left: 0, top: VIDEO_Y, width: 1080, height: VIDEO_H, boxShadow: '0 20px 50px rgba(20,24,30,0.12)'}}>
        <OffthreadVideo src={staticFile(`shorts/${clip.id}.mp4`)} style={{width: 1080, height: VIDEO_H, display: 'block'}} />
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: look.akzent}} />
      </div>
      <Untertitel woerter={clip.woerter} akzent={look.akzent} />
    </AbsoluteFill>
  );
};

export const shorts: Project[] = (clips as Clip[]).map((clip) => {
  const Komp: React.FC = () => <Short clip={clip} />;
  return {
    id: `Short-${clip.id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('-')}`,
    component: Komp,
    format: 'vertical',
    durationInFrames: Math.round(clip.dauer * FPS),
    ordner: 'Shorts',
  };
});
