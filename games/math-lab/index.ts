import Phaser from "phaser";
import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { gameConfig } from "../../src/game/config";

export const mathLabGame: GameDefinition = {
  id: "math-lab",
  title: "数学实验室",
  description: "进入苹果园、甜点屋、小河、图书馆和集市，用加减法完成场景任务。",
  subject: "数学",
  recommendedAge: "6-9 岁",
  learningGoal: "在场景任务中练习加减法、数量关系和简单两步推理。",
  status: "可玩",
  playLabel: "进入数学游戏",
  mount(context: MountGameContext): MountedGame {
    return mountMathLab(context);
  }
};

function mountMathLab(context: MountGameContext): MountedGame {
  const gameRoot = document.createElement("div");
  gameRoot.id = "game-root";
  gameRoot.setAttribute("aria-label", "儿童数学实验室游戏");
  context.container.append(gameRoot);

  const game = new Phaser.Game(gameConfig);

  return {
    destroy(): void {
      game.destroy(true);
      gameRoot.remove();
    }
  };
}
