export const AGENT_LOOP_COMPOSITION_ID='KI-Longform-AgentLoop';
export const AGENT_LOOP_THUMBNAIL_ID='KI-Longform-AgentLoop-Thumbnail';
export const AGENT_LOOP_WIDTH=1920;
export const AGENT_LOOP_HEIGHT=1080;
export const AGENT_LOOP_FPS=30;
export const AGENT_LOOP_DURATION_IN_FRAMES=10020;

export type AgentLoopChapterId='hook'|'compare'|'anatomy'|'loop'|'example'|'tools'|'risks'|'guardrails'|'fit';
export type AgentLoopChapter={id:AgentLoopChapterId;startFrame:number;endFrame:number;title:string;beatFrames:number[]};

export const AGENT_LOOP_CHAPTERS:AgentLoopChapter[]=[
  {id:'hook',startFrame:0,endFrame:720,title:'Was einen Agenten anders macht',beatFrames:[45,120,210,330,480]},
  {id:'compare',startFrame:720,endFrame:1770,title:'Chatbot gegen Agent',beatFrames:[75,260,520,760]},
  {id:'anatomy',startFrame:1770,endFrame:2970,title:'Die vier Bausteine',beatFrames:[80,260,470,700,930]},
  {id:'loop',startFrame:2970,endFrame:4170,title:'Der Agenten-Loop',beatFrames:[60,220,390,570,760,980]},
  {id:'example',startFrame:4170,endFrame:5430,title:'Ein konkretes Beispiel',beatFrames:[65,220,390,570,750,940,1110]},
  {id:'tools',startFrame:5430,endFrame:6690,title:'Warum Werkzeuge entscheidend sind',beatFrames:[70,250,440,640,850,1080]},
  {id:'risks',startFrame:6690,endFrame:7950,title:'Wo Agenten scheitern können',beatFrames:[80,330,620,930]},
  {id:'guardrails',startFrame:7950,endFrame:9000,title:'Kontrolle und Freigaben',beatFrames:[70,300,560,800]},
  {id:'fit',startFrame:9000,endFrame:10020,title:'Wann ein Agent sinnvoll ist',beatFrames:[65,240,430,650,830]},
];

export const AGENT_LOOP_TOTAL_VISUAL_BEATS=AGENT_LOOP_CHAPTERS.reduce((sum,c)=>sum+c.beatFrames.length,0);
