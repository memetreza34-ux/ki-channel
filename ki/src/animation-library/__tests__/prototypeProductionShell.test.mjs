import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

const source = readFileSync(
  resolve('ki/src/animation-library/prototypes/PrototypeShell.tsx'),
  'utf8',
);

describe('prototype production shell', () => {
  it('keeps library branding only in demo mode', () => {
    expect(source).toContain('!content ? (');
    expect(source).toContain('ANIMATION LIBRARY · {displayFamily}');
    expect(source).not.toContain('CONTENT MATCHED');
  });

  it('never falls back from content mode to a prototype title', () => {
    expect(source).toContain('content.title?.trim() || contentTitleFromMeaning(content)');
    expect(source).toContain("'VISUELLE ERKLÄRUNG'");
    expect(source).not.toContain('const displayTitle = content?.title ?? title');
  });

  it('does not expose internal meaning-contract state prose as a content debug rail', () => {
    expect(source).not.toContain('STARTZUSTAND');
    expect(source).not.toContain('SICHTBARE VERÄNDERUNG');
    expect(source).not.toContain('semanticPhase.state');
  });

  it('keeps the exact speaker text as the production subtitle', () => {
    expect(source).toContain('const displaySubtitle = content?.spokenText || subtitle');
  });
});
