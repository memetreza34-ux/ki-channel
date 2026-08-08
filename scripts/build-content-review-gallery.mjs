import {access, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {relative, resolve} from 'node:path';

const OUTPUT_ROOT = resolve('out/content-review-gallery');
const MASTERPLAN_ROOT = resolve('out/masterplan-content-release');
const EDGE_ROOT = resolve('out/content-motion-edge-cases');

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const hrefFromGallery = (path) =>
  relative(OUTPUT_ROOT, resolve(path)).replaceAll('\\', '/');

const listFrames = async (directory) => {
  if (!(await exists(directory))) return [];
  return (await readdir(directory))
    .filter((fileName) => /^frame-\d+\.png$/i.test(fileName))
    .sort()
    .map((fileName) => resolve(directory, fileName));
};

const renderMedia = async (directory) => {
  const frames = await listFrames(directory);
  const videoPath = resolve(directory, 'content-matched.mp4');
  const videoExists = await exists(videoPath);
  return {
    frames,
    videoPath: videoExists ? videoPath : null,
  };
};

const masterplanManifestPath = resolve(MASTERPLAN_ROOT, 'manifest.json');
const edgeSummaryPath = resolve(EDGE_ROOT, 'edge-case-render-summary.json');

const masterplanManifest = await exists(masterplanManifestPath)
  ? await readJson(masterplanManifestPath)
  : null;
const edgeSummary = await exists(edgeSummaryPath)
  ? await readJson(edgeSummaryPath)
  : null;

const masterplanCards = [];
for (const result of masterplanManifest?.results ?? []) {
  const directory = resolve(MASTERPLAN_ROOT, result.animationId);
  const propsPath = resolve(directory, 'masterplan-render-props.json');
  const props = await exists(propsPath) ? await readJson(propsPath) : null;
  const media = await renderMedia(directory);
  masterplanCards.push({
    kind: 'production',
    id: result.animationId,
    compositionId: result.compositionId,
    spokenText: props?.content?.spokenText ?? '',
    startState: props?.content?.meaningContract?.startState ?? '',
    visibleChange: props?.content?.meaningContract?.visibleChange ?? '',
    endState: props?.content?.meaningContract?.endState ?? '',
    expectedBehavior: '',
    ...media,
  });
}

const edgeCards = [];
for (const edgeCase of edgeSummary?.cases ?? []) {
  const directory = resolve(EDGE_ROOT, edgeCase.id);
  const propsPath = resolve(EDGE_ROOT, '.inputs', `${edgeCase.id}.json`);
  const props = await exists(propsPath) ? await readJson(propsPath) : null;
  const media = await renderMedia(directory);
  edgeCards.push({
    kind: 'edge',
    id: edgeCase.id,
    compositionId: edgeCase.animationId,
    spokenText: props?.content?.spokenText ?? '',
    startState: props?.content?.meaningContract?.startState ?? '',
    visibleChange: props?.content?.meaningContract?.visibleChange ?? '',
    endState: props?.content?.meaningContract?.endState ?? '',
    expectedBehavior: edgeCase.expectedBehavior ?? '',
    ...media,
  });
}

const allCards = [...masterplanCards, ...edgeCards];

const cardHtml = (card, index) => {
  const frameHtml = card.frames.length > 0
    ? card.frames
        .map(
          (framePath) => `
            <figure>
              <img src="${escapeHtml(hrefFromGallery(framePath))}" loading="lazy" alt="${escapeHtml(card.id)} Kontrollframe" />
              <figcaption>${escapeHtml(framePath.split('/').at(-1))}</figcaption>
            </figure>`,
        )
        .join('')
    : '<div class="missing">Keine Kontrollframes vorhanden.</div>';

  const videoHtml = card.videoPath
    ? `<video controls preload="metadata" src="${escapeHtml(hrefFromGallery(card.videoPath))}"></video>`
    : '<div class="missing">Kein Video vorhanden.</div>';

  return `
    <article class="review-card" id="review-${index + 1}">
      <header>
        <div>
          <span class="badge ${card.kind}">${card.kind === 'edge' ? 'EDGE CASE' : 'PRODUCTION'}</span>
          <h2>${escapeHtml(card.id)}</h2>
          <p class="composition">${escapeHtml(card.compositionId)}</p>
        </div>
        <label class="approval"><input type="checkbox" /> visuell geprüft</label>
      </header>

      <section class="copy">
        <h3>Sprechertext</h3>
        <p>${escapeHtml(card.spokenText) || '—'}</p>
        ${card.expectedBehavior ? `<h3>Expected Behavior</h3><p>${escapeHtml(card.expectedBehavior)}</p>` : ''}
      </section>

      <details>
        <summary>Meaning Contract</summary>
        <dl>
          <dt>Start</dt><dd>${escapeHtml(card.startState) || '—'}</dd>
          <dt>Veränderung</dt><dd>${escapeHtml(card.visibleChange) || '—'}</dd>
          <dt>Ergebnis</dt><dd>${escapeHtml(card.endState) || '—'}</dd>
        </dl>
      </details>

      <section>
        <h3>Kontrollframes</h3>
        <div class="frames">${frameHtml}</div>
      </section>

      <section>
        <h3>Video</h3>
        ${videoHtml}
      </section>

      <section class="checklist">
        <h3>Prüfpunkte</h3>
        <label><input type="checkbox" /> Sprecherinhalt visuell korrekt</label>
        <label><input type="checkbox" /> keine Demo-/Debug-Texte</label>
        <label><input type="checkbox" /> keine unbelegten exakten Zahlen</label>
        <label><input type="checkbox" /> Start → Veränderung → Ergebnis verständlich</label>
        <label><input type="checkbox" /> End-Hold lesbar und ohne Überlappung</label>
      </section>
    </article>`;
};

const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Content Release Visual Review</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f3f1f7; color: #17141d; }
    main { width: min(1500px, calc(100% - 40px)); margin: 0 auto; padding: 38px 0 90px; }
    .hero { background: #fff; border: 1px solid #ded8e8; border-radius: 28px; padding: 30px; margin-bottom: 28px; box-shadow: 0 18px 48px rgba(42,31,62,.08); }
    .hero h1 { margin: 0 0 10px; font-size: 34px; }
    .hero p { margin: 6px 0; color: #6f6878; }
    .summary { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
    .summary span, .badge { display: inline-flex; border-radius: 999px; padding: 8px 12px; font-size: 12px; font-weight: 800; letter-spacing: .06em; }
    .summary span { background: #f0ebfb; color: #7042c6; }
    .review-card { background: #fff; border: 1px solid #ded8e8; border-radius: 28px; padding: 26px; margin: 0 0 28px; box-shadow: 0 18px 48px rgba(42,31,62,.07); }
    .review-card header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }
    .review-card h2 { margin: 10px 0 3px; font-size: 24px; overflow-wrap: anywhere; }
    .review-card h3 { margin: 22px 0 8px; font-size: 15px; text-transform: uppercase; letter-spacing: .06em; color: #6f6878; }
    .composition { margin: 0; color: #8a8292; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .badge.production { background: #ece5fb; color: #7042c6; }
    .badge.edge { background: #fff1d9; color: #9c6500; }
    .approval { font-weight: 800; white-space: nowrap; }
    .copy p { font-size: 18px; line-height: 1.55; }
    details { margin-top: 18px; background: #faf9fc; border-radius: 18px; padding: 14px 18px; }
    summary { cursor: pointer; font-weight: 800; }
    dl { display: grid; grid-template-columns: 120px 1fr; gap: 10px 18px; }
    dt { font-weight: 800; color: #7042c6; }
    dd { margin: 0; line-height: 1.45; }
    .frames { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
    figure { margin: 0; background: #18151e; border-radius: 18px; overflow: hidden; }
    img { display: block; width: 100%; aspect-ratio: 9 / 16; object-fit: contain; background: #18151e; }
    figcaption { padding: 8px 10px; color: #d8d2df; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
    video { width: min(360px, 100%); aspect-ratio: 9 / 16; background: #18151e; border-radius: 18px; }
    .missing { padding: 18px; background: #fff4f4; border: 1px solid #ffd0d0; border-radius: 14px; color: #9b3434; }
    .checklist { display: grid; gap: 8px; }
    .checklist h3 { margin-bottom: 4px; }
    input { accent-color: #8757e8; }
    @media (max-width: 700px) { main { width: min(100% - 20px, 1500px); padding-top: 14px; } .review-card header { flex-direction: column; } dl { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>Content Release Visual Review</h1>
      <p>Diese Galerie ist für die manuelle Freigabe nach dem technischen Release gedacht. Ein Häkchen im Browser ist nur eine lokale Review-Hilfe und kein automatischer Release-Status.</p>
      <div class="summary">
        <span>${masterplanCards.length} Production-Kompositionen</span>
        <span>${edgeCards.length} Edge Cases</span>
        <span>${allCards.reduce((sum, card) => sum + card.frames.length, 0)} Kontrollframes gefunden</span>
        <span>${allCards.filter((card) => card.videoPath).length} Videos gefunden</span>
      </div>
    </section>
    ${allCards.length > 0 ? allCards.map(cardHtml).join('\n') : '<div class="missing">Noch keine Masterplan-/Edge-Case-Renderartefakte gefunden. Zuerst den vollständigen Renderlauf ausführen.</div>'}
  </main>
</body>
</html>`;

await mkdir(OUTPUT_ROOT, {recursive: true});
await writeFile(resolve(OUTPUT_ROOT, 'index.html'), html, 'utf8');
await writeFile(
  resolve(OUTPUT_ROOT, 'review-manifest.json'),
  `${JSON.stringify(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      masterplanCount: masterplanCards.length,
      edgeCaseCount: edgeCards.length,
      totalFrames: allCards.reduce((sum, card) => sum + card.frames.length, 0),
      totalVideos: allCards.filter((card) => card.videoPath).length,
      cards: allCards.map((card) => ({
        kind: card.kind,
        id: card.id,
        compositionId: card.compositionId,
        frameCount: card.frames.length,
        hasVideo: Boolean(card.videoPath),
      })),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `[content-review] Galerie erzeugt: ${resolve(OUTPUT_ROOT, 'index.html')} · ${masterplanCards.length} Production · ${edgeCards.length} Edge Cases`,
);
