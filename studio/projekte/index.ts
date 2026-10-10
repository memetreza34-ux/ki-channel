import type {Project} from './types';
import {projekt as kitKatalog} from './kit-katalog/Video';
import {projekt as designKatalog} from './kit-katalog/DesignKatalog';
import {projekt as kitKatalogErklaeren} from './kit-katalog/ErklaerKatalog';
import {emojiKatalog, uiKatalog} from './kit-katalog/LottieKatalog';
import {effekte2Hell, effekte2Pop, effekteDunkel, effekteHell} from './kit-katalog/EffekteKatalog';
import {medienHell, medienNacht} from './kit-katalog/MedienKatalog';
import {projekt as soundKatalog} from './kit-katalog/SoundKatalog';
import {projekt as soAntwortetKi} from './so-antwortet-ki/Video';
import {projekt as werbungDemo} from './werbung-demo/Video';
import {projekt as kaffee} from './kaffee/Video';
import {projekt as kuehlschrank} from './kuehlschrank/Video';
import {projekt as quizTiere} from './quiz-tiere/Video';
import {projekt as wieDenktKi} from './wie-denkt-ki/Video';
import {lookTests} from './wie-denkt-ki/LookTest';
import {kanalLook} from './kanal-look/Serien';
import {figurProjekt} from './kanal-look/Figur';
import {thumbnail as wieDenktKiThumb} from './wie-denkt-ki/Thumbnail';
import {projekt as kinderZaehlen} from './kinder-zaehlen/Video';
import {projekt as probeSzene} from './probe-szene/Video';
import {projekt as newsProbe} from './news-probe/Video';
import {projekt as dokuProbe} from './doku-probe/Video';
import {projekt as warumKiLuegt} from './warum-ki-luegt/Video';
import {thumbnail as warumKiLuegtThumb} from './warum-ki-luegt/Thumbnail';
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
  soAntwortetKi,
  werbungDemo,
  kaffee,
  kuehlschrank,
  quizTiere,
  wieDenktKi,
  ...lookTests,
  ...kanalLook,
  figurProjekt,
  wieDenktKiThumb,
  kinderZaehlen,
  probeSzene,
  newsProbe,
  dokuProbe,
  warumKiLuegt,
  warumKiLuegtThumb,
  // neu:eintrag
];
