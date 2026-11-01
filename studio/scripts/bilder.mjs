#!/usr/bin/env node
/**
 * Freie Bilder von draußen, ohne Key:
 *   - Wikimedia Commons (Standard): Gemälde, historische Fotos, Karten, Dokumente, Tiere, Orte, Technik.
 *     Nur freie Lizenzen: gemeinfrei (Public domain), CC0, CC BY, CC BY-SA.
 *   - NASA-Bildarchiv (--quelle=nasa): Weltall, Erde von oben, Raketen, Planeten. NASA-Bilder sind in der Regel
 *     gemeinfrei; Bilder mit fremdem Urheber (z. B. ESA, Getty) werden ausgefiltert.
 *
 *   npm run bilder -- "Gutenberg Bibel"                    suchen (deutsch oder englisch)
 *   npm run bilder -- "saturn rings" --quelle=nasa --bild  im NASA-Archiv suchen (englisch)
 *   npm run bilder -- "Apollo 11 Aldrin" --bild            dazu Vorschaubild mit IDs (studio/out/bilder/…jpg)
 *   npm run bilder -- --laden=<ID> --projekt=mein-video    ein Bild ins Projekt laden (max. 2400 px breit)
 *
 * Beim Laden kommen Urheber und Lizenz automatisch in studio/projekte/<slug>/quellen.md.
 * CC BY / CC BY-SA verlangen Namensnennung: Zeile aus quellen.md in die Videobeschreibung übernehmen.
 * Nur laden, was wirklich ins Video kommt.
 */
