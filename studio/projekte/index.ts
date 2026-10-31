import type {Project} from './types';
import {projekt as kitKatalog} from './kit-katalog/Video';
import {projekt as designKatalog} from './kit-katalog/DesignKatalog';
import {projekt as kitKatalogErklaeren} from './kit-katalog/ErklaerKatalog';
import {emojiKatalog, uiKatalog} from './kit-katalog/LottieKatalog';
import {effekte2Hell, effekte2Pop, effekteDunkel, effekteHell} from './kit-katalog/EffekteKatalog';
import {medienHell, medienNacht} from './kit-katalog/MedienKatalog';
import {projekt as soundKatalog} from './kit-katalog/SoundKatalog';
import {projekt as werbungDemo} from './werbung-demo/Video';
import {daten} from './wissen/Daten';
import {szenen} from './wissen/Szenen';
import {faecher} from './wissen/Faecher';
import {werkzeuge} from './wissen/WerkzeugBeispiele';
// neu:import

export const PROJEKTE: Project[] = [
  kitKatalog,
  designKatalog,
  kitKatalogErklaeren,
  emojiKatalog,
  uiKatalog,
  effekteHell,
  effekteDunkel,
  effekte2Hell,
  effekte2Pop,
  medienHell,
  medienNacht,
  soundKatalog,
  werbungDemo,
  ...daten,
  ...szenen,
  ...faecher,
  ...werkzeuge,
  // neu:eintrag
];
