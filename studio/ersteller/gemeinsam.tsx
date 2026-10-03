import React, {useEffect, useState} from 'react';
import {Audio, cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {
  CaptionTrack,
  Confetti,
  FORMATS,
  FPS,
  Icon,
  LightRays,
  Lottie,
  Meteors,
  Music,
  Objekt3D,
  Particles,
  PerspectiveGrid,
  useLayout,
  type Form3D,
  type WordCaption,
} from '../kit';
import type {effektSchema, formatSchema} from './schema';
import type {z} from 'zod';

/** Größenfaktor: Hochformat etwas größer, Querformat deutlich größer (viel Breite). */
export const useScale = () => {
  const {u, isTall, isWide} = useLayout();
  return u * (isTall ? 1.2 : isWide ? 1.35 : 1);
};

/** Maße für calculateMetadata aus dem gewählten Format. */
export const sizeOf = (format: z.infer<typeof formatSchema>) => ({...FORMATS[format], fps: FPS});

/** Held einer Szene: 3D vor Lottie vor Icon. */
export const Held: React.FC<{icon?: string; lottie?: string; objekt3d?: Form3D; size: number; delay?: number}> = ({icon, lottie, objekt3d, size, delay = 0}) => {
  if (objekt3d) return <Objekt3D form={objekt3d} size={size * 1.3} delay={delay} />;
  if (lottie) return <Lottie name={lottie} size={size} delay={delay} loop />;
  if (icon) return <Icon icon={icon} size={size} delay={delay} animate={icon.startsWith('fluent') || icon.startsWith('logos') ? 'pop' : 'draw'} duration={26} loop="float" />;
  return null;
};

/** Atmosphäre hinter einer Szene. */
export const EffektEbene: React.FC<{effekt?: z.infer<typeof effektSchema>}> = ({effekt}) => {
  switch (effekt) {
    case 'strahlen':
      return <LightRays />;
    case 'partikel':
      return <Particles />;
    case 'meteore':
      return <Meteors />;
    case 'raster':
      return <PerspectiveGrid />;
    case 'konfetti':
      return <Confetti at={8} />;
    default:
      return null;
  }
};

/** Lädt Wort-Timings aus studio/public (für Untertitel und Musik-Absenkung). */
const useWortzeiten = (datei?: string) => {
  const [captions, setCaptions] = useState<WordCaption[] | null>(null);
  const [handle] = useState(() => (datei ? delayRender(`Wortzeiten ${datei}`) : null));
  useEffect(() => {
    if (!datei || handle === null) return;
    fetch(staticFile(datei))
      .then((r) => r.json() as Promise<WordCaption[]>)
      .then((c) => {
        setCaptions(c);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [datei, handle]);
  return captions;
};

/** Voiceover, Musik (unter der Stimme abgesenkt) und wortgenaue Untertitel. */
export const Medien: React.FC<{voiceover?: string; musik?: string; wortzeiten?: string}> = ({voiceover, musik, wortzeiten}) => {
  const captions = useWortzeiten(wortzeiten);
  return (
    <>
      {voiceover ? <Audio src={staticFile(voiceover)} /> : null}
      {musik ? <Music src={musik} volume={0.45} captions={captions ?? []} /> : null}
      {captions ? <CaptionTrack captions={captions} /> : null}
    </>
  );
};
