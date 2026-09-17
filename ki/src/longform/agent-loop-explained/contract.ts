export const AGENT_LOOP_COMPOSITION_ID='KI-Longform-AgentLoop';
export const AGENT_LOOP_THUMBNAIL_ID='KI-Longform-AgentLoop-Thumbnail';
export const AGENT_LOOP_WIDTH=1920;
export const AGENT_LOOP_HEIGHT=1080;
export const AGENT_LOOP_FPS=30;
export const AGENT_LOOP_DURATION_IN_FRAMES=10020;

export type AgentLoopChapterId='hook'|'compare'|'anatomy'|'loop'|'example'|'tools'|'risks'|'guardrails'|'fit';
export type AgentLoopChapter={id:AgentLoopChapterId;startFrame:number;endFrame:number;title:string;beatFrames:number[]};

export const AGENT_LOOP_CHAPTERS:AgentLoopChapter[]=[
  {id:'hook',startFrame:0,endFrame:720,title:'Was einen Agenten anders macht',beatFrames:[85,156,212,257,352,412,506,634]},
  {id:'compare',startFrame:720,endFrame:1770,title:'Chatbot gegen Agent',beatFrames:[20,86,139,185,273,364,440,535,599,647,729,758,924,1010]},
  {id:'anatomy',startFrame:1770,endFrame:2970,title:'Die vier Bausteine',beatFrames:[25,67,142,256,365,467,562,615,741,769,822,882,939,1000,1058,1140,1174]},
  {id:'loop',startFrame:2970,endFrame:4170,title:'Der Agenten-Loop',beatFrames:[52,85,156,230,337,409,463,549,616,696,796,900,956,1005,1070,1137]},
  {id:'example',startFrame:4170,endFrame:5430,title:'Ein konkretes Beispiel',beatFrames:[32,92,259,361,443,562,709,767,886,954,1028,1104,1227]},
  {id:'tools',startFrame:5430,endFrame:6690,title:'Warum Werkzeuge entscheidend sind',beatFrames:[41,130,215,306,398,485,516,604,674,776,819,882,951,1020,1135,1188]},
  {id:'risks',startFrame:6690,endFrame:7950,title:'Wo Agenten scheitern können',beatFrames:[68,157,316,430,542,614,695,761,841,903,966,1113]},
  {id:'guardrails',startFrame:7950,endFrame:9000,title:'Kontrolle und Freigaben',beatFrames:[115,366,433,542,595,667,779,879,922,1020]},
  {id:'fit',startFrame:9000,endFrame:10020,title:'Wann ein Agent sinnvoll ist',beatFrames:[90,279,429,523,607,719,904,984]},
];

export const AGENT_LOOP_TOTAL_VISUAL_BEATS=AGENT_LOOP_CHAPTERS.reduce((sum,c)=>sum+c.beatFrames.length,0);
