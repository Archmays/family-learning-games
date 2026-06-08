# 新增游戏模板

## 推荐目录

```text
games/new-game/
  README.md
  AGENTS.md
  index.ts
  game-data.ts
  components/
  assets/
```

如果游戏很小，可以先只创建 `README.md`、`AGENTS.md` 和 `index.ts`。不要为了占位创建空组件。

## README 必填说明

新增游戏的 `README.md` 应说明：

1. 游戏目标：孩子通过游戏练习什么。
2. 适合年龄：例如 `4-6 岁`、`6-9 岁`。
3. 学科方向：识字、数学、科学、英语、化学启蒙或亲子互动。
4. 核心玩法：玩家每一步要做什么。
5. 难度系统：是否分关卡、题目数量、时间限制或错误次数。
6. 计分方式：按步数、星级、正确率、完成时间或连续答对计分。
7. 是否适合亲子共同玩：如果适合，说明家长如何参与。
8. 是否需要打印材料：需要则说明材料来源和打印方式。
9. 是否需要电脑交互：说明鼠标、触控、键盘或音频需求。
10. 如何接入游戏大厅：说明导出的 `GameDefinition` 和 catalog 注册位置。

## index.ts 接入示例

```ts
import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";

export const newGame: GameDefinition = {
  id: "new-game",
  title: "新游戏",
  description: "一句话说明孩子会玩到什么。",
  subject: "数学",
  recommendedAge: "6-9 岁",
  mount(context: MountGameContext): MountedGame {
    const root = document.createElement("section");
    context.container.append(root);
    root.textContent = "游戏内容";

    return {
      destroy(): void {
        root.remove();
      }
    };
  }
};
```

接入大厅时，在 `packages/data/gameCatalog.ts` 中导入并加入 `gameCatalog`。共享题库或词库应放在 `packages/data/`，不要复制到每个游戏目录。
