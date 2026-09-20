/**
 * Deutsch-nach-Englisch-Bruecke fuer Katalog-Tags.
 *
 * Der Kanal spricht Deutsch, der Katalog ist englisch getaggt. Ohne Bruecke
 * findet "Latenz" den Eintrag mit dem Tag "latency" nicht, der Reuse-Score
 * bleibt unter der Schwelle und der Planer baut jedes Mal neu, statt einen
 * passenden vorhandenen Prototypen zu verwenden.
 *
 * Nur Begriffe, die es im Katalog wirklich als Tag gibt - die Bruecke soll
 * bestehende Treffer finden, keine neuen erfinden.
 */
export const GERMAN_TAG_BRIDGE: Readonly<Record<string, string>> = {
  latenz: 'latency',
  geschwindigkeit: 'speed',
  tempo: 'speed',
  last: 'load',
  kapazitat: 'capacity',
  engpass: 'bottleneck',
  durchsatz: 'throughput',
  leistung: 'performance',
  skalierung: 'scaling',
  skalieren: 'scaling',
  kosten: 'cost',
  preis: 'price',
  speicher: 'memory',
  gedachtnis: 'memory',
  kontext: 'context',
  fenster: 'window',
  wort: 'word',
  worter: 'word',
  sprache: 'language',
  bedeutung: 'meaning',
  wissen: 'knowledge',
  antwort: 'answer',
  ergebnis: 'result',
  eingabe: 'input',
  ausgabe: 'output',
  suche: 'search',
  fehler: 'error',
  risiko: 'risk',
  sicherheit: 'security',
  datenschutz: 'privacy',
  verschlusselung: 'encryption',
  berechtigung: 'permission',
  schutz: 'protection',
  wahrscheinlichkeit: 'probability',
  konfidenz: 'confidence',
  unsicherheit: 'uncertainty',
  entscheidung: 'decision',
  auswahl: 'selection',
  vergleich: 'comparison',
  unterschied: 'difference',
  reihenfolge: 'order',
  schritt: 'steps',
  schritte: 'steps',
  prozess: 'process',
  ablauf: 'workflow',
  modell: 'model',
  daten: 'data',
  dokument: 'document',
  zeit: 'time',
  millisekunden: 'time',
  sekunden: 'time',
  verlauf: 'history',
  aktualisierung: 'update',
  qualitat: 'quality-control',
  bewertung: 'score',
  rangliste: 'ranking',
  zusammenfassung: 'summarization',
  umwandlung: 'transformation',
  schicht: 'layer',
  schichten: 'layer',
  verbindung: 'connection',
  abhangigkeit: 'dependency',
  mensch: 'human',
  zusammenarbeit: 'collaboration',
  grenze: 'limit',
};

/** Ergaenzt zu jedem deutschen Begriff sein englisches Katalog-Pendant. */
export const bridgeGermanTerms = (values: readonly string[]): string[] => {
  const out: string[] = [];
  for (const value of values) {
    out.push(value);
    const key = value
      .trim()
      .toLocaleLowerCase('de-DE')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '');
    const bridged = GERMAN_TAG_BRIDGE[key];
    if (bridged) out.push(bridged);
  }
  return out;
};
