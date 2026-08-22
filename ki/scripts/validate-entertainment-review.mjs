import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const [rawReelDir] = process.argv.slice(2);
if (!rawReelDir) {
  console.error('Aufruf: node ki/scripts/validate-entertainment-review.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = resolve(rawReelDir);
const reviewPath = resolve(reelDir, '06-projektdateien', 'ENTERTAINMENT-REVIEW.md');
const text = await readFile(reviewPath, 'utf8');
const errors = [];

const fieldValue = (label) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp(`^- ${escaped}:\\s*(.*)$`, 'mi'));
  return match?.[1]?.trim() ?? '';
};

const isPlaceholder = (value) => !value || /^(JA \/ NEIN|OFFEN|TBD|TODO|__+|-+)$/i.test(value);

const productDecision = fieldValue('Konkretes Produkt / App / Website / Feature?');
if (!/^(JA|NEIN)$/i.test(productDecision)) {
  errors.push('Product/UI/Brand-Entscheidung muss eindeutig JA oder NEIN sein.');
}

const sceneBlocks = [...text.matchAll(/^### Szene\s+([^\n]+)\n([\s\S]*?)(?=^### Szene\s+|^## |\Z)/gmi)];
if (sceneBlocks.length === 0) {
  errors.push('Keine Szene im Entertainment-Review dokumentiert.');
}

for (const [, sceneName, block] of sceneBlocks) {
  for (const label of ['SETUP', 'AKTION', 'KONSEQUENZ', 'PAYOFF', 'HERO-MOMENT']) {
    const match = block.match(new RegExp(`^- ${label}:\\s*(.*)$`, 'mi'));
    const value = match?.[1]?.trim() ?? '';
    if (isPlaceholder(value)) {
      errors.push(`Szene ${sceneName}: ${label} fehlt.`);
    }
  }
}

const scoreLabels = [
  'Hook / sofortige Erkennbarkeit',
  'Produkt-/UI-/Brand-Nähe',
  'Szenen-Dramaturgie',
  'Motion / Kamera / Rhythmus',
  'Memorable / Hero-Momente',
];

const scores = [];
for (const label of scoreLabels) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = text.match(new RegExp(`^- ${escaped}:\\s*([0-2])\\s*\\/\\s*2\\s*$`, 'mi'));
  if (!match) {
    errors.push(`Score fehlt oder ist ungültig: ${label}.`);
    continue;
  }
  const score = Number(match[1]);
  scores.push(score);
  if (score === 0) errors.push(`Score 0 blockiert Phase 1: ${label}.`);
}

const totalMatch = text.match(/\*\*GESAMT:\s*(\d{1,2})\s*\/\s*10\*\*/i);
if (!totalMatch) {
  errors.push('GESAMT-Score fehlt.');
} else {
  const declaredTotal = Number(totalMatch[1]);
  const computedTotal = scores.reduce((sum, value) => sum + value, 0);
  if (scores.length === scoreLabels.length && declaredTotal !== computedTotal) {
    errors.push(`GESAMT ${declaredTotal}/10 stimmt nicht mit Einzelscores ${computedTotal}/10 überein.`);
  }
  if (declaredTotal < 8) errors.push(`Entertainment-Score ${declaredTotal}/10 ist unter dem Mindestwert 8/10.`);
}

if (/^\*\*Status:\*\*\s*OFFEN\s*$/mi.test(text)) {
  errors.push('ENTERTAINMENT-REVIEW Status ist noch OFFEN.');
}

if (errors.length > 0) {
  console.error('ENTERTAINMENT REVIEW: FEHLGESCHLAGEN');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('ENTERTAINMENT REVIEW: BESTANDEN');
console.log(`Szenen geprüft: ${sceneBlocks.length}`);
console.log(`Score: ${scores.reduce((sum, value) => sum + value, 0)}/10`);
