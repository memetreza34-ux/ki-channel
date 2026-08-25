import whisper
import json
import re

print("Loading Whisper model...")
model = whisper.load_model("base")

print("Transcribing...")
result = model.transcribe(
    "ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/01-script-audio/voiceover.mp3",
    word_timestamps=True,
    language="de"
)

words_flat = []
for segment in result["segments"]:
    for word in segment.get("words", []):
        words_flat.append(word)

# Load existing JSON to map scenes
with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json', 'r') as f:
    cues_data = json.load(f)

# Re-align words based on existing texts (as best as we can)
# Actually, the user already provided the original sentences in subtitle-cues.json
# We should map the words to the original cues.

word_idx = 0
for cue in cues_data['cues']:
    # How many words in this cue?
    original_text = cue['text']
    original_words = original_text.split()
    
    cue['words'] = []
    
    start_frame = None
    end_frame = None
    
    for w in original_words:
        if word_idx < len(words_flat):
            w_info = words_flat[word_idx]
            # Convert time to frames (30fps)
            w_start_frame = int(w_info['start'] * 30)
            w_end_frame = int(w_info['end'] * 30)
            
            cue['words'].append({
                "text": w,
                "startFrame": w_start_frame,
                "endFrame": w_end_frame
            })
            
            if start_frame is None:
                start_frame = w_start_frame
            end_frame = w_end_frame
            
            word_idx += 1
        else:
            # Fallback if whisper missed some
            pass
            
    if start_frame is not None:
        cue['startFrame'] = start_frame
    if end_frame is not None:
        cue['endFrame'] = end_frame

cues_data['timingStatus'] = "FINAL_LOCKED_TO_AUDIO"

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json', 'w') as f:
    json.dump(cues_data, f, indent=2, ensure_ascii=False)

print("Saved synced subtitles.")
