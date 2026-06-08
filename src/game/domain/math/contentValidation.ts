import { BattleEngine, type BattleAction } from "../battle/BattleEngine";
import { getDirectHitOptions } from "../battle/actionOptions";
import { canReachTargetFromValue, getMaterialValueIndexes, getSelectableValueIndexes } from "../battle/valueOptions";
import {
  skillDefinitions,
  type EncounterDefinition,
  type RoleDefinition,
  type StageDefinition,
  type StandardLinksDefinition
} from "../content/types";

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
}

export function buildRoleMap(roles: RoleDefinition[]): Record<string, RoleDefinition> {
  return Object.fromEntries(roles.map((role) => [role.id, role]));
}

export function validateStages(
  stages: StageDefinition[],
  roles: Record<string, RoleDefinition>
): ContentValidationResult {
  const stickerIds = new Set<string>();
  const validSkillTags = new Set(skillDefinitions.map((skill) => skill.id));
  const stageErrors: string[] = [];

  for (const stage of stages) {
    if (stage.sceneCopy) {
      for (const key of [
        "targetLabel",
        "sourceLabel",
        "materialLabel",
        "bonusLabel",
        "progressLabel",
        "progressDoneLabel",
        "applyLabel",
        "applyHitLabel",
        "setupLabel",
        "hitLabel",
        "addLabel",
        "subtractLabel"
      ] as const) {
        if (!stage.sceneCopy[key]?.trim()) {
          stageErrors.push(`${stage.id}: sceneCopy.${key} is required.`);
        }
      }
    }

    stageErrors.push(...validateStandardLinks(`${stage.id}/standardLinks`, stage.standardLinks));

    if ((stage.unlockStars ?? 0) < 0) {
      stageErrors.push(`${stage.id}: unlockStars cannot be negative.`);
    }

    if (stage.rewardStickerId) {
      if (stickerIds.has(stage.rewardStickerId)) {
        stageErrors.push(`${stage.id}: rewardStickerId must be unique.`);
      }
      stickerIds.add(stage.rewardStickerId);
    }

    for (const skillTag of stage.masteryGate?.requiredSkillTags ?? []) {
      if (!validSkillTags.has(skillTag)) {
        stageErrors.push(`${stage.id}: masteryGate uses unknown skill tag ${skillTag}.`);
      }
    }
  }

  const errors = [
    ...stageErrors,
    ...stages.flatMap((stage) => stage.encounters.flatMap((encounter) => validateEncounter(stage.id, encounter, roles)))
  ];

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEncounter(
  stageId: string,
  encounter: EncounterDefinition,
  roles: Record<string, RoleDefinition>
): string[] {
  const prefix = `${stageId}/${encounter.id}`;
  const errors: string[] = [];

  if (encounter.type !== "precision_hit" && encounter.type !== "combo_hit") {
    errors.push(`${prefix}: only precision_hit and combo_hit are supported.`);
  }

  if (encounter.knownSolution.length === 0) {
    errors.push(`${prefix}: knownSolution is required.`);
  }

  if (!encounter.skillTags || encounter.skillTags.length === 0) {
    errors.push(`${prefix}: skillTags are required.`);
  } else {
    const validSkillTags = new Set(skillDefinitions.map((skill) => skill.id));
    for (const skillTag of encounter.skillTags) {
      if (!validSkillTags.has(skillTag)) {
        errors.push(`${prefix}: unknown skill tag ${skillTag}.`);
      }
    }
  }

  if (!encounter.hintSteps || encounter.hintSteps.length !== 3) {
    errors.push(`${prefix}: hintSteps must contain exactly three scaffolded hints.`);
  } else if (encounter.hintSteps.some((hint) => hint.trim().length === 0)) {
    errors.push(`${prefix}: hintSteps cannot contain empty hints.`);
  }

  if (!encounter.feedback) {
    errors.push(`${prefix}: feedback is required.`);
  } else {
    for (const key of ["goal", "overshoot", "undershoot", "nextStep"] as const) {
      if (!encounter.feedback[key]?.trim()) {
        errors.push(`${prefix}: feedback.${key} is required.`);
      }
    }
  }

  if (encounter.conceptInteraction) {
    const concept = encounter.conceptInteraction;
    const sourceValue = encounter.initialValues[concept.sourceValueIndex];
    const validConceptKinds = new Set(["make-ten", "part-whole", "difference", "two-step", "choice-compare"]);

    if (!validConceptKinds.has(concept.kind)) {
      errors.push(`${prefix}: unsupported conceptInteraction kind ${concept.kind}.`);
    }

    if (concept.kind === "make-ten" && !encounter.skillTags?.includes("make-ten")) {
      errors.push(`${prefix}: make-ten conceptInteraction requires the make-ten skill tag.`);
    }

    if (!concept.title.trim() || !concept.prompt.trim() || !concept.successText.trim()) {
      errors.push(`${prefix}: conceptInteraction text fields are required.`);
    }

    if (sourceValue === undefined) {
      errors.push(`${prefix}: conceptInteraction sourceValueIndex is out of range.`);
    } else {
      const expectedResult = concept.operator === "-" ? sourceValue - concept.operand : sourceValue + concept.operand;
      if (expectedResult !== concept.result) {
        errors.push(`${prefix}: conceptInteraction result must match source ${concept.operator ?? "+"} operand.`);
      }

      if (concept.kind === "make-ten" && concept.result !== 10) {
        errors.push(`${prefix}: make-ten conceptInteraction must result in 10.`);
      }
    }
  }

  errors.push(...validateStandardLinks(`${prefix}/standardLinks`, encounter.standardLinks));

  if (encounter.type === "combo_hit") {
    if (encounter.maxActions !== 2) {
      errors.push(`${prefix}: combo_hit must use maxActions 2.`);
    }

    if (encounter.knownSolution.length !== 2) {
      errors.push(`${prefix}: combo_hit needs exactly two knownSolution steps.`);
    }
  }

  if (encounter.initialValues.some((value) => value < 0)) {
    errors.push(`${prefix}: initialValues cannot contain negative numbers.`);
  }

  if (encounter.targetValue < 0) {
    errors.push(`${prefix}: targetValue cannot be negative.`);
  }

  for (const roleId of encounter.allowedRoleIds) {
    if (!roles[roleId]) {
      errors.push(`${prefix}: allowed role ${roleId} does not exist.`);
    }
  }

  const engine = new BattleEngine(roles);
  let state = engine.createInitialState(encounter);
  const selectableValueIndexes = getSelectableValueIndexes(encounter, state);
  const materialValueIndexes = getMaterialValueIndexes(encounter, state);

  if (selectableValueIndexes.length === 0) {
    errors.push(`${prefix}: at least one selectable value is required.`);
  }

  if ((encounter.selectableValueIndexes ?? []).some((index) => index < 0 || index >= encounter.initialValues.length)) {
    errors.push(`${prefix}: selectableValueIndexes contains an out-of-range index.`);
  }

  if (new Set(encounter.selectableValueIndexes ?? []).size !== (encounter.selectableValueIndexes ?? []).length) {
    errors.push(`${prefix}: selectableValueIndexes cannot contain duplicates.`);
  }

  if (materialValueIndexes.length > 2) {
    errors.push(`${prefix}: no more than two material values are allowed.`);
  }

  if (encounter.knownSolution.length > state.maxActions) {
    errors.push(`${prefix}: knownSolution is longer than maxActions.`);
  }

  if (encounter.type === "combo_hit" && hasOpeningDirectHit(engine, state, roles, encounter)) {
    errors.push(`${prefix}: combo_hit should not have a one-step direct hit from the initial values.`);
  }

  for (const step of encounter.knownSolution) {
    const role = roles[step.roleId];
    const action: BattleAction = {
      roleId: step.roleId,
      sourceValueIndex: step.sourceValueIndex,
      operand: step.operand
    };

    if (!role) {
      errors.push(`${prefix}: solution role ${step.roleId} does not exist.`);
      continue;
    }

    if (!encounter.allowedRoleIds.includes(step.roleId)) {
      errors.push(`${prefix}: solution role ${step.roleId} is not allowed.`);
    }

    if (role.enabledInMvp === false) {
      errors.push(`${prefix}: solution role ${step.roleId} is not enabled in the MVP.`);
    }

    if (!selectableValueIndexes.includes(step.sourceValueIndex)) {
      errors.push(`${prefix}: solution source index ${step.sourceValueIndex} must be selectable.`);
    }

    if (!isOperandAvailable(encounter, step.sourceValueIndex, step.operand, role)) {
      errors.push(`${prefix}: operand ${step.operand} is not available for ${step.roleId}.`);
    }

    const preview = engine.previewAction(state, action);
    if (!preview.isValid) {
      errors.push(`${prefix}: solution step is invalid: ${preview.reason ?? "unknown reason"}.`);
      continue;
    }

    if (preview.result !== step.result) {
      errors.push(`${prefix}: solution step says ${step.result}, engine returns ${preview.result}.`);
    }

    state = engine.applyAction(state, action).state;
  }

  const finalStep = encounter.knownSolution.at(-1);
  if (finalStep && finalStep.result !== encounter.targetValue) {
    errors.push(`${prefix}: final solution result must match targetValue.`);
  }

  if (finalStep && state.status !== "won") {
    errors.push(`${prefix}: knownSolution must finish with a won battle state.`);
  }

  for (const index of selectableValueIndexes) {
    const initialState = engine.createInitialState(encounter);
    if (!canReachTargetFromValue(engine, initialState, roles, encounter, index)) {
      errors.push(`${prefix}: selectable value index ${index} cannot reach targetValue within maxActions.`);
    }
  }

  return errors;
}

function validateStandardLinks(prefix: string, standardLinks?: StandardLinksDefinition): string[] {
  if (!standardLinks) {
    return [];
  }

  const errors: string[] = [];

  if (standardLinks.alignmentDepth !== "game_objective") {
    errors.push(`${prefix}: alignmentDepth must be game_objective.`);
  }

  if (!standardLinks.notProgressEvidence) {
    errors.push(`${prefix}: notProgressEvidence must be true.`);
  }

  if (standardLinks.canonicalObjectiveIds.length === 0) {
    errors.push(`${prefix}: canonicalObjectiveIds cannot be empty.`);
  }

  if (standardLinks.standardOutcomeIds.length === 0) {
    errors.push(`${prefix}: standardOutcomeIds cannot be empty.`);
  }

  if (!standardLinks.playerAction.trim()) {
    errors.push(`${prefix}: playerAction is required.`);
  }

  if (standardLinks.observableEvidence.length === 0 || standardLinks.observableEvidence.some((evidence) => !evidence.trim())) {
    errors.push(`${prefix}: observableEvidence cannot be empty.`);
  }

  return errors;
}

function hasOpeningDirectHit(
  engine: BattleEngine,
  state: ReturnType<BattleEngine["createInitialState"]>,
  roles: Record<string, RoleDefinition>,
  encounter: EncounterDefinition
): boolean {
  return state.currentValues.some((_, index) =>
    getDirectHitOptions(engine, state, roles, encounter.allowedRoleIds, index).length > 0
  );
}

function isOperandAvailable(
  encounter: EncounterDefinition,
  sourceValueIndex: number,
  operand: number,
  role: RoleDefinition
): boolean {
  const roleOperand = role.operandOptions.includes(operand);
  const boardOperand = encounter.initialValues.some(
    (value, index) => index !== sourceValueIndex && value === operand
  );

  return roleOperand || boardOperand;
}
