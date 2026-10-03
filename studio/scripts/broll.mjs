#!/usr/bin/env node
/**
 * B-Roll von Pixabay (kostenlos, kommerziell nutzbar, ohne Namensnennung –
 * Pixabay Content License). Braucht einen eigenen API-Key in `.env`:
 *   PIXABAY_KEY=dein-key
 *
 *   npm run broll -- "server room"                 Videos suchen (englische Begriffe finden mehr)
 *   npm run broll -- "server room" --bild          dazu Vorschaubild mit IDs (studio/out/broll/…jpg)
 *   npm run broll -- "laptop desk" --fotos         Fotos statt Videos
 *   npm run broll -- --laden=123456 --projekt=mein-video   einen Clip ins Projekt laden
 *
 * Regeln von Pixabay: Suchergebnisse 24 h zwischenspeichern, keine Massen-Downloads,
 * nur laden, was wirklich ins Video kommt. Für faceless: Clips ohne erkennbare Gesichter wählen.
 */
import {execFileSync} from 'node:child_process';
import {appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {OUT, parseArgs, ROOT, STUDIO} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const CACHE = resolve(OUT, 'broll');
mkdirSync(CACHE, {recursive: true});

const readKey = () => {
  if (process.env.PIXABAY_KEY) return process.env.PIXABAY_KEY;
  const envFile = resolve(ROOT, '.env');
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(/^PIXABAY_KEY=(.+)$/m);
    if (m) return m[1].trim();
  }
  return null;
};

const key = readKey();
if (!key && !process.env.PIXABAY_FIXTURE) {
  console.error(`Kein Pixabay-Key gefunden.

So bekommst du einen (kostenlos):
  1. Auf https://pixabay.com ein Konto anlegen und einloggen.
  2. https://pixabay.com/api/docs/ öffnen – dort steht dein Key (Abschnitt "Parameters", Feld "key").
  3. Im Projektordner eine Datei .env anlegen mit der Zeile:
       PIXABAY_KEY=dein-key
     (.env wird nicht auf GitHub hochgeladen.)`);
  process.exit(1);
}

const fotos = Boolean(flags.fotos);
const cacheFile = (name) => resolve(CACHE, `${name.replace(/[^a-z0-9-]+/gi, '_')}${fotos ? '_fotos' : ''}.json`);

/** Suchergebnisse 24 h zwischenspeichern (Pixabay-Regel). */
const search = async (query) => {
  const file = cacheFile(query);
  if (existsSync(file) && Date.now() - statSync(file).mtimeMs < 24 * 3600 * 1000) return JSON.parse(readFileSync(file, 'utf8'));
  let data;
  if (process.env.PIXABAY_FIXTURE) {
    data = JSON.parse(readFileSync(process.env.PIXABAY_FIXTURE, 'utf8'));
  } else {
    const url = new URL(fotos ? 'https://pixabay.com/api/' : 'https://pixabay.com/api/videos/');
    url.searchParams.set('key', key);
    url.searchParams.set('q', query);
    url.searchParams.set('per_page', String(flags.anzahl ?? 20));
    url.searchParams.set('safesearch', 'true');
    if (fotos) url.searchParams.set('image_type', 'photo');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Pixabay antwortet mit ${res.status}: ${await res.text()}`);
    data = await res.json();
  }
  writeFileSync(file, JSON.stringify({query, fotos, at: new Date().toISOString(), ...data}, null, 2));
  return data;
};

const describe = (hit) => {
  if (fotos) return {id: hit.id, size: `${hit.imageWidth}×${hit.imageHeight}`, dauer: '', tags: hit.tags, user: hit.user, page: hit.pageURL, thumb: hit.previewURL, file: hit.largeImageURL, ext: 'jpg'};
  const v = hit.videos?.large?.url ? hit.videos.large : hit.videos?.medium;
  return {
    id: hit.id,
    size: `${v?.width}×${v?.height}`,
    dauer: `${hit.duration}s`,
    tags: hit.tags,
    user: hit.user,
    page: hit.pageURL,
    thumb: hit.videos?.medium?.thumbnail ?? hit.videos?.tiny?.thumbnail ?? null,
    file: flags.groesse === 'medium' ? hit.videos?.medium?.url : v?.url,
    ext: 'mp4',
  };
};

// ── Laden ────────────────────────────────────────────────────────────────
if (flags.laden) {
  const id = String(flags.laden);
  const slug = flags.projekt ? String(flags.projekt) : null;
  if (!slug) {
    console.error('Bitte Projekt angeben: --projekt=<projektname>');
    process.exit(1);
  }
  // Treffer aus den zwischengespeicherten Suchen holen (keine zusätzliche Anfrage nötig).
  const {readdirSync} = await import('node:fs');
  let hit = null;
  for (const f of readdirSync(CACHE).filter((x) => x.endsWith('.json'))) {
    const data = JSON.parse(readFileSync(resolve(CACHE, f), 'utf8'));
    const found = (data.hits ?? []).find((h) => String(h.id) === id);
    if (found) {
      hit = {...describe(found), fotosSuche: data.fotos};
      break;
    }
  }
  if (!hit) {
    console.error(`ID ${id} nicht in den letzten Suchergebnissen. Erst suchen: npm run broll -- "<begriff>"`);
    process.exit(1);
  }
  const dir = resolve(STUDIO, 'public', 'projekte', slug, 'broll');
  mkdirSync(dir, {recursive: true});
  const target = resolve(dir, `${id}.${hit.ext}`);
  const res = await fetch(hit.file);
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${res.status}`);
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  const quellen = resolve(STUDIO, 'projekte', slug, 'quellen.md');
  if (!existsSync(quellen)) {
    mkdirSync(resolve(STUDIO, 'projekte', slug), {recursive: true});
    writeFileSync(quellen, '# Quellen (Medien)\n\n| Datei | Quelle | Seite | Urheber | Lizenz | Geladen |\n|---|---|---|---|---|---|\n');
  }
  appendFileSync(quellen, `| broll/${id}.${hit.ext} | Pixabay | ${hit.page} | ${hit.user} | Pixabay Content License | ${new Date().toISOString().slice(0, 10)} |\n`);
  const mb = (statSync(target).size / 1048576).toFixed(1);
  console.log(`Geladen: studio/public/projekte/${slug}/broll/${id}.${hit.ext} (${mb} MB)`);
  console.log(`Im Video: <Footage src="projekte/${slug}/broll/${id}.${hit.ext}" />`);
  console.log(`Quelle notiert in: studio/projekte/${slug}/quellen.md`);
  process.exit(0);
}

