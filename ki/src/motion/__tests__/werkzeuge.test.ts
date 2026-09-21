import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

/**
 * Haelt die Werkzeug-Tabelle aus ki/gehirn/WERKZEUGE.md ehrlich.
 *
 * Das Repository hatte Skills, die installiert waren und nie benutzt wurden,
 * weil nirgends stand, wann sie dran sind. Ein Eintrag in einer Tabelle
 * verhindert das nur, solange die Tabelle vollstaendig bleibt.
 */

const ROUTING = readFileSync('ki/gehirn/WERKZEUGE.md', 'utf8');

const installedSkills = (): string[] =>
  readdirSync('.claude/skills', {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

const repoSkills = (): string[] =>
  [
    ...readdirSync('ki/skills', {withFileTypes: true}),
  ]
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

const repoAgents = (): string[] =>
  readdirSync('.agents/agents', {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

describe('Werkzeug-Routing', () => {
  it('ordnet jeden installierten Motion-Skill einem Schritt zu', () => {
    const unrouted = installedSkills().filter(
      (skill) => !ROUTING.includes(skill),
    );

    // Ein Skill, den niemand einordnet, wird nie benutzt. Dann lieber
    // deinstallieren als still liegenlassen.
    expect(unrouted).toEqual([]);
  });

  it('ordnet jeden repo-eigenen Skill einem Schritt zu', () => {
    const unrouted = repoSkills().filter((skill) => !ROUTING.includes(skill));
    expect(unrouted).toEqual([]);
  });

  it('nennt jeden Agenten mit seinem Einsatzzeitpunkt', () => {
    const unrouted = repoAgents().filter((agent) => !ROUTING.includes(agent));
    expect(unrouted).toEqual([]);
  });

  it('verweist nur auf Werkzeuge und Dokumente, die es gibt', () => {
    const referencedDocs = [...ROUTING.matchAll(/`([A-Z_]+\.md)`/g)].map(
      (match) => match[1],
    );
    const missing = referencedDocs.filter(
      (doc) => !existsSync(`ki/gehirn/${doc}`),
    );
    expect(missing).toEqual([]);
  });

  it('haengt im Produktionsablauf, nicht nur im Ordner', () => {
    const flow = readFileSync('ki/gehirn/PRODUKTIONSABLAUF.md', 'utf8');
    expect(flow).toContain('WERKZEUGE.md');
  });

  it('nennt den haeufigsten Fehler beim Namen', () => {
    expect(ROUTING).toContain('animation-principles');
    expect(ROUTING.toLowerCase()).toContain('fehler');
  });
});
