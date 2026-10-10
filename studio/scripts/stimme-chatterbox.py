"""Zeilen aus zeilen.json mit Chatterbox Multilingual (MIT-Lizenz) sprechen lassen – über die
öffentliche Hugging-Face-Demo. Ohne Anmeldung ist das Kontingent klein; mit eigenem Konto
(Umgebungsvariable HF_TOKEN, von Arman selbst gesetzt) gibt es mehr.

Aufruf:  tts/bin/python studio/scripts/stimme-chatterbox.py <slug> [lebendigkeit 0–1] [nur_zeilen z. B. 3,5]
Schreibt: studio/public/projekte/<slug>/stimme/<n>.wav   → danach stimme-zeilen.py
"""
import json
import shutil
import sys
from pathlib import Path

from gradio_client import Client, handle_file

ROOT = Path(__file__).resolve().parents[2]
slug = sys.argv[1]
lebendig = float(sys.argv[2]) if len(sys.argv) > 2 else 0.7
nur = {int(x) for x in sys.argv[3].split(',')} if len(sys.argv) > 3 else None
zeilen = json.loads((ROOT / 'studio' / 'projekte' / slug / 'zeilen.json').read_text())
ziel = ROOT / 'studio' / 'public' / 'projekte' / slug / 'stimme'
ziel.mkdir(parents=True, exist_ok=True)

# Aussprache-Hilfen nur für die Stimme
HILFEN = {'KI': 'Ka-I'}

c = Client('ResembleAI/Chatterbox-Multilingual-TTS')
ref, _ = c.predict(lang='de', current_ref=None, current_text='Hallo', api_name='/on_language_change')
for i, z in enumerate(zeilen, 1):
    if nur and i not in nur:
        continue
    text = z['text']
    for a, b in HILFEN.items():
        text = text.replace(a, b)
    out = c.predict(text_input=text, language_id='de', audio_prompt_path_input=handle_file(ref), exaggeration_input=lebendig, temperature_input=0.8, seed_num_input=7, cfgw_input=0.3, api_name='/generate_tts_audio')
    for alt in ziel.glob(f'{i}.*'):
        alt.unlink()
    shutil.copy(out, ziel / f'{i}.wav')
    print(f'{i}: {z["text"]}')
