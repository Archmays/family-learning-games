import { BattleEngine, type BattleAction } from "../src/game/domain/battle/BattleEngine";
import type { EncounterDefinition, RoleDefinition } from "../src/game/domain/content/types";

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

function createEncounter(targetValue = 7): EncounterDefinition {
  return {
    id: "test-encounter",
    type: "precision_hit",
    title: "测试",
    initialValues: [4, 3, 2],
    targetValue,
    allowedRoleIds: ["add_small", "sub_small"],
    maxMistakes: 3,
    hintText: "测试提示",
    knownSolution: [
      {
        roleId: "add_small",
        sourceValueIndex: 0,
        operand: 3,
        result: 7,
        explanation: "4 + 3 = 7"
      }
    ]
  };
}

function createComboEncounter(targetValue = 10): EncounterDefinition {
  return {
    id: "test-combo-encounter",
    type: "combo_hit",
    title: "两步测试",
    initialValues: [5, 2, 3],
    targetValue,
    allowedRoleIds: ["add_small", "sub_small"],
    maxMistakes: 3,
    maxActions: 2,
    comboText: "用两步做出目标。",
    hintText: "先做铺垫，再命中。",
    knownSolution: [
      {
        roleId: "add_small",
        sourceValueIndex: 0,
        operand: 2,
        result: 7,
        explanation: "5 + 2 = 7"
      },
      {
        roleId: "add_small",
        sourceValueIndex: 0,
        operand: 3,
        result: 10,
        explanation: "7 + 3 = 10"
      }
    ]
  };
}

describe("BattleEngine", () => {
  it("uses 4 + 3 = 7 to hit the target", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createEncounter());
    const action: BattleAction = {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 3
    };

    const result = engine.applyAction(state, action);

    expect(result.preview.expression).toBe("4 + 3 = 7");
    expect(result.preview.isHit).toBe(true);
    expect(result.state.status).toBe("won");
  });

  it("previews 5 - 2 = 3", () => {
    const engine = new BattleEngine(roles);
    const encounter = createEncounter(3);
    encounter.initialValues = [5, 2, 1];
    const state = engine.createInitialState(encounter);

    const preview = engine.previewAction(state, {
      roleId: "sub_small",
      sourceValueIndex: 0,
      operand: 2
    });

    expect(preview.isValid).toBe(true);
    expect(preview.expression).toBe("5 - 2 = 3");
    expect(preview.result).toBe(3);
  });

  it("rejects subtraction that would create a negative result", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createEncounter());

    const preview = engine.previewAction(state, {
      roleId: "sub_small",
      sourceValueIndex: 2,
      operand: 5
    });

    expect(preview.isValid).toBe(false);
    expect(preview.reason).toContain("负数");
  });

  it("consumes a mistake when a valid result misses the target", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createEncounter(9));

    const result = engine.applyAction(state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 1
    });

    expect(result.didConsumeMistake).toBe(true);
    expect(result.state.mistakes).toBe(1);
    expect(result.state.status).toBe("active");
  });

  it("does not consume a mistake while previewing a miss", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createEncounter(9));

    const preview = engine.previewAction(state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 1
    });

    expect(preview.isValid).toBe(true);
    expect(preview.isHit).toBe(false);
    expect(state.mistakes).toBe(0);
    expect(state.status).toBe("active");
  });

  it("wins when the result reaches the target value", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createEncounter(5));

    const result = engine.applyAction(state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 1
    });

    expect(result.state.status).toBe("won");
  });

  it("keeps a combo setup result without consuming a mistake", () => {
    const engine = new BattleEngine(roles);
    const state = engine.createInitialState(createComboEncounter());

    const result = engine.applyAction(state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 2
    });

    expect(result.outcome).toBe("setup");
    expect(result.didAdvanceCombo).toBe(true);
    expect(result.didConsumeMistake).toBe(false);
    expect(result.state.currentValues).toEqual([7, 2, 3]);
    expect(result.state.actionsUsedInAttempt).toBe(1);
    expect(result.state.mistakes).toBe(0);
  });

  it("wins a combo on the second action and records both steps", () => {
    const engine = new BattleEngine(roles);
    const first = engine.applyAction(engine.createInitialState(createComboEncounter()), {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 2
    });

    const second = engine.applyAction(first.state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 3
    });

    expect(second.outcome).toBe("hit");
    expect(second.state.status).toBe("won");
    expect(second.state.history.map((entry) => entry.expression)).toEqual(["5 + 2 = 7", "7 + 3 = 10"]);
  });

  it("spends a mistake and resets values when a combo misses on the last action", () => {
    const engine = new BattleEngine(roles);
    const first = engine.applyAction(engine.createInitialState(createComboEncounter()), {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 2
    });

    const second = engine.applyAction(first.state, {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 1
    });

    expect(second.outcome).toBe("miss");
    expect(second.didConsumeMistake).toBe(true);
    expect(second.state.currentValues).toEqual([5, 2, 3]);
    expect(second.state.actionsUsedInAttempt).toBe(0);
    expect(second.state.mistakes).toBe(1);
    expect(second.state.status).toBe("active");
  });
});
