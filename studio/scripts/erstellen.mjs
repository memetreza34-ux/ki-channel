#!/usr/bin/env node
/**
 * Ersteller: rendert eine Beschreibung (JSON) direkt als Video – in allen
 * Formaten, die in der Datei unter "formate" stehen.
 *
 *   npm run erstellen -- studio/ersteller/beispiele/spot-kanal-pop.json
 *   npm run erstellen -- meine-datei.json --formate=vertical,square
 *   npm run erstellen -- meine-datei.json --nur-bilder      Kontaktbogen statt Video (schnell)
 *
 * "vorlage": "spot" (8-Sekunden-Spot) oder "erklaerer" (Szenen).
 * Ergebnis: studio/out/<dateiname>-<format>.mp4
 */
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, rmSync} from 'node:fs';
import {basename, resolve} from 'node:path';
import {bundleStudio, CHROMIUM, OUT, parseArgs} from './lib.mjs';

const {flags, rest} = parseArgs(process.argv.slice(2));
const file = rest[0];
if (!file) {
  console.error('Bitte eine JSON-Datei angeben, z. B.: npm run erstellen -- studio/ersteller/beispiele/spot-kanal-pop.json');
  process.exit(1);
}
const spec = JSON.parse(readFileSync(resolve(file), 'utf8'));
const ids = {spot: 'Spot', erklaerer: 'Erklaerer'};
const id = ids[spec.vorlage];
if (!id) {
  console.error(`"vorlage" muss "spot" oder "erklaerer" sein (gefunden: ${spec.vorlage})`);
  process.exit(1);
}
const formate = flags.formate ? String(flags.formate).split(',') : (spec.formate ?? [spec.format ?? 'vertical']);
const name = basename(file).replace(/\.json$/, '');
const props = {...spec};
delete props.vorlage;
delete props.formate;

const serveUrl = await bundleStudio();
mkdirSync(OUT, {recursive: true});

for (const format of formate) {
  const inputProps = {...props, format};
  const composition = await selectComposition({serveUrl, id, inputProps, chromiumOptions: CHROMIUM});
  if (flags['nur-bilder']) {
    const dir = resolve(OUT, `${name}-${format}`, 'look');
    rmSync(dir, {recursive: true, force: true});
    mkdirSync(dir, {recursive: true});
    const n = 8;
    const files = [];
    for (let i = 0; i < n; i++) {
      const frame = Math.round(((composition.durationInFrames - 1) * (i + 0.5)) / n);
      const out = resolve(dir, `frame-${String(frame).padStart(5, '0')}.jpg`);
      await renderStill({serveUrl, composition, chromiumOptions: CHROMIUM, inputProps, frame, output: out, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.4});
      files.push(out);
    }
    const sheet = resolve(dir, 'sheet.jpg');
    const cols = composition.height > composition.width ? 8 : 4;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...files.flatMap((f) => ['-i', f]), '-filter_complex', `${files.map((_, i) => `[${i}]`).join('')}xstack=inputs=${files.length}:grid=${cols}x${Math.ceil(files.length / cols)}`, '-frames:v', '1', sheet]);
    console.log(`${format}: ${sheet}`);
    continue;
  }
  const outputLocation = resolve(OUT, `${name}-${format}.mp4`);
  await renderMedia({serveUrl, composition, inputProps, chromiumOptions: CHROMIUM, codec: 'h264', crf: 18, jpegQuality: 92, outputLocation});
  console.log(`${format}: ${outputLocation} (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
}
