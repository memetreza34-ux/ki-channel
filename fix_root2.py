with open('ki/src/Root.tsx', 'r') as f:
    content = f.read()

import re

# Fix double defaultProps
content = content.replace("        defaultProps={{voiceoverSrc: voiceoverChatGPTForTeens, showCaptions: true}}\n        defaultProps={{showCaptions: true}}", "        defaultProps={{voiceoverSrc: voiceoverChatGPTForTeens, showCaptions: true}}")

# Add import
import_statement = "import voiceoverChatGPTForTeens from '../reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein/01-script-audio/voiceover.mp3';\n"
if "voiceoverChatGPTForTeens from" not in content:
    content = import_statement + content

with open('ki/src/Root.tsx', 'w') as f:
    f.write(content)
