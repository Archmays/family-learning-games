import { BattleEngine } from "../src/game/domain/battle/BattleEngine";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getAvailableActionOptions,
  getAvailableOperandsForSource,
  getOperationOptionsForOperand
} from "../src/game/domain/battle/actionOptions";
import { canReachTargetFromValue, getMaterialValueIndexes, getSelectableValueIndexes } from "../src/game/domain/battle/valueOptions";
import type { EncounterDefinition, LevelsFile, RoleDefinition, RolesFile } from "../src/game/domain/content/types";

const roles: Record<string, RoleDefinition> = {
  add_small: {
    id: "add_small",
    operation: "add",
    operandOptions: [1, 2],
    childLabel: "加法",
    skinSlot: "add_pony",
    enabledInMvp: true
  },
  sub_small: {
    id: "sub_small",
    operation: "subtract",
    operandOptions: [1, 2],
    childLabel: "减法",
    skinSlot: "sub_pony",
    enabledInMvp: true
  }
};

const bakeryEncounter: EncounterDefinition = {
  id: "bakery-01-hit-9",
  type: "precision_hit",
  title: "做出 9",
  initialValues: [7, 2, 4],
  targetValue: 9,
  allowedRoleIds: ["add_small", "sub_small"],
  maxMistakes: 3,
  selectableValueIndexes: [0],
  hintText: "7 再多 2 就是 9。",
  knownSolution: [
    {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 2,
      result: 9,
      explanation: "7 + 2 = 9"
    }
  ]
};

const materialEncounter: EncounterDefinition = {
  id: "material-choice",
  type: "precision_hit",
  title: "做出 14",
  initialValues: [10, 5, 3],
  targetValue: 14,
  allowedRoleIds: ["add_small", "sub_small"],
  maxMistakes: 3,
  selectableValueIndexes: [0],
  hintText: "先选材料，再选加减。",
  knownSolution: [
    {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 5,
      result: 15,
      explanation: "10 + 5 = 15"
    },
    {
      roleId: "sub_small",
      sourceValueIndex: 0,
      operand: 1,
      result: 14,
      explanation: "15 - 1 = 14"
    }
  ]
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as T;
}

describe("action options", () => {
  it("keeps the expanded option list available for reachability checks", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(bakeryEncounter);

    const options = getAvailableActionOptions(engine, state, roles, bakeryEncounter.allowedRoleIds, 0);

    expect(options.map((option) => option.label)).toEqual(["+1", "+2", "+4", "-1", "-2", "-4"]);
    expect(options.filter((option) => option.preview.isHit).map((option) => option.label)).toEqual(["+2"]);
  });

  it("separates one clickable main card from material cards", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(bakeryEncounter);

    expect(getSelectableValueIndexes(bakeryEncounter, state)).toEqual([0]);
    expect(getMaterialValueIndexes(bakeryEncounter, state)).toEqual([1, 2]);
    expect(canReachTargetFromValue(engine, state, roles, bakeryEncounter, 0)).toBe(true);
    expect(getSelectableValueIndexes(bakeryEncounter, state)).not.toContain(1);
    expect(getSelectableValueIndexes(bakeryEncounter, state)).not.toContain(2);
  });

  it("shows operands before expanding add and subtract operations", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(materialEncounter);
    const materialIndexes = getMaterialValueIndexes(materialEncounter, state);

    const operands = getAvailableOperandsForSource(state, roles, materialEncounter.allowedRoleIds, 0, materialIndexes);

    expect(operands.map((operand) => operand.label)).toEqual(["小能量 1", "小能量 2", "材料 5", "材料 3"]);
    expect(operands.map((operand) => operand.label)).not.toContain("+5");
    expect(operands.map((operand) => operand.label)).not.toContain("-5");
  });

  it("expands a selected material into add and subtract operation choices", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(materialEncounter);

    const options = getOperationOptionsForOperand(engine, state, roles, materialEncounter.allowedRoleIds, 0, 5);

    expect(options.map((option) => option.label)).toEqual(["加上 5", "减去 5"]);
    expect(options.map((option) => option.preview.expression)).toEqual(["10 + 5 = 15", "10 - 5 = 5"]);
  });

  it("expands small energy 1 and 2 into normal previews", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(materialEncounter);

    const one = getOperationOptionsForOperand(engine, state, roles, materialEncounter.allowedRoleIds, 0, 1);
    const two = getOperationOptionsForOperand(engine, state, roles, materialEncounter.allowedRoleIds, 0, 2);

    expect(one.map((option) => option.preview.expression)).toEqual(["10 + 1 = 11", "10 - 1 = 9"]);
    expect(two.map((option) => option.preview.expression)).toEqual(["10 + 2 = 12", "10 - 2 = 8"]);
  });

  it("does not show subtraction when it would create a negative result", () => {
    const engine = new BattleEngine(roles);
    const encounter: EncounterDefinition = {
      ...materialEncounter,
      initialValues: [3, 5, 1],
      targetValue: 8
    };
    const state = engine.createInitialState(encounter);

    const options = getOperationOptionsForOperand(engine, state, roles, encounter.allowedRoleIds, 0, 5);

    expect(options.map((option) => option.label)).toEqual(["加上 5"]);
  });

  it("keeps every default encounter on the operand-first flow", () => {
    const rolesFile = readJson<RolesFile>("public/data/roles/roles.json");
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const roleMap = Object.fromEntries(rolesFile.roles.map((role) => [role.id, role]));
    const engine = new BattleEngine(roleMap);

    for (const stage of levelsFile.stages) {
      for (const encounter of stage.encounters) {
        const state = engine.createInitialState(encounter);
        const materialIndexes = getMaterialValueIndexes(encounter, state);
        const selectableIndexes = getSelectableValueIndexes(encounter, state);

        expect(selectableIndexes.length, `${stage.title} / ${encounter.title}`).toBeGreaterThanOrEqual(1);

        for (const index of selectableIndexes) {
          const operands = getAvailableOperandsForSource(state, roleMap, encounter.allowedRoleIds, index, materialIndexes);

          expect(operands.length, `${stage.title} / ${encounter.title}`).toBeGreaterThanOrEqual(2);
          expect(operands.every((operand) => !operand.label.startsWith("+") && !operand.label.startsWith("-"))).toBe(true);
        }

        const solutionStep = encounter.knownSolution[0];
        const solutionOperands = getAvailableOperandsForSource(
          state,
          roleMap,
          encounter.allowedRoleIds,
          solutionStep.sourceValueIndex,
          materialIndexes
        );
        expect(solutionOperands.map((operand) => operand.value)).toContain(solutionStep.operand);
      }
    }
  });
});
