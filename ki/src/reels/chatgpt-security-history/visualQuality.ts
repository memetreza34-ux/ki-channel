import {assertVisualQualityV4,type VisualQualityV4Contract} from '../../visual-system/visualQualityV4';
import manifest from '../../../reels/2026-09-28_bis_2026-10-04/01_ChatGPT-Sicherheitsverlauf/06-projektdateien/visual-quality-v4.json';

export const VISUAL_QUALITY_V4 = manifest as VisualQualityV4Contract;
assertVisualQualityV4(VISUAL_QUALITY_V4);
