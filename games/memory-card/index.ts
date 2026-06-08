import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { memoryCardPairs } from "../../packages/data/memoryCards";
import { clearElement, createButton, createStatus } from "../../packages/ui";

interface CardState {
  instanceId: string;
  pairId: string;
  label: string;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryCardSave {
  bestMoves: number | null;
  completions: number;
}

export const memoryCardGame: GameDefinition = {
  id: "memory-card",
  title: "记忆翻牌",
  description: "翻开卡片，找到相同的字形和图像线索，练习观察和记忆。",
  subject: "识字",
  recommendedAge: "4-8 岁",
  playLabel: "开始翻牌",
  mount(context: MountGameContext): MountedGame {
    return mountMemoryCard(context);
  }
};

function mountMemoryCard(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "memory-card-game";
  context.container.append(root);

  let cards = createDeck();
  let moves = 0;
  let matchedPairs = 0;
  let locked = false;
  let timer: number | undefined;
  const save = context.storage.get<MemoryCardSave>("progress", {
    bestMoves: null,
    completions: 0
  });

  const restart = (): void => {
    window.clearTimeout(timer);
    cards = createDeck();
    moves = 0;
    matchedPairs = 0;
    locked = false;
    render();
  };

  const flipCard = (card: CardState): void => {
    if (locked || card.flipped || card.matched) {
      return;
    }

    card.flipped = true;
    const flipped = cards.filter((item) => item.flipped && !item.matched);

    if (flipped.length === 2) {
      moves += 1;
      locked = true;

      if (flipped[0].pairId === flipped[1].pairId) {
        flipped.forEach((item) => {
          item.matched = true;
        });
        matchedPairs += 1;
        locked = false;
        saveIfComplete();
        render();
        return;
      }

      timer = window.setTimeout(() => {
        flipped.forEach((item) => {
          item.flipped = false;
        });
        locked = false;
        render();
      }, 700);
    }

    render();
  };

  const saveIfComplete = (): void => {
    if (matchedPairs !== memoryCardPairs.length) {
      return;
    }

    save.completions += 1;
    save.bestMoves = save.bestMoves === null ? moves : Math.min(save.bestMoves, moves);
    context.storage.set("progress", save);
  };

  const render = (): void => {
    clearElement(root);

    const header = document.createElement("div");
    header.className = "memory-card-game__header";
    const title = document.createElement("h2");
    title.textContent = "记忆翻牌";
    const intro = document.createElement("p");
    intro.textContent = "每次翻两张，找到相同的一对。";
    header.append(title, intro);

    const stats = document.createElement("div");
    stats.className = "memory-card-game__stats";
    stats.append(
      createStatus("步数", moves),
      createStatus("已找到", `${matchedPairs}/${memoryCardPairs.length}`),
      createStatus("最佳", save.bestMoves ?? "暂无")
    );

    const grid = document.createElement("div");
    grid.className = "memory-card-grid";

    for (const card of cards) {
      const button = createButton("", () => flipCard(card), {
        className: getCardClassName(card),
        disabled: locked || card.matched || card.flipped
      });
      button.setAttribute("aria-label", card.flipped || card.matched ? card.label : "未翻开的卡片");
      button.textContent = card.flipped || card.matched ? card.symbol : "?";
      grid.append(button);
    }

    const controls = document.createElement("div");
    controls.className = "memory-card-game__controls";
    controls.append(
      createButton("重新开始", restart, {
        className: "ui-button ui-button--secondary"
      })
    );

    root.append(header, stats, grid, controls);

    if (matchedPairs === memoryCardPairs.length) {
      const done = document.createElement("div");
      done.className = "memory-card-game__done";
      done.textContent = `完成了！这次用了 ${moves} 步。`;
      root.append(done);
    }
  };

  render();

  return {
    destroy(): void {
      window.clearTimeout(timer);
      root.remove();
    }
  };
}

function createDeck(): CardState[] {
  const deck = memoryCardPairs.flatMap((pair) => [
    createCard(pair.id, pair.label, pair.symbol, "a"),
    createCard(pair.id, pair.label, pair.symbol, "b")
  ]);
  return shuffle(deck);
}

function createCard(pairId: string, label: string, symbol: string, suffix: string): CardState {
  return {
    instanceId: `${pairId}-${suffix}`,
    pairId,
    label,
    symbol,
    flipped: false,
    matched: false
  };
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function getCardClassName(card: CardState): string {
  const state = card.matched ? " memory-card-tile--matched" : card.flipped ? " memory-card-tile--flipped" : "";
  return `memory-card-tile${state}`;
}
