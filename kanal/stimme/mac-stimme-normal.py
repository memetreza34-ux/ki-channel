"""Stimmklon-Test mit der normalen Qwen-Version (qwen-tts 0.1.1) auf dem Mac.

Nutzt Referenz mit Text, wie das Colab-Notebook. Lädt nichts nach (HF_HUB_OFFLINE).
Ohne Textdatei: nur der GPS-Testsatz. Mit Textdatei: jeder Absatz einzeln, dann zusammengefügt.

Pakete und Modell liegen im Abbild /Volumes/T7/stimme-klon/stimme-klon.sparseimage,
weil exFAT mit seinen ._-Dateien Python-Pakete stört. Vorher einbinden:
  hdiutil attach /Volumes/T7/stimme-klon/stimme-klon.sparseimage

Aufruf aus dem Repo:
  PYTHONPATH=/Volumes/StimmeKlon/pakete HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 \
    python3.12 -s kanal/stimme/mac-stimme-normal.py [mps|cpu] [text.txt] [ziel.wav]
"""
import sys
import time
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

STIMME = Path(__file__).resolve().parent
MODELL = Path("/Volumes/StimmeKlon/modell")
REFERENZ = STIMME / "referenz-30s.wav"
REFERENZ_TEXT = (
    "Dein Herz schlägt rund hunderttausend Mal am Tag und du merkst davon fast nichts. "
    "Jeder Schlag schickt Blut durch ein Netz aus Adern, das länger ist, als du dir vorstellen kannst. "
    "Warum hört es nicht einfach auf? Weil es seinen eigenen Taktgeber hat. "
    "Der arbeitet sogar dann weiter, wenn die Verbindung zum Gehirn fehlt. "
    "Einstein nannte das Staunen den Anfang von allem. Und genau das ist es. "
    "Acht Liter Blut pro Minute, siebzig Jahre lang, ohne eine einzige Pause."
)
TESTSATZ = "Dein Handy schickt für GPS kein einziges Signal ins All. Es hört nur zu."
# So wird es gesprochen. Der längere Begriff muss zuerst stehen.
AUSSPRACHE = {
    "GPS-Satelliten": "Ge Pe Es Satelliten",
    "GPS": "Ge Pe Es",
}
SEED = 7
MAX_TOKENS = 600  # 12 Tokens sind 1 Sekunde, also höchstens 50 Sekunden pro Absatz
PAUSE_SEKUNDEN = 0.3

GERAET = sys.argv[1] if len(sys.argv) > 1 else "mps"
TEXTDATEI = Path(sys.argv[2]) if len(sys.argv) > 2 else None
if len(sys.argv) > 3:
    ZIEL = Path(sys.argv[3])
elif TEXTDATEI:
    ZIEL = STIMME / "proben" / f"qwen-normal-{TEXTDATEI.parent.parent.name}.wav"
else:
    ZIEL = STIMME / "proben" / f"qwen-normal-gps-{GERAET}.wav"


def sprechfassung(absatz):
    for geschrieben, gesprochen in AUSSPRACHE.items():
        absatz = absatz.replace(geschrieben, gesprochen)
    return absatz


text = TEXTDATEI.read_text(encoding="utf-8") if TEXTDATEI else TESTSATZ
absaetze = [sprechfassung(a.strip()) for a in text.split("\n\n") if a.strip()]
woerter = sum(len(a.split()) for a in absaetze)
print(f"{len(absaetze)} Absätze, {woerter} Wörter", flush=True)

ZIEL.parent.mkdir(exist_ok=True)
start = time.perf_counter()
modell = Qwen3TTSModel.from_pretrained(str(MODELL), device_map=GERAET, dtype=torch.float32)
stimme = modell.create_voice_clone_prompt(ref_audio=str(REFERENZ), ref_text=REFERENZ_TEXT)
print(f"Modell bereit nach {time.perf_counter() - start:.0f} s", flush=True)

teile = []
rate = None
rechenzeit = 0.0
for nr, absatz in enumerate(absaetze, 1):
    torch.manual_seed(SEED)
    start = time.perf_counter()
    wavs, rate = modell.generate_voice_clone(
        text=absatz,
        language="German",
        voice_clone_prompt=stimme,
        max_new_tokens=MAX_TOKENS,
    )
    dauer = time.perf_counter() - start
    rechenzeit += dauer
    ton = np.asarray(wavs[0], dtype=np.float32)
    roh = len(ton) / rate
    if len(absaetze) > 1:
        ton, _ = librosa.effects.trim(ton, top_db=45)
    teile.append(ton)
    print(f"Absatz {nr}: {roh:.1f} s Audio in {dauer:.0f} s", flush=True)
    if roh >= MAX_TOKENS / 12 * 0.98:
        print(f"  ACHTUNG: Absatz {nr} hat die Obergrenze erreicht und ist vermutlich falsch.")

pause = np.zeros(int(PAUSE_SEKUNDEN * rate), dtype=np.float32)
stuecke = []
for ton in teile:
    if stuecke:
        stuecke.append(pause)
    stuecke.append(ton)
gesamt = np.concatenate(stuecke)
sf.write(ZIEL, gesamt, rate, subtype="PCM_16")
sekunden = len(gesamt) / rate
print(f"Fertig: {sekunden:.1f} s Audio, {woerter / sekunden * 60:.0f} Wörter pro Minute")
print(f"Rechenzeit: {rechenzeit:.0f} s (Faktor {rechenzeit / sekunden:.1f}) auf {GERAET}: {ZIEL}")
