import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { hanziWheelSets, type HanziWheelModeData, type HanziWheelPair } from "../../packages/data/learningGames";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound } from "../../packages/ui";

type HanziWheelMode = "char" | "word";
type HanziWheelSide = "outer" | "inner";

const WHEEL_SPIN_DURATION_MS = 1100;
const MAX_VISIBLE_WHEEL_PAIRS = 12;

interface HanziWheelSave {
  spins: number;
}

export const hanziWheelGame: GameDefinition = {
  id: "hanzi-wheel",
  title: "汉字大转盘",
  description: "转动内外两圈部件，观察它们能组成什么汉字或词语。",
  subject: "识字",
  recommendedAge: "6-15 岁",
  playLabel: "开始转盘",
  mount(context: MountGameContext): MountedGame {
    return mountHanziWheel(context);
  }
};

function mountHanziWheel(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game hanzi-wheel-game";
  context.container.append(root);

  let setIndex = 0;
  let mode: HanziWheelMode = "char";
  let selected: HanziWheelPair | null = null;
  let pending: HanziWheelPair | null = null;
  let spinning = false;
  let outerRotation = 0;
  let innerRotation = 0;
  let timer: number | undefined;
  let animationFrame: number | undefined;
  let visiblePairs = pickVisiblePairs(hanziWheelSets[setIndex][mode].validPairs, null);
  const save = context.storage.get<HanziWheelSave>("progress", { spins: 0 });

  const render = (): void => {
    clearElement(root);
    const activeSet = hanziWheelSets[setIndex];
    const fullModeData = activeSet[mode];
    const modeData = createVisibleModeData(visiblePairs);
    const hitPair = selected ?? pending;

    root.append(createHeader());
    root.append(createControls());

    const status = document.createElement("div");
    status.className = "learning-game__stats";
    status.append(
      createStatus("已转动", save.spins),
      createStatus("当前", activeSet.label),
      createStatus("模式", mode === "char" ? "组字" : "组词"),
      createStatus("题库", `${fullModeData.validPairs.length} 组`)
    );

    const board = document.createElement("div");
    board.className = "hanzi-wheel-board hanzi-wheel-board--round";
    board.append(
      createWheel("外圈", modeData.outerOptions, hitPair?.outer ?? null, outerRotation, "outer"),
      createCenter(modeData),
      createWheel("内圈", modeData.innerOptions, hitPair?.inner ?? null, innerRotation, "inner")
    );

    root.append(status, board);

    if (selected) {
      root.append(createResult(selected));
    } else if (spinning) {
      root.append(createFeedbackBanner({ kind: "info", text: "转盘正在寻找可以组合的部件。" }));
    } else {
      root.append(createFeedbackBanner({ kind: "info", text: "备选部件都在转盘上，点“开始旋转”试一试。" }));
    }
  };

  const createHeader = (): HTMLElement => {
    const header = document.createElement("header");
    header.className = "learning-game__header";
    const title = document.createElement("h2");
    title.textContent = "汉字大转盘";
    const intro = document.createElement("p");
    intro.textContent = "看清内外圈备选部件，转出一组后读结果、拼音和例词。";
    header.append(title, intro);
    return header;
  };

  const createControls = (): HTMLElement => {
    const controls = document.createElement("div");
    controls.className = "learning-game__toolbar";
    for (let index = 0; index < hanziWheelSets.length; index += 1) {
      controls.append(createButton(hanziWheelSets[index].label, () => {
        if (spinning) {
          return;
        }
        setIndex = index;
        selected = null;
        pending = null;
        refreshVisiblePairs();
        render();
      }, {
        className: index === setIndex ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      }));
    }
    controls.append(
      createButton("偏旁组字", () => switchMode("char"), {
        className: mode === "char" ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      }),
      createButton("词语接龙", () => switchMode("word"), {
        className: mode === "word" ? "ui-button learning-game__pill is-active" : "ui-button learning-game__pill"
      })
    );
    return controls;
  };

  const switchMode = (nextMode: HanziWheelMode): void => {
    if (spinning) {
      return;
    }
    mode = nextMode;
    selected = null;
    pending = null;
    refreshVisiblePairs();
    render();
  };

  const spin = (): void => {
    if (spinning) {
      return;
    }

    const modeData = hanziWheelSets[setIndex][mode];
    const nextPair = modeData.validPairs[Math.floor(Math.random() * modeData.validPairs.length)];
    const visibleModeData = refreshVisiblePairs(nextPair);
    const outerIndex = visibleModeData.outerOptions.indexOf(nextPair.outer);
    const innerIndex = visibleModeData.innerOptions.indexOf(nextPair.inner);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextOuterRotation = outerRotation + 720 + getRotationForIndex(outerIndex, visibleModeData.outerOptions.length);
    const nextInnerRotation = innerRotation - 720 - getRotationForIndex(innerIndex, visibleModeData.innerOptions.length);

    clearSpinTimers();
    pending = nextPair;
    selected = null;
    spinning = true;
    playFeedbackSound("info");
    render();

    if (reducedMotion) {
      outerRotation = nextOuterRotation;
      innerRotation = nextInnerRotation;
      finishSpin(nextPair);
      return;
    }

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = undefined;
        outerRotation = nextOuterRotation;
        innerRotation = nextInnerRotation;
        updateWheelRotation("outer", outerRotation);
        updateWheelRotation("inner", innerRotation);

        timer = window.setTimeout(() => {
          timer = undefined;
          finishSpin(nextPair);
        }, WHEEL_SPIN_DURATION_MS);
      });
    });
  };

  const clearSpinTimers = (): void => {
    window.clearTimeout(timer);
    timer = undefined;
    if (animationFrame !== undefined) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }
  };

  const finishSpin = (nextPair: HanziWheelPair): void => {
    selected = nextPair;
    pending = null;
    spinning = false;
    save.spins += 1;
    context.storage.set("progress", save);
    playFeedbackSound("success");
    render();
  };

  const updateWheelRotation = (side: HanziWheelSide, rotation: number): void => {
    const wheel = root.querySelector<HTMLElement>(`.hanzi-wheel-disc--${side}`);
    if (!wheel) {
      return;
    }
    setWheelRotation(wheel, rotation);
  };

  const refreshVisiblePairs = (requiredPair: HanziWheelPair | null = null): HanziWheelModeData => {
    visiblePairs = pickVisiblePairs(hanziWheelSets[setIndex][mode].validPairs, requiredPair);
    return createVisibleModeData(visiblePairs);
  };

  const createCenter = (modeData: HanziWheelModeData): HTMLElement => {
    const center = document.createElement("div");
    center.className = "hanzi-wheel-center";
    const sign = document.createElement("div");
    sign.className = "hanzi-wheel-sign";
    sign.textContent = selected ? `${selected.outer} + ${selected.inner}` : spinning ? "旋转中" : "点开始旋转";
    const button = createButton(spinning ? "旋转中..." : "开始旋转", spin, {
      className: "ui-button hanzi-wheel-spin",
      disabled: spinning || modeData.validPairs.length === 0
    });
    center.append(sign, button);
    return center;
  };

  render();

  return {
    destroy(): void {
      clearSpinTimers();
      root.remove();
    }
  };
}

