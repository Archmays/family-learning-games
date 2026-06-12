import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

const numberCharacterImages = import.meta.glob<{ default: string }>(
  "../../source/number-blocks-character/*.webp",
  { eager: true }
);

interface MultiplicationSave {
  bestScore: number;
  plays: number;
}

type MultiplicationView = "menu" | "study" | "challenge" | "done";

export const multiplicationAdventureGame: GameDefinition = {
  id: "multiplication-adventure",
  title: "九九乘法表",
  description: "用小方块理解乘法，再完成 10 道乘法挑战。",
  subject: "数学",
  recommendedAge: "7-9 岁",
  playLabel: "练乘法",
  mount(context: MountGameContext): MountedGame {
    return mountMultiplicationAdventure(context);
  }
};

function mountMultiplicationAdventure(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game multiplication-game";
  context.container.append(root);

  let view: MultiplicationView = "menu";
  let factor = 1;
  let questionIndex = 0;
  let score = 0;
  let input = "";
  let currentA = 2;
  let currentB = 2;
  let showResultModel = false;
  let showCharacterResult = false;
  let locked = false;
  let feedback: FeedbackState = { kind: "info", text: "准备好就开始。" };
  const totalQuestions = 10;
  const save = context.storage.get<MultiplicationSave>("progress", { bestScore: 0, plays: 0 });

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (view !== "challenge" || locked) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      input = `${input}${event.key}`.slice(0, 3);
      render();
    } else if (event.key === "Backspace") {
      input = input.slice(0, -1);
      render();
    } else if (event.key === "Enter") {
      checkAnswer();
    }
  };

  const render = (): void => {
    clearElement(root);
    if (view === "menu") {
      renderMenu();
    } else if (view === "study") {
      renderStudy();
    } else if (view === "challenge") {
      renderChallenge();
    } else {
      renderDone();
    }
  };

  const renderMenu = (): void => {
    root.append(createHeader("乘法大冒险", "先观察“几组几个”的规律，再进入闯关。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("最佳", save.bestScore), createStatus("闯关次数", save.plays));

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton("看卡片学习", () => {
        view = "study";
        render();
      }),
      createButton("闯关大挑战", startChallenge)
    );
    root.append(stats, actions);
  };

  const renderStudy = (): void => {
    root.append(createHeader("乘法卡片", "每个乘法都可以看成“几组几个”。"));

    const tabs = document.createElement("div");
    tabs.className = "learning-game__toolbar";
    for (let value = 1; value <= 9; value += 1) {
      tabs.append(createButton(String(value), () => {
        factor = value;
        render();
      }, {
        className: value === factor ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      }));
    }

    const grid = document.createElement("div");
    grid.className = "multiplication-table multiplication-table--visual";
    for (let value = 1; value <= 9; value += 1) {
      const card = document.createElement("section");
      card.className = "multiplication-card multiplication-card--visual";
      const title = document.createElement("strong");
      title.textContent = `${factor} × ${value} = ${factor * value}`;
      const explain = document.createElement("span");
      explain.textContent = `${factor} 组，每组 ${value} 个`;
      card.append(title, createResultArray(factor, value, true, true), explain);
      grid.append(card);
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回乘法主页", () => {
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }), createButton("开始闯关", startChallenge));
    root.append(tabs, grid, actions);
  };

  const renderChallenge = (): void => {
    root.append(createHeader("闯关大挑战", "先看两个因数的数量块，再算乘积。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("题目", `${questionIndex}/${totalQuestions}`), createStatus("得分", score));

    const process = document.createElement("section");
    process.className = "multiplication-process";
    process.append(
      createFactorPanel(currentA),
      createOperator("×"),
      createFactorPanel(currentB),
      createOperator("="),
      createResultPanel()
    );

    const question = document.createElement("div");
    question.className = "multiplication-question";
    question.textContent = `${currentA} × ${currentB}`;

    const answer = document.createElement("div");
    answer.className = "learning-game__answer";
    answer.textContent = input || "输入答案";

    const pad = document.createElement("div");
    pad.className = "number-pad";
    for (const key of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "清空", "0", "确定"]) {
      pad.append(createButton(key, () => {
        if (locked) {
          return;
        }
        if (key === "清空") {
          input = "";
          render();
        } else if (key === "确定") {
          checkAnswer();
        } else {
          input = `${input}${key}`.slice(0, 3);
          render();
        }
      }, { className: "ui-button number-pad__key", disabled: locked }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回乘法主页", () => {
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }));
    if (locked) {
      actions.append(createButton(questionIndex >= totalQuestions ? "查看成绩" : "下一题", advanceAfterReview));
    }

    root.append(stats, process, question, answer, pad, actions, createFeedbackBanner(feedback));
  };

  const renderDone = (): void => {
    root.append(createHeader("挑战完成", `这次答对 ${score} / ${totalQuestions} 题。`));
    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("再玩一次", startChallenge), createButton("返回乘法主页", () => {
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }));
    root.append(actions);
  };

  const startChallenge = (): void => {
    view = "challenge";
    questionIndex = 0;
    score = 0;
    feedback = { kind: "info", text: "第一题来了。" };
    nextQuestion();
  };

  const nextQuestion = (): void => {
    questionIndex += 1;
    currentA = Math.floor(Math.random() * 8) + 2;
    currentB = Math.floor(Math.random() * 9) + 1;
    if (Math.random() > 0.5) {
      [currentA, currentB] = [currentB, currentA];
    }
    input = "";
    showResultModel = false;
    showCharacterResult = false;
    locked = false;
    render();
  };

  const advanceAfterReview = (): void => {
    if (questionIndex >= totalQuestions) {
      save.plays += 1;
      save.bestScore = Math.max(save.bestScore, score);
      context.storage.set("progress", save);
      view = "done";
      render();
      return;
    }

    nextQuestion();
  };

  const checkAnswer = (): void => {
    if (!input) {
      feedback = { kind: "info", text: "先输入答案。" };
      render();
      return;
    }

    const answer = currentA * currentB;
    const correct = Number(input) === answer;
    showResultModel = true;
    showCharacterResult = correct;
    locked = true;

    if (correct) {
      score += 1;
      feedback = { kind: "success", text: `答对了：${currentA} 组，每组 ${currentB} 个，一共 ${answer} 个。` };
      playFeedbackSound("success");
    } else {
      feedback = { kind: "error", text: `这题是 ${answer}。看图：${currentA} 组 × 每组 ${currentB} 个。` };
      playFeedbackSound("error");
    }

    render();
  };

  const createResultPanel = (): HTMLElement => {
    const panel = document.createElement("div");
    panel.className = showResultModel ? "multiplication-result-panel is-revealed" : "multiplication-result-panel";
    panel.append(createResultArray(currentA, currentB, showResultModel, showCharacterResult));
    const label = document.createElement("span");
    label.textContent = showResultModel ? `${currentA * currentB} 个` : "先自己算";
    panel.append(label);
    return panel;
  };

  window.addEventListener("keydown", handleKeyDown);
  render();

  return {
    destroy(): void {
      window.removeEventListener("keydown", handleKeyDown);
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

function createFactorPanel(value: number): HTMLElement {
  const panel = document.createElement("div");
  panel.className = "multiplication-factor-panel";
  const label = document.createElement("strong");
  label.textContent = String(value);
  panel.append(label, createNumberBlock(value));
  return panel;
}

function createOperator(symbol: string): HTMLElement {
  const op = document.createElement("span");
  op.className = "multiplication-operator";
  op.textContent = symbol;
  return op;
}

function createNumberBlock(value: number): HTMLElement {
  const block = document.createElement("div");
  block.className = "number-block-model";
  block.style.setProperty("--number-block-columns", String(Math.min(3, value)));
  for (let index = 0; index < getNumberBlockCount(value); index += 1) {
    const cell = document.createElement("i");
    block.append(cell);
  }
  return block;
}

function createResultArray(a: number, b: number, revealed: boolean, useCharacterImages = false): HTMLElement {
  const grid = document.createElement("div");
  if (useCharacterImages) {
    grid.className = revealed ? "multiplication-array multiplication-array--character is-revealed" : "multiplication-array multiplication-array--character";
    const product = getMultiplicationGridCount(a, b);
    const numberCharacterImage = numberCharacterImages[`../../source/number-blocks-character/${product}.webp`];
    const imageSource = numberCharacterImage?.default;
    if (imageSource) {
      const character = document.createElement("img");
      character.className = "multiplication-number-character multiplication-number-character--single";
      character.src = imageSource;
      character.alt = `${product}`;
      grid.append(character);
      return grid;
    }

    const cell = document.createElement("i");
    grid.append(cell);
    return grid;
  }

  grid.className = revealed ? "multiplication-array is-revealed" : "multiplication-array";
  grid.style.setProperty("--array-columns", String(b));
  for (let index = 0; index < getMultiplicationGridCount(a, b); index += 1) {
    const cell = document.createElement("i");
    grid.append(cell);
  }
  return grid;
}

export function getNumberBlockCount(value: number): number {
  return Math.max(0, Math.floor(value));
}

export function getMultiplicationGridCount(a: number, b: number): number {
  return Math.max(0, Math.floor(a) * Math.floor(b));
}
