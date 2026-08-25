with open('ki/src/Root.tsx', 'r') as f:
    content = f.read()

import re

# Add import
if 'voiceoverChatGPTForTeens' not in content:
    content = content.replace(
        "import voiceoverGithubRepo from '../reels/2026-08-24_bis_2026-08-30/01_GitHub-Repository-Basics/01-script-audio/voiceover.mp3';",
        "import voiceoverGithubRepo from '../reels/2026-08-24_bis_2026-08-30/01_GitHub-Repository-Basics/01-script-audio/voiceover.mp3';\nimport voiceoverChatGPTForTeens from '../reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein/01-script-audio/voiceover.mp3';"
    )

# Add defaultProps
content = content.replace(
        "component={ReelChatGPTForTeens}",
        "component={ReelChatGPTForTeens}\n        defaultProps={{voiceoverSrc: voiceoverChatGPTForTeens, showCaptions: true}}"
    )

with open('ki/src/Root.tsx', 'w') as f:
    f.write(content)
