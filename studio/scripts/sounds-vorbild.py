"""Sounds für die zwei Klangwelten der Vorbild-Analyse (2026-11-08), eigene Synthese ohne Lizenzfragen.

Aufruf:  python3 studio/scripts/sounds-vorbild.py
Ergebnis: studio/public/sfx/vorbild/<name>.ogg  +  studio/out/vorbild-sounds-probe.wav (alle nacheinander)

Welt (schraffuren-Art): papier, blaettern, stempel, kritzeln – klein, trocken, hell.
Technik (scroll.engineer-Art): einschlag, vorbei, zahnrad, servo, brummen, zap, scan – tief, kinoreif.
Dazu zwei Kenney-Einschläge (CC0) aus studio/assets-roh: metall, glas.
"""
import importlib.util
import shutil
import subprocess
from pathlib import Path

import numpy as np

HIER = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('kanal', HIER / 'sounds-kanal.py')
k = importlib.util.module_from_spec(spec)
spec.loader.exec_module(k)

SR = k.SR
ROOT = HIER.parents[1]
OUT = ROOT / 'studio' / 'public' / 'sfx' / 'vorbild'
PROBE = ROOT / 'studio' / 'out' / 'vorbild-sounds-probe.wav'
KENNEY = ROOT / 'studio' / 'assets-roh' / 'kenney' / 'impact-sounds' / 'Audio'
rng = np.random.default_rng(11)
t_of, env, tone = k.t_of, k.env, k.tone


