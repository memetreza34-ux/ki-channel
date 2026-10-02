import type {Project} from './types';
import {projekt as kitKatalog} from './kit-katalog/Video';
import {projekt as kitKatalogErklaeren} from './kit-katalog/ErklaerKatalog';
import {projekt as soundKatalog} from './kit-katalog/SoundKatalog';
import {projekt as soAntwortetKi} from './so-antwortet-ki/Video';
import {projekt as werbungDemo} from './werbung-demo/Video';
// neu:import

export const PROJEKTE: Project[] = [
  kitKatalog,
  kitKatalogErklaeren,
  soundKatalog,
  soAntwortetKi,
  werbungDemo,
  // neu:eintrag
];
