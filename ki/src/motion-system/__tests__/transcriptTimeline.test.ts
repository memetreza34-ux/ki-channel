import {describe, expect, it} from 'vitest';
import {
  buildMotionTimelineFromTranscript,
  mapMotionTranscriptToScenes,
} from '../transcriptTimeline';

const transcriptWords = [
  {text: 'Die', startMs: 0, endMs: 120},
  {text: 'KI', startMs: 200, endMs: 360},
  {text: 'nutzt', startMs: 430, endMs: 620},
  {text: 'Dateien', startMs: 1000, endMs: 1250},
  {text: 'Danach', startMs: 2000, endMs: 2220},
  {text: 'entsteht', startMs: 2300, endMs: 2520},
  {text: 'das', startMs: 2600, endMs: 2700},
  {text: 'Ergebnis', startMs: 3000, endMs: 3300},
];

const script = 'Die KI nutzt Dateien. Danach entsteht das Ergebnis.';

describe('Globale Transkript-Zuordnung', () => {
  it('ordnet globale Wortzeiten den richtigen Szenen zu', () => {
    const scenes = mapMotionTranscriptToScenes({script, words: transcriptWords});

    expect(scenes).toHaveLength(2);
    expect(scenes[0].sentence).toBe('Die KI nutzt Dateien.');
    expect(scenes[0].sourceStartMs).toBe(0);
    expect(scenes[0].sourceEndMs).toBe(1250);
    expect(scenes[0].words.find((word) => word.text === 'Dateien')?.startMs).toBe(1000);

    expect(scenes[1].sentence).toBe('Danach entsteht das Ergebnis.');
    expect(scenes[1].sourceStartMs).toBe(2000);
    expect(scenes[1].sourceEndMs).toBe(3300);
    expect(scenes[1].words[0].startMs).toBe(0);
    expect(scenes[1].words.find((word) => word.text === 'Ergebnis')?.startMs).toBe(1000);
  });

  it('sortiert unsortierte Wortzeiten ohne die Eingabe zu verändern', () => {
    const unsorted = [...transcriptWords].reverse();
    const snapshot = structuredClone(unsorted);
    const scenes = mapMotionTranscriptToScenes({script, words: unsorted});

    expect(scenes).toHaveLength(2);
    expect(unsorted).toEqual(snapshot);
    expect(scenes[0].sourceStartMs).toBe(0);
    expect(scenes[1].sourceStartMs).toBe(2000);
  });

  it('übernimmt begrenzte Füllwörter innerhalb einer Szene', () => {
    const wordsWithFiller = [
      transcriptWords[0],
      transcriptWords[1],
      {text: 'also', startMs: 370, endMs: 420},
      ...transcriptWords.slice(2),
    ];
    const scenes = mapMotionTranscriptToScenes({
      script,
      words: wordsWithFiller,
      maxSkippedTokensPerMatch: 2,
    });

    expect(scenes[0].words.some((word) => word.text === 'also')).toBe(true);
  });

  it('kann für exakte Transkripte das Überspringen vollständig deaktivieren', () => {
    expect(
      mapMotionTranscriptToScenes({
        script,
        words: transcriptWords,
        maxSkippedTokensPerMatch: 0,
      }),
    ).toHaveLength(2);

    const wordsWithFiller = [
      transcriptWords[0],
      transcriptWords[1],
      {text: 'also', startMs: 370, endMs: 420},
      ...transcriptWords.slice(2),
    ];
    expect(() =>
      mapMotionTranscriptToScenes({
        script,
        words: wordsWithFiller,
        maxSkippedTokensPerMatch: 0,
      }),
    ).toThrow('nicht eindeutig zuordnen');
  });

  it('lehnt leere, ungültige oder nicht passende Transkripte ab', () => {
    expect(() => mapMotionTranscriptToScenes({script, words: []})).toThrow(
      'Wort-Timestamps benötigt',
    );
    expect(() =>
      mapMotionTranscriptToScenes({
        script,
        words: [{text: 'Die', startMs: -1, endMs: 10}],
      }),
    ).toThrow('ungültige Zeitwerte');
    expect(() =>
      mapMotionTranscriptToScenes({
        script,
        words: [{text: 'Völlig', startMs: 0, endMs: 100}],
      }),
    ).toThrow('nicht eindeutig zuordnen');
  });
});

describe('Transkript-zu-Motion-Timeline', () => {
  it('baut Storyboards mit lokalen Wortzeiten und sichtbarer Beat-Verschiebung', () => {
    const {timeline, transcriptScenes} = buildMotionTimelineFromTranscript({
      script,
      words: transcriptWords,
      fps: 60,
      gapFrames: 12,
    });

    expect(timeline.scenes).toHaveLength(2);
    expect(timeline.fps).toBe(60);
    expect(transcriptScenes).toHaveLength(2);
    expect(
      timeline.scenes[0].storyboard.beats.find(
        (beat) => beat.targetId === 'files' && beat.action === 'show',
      )?.atFrame,
    ).toBe(60);
    expect(
      timeline.scenes[1].storyboard.beats.find(
        (beat) => beat.targetId === 'step-4' && beat.action === 'show',
      )?.atFrame,
    ).toBe(60);
    expect(timeline.scenes[1].startFrame).toBe(
      timeline.scenes[0].endFrameExclusive + 12,
    );
  });

  it('übernimmt sichere Szenen-Standardwerte und Overrides', () => {
    const {timeline} = buildMotionTimelineFromTranscript({
      script,
      words: transcriptWords,
      sceneDefaults: {labels: ['Inhalt', 'KI', 'Ergebnis']},
      sceneOverrides: [
        {elementLabels: {files: 'Dokumente'}},
        {elementLabels: {'step-4': 'Resultat'}},
      ],
    });

    expect(
      timeline.scenes[0].storyboard.elements.find((element) => element.id === 'files')?.label,
    ).toBe('Dokumente');
    expect(
      timeline.scenes[1].storyboard.elements.find((element) => element.id === 'step-4')?.label,
    ).toBe('Resultat');
  });

  it('bleibt für identische Eingaben deterministisch', () => {
    const input = {script, words: transcriptWords, fps: 30, gapFrames: 5};
    expect(buildMotionTimelineFromTranscript(input)).toEqual(
      buildMotionTimelineFromTranscript(input),
    );
  });
});
