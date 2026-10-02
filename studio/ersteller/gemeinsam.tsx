import React, {useEffect, useState} from 'react';
import {Audio, cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {CaptionTrack, FORMATS, FPS, Icon, Lottie, Music, useLayout, type WordCaption} from '../kit';
import type {formatSchema} from './schema';
import type {z} from 'zod';

/** Größenfaktor: Hochformat etwas größer, Querformat deutlich größer (viel Breite). */
export const useScale = () => {
  const {u, isTall, isWide} = useLayout();
  return u * (isTall ? 1.2 : isWide ? 1.35 : 1);
};

/** Maße für calculateMetadata aus dem gewählten Format. */
export const sizeOf = (format: z.infer<typeof formatSchema>) => ({...FORMATS[format], fps: FPS});

/** Held einer Szene: Lottie hat Vorrang vor Icon. */
export const Held: React.FC<{icon?: string; lottie?: string; size: number; delay?: number}> = ({icon, lottie, size, delay = 0}) => {
  if (lottie) return <Lottie name={lottie} size={size} delay={delay} loop />;
  if (icon) return <Icon icon={icon} size={size} delay={delay} animate={icon.startsWith('fluent') || icon.startsWith('logos') ? 'pop' : 'draw'} duration={26} loop="float" />;
  return null;
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
