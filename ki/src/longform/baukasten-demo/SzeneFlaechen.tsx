import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {E, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {Chat, Dateien, Log, Suche} from '../agent-loop-explained/panels';

/**
 * Szene 2 — die Flaechen arbeiten.
 *
 * Vier Oberflaechen nebeneinander, jede mit eigener Mechanik: der Chat tippt,
 * die Suche fuellt sich, die Dateiliste klappt auf, das Log hakt Schritte ab.
 * Nichts davon ist ein Sinnbild — es ist jeweils die Sache selbst.
 */
export const SzeneFlaechen: React.FC = () => {
  const f = useCurrentFrame();
  const titel = prog(f, 2, 22, E.out);

  return (
    <AbsoluteFill style={{
      background: '#FFFFFF',
      fontFamily: BRAND.font.body,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 40,
      padding: 80,
    }}>
      <div style={{
        fontWeight: 900, fontSize: 56, color: BRAND.accentDk, letterSpacing: -1.4,
        opacity: titel, translate: `0px ${(1 - titel) * 20}px`,
      }}>
        Oberflächen, keine Symbole
      </div>

      <div style={{display: 'flex', gap: 28, alignItems: 'flex-start'}}>
        <Chat
          at={14}
          width={560}
          frage="Finde den günstigsten Anbieter."
          zeilen={2}
          wartet
        />
        <Suche
          at={40}
          width={520}
          anfrage="anbieter preis 2026"
          treffer={['anbieter-a · 49 €', 'anbieter-b · 39 €', 'anbieter-c · 61 €']}
        />
      </div>

      <div style={{display: 'flex', gap: 28, alignItems: 'flex-start'}}>
        <Dateien
          at={78}
          width={540}
          titel="Belege"
          dateien={[
            {name: 'angebot-a.pdf', groesse: '240 KB', status: 'ok'},
            {name: 'angebot-b.pdf', groesse: '198 KB', status: 'konflikt'},
          ]}
        />
        <Log
          at={104}
          width={560}
          titel="agent · läuft"
          proSchritt={22}
          schritte={['Belege gelesen', 'Preise verglichen', 'Konflikt gefunden', 'Nachgefragt']}
        />
      </div>
    </AbsoluteFill>
  );
};
