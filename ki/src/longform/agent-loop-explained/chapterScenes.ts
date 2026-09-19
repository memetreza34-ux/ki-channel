import type {LiveItem} from './LiveScene';
import type {AgentLoopChapterId} from './contract';

/**
 * Was in welchem Kapitel zu sehen ist.
 *
 * Zwei Regeln, die dieses Format tragen:
 *
 * 1. Jede Flaeche haengt an dem Wort, das sie erklaert — `on` ist der
 *    gesprochene Text, keine Framezahl. Aufgeloest wird das in `anchor.ts`,
 *    damit Bild und Stimme nicht auseinanderlaufen koennen.
 *
 * 2. Gezeigt wird die Sache selbst, nicht ein Zeichen dafuer. Faellt das Wort
 *    „Dateien", steht da eine Dateiliste mit Namen und Groessen — kein
 *    Ordnersymbol und erst recht kein Kaestchen mit „DATEIEN" darauf.
 *
 * `phase` teilt ein Kapitel in Tafeln, `span` sagt, ueber wieviele der drei
 * Spalten eine Flaeche geht.
 */
export const CHAPTER_SCENES: Partial<Record<AgentLoopChapterId, LiveItem[]>> = {
  hook: [
    // „Du gibst einer KI ein Ziel" — der Auftrag wird getippt.
    {on: 'einer KI', phase: 0, col: 0, row: 1, span: 2, panel: {
      typ: 'chat', frage: 'Vergleiche drei passende Tools und empfiehl mir eines.',
      zeilen: 3, wartet: true,
    }},
    // „statt dir nur eine Antwort zu schreiben" — genau da hoert der Chat auf.
    {on: 'nur eine Antwort', phase: 0, col: 2, row: 1, panel: {
      typ: 'zahl', wert: 1, label: 'Antwort — dann Schluss', icon: 'message-square-off',
    }},

    // „öffnet sie Informationen, benutzt Werkzeuge …"
    {on: 'öffnet', phase: 1, col: 0, row: 0, span: 2, panel: {
      typ: 'dateien', titel: 'Informationen', dateien: [
        {name: 'angebot-a.pdf', groesse: '240 KB'},
        {name: 'angebot-b.pdf', groesse: '198 KB'},
        {name: 'anforderungen.md', groesse: '12 KB'},
      ],
    }},
    {on: 'benutzt', phase: 1, col: 2, row: 0, panel: {
      typ: 'suche', anfrage: 'preis pro nutzer 2026',
      treffer: ['angebot-a · Seite 4', 'angebot-b · Seite 7'],
    }},
    {on: 'Zwischenschritte', phase: 1, col: 0, row: 1, span: 3, panel: {
      typ: 'log', titel: 'agent · läuft', proSchritt: 30, schritte: [
        'Dateien geöffnet',
        'Kernaussagen extrahiert',
        'Preise verglichen',
        'Zwischenstand gespeichert',
      ],
    }},

    // „und arbeitet so lange weiter"
    {on: 'lange weiter', phase: 2, col: 0, row: 0, span: 3, panel: {
      typ: 'fortschritt', eintraege: [
        {text: 'Angebote gelesen', fertig: true},
        {text: 'Preise verglichen', fertig: true},
        {text: 'Anforderungen abgeglichen', fertig: true},
        {text: 'Empfehlung formulieren', fertig: false},
      ],
    }},

    // „… bis ein Ergebnis vorliegt."
    {on: 'Ergebnis vorliegt', phase: 3, col: 0, row: 0, span: 3, panel: {
      typ: 'ergebnis', titel: 'Empfehlung', geprueft: true, zeilen: [
        'Angebot B erfüllt alle drei Anforderungen.',
        'Preis liegt 18 % unter Angebot A.',
        'Offener Punkt: Vertragslaufzeit prüfen.',
      ],
    }},

    // „Genau das ist die Idee hinter KI-Agenten."
    {on: 'Idee hinter', phase: 4, col: 0, row: 0, span: 3, panel: {
      typ: 'gegenueber',
      links: {titel: 'Chatbot', wert: '1 Schritt', zusatz: 'antwortet und wartet'},
      rechts: {titel: 'Agent', wert: '12 Schritte', zusatz: 'arbeitet bis zum Ergebnis'},
      fazit: 'derselbe Auftrag',
    }},

    // „Sie wirken auf den ersten Blick wie ein besonders schlauer Chatbot."
    {on: 'schlauer Chatbot', phase: 5, col: 0, row: 0, span: 2, panel: {
      typ: 'chat', frage: 'Von außen sieht es genauso aus.', zeilen: 2,
    }},
    // „Technisch passiert aber etwas Entscheidendes zusätzlich."
    {on: 'Das Modell', phase: 6, col: 0, row: 0, span: 3, panel: {
      typ: 'system', kern: 'Modell', teile: [
        {name: 'Anweisungen', icon: 'settings-2'},
        {name: 'Werkzeuge', icon: 'wrench'},
        {name: 'Kontext', icon: 'database'},
        {name: 'Grenzen', icon: 'shield-check'},
      ],
    }},

    // „… das Aktionen ausführen, Ergebnisse beobachten und ableiten kann."
    {on: 'Aktionen ausführen', phase: 7, col: 0, row: 0, span: 3, panel: {
      typ: 'loop', proZustand: 40,
      zustaende: ['Zustand ansehen', 'Schritt planen', 'Aktion ausführen', 'Ergebnis prüfen'],
    }},
    {on: 'zerlegen', phase: 7, col: 0, row: 1, span: 3, panel: {
      typ: 'werkzeuge', titel: 'Was der Agent darf', werkzeuge: [
        {name: 'Suche', icon: 'search', an: true, hinweis: 'freigegeben'},
        {name: 'Dateien lesen', icon: 'file-text', an: true, hinweis: 'freigegeben'},
        {name: 'Dateien ändern', icon: 'file-check', an: false, hinweis: 'braucht Bestätigung'},
      ],
    }},
    // „… vom Auftrag bis zur Kontrolle."
    {on: 'Kontrolle', phase: 8, col: 0, row: 0, span: 3, panel: {
      typ: 'freigabe', aktion: 'Datei „anforderungen.md" überschreiben',
      warnung: 'Diese Aktion lässt sich nicht rückgängig machen.',
    }},
  ],

  compare: [
    // „Ein normaler Chatbot arbeitet meistens Zug um Zug."
    {on: 'normaler', phase: 0, col: 0, row: 0, span: 2, panel: {
      typ: 'chat', frage: 'Was kostet Angebot A?', zeilen: 2, wartet: true,
    }},
    {on: 'Agent bekommt', phase: 0, col: 2, row: 0, panel: {
      typ: 'zahl', wert: 1, label: 'Frage · 1 Antwort', icon: 'message-square',
    }},

    // „Zum Beispiel: Vergleiche drei passende Tools …"
    {on: 'Vergleiche', phase: 1, col: 0, row: 0, span: 3, panel: {
      typ: 'chat', frage: 'Vergleiche drei passende Tools für meinen Anwendungsfall und erstelle eine begründete Empfehlung.',
      zeilen: 1,
    }},
    // „Das System muss Informationen suchen, vergleichen, rechnen, speichern, prüfen."
    {on: 'Informationen suchen', phase: 2, col: 0, row: 0, span: 3, panel: {
      typ: 'log', titel: 'agent · läuft', proSchritt: 26, schritte: [
        'Informationen gesucht',
        'Ergebnisse verglichen',
        'Preise gerechnet',
        'Zwischenstände gespeichert',
        'Aufgabe geprüft',
      ],
    }},

    // „Der wichtige Unterschied ist nicht ein stärkeres Sprachmodell,
    //  sondern ein Arbeitsablauf rund um das Modell."
    {on: 'wichtige Unterschied', phase: 3, col: 0, row: 0, span: 3, panel: {
      typ: 'system', kern: 'Modell', teile: [
        {name: 'Ziel', icon: 'target'},
        {name: 'Schritte', icon: 'list-checks'},
        {name: 'Werkzeuge', icon: 'wrench'},
        {name: 'Prüfung', icon: 'check'},
      ],
    }},
  ],
};
