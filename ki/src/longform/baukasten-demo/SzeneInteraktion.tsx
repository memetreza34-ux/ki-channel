import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  ButtonPress, Cursor, E, LoadingPulse, PerCharRise,
  ToggleSwitch, TooltipPop, prog,
} from '@studio/core';
import {BRAND} from '../../../brand/brand';
import {Freigabe} from '../agent-loop-explained/panels';

/**
 * Szene 5 — Mikro-Interaktionen.
 *
 * Ein Zeiger faehrt durchs Bild und bedient die Oberflaeche: er klickt einen
 * Knopf, legt einen Schalter um, oeffnet einen Dialog. Das zeigt Bedienung als
 * Vorgang, nicht als Standbild — und es sind wieder andere Bewegungsarten als
 * in den Szenen davor.
 *
 * Alle Bausteine kommen aus `@studio/core`; sie waren da, nur nie benutzt.
 */
export const SzeneInteraktion: React.FC = () => {
  const f = useCurrentFrame();
  const purple = BRAND.accentDk;

  return (
    <AbsoluteFill style={{background: '#FFFFFF', fontFamily: BRAND.font.body}}>
      <div style={{
        position: 'absolute', top: 96, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <PerCharRise text="Bedienung als Vorgang" at={2} per={1.6} size={54}
          color={purple} weight={900} />
      </div>

      {/* Knopf wird gedrueckt */}
      <ButtonPress label="Analyse starten" cx={420} cy={420} at={30} width={330} />

      {/* Schalter kippt um */}
      <ToggleSwitch label="Dateien ändern erlauben" cx={1240} cy={420} at={62} />

      {/* Ladepuls, waehrend gearbeitet wird */}
      <div style={{opacity: prog(f, 84, 104, E.out)}}>
        <LoadingPulse cx={420} cy={640} color={purple} size={22} />
      </div>

      {/* Hinweis erscheint am Element */}
      <TooltipPop text="Braucht eine Bestätigung" x={1240} y={620} at={96} />

      {/* Dialog kommt nach vorn.
          Nicht ModalPopIn aus dem Kit: das dunkelt den ganzen Schirm ab und
          ist fuer dunkle Hintergruende gebaut — der Kanal ist weiss. */}
      <div style={{
        position: 'absolute', left: '50%', top: 620,
        translate: '-50% 0px',
      }}>
        <Freigabe
          at={122}
          width={760}
          aktion={'Datei „anforderungen.md" überschreiben'}
          warnung="Das lässt sich nicht rückgängig machen."
        />
      </div>

      {/* Der Zeiger faehrt die Stationen ab und klickt jeweils zu */}
      <Cursor
        size={40}
        color={BRAND.ink}
        path={[
          {x: 300, y: 300, at: 16},
          {x: 420, y: 420, at: 30, clickAt: 34},
          {x: 1240, y: 420, at: 60, clickAt: 66},
          {x: 1240, y: 620, at: 94},
          {x: 960, y: 560, at: 120, clickAt: 126},
        ]}
      />
    </AbsoluteFill>
  );
};
