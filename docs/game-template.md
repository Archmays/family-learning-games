# 新增游戏模板

新增游戏时保持最小可维护结构。先让游戏能在大厅里进入、玩、退出，再按实际需要增加数据、素材或测试。

## 推荐目录

```text
games/new-game/
  README.md
  index.ts
  game-data.ts
  assets/
```

小型游戏可以只创建 `README.md` 和 `index.ts`。不要为了占位创建空目录或空组件。

## README 必填内容

每个游戏的 `README.md` 应包含：

- 游戏目标：孩子通过游戏练习什么。
- 适合对象：年龄、基础要求和是否适合亲子共玩。
- 玩法说明：玩家每一步要做什么。
- 涉及知识点：学科、技能点、题库或词库来源。
- 设备适配：鼠标、触控、键盘、音频、横屏或竖屏要求。
- 当前完成度：例如 `可玩原型`、`可玩`、`持续优化`。
- 后续改进建议：只写明确有价值的下一步。
- 接入方式：导出的 `GameDefinition` 名称和 catalog 注册位置。

## index.ts 示例

```ts
import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";

export const newGame: GameDefinition = {
  id: "new-game",
  title: "新游戏",
  description: "一句话说明孩子会玩到什么。",
  subject: "数学",
  recommendedAge: "6-9 岁",
  learningGoal: "练习一个明确的知识点或能力。",
  status: "可玩原型",
  mount(context: MountGameContext): MountedGame {
    const root = document.createElement("section");
    root.className = "learning-game";
    root.textContent = "游戏内容";
    context.container.append(root);

    return {
      destroy(): void {
        root.remove();
      }
    };
  }
};
```

## 接入步骤

1. 在 `games/新游戏名/` 下实现游戏。
2. 导出一个完整的 `GameDefinition`。
3. 在 `packages/data/gameCatalog.ts` 中导入并加入 `gameCatalog`。
4. 如果有共享题库或词库，放到 `packages/data/`；单游戏专用数据放在该游戏目录。
5. 如果有运行时图片或 JSON，放到 `public/` 下，并使用相对路径加载。
6. 运行 `pnpm test` 和 `pnpm build`。
7. 手动检查大厅、新游戏入口、进入游戏、返回大厅和手机宽度显示。

## 不要做的事

- 不要为一个游戏复制公共逻辑。
- 不要为单次使用新增抽象。
- 不要把游戏依赖写成本机绝对路径。
- 不要引入登录、广告、支付、联网学习记录或复杂后端。
- 不要把临时截图或生成中间文件放进 Git。