def hochpass(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / np.sqrt(1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(spec, len(x))


def bandpass(x, lo, hi):
    return hochpass(k.tiefpass(x, hi), lo)


# ───────────── Welt ─────────────


def papier():
    """Seite reißt: knisterndes, hell gefiltertes Rauschen mit unregelmäßigen Rissen."""
    sec = 0.42
    t = t_of(sec)
    n = rng.standard_normal(len(t))
    risse = (rng.random(len(t)) < 0.012).astype(float)
    risse = np.convolve(risse, np.exp(-np.arange(240) / 40), mode='same')
    x = bandpass(n, 1800, 9000) * (0.25 + risse) * np.clip(t / 0.02, 0, 1) * np.exp(-t / 0.22)
    return k.raum(x, 0.08, 0.25)


def blaettern():
    """Seite blättert: kurzer Luftzug, Band wandert nach oben."""
    x = k.band_noise(0.32, 900, 4200, width=0.7, shape_peak=0.45)
    return k.raum(x, 0.1, 0.3)


def stempel():
    """Stempel: dumpfer Schlag auf Holz plus trockener Klapp."""
    t = t_of(0.35)
    schlag = tone(lambda u: 140 * np.exp(-u * 18) + 70, t) * env(t, 0.001, 0.07)
    klapp = bandpass(rng.standard_normal(len(t)), 600, 3500) * env(t, 0.0005, 0.012) * 0.7
    return k.raum(schlag + klapp, 0.1, 0.3)


def kritzeln():
    """Stift kritzelt: raues Rauschen, im Strich-Rhythmus moduliert."""
    sec = 0.7
    t = t_of(sec)
    strich = 0.5 + 0.5 * np.sin(2 * np.pi * 9 * t + 2 * np.sin(2 * np.pi * 2.3 * t))
    x = bandpass(rng.standard_normal(len(t)), 2500, 8000) * strich**2
    return x * np.clip(t / 0.03, 0, 1) * np.clip((sec - t) / 0.08, 0, 1)


# ───────────── Technik ─────────────


def einschlag():
    """Kino-Einschlag: Sub-Bass fällt von 90 auf 32 Hz, Kopf aus Rauschen, langer Schwanz."""
    t = t_of(1.6)
    sub = tone(lambda u: 32 + 58 * np.exp(-u * 9), t) * env(t, 0.002, 0.5)
    kopf = k.tiefpass(rng.standard_normal(len(t)), 2500) * env(t, 0.001, 0.035) * 0.9
    koerper = k.tiefpass(rng.standard_normal(len(t)), 400) * env(t, 0.002, 0.25) * 0.35
    return k.raum(sub + kopf + koerper, 0.25, 0.9)


def vorbei():
    """Langer Vorbeiflug: Band steigt und fällt, mit tiefem Druck in der Mitte."""
    sec = 1.3
    t = t_of(sec)
    x = k.band_noise(sec, 250, 2600, width=0.6, shape_peak=0.55)
    druck = tone(lambda u: 55 + 25 * np.sin(np.pi * u / sec), t) * np.sin(np.pi * t / sec) ** 3 * 0.5
    return x + druck


def zahnrad():
    """Zahnräder greifen: Folge metallischer Klicks, leicht unregelmäßig, mit Resonanz."""
    sec = 0.9
    out = np.zeros(int(SR * sec))
    zeit = 0.0
    i = 0
    while zeit < sec - 0.05:
        t = t_of(0.05)
        klick = (tone(2300 + 400 * (i % 3), t) * 0.4 + bandpass(rng.standard_normal(len(t)), 1500, 7000)) * env(t, 0.0003, 0.006)
        s = int(zeit * SR)
        out[s : s + len(klick)] += klick[: len(out) - s]
        zeit += 0.055 + rng.random() * 0.01
        i += 1
    return k.raum(out, 0.15, 0.35)


def servo():
    """Servo/Elektromotor: Surren, Tonhöhe fährt hoch und wieder runter."""
    sec = 0.8
    t = t_of(sec)
    u = t / sec
    f = 180 + 260 * np.sin(np.pi * u)
    x = tone(f, t) * 0.5 + tone(f * 2, t) * 0.25 + tone(f * 3.01, t) * 0.12
    x *= np.clip(t / 0.04, 0, 1) * np.clip((sec - t) / 0.08, 0, 1)
    return k.tiefpass(x, 3000) * 0.8


def brummen():
    """Elektrisches Brummen (2 s, als Teppich unter einem Bauteil): 50-Hz-Grundton mit Obertönen."""
    sec = 2.0
    t = t_of(sec)
    x = sum(tone(50 * h, t) * a for h, a in [(1, 0.6), (2, 0.35), (3, 0.2), (5, 0.08)])
    x += k.tiefpass(rng.standard_normal(len(t)), 800) * 0.05
    return x * np.clip(t / 0.3, 0, 1) * np.clip((sec - t) / 0.4, 0, 1)


def zap():
    """Elektrischer Funke/Laser: schneller Abwärts-Chirp mit Knistern."""
    t = t_of(0.35)
    x = tone(lambda u: 300 + 3200 * np.exp(-u * 22), t) * env(t, 0.001, 0.1)
    x += bandpass(rng.standard_normal(len(t)), 3000, 10000) * env(t, 0.001, 0.03) * 0.4
    return k.raum(x, 0.12, 0.3)


def scan():
    """Scanner/Messung: heller Ton mit Tremolo, leise, 0,9 s."""
    sec = 0.9
    t = t_of(sec)
    x = tone(1400, t) * (0.5 + 0.5 * np.sin(2 * np.pi * 16 * t)) * 0.35
    x += tone(2100, t) * 0.08
    return k.raum(x * np.clip(t / 0.05, 0, 1) * np.clip((sec - t) / 0.2, 0, 1), 0.2, 0.4)


KLAENGE = {
    'papier': (papier, -4),
    'blaettern': (blaettern, -6),
    'stempel': (stempel, -3),
    'kritzeln': (kritzeln, -8),
    'einschlag': (einschlag, -1),
    'vorbei': (vorbei, -4),
    'zahnrad': (zahnrad, -6),
    'servo': (servo, -7),
    'brummen': (brummen, -10),
    'zap': (zap, -5),
    'scan': (scan, -10),
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PROBE.parent.mkdir(parents=True, exist_ok=True)
    probe = []
    for name, (fn, peak) in KLAENGE.items():
        x = k.norm(k.trim(fn()), peak)
        st = k.stereo(x)
        wav = OUT / f'{name}.wav'
        k.schreibe_wav(wav, st)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(wav), '-c:a', 'libvorbis', '-q:a', '6', str(OUT / f'{name}.ogg')], check=True)
        wav.unlink()
        probe.append(st)
        probe.append(np.zeros((int(SR * 0.6), 2)))
        print(f'{name}.ogg  {len(x) / SR:.2f} s')
    for ziel, quelle in [('metall', 'impactMetal_heavy_001.ogg'), ('glas', 'impactGlass_medium_000.ogg')]:
        shutil.copy(KENNEY / quelle, OUT / f'{ziel}.ogg')
        print(f'{ziel}.ogg  (Kenney, CC0: {quelle})')
    k.schreibe_wav(PROBE, np.concatenate(probe))
    print(f'Probe: {PROBE}')


if __name__ == '__main__':
    main()
