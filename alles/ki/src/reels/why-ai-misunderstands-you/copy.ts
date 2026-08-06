import type {MisunderstandsSceneId} from './contract';

export type CaptionChunk = {
  text: string;
  start: number;
  end: number;
  emphasis: readonly string[];
};

export type SceneCopy = {
  kicker: string;
  heading: string;
  voiceover: string;
  captions: readonly CaptionChunk[];
};

export const REEL_COPY: Record<MisunderstandsSceneId, SceneCopy> = {
  'scene-01': {
    kicker: 'MISSVERSTÄNDNIS',
    heading: 'Warum versteht die KI etwas anderes?',
    voiceover: 'Warum versteht deine KI manchmal genau das Gegenteil von dem, was du meinst?',
    captions: [
      {text:'Warum versteht deine KI manchmal genau das Gegenteil',start:0,end:120,emphasis:['Gegenteil']},
      {text:'von dem, was du meinst?',start:120,end:174,emphasis:['meinst']},
    ],
  },
  'scene-02': {
    kicker: 'EINGANG',
    heading: 'Die KI sieht Wörter, nicht Absicht',
    voiceover: 'Meist liegt es nicht an fehlender Intelligenz, sondern an unklaren Signalen in deinem Prompt. Die KI sieht nur deine Wörter, nicht deine Absicht.',
    captions: [
      {text:'Meist liegt es nicht an fehlender Intelligenz,',start:0,end:82,emphasis:[]},
      {text:'sondern an unklaren Signalen in deinem Prompt.',start:82,end:164,emphasis:['unklaren','Signalen']},
      {text:'Die KI sieht nur deine Wörter, nicht deine Absicht.',start:164,end:222,emphasis:['Wörter','Absicht']},
    ],
  },
  'scene-03': {
    kicker: 'ZIEL',
    heading: 'Ohne Ziel muss sie raten',
    voiceover: 'Fehlt ein Ziel, muss sie raten.',
    captions: [
      {text:'Fehlt ein Ziel,',start:0,end:70,emphasis:['Ziel']},
      {text:'muss sie raten.',start:70,end:158,emphasis:['raten']},
    ],
  },
  'scene-04': {
    kicker: 'KONTEXT',
    heading: 'Fehlender Kontext wird ersetzt',
    voiceover: 'Fehlt Kontext, ergänzt sie eigene Annahmen.',
    captions: [
      {text:'Fehlt Kontext,',start:0,end:70,emphasis:['Kontext']},
      {text:'ergänzt sie eigene Annahmen.',start:70,end:158,emphasis:['Annahmen']},
    ],
  },
  'scene-05': {
    kicker: 'KONFLIKT',
    heading: 'Mehrere Aufgaben konkurrieren',
    voiceover: 'Und wenn mehrere Aufgaben in einem Satz stecken, konkurrieren sie miteinander. Deshalb hilft eine einfache Reihenfolge:',
    captions: [
      {text:'Und wenn mehrere Aufgaben in einem Satz stecken,',start:0,end:100,emphasis:['mehrere','Aufgaben']},
      {text:'konkurrieren sie miteinander.',start:100,end:154,emphasis:['konkurrieren']},
      {text:'Deshalb hilft eine einfache Reihenfolge:',start:154,end:202,emphasis:['Reihenfolge']},
    ],
  },
  'scene-06': {
    kicker: 'STRUKTUR',
    heading: 'Baue den Prompt in vier Schritten',
    voiceover: 'Sag zuerst, was entstehen soll. Nenne dann den wichtigsten Kontext. Lege anschließend Format, Ton und Grenzen fest.',
    captions: [
      {text:'Sag zuerst, was entstehen soll.',start:0,end:72,emphasis:['entstehen']},
      {text:'Nenne dann den wichtigsten Kontext.',start:72,end:136,emphasis:['Kontext']},
      {text:'Lege anschließend Format, Ton und Grenzen fest.',start:136,end:214,emphasis:['Format','Grenzen']},
    ],
  },
  'scene-07': {
    kicker: 'BEISPIEL',
    heading: 'Vage gegen konkret',
    voiceover: 'Statt „Mach das besser“ sagst du zum Beispiel: „Schreibe diesen Absatz verständlicher, behalte alle Fakten und nutze höchstens fünf Sätze.“',
    captions: [
      {text:'Statt „Mach das besser“ sagst du zum Beispiel:',start:0,end:88,emphasis:['Mach','besser']},
      {text:'„Schreibe diesen Absatz verständlicher,',start:88,end:142,emphasis:['verständlicher']},
      {text:'behalte alle Fakten und nutze höchstens fünf Sätze.“',start:142,end:214,emphasis:['Fakten','fünf','Sätze']},
    ],
  },
  'scene-08': {
    kicker: 'NACHFRAGE',
    heading: 'Korrigiere nur eine Sache',
    voiceover: 'Prüfe danach die Antwort und korrigiere nur eine Sache pro Nachfrage.',
    captions: [
      {text:'Prüfe danach die Antwort',start:0,end:66,emphasis:['Prüfe']},
      {text:'und korrigiere nur eine Sache pro Nachfrage.',start:66,end:164,emphasis:['eine','Sache']},
    ],
  },
  'scene-09': {
    kicker: 'MERKSATZ',
    heading: 'Klare Anweisung, weniger Interpretation',
    voiceover: 'Je klarer dein Auftrag, desto weniger muss die KI interpretieren. Gute Prompts sind keine Zaubersprüche. Sie sind klare Arbeitsanweisungen.',
    captions: [
      {text:'Je klarer dein Auftrag,',start:0,end:58,emphasis:['klarer','Auftrag']},
      {text:'desto weniger muss die KI interpretieren.',start:58,end:116,emphasis:['weniger']},
      {text:'Gute Prompts sind keine Zaubersprüche.',start:116,end:166,emphasis:['keine','Zaubersprüche']},
      {text:'Sie sind klare Arbeitsanweisungen.',start:166,end:204,emphasis:['Arbeitsanweisungen']},
    ],
  },
};
