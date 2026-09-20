import {access, readFile, readdir} from 'node:fs/promises';
import {relative, resolve} from 'node:path';

/**
 * Marken-Schrift-Vertrag.
 *
 * Die Markenschrift ist ueber Monate unbemerkt ausgefallen. Drei Fehler
 * wirkten zusammen, und keiner davon wurde von irgendeinem Check erfasst:
 *
 *  1. Commit d8e30554 entfernte den FontFace-Ladecode aus fonts.ts. Die
 *     Imports blieben stehen, also fiel es niemandem auf.
 *  2. `BRAND.font` ist ein Objekt und wurde direkt als `fontFamily` gesetzt.
 *     React rendert daraus `font-family:[object Object]`.
 *  3. Remotion suchte `public/` im Repository-Root statt unter `ki/`, also
 *     kamen alle Schriftdateien mit 404 zurueck.
 *
 * Jeder dieser Fehler allein genuegt, damit jedes Video in der
 * Fallback-Schrift rendert — sichtbar erst im fertigen Export. Dieses Gate
 * prueft die gesamte Kette.
 */

const repoRoot = resolve(process.env.KI_BRAND_FONT_ROOT ?? '.');
const display = (path) => relative(repoRoot, path) || '.';
const failures = [];

const readTextSafe = async (path) => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

// 1) Der Ladecode muss vorhanden sein.
const fontsPath = resolve(repoRoot, 'core/brand-kit/fonts.ts');
const fontsSource = await readTextSafe(fontsPath);
if (!fontsSource) {
  failures.push(`${display(fontsPath)} fehlt oder ist nicht lesbar.`);
} else {
  for (const [marker, hint] of [
    ['new FontFace(', 'erzeugt keine FontFace-Objekte mehr'],
    ['document.fonts.add', 'registriert die geladenen Schriften nicht mehr'],
    ['delayRender', 'haelt den Render nicht mehr an, bis die Schriften geladen sind'],
    ['continueRender', 'gibt den Render nach dem Laden nicht mehr frei'],
  ]) {
    if (!fontsSource.includes(marker)) {
      failures.push(
        `${display(fontsPath)}: ${hint} (\`${marker}\` fehlt). ` +
        'Ohne Ladecode rendert jedes Video in der Fallback-Schrift.',
      );
    }
  }
  // Der Ladecode darf nur im Browser laufen — unter Node gibt es kein FontFace.
  if (fontsSource.includes('new FontFace(') && !fontsSource.includes("typeof FontFace")) {
    failures.push(
      `${display(fontsPath)}: Ladecode ohne Browser-Guard. Unter Node (Vitest, ` +
      'Preflight-Skripte) bricht sonst jeder Import dieses Moduls.',
    );
  }
}

// 2) Die Schriftdateien muessen dort liegen, wo staticFile sie sucht.
const fontDir = resolve(repoRoot, 'ki/public/fonts');
const referenced = [...(fontsSource ?? '').matchAll(/staticFile\('fonts\/([^']+)'\)/g)].map(
  (match) => match[1],
);
if (referenced.length === 0 && fontsSource) {
  failures.push(`${display(fontsPath)}: referenziert keine Schriftdatei ueber staticFile.`);
}
for (const file of referenced) {
  if (!(await exists(resolve(fontDir, file)))) {
    failures.push(
      `${display(resolve(fontDir, file))} fehlt, wird aber in fonts.ts referenziert. ` +
      'Der Render laedt sie dann mit 404 und faellt auf die Standardschrift zurueck.',
    );
  }
}

// 3) Remotion muss den public-Ordner des Kanal-Workspaces kennen.
const remotionConfig = await readTextSafe(resolve(repoRoot, 'remotion.config.ts'));
if (!remotionConfig) {
  failures.push(
    'remotion.config.ts fehlt. Ohne sie sucht die CLI `public/` im Repository-Root ' +
    'und findet die Schriften unter ki/public/ nicht.',
  );
} else if (!/setPublicDir\(\s*['"]ki\/public['"]\s*\)/.test(remotionConfig)) {
  failures.push(
    "remotion.config.ts setzt nicht `Config.setPublicDir('ki/public')`. " +
    'Die Schriften kommen dann mit 404 zurueck.',
  );
}

// 4) `BRAND.font` / `FONT` sind Objekte und duerfen nie direkt als fontFamily stehen.
const OBJECT_USE = /fontFamily\s*[:=]\s*\{?\s*(?:BRAND\.font|FONT)(?![.\w])/;
const walk = async (dir) => {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes: true}).catch(() => [])) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
};
for (const dir of ['ki/src', 'core']) {
  for (const path of await walk(resolve(repoRoot, dir))) {
    const source = await readTextSafe(path);
    if (source && OBJECT_USE.test(source)) {
      failures.push(
        `${display(path)}: setzt \`fontFamily\` auf das Schrift-Objekt statt auf eine ` +
        'konkrete Familie. React rendert daraus `font-family:[object Object]`. ' +
        'Erwartet: `.title` (Bebas Neue, nur Weight 400) oder `.body` (Inter, 400-900).',
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Marken-Schrift-Vertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('');
  console.error('Ein Verstoss bedeutet: jedes gerenderte Video laeuft in der Fallback-Schrift.');
  process.exit(1);
}

console.log(
  `Marken-Schrift-Vertrag bestanden: Ladecode mit Browser-Guard vorhanden, ` +
  `${referenced.length} Schriftdateien liegen unter ki/public/fonts, ` +
  'remotion.config.ts zeigt darauf und nirgends wird das Schrift-Objekt als fontFamily gesetzt.',
);
