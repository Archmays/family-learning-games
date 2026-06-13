import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type TargetMode = 10 | 12 | 24;
type Operator = "+" | "-" | "×" | "÷";

interface NumberCard {
  id: string;
  value: number;
  expression: string;
}

interface ActionSnapshot {
  cards: NumberCard[];
  equation: string;
}

interface MakeTargetSave {
  wins: number;
}

export const makeTargetGame: GameDefinition = {
  id: "make-target",
  title: "凑10算12算24",
  description: "选择数字和运算符，把一手牌一步步合成目标数。",
  subject: "数学",
  recommendedAge: "7-10 岁",
  learningGoal: "练习数感、四则运算顺序和目标数推理。",
  status: "可玩",
  playLabel: "开始凑数",
  mount(context: MountGameContext): MountedGame {
    return mountMakeTarget(context);
  }
};

function mountMakeTarget(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game make-target-game";
  context.container.append(root);

  let target: TargetMode = 10;
  let cards: NumberCard[] = [];
  let selectedIds: string[] = [];
  let operator: Operator = "+";
  let feedback: FeedbackState = { kind: "info", text: "选两张数字牌，再选择运算。" };
  let history: ActionSnapshot[] = [];
  const save = context.storage.get<MakeTargetSave>("progress", { wins: 0 });

  const render = (): void => {
    clearElement(root);
    root.append(createHeader("凑数探险", "用两张牌合成新数字，最后得到目标。"));

    const toolbar = document.createElement("div");
    toolbar.className = "learning-game__toolbar";
    for (const value of [10, 12, 24] as TargetMode[]) {
      toolbar.append(createButton(`凑 ${value}`, () => {
        target = value;
        startRound();
      }, {
        className: value === target ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      }));
    }

    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("目标", target), createStatus("剩余牌", cards.length), createStatus("成功", save.wins));

    const cardGrid = document.createElement("div");
    cardGrid.className = "make-target-cards";
    for (const card of cards) {
      cardGrid.append(createNumberCardButton(card, selectedIds.includes(card.id), () => toggleCard(card.id)));
    }

    const ops = document.createElement("div");
    ops.className = "make-target-ops";
    for (const op of getOperators(target)) {
      ops.append(createButton(op, () => {
        operator = op;
        render();
      }, {
        className: op === operator ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton("合并", combineSelected),
      createButton("撤销", undo, { className: "ui-button ui-button--secondary", disabled: history.length === 0 }),
      createButton("重来", startRound, { className: "ui-button ui-button--secondary" })
    );

    root.append(toolbar, stats, cardGrid, ops, createPreview(), actions, createHistoryList(), createFeedbackBanner(feedback));
  };

  const startRound = (): void => {
    cards = generateSolvableCards(target);
    selectedIds = [];
    operator = "+";
    history = [];
    feedback = { kind: "info", text: "选两张数字牌，再选择运算。" };
    render();
  };

  const toggleCard = (id: string): void => {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    } else if (selectedIds.length < 2) {
      selectedIds = [...selectedIds, id];
    }
    render();
  };

  const combineSelected = (): void => {
    if (selectedIds.length !== 2) {
      feedback = { kind: "info", text: "需要先选两张牌。" };
      render();
      return;
    }

    const first = cards.find((card) => card.id === selectedIds[0]);
    const second = cards.find((card) => card.id === selectedIds[1]);
    if (!first || !second) {
      return;
    }

    const result = calculate(first.value, second.value, operator);
    if (result === null) {
      feedback = { kind: "error", text: "这两张牌不能这样整除，换个运算试试。" };
      playFeedbackSound("error");
      render();
      return;
    }

    const equation = `${first.expression} ${operator} ${second.expression} = ${formatCardValue(result)}`;
    history = [{ cards: [...cards], equation }, ...history];
    cards = cards.filter((card) => !selectedIds.includes(card.id));
    cards.push({
      id: crypto.randomUUID(),
      value: result,
      expression: `(${first.expression} ${operator} ${second.expression})`
    });
    selectedIds = [];

    if (cards.length === 1 && cards[0].value === target) {
      save.wins += 1;
      context.storage.set("progress", save);
      feedback = { kind: "success", text: `成功凑出 ${target}。` };
      playFeedbackSound("success");
    } else {
      feedback = { kind: "success", text: `合并得到 ${formatCardValue(result)}，继续凑目标。` };
      playFeedbackSound("info");
    }
    render();
  };

  const undo = (): void => {
    const previous = history.shift();
    if (!previous) {
      return;
    }
    cards = previous.cards;
    selectedIds = [];
    feedback = { kind: "info", text: "已撤销一步。" };
    render();
  };

  const createPreview = (): HTMLElement => {
    const preview = document.createElement("section");
    preview.className = "make-target-preview";
    const selected = selectedIds.map((id) => cards.find((card) => card.id === id)).filter((card): card is NumberCard => Boolean(card));
    if (selected.length !== 2) {
      preview.textContent = "预览：先选两张牌。";
      return preview;
    }

    const result = calculate(selected[0].value, selected[1].value, operator);
    preview.textContent = result === null
      ? `预览：${selected[0].expression} ${operator} ${selected[1].expression} 不能整除`
      : `预览：${selected[0].expression} ${operator} ${selected[1].expression} = ${formatCardValue(result)}`;
    return preview;
  };

  const createHistoryList = (): HTMLElement => {
    const list = document.createElement("section");
    list.className = "make-target-history";
    const title = document.createElement("strong");
    title.textContent = "合并记录";
    list.append(title);

    if (history.length === 0) {
      const empty = document.createElement("span");
      empty.textContent = "还没有合并步骤。";
      list.append(empty);
      return list;
    }

    const steps = document.createElement("ol");
    for (const item of [...history].reverse()) {
      const step = document.createElement("li");
      step.textContent = item.equation;
      steps.append(step);
    }
    list.append(steps);
    return list;
  };

  startRound();

  return {
    destroy(): void {
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

function createNumberCardButton(card: NumberCard, selected: boolean, onClick: () => void): HTMLButtonElement {
  const button = createButton("", onClick, {
    className: selected ? "ui-button make-target-card is-selected" : "ui-button make-target-card"
  });
  const expression = document.createElement("span");
  expression.textContent = card.expression;
  const value = document.createElement("strong");
  value.textContent = `= ${formatCardValue(card.value)}`;
  button.append(expression, value);
  return button;
}

function generateSolvableCards(target: TargetMode): NumberCard[] {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const values = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10) + 1);
    if (canReachTarget(values, target, target === 24)) {
      return values.map((value, index) => ({
        id: `${Date.now()}-${attempt}-${index}`,
        value,
        expression: String(value)
      }));
    }
  }

  return [1, 2, 3, target - 6].map((value, index) => ({
    id: `fallback-${index}`,
    value,
    expression: String(value)
  }));
}

function canReachTarget(values: number[], target: number, allowDivision: boolean): boolean {
  if (values.length === 1) {
    return values[0] === target;
  }

  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      const rest = values.filter((_, index) => index !== i && index !== j);
      for (const result of getPossibleResults(values[i], values[j], allowDivision)) {
        if (canReachTarget([...rest, result], target, allowDivision)) {
          return true;
        }
      }
    }
  }
  return false;
}

function getPossibleResults(a: number, b: number, allowDivision: boolean): number[] {
  const results = [a + b, Math.abs(a - b), a * b];
  if (allowDivision) {
    if (b !== 0 && a % b === 0) {
      results.push(a / b);
    }
    if (a !== 0 && b % a === 0) {
      results.push(b / a);
    }
  }
  return results;
}

function getOperators(target: TargetMode): Operator[] {
  return target === 24 ? ["+", "-", "×", "÷"] : ["+", "-", "×"];
}

export function calculate(a: number, b: number, operator: Operator): number | null {
  if (operator === "+") {
    return a + b;
  }
  if (operator === "-") {
    return Math.abs(a - b);
  }
  if (operator === "×") {
    return a * b;
  }
  if (b !== 0 && a % b === 0) {
    return a / b;
  }
  if (a !== 0 && b % a === 0) {
    return b / a;
  }
  return null;
}

export function formatCardValue(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}
