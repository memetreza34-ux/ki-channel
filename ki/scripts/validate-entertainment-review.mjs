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

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fieldValue = (label) => {
  const match = text.match(new RegExp(`^- ${escapeRegExp(label)}:\\s*(.*)$`, 'mi'));
  return match?.[1]?.trim() ?? '';
};
const isPlaceholder = (value) => !value || /^(JA \/ NEIN|OFFEN|TBD|TODO|__+|-+)$/i.test(value);

const productDecision = fieldValue('Konkretes Produkt / App / Website / Feature?');
if (!/^(JA|NEIN)$/i.test(productDecision)) errors.push('Product/UI/Brand-Entscheidung muss eindeutig JA oder NEIN sein.');

const sceneHeadings = [...text.matchAll(/^### Szene\s+([^\n]+)$/gmi)];
const sceneBlocks = sceneHeadings.map((match, index) => {
  const start = (match.index ?? 0) + match[0].length;
  const nextSceneStart = sceneHeadings[index + 1]?.index ?? text.length;
  const nextSection = text.indexOf('\n## ', start);
  const end = nextSection >= 0 && nextSection < nextSceneStart ? nextSection : nextSceneStart;
  return {sceneName: match[1].trim(), block: text.slice(start, end)};
});
if (sceneBlocks.length === 0) errors.push('Keine Szene im Entertainment-Review dokumentiert.');
for (const {sceneName, block} of sceneBlocks) {
  for (const label of ['SETUP', 'AKTION', 'KONSEQUENZ', 'PAYOFF', 'HERO-MOMENT']) {
    const match = block.match(new RegExp(`^- ${label}:\\s*(.*)$`, 'mi'));
    if (isPlaceholder(match?.[1]?.trim() ?? '')) errors.push(`Szene ${sceneName}: ${label} fehlt.`);
  }
}
const scoreLabels = ['Hook / sofortige Erkennbarkeit','Produkt-/UI-/Brand-Nähe','Szenen-Dramaturgie','Motion / Kamera / Rhythmus','Memorable / Hero-Momente'];
const scores=[];
for (const label of scoreLabels) {
  const match=text.match(new RegExp(`^- ${escapeRegExp(label)}:\\s*([0-2])\\s*\\/\\s*2\\s*$`,'mi'));
  if (!match) { errors.push(`Score fehlt oder ist ungültig: ${label}.`); continue; }
  const score=Number(match[1]); scores.push(score); if (score===0) errors.push(`Score 0 blockiert Phase 1: ${label}.`);
}
const totalMatch=text.match(/\*\*GESAMT:\s*(\d{1,2})\s*\/\s*10\*\*/i);
if (!totalMatch) errors.push('GESAMT-Score fehlt.');
else {
  const declared=Number(totalMatch[1]); const computed=scores.reduce((a,b)=>a+b,0);
  if (scores.length===scoreLabels.length && declared!==computed) errors.push(`GESAMT ${declared}/10 stimmt nicht mit Einzelscores ${computed}/10 überein.`);
  if (declared<8) errors.push(`Entertainment-Score ${declared}/10 ist unter dem Mindestwert 8/10.`);
}
if (/^\*\*Status:\*\*\s*OFFEN\s*$/mi.test(text)) errors.push('ENTERTAINMENT-REVIEW Status ist noch OFFEN.');
if (errors.length) { console.error('ENTERTAINMENT REVIEW: FEHLGESCHLAGEN'); for (const e of errors) console.error(`- ${e}`); process.exit(1); }
console.log('ENTERTAINMENT REVIEW: BESTANDEN');
console.log(`Szenen geprüft: ${sceneBlocks.length}`);
console.log(`Score: ${scores.reduce((a,b)=>a+b,0)}/10`);
