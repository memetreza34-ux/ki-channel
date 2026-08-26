import reelData from '../../../reels/2026-08-24_bis_2026-08-30/05_ChatGPT-Apple-Messages-auf-dem-Mac/06-projektdateien/reel.json';
import captionData from '../../../reels/2026-08-24_bis_2026-08-30/05_ChatGPT-Apple-Messages-auf-dem-Mac/03-caption/subtitle-cues.json';
import sfxData from '../../../reels/2026-08-24_bis_2026-08-30/05_ChatGPT-Apple-Messages-auf-dem-Mac/06-projektdateien/sfx-resolved.json';

export const APPLE_MESSAGES_COMPOSITION_ID = reelData.compositionId;
export const APPLE_MESSAGES_WIDTH = reelData.format.width;
export const APPLE_MESSAGES_HEIGHT = reelData.format.height;
export const APPLE_MESSAGES_FPS = reelData.format.fps;
export const APPLE_MESSAGES_DURATION_IN_FRAMES = reelData.format.finalDurationInFrames ?? reelData.format.planningDurationInFrames;

export type AppleMessagesScene = (typeof reelData.scenes)[number];
export type AppleMessagesCue = (typeof captionData.cues)[number];

export const APPLE_MESSAGES_SCENES = reelData.scenes as AppleMessagesScene[];
export const APPLE_MESSAGES_CUES = captionData.cues as AppleMessagesCue[];
export const APPLE_MESSAGES_SFX = sfxData.events;
