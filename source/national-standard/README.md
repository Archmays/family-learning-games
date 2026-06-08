# 黄家游戏 Standards Core 依据包

生成日期：2026-06-08

这个包用于把 Family-Education-Codex 中的 
ational-standard 标准资料迁移到独立【黄家游戏】项目，作为游戏内容设定、关卡目标、任务标签、能力观察点和来源引用的依据。

## 先读哪个文件

1. huang-family-game-standards-reference.md：标准来源总览和游戏使用重点。
2. game-content-alignment-guide.md：把标准转成游戏内容设置的方法。
3. standards-source-index.csv：逐个原始文件的索引，包含包内路径和来源路径。
4. quality-and-boundary-notes.md：质量边界、证据边界和后续扩展说明。
5. vailable-standard-outcome-seeds.jsonl：当前可用的 outcome/priority seeds，不代表全量标准抽取。

## 包内结构

- original-files/source/national-standard/：完整原始标准文件，保留原目录结构。
- processed-and-indexes/：现有 processed、resource card、standards integration 和 Phase 11 审计资料。
- standards-source-index.csv：本包生成的真实路径索引。
- package_manifest.json：文件清单、hash 和校验结果。

## 使用原则

- 可以用于游戏内容设定依据：关卡目标、任务类型、能力标签、来源引用、家长说明。
- 不能用于证明孩子已经掌握某项能力。
- 不能直接当作 child-facing learning material release。
- 如果未来要把某一条标准做成正式学习活动，仍需要单独走教育专家 design gate、release review、孩子画像和真实观察证据规则。

## 当前覆盖事实

- 原始文件：383 个。
- 原始文件总量：约 278.78 MB。
- 已有标准索引：383 个 document-level cards + 58 个 existing outcome-level cards。
- 当前包额外汇总 route-level priority seeds；完整细粒度 outcome extraction 仍需未来按学科推进。
