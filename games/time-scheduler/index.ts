import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type TimeIcon = "clock" | "backpack" | "sentence-card" | "wash-hands" | "gamepad" | "desk" | "sleep" | "time-line";

interface TimeToken {
  icon: TimeIcon;
  text: string;
  label: string;
  tone: "task" | "clock" | "home" | "rest";
}

interface TaskVisual {
  tokens: TimeToken[];
  note: string;
}

interface ScheduleTask {
  id: string;
  title: string;
  prompt: string;
  correctSlot: string;
  reason: string;
  visual: TaskVisual;
}

interface TimeSlot {
  id: string;
  label: string;
}

interface ElapsedChoice {
  id: string;
  label: string;
  hours: number;
  minutes: number;
}

interface ElapsedChallenge {
  id: string;
  start: string;
  end: string;
  prompt: string;
  visual: {
    icon: TimeIcon;
    segments: string[];
  };
  choices: ElapsedChoice[];
}

export interface ElapsedTimeBreakdown {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

const timeSlots: TimeSlot[] = [
  { id: "before-leaving", label: "07:40 出门前" },
  { id: "morning-reading", label: "08:10 早读" },
  { id: "before-lunch", label: "11:40 午饭前" },
  { id: "after-lunch", label: "13:30 午饭后" },
  { id: "after-dinner", label: "19:00 晚饭后" },
  { id: "before-sleep", label: "21:00 睡觉前" }
];

export const scheduleTasks: ScheduleTask[] = [
  {
    id: "pack",
    title: "整理书包",
    prompt: "出门前要检查书包，不能拖到晚上。",
    correctSlot: "before-leaving",
    reason: "出门前整理，能避免忘东西。",
    visual: {
      tokens: [
        { icon: "backpack", text: "书包", label: "检查物品", tone: "task" },
        { icon: "clock", text: "门口", label: "准备出门", tone: "home" },
        { icon: "sentence-card", text: "清单", label: "一样一样看", tone: "clock" }
      ],
      note: "先做会影响出门的事情。"
    }
  },
  {
    id: "read",
    title: "读短句",
    prompt: "读短句需要安静，不能放在吃饭时。",
    correctSlot: "morning-reading",
    reason: "早读时间安静，适合读短句。",
    visual: {
      tokens: [
        { icon: "sentence-card", text: "短句", label: "需要专心", tone: "task" },
        { icon: "clock", text: "早读", label: "安静时间", tone: "clock" },
        { icon: "desk", text: "餐桌", label: "不边吃边读", tone: "home" }
      ],
      note: "把需要专心的任务放在安静时间。"
    }
  },
  {
    id: "wash",
    title: "饭前洗手",
    prompt: "吃饭前要洗手，不能吃完再补。",
    correctSlot: "before-lunch",
    reason: "饭前洗手，顺序才对。",
    visual: {
      tokens: [
        { icon: "wash-hands", text: "洗手", label: "饭前做", tone: "task" },
        { icon: "desk", text: "午饭", label: "马上开始", tone: "home" },
        { icon: "time-line", text: "顺序", label: "先洗再吃", tone: "clock" }
      ],
      note: "看任务和下一件事有没有先后关系。"
    }
  },
  {
    id: "game",
    title: "午后游戏",
    prompt: "晚上要早睡，游戏不要放在睡前。",
    correctSlot: "after-lunch",
    reason: "午饭后有空，晚上就能早点休息。",
    visual: {
      tokens: [
        { icon: "gamepad", text: "游戏", label: "需要一段时间", tone: "task" },
        { icon: "clock", text: "午后", label: "有空档", tone: "clock" },
        { icon: "sleep", text: "睡前", label: "不太适合", tone: "rest" }
      ],
      note: "把容易拖长的事放在白天。"
    }
  },
  {
    id: "desk",
    title: "整理桌面",
    prompt: "晚饭后要把桌面收好，第二天找东西更快。",
    correctSlot: "after-dinner",
    reason: "晚饭后整理，睡前就不会太赶。",
    visual: {
      tokens: [
        { icon: "desk", text: "桌面", label: "收好文具", tone: "task" },
        { icon: "clock", text: "晚饭后", label: "还有精神", tone: "clock" },
        { icon: "sleep", text: "睡前", label: "留给休息", tone: "rest" }
      ],
      note: "把收尾任务放在睡前之前。"
    }
  },
  {
    id: "sleep-ready",
    title: "睡前准备",
    prompt: "刷牙、换睡衣要放在睡觉前。",
    correctSlot: "before-sleep",
    reason: "睡觉前准备，顺序最自然。",
    visual: {
      tokens: [
        { icon: "wash-hands", text: "刷牙", label: "睡前任务", tone: "task" },
        { icon: "sleep", text: "睡衣", label: "准备休息", tone: "rest" },
        { icon: "clock", text: "21:00", label: "睡觉前", tone: "clock" }
      ],
      note: "和睡觉直接相关的事放在睡前。"
    }
  }
];

export const elapsedChallenges: ElapsedChallenge[] = [
  {
    id: "morning-gap",
    start: "08:40",
    end: "10:10",
    prompt: "08:40 到 10:10 经过多久？",
    visual: { icon: "time-line", segments: ["08:40 -> 09:40 是 1 小时", "09:40 -> 10:10 是 30 分"] },
    choices: [
      { id: "short", label: "1 小时 10 分", hours: 1, minutes: 10 },
      { id: "correct", label: "1 小时 30 分", hours: 1, minutes: 30 },
      { id: "long", label: "2 小时 30 分", hours: 2, minutes: 30 }
    ]
  },
  {
    id: "afternoon-gap",
    start: "13:25",
    end: "14:00",
    prompt: "13:25 到 14:00 经过多久？",
    visual: { icon: "time-line", segments: ["13:25 -> 13:55 是 30 分", "13:55 -> 14:00 是 5 分"] },
    choices: [
      { id: "short", label: "25 分", hours: 0, minutes: 25 },
      { id: "correct", label: "35 分", hours: 0, minutes: 35 },
      { id: "long", label: "1 小时 35 分", hours: 1, minutes: 35 }
    ]
  },
  {
    id: "evening-gap",
    start: "18:10",
    end: "19:05",
    prompt: "18:10 到 19:05 经过多久？",
    visual: { icon: "time-line", segments: ["18:10 -> 19:00 是 50 分", "19:00 -> 19:05 是 5 分"] },
    choices: [
      { id: "short", label: "45 分", hours: 0, minutes: 45 },
      { id: "correct", label: "55 分", hours: 0, minutes: 55 },
      { id: "long", label: "1 小时 5 分", hours: 1, minutes: 5 }
    ]
  }
];

export const timeSchedulerGame: GameDefinition = {
  id: "time-scheduler",
  title: "时间任务调度员",
  description: "把日常任务放到合适时间，再用小时和分钟拆分经过时间。",
  subject: "数学",
  recommendedAge: "6-8 岁",
  learningGoal: "练习时间安排、冲突判断和经过时间的拆分计算。",
  status: "可玩",
  playLabel: "排时间",
  mount(context: MountGameContext): MountedGame {
    return mountTimeScheduler(context);
  }
};

function mountTimeScheduler(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game time-scheduler-game";
  context.container.append(root);

  let taskIndex = 0;
  let elapsedIndex = 0;
  let score = 0;
  let answered = false;
  let elapsedMode = false;
  let completed = false;
  let feedback: FeedbackState = { kind: "info", text: "先读任务要求，再选择合适时间。" };

  const render = (): void => {
    clearElement(root);
    root.append(createHeader("时间任务调度员", "说清楚先后、冲突和原因，再点选时间。"));

    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("任务星", score),
      createStatus(
        "阶段",
        completed ? "已完成" : elapsedMode ? `经过时间 ${elapsedIndex + 1}/${elapsedChallenges.length}` : `${taskIndex + 1}/${scheduleTasks.length}`
      )
    );

    if (completed) {
      root.append(stats, createCompletionCard(getTimeSchedulerCompletionSummary(score), score, restart, context.onExit));
      return;
    }

    if (elapsedMode) {
      renderElapsedChallenge(stats);
      return;
    }

    const task = scheduleTasks[taskIndex];
    const card = document.createElement("section");
    card.className = "learning-game__result time-card";
    const title = document.createElement("h3");
    title.textContent = task.title;
    const prompt = document.createElement("p");
    prompt.textContent = task.prompt;
    card.append(title, createTaskVisual(task.visual), prompt);

    const choices = document.createElement("div");
    choices.className = "learning-game__actions learning-game__actions--wide";
    for (const slot of timeSlots) {
      choices.append(createButton(slot.label, () => chooseSlot(slot.id), { disabled: answered }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton(taskIndex === scheduleTasks.length - 1 ? "算经过时间" : "下一项", nextTask, {
        className: "ui-button ui-button--secondary",
        disabled: !answered
      })
    );

    root.append(stats, createTimeline(), card, choices, actions, createFeedbackBanner(feedback));
  };

  const renderElapsedChallenge = (stats: HTMLElement): void => {
    const challenge = elapsedChallenges[elapsedIndex];
    const breakdown = getElapsedTimeBreakdown(challenge.start, challenge.end);
    const card = document.createElement("section");
    card.className = "learning-game__result time-card";
    const title = document.createElement("h3");
    title.textContent = challenge.prompt;
    const prompt = document.createElement("p");
    prompt.textContent = `先跳整小时，再看剩下的分钟：共 ${breakdown.totalMinutes} 分钟。`;
    card.append(title, createElapsedVisual(challenge), prompt);

    const choices = document.createElement("div");
    choices.className = "learning-game__actions learning-game__actions--wide";
    for (const choice of challenge.choices) {
      choices.append(createButton(choice.label, () => chooseElapsed(choice.hours, choice.minutes), { disabled: answered }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton(elapsedIndex === elapsedChallenges.length - 1 ? "完成本轮" : "下一题", nextElapsed, {
        className: "ui-button ui-button--secondary",
        disabled: !answered
      })
    );

    root.append(stats, card, choices, actions, createFeedbackBanner(feedback));
  };

  const chooseSlot = (slotId: string): void => {
    if (answered) {
      return;
    }
    const task = scheduleTasks[taskIndex];
    answered = true;
    if (slotId === task.correctSlot) {
      score += 1;
      feedback = { kind: "success", text: `${task.reason} 请孩子再说一句“不能在...因为...”。` };
      playFeedbackSound("success");
    } else {
      feedback = { kind: "error", text: `再想冲突：${task.prompt} ${task.reason}` };
      playFeedbackSound("error");
    }
    render();
  };

  const chooseElapsed = (hours: number, minutes: number): void => {
    if (answered) {
      return;
    }
    const challenge = elapsedChallenges[elapsedIndex];
    const breakdown = getElapsedTimeBreakdown(challenge.start, challenge.end);
    answered = true;
    if (hours === breakdown.hours && minutes === breakdown.minutes) {
      score += 1;
      feedback = { kind: "success", text: `对了：${challenge.visual.segments.join("；")}。` };
      playFeedbackSound("success");
    } else {
      feedback = { kind: "error", text: "再拆开算：先跳整小时或整十分钟，再算剩下分钟。" };
      playFeedbackSound("error");
    }
    render();
  };

  const nextTask = (): void => {
    answered = false;
    if (taskIndex === scheduleTasks.length - 1) {
      elapsedMode = true;
      elapsedIndex = 0;
      feedback = { kind: "info", text: "现在算经过时间：先跳整小时，再算分钟。" };
    } else {
      taskIndex += 1;
      feedback = { kind: "info", text: "先读任务要求，再选择合适时间。" };
    }
    render();
  };

  const nextElapsed = (): void => {
    answered = false;
    if (elapsedIndex === elapsedChallenges.length - 1) {
      completed = true;
      render();
      return;
    }
    elapsedIndex += 1;
    feedback = { kind: "info", text: "继续拆经过时间：先看起点，再看终点。" };
    render();
  };

  const restart = (): void => {
    taskIndex = 0;
    elapsedIndex = 0;
    score = 0;
    answered = false;
    elapsedMode = false;
    completed = false;
    feedback = { kind: "info", text: "先读任务要求，再选择合适时间。" };
    render();
  };

  render();

  return {
    destroy(): void {
      root.remove();
    }
  };
}

export function getTimeSchedulerCompletionSummary(score: number): string {
  const total = scheduleTasks.length + elapsedChallenges.length;
  return `完成 ${scheduleTasks.length} 个安排任务和 ${elapsedChallenges.length} 个经过时间挑战，共 ${total} 个任务，任务星 ${score}/${total}。请孩子说一遍先跳整小时、再算剩下分钟，再点“重新开始”再玩一轮。`;
}

function createCompletionCard(summary: string, score: number, onRestart: () => void, onExit: () => void): HTMLElement {
  const total = scheduleTasks.length + elapsedChallenges.length;
  const card = document.createElement("section");
  card.className = "learning-game__result learning-game__completion";
  const title = document.createElement("h3");
  title.textContent = "调度完成";
  const summaryText = document.createElement("p");
  summaryText.textContent = summary;
  const scoreLine = document.createElement("strong");
  scoreLine.className = "learning-game__completion-score";
  scoreLine.textContent = `任务星 ${score}/${total}`;
  const actions = document.createElement("div");
  actions.className = "learning-game__actions";
  actions.append(
    createButton("重新开始", onRestart),
    createButton("返回大厅", onExit, { className: "ui-button ui-button--secondary" })
  );
  card.append(title, summaryText, scoreLine, actions);
  return card;
}

function createHeader(titleText: string, introText: string): HTMLElement {
  const header = document.createElement("header");
  header.className = "learning-game__header";
  const title = document.createElement("h2");
  title.textContent = titleText;
  const intro = document.createElement("p");
  intro.textContent = introText;
  header.append(title, intro);
  return header;
}

function createTimeline(): HTMLElement {
  const timeline = document.createElement("div");
  timeline.className = "learning-game__chips";
  for (const slot of timeSlots) {
    const item = document.createElement("span");
    item.textContent = slot.label;
    timeline.append(item);
  }
  return timeline;
}

function createTaskVisual(visual: TaskVisual): HTMLElement {
  const board = document.createElement("div");
  board.className = "scene-board scene-board--time";
  const tokens = document.createElement("div");
  tokens.className = "scene-board__tokens";
  for (const token of visual.tokens) {
    const item = document.createElement("div");
    item.className = `scene-token scene-token--${token.tone}`;
    item.append(createTimeIcon(token.icon));
    const text = document.createElement("strong");
    text.textContent = token.text;
    const label = document.createElement("span");
    label.textContent = token.label;
    item.append(text, label);
    tokens.append(item);
  }
  const note = document.createElement("p");
  note.className = "scene-board__note";
  note.textContent = visual.note;
  board.append(tokens, note);
  return board;
}

function createElapsedVisual(challenge: ElapsedChallenge): HTMLElement {
  const strip = document.createElement("div");
  strip.className = "time-strip";
  strip.append(createTimeIcon(challenge.visual.icon));
  const endpoints = document.createElement("div");
  endpoints.className = "time-strip__endpoints";
  endpoints.append(createTimePoint(challenge.start), createTimePoint(challenge.end));
  const segments = document.createElement("div");
  segments.className = "time-strip__segments";
  for (const segment of challenge.visual.segments) {
    const item = document.createElement("span");
    item.textContent = segment;
    segments.append(item);
  }
  strip.append(endpoints, segments);
  return strip;
}

function createTimePoint(label: string): HTMLElement {
  const point = document.createElement("strong");
  point.textContent = label;
  return point;
}

function createTimeIcon(icon: TimeIcon): SVGSVGElement {
  const svg = createSvg();
  if (icon === "clock") {
    appendSvg(svg, "circle", { cx: "48", cy: "48", r: "34", fill: "#e8f6ff", stroke: "#25313b", "stroke-width": "5" });
    appendSvg(svg, "line", { x1: "48", y1: "48", x2: "48", y2: "24", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "48", y1: "48", x2: "66", y2: "58", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    appendSvg(svg, "circle", { cx: "48", cy: "48", r: "4", fill: "#25313b" });
    return svg;
  }
  if (icon === "backpack") {
    appendSvg(svg, "path", { d: "M32 32 C32 18 64 18 64 32", fill: "none", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    appendSvg(svg, "rect", { x: "24", y: "30", width: "48", height: "54", rx: "12", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "rect", { x: "34", y: "54", width: "28", height: "20", rx: "6", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "line", { x1: "24", y1: "44", x2: "72", y2: "44", stroke: "#25313b", "stroke-width": "3" });
    return svg;
  }
  if (icon === "sentence-card") {
    appendSvg(svg, "rect", { x: "20", y: "20", width: "56", height: "58", rx: "8", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "4" });
    for (const y of [36, 50, 64]) {
      appendSvg(svg, "line", { x1: "30", y1: `${y}`, x2: "66", y2: `${y}`, stroke: "#2f78b8", "stroke-width": "4", "stroke-linecap": "round" });
    }
    return svg;
  }
  if (icon === "wash-hands") {
    appendSvg(svg, "path", { d: "M24 62 C34 50 44 50 54 62 C62 70 72 68 82 56", fill: "none", stroke: "#2f78b8", "stroke-width": "6", "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M22 74 C38 84 62 84 78 72", fill: "none", stroke: "#8fc7ff", "stroke-width": "7", "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M34 44 H66 C62 30 38 30 34 44Z", fill: "#ffd3c7", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "68", cy: "28", r: "5", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "2" });
    return svg;
  }
  if (icon === "gamepad") {
    appendSvg(svg, "rect", { x: "18", y: "38", width: "60", height: "30", rx: "14", fill: "#d9c8ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "line", { x1: "31", y1: "46", x2: "31", y2: "60", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "24", y1: "53", x2: "38", y2: "53", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    appendSvg(svg, "circle", { cx: "60", cy: "50", r: "4", fill: "#ff9db2", stroke: "#25313b", "stroke-width": "2" });
    appendSvg(svg, "circle", { cx: "68", cy: "58", r: "4", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "2" });
    return svg;
  }
  if (icon === "desk") {
    appendSvg(svg, "rect", { x: "18", y: "34", width: "60", height: "14", rx: "5", fill: "#ead3aa", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "line", { x1: "28", y1: "48", x2: "22", y2: "80", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "68", y1: "48", x2: "74", y2: "80", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    appendSvg(svg, "rect", { x: "34", y: "18", width: "28", height: "14", rx: "4", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "3" });
    return svg;
  }
  if (icon === "sleep") {
    appendSvg(svg, "rect", { x: "18", y: "46", width: "62", height: "24", rx: "8", fill: "#d9c8ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "rect", { x: "20", y: "34", width: "24", height: "18", rx: "6", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "path", { d: "M64 18 H80 L66 34 H82", fill: "none", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round", "stroke-linejoin": "round" });
    return svg;
  }
  appendSvg(svg, "line", { x1: "14", y1: "52", x2: "82", y2: "52", stroke: "#25313b", "stroke-width": "6", "stroke-linecap": "round" });
  appendSvg(svg, "circle", { cx: "22", cy: "52", r: "9", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4" });
  appendSvg(svg, "circle", { cx: "52", cy: "52", r: "9", fill: "#ffe37a", stroke: "#25313b", "stroke-width": "4" });
  appendSvg(svg, "path", { d: "M68 36 L84 52 L68 68", fill: "none", stroke: "#25313b", "stroke-width": "6", "stroke-linecap": "round", "stroke-linejoin": "round" });
  return svg;
}

function createSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 96 96");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("scene-icon");
  return svg;
}

function appendSvg(parent: SVGElement, tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  parent.append(node);
  return node;
}

export function getElapsedTimeBreakdown(start: string, end: string): ElapsedTimeBreakdown {
  const startMinutes = parseClockTime(start);
  const endMinutes = parseClockTime(end);
  const totalMinutes = Math.max(0, endMinutes - startMinutes);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    totalMinutes
  };
}

function parseClockTime(value: string): number {
  const [hourText, minuteText] = value.split(":");
  return Number(hourText) * 60 + Number(minuteText);
}
