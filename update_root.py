import re
with open('ki/src/Root.tsx', 'r') as f:
    content = f.read()

import_statement = "import voiceoverStudyMode from '../reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/01-script-audio/voiceover.mp3';\n"
if "voiceoverStudyMode from" not in content:
    content = import_statement + content

# Replace the specific composition defaultProps
pattern = r'(id=\{STUDY_MODE_COMPOSITION_ID\}\s*component=\{ReelChatGPTStudyMode\}\s*defaultProps=\{\{)(showCaptions:\s*true)(\}\})'
content = re.sub(pattern, r'\1voiceoverSrc: voiceoverStudyMode, \2\3', content)

with open('ki/src/Root.tsx', 'w') as f:
    f.write(content)
