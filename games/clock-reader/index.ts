import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound, speakText } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type ClockMode = "explore" | "quiz";

interface ClockSave {
  bestStreak: number;
}

interface ClockTime {
  hour: number;
  minute: number;
}

export const clockReaderGame: GameDefinition = {
  id: "clock-reader",
  title: "认识时钟",
  description: "观察 60 个分钟刻度，拨动时针和分针，学习整点、半点和 5 分钟时间。",
  subject: "数学",
  recommendedAge: "5-7 岁",
  learningGoal: "认识整点、半点和 5 分钟刻度，能把表盘时间读出来。",
  status: "可玩",
  playLabel: "拨时钟",
  mount(context: MountGameContext): MountedGame {
    return mountClockReader(context);
  }
};

function mountClockReader(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game clock-game";
  context.container.append(root);

  let mode: ClockMode = "explore";
  let time: ClockTime = { hour: 3, minute: 0 };
  let target: ClockTime | null = null;
  let streak = 0;
  let locked = false;
  let timer: number | undefined;
  let feedback: FeedbackState = { kind: "info", text: "自由探索：拨一拨，看看现在是几点。" };
  const save = context.storage.get<ClockSave>("progress", { bestStreak: 0 });

  const render = (): void => {
    clearElement(root);
    root.append(createHeader("认识时钟", "60 个小刻度都在表盘上，5 分钟位置标出 00、05、10……"));

    const toolbar = document.createElement("div");
    toolbar.className = "learning-game__toolbar";
    toolbar.append(
      createButton("自由探索", () => switchMode("explore"), {
        className: mode === "explore" ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill",
        disabled: locked
      }),
      createButton("挑战任务", () => switchMode("quiz"), {
        className: mode === "quiz" ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill",
        disabled: locked
      })
    );

    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("连对", streak),
      createStatus("最佳", save.bestStreak),
      createStatus("现在", formatTime(time))
    );

    const stage = document.createElement("div");
    stage.className = "clock-stage";
    stage.append(createClock(time), createControls());

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("听时间", () => speakTime(time), { className: "ui-button ui-button--secondary" }));
    if (mode === "quiz") {
      actions.append(
        createButton("我拨好了", checkAnswer, { disabled: locked }),
        createButton("换一题", newChallenge, { className: "ui-button ui-button--secondary", disabled: locked })
      );
    }

    root.append(toolbar, stats, stage, actions, createFeedbackBanner(feedback));
  };

  const switchMode = (nextMode: ClockMode): void => {
    mode = nextMode;
    streak = nextMode === "quiz" ? streak : 0;
    window.clearTimeout(timer);
    locked = false;
    if (nextMode === "quiz") {
      newChallenge();
      return;
    }
    target = null;
    feedback = { kind: "info", text: "自由探索：拨一拨，看看现在是几点。" };
    render();
  };

  const changeHour = (delta: number): void => {
    if (locked) {
      return;
    }
    time = {
      ...time,
      hour: wrapHour(time.hour + delta)
    };
    if (mode === "explore") {
      feedback = { kind: "info", text: `现在是 ${formatTime(time)}。` };
      speakTime(time);
    }
    render();
  };

  const changeMinute = (delta: number): void => {
    if (locked) {
      return;
    }
    const total = time.hour * 60 + time.minute + delta;
    const normalized = ((total - 60) % 720 + 720) % 720 + 60;
    time = {
      hour: Math.floor(normalized / 60),
      minute: normalized % 60
    };
    if (mode === "explore") {
      feedback = { kind: "info", text: `现在是 ${formatTime(time)}。` };
      speakTime(time);
    }
    render();
  };

  const newChallenge = (): void => {
    window.clearTimeout(timer);
    target = {
      hour: Math.floor(Math.random() * 12) + 1,
      minute: Math.floor(Math.random() * 12) * 5
    };
    time = {
      hour: Math.floor(Math.random() * 12) + 1,
      minute: Math.floor(Math.random() * 12) * 5
    };
    locked = false;
    feedback = { kind: "info", text: `挑战目标：拨到 ${formatTime(target)}。` };
    render();
  };

  const checkAnswer = (): void => {
    if (!target || locked) {
      return;
    }

    if (time.hour === target.hour && time.minute === target.minute) {
      streak += 1;
      locked = true;
      save.bestStreak = Math.max(save.bestStreak, streak);
      context.storage.set("progress", save);
      feedback = { kind: "success", text: `答对了：${formatTime(time)}。先看一眼表盘，再进入下一题。` };
      playFeedbackSound("success");
      speakTime(time);
      render();
      timer = window.setTimeout(newChallenge, 1000);
      return;
    }

    streak = 0;
    feedback = { kind: "error", text: `还没对。目标是 ${formatTime(target)}，现在是 ${formatTime(time)}。` };
    playFeedbackSound("error");
    render();
  };

  const createControls = (): HTMLElement => {
    const controls = document.createElement("div");
    controls.className = "clock-controls";
    controls.append(
      createButton("时针 -", () => changeHour(-1), { className: "ui-button ui-button--secondary", disabled: locked }),
      createButton("时针 +", () => changeHour(1), { disabled: locked }),
      createButton("分针 -5", () => changeMinute(-5), { className: "ui-button ui-button--secondary", disabled: locked }),
      createButton("分针 +5", () => changeMinute(5), { disabled: locked })
    );
    return controls;
  };

  render();

  return {
    destroy(): void {
      window.clearTimeout(timer);
      window.speechSynthesis?.cancel();
      root.remove();
    }
  };
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

