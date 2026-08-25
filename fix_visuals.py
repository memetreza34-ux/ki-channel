with open('ki/src/reels/chatgpt-teens/Visuals.tsx', 'r') as f:
    content = f.read()

import re

# Find the export const visualByScene and replace it
replacement = """export const visualByScene: Record<string, React.FC> = {
  scene1: AestheticDriftVisual,
  scene2: CreativeBriefVisual,
  scene3: ConsistentKeyframesVisual,
  scene4: MotionAssemblyVisual,
  scene5: QualityControlVisual
};
"""

content = re.sub(r'export const visualByScene.*?;', replacement, content, flags=re.DOTALL)

with open('ki/src/reels/chatgpt-teens/Visuals.tsx', 'w') as f:
    f.write(content)
