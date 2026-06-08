import { BattleEngine, type BattleState } from "./BattleEngine";
import { getAvailableActionOptions } from "./actionOptions";
import type { EncounterDefinition, RoleDefinition } from "../content/types";

export function getSelectableValueIndexes(encounter: EncounterDefinition, state: BattleState): number[] {
  const configured = encounter.selectableValueIndexes ?? state.currentValues.map((_, index) => index);
  return [...new Set(configured)].filter((index) => index >= 0 && index < state.currentValues.length);
}

export function getMaterialValueIndexes(encounter: EncounterDefinition, state: BattleState): number[] {
  const selectable = new Set(getSelectableValueIndexes(encounter, state));
  return state.currentValues.map((_, index) => index).filter((index) => !selectable.has(index));
}

export function getReachableValueIndexes(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  encounter: EncounterDefinition
): number[] {
  return state.currentValues
    .map((_, index) => index)
    .filter((index) => canReachTargetFromValue(engine, state, roles, encounter, index));
}

export function canReachTargetFromValue(
  engine: BattleEngine,
  state: BattleState,
  roles: Record<string, RoleDefinition>,
  encounter: EncounterDefinition,
  sourceValueIndex: number
): boolean {
  const stepsRemaining = Math.max(1, state.maxActions - state.actionsUsedInAttempt);
  let frontier: BattleState[] = [state];

  for (let step = 0; step < stepsRemaining; step += 1) {
    const next: BattleState[] = [];

    for (const currentState of frontier) {
      const options = getAvailableActionOptions(
        engine,
        currentState,
        roles,
        encounter.allowedRoleIds,
        sourceValueIndex
      );

      for (const option of options) {
        const result = engine.applyAction(currentState, option.action);
        if (result.preview.isHit) {
          return true;
        }

        if (result.outcome === "setup") {
          next.push(result.state);
        }
      }
    }

    frontier = next;
  }

  return false;
}
