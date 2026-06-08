import { BattleEngine, type BattleAction, type BattleState, type ActionPreview } from "./BattleEngine";
import type { RoleDefinition } from "../content/types";

export interface DirectActionOption {
  action: BattleAction;
  label: string;
  preview: ActionPreview;
  roleId: string;
}

export interface AvailableActionOption {
  action: BattleAction;
  label: string;
  preview: ActionPreview;
  roleId: string;
  operation: RoleDefinition["operation"];
}

export type OperandSource = "energy" | "material";

export interface AvailableOperandOption {
  value: number;
  source: OperandSource;
  label: string;
  valueIndex?: number;
}

export function getAvailableActionOptions(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  allowedRoleIds: string[],
  selectedValueIndex: number
): AvailableActionOption[] {
  const options: AvailableActionOption[] = [];

  for (const roleId of allowedRoleIds) {
    const role = roles[roleId];
    if (!role || role.enabledInMvp === false) {
      continue;
    }

    const operands = getAvailableOperands(state.currentValues, selectedValueIndex, role);
    for (const operand of operands) {
      const action = {
        roleId,
        sourceValueIndex: selectedValueIndex,
        operand
      };
      const preview = engine.previewAction(state, action);

      if (preview.isValid) {
        options.push({
          action,
          label: `${getOperationSymbol(role)}${operand}`,
          preview,
          roleId,
          operation: role.operation
        });
      }
    }
  }

  return options;
}

export function getDirectHitOptions(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  allowedRoleIds: string[],
  selectedValueIndex: number
): DirectActionOption[] {
  return getAvailableActionOptions(engine, state, roles, allowedRoleIds, selectedValueIndex).filter(
    (option) => option.preview.isHit
  );
}

export function getDirectHitValueIndexes(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  allowedRoleIds: string[]
): number[] {
  return state.currentValues
    .map((_, index) => index)
    .filter((index) => getDirectHitOptions(engine, state, roles, allowedRoleIds, index).length > 0);
}

export function getAvailableOperandsForSource(
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  allowedRoleIds: string[],
  selectedValueIndex: number,
  materialValueIndexes: number[]
): AvailableOperandOption[] {
  const materialValues = new Set(
    materialValueIndexes
      .filter((index) => index !== selectedValueIndex)
      .map((index) => state.currentValues[index])
      .filter((value) => Number.isInteger(value) && value > 0)
  );
  const options: AvailableOperandOption[] = [];
  const seenValues = new Set<number>();

  for (const role of getEnabledRoles(roles, allowedRoleIds)) {
    for (const value of role.operandOptions) {
      if (!Number.isInteger(value) || value <= 0 || materialValues.has(value) || seenValues.has(value)) {
        continue;
      }

      seenValues.add(value);
      options.push({
        value,
        source: "energy",
        label: `小能量 ${value}`
      });
    }
  }

  for (const index of materialValueIndexes) {
    if (index === selectedValueIndex) {
      continue;
    }

    const value = state.currentValues[index];
    if (!Number.isInteger(value) || value <= 0 || seenValues.has(value)) {
      continue;
    }

    seenValues.add(value);
    options.push({
      value,
      source: "material",
      valueIndex: index,
      label: `材料 ${value}`
    });
  }

  return options;
}

export function getOperationOptionsForOperand(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  allowedRoleIds: string[],
  selectedValueIndex: number,
  operand: number
): AvailableActionOption[] {
  const options: AvailableActionOption[] = [];

  for (const role of getEnabledRoles(roles, allowedRoleIds)) {
    const action = {
      roleId: role.id,
      sourceValueIndex: selectedValueIndex,
      operand
    };
    const preview = engine.previewAction(state, action);

    if (preview.isValid) {
      options.push({
        action,
        label: `${getOperationLabel(role)} ${operand}`,
        preview,
        roleId: role.id,
        operation: role.operation
      });
    }
  }

  return options;
}

function getAvailableOperands(values: number[], selectedValueIndex: number, role: RoleDefinition): number[] {
  const boardOperands = values.filter((value, index) => index !== selectedValueIndex && value > 0);
  return [...new Set([...role.operandOptions, ...boardOperands])];
}

function getEnabledRoles(roles: Record<string, RoleDefinition>, allowedRoleIds: string[]): RoleDefinition[] {
  return allowedRoleIds
    .map((roleId) => roles[roleId])
    .filter((role): role is RoleDefinition => Boolean(role) && role.enabledInMvp !== false);
}

function getOperationSymbol(role: RoleDefinition): string {
  if (role.operation === "add") {
    return "+";
  }

  if (role.operation === "subtract") {
    return "-";
  }

  return role.operation;
}

function getOperationLabel(role: RoleDefinition): string {
  if (role.operation === "add") {
    return "加上";
  }

  if (role.operation === "subtract") {
    return "减去";
  }

  return getOperationSymbol(role);
}
