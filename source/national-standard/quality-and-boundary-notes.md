# Quality And Boundary Notes

生成日期：2026-06-08

## 当前质量状态

- `source/national-standard/` 原始文件：383 个，已完整打包。
- processed layer：存在，但只有少量 processed 文件。
- `knowledge/cards/resource-cards-full-national-standard.jsonl`：441 条，其中 383 条 document-level cards，58 条 existing outcome-level cards。
- standards alignment status：document_level_plus_partial_outcomes。
- full outcome extraction：pending。

## Document-level 与 Outcome-level 的区别

- document-level：说明某个标准文件存在、属于哪个 collection、可能关联哪些学科。它适合做来源索引。
- outcome-level：说明一个具体标准目标的摘要、学科、阶段、能力标签和来源位置。它才适合做较精确的目标对齐。
- 本包目前只有部分 outcome-level seeds，不能假装所有标准都已经细粒度抽取完成。

## 禁止误用

- 不把标准对齐写成孩子掌握。
- 不把游戏完成写成学业达标。
- 不把 document-level card 写成 exact outcome。
- 不从本包直接生成 child-facing final learning material。
- 不写入正式学习记录。

## Canada BC 路径风险

现有 national-standard card 中部分 Canada BC source_path 仍指向旧目录名。包内 `standards-source-index.csv` 使用文件系统实际路径，并在 notes 字段中标记旧路径情况。

## 后续扩展建议

如果学习游戏需要某个主题做到正式课程对齐，应按下面顺序扩展：

1. 选定一个 subject 和 age band。
2. 从原始标准文件抽取 outcome-level records。
3. 建立 game objective crosswalk。
4. 标注 alignment strength 和 uncertainty。
5. 在游戏中只记录 observable gameplay evidence，不自动写 learning progress。
