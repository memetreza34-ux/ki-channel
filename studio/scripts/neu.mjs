#!/usr/bin/env node
/**
 * Legt ein neues Video-Projekt aus der Vorlage an und registriert es.
 *
 *   npm run neu -- warum-ki-luegt                 Hochformat (Reels/Shorts/TikTok)
 *   npm run neu -- ki-agenten-erklaert landscape  YouTube 16:9
 *   Formate: vertical | landscape | square | portrait
 */
import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseArgs, STUDIO} from './lib.mjs';

const FORMATS = ['vertical', 'landscape', 'square', 'portrait'];
const {rest} = parseArgs(process.argv.slice(2));
const [slug, format = 'vertical'] = rest;

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Bitte Namen in Kleinbuchstaben mit Bindestrichen angeben, z. B.: npm run neu -- warum-ki-luegt');
  process.exit(1);
}
if (!FORMATS.includes(format)) {
  console.error(`Unbekanntes Format "${format}". Erlaubt: ${FORMATS.join(', ')}`);
  process.exit(1);
}

const target = resolve(STUDIO, 'projekte', slug);
if (existsSync(target)) {
  console.error(`Projekt existiert schon: ${target}`);
  process.exit(1);
}

const id = slug
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join('-');
const varName = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

cpSync(resolve(STUDIO, 'projekte', '_vorlage'), target, {recursive: true});
for (const file of readdirSync(target)) {
  const p = resolve(target, file);
  writeFileSync(p, readFileSync(p, 'utf8').replaceAll('__ID__', id).replaceAll('__SLUG__', slug).replaceAll('__FORMAT__', format).replace("format: 'vertical'", `format: '${format}'`));
}
mkdirSync(resolve(STUDIO, 'public', 'projekte', slug), {recursive: true});

const indexPath = resolve(STUDIO, 'projekte', 'index.ts');
const index = readFileSync(indexPath, 'utf8')
  .replace('// neu:import', `import {projekt as ${varName}} from './${slug}/Video';\n// neu:import`)
  .replace('  // neu:eintrag', `  ${varName},\n  // neu:eintrag`);
writeFileSync(indexPath, index);

console.log(`Projekt angelegt: studio/projekte/${slug}/  (Composition "${id}", ${format})`);
console.log(`Voiceover später nach: studio/public/projekte/${slug}/voiceover.mp3`);
