#!/usr/bin/env bash
# Richtet die C-Version von Qwen3-TTS auf einem Mac mit Apple-Chip ein
# und erzeugt den GPS-Testsatz in Armans Stimme. Kein Python, kein ffmpeg nötig.
#
# Aufruf aus dem Repo:  bash kanal/stimme/mac-stimme.sh
# Vorher nötig:         kanal/stimme/referenz-30s.wav (liegt nicht in Git, Datei rüberkopieren)
#
# Downloads beim ersten Lauf:
#   qwen_tts-macos-arm64  rund 1,2 MB, MIT, geprüft mit SHA256SUMS
#   Qwen3-TTS 0.6B-Base   rund 2,4 GB, Apache-2.0
set -euo pipefail

VERSION="v0.23.0"
REPO="gabriele-mastrapasqua/qwen3-tts"
ORDNER="$HOME/stimme-klon/qwen3-tts"
MODELL="qwen3-tts-0.6b-base"
SATZ="Dein Handy schickt für Ge Pe Es kein einziges Signal ins All. Es hört nur zu."

STIMME="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REFERENZ="$STIMME/referenz-30s.wav"
ZIEL="$STIMME/proben/qwen-c-gps-1.wav"

if [[ "$(uname -s)-$(uname -m)" != "Darwin-arm64" ]]; then
  echo "Dieses Skript ist nur für Macs mit Apple-Chip." >&2
  exit 1
fi
if [[ ! -f "$REFERENZ" ]]; then
  echo "Es fehlt: $REFERENZ" >&2
  echo "Kopiere referenz-30s.wav vom Windows-Laptop in diesen Ordner." >&2
  exit 1
fi

mkdir -p "$ORDNER" "$STIMME/proben"
cd "$ORDNER"

if [[ ! -x qwen_tts ]]; then
  BASIS="https://github.com/$REPO/releases/download/$VERSION"
  curl -fL -o qwen_tts-macos-arm64 "$BASIS/qwen_tts-macos-arm64"
  curl -fL -o SHA256SUMS "$BASIS/SHA256SUMS"
  grep 'qwen_tts-macos-arm64$' SHA256SUMS | shasum -a 256 -c -
  chmod +x qwen_tts-macos-arm64
  mv qwen_tts-macos-arm64 qwen_tts
fi

if [[ ! -f "$MODELL/speech_tokenizer/model.safetensors" ]]; then
  curl -fL -o download_model.sh "https://raw.githubusercontent.com/$REPO/$VERSION/download_model.sh"
  bash download_model.sh --model base-small
fi

SECONDS=0
./qwen_tts -d "$MODELL" --ref-audio "$REFERENZ" -l German --int8 --seed 7 --text "$SATZ" -o "$ZIEL"
echo "Fertig in $SECONDS s: $ZIEL"
