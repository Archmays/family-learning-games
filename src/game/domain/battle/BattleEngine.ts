import type { EncounterDefinition, RoleDefinition } from "../content/types";

export interface BattleAction {
  roleId: string;
  sourceValueIndex: number;
  operand: number;
}

export type BattleStatus = "active" | "won" | "lost";
export type ApplyActionOutcome = "invalid" | "setup" | "hit" | "miss" | "lost";

export interface BattleHistoryEntry {
  action: BattleAction;
  expression: string;
  result: number;
  hitTarget: boolean;
}

export interface BattleState {
  encounterId: string;
  encounterType: EncounterDefinition["type"];
  targetValue: number;
  initialValues: number[];
  currentValues: number[];
  mistakes: number;
  maxMistakes: number;
  actionsUsedInAttempt: number;
  maxActions: number;
  status: BattleStatus;
  history: BattleHistoryEntry[];
}

export interface ActionPreview {
  isValid: boolean;
  expression: string;
  result: number | null;
  isHit: boolean;
  reason?: string;
}

export interface ApplyActionResult {
  state: BattleState;
  preview: ActionPreview;
  didConsumeMistake: boolean;
  didAdvanceCombo: boolean;
  outcome: ApplyActionOutcome;
}

const symbolsByOperation: Record<RoleDefinition["operation"], string> = {
  add: "+",
  subtract: "-",
  multiply: "x",
  divide: "/"
};

export class BattleEngine {
  private readonly roles: Record<string, RoleDefinition>;

  constructor(roles: Record<string, RoleDefinition>) {
    this.roles = roles;
  }

  createInitialState(encounter: EncounterDefinition): BattleState {
    return {
      encounterId: encounter.id,
      encounterType: encounter.type,
      targetValue: encounter.targetValue,
      initialValues: [...encounter.initialValues],
      currentValues: [...encounter.initialValues],
      mistakes: 0,
      maxMistakes: encounter.maxMistakes,
      actionsUsedInAttempt: 0,
      maxActions: getMaxActions(encounter),
      status: "active",
      history: []
    };
  }

  previewAction(state: BattleState, action: BattleAction): ActionPreview {
    if (state.status !== "active") {
      return this.invalidPreview(action, "本场已经结束。");
    }

    const role = this.roles[action.roleId];
    if (!role) {
      return this.invalidPreview(action, "这个角色还没有配置。");
    }

    const sourceValue = state.currentValues[action.sourceValueIndex];
    if (sourceValue === undefined) {
      return this.invalidPreview(action, "先选择一个数字。");
    }

    if (!Number.isInteger(action.operand) || action.operand <= 0) {
      return this.invalidPreview(action, "请选择一个正数。");
    }

    const result = this.calculate(role, sourceValue, action.operand);
    const expression = `${sourceValue} ${symbolsByOperation[role.operation]} ${action.operand} = ${result}`;

    if (!Number.isInteger(result)) {
      return {
        isValid: false,
        expression,
        result,
        isHit: false,
        reason: "这一步不能平均分。"
      };
    }

    if (result < 0) {
      return {
        isValid: false,
        expression,
        result,
        isHit: false,
        reason: "数字不能变成负数。"
      };
    }

    return {
      isValid: true,
      expression,
      result,
      isHit: result === state.targetValue
    };
  }

  applyAction(state: BattleState, action: BattleAction): ApplyActionResult {
    const preview = this.previewAction(state, action);

    if (!preview.isValid || preview.result === null) {
      return {
        state,
        preview,
        didConsumeMistake: false,
        didAdvanceCombo: false,
        outcome: "invalid"
      };
    }

    const nextValues = [...state.currentValues];
    nextValues[action.sourceValueIndex] = preview.result;
    const nextActionsUsed = state.actionsUsedInAttempt + 1;
    const nextHistory = [
      ...state.history,
      {
        action,
        expression: preview.expression,
        result: preview.result,
        hitTarget: preview.isHit
      }
    ];

    if (preview.isHit) {
      return {
        state: {
          ...state,
          currentValues: nextValues,
          actionsUsedInAttempt: nextActionsUsed,
          status: "won",
          history: nextHistory
        },
        preview,
        didConsumeMistake: false,
        didAdvanceCombo: false,
        outcome: "hit"
      };
    }

    if (state.encounterType === "combo_hit" && nextActionsUsed < state.maxActions) {
      return {
        state: {
          ...state,
          currentValues: nextValues,
          actionsUsedInAttempt: nextActionsUsed,
          history: nextHistory
        },
        preview,
        didConsumeMistake: false,
        didAdvanceCombo: true,
        outcome: "setup"
      };
    }

    const mistakes = state.mistakes + 1;
    const status = mistakes >= state.maxMistakes ? "lost" : "active";

    return {
      state: {
        ...state,
        currentValues: [...state.initialValues],
        mistakes,
        actionsUsedInAttempt: 0,
        status,
        history: nextHistory
      },
      preview,
      didConsumeMistake: true,
      didAdvanceCombo: false,
      outcome: status === "lost" ? "lost" : "miss"
    };
  }

  private calculate(role: RoleDefinition, sourceValue: number, operand: number): number {
    switch (role.operation) {
      case "add":
        return sourceValue + operand;
      case "subtract":
        return sourceValue - operand;
      case "multiply":
        return sourceValue * operand;
      case "divide":
        return sourceValue / operand;
    }
  }

  private invalidPreview(action: BattleAction, reason: string): ActionPreview {
    return {
      isValid: false,
      expression: `${action.sourceValueIndex} ? ${action.operand}`,
      result: null,
      isHit: false,
      reason
    };
  }
}

function getMaxActions(encounter: EncounterDefinition): number {
  if (encounter.type === "combo_hit") {
    return encounter.maxActions ?? 2;
  }

  return 1;
}
