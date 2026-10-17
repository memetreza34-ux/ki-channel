#!/usr/bin/env node
// Links for Phase 1 chat handoff. Local checks do NOT prove remote GitHub availability.
import {readFile} from 'node:fs/promises';
import {relative, resolve} from 'node:path';

const REPO_URL = 'https://github.com/memetreza34-ux/ki-channel';

const reportError = (message) => {
  console.error('PHASE-1-HANDOFF BLOCKIERT: ' + message);
  process.exitCode = 1;
};

const [folder, ...options] = process.argv.slice(2);
const refs = options.filter((item) => item.startsWith('--ref='));

if (!folder || refs.length !== 1 || options.length !== 1) {
  reportError('Aufruf: node scripts/phase1-chat-links.mjs <Videopfad> --ref=<gepushter-Branch-oder-Commit>');
} else {
  const ref = refs[0].slice('--ref='.length);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(ref) || ref.includes('..') || ref.endsWith('/')) {
    reportError('Ungültiger GitHub-Ref.');
  } else {
    const path = relative(process.cwd(), resolve(folder)).replaceAll('\\', '/');
    const bits = path.split('/');
    const isReel = bits.length === 4 && bits[0] === 'ki' && bits[1] === 'reels'
      && /^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(bits[2])
      && /^\d{2}_.+$/.test(bits[3]);
    const isLongform = bits.length === 4 && bits[0] === 'ki' && bits[1] === 'youtube-longform'
      && /^\d{4}-\d{2}-\d{2}$/.test(bits[2])
      && /^\d{2}_.+$/.test(bits[3]);

    if (!isReel && !isLongform) {
      reportError('Erwartet einen Videoordner unter ki/reels/ oder ki/youtube-longform/.');
    } else {
      const imagePath = path + '/' + (isReel ? '02-bilder' : '02-visuals') + '/image-prompts.md';
      const scriptPath = path + '/01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt';
      const statusPath = path + '/06-projektdateien/PHASE-STATUS.md';
      try {
        const [phaseStatus, imagePrompts, scriptText] = await Promise.all([
          readFile(statusPath, 'utf8'),
          readFile(imagePath, 'utf8'),
          readFile(scriptPath, 'utf8'),
        ]);
        const start = phaseStatus.search(/^## Phase 1(?:[^\n]*)$/m);
        const end = start === -1 ? -1 : phaseStatus.indexOf('\n## ', start + 4);
        const phase = start === -1 ? '' : phaseStatus.slice(start, end === -1 ? undefined : end);
        const isFinished = /\*\*Status:\*\*\s*(?:FERTIG|ABGESCHLOSSEN|(?:CODE- UND PLANUNGSGRUNDLAGE )?VOLLSTÄNDIG)/i.test(phase);
        if (!isFinished) throw new Error('Phase 1 ist nicht ausdrücklich als fertig dokumentiert.');
        if (scriptText.trim().length < 40 || /^\s*(OFFEN|TBD|TODO)\s*$/im.test(scriptText)) {
          throw new Error('Finaler Sprechertext fehlt oder enthält einen Platzhalter.');
        }
        if (imagePrompts.trim().length < 40 || /\*\*Status:\*\*\s*(?:OFFEN|TODO|TBD)/i.test(imagePrompts)) {
          throw new Error('Bildprompts/Bildkonzept fehlen oder sind noch offen.');
        }
        const encodePath = (value) => value.split('/').map(encodeURIComponent).join('/');
        const link = (file) => REPO_URL + '/blob/' + encodePath(ref) + '/' + encodePath(file);
        const imageNote = /NICHT BENÖTIGT|NICHT BENOETIGT|KEINE EXTERNEN/i.test(imagePrompts)
          ? 'Keine externen Bilder erforderlich; Link zeigt das Bildkonzept.'
          : 'Vollständige externe Bildprompts im verlinkten Dokument.';
        const title = bits[3].replace(/^\d{2}_/, '').replaceAll('-', ' ');
        console.log('**Phase 1 abgeschlossen – ' + title + '**');
        console.log('');
        console.log('- **Bildprompt-Link:** [Bildprompts / Bildkonzept öffnen](' + link(imagePath) + ')');
        console.log('- **Skript-Link:** [Sprechertext öffnen](' + link(scriptPath) + ')');
        console.log('');
        console.log('**Bilder:** ' + imageNote);
        console.log('**Nächster Schritt:** Phase 2 – Voiceover, nötigenfalls reale Pflichtmedien.');
        console.log('');
        console.log('WICHTIG: Beide Links auf GitHub im Ref "' + ref + '" prüfen, bevor sie im Chat versendet werden.');
      } catch (error) {
        reportError(error instanceof Error ? error.message : String(error));
      }
    }
  }
}
