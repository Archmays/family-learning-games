import type { GameDefinition, MountedGame } from "../../packages/game-core";
import { createLocalStorageStore } from "../../packages/game-core";
import { gameCatalog } from "../../packages/data/gameCatalog";
import { clearElement, createButton, createPanel } from "../../packages/ui";

export function mountHub(root: HTMLElement): MountedGame {
  let mountedGame: MountedGame | null = null;

  const renderHub = (): void => {
    mountedGame?.destroy();
    mountedGame = null;
    root.className = "app-shell";
    clearElement(root);

    const header = document.createElement("header");
    header.className = "hub-header";

    const titleGroup = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "家庭游戏大厅";
    const subtitle = document.createElement("p");
    subtitle.textContent = "选择一个短小游戏，练习识字、数学和亲子互动。";
    titleGroup.append(title, subtitle);
    header.append(titleGroup);

    const grid = document.createElement("main");
    grid.className = "hub-grid";

    for (const game of gameCatalog) {
      grid.append(createGameCard(game, () => openGame(game)));
    }

    root.append(header, grid);
  };

  const openGame = (game: GameDefinition): void => {
    mountedGame?.destroy();
    mountedGame = null;
    root.className = "game-runner";
    clearElement(root);

    const topbar = document.createElement("div");
    topbar.className = "game-topbar";
    const backButton = createButton("返回大厅", renderHub, {
      className: "ui-button ui-button--secondary"
    });
    const title = document.createElement("strong");
    title.textContent = game.title;
    topbar.append(backButton, title);

    const stage = document.createElement("main");
    stage.className = "game-stage";
    root.append(topbar, stage);

    mountedGame = game.mount({
      container: stage,
      onExit: renderHub,
      storage: createLocalStorageStore(game.id)
    });
  };

  renderHub();

  return {
    destroy(): void {
      mountedGame?.destroy();
      mountedGame = null;
      clearElement(root);
    }
  };
}

function createGameCard(game: GameDefinition, onPlay: () => void): HTMLElement {
  const card = createPanel("game-card");

  const subject = document.createElement("div");
  subject.className = "game-card__subject";
  subject.textContent = game.subject;

  const title = document.createElement("h2");
  title.textContent = game.title;

  const description = document.createElement("p");
  description.textContent = game.description;

  const age = document.createElement("div");
  age.className = "game-card__age";
  age.textContent = `适合年龄：${game.recommendedAge}`;

  const button = createButton(game.playLabel ?? "开始游戏", onPlay, {
    className: "ui-button game-card__button"
  });

  card.append(subject, title, description, age, button);
  return card;
}
