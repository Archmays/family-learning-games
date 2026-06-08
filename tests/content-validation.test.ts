import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BattleEngine } from "../src/game/domain/battle/BattleEngine";
import { getDirectHitOptions } from "../src/game/domain/battle/actionOptions";
import { canReachTargetFromValue, getMaterialValueIndexes, getSelectableValueIndexes } from "../src/game/domain/battle/valueOptions";
import { buildRoleMap, validateStages } from "../src/game/domain/math/contentValidation";
import type { LevelsFile, RolesFile } from "../src/game/domain/content/types";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(path), "utf8")) as T;
}

describe("MVP content", () => {
  const requiredSceneCopyKeys = [
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
  ] as const;

  it("has 20-25 hand-written solvable encounters", () => {
    const rolesFile = readJson<RolesFile>("public/data/roles/roles.json");
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const encounters = levelsFile.stages.flatMap((stage) => stage.encounters);

    expect(encounters.length).toBeGreaterThanOrEqual(20);
    expect(encounters.length).toBeLessThanOrEqual(25);

    const result = validateStages(levelsFile.stages, buildRoleMap(rolesFile.roles));
    expect(result.errors).toEqual([]);
    expect(result.isValid).toBe(true);
  });

  it("gives every stage a complete scene copy pack", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");

    for (const stage of levelsFile.stages) {
      expect(stage.sceneCopy, stage.id).toBeTruthy();
      for (const key of requiredSceneCopyKeys) {
        expect(stage.sceneCopy?.[key].trim(), `${stage.id} sceneCopy.${key}`).toBeTruthy();
      }
    }
  });

  it("keeps standard alignment at game-objective depth and out of progress evidence", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const allLinks = [
      ...levelsFile.stages.map((stage) => stage.standardLinks),
      ...levelsFile.stages.flatMap((stage) => stage.encounters.map((encounter) => encounter.standardLinks))
    ];

    for (const links of allLinks) {
      expect(links?.alignmentDepth).toBe("game_objective");
      expect(links?.notProgressEvidence).toBe(true);
      expect(links?.canonicalObjectiveIds.length).toBeGreaterThan(0);
      expect(links?.standardOutcomeIds.length).toBeGreaterThan(0);
      expect(links?.playerAction.trim()).toBeTruthy();
      expect(links?.observableEvidence.length).toBeGreaterThan(0);
    }
  });

  it("keeps child-facing math-lab copy in scene language", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const forbidden = ["目标是", "命中目标", "主牌", "材料牌", "救援", "释放", "铺垫成功", "战斗", "连招", "双主牌"];
    const childFacingText = levelsFile.stages.flatMap((stage) => [
      stage.title,
      stage.chapter ?? "",
      stage.skillFocus ?? "",
      stage.description,
      ...stage.encounters.flatMap((encounter) => [
        encounter.title,
        encounter.comboText ?? "",
        encounter.hintText,
        ...(encounter.hintSteps ?? []),
        encounter.feedback?.goal ?? "",
        encounter.feedback?.overshoot ?? "",
        encounter.feedback?.undershoot ?? "",
        encounter.feedback?.nextStep ?? "",
        encounter.feedback?.comboMiss ?? "",
        encounter.conceptInteraction?.title ?? "",
        encounter.conceptInteraction?.prompt ?? "",
        encounter.conceptInteraction?.successText ?? ""
      ])
    ]);

    for (const text of childFacingText) {
      for (const word of forbidden) {
        expect(text, `${word} in ${text}`).not.toContain(word);
      }
    }
  });

  it("marks concept interactions with valid scaffold data", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const conceptEncounters = levelsFile.stages
      .flatMap((stage) => stage.encounters)
      .filter((encounter) => encounter.conceptInteraction);

    expect(conceptEncounters.length).toBe(levelsFile.stages.flatMap((stage) => stage.encounters).length);
    expect(new Set(conceptEncounters.map((encounter) => encounter.conceptInteraction?.kind))).toEqual(
      new Set(["part-whole", "difference", "make-ten", "two-step", "choice-compare"])
    );

    for (const encounter of conceptEncounters) {
      const concept = encounter.conceptInteraction;
      expect(concept?.title.trim()).toBeTruthy();
      expect(concept?.prompt.trim()).toBeTruthy();
      expect(concept?.successText.trim()).toBeTruthy();
      expect(concept?.sourceValueIndex).toBeGreaterThanOrEqual(0);
      expect(concept?.operand).toBeGreaterThan(0);
      if (concept?.kind === "make-ten") {
        expect(encounter.skillTags).toContain("make-ten");
        expect(concept.result).toBe(10);
      }
    }
  });

  it("does not enable multiplication or division in MVP levels", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const roleIds = new Set(levelsFile.stages.flatMap((stage) => stage.encounters.flatMap((encounter) => encounter.allowedRoleIds)));

    expect(roleIds.has("mul_double")).toBe(false);
    expect(roleIds.has("div_split")).toBe(false);
  });

  it("does not include negative values in level data", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");

    for (const encounter of levelsFile.stages.flatMap((stage) => stage.encounters)) {
      expect(encounter.targetValue).toBeGreaterThanOrEqual(0);
      expect(encounter.initialValues.every((value) => value >= 0)).toBe(true);
    }
  });

  it("uses combo_hit for the later difficulty curve", () => {
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const laterEncounters = levelsFile.stages.slice(2).flatMap((stage) => stage.encounters);

    expect(laterEncounters.filter((encounter) => encounter.type === "combo_hit").length).toBeGreaterThanOrEqual(5);
  });

  it("does not give combo_hit encounters a one-step opening answer", () => {
    const rolesFile = readJson<RolesFile>("public/data/roles/roles.json");
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const roles = buildRoleMap(rolesFile.roles);
    const engine = new BattleEngine(roles);

    for (const encounter of levelsFile.stages.flatMap((stage) => stage.encounters)) {
      if (encounter.type !== "combo_hit") {
        continue;
      }

      const state = engine.createInitialState(encounter);
      const directHits = state.currentValues.flatMap((_, index) =>
        getDirectHitOptions(engine, state, roles, encounter.allowedRoleIds, index)
      );

      expect(directHits, encounter.id).toEqual([]);
    }
  });

  it("does not include clickable dead-end value cards", () => {
    const rolesFile = readJson<RolesFile>("public/data/roles/roles.json");
    const levelsFile = readJson<LevelsFile>("public/data/levels/add-sub-mvp.json");
    const roles = buildRoleMap(rolesFile.roles);
    const engine = new BattleEngine(roles);

    for (const encounter of levelsFile.stages.flatMap((stage) => stage.encounters)) {
      const state = engine.createInitialState(encounter);
      const selectableIndexes = getSelectableValueIndexes(encounter, state);
      const materialIndexes = getMaterialValueIndexes(encounter, state);

      expect(selectableIndexes.length, encounter.id).toBeGreaterThanOrEqual(1);
      expect(materialIndexes.length, encounter.id).toBeLessThanOrEqual(2);

      for (const index of selectableIndexes) {
        expect(canReachTargetFromValue(engine, state, roles, encounter, index), `${encounter.id} index ${index}`).toBe(
          true
        );
      }
    }
  });
});
