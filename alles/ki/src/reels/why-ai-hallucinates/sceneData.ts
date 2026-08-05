export const PROBABILITY_CANDIDATES = [
  {word: 'schneller', value: 46},
  {word: 'hilfreich', value: 28},
  {word: 'günstig', value: 17},
  {word: 'perfekt', value: 9},
] as const;

export const CONTRADICTION_EXAMPLE = {
  answerA: {year: '2022', name: 'Projekt Nova', value: '48 %'},
  answerB: {year: '2021', name: 'Projekt Noma', value: '61 %'},
  contradictionCount: 3,
  fictional: true,
} as const;

export const VAGUE_PHRASES = [
  'Experten gehen davon aus …',
  'Mehrere Studien zeigen …',
  'In vielen Fällen …',
] as const;

export const SOURCE_FAILURES = [
  {domain: 'quelle-a.example', result: '404'},
  {domain: 'quelle-b.example', result: 'DOMAIN NICHT GEFUNDEN'},
  {domain: 'quelle-c.example', result: 'BELEG FEHLT'},
] as const;
