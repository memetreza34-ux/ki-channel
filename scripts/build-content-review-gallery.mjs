import {createHash} from 'node:crypto';
import {access, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {relative, resolve} from 'node:path';

const OUTPUT_ROOT = resolve('out/content-review-gallery');
const MASTERPLAN_ROOT = resolve('out/masterplan-content-release');
const EDGE_ROOT = resolve('out/content-motion-edge-cases');

const REVIEW_CHECK_KEYS = [
  'approved',
  'contentCorrect',
  'noDemoDebug',
  'noFakePrecision',
  'stateChangeClear',
  'endHoldClear',
];

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
const cardManifest = allCards.map((card) => ({
  kind: card.kind,
  id: card.id,
  compositionId: card.compositionId,
  frameCount: card.frames.length,
  hasVideo: Boolean(card.videoPath),
}));

const reviewSeed = {
  version: 1,
  masterplan: masterplanManifest
    ? {
        mode: masterplanManifest.mode,
        sourceFingerprint: masterplanManifest.sourceFingerprint,
        generatedAt: masterplanManifest.generatedAt,
        ids: masterplanCards.map((card) => card.id),
      }
    : null,
  edgeCases: edgeSummary
    ? {
        mode: edgeSummary.mode,
        generatedAt: edgeSummary.generatedAt ?? null,
        ids: edgeCards.map((card) => card.id),
      }
    : null,
  cards: cardManifest,
};
const reviewId = createHash('sha256')
  .update(JSON.stringify(reviewSeed))
  .digest('hex');
const galleryGeneratedAt = new Date().toISOString();

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
  const dataId = escapeHtml(card.id);

  return `
    <article class="review-card" id="review-${index + 1}" data-card-id="${dataId}">
      <header>
        <div>
          <span class="badge ${card.kind}">${card.kind === 'edge' ? 'EDGE CASE' : 'PRODUCTION'}</span>
          <h2>${dataId}</h2>
          <p class="composition">${escapeHtml(card.compositionId)}</p>
        </div>
        <label class="approval"><input type="checkbox" data-card-id="${dataId}" data-review-check="approved" /> visuell geprüft</label>
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
        <label><input type="checkbox" data-card-id="${dataId}" data-review-check="contentCorrect" /> Sprecherinhalt visuell korrekt</label>
        <label><input type="checkbox" data-card-id="${dataId}" data-review-check="noDemoDebug" /> keine Demo-/Debug-Texte</label>
        <label><input type="checkbox" data-card-id="${dataId}" data-review-check="noFakePrecision" /> keine unbelegten exakten Zahlen</label>
        <label><input type="checkbox" data-card-id="${dataId}" data-review-check="stateChangeClear" /> Start → Veränderung → Ergebnis verständlich</label>
        <label><input type="checkbox" data-card-id="${dataId}" data-review-check="endHoldClear" /> End-Hold lesbar und ohne Überlappung</label>
        <label class="notes-label">Review-Notiz<textarea data-card-id="${dataId}" data-review-notes rows="3" placeholder="Optional: Auffälligkeiten oder Begründung"></textarea></label>
      </section>
    </article>`;
};

