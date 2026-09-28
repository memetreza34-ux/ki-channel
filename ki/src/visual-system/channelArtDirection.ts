export const CHANNEL_ART_DIRECTION_ID = 'physical-ai-editorial-v1' as const;

export const CHANNEL_ART_DIRECTION = Object.freeze({
  worldId: CHANNEL_ART_DIRECTION_ID,
  palette: Object.freeze({
    paper: '#FBFAF7',
    warmGround: '#F3F0EA',
    graphite: '#1A1820',
    graphiteDeep: '#0F0E13',
    purple: '#6E45C9',
    purpleLight: '#B98CFF',
    risk: '#B5415C',
    solution: '#2B8A68',
  }),
  materials: Object.freeze([
    'warm-paper',
    'graphite',
    'frosted-acrylic',
    'clear-glass',
    'brushed-metal',
    'ceramic',
  ] as const),
  cameras: Object.freeze([
    'editorial-medium',
    'macro-push',
    'controlled-orbit',
    'top-down-mechanical',
    'cutaway',
  ] as const),
  glowModes: Object.freeze(['none', 'semantic-only'] as const),
  constraints: Object.freeze({
    maxMaterialFamiliesPerScene: 3,
    maxSupportObjects: 3,
    maxVisualLabels: 2,
    maxUiPanels: 1,
    maxPurpleCoverageTarget: 0.18,
  }),
} as const);

export type ChannelMaterial = (typeof CHANNEL_ART_DIRECTION.materials)[number];
export type ChannelCamera = (typeof CHANNEL_ART_DIRECTION.cameras)[number];
export type ChannelGlowMode = (typeof CHANNEL_ART_DIRECTION.glowModes)[number];
export type CalibrationRole = 'hook' | 'mechanism' | 'payoff';
export type CalibrationHumanStatus = 'PENDING' | 'REWORK' | 'APPROVED';

export type ArtDirectionCalibrationScene = {
  role: CalibrationRole;
  sceneId: string;
  heroObject: string;
  physicalAction: string;
  materials: readonly ChannelMaterial[];
  camera: ChannelCamera;
  supportObjectCount: number;
  visualLabelCount: number;
  uiPanelCount: number;
  glowMode: ChannelGlowMode;
  purpleCoverageTarget: number;
  neonBackground: false;
  dashboardGrammar: false;
  floatingPillCloud: false;
  channelWorldFit: string;
};

export type ArtDirectionCalibration = {
  version: 1;
  worldId: typeof CHANNEL_ART_DIRECTION_ID;
  scenes: readonly ArtDirectionCalibrationScene[];
  humanCreativeStatus: CalibrationHumanStatus;
  approvedByHuman: boolean;
  approvalNote: string;
  fullReelBuildAllowed: boolean;
};

const weakActions = new Set([
  'show', 'shows', 'display', 'displays', 'appear', 'appears', 'float', 'floats',
  'zeigen', 'zeigt', 'erscheinen', 'erscheint', 'schweben', 'schwebt', 'bewegen', 'bewegt',
]);

const useful = (value: string, min = 5): boolean => value.trim().length >= min && !/^(offen|todo|tbd|placeholder)$/i.test(value.trim());

export const assertArtDirectionCalibration = (calibration: ArtDirectionCalibration): void => {
  if (calibration.version !== 1) throw new Error('art direction calibration version must be 1');
  if (calibration.worldId !== CHANNEL_ART_DIRECTION_ID) throw new Error(`worldId must be ${CHANNEL_ART_DIRECTION_ID}`);
  if (calibration.scenes.length !== 3) throw new Error('exactly three art-direction calibration scenes are required');

  const roles = calibration.scenes.map((scene) => scene.role);
  for (const role of ['hook', 'mechanism', 'payoff'] as const) {
    if (roles.filter((value) => value === role).length !== 1) throw new Error(`calibration needs exactly one ${role} scene`);
  }

  for (const scene of calibration.scenes) {
    if (!useful(scene.sceneId, 3)) throw new Error(`${scene.role}: sceneId missing`);
    if (!useful(scene.heroObject, 5)) throw new Error(`${scene.role}: heroObject must be concrete`);
    if (!useful(scene.physicalAction, 4) || weakActions.has(scene.physicalAction.trim().toLowerCase())) throw new Error(`${scene.role}: physicalAction must describe a real physical event`);
    if (scene.materials.length < 1 || scene.materials.length > CHANNEL_ART_DIRECTION.constraints.maxMaterialFamiliesPerScene) throw new Error(`${scene.role}: use 1-${CHANNEL_ART_DIRECTION.constraints.maxMaterialFamiliesPerScene} material families`);
    for (const material of scene.materials) if (!(CHANNEL_ART_DIRECTION.materials as readonly string[]).includes(material)) throw new Error(`${scene.role}: invalid material ${material}`);
    if (!(CHANNEL_ART_DIRECTION.cameras as readonly string[]).includes(scene.camera)) throw new Error(`${scene.role}: invalid camera ${scene.camera}`);
    if (scene.supportObjectCount < 0 || scene.supportObjectCount > CHANNEL_ART_DIRECTION.constraints.maxSupportObjects) throw new Error(`${scene.role}: too many support objects`);
    if (scene.visualLabelCount < 0 || scene.visualLabelCount > CHANNEL_ART_DIRECTION.constraints.maxVisualLabels) throw new Error(`${scene.role}: too many visual labels`);
    if (scene.uiPanelCount < 0 || scene.uiPanelCount > CHANNEL_ART_DIRECTION.constraints.maxUiPanels) throw new Error(`${scene.role}: too many UI panels`);
    if (!(CHANNEL_ART_DIRECTION.glowModes as readonly string[]).includes(scene.glowMode)) throw new Error(`${scene.role}: glowMode must be none or semantic-only`);
    if (scene.purpleCoverageTarget < 0 || scene.purpleCoverageTarget > CHANNEL_ART_DIRECTION.constraints.maxPurpleCoverageTarget) throw new Error(`${scene.role}: purple coverage target exceeds 18%`);
    if (scene.neonBackground !== false) throw new Error(`${scene.role}: neon background is forbidden`);
    if (scene.dashboardGrammar !== false) throw new Error(`${scene.role}: dashboard grammar is forbidden for calibration`);
    if (scene.floatingPillCloud !== false) throw new Error(`${scene.role}: floating pill cloud is forbidden`);
    if (!useful(scene.channelWorldFit, 20)) throw new Error(`${scene.role}: channelWorldFit must explain why the scene belongs to this world`);
  }

  if (calibration.humanCreativeStatus === 'APPROVED') {
    if (calibration.approvedByHuman !== true) throw new Error('APPROVED requires approvedByHuman=true');
    if (!useful(calibration.approvalNote, 20)) throw new Error('APPROVED requires a concrete human approval note');
    if (calibration.fullReelBuildAllowed !== true) throw new Error('APPROVED calibration must allow full reel build');
  } else if (calibration.fullReelBuildAllowed !== false) {
    throw new Error('fullReelBuildAllowed must stay false until humanCreativeStatus=APPROVED');
  }
};
