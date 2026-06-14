import { readFileSync } from "node:fs";
import {
  ACTION_PATH_ROUND_SIZE,
  actionPathGame,
  actionScenes,
  getActionPathCompletionSummary,
  getActionPathFeedback,
  pickActionPathRound
} from "../games/action-path";
import {
  ECOLOGY_ROUND_SIZE,
  ecologyEvidenceGame,
  ecologyScenes,
  getEcologyCompletionSummary,
  getEcologyEvidenceFeedback,
  pickEcologyRound
} from "../games/ecology-evidence";
import {
  ELAPSED_CHALLENGE_ROUND_SIZE,
  SCHEDULE_TASK_ROUND_SIZE,
  elapsedChallenges,
  getElapsedTimeBreakdown,
  getTimeSchedulerCompletionSummary,
  pickElapsedChallengeRound,
  pickScheduleTaskRound,
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
  it("expands the three content banks to 50x their previous size", () => {
    expect(actionScenes).toHaveLength(500);
    expect(ecologyScenes).toHaveLength(400);
    expect(scheduleTasks).toHaveLength(300);
    expect(elapsedChallenges).toHaveLength(150);
  });

  it("keeps generated content ids unique", () => {
    expectUniqueIds(actionScenes);
    expectUniqueIds(ecologyScenes);
    expectUniqueIds(scheduleTasks);
    expectUniqueIds(elapsedChallenges);
  });

  it("samples short varied rounds from the larger content banks", () => {
    const firstActionRound = pickActionPathRound(() => 0);
    const secondActionRound = pickActionPathRound(() => 0.99);
    const firstEcologyRound = pickEcologyRound(() => 0);
    const secondEcologyRound = pickEcologyRound(() => 0.99);
    const firstScheduleRound = pickScheduleTaskRound(() => 0);
    const secondScheduleRound = pickScheduleTaskRound(() => 0.99);
    const firstElapsedRound = pickElapsedChallengeRound(() => 0);
    const secondElapsedRound = pickElapsedChallengeRound(() => 0.99);

    expect(firstActionRound).toHaveLength(ACTION_PATH_ROUND_SIZE);
    expect(firstEcologyRound).toHaveLength(ECOLOGY_ROUND_SIZE);
    expect(firstScheduleRound).toHaveLength(SCHEDULE_TASK_ROUND_SIZE);
    expect(firstElapsedRound).toHaveLength(ELAPSED_CHALLENGE_ROUND_SIZE);

    expectUniqueIds(firstActionRound);
    expectUniqueIds(firstEcologyRound);
    expectUniqueIds(firstScheduleRound);
    expectUniqueIds(firstElapsedRound);

    expect(firstActionRound.map((scene) => scene.id).join("|")).not.toBe(secondActionRound.map((scene) => scene.id).join("|"));
    expect(firstEcologyRound.map((scene) => scene.id).join("|")).not.toBe(secondEcologyRound.map((scene) => scene.id).join("|"));
    expect(firstScheduleRound.map((task) => task.id).join("|")).not.toBe(secondScheduleRound.map((task) => task.id).join("|"));
    expect(firstElapsedRound.map((challenge) => challenge.id).join("|")).not.toBe(secondElapsedRound.map((challenge) => challenge.id).join("|"));
  });

  it("marks the three upgraded learning games as playable", () => {
    expect(ecologyEvidenceGame.status).toBe("可玩");
    expect(actionPathGame.status).toBe("可玩");
    expect(timeSchedulerGame.status).toBe("可玩");
  });

  it("provides completion summaries for a full round restart flow", () => {
    expect(getEcologyCompletionSummary(6, ECOLOGY_ROUND_SIZE)).toContain(`完成 ${ECOLOGY_ROUND_SIZE}`);
    expect(getEcologyCompletionSummary(6, ECOLOGY_ROUND_SIZE)).toContain("6");
    expect(getEcologyCompletionSummary(6, ECOLOGY_ROUND_SIZE)).toContain("重新开始");

    expect(getActionPathCompletionSummary(8, ACTION_PATH_ROUND_SIZE)).toContain(`完成 ${ACTION_PATH_ROUND_SIZE}`);
    expect(getActionPathCompletionSummary(8, ACTION_PATH_ROUND_SIZE)).toContain("8");
    expect(getActionPathCompletionSummary(8, ACTION_PATH_ROUND_SIZE)).toContain("重新开始");

    const totalTimeTasks = SCHEDULE_TASK_ROUND_SIZE + ELAPSED_CHALLENGE_ROUND_SIZE;
    expect(getTimeSchedulerCompletionSummary(7, SCHEDULE_TASK_ROUND_SIZE, ELAPSED_CHALLENGE_ROUND_SIZE)).toContain(
      `完成 ${SCHEDULE_TASK_ROUND_SIZE}`
    );
    expect(getTimeSchedulerCompletionSummary(7, SCHEDULE_TASK_ROUND_SIZE, ELAPSED_CHALLENGE_ROUND_SIZE)).toContain(
      `${ELAPSED_CHALLENGE_ROUND_SIZE}`
    );
    expect(getTimeSchedulerCompletionSummary(7, SCHEDULE_TASK_ROUND_SIZE, ELAPSED_CHALLENGE_ROUND_SIZE)).toContain(`${totalTimeTasks}`);
    expect(getTimeSchedulerCompletionSummary(7, SCHEDULE_TASK_ROUND_SIZE, ELAPSED_CHALLENGE_ROUND_SIZE)).toContain("重新开始");
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

  it("keeps every multiple-choice item answerable", () => {
    expect(actionScenes.every((scene) => ["stop", "help", "no", "turn"].includes(scene.correctWord))).toBe(true);
    expect(ecologyScenes.every((scene) => scene.choices.some((choice) => choice.id === scene.correctId))).toBe(true);
    expect(scheduleTasks.every((task) => timeSlotIds.has(task.correctSlot))).toBe(true);

    for (const challenge of elapsedChallenges) {
      const correct = getElapsedTimeBreakdown(challenge.start, challenge.end);
      const matchingChoices = challenge.choices.filter((choice) => choice.hours === correct.hours && choice.minutes === correct.minutes);
      expect(matchingChoices, challenge.id).toHaveLength(1);
    }
  });
});

const timeSlotIds = new Set(["before-leaving", "morning-reading", "before-lunch", "after-lunch", "after-dinner", "before-sleep"]);

function expectUniqueIds(items: readonly { id: string }[]): void {
  expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
}