const serializedCardManifest = JSON.stringify(cardManifest).replaceAll('<', '\\u003c');
const serializedCheckKeys = JSON.stringify(REVIEW_CHECK_KEYS);

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
    .review-tools { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 20px; }
    button { border: 0; border-radius: 14px; padding: 11px 16px; font: inherit; font-weight: 850; cursor: pointer; }
    .primary { background: #8757e8; color: white; }
    .secondary { background: #eee9f6; color: #4e3b72; }
    .review-id { margin-top: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #8a8292; overflow-wrap: anywhere; }
    .review-card { background: #fff; border: 1px solid #ded8e8; border-radius: 28px; padding: 26px; margin: 0 0 28px; box-shadow: 0 18px 48px rgba(42,31,62,.07); }
    .review-card.complete { border-color: rgba(53,197,138,.7); box-shadow: 0 18px 48px rgba(53,197,138,.12); }
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
    .notes-label { display: grid; gap: 7px; margin-top: 8px; font-weight: 750; }
    textarea { width: 100%; resize: vertical; border: 1px solid #d9d1e5; border-radius: 12px; padding: 10px 12px; font: inherit; }
    input { accent-color: #8757e8; }
    @media (max-width: 700px) { main { width: min(100% - 20px, 1500px); padding-top: 14px; } .review-card header { flex-direction: column; } dl { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>Content Release Visual Review</h1>
      <p>Jede der 28 Karten muss vollständig geprüft werden. Der Fortschritt wird lokal pro Review-ID gespeichert. Nach Abschluss den JSON-Nachweis exportieren und als <code>out/content-review-gallery/visual-review.json</code> ablegen.</p>
      <div class="summary">
        <span>${masterplanCards.length} Production-Kompositionen</span>
        <span>${edgeCards.length} Edge Cases</span>
        <span>${allCards.reduce((sum, card) => sum + card.frames.length, 0)} Kontrollframes gefunden</span>
        <span>${allCards.filter((card) => card.videoPath).length} Videos gefunden</span>
        <span id="review-progress">0/${allCards.length} vollständig geprüft</span>
      </div>
      <div class="review-tools">
        <button class="primary" id="export-review" type="button">Review JSON exportieren</button>
        <button class="secondary" id="reset-review" type="button">Lokalen Review-Stand löschen</button>
      </div>
      <div class="review-id">Review-ID: ${reviewId}</div>
    </section>
    ${allCards.length > 0 ? allCards.map(cardHtml).join('\n') : '<div class="missing">Noch keine Masterplan-/Edge-Case-Renderartefakte gefunden. Zuerst den vollständigen Renderlauf ausführen.</div>'}
  </main>
  <script>
    const REVIEW_ID = ${JSON.stringify(reviewId)};
    const CARD_META = ${serializedCardManifest};
    const CHECK_KEYS = ${serializedCheckKeys};
    const STORAGE_KEY = 'content-release-review:' + REVIEW_ID;
    let memoryState = {};

    const emptyCardState = () => ({
      approved: false,
      contentCorrect: false,
      noDemoDebug: false,
      noFakePrecision: false,
      stateChangeClear: false,
      endHoldClear: false,
      notes: '',
    });

    const loadState = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      } catch {
        return memoryState;
      }
    };

    const saveState = (state) => {
      memoryState = state;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // file:// contexts may deny localStorage; in-memory review still works.
      }
    };

    const isComplete = (cardState) =>
      CHECK_KEYS.every((key) => cardState?.[key] === true);

    const updateProgress = () => {
      const state = loadState();
      let complete = 0;
      for (const meta of CARD_META) {
        const cardState = state[meta.id] || emptyCardState();
        const cardElement = document.querySelector('[data-card-id="' + CSS.escape(meta.id) + '"]');
        const done = isComplete(cardState);
        if (done) complete += 1;
        cardElement?.classList.toggle('complete', done);
      }
      const progress = document.getElementById('review-progress');
      if (progress) progress.textContent = complete + '/' + CARD_META.length + ' vollständig geprüft';
    };

    const applyState = () => {
      const state = loadState();
      document.querySelectorAll('[data-review-check]').forEach((input) => {
        const cardId = input.dataset.cardId;
        const key = input.dataset.reviewCheck;
        input.checked = Boolean(state[cardId]?.[key]);
      });
      document.querySelectorAll('[data-review-notes]').forEach((textarea) => {
        textarea.value = state[textarea.dataset.cardId]?.notes || '';
      });
      updateProgress();
    };

    document.querySelectorAll('[data-review-check]').forEach((input) => {
      input.addEventListener('change', () => {
        const state = loadState();
        const cardId = input.dataset.cardId;
        state[cardId] = {...emptyCardState(), ...(state[cardId] || {})};
        state[cardId][input.dataset.reviewCheck] = input.checked;
        saveState(state);
        updateProgress();
      });
    });

    document.querySelectorAll('[data-review-notes]').forEach((textarea) => {
      textarea.addEventListener('input', () => {
        const state = loadState();
        const cardId = textarea.dataset.cardId;
        state[cardId] = {...emptyCardState(), ...(state[cardId] || {})};
        state[cardId].notes = textarea.value;
        saveState(state);
      });
    });

    document.getElementById('reset-review')?.addEventListener('click', () => {
      if (!window.confirm('Lokalen Review-Stand für genau diese Rendergeneration löschen?')) return;
      memoryState = {};
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      applyState();
    });

    document.getElementById('export-review')?.addEventListener('click', () => {
      const state = loadState();
      const cards = CARD_META.map((meta) => {
        const cardState = {...emptyCardState(), ...(state[meta.id] || {})};
        return {
          ...meta,
          approved: cardState.approved === true,
          checks: {
            contentCorrect: cardState.contentCorrect === true,
            noDemoDebug: cardState.noDemoDebug === true,
            noFakePrecision: cardState.noFakePrecision === true,
            stateChangeClear: cardState.stateChangeClear === true,
            endHoldClear: cardState.endHoldClear === true,
          },
          notes: cardState.notes || '',
        };
      });
      const payload = {
        version: 1,
        reviewId: REVIEW_ID,
        reviewedAt: new Date().toISOString(),
        cardCount: cards.length,
        completedCardCount: cards.filter((card) =>
          card.approved && Object.values(card.checks).every(Boolean),
        ).length,
        cards,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2) + '\\n'], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'visual-review.json';
      link.click();
      URL.revokeObjectURL(url);
    });

    applyState();
  </script>
</body>
</html>`;

await mkdir(OUTPUT_ROOT, {recursive: true});
await writeFile(resolve(OUTPUT_ROOT, 'index.html'), html, 'utf8');
await writeFile(
  resolve(OUTPUT_ROOT, 'review-manifest.json'),
  `${JSON.stringify(
    {
      version: 1,
      reviewId,
      generatedAt: galleryGeneratedAt,
      sourceFingerprint: masterplanManifest?.sourceFingerprint ?? null,
      masterplanGeneratedAt: masterplanManifest?.generatedAt ?? null,
      edgeGeneratedAt: edgeSummary?.generatedAt ?? null,
      upstreamMode:
        masterplanManifest?.mode && masterplanManifest.mode === edgeSummary?.mode
          ? masterplanManifest.mode
          : null,
      masterplanCount: masterplanCards.length,
      edgeCaseCount: edgeCards.length,
      totalFrames: allCards.reduce((sum, card) => sum + card.frames.length, 0),
      totalVideos: allCards.filter((card) => card.videoPath).length,
      cards: cardManifest,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `[content-review] Galerie erzeugt: ${resolve(OUTPUT_ROOT, 'index.html')} · Review-ID ${reviewId} · ${masterplanCards.length} Production · ${edgeCards.length} Edge Cases`,
);