import {execFileSync} from 'node:child_process';
import {appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {OUT, parseArgs, STUDIO} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const CACHE = resolve(OUT, 'bilder');
mkdirSync(CACHE, {recursive: true});

// Wikimedia verlangt einen aussagekräftigen User-Agent.
const HEADERS = {'User-Agent': 'Denkwuerfel-Studio/0.1 (Erklaervideos; lokales Skript)'};
const API = 'https://commons.wikimedia.org/w/api.php';
const NASA = 'https://images-api.nasa.gov';
const QUELLE = String(flags.quelle ?? 'wikimedia');
if (!['wikimedia', 'nasa'].includes(QUELLE)) {
  console.error(`Unbekannte Quelle "${QUELLE}". Erlaubt: wikimedia, nasa`);
  process.exit(1);
}

const ohneHtml = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** Nur freie Lizenzen; alles andere (Fair Use, unklar, NC/ND) fällt raus. */
const lizenzOk = (name) => {
  const n = name.toLowerCase();
  if (/\b(nc|nd)\b|non-?commercial|no ?deriv|fair use/.test(n)) return false;
  return /public domain|^pd|\bpd\b|cc0|^cc[- ]by/.test(n);
};

const beschreibe = (seite) => {
  const info = seite.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata ?? {};
  const lizenz = ohneHtml(meta.LicenseShortName?.value) || 'unbekannt';
  return {
    id: String(seite.pageid),
    titel: seite.title.replace(/^File:/, ''),
    groesse: `${info.width}×${info.height}`,
    lizenz,
    frei: lizenzOk(lizenz),
    urheber: ohneHtml(meta.Artist?.value) || 'unbekannt',
    seite: info.descriptionurl,
    thumb: info.thumburl,
    breite: info.width,
    datei: info.url,
    mime: info.mime,
  };
};

const cacheDatei = (q) => resolve(CACHE, `${QUELLE === 'nasa' ? 'nasa-' : ''}${q.replace(/[^a-z0-9äöüß-]+/gi, '_')}.json`);

/** NASA: fremde Urheber (ESA, Getty, AP …) sind nicht automatisch gemeinfrei. */
const nasaFrei = (d) => !/esa|getty|afp|reuters|associated press|\bap\b|©|copyright/i.test(`${d.secondary_creator ?? ''} ${d.photographer ?? ''} ${d.description ?? ''}`.slice(0, 2000));

const sucheNasa = async (q) => {
  const url = new URL(`${NASA}/search`);
  url.searchParams.set('q', q);
  url.searchParams.set('media_type', 'image');
  url.searchParams.set('page_size', String(flags.anzahl ?? 30));
  const res = await fetch(url, {headers: HEADERS});
  if (!res.ok) throw new Error(`NASA antwortet mit ${res.status}`);
  const items = (await res.json()).collection?.items ?? [];
  return items.map((it) => {
    const d = it.data?.[0] ?? {};
    const frei = nasaFrei(d);
    return {
      id: `nasa-${d.nasa_id}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
      nasaId: d.nasa_id,
      quelle: 'NASA',
      titel: d.title ?? d.nasa_id,
      groesse: String(d.date_created ?? '').slice(0, 4),
      lizenz: frei ? 'NASA (gemeinfrei)' : 'NASA (fremder Urheber)',
      frei,
      urheber: d.secondary_creator || d.photographer || d.center || 'NASA',
      seite: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`,
      thumb: it.links?.find((l) => l.render === 'image')?.href,
    };
  });
};

const suche = async (q) => {
  const datei = cacheDatei(q);
  if (existsSync(datei) && Date.now() - statSync(datei).mtimeMs < 24 * 3600 * 1000) return JSON.parse(readFileSync(datei, 'utf8'));
  if (QUELLE === 'nasa') {
    const ergebnis = {q, at: new Date().toISOString(), treffer: await sucheNasa(q)};
    writeFileSync(datei, JSON.stringify(ergebnis, null, 2));
    return ergebnis;
  }
  const url = new URL(API);
  const p = {action: 'query', format: 'json', generator: 'search', gsrsearch: `${q} filetype:bitmap`, gsrnamespace: '6', gsrlimit: String(flags.anzahl ?? 30), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '480', iiextmetadatafilter: 'LicenseShortName|Artist'};
  for (const [k, v] of Object.entries(p)) url.searchParams.set(k, v);
  const res = await fetch(url, {headers: HEADERS});
  if (!res.ok) throw new Error(`Wikimedia antwortet mit ${res.status}`);
  const data = await res.json();
  const treffer = Object.values(data.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map(beschreibe)
    .filter(Boolean);
  const ergebnis = {q, at: new Date().toISOString(), treffer};
  writeFileSync(datei, JSON.stringify(ergebnis, null, 2));
  return ergebnis;
};

// ── Laden ────────────────────────────────────────────────────────────────
if (flags.laden) {
  const id = String(flags.laden);
  const slug = flags.projekt ? String(flags.projekt) : null;
  if (!slug) {
    console.error('Bitte Projekt angeben: --projekt=<projektname>');
    process.exit(1);
  }
  let t = null;
  for (const f of readdirSync(CACHE).filter((x) => x.endsWith('.json'))) {
    t = JSON.parse(readFileSync(resolve(CACHE, f), 'utf8')).treffer?.find((h) => h.id === id) ?? null;
    if (t) break;
  }
  if (!t) {
    console.error(`ID ${id} nicht in den letzten Suchergebnissen. Erst suchen: npm run bilder -- "<begriff>"`);
    process.exit(1);
  }
  if (!t.frei) {
    console.error(`Lizenz „${t.lizenz}“ ist nicht frei genug – nicht laden.`);
    process.exit(1);
  }
  // Große Originale (Scans mit 10.000 px) auf 2400 px Breite begrenzen
  let quelle = t.datei;
  if (t.quelle === 'NASA') {
    const liste = (await (await fetch(`${NASA}/asset/${encodeURIComponent(t.nasaId)}`, {headers: HEADERS})).json()).collection?.items?.map((x) => x.href.replace(/^http:/, 'https:')) ?? [];
    quelle = liste.find((h) => /~large\.jpg$/i.test(h)) ?? liste.find((h) => /~orig\.(jpe?g|png)$/i.test(h)) ?? liste.find((h) => /~medium\.jpg$/i.test(h));
    if (!quelle) throw new Error('Keine Bilddatei im NASA-Archiv gefunden.');
  } else if (t.breite > 2400) {
    const url = new URL(API);
    for (const [k, v] of Object.entries({action: 'query', format: 'json', pageids: id, prop: 'imageinfo', iiprop: 'url', iiurlwidth: '2400'})) url.searchParams.set(k, v);
    const info = await (await fetch(url, {headers: HEADERS})).json();
    quelle = info.query?.pages?.[id]?.imageinfo?.[0]?.thumburl ?? t.datei;
  }
  const ext = (quelle.match(/\.(jpe?g|png|webp|gif|tiff?)$/i)?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const ordner = resolve(STUDIO, 'public', 'projekte', slug, 'bilder');
  mkdirSync(ordner, {recursive: true});
  const ziel = resolve(ordner, `${id}.${ext}`);
  const res = await fetch(quelle, {headers: HEADERS});
  if (!res.ok) throw new Error(`Download fehlgeschlagen: ${res.status}`);
  writeFileSync(ziel, Buffer.from(await res.arrayBuffer()));
  const quellen = resolve(STUDIO, 'projekte', slug, 'quellen.md');
  if (!existsSync(quellen)) {
    mkdirSync(resolve(STUDIO, 'projekte', slug), {recursive: true});
    writeFileSync(quellen, '# Quellen (Medien)\n\n| Datei | Quelle | Seite | Urheber | Lizenz | Geladen |\n|---|---|---|---|---|---|\n');
  }
  appendFileSync(quellen, `| bilder/${id}.${ext} | ${t.quelle ?? 'Wikimedia Commons'} | ${t.seite} | ${t.urheber.replace(/\|/g, '/')} | ${t.lizenz} | ${new Date().toISOString().slice(0, 10)} |\n`);
  console.log(`Geladen: studio/public/projekte/${slug}/bilder/${id}.${ext} (${(statSync(ziel).size / 1048576).toFixed(1)} MB)`);
  console.log(`Im Video: <Footage src="projekte/${slug}/bilder/${id}.${ext}" />`);
  console.log(`Quelle notiert in: studio/projekte/${slug}/quellen.md`);
  if (!/public domain|^pd|cc0/i.test(t.lizenz)) console.log(`Namensnennung Pflicht: „${t.titel}“ – ${t.urheber}, ${t.lizenz}, via Wikimedia Commons`);
  if (t.quelle === 'NASA') console.log(`In die Beschreibung: „Bild: ${t.urheber}“ (NASA-Logo nie als Werbung/Empfehlung zeigen).`);
  process.exit(0);
}

// ── Suchen ───────────────────────────────────────────────────────────────
const q = rest[0];
if (!q) {
  console.error('Bitte Suchbegriff angeben, z. B.: npm run bilder -- "Mondlandung 1969"');
  process.exit(1);
}
const {treffer} = await suche(q);
const frei = treffer.filter((t) => t.frei);
if (frei.length === 0) {
  console.log(`Keine frei lizenzierten Treffer (${treffer.length} insgesamt). Tipp: englischen Begriff oder Namen + Jahr versuchen.`);
  process.exit(0);
}
console.log(`${frei.length} frei lizenzierte Treffer für "${q}" (${treffer.length - frei.length} ausgefiltert):\n`);
for (const t of frei) console.log(`  ${t.id.padEnd(QUELLE === 'nasa' ? 22 : 10)} ${t.groesse.padEnd(11)} ${t.lizenz.padEnd(18)} ${t.titel.slice(0, 70)}`);
console.log(`\nLaden: npm run bilder -- --laden=<ID> --projekt=<projektname>${QUELLE === 'nasa' ? ' --quelle=nasa' : ''}`);

if (flags.bild) {
  const dateien = [];
  for (const t of frei.filter((x) => x.thumb).slice(0, 12)) {
    const roh = resolve(CACHE, `thumb-${t.id}.jpg`);
    if (!existsSync(roh)) {
      const r = await fetch(t.thumb, {headers: HEADERS});
      if (!r.ok) continue;
      writeFileSync(roh, Buffer.from(await r.arrayBuffer()));
    }
    const beschriftet = resolve(CACHE, `thumb-${t.id}-l.jpg`);
    // -frames:v 1: animierte GIFs haben mehrere Bilder; kaputte Vorschauen überspringen statt abbrechen
    try {
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', roh, '-frames:v', '1', '-vf', `scale=480:360:force_original_aspect_ratio=decrease,pad=480:360:(ow-iw)/2:(oh-ih)/2:color=0x0E1424,drawbox=x=0:y=0:w=iw:h=40:color=black@0.6:t=fill,drawtext=text='${t.id}':x=10:y=8:fontsize=24:fontcolor=white`, beschriftet]);
      dateien.push(beschriftet);
    } catch {
      console.log(`  (Vorschau für ${t.id} übersprungen)`);
    }
  }
  if (dateien.length > 0) {
    const spalten = Math.min(4, dateien.length);
    const zeilen = Math.ceil(dateien.length / spalten);
    while (dateien.length < spalten * zeilen) dateien.push(dateien[dateien.length - 1]);
    const bogen = resolve(CACHE, `${QUELLE === 'nasa' ? 'nasa-' : ''}${q.replace(/[^a-z0-9äöüß-]+/gi, '_')}.jpg`);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...dateien.flatMap((f) => ['-i', f]), '-filter_complex', `${dateien.map((_, i) => `[${i}]`).join('')}xstack=inputs=${dateien.length}:grid=${spalten}x${zeilen}`, '-frames:v', '1', bogen]);
    console.log(`Vorschau: ${bogen}`);
  }
}
