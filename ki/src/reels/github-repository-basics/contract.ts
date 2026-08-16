export const GITHUB_REPOSITORY_COMPOSITION_ID = 'KI-GitHubRepository';
export const GITHUB_REPOSITORY_FPS = 30;
export const GITHUB_REPOSITORY_WIDTH = 1080;
export const GITHUB_REPOSITORY_HEIGHT = 1920;
export const GITHUB_REPOSITORY_DURATION_IN_FRAMES = 1800;
export const GITHUB_REPOSITORY_CAPTION_ZONE_Y = 1440;

export type GitHubRepositoryScene = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  headline: string;
  icon: 'folder' | 'files' | 'history' | 'branch' | 'repo';
};

export type GitHubRepositoryCue = {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{text:string;startFrame:number;endFrame:number}>;
};

export const GITHUB_REPOSITORY_SCENES: GitHubRepositoryScene[] = [
  {sceneId:'repo-01',startFrame:0,endFrame:340,headline:'Ein Ordner mit Gedächtnis',icon:'folder'},
  {sceneId:'repo-02',startFrame:340,endFrame:690,headline:'Alles gehört ins Repo',icon:'files'},
  {sceneId:'repo-03',startFrame:690,endFrame:1040,headline:'Commits schreiben Geschichte',icon:'history'},
  {sceneId:'repo-04',startFrame:1040,endFrame:1430,headline:'Branches schützen den Stand',icon:'branch'},
  {sceneId:'repo-05',startFrame:1430,endFrame:1800,headline:'Mehr als nur Code',icon:'repo'},
];

export const GITHUB_REPOSITORY_SUBTITLES: GitHubRepositoryCue[] = [
  {sceneId:'repo-01',startFrame:0,endFrame:180,text:'Wenn du auf GitHub ein Projekt öffnest, landest du meistens in einem Repository.'},
  {sceneId:'repo-01',startFrame:180,endFrame:340,text:'Ein Repository ist im Grunde der komplette Arbeitsordner eines Projekts – aber mit Gedächtnis.'},
  {sceneId:'repo-02',startFrame:340,endFrame:500,text:'Darin liegen Code, Bilder, Dokumentation und Konfigurationsdateien.'},
  {sceneId:'repo-02',startFrame:500,endFrame:690,text:'Git merkt sich zusätzlich, welche Datei wann geändert wurde und wer diese Änderung gespeichert hat.'},
  {sceneId:'repo-03',startFrame:690,endFrame:825,text:'Jeder gespeicherte Zwischenstand heißt Commit.'},
  {sceneId:'repo-03',startFrame:825,endFrame:1040,text:'Viele Commits ergeben eine nachvollziehbare Geschichte: Was wurde geändert, warum und an welchem Punkt funktionierte der Code noch?'},
  {sceneId:'repo-04',startFrame:1040,endFrame:1245,text:'Mit Branches kannst du neue Funktionen getrennt ausprobieren, ohne die stabile Version direkt anzufassen.'},
  {sceneId:'repo-04',startFrame:1245,endFrame:1430,text:'Ist die Änderung fertig, wird sie über einen Pull Request geprüft und zusammengeführt.'},
  {sceneId:'repo-05',startFrame:1430,endFrame:1550,text:'Darum ist ein Repository mehr als ein Ordner in der Cloud.'},
  {sceneId:'repo-05',startFrame:1550,endFrame:1665,text:'Es bündelt Dateien, Versionsverlauf und Zusammenarbeit an einem Ort.'},
  {sceneId:'repo-05',startFrame:1665,endFrame:1800,text:'Wenn jemand dir also ein GitHub-Repo schickt, zeigt er dir nicht nur Code, sondern die komplette Entwicklung des Projekts.'},
];
