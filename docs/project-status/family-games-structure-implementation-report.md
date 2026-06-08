# 家庭游戏总项目结构实施报告

## 本次修改

- 将 `src/main.ts` 从直接启动 Phaser 改为挂载 `apps/hub/` 游戏大厅。
- 更新 `index.html`，根页面只保留 `#app` 容器。
- 更新 `src/styles.css`，支持大厅、统一游戏运行容器、DOM 记忆翻牌游戏和现有 Phaser 画布。
- 更新 `tsconfig.json`，让 TypeScript 覆盖 `apps/`、`games/`、`packages/`。
- 新建根目录 `AGENTS.md`，写入家庭游戏项目规则。

## 文件清单

- `index.html`
- `src/main.ts`
- `src/styles.css`
- `tsconfig.json`
- `AGENTS.md`
- `apps/hub/index.ts`
- `games/memory-card/index.ts`
- `games/memory-card/README.md`
- `games/memory-card/AGENTS.md`
- `games/math-lab/index.ts`
- `games/math-lab/README.md`
- `games/math-lab/AGENTS.md`
- `packages/game-core/index.ts`
- `packages/ui/index.ts`
- `packages/data/index.ts`
- `packages/data/gameCatalog.ts`
- `packages/data/memoryCards.ts`
- `assets/images/README.md`
- `assets/sounds/README.md`
- `docs/architecture.md`
- `docs/game-template.md`
- `docs/project-status/family-games-structure-implementation-report.md`
- `dist/index.html`
- `dist/assets/index-BvA1-4n2.css`
- `dist/assets/index-BwSZrgCH.js`

## 新建目录

- `apps/hub/`
- `games/memory-card/`
- `games/math-lab/`
- `packages/ui/`
- `packages/game-core/`
- `packages/data/`
- `assets/images/`
- `assets/sounds/`
- `docs/project-status/`

## 当前如何运行

首选命令：

```powershell
pnpm dev
```

当前机器的 PATH 中没有 `pnpm` 和 `npm` 时，可使用本地依赖和 Codex 内置 Node：

```powershell
& 'C:\Users\mays-\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
```

然后打开 `http://127.0.0.1:5173`。

## 如何新增一个游戏

1. 在 `games/新游戏名/` 下创建游戏实现。
2. 导出 `GameDefinition`，实现 `mount(context)` 和 `destroy()`。
3. 共享 UI 使用 `packages/ui/`。
4. 共享存档、计分和挂载类型使用 `packages/game-core/`。
5. 共享题库、词库和游戏目录放入 `packages/data/`。
6. 在 `packages/data/gameCatalog.ts` 中加入新游戏。
7. 运行测试、类型检查和构建，手动检查大厅入口。

## 暂时占位

- `assets/images/` 和 `assets/sounds/` 目前只建立目录说明，现有运行时素材仍保留在 `public/assets/`。
- `games/math-lab/` 目前是现有 Phaser 数学游戏的适配层，真实实现仍在 `src/game/`。
- `packages/game-core/` 目前只包含最小挂载接口和 localStorage 封装，后续可按实际需求增加计时器、难度和统一计分。

## 验证结果

- 类型检查通过：`node .\node_modules\typescript\bin\tsc --noEmit`。
- 单元测试通过：`node .\node_modules\vitest\vitest.mjs run`，3 个测试文件、22 个测试全部通过。
- 构建通过：`node .\node_modules\vite\bin\vite.js build --emptyOutDir false`。
- 构建警告：主 JS chunk 超过 500 kB，主要来自现有 Phaser 依赖；当前不影响运行。
- 浏览器检查通过：`http://127.0.0.1:5173/` 可打开家庭游戏大厅。
- 大厅检查通过：`记忆翻牌` 和 `数学实验室` 两个入口可见。
- 记忆翻牌检查通过：8 张卡片可渲染，翻两张后步数更新，可返回大厅。
- 数学实验室检查通过：现有 Phaser 游戏画布可渲染，可返回大厅，控制台无错误或警告。
- 移动尺寸检查通过：390px 宽度下大厅和记忆翻牌无横向溢出。

## 后续建议

- 为大厅增加玩家选择、家长设置和统一存档查看。
- 为每个新游戏补最小测试，至少覆盖核心计分和完成条件。
- 如果数学游戏继续扩展，再单独规划从 `src/game/` 到 `games/math-lab/` 的小步迁移。
- 为题库建立命名规范和内容校验规则，避免不同游戏重复维护数据。

## 风险

- 当前目录不是 Git 仓库，无法直接用 `git status` 或 `git diff` 审核本次改动。
- 现有数学游戏依赖 Phaser 和 `public/` 下的静态资源路径，因此本次没有迁移其真实实现。
- 本次构建为了遵守“不删除现有文件”，使用了 `--emptyOutDir false`，因此 `dist/assets/` 中会保留旧 bundle 和新 bundle。
- 当前未新增自动化浏览器测试，浏览器交互已通过本地检查验证。

## git diff 审核建议命令

如果后续把当前目录纳入 Git，可使用：

```powershell
git status --short
git diff -- apps games packages assets docs src index.html tsconfig.json AGENTS.md
```
