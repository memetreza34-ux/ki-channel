"""Schneidet die Short-Stellen aus den fertigen Videos und schreibt clips.json (Wortzeiten relativ zum Clip).

  python3 -I studio/projekte/shorts/schneiden.py   (aus dem Repo-Ordner)
"""
import json, re, subprocess, sys
from pathlib import Path

HIER = Path(__file__).resolve().parent
STUDIO = HIER.parent.parent
REPO = STUDIO.parent
HAUPT = Path('/Users/arman/Ki-Chanell')

QUELLEN = {
    'strom': (STUDIO / 'out/KiStrom.mp4', STUDIO / 'projekte/ki-strom/woerter.json'),
    'luegt': (HAUPT / 'kanal/youtube/2026-10-05_bis_2026-10-11/warum-ki-luegt/export/video.mp4', STUDIO / 'projekte/warum-ki-luegt/untertitel.json'),
    'gpt6': (HAUPT / '.claude/worktrees/chatgpt-6-gemini-comparison-39a313/studio/out/Gpt6IntelligentUi.mp4',
             HAUPT / '.claude/worktrees/chatgpt-6-gemini-comparison-39a313/studio/projekte/gpt6-intelligent-ui/woerter.json'),
}

# Titel: *…* = Akzentwort
CLIPS = [
    ('strom-teewasser', 'strom', 61.6, 83.5, 'Eine KI-Frage: 0,3 Wh. Ist das *viel*?'),
    ('strom-video', 'strom', 116.6, 143.2, '5 Sekunden KI-Video = *3000 Fragen*'),
    ('strom-atom', 'strom', 211.4, 246.1, 'Warum Microsoft ein *Atomkraftwerk* zurückholt'),
    ('luegt-anwalt', 'luegt', 0.0, 26.9, 'Anwalt vertraut ChatGPT: *5000 $ Strafe*'),
    ('luegt-raten', 'luegt', 108.2, 143.9, 'Warum KI lieber *rät*'),
    ('luegt-eiffel', 'luegt', 163.9, 189.1, 'Welcher Satz ist *erfunden*?'),
    ('luegt-sicher', 'luegt', 275.1, 293.4, 'Frag nie nur: *„Bist du sicher?“*'),
    ('gpt6-werkzeug', 'gpt6', 0.2, 32.6, 'ChatGPT antwortet jetzt mit *Werkzeugen*'),
]

# whisper hört „ChatGPT“ falsch
ERSETZEN = {'chat.gpt': 'ChatGPT', 'chetchipity': 'ChatGPT', 'Chetchipity': 'ChatGPT'}
PAARE = {('Chad', 'GPT'), ('Chatchi', 'PT')}


def woerter(pfad):
    d = json.loads(Path(pfad).read_text())
    if isinstance(d[0], dict):
        w = [[x['startMs'] / 1000, x['endMs'] / 1000, x['text'].strip()] for x in d]
    else:
        w = [list(x) for x in d]
    raus = []
    for s, e, t in w:
        if raus and (raus[-1][2], re.sub(r'\W+$', '', t)) in PAARE:
            raus[-1][1] = e
            raus[-1][2] = 'ChatGPT' + re.sub(r'^\w+', '', t)
            continue
        kern = re.sub(r'[.,?!]+$', '', t)
        if kern in ERSETZEN:
            t = ERSETZEN[kern] + t[len(kern):]
        raus.append([s, e, t])
    return raus


ausgabe = []
for cid, q, von, bis, titel in CLIPS:
    video, wpfad = QUELLEN[q]
    start, ende = max(0, von - 0.15), bis + 0.6
    ziel = STUDIO / 'public/shorts' / f'{cid}.mp4'
    if not ziel.exists() or '--neu' in sys.argv:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{start:.2f}', '-to', f'{ende:.2f}', '-i', str(video),
                        '-vf', 'scale=1080:-2', '-c:v', 'libx264', '-crf', '21', '-preset', 'veryfast',
                        '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(ziel)], check=True)
    ws = [[round(s - start, 2), round(e - start, 2), t] for s, e, t in woerter(wpfad) if s >= von - 0.05 and s < bis]
    ausgabe.append({'id': cid, 'quelle': q, 'dauer': round(ende - start, 2), 'titel': titel, 'woerter': ws})
    print(cid, round(ende - start, 1), 's', ' '.join(w[2] for w in ws)[:90])

(HIER / 'clips.json').write_text(json.dumps(ausgabe, ensure_ascii=False, indent=1))
