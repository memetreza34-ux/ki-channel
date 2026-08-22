export const CHATGPT_ADS_GERMANY_COMPOSITION_ID = 'KI-ChatGPTAdsGermany';
export const CHATGPT_ADS_GERMANY_FPS = 30;
export const CHATGPT_ADS_GERMANY_WIDTH = 1080;
export const CHATGPT_ADS_GERMANY_HEIGHT = 1920;
export const CHATGPT_ADS_GERMANY_DURATION_IN_FRAMES = 1590;

export type ChatGPTAdsIcon = 'launch' | 'split' | 'plans' | 'privacy' | 'target';

export type ChatGPTAdsScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: ChatGPTAdsIcon;
};

export type ChatGPTAdsCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text: string; startFrame: number; endFrame: number}>;
};

export const CHATGPT_ADS_GERMANY_SCENES: ChatGPTAdsScene[] = [
  {sceneId:'ads-01',startFrame:0,endFrame:315,headline:'ChatGPT Ads sind jetzt hier',icon:'launch'},
  {sceneId:'ads-02',startFrame:315,endFrame:600,headline:'Antwort und Werbung getrennt',icon:'split'},
  {sceneId:'ads-03',startFrame:600,endFrame:945,headline:'Nicht jeder sieht Ads',icon:'plans'},
  {sceneId:'ads-04',startFrame:945,endFrame:1260,headline:'Relevant – aber privat',icon:'privacy'},
  {sceneId:'ads-05',startFrame:1260,endFrame:1590,headline:'Ein neuer Werbekanal',icon:'target'},
];

export const CHATGPT_ADS_GERMANY_SUBTITLES: ChatGPTAdsCue[] = [
  {sceneId:'ads-01',startFrame:0,endFrame:135,text:'Seit gestern gibt es ChatGPT Ads auch in Deutschland.'},
  {sceneId:'ads-01',startFrame:135,endFrame:315,text:'Werbung erscheint jetzt direkt im Chat – aber nicht so, wie viele wahrscheinlich denken.'},
  {sceneId:'ads-02',startFrame:315,endFrame:450,text:'Die Anzeige steht getrennt unter der Antwort,'},
  {sceneId:'ads-02',startFrame:450,endFrame:600,text:'ist als gesponsert markiert und soll laut OpenAI die eigentliche ChatGPT-Antwort nicht beeinflussen.'},
  {sceneId:'ads-03',startFrame:600,endFrame:735,text:'Betroffen sind nur Free- und Go-Nutzer.'},
  {sceneId:'ads-03',startFrame:735,endFrame:825,text:'Plus, Pro und Enterprise bleiben werbefrei.'},
  {sceneId:'ads-03',startFrame:825,endFrame:945,text:'Im kostenlosen Tarif kannst du Werbung außerdem deaktivieren – mit niedrigeren Nutzungslimits.'},
  {sceneId:'ads-04',startFrame:945,endFrame:1110,text:'Welche Anzeige erscheint, kann vom Thema deiner Unterhaltung, früheren Chats und bisherigen Werbeinteraktionen abhängen.'},
  {sceneId:'ads-04',startFrame:1110,endFrame:1260,text:'Werbetreibende bekommen deine Chats aber laut OpenAI nicht zu sehen.'},
  {sceneId:'ads-05',startFrame:1260,endFrame:1590,text:'Für OpenAI ist das viel größer als ein Werbebanner: ChatGPT wird zum neuen Werbekanal genau in dem Moment, in dem Menschen vergleichen und Entscheidungen treffen.'},
];
