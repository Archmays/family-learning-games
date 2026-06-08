import type { ActionPreview } from "../battle/BattleEngine";
import type { EncounterDefinition } from "../content/types";

export interface ThreePartFeedback {
  goal: string;
  gap: string;
  nextStep: string;
}

export function getThreePartFeedback(encounter: EncounterDefinition, preview: ActionPreview): ThreePartFeedback {
  const goal = encounter.feedback?.goal ?? `需要做出 ${encounter.targetValue}。`;

  if (preview.result === null) {
    return {
      goal,
      gap: preview.reason ?? "这一步暂时不能用。",
      nextStep: encounter.feedback?.nextStep ?? "下一步先换一张材料或运算。"
    };
  }

  const distance = Math.abs(preview.result - encounter.targetValue);
  const directionText =
    preview.result > encounter.targetValue
      ? (encounter.feedback?.overshoot ?? "这一步算得比目标大。")
      : (encounter.feedback?.undershoot ?? "这一步算得比目标小。");
  const gap =
    distance === 0
      ? "差距：已经对上了。"
      : preview.result > encounter.targetValue
        ? `${directionText} 差距是 ${distance}。`
        : `${directionText} 差距是 ${distance}。`;
  const nextStep =
    encounter.type === "combo_hit" && !preview.isHit
      ? (encounter.feedback?.comboMiss ?? encounter.feedback?.nextStep ?? "下一步继续看当前数字和目标的差距。")
      : (encounter.feedback?.nextStep ?? directionText);

  return {
    goal,
    gap,
    nextStep
  };
}

export function formatThreePartFeedback(feedback: ThreePartFeedback): string {
  const nextStep = feedback.nextStep.startsWith("下一步") ? feedback.nextStep : `下一步：${feedback.nextStep}`;
  return `${feedback.goal} ${feedback.gap} ${nextStep}`;
}
