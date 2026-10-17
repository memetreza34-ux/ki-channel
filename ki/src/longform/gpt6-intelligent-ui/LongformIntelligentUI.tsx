import React from 'react';
import {Video as KanalLookVideo} from '../../../../studio/projekte/gpt6-intelligent-ui/Video';

export const DEFAULT_INTELLIGENT_UI_VOICEOVER = '__phase3/gpt6-intelligent-ui/voiceover.wav';

export type LongformIntelligentUIProps = {voiceoverSrc?: string};

/**
 * LongformIntelligentUI – delegiert an das vollständige Kanal-Look-Video mit Toki.
 */
export const LongformIntelligentUI: React.FC<LongformIntelligentUIProps> = ({voiceoverSrc}) => {
  return <KanalLookVideo voiceoverSrc={voiceoverSrc} />;
};
