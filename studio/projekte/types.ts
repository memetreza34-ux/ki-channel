import type React from 'react';
import type {FormatName} from '../kit/theme';

export type Project = {
  /** Composition-ID, z. B. "So-Antwortet-KI". Nur Buchstaben, Zahlen, Bindestrich. */
  id: string;
  // Remotion-Compositions akzeptieren beliebige Props-Typen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  /**
   * Ein Format oder mehrere. Bei mehreren heißt die erste Composition wie `id`,
   * die weiteren `<id>-<format>` (z. B. "Werbung-Demo-square").
   */
  format: FormatName | FormatName[];
  durationInFrames: number;
  fps?: number;
};
