import {ICONS} from './icons';
import type {LiveItem} from './LiveScene';
import type {AgentLoopChapterId} from './contract';

/**
 * Was in welchem Kapitel zu sehen ist.
 *
 * Jedes Bild haengt an dem Wort, das es erklaert — `on` ist der gesprochene
 * Text, nicht eine Framezahl. Der Frame wird daraus zur Laufzeit abgeleitet
 * (anchor.ts), damit Bild und Stimme nicht auseinanderlaufen koennen.
 *
 * `phase` teilt ein Kapitel in Tafeln. Beginnt eine neue Phase, raeumt die
 * vorige nach oben ab. Dadurch passen deutlich mehr Bilder in ein Kapitel als
 * die neun Rasterplaetze, und alle paar Sekunden bewegt sich das ganze Bild —
 * statt dass nur ein weiteres Element dazukommt und alles andere steht.
 *
 * `span` sagt, ueber wieviele der drei Rasterspalten ein Bild geht. Breite
 * Bilder (Zitate, Ablaufketten, grosse Aussagen) brauchen 2 oder 3, sonst
 * laufen sie aus dem Bild.
 */
export const CHAPTER_SCENES: Partial<Record<AgentLoopChapterId, LiveItem[]>> = {
  hook: [
    // „Du gibst einer KI ein Ziel – und statt dir nur eine Antwort zu schreiben …"
    {on: 'einer KI', phase: 0, col: 0, row: 0, kind: 'card', title: 'KI', text: 'Bekommt einen Auftrag'},
    {on: 'ein Ziel', phase: 0, col: 1, row: 0, kind: 'card', title: 'ZIEL', text: 'Vergleiche die Tools und empfiehl eines'},
    {on: 'nur eine Antwort', phase: 0, col: 2, row: 0, kind: 'stack', tone: 'off',
      title: 'NUR EINE ANTWORT', rows: ['Ein Text', 'Dann ist Schluss']},
    {on: 'öffnet', phase: 0, col: 0, row: 1, kind: 'chip', text: 'INFORMATIONEN ÖFFNEN', icon: ICONS.datei},
    {on: 'Werkzeuge', phase: 0, col: 1, row: 1, kind: 'chip', text: 'WERKZEUGE BENUTZEN', icon: ICONS.code},
    {on: 'Zwischenschritte', phase: 0, col: 0, row: 2, span: 2, kind: 'flow', stagger: 13,
      steps: ['PRÜFEN', 'VERGLEICHEN', 'WÄHLEN']},
    {on: 'lange weiter', phase: 0, col: 2, row: 1, kind: 'chip', text: 'ARBEITET WEITER', icon: ICONS.loop},
    {on: 'Ergebnis vorliegt', phase: 0, col: 2, row: 2, kind: 'card', tone: 'good',
      title: 'ERGEBNIS', text: 'Eine begründete Empfehlung'},

    // „Genau das ist die Idee hinter KI-Agenten. Sie wirken wie ein schlauer Chatbot."
    {on: 'Idee hinter', phase: 1, col: 0, row: 0, span: 3, kind: 'big', text: 'Das ist die Idee hinter KI-Agenten'},
    {on: 'schlauer Chatbot', phase: 1, col: 0, row: 1, span: 2, kind: 'note', tone: 'off',
      text: 'Wirkt auf den ersten Blick wie ein besonders schlauer Chatbot.'},
    {on: 'Entscheidendes', phase: 1, col: 2, row: 1, kind: 'card',
      title: 'TECHNISCH', text: 'Kommt etwas Entscheidendes dazu'},
    {on: 'steckt', phase: 1, col: 0, row: 2, span: 3, kind: 'big', text: 'Das Modell steckt in einem System'},

    // „… das Aktionen ausführen, Ergebnisse beobachten und den nächsten Schritt ableiten kann."
    {on: 'Aktionen ausführen', phase: 2, col: 0, row: 0, kind: 'chip', text: 'AKTIONEN AUSFÜHREN', icon: ICONS.browser},
    {on: 'Ergebnisse beobachten', phase: 2, col: 1, row: 0, kind: 'chip', text: 'ERGEBNISSE BEOBACHTEN', icon: ICONS.suche},
    {on: 'nächsten Schritt', phase: 2, col: 2, row: 0, kind: 'chip', text: 'NÄCHSTEN SCHRITT ABLEITEN', icon: ICONS.loop},
    {on: 'In diesem Video', phase: 2, col: 0, row: 1, span: 3, kind: 'loop',
      steps: ['AUSFÜHREN', 'BEOBACHTEN', 'ABLEITEN']},
    {on: 'zerlegen', phase: 2, col: 0, row: 2, span: 3, kind: 'big', text: 'Vom Auftrag bis zur Kontrolle'},
  ],

  compare: [
    // „Ein normaler Chatbot arbeitet meistens Zug um Zug."
    {on: 'normaler', phase: 0, col: 0, row: 0, kind: 'card', title: 'CHATBOT', text: 'Arbeitet Zug um Zug'},
    {on: 'fragst', phase: 0, col: 0, row: 1, span: 2, kind: 'flow', tone: 'off', stagger: 18,
      steps: ['DU FRAGST', 'MODELL ANTWORTET', 'DU BIST DRAN']},
    {on: 'Agent bekommt', phase: 0, col: 2, row: 0, kind: 'card', title: 'AGENT', text: 'Bekommt ein Ziel'},
    // Das Zitat entsteht Wort fuer Wort mit dem Sprecher.
    {on: 'Vergleiche', phase: 0, col: 0, row: 2, span: 2, kind: 'quote',
      text: 'Vergleiche drei passende Tools für meinen Anwendungsfall und erstelle eine begründete Empfehlung.'},

    // „Dafür reicht eine einzelne Textantwort oft nicht."
    {on: 'reicht', phase: 1, col: 0, row: 0, span: 3, kind: 'big', text: 'Eine einzelne Textantwort reicht nicht'},
    {on: 'Informationen suchen', phase: 1, col: 0, row: 1, kind: 'chip', text: 'INFORMATIONEN SUCHEN', icon: ICONS.suche},
    {on: 'Ergebnisse vergleichen', phase: 1, col: 1, row: 1, kind: 'chip', text: 'ERGEBNISSE VERGLEICHEN', icon: ICONS.check},
    {on: 'rechnen', phase: 1, col: 2, row: 1, kind: 'chip', text: 'RECHNEN', icon: ICONS.code},
    {on: 'Zwischenstände', phase: 1, col: 0, row: 2, kind: 'chip', text: 'ZWISCHENSTÄNDE SPEICHERN', icon: ICONS.db},
    {on: 'Aufgabe wirklich', phase: 1, col: 1, row: 2, span: 2, kind: 'card', tone: 'good',
      title: 'AM ENDE', text: 'Ist die Aufgabe wirklich erfüllt'},

    // „Der wichtige Unterschied ist also nicht nur ein stärkeres Sprachmodell."
    {on: 'wichtige Unterschied', phase: 2, col: 0, row: 0, span: 3, kind: 'big', text: 'Nicht nur ein stärkeres Sprachmodell'},
    {on: 'sondern', phase: 2, col: 0, row: 1, span: 3, kind: 'big', text: 'Ein Arbeitsablauf rund um das Modell'},
    {on: 'rund um das Modell', phase: 2, col: 0, row: 2, span: 3, kind: 'flow', stagger: 16,
      steps: ['ZIEL', 'SCHRITTE', 'WERKZEUGE', 'PRÜFUNG']},
  ],

  anatomy: [
    {on: 'Ablauf besteht', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Dieser Ablauf besteht aus vier Bausteinen'},
    {on: 'vier Bausteinen', phase: 0, col: 0, row: 1, span: 3, kind: 'flow', stagger: 14,
      steps: ['MODELL', 'ANWEISUNGEN', 'WERKZEUGE', 'KONTEXT']},
    {on: 'Erstens', phase: 0, col: 0, row: 2, span: 2, kind: 'card', title: 'ERSTENS · MODELL', text: 'Interpretiert die Aufgabe'},
    {on: 'entscheidet', phase: 0, col: 2, row: 2, kind: 'chip', text: 'ENTSCHEIDET, WAS FOLGT', icon: ICONS.modell},

    {on: 'Zweitens', phase: 1, col: 0, row: 0, span: 3, kind: 'card', title: 'ZWEITENS · ANWEISUNGEN UND GRENZEN', text: 'Ziel, Regeln, Stopp'},
    {on: 'Regeln', phase: 1, col: 0, row: 1, span: 3, kind: 'stack', title: 'GRENZEN',
      rows: ['Welches Ziel gilt', 'Welche Regeln gelten', 'Wann der Agent stoppt']},

    {on: 'Drittens', phase: 2, col: 0, row: 0, span: 3, kind: 'card',
      title: 'DRITTENS · WERKZEUGE', text: 'Was der Agent tatsächlich bedienen darf'},
    {on: 'Suche', phase: 2, col: 0, row: 1, kind: 'chip', text: 'SUCHE', icon: ICONS.suche},
    {on: 'Dateien', phase: 2, col: 1, row: 1, kind: 'chip', text: 'DATEIEN', icon: ICONS.datei},
    {on: 'Datenbanken', phase: 2, col: 2, row: 1, kind: 'chip', text: 'DATENBANKEN', icon: ICONS.db},
    {on: 'Code', phase: 2, col: 0, row: 2, kind: 'chip', text: 'CODE-AUSFÜHRUNG', icon: ICONS.code},
    {on: 'Browser', phase: 2, col: 1, row: 2, kind: 'chip', text: 'BROWSER', icon: ICONS.browser},
    {on: 'andere Funktionen', phase: 2, col: 2, row: 2, kind: 'chip', tone: 'off', text: 'WEITERE FUNKTIONEN', icon: ICONS.loop},

    {on: 'viertens', phase: 3, col: 0, row: 0, span: 3, kind: 'card',
      title: 'VIERTENS · KONTEXT UND ZUSTAND', text: 'Was das System über die laufende Arbeit weiß'},
    {on: 'bereits passiert', phase: 3, col: 0, row: 1, span: 2, kind: 'stack', title: 'ZUSTAND',
      rows: ['Was bereits passiert ist', 'Welche Ergebnisse vorliegen', 'Welche Schritte noch fehlen']},
    {on: 'Schritte noch fehlen', phase: 3, col: 2, row: 1, kind: 'meter', title: 'FORTSCHRITT', text: 'Noch offen'},
  ],

  loop: [
    {on: 'eigentliche', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Jetzt der eigentliche Agenten-Loop'},
    {on: 'Anfang steht', phase: 0, col: 0, row: 1, span: 3, kind: 'chip', text: 'AM ANFANG STEHT DAS ZIEL', icon: ICONS.ziel},
    {on: 'aktuellen Zustand', phase: 0, col: 0, row: 2, span: 2, kind: 'chip', text: 'ZUSTAND BETRACHTEN', icon: ICONS.suche},
    {on: 'Informationen habe', phase: 0, col: 2, row: 2, kind: 'note', text: 'Was weiß ich schon?'},

    {on: 'plant', phase: 1, col: 0, row: 0, kind: 'chip', text: 'SCHRITT PLANEN', icon: ICONS.loop},
    {on: 'wählt', phase: 1, col: 1, row: 0, kind: 'chip', text: 'WERKZEUG WÄHLEN', icon: ICONS.code},
    {on: 'Aktion aus', phase: 1, col: 2, row: 0, kind: 'chip', text: 'AKTION AUSFÜHREN', icon: ICONS.browser},
    {on: 'fließt zurück', phase: 1, col: 0, row: 1, span: 3, kind: 'big', text: 'Das Ergebnis fließt zurück in den Kontext'},
    // Der Kern des Kapitels: eine Schleife, die sich tatsaechlich dreht.
    {on: 'Schleife erneut', phase: 1, col: 0, row: 2, span: 3, kind: 'loop',
      steps: ['BEOBACHTEN', 'ENTSCHEIDEN', 'HANDELN', 'PRÜFEN']},

    {on: 'einzigen', phase: 2, col: 0, row: 0, span: 3, kind: 'big', text: 'Aus einer einzigen Anweisung'},
    {on: 'Kette', phase: 2, col: 0, row: 1, span: 3, kind: 'flow', stagger: 11,
      steps: ['SUCHEN', 'LESEN', 'RECHNEN', 'SCHREIBEN', 'PRÜFEN']},
    {on: 'vielen einzelnen', phase: 2, col: 0, row: 2, span: 3, kind: 'big', text: 'Eine Kette aus vielen einzelnen Aktionen'},
  ],

  example: [
    {on: 'Beispiel', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Ein Beispiel macht das klar'},
    {on: 'Entscheidungsvorlage', phase: 0, col: 0, row: 1, span: 3, kind: 'card',
      title: 'AUFGABE', text: 'Aus mehreren Dokumenten eine kurze Entscheidungsvorlage erstellen'},
    {on: 'öffnet', phase: 0, col: 0, row: 2, span: 2, kind: 'chip', text: 'DATEIEN FINDEN UND ÖFFNEN', icon: ICONS.datei},
    {on: 'extrahiert', phase: 0, col: 2, row: 2, kind: 'chip', text: 'WICHTIGSTE PUNKTE', icon: ICONS.code},

    {on: 'zusammenpassen', phase: 1, col: 0, row: 0, span: 3, kind: 'card', tone: 'bad',
      title: 'KONFLIKT', text: 'Zwei Angaben passen nicht zusammen'},
    {on: 'weiterzuschreiben', phase: 1, col: 0, row: 1, span: 3, kind: 'note', tone: 'off',
      text: 'Statt einfach weiterzuschreiben.'},
    {on: 'gezielt', phase: 1, col: 0, row: 2, span: 3, kind: 'chip', text: 'GEZIELT NACHFRAGEN', icon: ICONS.suche},

    {on: 'Entwurf', phase: 2, col: 0, row: 0, kind: 'chip', text: 'ENTWURF ERSTELLEN', icon: ICONS.datei},
    {on: 'Anforderungen', phase: 2, col: 1, row: 0, span: 2, kind: 'card', tone: 'good',
      title: 'GEPRÜFT', text: 'Sind die wichtigsten Anforderungen enthalten'},
    {on: 'liefert', phase: 2, col: 0, row: 1, span: 3, kind: 'flow', stagger: 13,
      steps: ['ÖFFNEN', 'EXTRAHIEREN', 'KONFLIKT', 'NACHFRAGEN', 'ENTWURF', 'PRÜFEN']},
    {on: 'steuert', phase: 2, col: 0, row: 2, span: 3, kind: 'big', text: 'Nicht nur Text — ein Prozess'},
  ],

  tools: [
    {on: 'Werkzeuge so wichtig', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Genau deshalb sind Werkzeuge so wichtig'},
    {on: 'formulieren', phase: 0, col: 0, row: 1, span: 3, kind: 'card',
      title: 'SPRACHMODELL ALLEIN', text: 'Kann sehr gut formulieren und schlussfolgern'},
    {on: 'ohne Zugriff', phase: 0, col: 0, row: 2, span: 3, kind: 'card', tone: 'bad',
      title: 'OHNE UMGEBUNG', text: 'Viele Aufgaben lassen sich nicht erledigen'},

    {on: 'Suchwerkzeug', phase: 1, col: 0, row: 0, kind: 'card', title: 'SUCHWERKZEUG', text: 'Aktuelle Informationen'},
    {on: 'Dateizugriff', phase: 1, col: 1, row: 0, kind: 'card', title: 'DATEIZUGRIFF', text: 'Projektkontext'},
    {on: 'Berechnungen', phase: 1, col: 2, row: 0, kind: 'card', title: 'CODE', text: 'Berechnungen und Tests'},
    {on: 'Browser', phase: 1, col: 0, row: 1, span: 3, kind: 'card',
      title: 'BROWSER', text: 'Unterstützte Webseiten bedienen'},

    {on: 'nicht jedes Werkzeug', phase: 2, col: 0, row: 0, span: 3, kind: 'big', text: 'Nicht jedes Werkzeug, immer'},
    {on: 'abhängig', phase: 2, col: 0, row: 1, span: 3, kind: 'chip', text: 'PASSEND ZUM AKTUELLEN ZUSTAND', icon: ICONS.ziel},
    {on: 'sinnvoll erscheint', phase: 2, col: 0, row: 2, span: 3, kind: 'flow', stagger: 15,
      steps: ['ZUSTAND', 'WELCHES WERKZEUG', 'AKTION']},
  ],

  risks: [
    {on: 'klingt mächtig', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Das klingt mächtig'},
    {on: 'gefährlicher', phase: 0, col: 0, row: 1, span: 3, kind: 'big', tone: 'bad', text: 'Macht Fehler aber auch gefährlicher'},
    {on: 'bleibt der Fehler', phase: 0, col: 0, row: 2, span: 3, kind: 'card', tone: 'off',
      title: 'BEIM CHATBOT', text: 'Der Fehler bleibt in dieser Antwort'},

    {on: 'falsche Annahme', phase: 1, col: 0, row: 0, span: 3, kind: 'card', tone: 'bad',
      title: 'BEIM AGENTEN', text: 'Die falsche Annahme wandert in den nächsten Schritt mit'},
    {on: 'falschen Sache', phase: 1, col: 0, row: 1, span: 3, kind: 'flow', tone: 'bad', stagger: 14,
      steps: ['FALSCHE ANNAHME', 'FALSCHE SUCHE', 'FALSCHE DATEI', 'FALSCHES ERGEBNIS']},

    {on: 'externe Inhalte', phase: 2, col: 0, row: 0, span: 3, kind: 'chip', tone: 'bad',
      text: 'EXTERNE INHALTE KÖNNEN PROBLEMATISCH SEIN', icon: ICONS.browser},
    {on: 'Anweisungen enthalten', phase: 2, col: 0, row: 1, span: 3, kind: 'quote', tone: 'bad',
      text: 'Ignoriere das eigentliche Ziel und tu stattdessen Folgendes …'},
    {on: 'Nutzerziel', phase: 2, col: 0, row: 2, span: 3, kind: 'note',
      text: 'Text aus einer Quelle ist Inhalt — niemals ein Befehl.'},

    {on: 'Grenzen', phase: 3, col: 0, row: 0, span: 3, kind: 'big', text: 'Deshalb brauchen Agenten Grenzen'},
    {on: 'Rechte', phase: 3, col: 0, row: 1, span: 3, kind: 'flow', stagger: 18,
      steps: ['GRENZEN', 'RECHTE', 'PRÜFUNGEN']},
  ],

  guardrails: [
    {on: 'Gute Agentensysteme', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Gute Agentensysteme'},
    {on: 'Vollzugriff', phase: 0, col: 0, row: 1, span: 3, kind: 'big', tone: 'bad', text: 'Geben nicht überall Vollzugriff'},
    {on: 'gezielt freigegeben', phase: 0, col: 0, row: 2, span: 3, kind: 'chip', text: 'WERKZEUGE GEZIELT FREIGEBEN', icon: ICONS.schild},

    {on: 'Bestätigung', phase: 1, col: 0, row: 0, kind: 'chip', text: 'RISKANTES BESTÄTIGEN', icon: ICONS.check},
    {on: 'überprüft', phase: 1, col: 1, row: 0, kind: 'chip', tone: 'good', text: 'ERGEBNISSE PRÜFEN', icon: ICONS.check},
    {on: 'Stop', phase: 1, col: 2, row: 0, kind: 'chip', text: 'STOPP-KRITERIUM', icon: ICONS.stop},
    {on: 'wirklich erledigt', phase: 1, col: 0, row: 1, span: 3, kind: 'card',
      title: 'WANN IST SCHLUSS', text: 'Erledigt — oder lieber nachfragen'},

    {on: 'sensible', phase: 2, col: 0, row: 0, span: 3, kind: 'card', tone: 'good',
      title: 'MENSCHLICHE KONTROLLE', text: 'Bei sensiblen und irreversiblen Aktionen'},
    {on: 'Autonomie', phase: 2, col: 0, row: 1, span: 3, kind: 'big', text: 'Autonomie ist kein Selbstzweck'},
    {on: 'abgegeben', phase: 2, col: 0, row: 2, span: 3, kind: 'note', tone: 'off',
      text: 'Nicht jede Entscheidung gehört automatisch an die KI.'},
  ],

  fit: [
    {on: 'nicht jede Aufgabe', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Nicht jede Aufgabe braucht einen Agenten'},
    {on: 'immer gleich', phase: 0, col: 0, row: 1, span: 3, kind: 'flow', tone: 'off', stagger: 12,
      steps: ['A', 'B', 'C', 'D']},
    {on: 'vorhersehbarer', phase: 0, col: 0, row: 2, span: 3, kind: 'stack', tone: 'off',
      title: 'KLASSISCHER WORKFLOW', rows: ['Schneller', 'Günstiger', 'Vorhersehbarer']},

    {on: 'interessant', phase: 1, col: 0, row: 0, span: 3, kind: 'card',
      title: 'AGENT LOHNT', text: 'Wenn der Weg zum Ziel nicht im Voraus feststeht'},
    {on: 'Informationen fehlen', phase: 1, col: 0, row: 1, kind: 'chip', text: 'INFORMATIONEN FEHLEN', icon: ICONS.suche},
    {on: 'unterwegs', phase: 1, col: 1, row: 1, kind: 'chip', text: 'ENTSCHEIDUNGEN UNTERWEGS', icon: ICONS.loop},
    {on: 'nach Situation', phase: 1, col: 2, row: 1, kind: 'chip', text: 'WERKZEUGE JE SITUATION', icon: ICONS.code},
    {on: 'Selbstzweck', phase: 1, col: 0, row: 2, span: 3, kind: 'big', text: 'Mehr Autonomie ist kein Selbstzweck'},
  ],

  model: [
    {on: 'wichtigste mentale', phase: 0, col: 0, row: 0, span: 3, kind: 'big', text: 'Das wichtigste mentale Modell'},
    {on: 'neuen Namen', phase: 0, col: 0, row: 1, span: 3, kind: 'note', tone: 'off',
      text: 'Kein Chatbot mit einem neuen Namen.'},
    {on: 'Schleife aus Ziel', phase: 0, col: 0, row: 2, span: 3, kind: 'loop',
      steps: ['ZIEL', 'KONTEXT', 'WERKZEUGE', 'AKTION', 'FEEDBACK']},

    {on: 'Stärke', phase: 1, col: 0, row: 0, span: 2, kind: 'card', tone: 'good',
      title: 'STÄRKE', text: 'Mehrere Schritte selbst koordinieren'},
    {on: 'Schwäche', phase: 1, col: 0, row: 1, span: 2, kind: 'card', tone: 'bad',
      title: 'SCHWÄCHE', text: 'Jeder Schritt kann neue Unsicherheit erzeugen'},
    {on: 'derselben Stelle', phase: 1, col: 2, row: 0, kind: 'note', tone: 'off',
      text: 'Beides entsteht an derselben Stelle.'},
    {on: 'starkes Modell', phase: 1, col: 2, row: 1, kind: 'chip', text: 'STARKES MODELL', icon: ICONS.modell},

    {on: 'gute Werkzeuge', phase: 2, col: 0, row: 0, kind: 'chip', text: 'GUTE WERKZEUGE', icon: ICONS.code},
    {on: 'klare Regeln', phase: 2, col: 1, row: 0, kind: 'chip', text: 'KLARE REGELN', icon: ICONS.schild},
    {on: 'begrenzte Rechte', phase: 2, col: 2, row: 0, kind: 'chip', text: 'BEGRENZTE RECHTE', icon: ICONS.stop},
    {on: 'überprüfbare', phase: 2, col: 0, row: 1, span: 3, kind: 'chip', tone: 'good',
      text: 'ÜBERPRÜFBARE ZWISCHENSTÄNDE', icon: ICONS.check},
    {on: 'verstanden hast', phase: 2, col: 0, row: 2, span: 3, kind: 'big',
      text: 'Wer den Loop versteht, versteht die Produkte'},
  ],
};