// ── Suchen ───────────────────────────────────────────────────────────────
const query = rest[0];
if (!query) {
  console.error('Bitte Suchbegriff angeben, z. B.: npm run broll -- "server room"');
  process.exit(1);
}
const data = await search(query);
const hits = (data.hits ?? []).map(describe);
if (hits.length === 0) {
  console.log('Keine Treffer. Tipp: englische, einfache Begriffe (typing keyboard, data center, city night …).');
  process.exit(0);
}
console.log(`${data.totalHits ?? hits.length} Treffer für "${query}" (${fotos ? 'Fotos' : 'Videos'}), die ersten ${hits.length}:\n`);
for (const h of hits) console.log(`  ${String(h.id).padEnd(9)} ${h.size.padEnd(11)} ${h.dauer.padEnd(5)} ${h.tags}`);
console.log(`\nLaden: npm run broll -- --laden=<ID> --projekt=<projektname>`);

if (flags.bild) {
  const thumbs = hits.filter((h) => h.thumb).slice(0, 12);
  const files = [];
  for (const h of thumbs) {
    const f = resolve(CACHE, `thumb-${h.id}.jpg`);
    if (!existsSync(f)) {
      const r = await fetch(h.thumb);
      if (!r.ok) continue;
      writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    }
    const labelled = resolve(CACHE, `thumb-${h.id}-l.jpg`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', f, '-vf', `scale=480:270:force_original_aspect_ratio=increase,crop=480:270,drawbox=x=0:y=0:w=iw:h=40:color=black@0.6:t=fill,drawtext=text='${h.id}  ${h.dauer}':x=10:y=8:fontsize=24:fontcolor=white`, labelled]);
    files.push(labelled);
  }
  if (files.length > 0) {
    const cols = Math.min(4, files.length);
    const rows = Math.ceil(files.length / cols);
    while (files.length < cols * rows) files.push(files[files.length - 1]);
    const sheet = resolve(CACHE, `${query.replace(/[^a-z0-9-]+/gi, '_')}.jpg`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...files.flatMap((f) => ['-i', f]), '-filter_complex', `${files.map((_, i) => `[${i}]`).join('')}xstack=inputs=${files.length}:grid=${cols}x${rows}`, '-frames:v', '1', sheet]);
    console.log(`Vorschau: ${sheet}`);
  }
}
