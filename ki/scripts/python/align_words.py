#!/usr/bin/env python3
import argparse
import json
import platform
from pathlib import Path


def _item(text, start, end, score=None):
    value = {
        "text": str(text),
        "start": float(start),
        "end": float(end),
    }
    if score is not None:
        try:
            value["score"] = float(score)
        except (TypeError, ValueError):
            pass
    return value


def align_mlx_qwen3(audio_path: str, text: str):
    from mlx_audio.stt import load

    model_id = "mlx-community/Qwen3-ForcedAligner-0.6B-8bit"
    model = load(model_id)
    result = model.generate(audio=audio_path, text=text, language="German")
    raw_items = getattr(result, "items", result)
    words = []
    for entry in raw_items:
        words.append(
            _item(
                getattr(entry, "text", ""),
                getattr(entry, "start_time", 0.0),
                getattr(entry, "end_time", 0.0),
            )
        )
    return {
        "backend": "mlx-qwen3",
        "model": model_id,
        "modelLicense": "Apache-2.0",
        "runtime": "MLX / Apple Silicon",
        "words": words,
    }


def align_ctc_german(audio_path: str, text: str):
    import torch
    from ctc_forced_aligner import (
        generate_emissions,
        get_alignments,
        get_spans,
        load_alignment_model,
        load_audio,
        postprocess_results,
        preprocess_text,
    )

    # IMPORTANT: Do not use the package's default MMS model here. The default
    # weights are CC-BY-NC. This German model is Apache-2.0 and can therefore be
    # used for a monetized/commercial content workflow subject to that license.
    model_id = "facebook/wav2vec2-large-xlsr-53-german"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32
    alignment_model, alignment_tokenizer = load_alignment_model(
        device,
        model_path=model_id,
        dtype=dtype,
    )
    audio_waveform = load_audio(audio_path, alignment_model.dtype, alignment_model.device)
    emissions, stride = generate_emissions(alignment_model, audio_waveform, batch_size=4)
    tokens_starred, text_starred = preprocess_text(text, romanize=False, language="deu")
    segments, scores, blank_token = get_alignments(
        emissions,
        tokens_starred,
        alignment_tokenizer,
    )
    spans = get_spans(tokens_starred, segments, blank_token)
    raw_words = postprocess_results(text_starred, spans, stride, scores)
    words = []
    for entry in raw_words:
        if isinstance(entry, dict):
            words.append(_item(entry.get("text", ""), entry.get("start", 0.0), entry.get("end", 0.0), entry.get("score")))
        else:
            words.append(_item(getattr(entry, "text", ""), getattr(entry, "start", 0.0), getattr(entry, "end", 0.0), getattr(entry, "score", None)))
    return {
        "backend": "ctc-german",
        "model": model_id,
        "modelLicense": "Apache-2.0",
        "runtime": f"PyTorch / {device}",
        "words": words,
    }


def main():
    parser = argparse.ArgumentParser(description="Local word-level forced alignment for KI reels")
    parser.add_argument("--audio", required=True)
    parser.add_argument("--text-file", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--backend", choices=["mlx-qwen3", "ctc-german"], required=True)
    args = parser.parse_args()

    audio = Path(args.audio).resolve()
    text_file = Path(args.text_file).resolve()
    output = Path(args.output).resolve()
    if not audio.exists():
        raise SystemExit(f"audio missing: {audio}")
    if not text_file.exists():
        raise SystemExit(f"text file missing: {text_file}")
    text = text_file.read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit("text file is empty")

    if args.backend == "mlx-qwen3":
        result = align_mlx_qwen3(str(audio), text)
    else:
        result = align_ctc_german(str(audio), text)

    words = result.get("words", [])
    if not words:
        raise SystemExit("forced aligner returned no words")
    previous_end = -1.0
    for index, word in enumerate(words):
        start = float(word["start"])
        end = float(word["end"])
        if start < 0:
            raise SystemExit(f"invalid word timing at index {index}: {start}-{end}")
        if end <= start:
            end = start + 0.01
            word["end"] = end
        if start + 0.050 < previous_end:
            raise SystemExit(f"word timing goes backwards at index {index}")
        previous_end = max(previous_end, end)

    payload = {
        "version": 1,
        "alignmentType": "FORCED_ALIGNMENT_KNOWN_TRANSCRIPT",
        "backend": result["backend"],
        "model": result["model"],
        "modelLicense": result["modelLicense"],
        "runtime": result["runtime"],
        "platform": {
            "system": platform.system(),
            "machine": platform.machine(),
            "python": platform.python_version(),
        },
        "audio": str(audio),
        "textFile": str(text_file),
        "words": words,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"LOCAL FORCED ALIGNMENT READY: {output}")
    print(f"backend: {payload['backend']}")
    print(f"model: {payload['model']} ({payload['modelLicense']})")
    print(f"words: {len(words)}")


if __name__ == "__main__":
    main()