function pickVisiblePairs(validPairs: HanziWheelPair[], requiredPair: HanziWheelPair | null): HanziWheelPair[] {
  if (validPairs.length <= MAX_VISIBLE_WHEEL_PAIRS) {
    return [...validPairs];
  }

  const picked: HanziWheelPair[] = [];
  if (requiredPair) {
    picked.push(requiredPair);
  }

  for (const pair of shufflePairs(validPairs)) {
    if (picked.length >= MAX_VISIBLE_WHEEL_PAIRS) {
      break;
    }
    if (pair !== requiredPair) {
      picked.push(pair);
    }
  }

  return picked;
}

function shufflePairs(pairs: HanziWheelPair[]): HanziWheelPair[] {
  const shuffled = [...pairs];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createVisibleModeData(validPairs: HanziWheelPair[]): HanziWheelModeData {
  return {
    outerOptions: unique(validPairs.map((pair) => pair.outer)),
    innerOptions: unique(validPairs.map((pair) => pair.inner)),
    validPairs
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

function createWheel(label: string, options: string[], selectedOption: string | null, rotation: number, variant: HanziWheelSide): HTMLElement {
  const wrapper = document.createElement("section");
  wrapper.className = "hanzi-wheel-shell";
  const title = document.createElement("strong");
  title.textContent = label;
  const wheel = document.createElement("div");
  wheel.className = `hanzi-wheel-disc hanzi-wheel-disc--${variant}`;
  setWheelRotation(wheel, rotation);

  for (let index = 0; index < options.length; index += 1) {
    const angle = (360 / options.length) * index;
    const item = document.createElement("span");
    item.className = selectedOption === options[index] ? "hanzi-wheel-item is-selected" : "hanzi-wheel-item";
    item.style.setProperty("--wheel-index", String(index));
    item.style.setProperty("--wheel-count", String(options.length));
    item.style.setProperty("--wheel-angle", `${angle}deg`);
    item.style.setProperty("--wheel-angle-reverse", `${-angle}deg`);
    item.textContent = options[index];
    wheel.append(item);
  }

  wrapper.append(title, wheel);
  return wrapper;
}

function setWheelRotation(wheel: HTMLElement, rotation: number): void {
  wheel.style.setProperty("--wheel-rotation", `${rotation}deg`);
  wheel.style.setProperty("--wheel-rotation-reverse", `${-rotation}deg`);
}

function createResult(entry: HanziWheelPair): HTMLElement {
  const result = document.createElement("section");
  result.className = "learning-game__result hanzi-wheel-result";
  const formula = document.createElement("div");
  formula.className = "hanzi-wheel-formula";
  formula.textContent = `${entry.outer} + ${entry.inner} = ${entry.result}`;
  const pinyin = document.createElement("p");
  pinyin.textContent = entry.pinyin;
  const words = document.createElement("div");
  words.className = "learning-game__chips";
  for (const word of entry.words) {
    const chip = document.createElement("span");
    chip.textContent = word;
    words.append(chip);
  }
  result.append(formula, pinyin, words);
  return result;
}

function getRotationForIndex(index: number, optionCount: number): number {
  if (index < 0 || optionCount <= 0) {
    return 0;
  }
  return 360 - (360 / optionCount) * index;
}
