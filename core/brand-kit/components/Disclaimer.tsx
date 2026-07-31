import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, sec, prog, lerpF, life, a, E } from '../tokens';
import { FONT } from '../fonts';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · HAFTUNGSAUSSCHLUSS (Intro, NICHT gesprochen)
//  Läuft am Anfang JEDES Videos ~10s. Schützt rechtlich (keine Anlageberatung).
//  Format-agnostisch (9:16 & 16:9). Kein Audio.
// ════════════════════════════════════════════════════════════════════════════

const PARAS: { lead?: string; text: string; accent?: string }[] = [
  { text: 'Die Inhalte dieses Videos stellen ausschließlich meine persönliche Meinung dar und dienen allein zu Informations- und Unterhaltungszwecken.' },
  { lead: 'Keine Anlageberatung.', text: 'Dies ist ausdrücklich keine Anlageberatung, Anlagevermittlung oder Kaufempfehlung im Sinne des § 85 WpHG (Wertpapierhandelsgesetz).', accent: C.gold },
  { text: 'Alle Angaben erfolgen ohne Gewähr. Für Richtigkeit, Vollständigkeit und Aktualität wird keine Haftung übernommen.' },
  { lead: 'Risiko.', text: 'Investitionen in Aktien, ETFs, Krypto und andere Finanzprodukte bergen erhebliche Risiken bis zum Totalverlust.', accent: C.negative },
  { text: 'Triff deine Entscheidungen eigenverantwortlich und ziehe im Zweifel einen unabhängigen, lizenzierten Finanzberater hinzu.' },
];

export const Disclaimer: React.FC<{ durationInSeconds?: number }> = ({ durationInSeconds = 10 }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const end = sec(durationInSeconds);
  const vertical = H >= W;

  // responsive Größen
  const pad = vertical ? 90 : 160;
  const headSize = vertical ? 58 : 64;
  const bodySize = vertical ? 33 : 30;
  const maxW = vertical ? W - pad * 2 : 1280;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 80% at 50% 0%, #0E1F14 0%, ${C.bg} 60%)`,
      opacity: life(f, 0, end, 10), alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: maxW, paddingInline: pad }}>

        {/* Kopf */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18,
          opacity: prog(f, sec(0.2), sec(0.8)), transform: `translateY(${lerpF(f, 18, 0, sec(0.2), sec(0.9))}px)` }}>
          <div style={{ fontSize: headSize }}>⚠️</div>
          <div style={{ fontFamily: FONT.title, fontSize: headSize, color: C.white, letterSpacing: 1 }}>HAFTUNGSAUSSCHLUSS</div>
        </div>
        <div style={{ width: lerpF(f, 0, maxW - pad * 2, sec(0.6), sec(1.4)), height: 4,
          background: a('var(--accent)', 0.8), borderRadius: 2, marginTop: 16, marginBottom: 34 }} />

        {/* Absätze — gestaffelt rein */}
        {PARAS.map((p, i) => {
          const at = sec(1.0 + i * 0.45);
          return (
            <div key={i} style={{ marginBottom: vertical ? 26 : 18,
              opacity: prog(f, at, at + sec(0.5)), transform: `translateY(${lerpF(f, 14, 0, at, at + sec(0.5))}px)` }}>
              <span style={{ fontFamily: FONT.body, fontWeight: 500, fontSize: bodySize, color: a(C.white, 0.86), lineHeight: 1.5 }}>
                {p.lead && <strong style={{ color: p.accent ?? 'var(--accent)', fontWeight: 800 }}>{p.lead} </strong>}
                {p.text}
              </span>
            </div>
          );
        })}

        {/* Fußnote */}
        <div style={{ marginTop: 22, fontFamily: FONT.body, fontWeight: 600, fontSize: bodySize * 0.8, color: a(C.gray, 0.7),
          opacity: prog(f, sec(3.6), sec(4.2)) }}>
          FinanzNeo · Bildung, keine Beratung
        </div>
      </div>

      {/* dünner Fortschrittsbalken unten = „läuft gleich weiter" */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 5,
        width: `${prog(f, sec(0.4), end - sec(0.4)) * 100}%`, background: a('var(--accent)', 0.7) }} />
    </AbsoluteFill>
  );
};
