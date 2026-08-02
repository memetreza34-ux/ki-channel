import {buildMotionTimeline} from './timeline';

export const MOTION_TIMELINE_EXAMPLE = buildMotionTimeline({
  fps: 30,
  gapFrames: 8,
  scenes: [
    {
      sentence: 'Die KI erhält eine komplexe Aufgabe.',
      elementLabels: {
        input: 'Komplexe Aufgabe',
        output: 'Arbeitsplan',
      },
      labels: ['Aufgabe', 'KI', 'Arbeitsplan'],
    },
    {
      sentence: 'Der KI-Agent nutzt Browser und Dateien für die Recherche.',
      elementLabels: {
        task: 'Recherche',
        browser: 'Browser',
        files: 'Dokumente',
        result: 'Quellenbasis',
      },
      labels: ['Recherche', 'KI-Agent', 'Werkzeuge', 'Quellenbasis'],
    },
    {
      sentence: 'Die Daten fließen durch die KI zu einem klaren Ergebnis.',
      elementLabels: {
        input: 'Quellenbasis',
        output: 'Analyse',
      },
      labels: ['Quellenbasis', 'KI', 'Analyse'],
    },
    {
      sentence: 'Im Vergleich ist die geprüfte Antwort besser als der erste Entwurf.',
      elementLabels: {
        left: 'Erster Entwurf',
        right: 'Geprüfte Antwort',
        metric: 'Qualität',
      },
      labels: ['Entwurf', 'Prüfung', 'Ergebnis'],
    },
  ],
});