function createClock(time: ClockTime): HTMLElement {
  const clock = document.createElement("div");
  clock.className = "clock-face";

  for (let minute = 0; minute < 60; minute += 1) {
    const tick = document.createElement("i");
    tick.className = minute % 5 === 0 ? "clock-face__tick clock-face__tick--major" : "clock-face__tick";
    tick.style.setProperty("--clock-minute", String(minute));
    tick.style.setProperty("--clock-angle", `${minute * 6}deg`);
    clock.append(tick);
  }

  for (let minute = 0; minute < 60; minute += 5) {
    const label = document.createElement("span");
    label.className = "clock-face__minute-label";
    label.textContent = String(minute).padStart(2, "0");
    label.style.setProperty("--clock-minute", String(minute));
    label.style.setProperty("--clock-angle", `${minute * 6}deg`);
    label.style.setProperty("--clock-angle-reverse", `${minute * -6}deg`);
    clock.append(label);
  }

  for (let value = 1; value <= 12; value += 1) {
    const angle = value * 30;
    const number = document.createElement("span");
    number.className = "clock-face__number";
    number.textContent = String(value);
    number.style.setProperty("--clock-index", String(value));
    number.style.setProperty("--clock-angle", `${angle}deg`);
    number.style.setProperty("--clock-angle-reverse", `${-angle}deg`);
    clock.append(number);
  }

  const minuteHand = document.createElement("i");
  minuteHand.className = "clock-hand clock-hand--minute";
  minuteHand.style.transform = `rotate(${time.minute * 6}deg)`;
  const hourHand = document.createElement("i");
  hourHand.className = "clock-hand clock-hand--hour";
  hourHand.style.transform = `rotate(${(time.hour % 12) * 30 + time.minute * 0.5}deg)`;
  const center = document.createElement("b");
  center.className = "clock-face__center";
  clock.append(minuteHand, hourHand, center);
  return clock;
}

function wrapHour(hour: number): number {
  if (hour < 1) {
    return 12;
  }
  if (hour > 12) {
    return 1;
  }
  return hour;
}

function formatTime(time: ClockTime): string {
  if (time.minute === 0) {
    return `${time.hour} 点整`;
  }
  return `${time.hour} 点 ${time.minute} 分`;
}

function speakTime(time: ClockTime): void {
  speakText(formatTime(time), "zh-CN", 0.9);
}
