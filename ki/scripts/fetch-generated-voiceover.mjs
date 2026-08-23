#!/usr/bin/env node
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';

const [rawSourceJson, rawOutput] = process.argv.slice(2);
if (!rawSourceJson || !rawOutput) {
  console.error('Usage: node ki/scripts/fetch-generated-voiceover.mjs <audio-source.json> <output.mp3>');
  process.exit(1);
}

const sourceJson = resolve(rawSourceJson);
const output = resolve(rawOutput);
const config = JSON.parse(await readFile(sourceJson, 'utf8'));
const url = config.audioUrl;
if (!url || !/^https:\/\//i.test(url)) {
  throw new Error('audio-source.json has no valid https audioUrl.');
}

const response = await fetch(url, {redirect: 'follow'});
if (!response.ok) {
  throw new Error(`Voiceover download failed: ${response.status} ${response.statusText}`);
}
const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 4096) throw new Error(`Downloaded voiceover is unexpectedly small (${bytes.length} bytes).`);

await mkdir(dirname(output), {recursive: true});
await writeFile(output, bytes);
console.log(`VOICEOVER DOWNLOADED: ${output}`);
console.log(`bytes: ${bytes.length}`);
