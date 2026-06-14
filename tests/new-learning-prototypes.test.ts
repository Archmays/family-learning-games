import { readFileSync } from "node:fs";
import { actionPathGame, actionScenes, getActionPathCompletionSummary, getActionPathFeedback } from "../games/action-path";
import { ecologyEvidenceGame, ecologyScenes, getEcologyCompletionSummary, getEcologyEvidenceFeedback } from "../games/ecology-evidence";
import {
  elapsedChallenges,
  getElapsedTimeBreakdown,
  getTimeSchedulerCompletionSummary,
  scheduleTasks,
  timeSchedulerGame
} from "../games/time-scheduler";

const ecologyIcons = ["sun", "grass", "bug", "bird", "leaf", "microbe", "soil", "water", "wood"] as const;
const actionIcons = [
  "traffic-light",
  "stop-hand",
  "helper-adult",
  "child",
  "candy",
  "hot-cup",
  "queue",
  "toy",
  "door",
  "turn-arrow"
] as const;
const timeIcons = ["clock", "backpack", "sentence-card", "wash-hands", "gamepad", "desk", "sleep", "time-line"] as const;

describe("new family learning prototypes", () => {
  it("has enough content for short repeatable home sessions", () => {
    expect(ecologyScenes.length).toBeGreaterThanOrEqual(8);
    expect(actionScenes.length).toBeGreaterThanOrEqual(10);
    expect(scheduleTasks.length).toBeGreaterThanOrEqual(6);
    expect(elapsedChallenges.length).toBeGreaterThanOrEqual(3);
  });

  it("marks the three upgraded learning games as playable", () => {
    expect(ecologyEvidenceGame.status).toBe("可玩");
    expect(actionPathGame.status).toBe("可玩");
    expect(timeSchedulerGame.status).toBe("可玩");
  });

  it("provides completion summaries for a full round restart flow", () => {
    expect(getEcologyCompletionSummary(6)).toContain(`完成 ${ecologyScenes.length}`);
    expect(getEcologyCompletionSummary(6)).toContain("6");
    expect(getEcologyCompletionSummary(6)).toContain("重新开始");

    expect(getActionPathCompletionSummary(8)).toContain(`完成 ${actionScenes.length}`);
    expect(getActionPathCompletionSummary(8)).toContain("8");
    expect(getActionPathCompletionSummary(8)).toContain("重新开始");

    const totalTimeTasks = scheduleTasks.length + elapsedChallenges.length;
    expect(getTimeSchedulerCompletionSummary(7)).toContain(`完成 ${scheduleTasks.length}`);
    expect(getTimeSchedulerCompletionSummary(7)).toContain(`${elapsedChallenges.length}`);
    expect(getTimeSchedulerCompletionSummary(7)).toContain(`${totalTimeTasks}`);
    expect(getTimeSchedulerCompletionSummary(7)).toContain("重新开始");
  });

  it("uses structured visual boards instead of one-line emoji pictures", () => {
    expect(ecologyScenes.every((scene) => scene.visual.tokens.length >= 3)).toBe(true);
    expect(actionScenes.every((scene) => scene.visual.tokens.length >= 2)).toBe(true);
    expect(scheduleTasks.every((task) => task.visual.tokens.length >= 2)).toBe(true);
    expect(elapsedChallenges.every((challenge) => challenge.visual.segments.length >= 2)).toBe(true);

    expect(readFileSync("games/ecology-evidence/index.ts", "utf8")).not.toContain("picture:");
    expect(readFileSync("games/action-path/index.ts", "utf8")).not.toContain("picture:");
    expect(readFileSync("games/time-scheduler/index.ts", "utf8")).not.toContain("picture:");
  });

  it("uses explicit level-one icon data for real inline illustrations", () => {
    const ecologyIconSet = new Set(ecologyScenes.flatMap((scene) => scene.visual.tokens.map((token) => token.icon)));
    const actionIconSet = new Set(actionScenes.flatMap((scene) => scene.visual.tokens.map((token) => token.icon)));
    const timeIconSet = new Set([
      ...scheduleTasks.flatMap((task) => task.visual.tokens.map((token) => token.icon)),
      ...elapsedChallenges.map((challenge) => challenge.visual.icon)
    ]);

    expect([...ecologyIconSet].every((icon) => ecologyIcons.includes(icon as (typeof ecologyIcons)[number]))).toBe(true);
    expect([...actionIconSet].every((icon) => actionIcons.includes(icon as (typeof actionIcons)[number]))).toBe(true);
    expect([...timeIconSet].every((icon) => timeIcons.includes(icon as (typeof timeIcons)[number]))).toBe(true);

    expect([...ecologyIconSet]).toEqual(expect.arrayContaining(["sun", "grass", "bug", "bird"]));
    expect([...actionIconSet]).toEqual(expect.arrayContaining(["traffic-light", "stop-hand", "helper-adult"]));
    expect([...timeIconSet]).toEqual(expect.arrayContaining(["clock", "backpack", "time-line"]));
  });

  it("separates eaten-by arrows from energy-source arrows", () => {
    expect(getEcologyEvidenceFeedback("energy", "sun")).toContain("能量来自太阳");
    expect(getEcologyEvidenceFeedback("eaten", "sun")).toContain("太阳不是被吃掉");
  });

  it("keeps action-word feedback tied to concrete scenes", () => {
    expect(getActionPathFeedback("stop", "red-light")).toContain("红灯");
    expect(getActionPathFeedback("help", "lost")).toContain("help");
  });

  it("breaks elapsed time into hour and minute changes", () => {
    expect(getElapsedTimeBreakdown("08:40", "10:10")).toEqual({
      hours: 1,
      minutes: 30,
      totalMinutes: 90
    });
  });
});
