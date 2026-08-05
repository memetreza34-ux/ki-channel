/**
 * Font loading for remotion-scenes
 */

import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadInter("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const font = fontFamily;
