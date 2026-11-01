"""Klangteppich für Technik-Videos (Machart scroll.engineer): dunkel, dicht, basslastig – per Synthese (keine Lizenzfragen).

Aufruf:  python3 studio/scripts/musik-technik.py [ziel.wav] [sekunden]
Standard: studio/public/musik/technik.wav, 40 s, nahtlos loopbar.
Tiefer Drone (Grundton + Quinte), langsam atmender Filter-Rauschteppich, weicher Puls alle 2 Takte.
Gemessen bei den Vorbildern: Bassband ≈ −42 dB, kaum Stille, Dynamik ≈ 1,8 → hier bewusst gleichmäßig.
Im Video: <Music src="musik/technik.wav" volume={0.25} captions={…} duckTo={0.45} />. Läuft ohne ffmpeg.
"""
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter

SR = 48000
rng = np.random.default_rng(11)


def tiefpass(x, cutoff):
    b, a = butter(2, cutoff / (SR / 2))
    return lfilter(b, a, x)


def bandpass(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype='band')
    return lfilter(b, a, x)


def baue(sek: float) -> np.ndarray:
    t = np.arange(int(SR * sek)) / SR
    # Perioden so wählen, dass alles nach `sek` wieder am Anfang steht (Loop)
    atem = 0.5 - 0.5 * np.cos(2 * np.pi * t * (4 / sek))
    grund = 41.2  # E1
    drone = (
        0.55 * np.sin(2 * np.pi * grund * t)
        + 0.30 * np.sin(2 * np.pi * grund * 1.5 * t + 0.4)
        + 0.18 * np.sin(2 * np.pi * grund * 2 * t + 1.1)
        + 0.08 * np.sin(2 * np.pi * grund * 3 * t)
    )
    drone *= 0.75 + 0.25 * atem
    rauschen = rng.standard_normal(len(t))
    teppich = bandpass(rauschen, 180, 900) * (0.10 + 0.08 * atem)
    luft = bandpass(rauschen, 2500, 7000) * 0.015
    # weicher Puls (Kick ohne Klick) alle 2,5 s
    puls = np.zeros_like(t)
    schlag = int(SR * 2.5)
    lang = int(SR * 0.6)
    tt = np.arange(lang) / SR
    huelle = np.exp(-tt * 7)
    kick = np.sin(2 * np.pi * (55 * np.exp(-tt * 3)) * tt) * huelle
    for start in range(0, len(t), schlag):
        ende = min(len(t), start + lang)
        puls[start:ende] += kick[: ende - start] * 0.5
    mix = drone + teppich + luft + puls
    mix = tiefpass(mix, 4000)
    # sanfte Kompression: gleichmäßig wie bei den Vorbildern
    mix = np.tanh(mix * 1.4)
    # Loop-Naht weich machen
    blende = int(SR * 0.5)
    rampe = np.linspace(0, 1, blende)
    mix[:blende] = mix[:blende] * rampe + mix[-blende:] * (1 - rampe)
    mix = mix / np.max(np.abs(mix)) * 0.8
    return mix


def main():
    ziel = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'public' / 'musik' / 'technik.wav'
    sek = float(sys.argv[2]) if len(sys.argv) > 2 else 40.0
    ziel.parent.mkdir(parents=True, exist_ok=True)
    daten = baue(sek)
    stereo = np.stack([daten, np.roll(daten, int(SR * 0.012))], axis=1)
    with wave.open(str(ziel), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    print(f'Geschrieben: {ziel} ({sek:.0f} s)')


if __name__ == '__main__':
    main()
