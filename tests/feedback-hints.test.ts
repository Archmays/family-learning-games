import { getThreePartFeedback, formatThreePartFeedback } from "../src/game/domain/math/feedback";
import { getHintForLevel } from "../src/game/domain/math/hints";
import type { ActionPreview } from "../src/game/domain/battle/BattleEngine";
import type { EncounterDefinition } from "../src/game/domain/content/types";

const encounter: EncounterDefinition = {
  id: "feedback-test",
  type: "precision_hit",
  title: "调出 10 份奶油",
  skillTags: ["make-ten"],
  initialValues: [8, 2, 5],
  targetValue: 10,
  allowedRoleIds: ["add_small", "sub_small"],
  maxMistakes: 3,
  hintText: "想一想哪个数字离 10 最近。",
  hintSteps: ["看配方数 10。", "8 还差 2。", "完整示范：8 + 2 = 10。"],
  feedback: {
    goal: "托盘要调到 10 份。",
    overshoot: "配料放多了，超过 10 份。",
    undershoot: "托盘还没到 10 份。",
    nextStep: "先想 8 的好朋友是谁。"
  },
  knownSolution: [
    {
      roleId: "add_small",
      sourceValueIndex: 0,
      operand: 2,
      result: 10,
      explanation: "8 + 2 = 10"
    }
  ]
};

describe("feedback and hints", () => {
  it("uses the three authored hint steps", () => {
    expect(getHintForLevel(encounter, 1)).toBe("看配方数 10。");
    expect(getHintForLevel(encounter, 2)).toBe("8 还差 2。");
    expect(getHintForLevel(encounter, 3)).toBe("完整示范：8 + 2 = 10。");
  });

  it("formats undershoot feedback as goal, gap, and next step", () => {
    const preview: ActionPreview = {
      isValid: true,
      expression: "8 + 1 = 9",
      result: 9,
      isHit: false
    };

    const feedback = formatThreePartFeedback(getThreePartFeedback(encounter, preview));

    expect(feedback).toContain("托盘要调到 10 份。");
    expect(feedback).toContain("托盘还没到 10 份。 差距是 1");
    expect(feedback).toContain("下一步：先想 8 的好朋友是谁。");
  });
});
