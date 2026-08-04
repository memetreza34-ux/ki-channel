export type ChannelContentModeId =
  | 'concept-explainer'
  | 'tool-ui-tutorial'
  | 'prompt-before-after'
  | 'model-comparison'
  | 'ai-news-update'
  | 'release-timeline'
  | 'pricing-cost'
  | 'benchmark-data'
  | 'workflow-automation'
  | 'agent-system'
  | 'api-code'
  | 'image-generation'
  | 'video-generation'
  | 'audio-voice'
  | 'privacy-security'
  | 'myth-vs-fact'
  | 'list-ranking'
  | 'case-study'
  | 'troubleshooting'
  | 'source-verification';

export type VisualSourceStrategy =
  | 'remotion-native'
  | 'kinetic-type'
  | 'ui-reconstruction'
  | 'annotated-screenshot'
  | 'data-chart'
  | 'code-typing'
  | 'generated-illustration'
  | 'animated-asset-cutout'
  | 'source-document'
  | 'timeline'
  | 'comparison-stage';

export type ChannelContentMode = {
  modeId: ChannelContentModeId;
  purpose: string;
  terms: readonly string[];
  phrases: readonly string[];
  preferredVisualFamilies: readonly string[];
  requiredVisualSources: readonly VisualSourceStrategy[];
  optionalVisualSources: readonly VisualSourceStrategy[];
  requiredMotionLayers: readonly string[];
  forbiddenShortcuts: readonly string[];
};

export type ChannelContentModeScore = {
  modeId: ChannelContentModeId;
  score: number;
  matchedTerms: string[];
  matchedPhrases: string[];
};

export type ChannelContentModePlan = {
  text: string;
  primaryMode: ChannelContentMode;
  secondaryModes: ChannelContentMode[];
  scores: ChannelContentModeScore[];
  visualSources: VisualSourceStrategy[];
  productionRules: string[];
};

