export const VOICE_PLUGINS_COMPOSITION_ID = 'KI-ChatGPTVoicePlugins';
export const VOICE_PLUGINS_WIDTH = 1080;
export const VOICE_PLUGINS_HEIGHT = 1920;
export const VOICE_PLUGINS_FPS = 30;
export const VOICE_PLUGINS_DURATION_IN_FRAMES = 1470;

export type VoicePluginScene = {
  id: string;
  from: number;
  duration: number;
  headline: string;
  dark: boolean;
};

export type VoicePluginCue = {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
};

export const VOICE_PLUGIN_SCENES: readonly VoicePluginScene[] = [
  {id:'voice-01',from:0,duration:210,headline:'VOICE KANN JETZT MEHR',dark:true},
  {id:'voice-02',from:210,duration:210,headline:'WEB · iOS · ANDROID',dark:false},
  {id:'voice-03',from:420,duration:210,headline:'VOICE TRIFFT DEINE TOOLS',dark:true},
  {id:'voice-04',from:630,duration:210,headline:'IN WORK WIRD ES PRAKTISCH',dark:false},
  {id:'voice-05',from:840,duration:210,headline:'DER TASK LÄUFT WEITER',dark:true},
  {id:'voice-06',from:1050,duration:210,headline:'DEINE GRENZEN BLEIBEN',dark:false},
  {id:'voice-07',from:1260,duration:210,headline:'VOICE WIRD ZUR STEUERUNG',dark:true},
] as const;

export const VOICE_PLUGIN_SUBTITLES: readonly VoicePluginCue[] = [
  {id:'c01',startFrame:0,endFrame:75,text:'ChatGPT Voice kann jetzt'},
  {id:'c02',startFrame:75,endFrame:150,text:'während Gesprächen Plugins benutzen'},
  {id:'c03',startFrame:150,endFrame:210,text:'Sprechen wird zum Workflow'},
  {id:'c04',startFrame:210,endFrame:285,text:'Auf Web, iOS und Android'},
  {id:'c05',startFrame:285,endFrame:360,text:'nutzt Voice verfügbare Plugins'},
  {id:'c06',startFrame:360,endFrame:420,text:'und verbundene Apps'},
  {id:'c07',startFrame:420,endFrame:510,text:'Apps können Informationen liefern'},
  {id:'c08',startFrame:510,endFrame:630,text:'oder unterstützte Aktionen anstoßen'},
  {id:'c09',startFrame:630,endFrame:720,text:'In Work geht mehr'},
  {id:'c10',startFrame:720,endFrame:780,text:'Dokumente, Präsentationen und Tabellen'},
  {id:'c11',startFrame:780,endFrame:840,text:'Apps oder Browser nutzen'},
  {id:'c12',startFrame:840,endFrame:930,text:'Voice-Call beendet?'},
  {id:'c13',startFrame:930,endFrame:1050,text:'Die Aufgabe kann weiterlaufen'},
  {id:'c14',startFrame:1050,endFrame:1140,text:'Berechtigungen bleiben bestehen'},
  {id:'c15',startFrame:1140,endFrame:1260,text:'genau wie Nutzungsgrenzen'},
  {id:'c16',startFrame:1260,endFrame:1365,text:'Voice ist nicht nur Eingabe'},
  {id:'c17',startFrame:1365,endFrame:1470,text:'sondern Workflow-Steuerung'},
] as const;
