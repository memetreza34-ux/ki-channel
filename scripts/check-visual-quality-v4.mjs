#!/usr/bin/env node
import {access, readdir, readFile} from 'node:fs/promises';
import {dirname, relative, resolve} from 'node:path';
import {futureReelNeedsV4, validateVisualQualityV4Manifest} from './visual-quality-v4-contract.mjs';

const root = resolve('.');
const reelsRoot = resolve('ki/reels');
const failures = [];
const display = (path) => relative(root, path) || '.';
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const read = async (path) => { try { return await readFile(path, 'utf8'); } catch { return ''; } };
const phase1Finished = (text) => {
  const block = text.match(/## Phase 1[^\n]*\n([\s\S]*?)(?=\n## Phase 2|$)/i)?.[0] ?? '';
  return /\*\*Status:\*\*\s*FERTIG\b/i.test(block) || /\*\*FERTIG(?:\s*\/[^*]+)?\*\*/i.test(block);
};

for (const week of await readdir(reelsRoot, {withFileTypes: true})) {
  if (!week.isDirectory() || !/^\d{4}-\d{2}-\d{2}_bis_/.test(week.name) || !futureReelNeedsV4(week.name)) continue;
  const weekRoot = resolve(reelsRoot, week.name);
  for (const reel of await readdir(weekRoot, {withFileTypes: true})) {
    if (!reel.isDirectory() || !/^\d{2}_/.test(reel.name)) continue;
    const project = resolve(weekRoot, reel.name, '06-projektdateien');
    const phase = await read(resolve(project, 'PHASE-STATUS.md'));
    if (!phase1Finished(phase)) continue;

    const manifestPath = resolve(project, 'visual-quality-v4.json');
    if (!(await exists(manifestPath))) {
      failures.push(`${display(manifestPath)} fehlt. Phase-1-fertige Reels ab Woche 2026-09-28 benötigen Visual Quality V4.`);
      continue;
    }

    let manifest;
    try {
      manifest = JSON.parse(await read(manifestPath));
    } catch (error) {
      failures.push(`${display(manifestPath)} ist ungültiges JSON: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    failures.push(...validateVisualQualityV4Manifest(manifest, {label: display(manifestPath)}));

    const sourceContract = manifest?.sourceQualityContract;
    if (typeof sourceContract === 'string') {
      const sourcePath = resolve(sourceContract);
      if (!(await exists(sourcePath))) failures.push(`${display(manifestPath)}: sourceQualityContract fehlt: ${sourceContract}`);
      else {
        const source = await read(sourcePath);
        if (!source.includes('assertVisualQualityV4(')) failures.push(`${sourceContract}: muss assertVisualQualityV4(...) ausführen.`);
        if (!source.includes('VISUAL_QUALITY_V4')) failures.push(`${sourceContract}: exportiere einen klar benannten VISUAL_QUALITY_V4 Contract.`);
      }
    }

    const strategyPath = resolve(project, 'visual-strategy.md');
    const strategy = await read(strategyPath);
    for (const marker of ['Start state', 'Visible change', 'End state', 'Visual verb', 'Recognition cues', 'Hero meaning', 'Payoff']) {
      if (!strategy.includes(marker)) failures.push(`${display(strategyPath)}: V4 Visual-Story-Marker fehlt: "${marker}".`);
    }

    const reviewPath = resolve(project, 'creative-review.md');
    const review = await read(reviewPath);
    for (const marker of ['Technical status', 'Automated Visual status', 'Human Creative status', 'Semantic Clarity score', 'Story Motion score', 'Overall score']) {
      if (!review.includes(marker)) failures.push(`${display(reviewPath)}: V4 Review-Marker fehlt: "${marker}".`);
    }

    const contractPath = resolve(project, 'production-contract-v2.json');
    let productionContract;
    try { productionContract = JSON.parse(await read(contractPath)); } catch { productionContract = null; }
    if (!productionContract?.phase1RequiredArtifacts?.includes('visual-quality-v4.json')) {
      failures.push(`${display(contractPath)}: phase1RequiredArtifacts muss visual-quality-v4.json enthalten.`);
    }

    const sourceDir = typeof sourceContract === 'string' ? dirname(sourceContract) : '';
    if (sourceDir && !sourceDir.startsWith('ki/src/reels/')) failures.push(`${display(manifestPath)}: sourceQualityContract muss unter ki/src/reels/ liegen.`);
  }
}

if (failures.length) {
  console.error('VISUAL QUALITY V4: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('VISUAL QUALITY V4: PASS — neue Reels erzwingen Start→Veränderung→Ergebnis, semantische Heroes, Frame-0-Hook, begrenzte Stillstände und getrennte technische/automatische/menschliche Freigabe.');