export const CHANNEL_CONTENT_MODES: readonly ChannelContentMode[] = [
  {modeId:'concept-explainer',purpose:'Explain an abstract AI concept through visible cause, transformation, and result.',terms:['bedeutet','funktioniert','warum','konzept','erklärt','modell','token','attention','embedding'],phrases:['so funktioniert','einfach erklärt','was ist'],preferredVisualFamilies:['input-output','data-transformation','model-processing','semantic-space'],requiredVisualSources:['remotion-native','kinetic-type'],optionalVisualSources:['generated-illustration'],requiredMotionLayers:['headline','main-mechanism','important-word-emphasis','semantic-transition','sfx'],forbiddenShortcuts:['static icon grid','generic glowing brain','unexplained particles']},
  {modeId:'tool-ui-tutorial',purpose:'Demonstrate exactly where to click and what changes inside an AI tool.',terms:['klicken','menü','einstellung','button','interface','tool','app','dashboard'],phrases:['so benutzt du','klicke auf','geh zu'],preferredVisualFamilies:['process-flow','decision-logic','input-output'],requiredVisualSources:['ui-reconstruction','kinetic-type'],optionalVisualSources:['annotated-screenshot'],requiredMotionLayers:['cursor-path','click-feedback','panel-focus','result-state','subtitles'],forbiddenShortcuts:['unreadable full-screen screenshot','fake feature not present in the tool','random camera zoom']},
  {modeId:'prompt-before-after',purpose:'Show how a prompt change produces a visibly different result.',terms:['prompt','eingabe','anweisung','verbessern','ergebnis'],phrases:['vorher nachher','dieser prompt','ändere nur'],preferredVisualFamilies:['comparison','input-output','generation'],requiredVisualSources:['comparison-stage','kinetic-type'],optionalVisualSources:['ui-reconstruction','annotated-screenshot'],requiredMotionLayers:['prompt-delta','changed-word-highlight','parallel-result','winner-reason'],forbiddenShortcuts:['two static screenshots without highlighted differences','typewriter for the entire prompt']},
  {modeId:'model-comparison',purpose:'Compare AI models on the same task and shared criteria.',terms:['modell','vergleich','besser','schneller','qualität','gegen','versus'],phrases:['im vergleich','a gegen b','welches modell'],preferredVisualFamilies:['comparison','ranking','scale-performance'],requiredVisualSources:['comparison-stage','data-chart'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['shared-baseline','criterion-reveal','score-change','tradeoff-summary'],forbiddenShortcuts:['different tests for each model','winner claim without visible criterion']},
  {modeId:'ai-news-update',purpose:'Explain a new AI development with context, change, and consequence.',terms:['neu','news','angekündigt','veröffentlicht','update','heute','aktuell'],phrases:['wurde vorgestellt','ist jetzt verfügbar','neues modell'],preferredVisualFamilies:['time-change','comparison','input-output'],requiredVisualSources:['timeline','kinetic-type','source-document'],optionalVisualSources:['annotated-screenshot','animated-asset-cutout'],requiredMotionLayers:['date-lock','what-changed','before-after-state','why-it-matters'],forbiddenShortcuts:['news logo montage','uncited date or feature','static headline reading']},
  {modeId:'release-timeline',purpose:'Show versions, milestones, or feature changes in chronological order.',terms:['version','release','timeline','früher','heute','entwicklung','update'],phrases:['von bis','mit der zeit','seit version'],preferredVisualFamilies:['time-change','learning-update'],requiredVisualSources:['timeline','kinetic-type'],optionalVisualSources:['source-document'],requiredMotionLayers:['timeline-travel','milestone-stop','delta-highlight','current-state-hold'],forbiddenShortcuts:['all milestones appearing at once','continuous pan without readable holds']},
  {modeId:'pricing-cost',purpose:'Make prices, token costs, limits, and savings concrete.',terms:['preis','kosten','euro','dollar','abo','tokenkosten','budget','sparen'],phrases:['pro monat','kostet dich','günstiger als'],preferredVisualFamilies:['cost-efficiency','comparison','ranking'],requiredVisualSources:['data-chart','kinetic-type'],optionalVisualSources:['ui-reconstruction','source-document'],requiredMotionLayers:['currency-readout','cost-breakdown','comparison-baseline','total-lock'],forbiddenShortcuts:['price without date or plan context','decorative coin rain']},
  {modeId:'benchmark-data',purpose:'Explain measured performance with readable numbers and methodology.',terms:['benchmark','score','prozent','test','messung','daten','statistik'],phrases:['erreicht im test','laut benchmark','prozent besser'],preferredVisualFamilies:['ranking','comparison','scale-performance'],requiredVisualSources:['data-chart','source-document'],optionalVisualSources:['kinetic-type'],requiredMotionLayers:['metric-definition','axis-build','value-animation','method-note'],forbiddenShortcuts:['3D chart distortion','uncited statistic','ranking without metric']},
  {modeId:'workflow-automation',purpose:'Show a complete automated workflow and every handoff.',terms:['workflow','automation','automatisch','schritt','pipeline','prozess','verknüpfen'],phrases:['schritt für schritt','danach automatisch','ohne manuell'],preferredVisualFamilies:['process-flow','human-ai-collaboration','decision-logic'],requiredVisualSources:['remotion-native','kinetic-type'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['input-arrival','station-handoff','decision-gate','completion-state'],forbiddenShortcuts:['identical cards connected by arrows','moving dots without task state']},
  {modeId:'agent-system',purpose:'Explain how one or more agents plan, call tools, evaluate, and continue.',terms:['agent','agenten','tool','planen','ausführen','memory','orchestrierung'],phrases:['ki agent','mehrere agenten','tool aufrufen'],preferredVisualFamilies:['process-flow','decision-logic','context-window','human-ai-collaboration'],requiredVisualSources:['remotion-native','kinetic-type'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['goal-state','agent-decision','tool-call','observation-return','completion-gate'],forbiddenShortcuts:['robot character with no system logic','infinite loop animation']},
  {modeId:'api-code',purpose:'Explain an API or code workflow with executable-looking cause and output.',terms:['api','code','javascript','typescript','python','request','response','json','sdk'],phrases:['api aufrufen','dieser code','request senden'],preferredVisualFamilies:['input-output','process-flow','error-detection'],requiredVisualSources:['code-typing','remotion-native'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['code-focus','request-travel','response-parse','error-path'],forbiddenShortcuts:['typing every line slowly','tiny unreadable code','fake success without response state']},
  {modeId:'image-generation',purpose:'Explain image generation through prompt, composition, iteration, and result.',terms:['bild','image','foto','illustration','midjourney','dall','flux','generieren'],phrases:['bild erstellen','image prompt','ki bild'],preferredVisualFamilies:['input-output','generation','comparison'],requiredVisualSources:['animated-asset-cutout','kinetic-type'],optionalVisualSources:['ui-reconstruction','generated-illustration'],requiredMotionLayers:['prompt-fragments','composition-blocking','iteration-delta','result-reveal'],forbiddenShortcuts:['static image with slow zoom only','unlicensed example asset']},
  {modeId:'video-generation',purpose:'Explain video generation through shots, motion, continuity, and render.',terms:['video','veo','sora','flow','szene','kamera','motion','render'],phrases:['video erstellen','text zu video','erste szene'],preferredVisualFamilies:['process-flow','generation','time-change'],requiredVisualSources:['animated-asset-cutout','timeline','kinetic-type'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['shot-plan','motion-direction','continuity-bridge','render-result'],forbiddenShortcuts:['unrelated stock montage','repeated zoom on still frames']},
  {modeId:'audio-voice',purpose:'Explain speech, transcription, voice, or audio processing visibly.',terms:['audio','stimme','voice','sprache','transkribieren','sound','musik','welle'],phrases:['text zu sprache','sprache erkennen','stimme klonen'],preferredVisualFamilies:['data-transformation','input-output','comparison'],requiredVisualSources:['remotion-native','kinetic-type'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['waveform-cause','segment-highlight','voice-state','audible-result'],forbiddenShortcuts:['decorative waveform unrelated to the spoken event','music replacing explanation']},
  {modeId:'privacy-security',purpose:'Explain data flow, permission, encryption, and concrete risk.',terms:['datenschutz','privat','sicherheit','verschlüsselt','zugriff','daten','risiko'],phrases:['private daten','wer kann zugreifen','daten verlassen'],preferredVisualFamilies:['security-privacy','risk-contrast','process-flow'],requiredVisualSources:['remotion-native','source-document'],optionalVisualSources:['ui-reconstruction'],requiredMotionLayers:['data-boundary','permission-check','threat-path','safe-result'],forbiddenShortcuts:['generic padlock only','fear animation without actual data path']},
  {modeId:'myth-vs-fact',purpose:'Correct a misconception through a clear claim, contradiction, and evidence.',terms:['mythos','fakt','stimmt','falsch','wirklich','wahrheit'],phrases:['das stimmt nicht','mythos oder fakt','in wirklichkeit'],preferredVisualFamilies:['risk-contrast','comparison','source-verification'],requiredVisualSources:['comparison-stage','source-document','kinetic-type'],optionalVisualSources:['remotion-native'],requiredMotionLayers:['claim-lock','negation-action','evidence-arrival','corrected-state'],forbiddenShortcuts:['red cross without explanation','fact claim without source']},
  {modeId:'list-ranking',purpose:'Present several tools, methods, or options with meaningful ordering.',terms:['top','liste','platz','beste','tools','möglichkeiten','ranking'],phrases:['top drei','auf platz','die besten'],preferredVisualFamilies:['ranking','comparison'],requiredVisualSources:['remotion-native','kinetic-type'],optionalVisualSources:['animated-asset-cutout'],requiredMotionLayers:['criterion-first','item-arrival','rank-change','final-order'],forbiddenShortcuts:['identical card carousel','ranking without criterion']},
  {modeId:'case-study',purpose:'Show a real starting state, intervention, measurement, and result.',terms:['beispiel','firma','projekt','kunde','fall','ergebnis','vorher'],phrases:['in diesem beispiel','hat dadurch','vorher und nachher'],preferredVisualFamilies:['time-change','comparison','process-flow','cost-efficiency'],requiredVisualSources:['timeline','data-chart','source-document'],optionalVisualSources:['annotated-screenshot'],requiredMotionLayers:['baseline','intervention','measured-change','lesson'],forbiddenShortcuts:['anonymous success claim without measurement','result shown before baseline']},
  {modeId:'troubleshooting',purpose:'Find and fix a concrete AI tool, prompt, API, or workflow problem.',terms:['fehler','problem','funktioniert nicht','bug','lösung','fix','debug'],phrases:['so behebst du','wenn das nicht klappt','fehler lösen'],preferredVisualFamilies:['error-detection','decision-logic','process-flow'],requiredVisualSources:['ui-reconstruction','remotion-native'],optionalVisualSources:['code-typing','annotated-screenshot'],requiredMotionLayers:['failure-state','root-cause-trace','fix-action','verified-retest'],forbiddenShortcuts:['jumping directly to the fix','generic warning icon']},
  {modeId:'source-verification',purpose:'Show how a claim is checked against current and trustworthy evidence.',terms:['quelle','prüfen','beleg','studie','aktuell','verifizieren','nachweis'],phrases:['laut quelle','belege prüfen','ist das aktuell'],preferredVisualFamilies:['retrieval-search','risk-contrast','time-change'],requiredVisualSources:['source-document','remotion-native'],optionalVisualSources:['annotated-screenshot'],requiredMotionLayers:['claim-anchor','source-search','date-check','confidence-result'],forbiddenShortcuts:['citation shown too briefly to read','trust score without method']},
] as const;

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const planChannelContentMode = (text: string): ChannelContentModePlan => {
  const normalized = normalize(text);
  if (!normalized) throw new Error('channel content mode planner requires text');
  const tokens = new Set(normalized.split(' '));
  const scores = CHANNEL_CONTENT_MODES.map((mode) => {
    const matchedTerms = mode.terms.filter((term) => tokens.has(normalize(term)));
    const matchedPhrases = mode.phrases.filter((phrase) => normalized.includes(normalize(phrase)));
    return {
      modeId: mode.modeId,
      score: matchedTerms.length * 4 + matchedPhrases.length * 9,
      matchedTerms: [...matchedTerms],
      matchedPhrases: [...matchedPhrases],
    } satisfies ChannelContentModeScore;
  }).sort((left, right) => right.score - left.score || left.modeId.localeCompare(right.modeId));
  const primaryScore = scores[0];
  const primaryMode = CHANNEL_CONTENT_MODES.find((mode) => mode.modeId === primaryScore.modeId)!;
  const secondaryModes = scores
    .slice(1)
    .filter((score) => score.score > 0 && score.score >= primaryScore.score * 0.55)
    .slice(0, 2)
    .map((score) => CHANNEL_CONTENT_MODES.find((mode) => mode.modeId === score.modeId)!);
  const visualSources = [...new Set([
    ...primaryMode.requiredVisualSources,
    ...secondaryModes.flatMap((mode) => mode.requiredVisualSources),
    ...primaryMode.optionalVisualSources.slice(0, 1),
  ])];

  return {
    text,
    primaryMode,
    secondaryModes,
    scores,
    visualSources,
    productionRules: [
      'Animate every sentence with one dominant explanatory mechanism.',
      'Reveal all spoken words in subtitles and strongly animate only important semantic words.',
      'Use Remotion-native motion for text, numbers, diagrams, connectors, timelines, charts, and UI focus.',
      'Use a screenshot or generated illustration only when it explains something Remotion geometry cannot communicate efficiently.',
      'Never leave an image static with only a generic zoom; animate meaningful regions, depth, callouts, or state changes.',
      'Keep Hold → Movement → Hold, a maximum of three strong motions per scene, and a stable readable result.',
      'Use hard cuts by default and semantic transitions only when an object, shape, direction, or state can continue.',
      'Do not animate decorative elements that compete with the explanation.',
      ...primaryMode.forbiddenShortcuts.map((shortcut) => `Avoid: ${shortcut}.`),
    ],
  };
};
