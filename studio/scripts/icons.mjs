#!/usr/bin/env node
/**
 * Icons finden – über alle Sammlungen (≈ 22.000 Icons).
 *
 *   npm run icons -- robot              Namen auflisten
 *   npm run icons -- robot --bild       zusätzlich als Bild ansehen (studio/out/icon-suche/robot.jpg)
 *   npm run icons -- rocket --set=fluent-emoji-flat
 *   npm run icons -- --lottie           alle Lottie-Animationen (und Liste im Kit aktualisieren)
 *
 * Sammlungen: lucide · ph (Phosphor, Stile: -thin -light -bold -fill -duotone) · tabler ·
 * logos (Firmenlogos) · fluent-emoji-flat (bunte Emojis)
 */
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, readdirSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {bundleStudio, OUT, parseArgs, STUDIO} from './lib.mjs';

const require = createRequire(import.meta.url);
const {flags, rest} = parseArgs(process.argv.slice(2));

if (flags.lottie) {
  const list = (dir) => readdirSync(resolve(STUDIO, 'public', 'lottie', dir)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
  const emoji = list('emoji');
  const ui = list('ui');
  writeFileSync(
    resolve(STUDIO, 'kit', 'lottie-namen.ts'),
    `// Automatisch erzeugt von: npm run icons -- --lottie\n// Liste der Dateien in studio/public/lottie/.\n\nexport const LOTTIE_EMOJI = ${JSON.stringify(emoji)} as const;\n\nexport const LOTTIE_UI = ${JSON.stringify(ui)} as const;\n`,
  );
  console.log(`emoji/… (Google Noto, CC BY 4.0 – Namensnennung!):\n  ${emoji.join('  ')}\n`);
  console.log(`ui/… (react-useanimations, MIT, einfärbbar mit color="accent"):\n  ${ui.join('  ')}`);
  process.exit(0);
}

const query = rest[0]?.toLowerCase();
if (!query) {
  console.error('Bitte Suchwort angeben (englisch), z. B.: npm run icons -- robot');
  process.exit(1);
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
const sets = {
  lucide: async () => Object.keys((await import('lucide')).icons).map(kebab),
  ph: async () => Object.keys(require('@iconify-json/ph/icons.json').icons),
  tabler: async () => Object.keys(require('@iconify-json/tabler/icons.json').icons),
  logos: async () => Object.keys(require('@iconify-json/logos/icons.json').icons),
  'fluent-emoji-flat': async () => Object.keys(require('@iconify-json/fluent-emoji-flat/icons.json').icons),
};

const found = [];
for (const [prefix, load] of Object.entries(sets)) {
  if (flags.set && flags.set !== prefix) continue;
  let names = (await load()).filter((n) => n.includes(query));
  // Phosphor: nur duotone/fill/regular zeigen, sonst wird die Liste riesig.
  if (prefix === 'ph' && !flags.set) names = names.filter((n) => !/-(thin|light|bold)$/.test(n));
  const shown = names.slice(0, flags.set ? 200 : 16);
  if (shown.length === 0) continue;
  console.log(`\n${prefix} (${names.length} Treffer):`);
  console.log('  ' + shown.map((n) => `${prefix}:${n}`).join('  '));
  found.push(...shown.map((n) => `${prefix}:${n}`));
}
if (found.length === 0) console.log('Keine Treffer. Tipp: englische Begriffe probieren (robot, brain, chart, money …).');

if (flags.bild && found.length > 0) {
  const serveUrl = await bundleStudio();
  const inputProps = {titel: `Icon-Suche: ${query}`, icons: found.slice(0, 48)};
  const composition = await selectComposition({serveUrl, id: 'Icon-Suche', inputProps});
  mkdirSync(resolve(OUT, 'icon-suche'), {recursive: true});
  const output = resolve(OUT, 'icon-suche', `${query}.jpg`);
  await renderStill({serveUrl, composition, inputProps, frame: 0, output, imageFormat: 'jpeg', jpegQuality: 90});
  console.log(`\nBild: ${output}`);
}
