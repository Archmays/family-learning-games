# 学习游戏 Standards Core 依据参考

生成日期：2026-06-08

## 1. 这个包解决什么问题

儿童学习游戏需要把日常学习内容转化为可玩的任务。这个包提供 standards source basis：让游戏里的关卡、任务、能力标签和家长说明能够追溯到课程标准资料，而不是凭空设计。

本包不是完整 outcome 数据库。它的定位是依据包：保留 national-standard 原始资料，同时附上现有标准索引、已抽取的 outcome seeds、优先路线 seeds 和使用边界。

## 2. 标准来源覆盖

| 标准体系 / collection | 文件数 | 大小 MB | 文件类型 |
| --- | ---: | ---: | --- |
| australian-curriculum-v9 | 1 | 2.36 | xlsx:1 |
| canada-bc-curriculum | 234 | 31.88 | docx:210, pdf:24 |
| ccss | 7 | 29.8 | pdf:7 |
| china-2022 | 17 | 6.82 | docx:17 |
| ibpyp | 14 | 23.78 | pdf:14 |
| ngss | 23 | 15.71 | pdf:22, txt:1 |
| ngss-for-Ca | 51 | 95.21 | doc:48, pdf:2, txt:1 |
| singapore-moe | 36 | 73.23 | pdf:36 |

原始文件总量：383 个，约 278.78 MB。

## 3. 当前结构化程度

| 层级 | 当前状态 | 可怎么用 | 不应怎么用 |
| --- | --- | --- | --- |
| 原始标准文件 | 全量保留 383 个 | 查完整原文、做后续 outcome 抽取 | 不直接当成游戏关卡文本 |
| document-level cards | 383 个 | 查标准来源、collection、文件标题、粗略学科 | 不声称已经完成细粒度标准对齐 |
| existing outcome-level cards | 58 个 | English Foundation/L1、Math lower-primary 等已整理目标参考 | 不外推到全部学科 |
| route-level priority seeds | 5 个 | 游戏内容设计的优先能力方向 | 不替代正式 outcome code |
| OIPS science broad crosswalk | 390 条 | 科学教材与标准的 broad retrieval 参考 | 不声称 exact standard code |

## 4. 游戏内容设计重点

| 方向 | 标准强调 | 游戏项目可转化为 |
| --- | --- | --- |
| science | 科学观察、提问、证据、模型、解释、工程设计与生命/物质/地球系统主题。 | 探索关卡、收集证据任务、实验前置判断、模型解释与系统变化任务。 |
| maths | 数量表示、比较、几何、测量、数据、模式和推理。 | 数感关卡、策略选择、空间/形状挑战、测量估计和多解法解释。 |
| chinese | 阅读、复述、表达、书写、文化理解和真实情境沟通。 | 故事理解、选择理由、角色表达、线索整理和创作任务。 |
| english | 双语输入输出、听说回应、短句框架、图文理解和自信表达。 | 低负担英文标签、口头回应、听音选择、句型奖励和中英对照提示。 |
| computing_ai | 计算思维、设计、调试、信息判断、AI 工具边界和安全。 | 规则设计、模式识别、调试任务、信息真假判断和 AI 辅助创作前后比较。 |
| arts_design_pe_social | 艺术表达、身体活动、社会情感、公民意识和跨学科项目。 | 创作、节奏、动作、造型、协作规则和公共问题讨论。 |

## 5. 推荐给游戏项目的数据用法

- 关卡元数据：记录 standard_source_collection、standard_source_path、standard_resource_id、alignment_depth。
- 任务目标：使用可观察动作，例如“观察并比较”“说出理由”“用图表示”“选择证据”“修改方案”。
- 能力标签：区分 knowledge、skill、practice、inquiry、expression、media/AI literacy。
- 家长说明：说明该关卡参考了哪些标准资料，但不写成孩子已经掌握。
- 后续扩展：如果某个游戏模块需要高精度标准对齐，先按学科抽取 outcome，再建立 game-objective crosswalk。

## 6. Canada BC 路径说明

现有 `resource-cards-full-national-standard.jsonl` 中，部分 Canada BC document card 的 source_path 使用旧目录名。包内 `standards-source-index.csv` 使用实际存在的包内路径。

游戏项目导入时应优先使用 `standards-source-index.csv` 的 actual_source_path 和 package_path。

## 7. 建议的后续学科扩展顺序

1. Science：先抽取低龄观察、证据、解释和工程设计 outcome。
2. Maths：继续完善 lower-primary 和空间、测量、数据相关 game objectives。
3. Chinese：抽取阅读、复述、表达、文化理解和书写相关 outcome。
4. English：保持中英双语和孩子级别控制，游戏内英文只做低负担输入输出。
5. Computing / AI：围绕信息判断、隐私、安全、调试、AI 辅助与人工责任设计。
