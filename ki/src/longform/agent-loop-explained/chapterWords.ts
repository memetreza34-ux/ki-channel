import {ICONS, type WordItem} from './WordScene';
import type {AgentLoopChapterId} from './contract';

/**
 * Wort-Choreografie je Kapitel.
 *
 * Alle `at`-Werte sind Frames relativ zum Kapitelstart und stammen aus einer
 * Whisper-Transkription des echten Voiceovers mit Wort-Timestamps. Der
 * Kommentar hinter jedem Eintrag nennt das Wort, auf dem das Bild sitzt.
 *
 * Kapitel 1 hat eine eigene, handgebaute Szene (HookScene) und steht deshalb
 * nicht in dieser Tabelle.
 */
export const CHAPTER_WORDS: Partial<Record<AgentLoopChapterId, WordItem[]>> = {
  compare: [
    {at: 90, col: 0, row: 0, kind: 'chip', text: 'AKTIONEN AUSFÜHREN', icon: ICONS.code},      // "Aktionen"
    {at: 139, col: 1, row: 0, kind: 'chip', text: 'ERGEBNISSE BEOBACHTEN', icon: ICONS.suche}, // "Ergebnisse"
    {at: 217, col: 2, row: 0, kind: 'chip', text: 'NÄCHSTER SCHRITT', icon: ICONS.loop},       // "Schritt"
    {at: 458, col: 0, row: 1, kind: 'card', title: 'CHATBOT', text: 'Arbeitet Zug um Zug'},    // "Chatbot"
    {at: 538, col: 0, row: 2, kind: 'flow', steps: ['DU FRAGST', 'MODELL ANTWORTET', 'DU DRAN'], tone: 'off'}, // "Du fragst"
    {at: 651, col: 2, row: 1, kind: 'card', title: 'AGENT', text: 'Bekommt ein Ziel'},         // "Agent"
    {at: 742, col: 1, row: 1, kind: 'note', text: '„Vergleiche drei passende Tools für meinen Anwendungsfall."'}, // "vergleiche"
    {at: 886, col: 2, row: 2, kind: 'card', title: 'ERGEBNIS', text: 'Eine begründete Empfehlung'}, // "Empfehlung"
    {at: 1030, col: 1, row: 2, kind: 'chip', text: 'INFORMATIONEN SUCHEN', icon: ICONS.suche}, // "Informationen suchen"
  ],

  anatomy: [
    {at: 25, col: 0, row: 0, kind: 'chip', text: 'ERGEBNISSE VERGLEICHEN', icon: ICONS.check}, // "Ergebnisse vergleichen"
    {at: 98, col: 1, row: 0, kind: 'chip', text: 'ZWISCHENSTÄNDE SPEICHERN', icon: ICONS.db},  // "Zwischenstände"
    {at: 158, col: 2, row: 0, kind: 'chip', text: 'AM ENDE PRÜFEN', icon: ICONS.check},        // "prüfen"
    {at: 379, col: 1, row: 1, kind: 'big', text: 'Ein Arbeitsablauf rund um das Modell'},      // "Arbeitsablauf"
    {at: 526, col: 1, row: 2, kind: 'note', text: 'Vier Bausteine'},                           // "Bausteinen"
    {at: 586, col: 0, row: 1, kind: 'card', title: 'ERSTENS · MODELL', text: 'Interpretiert die Aufgabe'}, // "Modell"
    {at: 755, col: 0, row: 2, kind: 'card', title: 'ZWEITENS · ANWEISUNGEN', text: 'Ziel, Regeln, Stopp'},  // "Anweisungen"
    {at: 1009, col: 2, row: 1, kind: 'card', title: 'DRITTENS · WERKZEUGE', text: 'Suche, Dateien, Code'},  // "Werkzeuge"
    {at: 1067, col: 2, row: 2, kind: 'flow', steps: ['SUCHE', 'DATEIEN', 'CODE'], stagger: 20}, // "Suche, Dateien"
  ],

  loop: [
    {at: 75, col: 2, row: 0, kind: 'card', title: 'VIERTENS · KONTEXT', text: 'Was bereits passiert ist'}, // "Kontext"
    {at: 283, col: 2, row: 1, kind: 'chip', text: 'WELCHE SCHRITTE FEHLEN', icon: ICONS.loop},  // "Schritte"
    {at: 434, col: 1, row: 0, kind: 'chip', text: 'ZIEL', icon: ICONS.ziel},                    // "Ziel"
    {at: 521, col: 0, row: 0, kind: 'chip', text: 'ZUSTAND BETRACHTEN', icon: ICONS.suche},      // "Zustand"
    {at: 670, col: 0, row: 1, kind: 'chip', text: 'SCHRITT PLANEN', icon: ICONS.code},           // "Schritt"
    {at: 758, col: 0, row: 2, kind: 'chip', text: 'AKTION AUSFÜHREN', icon: ICONS.browser},      // "Aktion"
    {at: 862, col: 1, row: 2, kind: 'chip', text: 'ZURÜCK IN DEN KONTEXT', icon: ICONS.loop},    // "Kontext"
    {at: 941, col: 1, row: 1, kind: 'flow', steps: ['BEOBACHTEN', 'ENTSCHEIDEN', 'HANDELN', 'PRÜFEN'], stagger: 28}, // "Beobachten"
    {at: 1141, col: 2, row: 2, kind: 'big', text: 'Eine Kette aus vielen Aktionen'},             // "Kette"
  ],

  example: [
    {at: 196, col: 1, row: 0, kind: 'card', title: 'AUFGABE', text: 'Entscheidungsvorlage aus mehreren Dokumenten', wide: true}, // "Entscheidungsvorlage"
    {at: 294, col: 0, row: 0, kind: 'chip', text: 'DATEIEN ÖFFNEN', icon: ICONS.datei},          // "öffnet"
    {at: 395, col: 0, row: 1, kind: 'chip', text: 'PUNKTE EXTRAHIEREN', icon: ICONS.code},        // "wichtigsten Punkte"
    {at: 497, col: 1, row: 1, kind: 'card', title: 'KONFLIKT', text: 'Zwei Angaben passen nicht zusammen', tone: 'bad'}, // "Angaben"
    {at: 643, col: 2, row: 1, kind: 'chip', text: 'FEHLENDES GEZIELT SUCHEN', icon: ICONS.suche}, // "fehlenden"
    {at: 743, col: 2, row: 0, kind: 'chip', text: 'ENTWURF ERSTELLEN', icon: ICONS.datei},        // "Entwurf"
    {at: 822, col: 2, row: 2, kind: 'card', title: 'GEPRÜFT', text: 'Anforderungen enthalten', tone: 'good'}, // "Anforderungen"
    {at: 958, col: 1, row: 2, kind: 'big', text: 'Nicht nur Text — ein Prozess'},                 // "steuert"
    {at: 1159, col: 0, row: 2, kind: 'note', text: 'Formulieren kann es allein. Handeln nicht.'}, // "formulieren"
  ],

  tools: [
    {at: 133, col: 0, row: 0, kind: 'card', title: 'SUCHWERKZEUG', text: 'Aktuelle Informationen'},   // "Suchwerkzeug"
    {at: 218, col: 1, row: 0, kind: 'card', title: 'DATEIZUGRIFF', text: 'Projektkontext'},           // "Dateizugriff"
    {at: 304, col: 2, row: 0, kind: 'card', title: 'CODEAUSFÜHRUNG', text: 'Berechnungen und Tests'}, // "Codausführung"
    {at: 401, col: 0, row: 1, kind: 'card', title: 'BROWSER', text: 'Webseiten bedienen'},            // "Browser"
    {at: 575, col: 1, row: 1, kind: 'big', text: 'Nicht jedes Werkzeug, immer'},                      // "benutzen"
    {at: 677, col: 2, row: 1, kind: 'chip', text: 'PASSEND ZUM ZUSTAND', icon: ICONS.ziel},           // "Werkzeug"
    {at: 824, col: 0, row: 2, kind: 'chip', text: 'FEHLER WIEGEN SCHWERER', icon: ICONS.warn, tone: 'bad'}, // "Fehler"
    {at: 961, col: 1, row: 2, kind: 'note', text: 'Beim Chatbot bleibt der Fehler in der Antwort.', tone: 'off'}, // "Fehler"
    {at: 1057, col: 2, row: 2, kind: 'card', title: 'BEIM AGENTEN', text: 'Die falsche Annahme wandert mit', tone: 'bad'}, // "Annahme"
  ],

  risks: [
    {at: 21, col: 0, row: 0, kind: 'flow', steps: ['FALSCHE ANNAHME', 'SUCHE', 'DATEI', 'ERGEBNIS'], tone: 'bad', stagger: 10}, // "falschen"
    {at: 106, col: 1, row: 0, kind: 'chip', text: 'EXTERNE INHALTE', icon: ICONS.browser, tone: 'bad'}, // "Inhalte"
    {at: 199, col: 2, row: 0, kind: 'card', title: 'FREMDE ANWEISUNG', text: '„Ignoriere das eigentliche Ziel …"', tone: 'bad'}, // "Anweisungen"
    {at: 348, col: 1, row: 1, kind: 'big', text: 'Grenzen, Rechte, Prüfungen'},                   // "Grenzen"
    {at: 563, col: 0, row: 1, kind: 'chip', text: 'GEZIELT FREIGEBEN', icon: ICONS.schild},        // "gezielt"
    {at: 653, col: 2, row: 1, kind: 'chip', text: 'BESTÄTIGUNG VERLANGEN', icon: ICONS.check},      // "Bestätigung"
    {at: 728, col: 0, row: 2, kind: 'chip', text: 'ERGEBNISSE PRÜFEN', icon: ICONS.check, tone: 'good'}, // "überprüft"
    {at: 800, col: 1, row: 2, kind: 'chip', text: 'STOPP-KRITERIUM', icon: ICONS.stop},             // "Stopp"
    {at: 1038, col: 2, row: 2, kind: 'card', title: 'MENSCHLICHE KONTROLLE', text: 'Bei sensiblen Aktionen', tone: 'good'}, // "menschliche"
  ],

  guardrails: [
    {at: 85, col: 1, row: 0, kind: 'big', text: 'Nicht jede Aufgabe braucht einen Agenten'},       // "Agenten"
    {at: 253, col: 0, row: 0, kind: 'flow', steps: ['A', 'B', 'C', 'D'], tone: 'off', stagger: 9}, // "Workflow"
    {at: 316, col: 0, row: 1, kind: 'chip', text: 'VORHERSEHBAR', icon: ICONS.check, tone: 'off'}, // "vorhersehbarer"
    {at: 440, col: 2, row: 0, kind: 'card', title: 'AGENT LOHNT', text: 'Wenn der Weg offen ist'},  // "Weg"
    {at: 546, col: 2, row: 1, kind: 'chip', text: 'INFORMATIONEN FEHLEN', icon: ICONS.suche},       // "Informationen"
    {at: 610, col: 1, row: 1, kind: 'chip', text: 'ENTSCHEIDUNGEN UNTERWEGS', icon: ICONS.loop},    // "unterwegs"
    {at: 689, col: 2, row: 2, kind: 'chip', text: 'WERKZEUGE JE SITUATION', icon: ICONS.code},      // "Werkzeuge"
    {at: 800, col: 0, row: 2, kind: 'note', text: 'Mehr Autonomie ist kein Selbstzweck.'},          // "Autonomie"
    {at: 958, col: 1, row: 2, kind: 'big', text: 'Das mentale Modell'},                             // "Modell"
  ],

  fit: [
    {at: 27, col: 0, row: 0, kind: 'note', text: 'Kein Chatbot mit neuem Namen.', tone: 'off'},     // "Chatbot"
    {at: 131, col: 1, row: 0, kind: 'big', text: 'Ein Modell in einer Schleife'},                   // "Schleife"
    {at: 153, col: 1, row: 1, kind: 'flow', steps: ['ZIEL', 'KONTEXT', 'WERKZEUGE', 'AKTION', 'FEEDBACK'], stagger: 24}, // "Ziel, Kontext"
    {at: 358, col: 0, row: 1, kind: 'card', title: 'STÄRKE', text: 'Mehrere Schritte selbst koordinieren', tone: 'good'}, // "Schritte"
    {at: 530, col: 2, row: 1, kind: 'card', title: 'SCHWÄCHE', text: 'Jeder Schritt kann Unsicherheit erzeugen', tone: 'bad'}, // "Schritt"
    {at: 749, col: 0, row: 2, kind: 'chip', text: 'GUTE WERKZEUGE', icon: ICONS.code},              // "Werkzeuge"
    {at: 790, col: 1, row: 2, kind: 'chip', text: 'KLARE REGELN', icon: ICONS.schild},              // "Regeln"
    {at: 824, col: 2, row: 2, kind: 'chip', text: 'BEGRENZTE RECHTE', icon: ICONS.stop},            // "Rechte"
    {at: 869, col: 2, row: 0, kind: 'chip', text: 'ÜBERPRÜFBARE STÄNDE', icon: ICONS.check, tone: 'good'}, // "Zwischenstände"
  ],
};
