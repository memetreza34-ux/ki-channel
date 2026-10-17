import {z} from 'zod';

/**
 * Eingaben für den Ersteller. Dieselben Felder erscheinen in Remotion Studio als
 * Formular (rechte Seitenleiste) und lassen sich als JSON-Datei speichern.
 *
 * Icons: Iconify-Namen wie "ph:robot-duotone", "tabler:brain", "logos:openai-icon",
 * "fluent-emoji-flat:rocket" (suchen: npm run icons -- <wort>).
 * Lottie: "emoji/rakete" oder "ui/checkmark" (Liste: npm run icons -- --lottie).
 */

export const designSchema = z.enum(['editorial', 'nacht', 'pop', 'pastell', 'minimal', 'papier']);
export const formatSchema = z.enum(['vertical', 'square', 'portrait', 'landscape']);
export const uebergangSchema = z.enum(['cut', 'fade', 'slide-up', 'slide-left', 'wipe', 'zoom']);
/** Atmosphäre-Ebene hinter einer Szene. */
export const effektSchema = z.enum(['keiner', 'strahlen', 'partikel', 'meteore', 'raster', 'konfetti']);
export const form3dSchema = z.enum(['wuerfel', 'kugel', 'ring', 'chip']);

const medien = {
  /** Pfad in studio/public, z. B. "projekte/mein-spot/voiceover.mp3". */
  voiceover: z.string().optional(),
  /** Pfad in studio/public, z. B. "projekte/mein-spot/musik.mp3". */
  musik: z.string().optional(),
  /** Wort-Timings (JSON in studio/public) für wortgenaue Untertitel. */
  wortzeiten: z.string().optional(),
};

// ── 8-Sekunden-Spot ─────────────────────────────────────────────────────
export const spotSchema = z.object({
  design: designSchema,
  format: formatSchema,
  /** 1–3 Knaller-Wörter für die ersten 2,4 Sekunden. */
  hook: z.array(z.string()).min(1).max(3),
  held: z.object({
    titel: z.string(),
    hervorheben: z.array(z.string()),
    icon: z.string(),
    /** Statt Icon eine Lottie-Animation (optional). */
    lottie: z.string().optional(),
    /** Statt Icon ein 3D-Objekt (optional). */
    objekt3d: form3dSchema.optional(),
    effekt: effektSchema.optional(),
  }),
  /** Video/Foto (Pfad in studio/public) als Hintergrund des Hooks, abgedunkelt. */
  hookVideo: z.string().optional(),
  /** Bis zu drei Nutzen, werden abgehakt. */
  punkte: z.array(z.string()).max(3),
  sticker: z.string().optional(),
  cta: z.object({titel: z.string(), knopf: z.string()}),
  kanalname: z.string().optional(),
  handle: z.string().optional(),
  sounds: z.boolean(),
  ...medien,
});

export type SpotProps = z.infer<typeof spotSchema>;

// ── Erklärvideo aus Szenen ──────────────────────────────────────────────
const basis = {
  /** Länge der Szene in Sekunden. */
  sekunden: z.number().min(1).max(30),
  /** Untertitel/Sprechertext dieser Szene (ohne wortgenaue Wortzeiten). */
  untertitel: z.string().optional(),
  /** Atmosphäre hinter der Szene. */
  effekt: effektSchema.optional(),
};

export const szeneSchema = z.discriminatedUnion('typ', [
  z.object({
    typ: z.literal('titel'),
    kicker: z.string().optional(),
    titel: z.string(),
    hervorheben: z.array(z.string()).optional(),
    icon: z.string().optional(),
    lottie: z.string().optional(),
    objekt3d: form3dSchema.optional(),
    ...basis,
  }),
  z.object({
    typ: z.literal('aussage'),
    text: z.string(),
    hervorheben: z.array(z.string()).optional(),
    icon: z.string().optional(),
    lottie: z.string().optional(),
    ...basis,
  }),
  z.object({typ: z.literal('liste'), titel: z.string(), punkte: z.array(z.string()), ton: z.enum(['gut', 'schlecht']), ...basis}),
  z.object({
    typ: z.literal('schritte'),
    titel: z.string(),
    schritte: z.array(z.object({titel: z.string(), text: z.string().optional()})),
    ...basis,
  }),
  z.object({typ: z.literal('vergleich'), titel: z.string(), vorher: z.string(), nachher: z.string(), ...basis}),
  z.object({
    typ: z.literal('zahl'),
    titel: z.string(),
    wert: z.number(),
    einheit: z.string().optional(),
    text: z.string().optional(),
    /** Als Ring darstellen (für Prozent). */
    ring: z.boolean().optional(),
    /** Zeigt „Beispielwert“ – Pflicht, wenn die Zahl kein belegter Fakt ist. */
    beispiel: z.boolean().optional(),
    ...basis,
  }),
  z.object({typ: z.literal('chat'), frage: z.string(), antwort: z.string(), ...basis}),
  z.object({
    typ: z.literal('icons'),
    titel: z.string(),
    icons: z.array(z.object({icon: z.string(), text: z.string()})),
    ...basis,
  }),
  z.object({typ: z.literal('tokens'), titel: z.string(), tokens: z.array(z.string()), ...basis}),
  z.object({typ: z.literal('ende'), titel: z.string(), knopf: z.string().optional(), ...basis}),
  z.object({
    typ: z.literal('code'),
    titel: z.string().optional(),
    datei: z.string().optional(),
    zeilen: z.array(z.string()),
    ausgabe: z.string().optional(),
    ...basis,
  }),
  z.object({typ: z.literal('orbit'), titel: z.string(), mitte: z.string(), icons: z.array(z.string()).min(3).max(8), ...basis}),
  z.object({typ: z.literal('mindmap'), titel: z.string().optional(), mitte: z.string(), aeste: z.array(z.object({text: z.string(), icon: z.string().optional()})).min(2).max(6), ...basis}),
  z.object({typ: z.literal('ablauf'), titel: z.string(), stationen: z.array(z.object({text: z.string(), icon: z.string()})).min(2).max(4), ...basis}),
  z.object({typ: z.literal('woerter'), davor: z.string(), woerter: z.array(z.string()).min(2), danach: z.string().optional(), ...basis}),
  z.object({
    typ: z.literal('meldungen'),
    titel: z.string().optional(),
    meldungen: z.array(z.object({titel: z.string(), text: z.string(), icon: z.string().optional()})).min(1).max(4),
    ...basis,
  }),
  z.object({
    typ: z.literal('broll'),
    /** Video/Foto in studio/public, z. B. "projekte/x/broll/123.mp4". */
    datei: z.string(),
    titel: z.string().optional(),
    hervorheben: z.array(z.string()).optional(),
    ...basis,
  }),
  z.object({
    typ: z.literal('bildschirm'),
    /** Screenshot oder Bildschirmaufnahme in studio/public. */
    datei: z.string(),
    breite: z.number(),
    hoehe: z.number(),
    titel: z.string().optional(),
    /** Stelle, auf die gezoomt wird (Pixel im Original). */
    fokus: z.object({x: z.number(), y: z.number(), w: z.number(), h: z.number()}).optional(),
    ...basis,
  }),
]);

export type Szene = z.infer<typeof szeneSchema>;

export const erklaererSchema = z.object({
  design: designSchema,
  format: formatSchema,
  uebergang: uebergangSchema,
  sounds: z.boolean(),
  kanalname: z.string().optional(),
  handle: z.string().optional(),
  szenen: z.array(szeneSchema).min(1),
  ...medien,
});

export type ErklaererProps = z.infer<typeof erklaererSchema>;
