import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {E, prog} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {Gegenueber, Loop, System, Werkzeuge} from '../agent-loop-explained/panels';

/**
 * Szene 3 — was von selbst weiterlaeuft.
 *
 * Diese Flaechen brauchen keinen neuen Auftritt, um lebendig zu sein: der Loop
 * wandert durch seine Zustaende und zaehlt Runden, im Systemdiagramm laufen
 * Impulse zwischen Kern und Bausteinen, die Schalter kippen.
 */
export const SzeneLoop: React.FC = () => {
  const f = useCurrentFrame();
  const titel = prog(f, 2, 22, E.out);

  return (
    <AbsoluteFill style={{
      background: '#FFFFFF',
      fontFamily: BRAND.font.body,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 34,
      padding: 80,
    }}>
      <div style={{
        fontWeight: 900, fontSize: 56, color: BRAND.accentDk, letterSpacing: -1.4,
        opacity: titel, translate: `0px ${(1 - titel) * 20}px`,
      }}>
        Was von selbst weiterläuft
      </div>

      <Loop at={12} width={1180} proZustand={34}
        zustaende={['Zustand ansehen', 'Schritt planen', 'Aktion ausführen', 'Ergebnis prüfen']} />

      <div style={{display: 'flex', gap: 28, alignItems: 'flex-start'}}>
        <System at={54} width={720} kern="Modell" teile={[
          {name: 'Anweisungen', icon: 'settings-2'},
          {name: 'Werkzeuge', icon: 'wrench'},
          {name: 'Kontext', icon: 'database'},
          {name: 'Grenzen', icon: 'shield-check'},
        ]} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          <Werkzeuge at={92} width={420} titel="Freigaben" werkzeuge={[
            {name: 'Suche', icon: 'search', an: true},
            {name: 'Dateien lesen', icon: 'file-text', an: true},
            {name: 'Dateien ändern', icon: 'file-check', an: false},
          ]} />
          <Gegenueber at={124} width={420}
            links={{titel: 'Chatbot', wert: '1', zusatz: 'Schritt'}}
            rechts={{titel: 'Agent', wert: '12', zusatz: 'Schritte'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
