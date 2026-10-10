import {erklaererMetadata, Erklaerer} from './Erklaerer';
import {erklaererSchema, spotSchema, type ErklaererProps, type SpotProps} from './schema';
import {Spot, spotMetadata} from './Spot';
import agentenEditorial from './beispiele/erklaer-agenten-editorial.json';
import kiLiestPapier from './beispiele/erklaer-ki-liest-papier.json';
import spotNacht from './beispiele/spot-kanal-nacht.json';
import spotPop from './beispiele/spot-kanal-pop.json';

export {Erklaerer, erklaererMetadata, erklaererSchema, Spot, spotMetadata, spotSchema};
export type {ErklaererProps, SpotProps};

/** Entfernt Steuerfelder der Beispiel-Dateien (vorlage, formate) und prüft gegen das Schema. */
const alsSpot = (json: object) => spotSchema.parse(json);
const alsErklaerer = (json: object) => erklaererSchema.parse(json);

/** Beispiele als eigene Compositions – zum Ansehen und als Vorlage zum Kopieren. */
export const SPOT_BEISPIELE: Array<{id: string; props: SpotProps}> = [
  {id: 'Beispiel-Spot-Pop', props: alsSpot(spotPop)},
  {id: 'Beispiel-Spot-Nacht', props: alsSpot(spotNacht)},
];

export const ERKLAER_BEISPIELE: Array<{id: string; props: ErklaererProps}> = [
  {id: 'Beispiel-Erklaer-Papier', props: alsErklaerer(kiLiestPapier)},
  {id: 'Beispiel-Erklaer-Agenten', props: alsErklaerer(agentenEditorial)},
];
