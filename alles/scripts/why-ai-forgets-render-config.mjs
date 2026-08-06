import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const getWhyAIForgetsRenderConfig = (projectArg) => {
  const reelRoot = projectArg
    ? resolve(projectArg)
    : resolve('..', 'reels', '2026-08-03_bis_2026-08-09', 'freitag', 'reel-01_warum-ki-fruehere-nachrichten-vergisst');

  const contract = JSON.parse(readFileSync(resolve(reelRoot, 'timeline', 'codex-reel-package.json'), 'utf8'));
  const finalSync = JSON.parse(readFileSync(resolve(reelRoot, 'timeline', 'final-sync.json'), 'utf8'));
  const sceneCheckpoints = finalSync.scenes.flatMap((scene) => {
    const duration = scene.endFrame - scene.startFrame;
    return [
      scene.startFrame,
      scene.startFrame + Math.round(duration * 0.5),
      scene.endFrame - 1,
    ];
  });

  return Object.freeze({
    reelRoot,
    entryPoint: 'ki/src/reels/why-ai-forgets-earlier-messages/remotion-entry.tsx',
    compositionId: contract.composition.id,
    coverId: contract.composition.coverId,
    width: contract.composition.width,
    height: contract.composition.height,
    fps: finalSync.fps,
    durationInFrames: finalSync.composition.durationInFrames,
    syncStatus: finalSync.status,
    checkpoints: Object.freeze([...new Set(sceneCheckpoints)].sort((a, b) => a - b)),
    smokeCheckpoints: Object.freeze(finalSync.scenes.map((scene) => scene.startFrame + Math.round((scene.endFrame - scene.startFrame) * 0.55))),
    stillOutput: resolve(reelRoot, 'render'),
    videoOutput: resolve(reelRoot, '06-video', 'final-reel.mp4'),
    coverOutput: resolve(reelRoot, '00-cover', 'final-cover.png'),
    contactSheetOutput: resolve(reelRoot, '05-review', 'contact-sheet.png'),
    reportOutput: resolve(reelRoot, '05-review', 'codex-render-qa.json'),
  });
};