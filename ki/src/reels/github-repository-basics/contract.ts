import {assertAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {GITHUB_REPOSITORY_VISUAL_PROFILES} from './visualProfiles';

export const GITHUB_REPOSITORY_COMPOSITION_ID = 'KI-GitHubRepository';
export const GITHUB_REPOSITORY_FPS = 30;
export const GITHUB_REPOSITORY_WIDTH = 1080;
export const GITHUB_REPOSITORY_HEIGHT = 1920;
export const GITHUB_REPOSITORY_DURATION_IN_FRAMES = 1785;
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
  {sceneId:'repo-01',startFrame:0,endFrame:468,headline:'Ein Ordner mit Gedächtnis',icon:'folder'},
  {sceneId:'repo-02',startFrame:468,endFrame:750,headline:'Alles gehört ins Repo',icon:'files'},
  {sceneId:'repo-03',startFrame:750,endFrame:990,headline:'Commits schreiben Geschichte',icon:'history'},
  {sceneId:'repo-04',startFrame:990,endFrame:1176,headline:'Branches schützen den Stand',icon:'branch'},
  {sceneId:'repo-05',startFrame:1176,endFrame:1785,headline:'Mehr als nur Code',icon:'repo'},
];

export const GITHUB_REPOSITORY_SUBTITLES: GitHubRepositoryCue[] = [
  {sceneId:'repo-01',startFrame:0,endFrame:150,text:'Wenn du auf GitHub ein Projekt öffnest, landest du meistens in einem Repository.'},
  {sceneId:'repo-01',startFrame:150,endFrame:320,text:'Ein Repository ist im Grunde der komplette Arbeitsordner eines Projekts – aber mit Gedächtnis.'},
  {sceneId:'repo-01',startFrame:320,endFrame:468,text:'Darin liegen Code, Bilder, Dokumentation und Konfigurationsdateien.'},
  {sceneId:'repo-02',startFrame:468,endFrame:660,text:'Git merkt sich zusätzlich, welche Datei wann geändert wurde und wer diese Änderung gespeichert hat.'},
  {sceneId:'repo-02',startFrame:660,endFrame:750,text:'Jeder gespeicherte Zwischenstand heißt Commit.'},
  {sceneId:'repo-03',startFrame:750,endFrame:850,text:'Viele Commits ergeben eine nachvollziehbare Geschichte:'},
  {sceneId:'repo-03',startFrame:850,endFrame:990,text:'Was wurde geändert, warum und an welchem Punkt funktionierte der Code noch?'},
  {sceneId:'repo-04',startFrame:990,endFrame:1080,text:'Mit Branches kannst du neue Funktionen getrennt ausprobieren, ohne die stabile Version direkt anzufassen.'},
  {sceneId:'repo-04',startFrame:1080,endFrame:1176,text:'Ist die Änderung fertig, wird sie über einen Pull Request geprüft und zusammengeführt.'},
  {sceneId:'repo-05',startFrame:1176,endFrame:1350,text:'Darum ist ein Repository mehr als ein Ordner in der Cloud.'},
  {sceneId:'repo-05',startFrame:1350,endFrame:1500,text:'Es bündelt Dateien, Versionsverlauf und Zusammenarbeit an einem Ort.'},
  {sceneId:'repo-05',startFrame:1500,endFrame:1785,text:'Wenn jemand dir also ein GitHub-Repo schickt, zeigt er dir nicht nur Code, sondern die komplette Entwicklung des Projekts.'},
];

export const assertGitHubRepositoryVisualContract = (): void => {
  if (
    GITHUB_REPOSITORY_WIDTH !== 1080 ||
    GITHUB_REPOSITORY_HEIGHT !== 1920 ||
    GITHUB_REPOSITORY_FPS !== 30
  ) {
    throw new Error('GitHub repository reel format must be 1080x1920 @30fps');
  }
  if (GITHUB_REPOSITORY_SCENES.length !== 5) {
    throw new Error('GitHub repository reel must contain five authored scenes');
  }
  const plannedSceneIds = GITHUB_REPOSITORY_SCENES.map((scene) => scene.sceneId);
  const profiledSceneIds = GITHUB_REPOSITORY_VISUAL_PROFILES.map(
    (profile) => profile.sceneId,
  );
  if (plannedSceneIds.join('|') !== profiledSceneIds.join('|')) {
    throw new Error(
      'GitHub repository visual profiles must exactly cover the authored scene order',
    );
  }
  assertAuthoredVisualDiversity(GITHUB_REPOSITORY_VISUAL_PROFILES);
};

assertGitHubRepositoryVisualContract();
