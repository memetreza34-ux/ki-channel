# Denkwürfel auf Windows einrichten

Getestet wurde der frische Klon nur auf dem Mac. Unter Windows lief es noch nicht: Falls ein Schritt hakt, Claude die Fehlermeldung zeigen.

## 1. Programme installieren (einmalig)

PowerShell öffnen, danach einmal schließen und neu öffnen:

```powershell
winget install Git.Git OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg
```

## 2. Projekt holen

Wichtig ist `-b claude/studio`, denn `main` enthält das Studio nicht.

```powershell
git clone -b claude/studio https://github.com/memetreza34-ux/ki-channel.git
cd ki-channel
npm ci
```

## 3. Musik erzeugen

Unter Windows heißt der Befehl `python`, auch wenn in der Doku `python3` steht.

```powershell
pip install numpy scipy
python studio/scripts/musik-wissen.py
python studio/scripts/musik-technik.py
```

## 4. Pixabay-Key (nur für `npm run broll`)

`.env.example` als `.env` kopieren und den Key eintragen. Der Key steht in der `.env` auf dem Mac oder lässt sich bei Pixabay neu anlegen. Er kommt nie auf GitHub.

## 5. Testen

```powershell
npm run studio:check
npm run wissen -- GPS-Rohschnitt --bilder=300
npm run studio
```

Das erste `npm run untertitel` lädt whisper.cpp und das Sprachmodell (rund 1,5 GB) automatisch.

## Nicht auf GitHub

Bei Bedarf per USB-Stick oder Cloud vom Mac holen:

- `.env` (Pixabay-Key)
- fertige Videos und Aufnahmen in `kanal/` (`*.mp4`, `*.m4a`, `*.wav`), rund 56 MB
- `studio/out/` (Renders, lassen sich neu erzeugen)

## Weiter geht es mit

GPS-Video: `kanal/shorts/2026-11-02_bis_2026-11-08/gps-handy/audio/script.txt` einsprechen, die Aufnahme in denselben Ordner legen und Claude schreiben: „Audio für GPS ist drin, mach Phase 3“.
