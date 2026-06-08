import type { EncounterDefinition } from "../content/types";

export function getHintForLevel(encounter: EncounterDefinition, level: number, actionsUsedInAttempt = 0): string {
  if (encounter.hintSteps?.length === 3) {
    return encounter.hintSteps[Math.min(2, Math.max(0, level - 1))];
  }

  const stepIndex = Math.min(actionsUsedInAttempt, Math.max(0, encounter.knownSolution.length - 1));
  const currentStep = encounter.knownSolution[stepIndex];

  if (!currentStep) {
    return encounter.hintText;
  }

  if (level <= 1) {
    const stepLabel = encounter.type === "combo_hit" ? `第 ${stepIndex + 1} 步` : "先";
    return `${stepLabel}看看第 ${currentStep.sourceValueIndex + 1} 个数字。`;
  }

  if (level === 2) {
    return stepIndex > 0 ? `接着想：${currentStep.explanation.replace(" = ", " 会变成 ")}` : encounter.hintText;
  }

  return `半完成示例：${currentStep.explanation}`;
}
