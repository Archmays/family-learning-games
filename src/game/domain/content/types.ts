export type Operation = "add" | "subtract" | "multiply" | "divide";

export const skillDefinitions = [
  { id: "number-bonds", label: "补数" },
  { id: "make-ten", label: "凑十" },
  { id: "compare-distance", label: "比较差距" },
  { id: "add-within-20", label: "20 以内加法" },
  { id: "subtract-within-20", label: "20 以内减法" },
  { id: "two-step-plan", label: "两步计划" },
  { id: "continuous-add", label: "连续加" },
  { id: "continuous-subtract", label: "连续减" },
  { id: "add-then-subtract", label: "先加后减" },
  { id: "multi-source-choice", label: "多起点选择" }
] as const;

export type SkillTag = (typeof skillDefinitions)[number]["id"];

export interface RoleDefinition {
  id: string;
  operation: Operation;
  operandOptions: number[];
  childLabel: string;
  skinSlot: string;
  enabledInMvp?: boolean;
}

export interface RoleSkin {
  displayName: string;
  shortName: string;
  color: string;
  accentColor: string;
  avatarKey: string;
}

export interface SkinPack {
  id: string;
  roleSkins: Record<string, RoleSkin>;
}

export interface SolutionStep {
  roleId: string;
  sourceValueIndex: number;
  operand: number;
  result: number;
  explanation: string;
}

export interface EncounterFeedbackDefinition {
  goal: string;
  overshoot: string;
  undershoot: string;
  nextStep: string;
  comboMiss?: string;
}

export interface MasteryGateDefinition {
  minStars?: number;
  requiredSkillTags?: SkillTag[];
  minIndependentWins?: number;
  maxRecentHintLevel?: number;
  maxRecentMistakes?: number;
}

export interface ConceptInteractionDefinition {
  kind: "make-ten" | "part-whole" | "difference" | "two-step" | "choice-compare";
  title: string;
  prompt: string;
  sourceValueIndex: number;
  operand: number;
  operator?: "+" | "-";
  result: number;
  successText: string;
}

export interface SceneCopyDefinition {
  targetLabel: string;
  sourceLabel: string;
  materialLabel: string;
  bonusLabel: string;
  progressLabel: string;
  progressDoneLabel: string;
  applyLabel: string;
  applyHitLabel: string;
  setupLabel: string;
  hitLabel: string;
  addLabel: string;
  subtractLabel: string;
}

export interface StandardLinksDefinition {
  alignmentDepth: "game_objective";
  canonicalObjectiveIds: string[];
  standardOutcomeIds: string[];
  playerAction: string;
  observableEvidence: string[];
  notProgressEvidence: true;
}

export interface StageThemeDefinition {
  backgroundKey: string;
  accentColor: string;
  bottomColor: string;
  successEffect: "apple-tree" | "cake-sparkle" | "river-boat" | "open-book" | "market-basket";
}

export interface EncounterDefinition {
  id: string;
  type: "precision_hit" | "combo_hit";
  title: string;
  skillTags?: SkillTag[];
  initialValues: number[];
  targetValue: number;
  allowedRoleIds: string[];
  maxMistakes: number;
  maxActions?: number;
  selectableValueIndexes?: number[];
  comboText?: string;
  hintText: string;
  hintSteps?: [string, string, string];
  feedback?: EncounterFeedbackDefinition;
  conceptInteraction?: ConceptInteractionDefinition;
  standardLinks?: StandardLinksDefinition;
  knownSolution: SolutionStep[];
}

export interface StageDefinition {
  id: string;
  title: string;
  difficulty: "sprout" | "adventure";
  theme?: StageThemeDefinition;
  chapter?: string;
  skillFocus?: string;
  unlockStars?: number;
  masteryGate?: MasteryGateDefinition;
  rewardStickerId?: string;
  rewardStickerLabel?: string;
  parentNote?: string;
  description: string;
  sceneCopy?: SceneCopyDefinition;
  standardLinks?: StandardLinksDefinition;
  encounters: EncounterDefinition[];
}

export interface RolesFile {
  roles: RoleDefinition[];
}

export interface LevelsFile {
  stages: StageDefinition[];
}
