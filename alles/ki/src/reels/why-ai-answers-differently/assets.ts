import {staticFile} from 'remotion';
export const differentAnswersAsset=(id:'voiceover'):string=>{if(id==='voiceover')return staticFile('reels/why-ai-answers-differently/audio/voiceover.wav');throw new Error(`Unbekanntes Asset: ${String(id)}`);};
