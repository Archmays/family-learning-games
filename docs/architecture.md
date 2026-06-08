# 家庭游戏总项目架构

## 当前架构

本项目采用一个 Vite + TypeScript 前端应用承载多个家庭小游戏。根入口仍是 `index.html` 和 `src/main.ts`，但 `src/main.ts` 现在只负责挂载 `apps/hub/` 中的游戏大厅。

大厅通过统一的游戏定义列表展示可玩游戏，并把每个游戏挂载到同一个页面容器中。游戏退出时销毁自身资源，再回到大厅。

## 目录职责

- `apps/hub/`：统一游戏大厅，负责游戏列表、进入游戏、返回大厅。
- `games/`：独立小游戏目录。每个游戏暴露一个 `GameDefinition`。
- `packages/game-core/`：共享挂载接口、游戏定义类型和 localStorage 存档封装。
- `packages/ui/`：共享 DOM UI 元素。
- `packages/data/`：共享数据和大厅游戏目录。
- `assets/`：长期共享的图片和音效源文件。
- `public/`：Vite 运行时静态资源。现有 Phaser 游戏继续从这里加载图片和 JSON。
- `src/game/`：现有 Phaser 数学游戏实现。
- `tests/`：现有单元测试和内容校验。

## 过渡策略

现有数学游戏已经和 `src/game/`、`public/assets/`、`public/data/`、Vitest 测试紧密耦合。为降低风险，当前不物理迁移这些文件，而是在 `games/math-lab/` 中创建适配层，负责创建 `#game-root` 并启动现有 Phaser 配置。

后续如果需要把数学游戏完全迁入 `games/math-lab/`，应单独规划迁移步骤，并先保证测试覆盖资源路径、场景启动和存档兼容。

## 新游戏接入流程

1. 在 `games/新游戏名/` 下创建游戏实现。
2. 导出一个 `GameDefinition`，实现 `mount(context)`。
3. 需要共享数据时放到 `packages/data/`。
4. 需要共享 UI 或存档能力时复用 `packages/ui/` 和 `packages/game-core/`。
5. 在 `packages/data/gameCatalog.ts` 中加入新游戏定义。
6. 运行测试、类型检查、构建，并手动检查大厅入口。
