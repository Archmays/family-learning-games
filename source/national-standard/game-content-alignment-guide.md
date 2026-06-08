# 游戏内容对齐指南

生成日期：2026-06-08

## 1. 对齐原则

游戏设计不要直接照搬标准文本。更合适的做法是把标准转成“孩子在游戏中能做出的可观察行为”。

推荐字段：

`json
{
  "game_objective_id": "game.std.sci.observe-explain.001",
  "subject": "science",
  "alignment_depth": "route_seed_or_document_reference",
  "standard_refs": ["source/national-standard/..."],
  "player_action": "观察、比较、选择证据并说出理由",
  "observable_evidence": ["选择了证据", "说出一个原因", "修改了模型"],
  "not_progress_evidence": true
}
`

## 2. 从标准到游戏任务

| 标准能力 | 游戏任务设计 | 可以记录的游戏表现 | 不能记录成什么 |
| --- | --- | --- | --- |
| 观察 | 找不同、排序、采集线索、描述变化 | 观察到的特征、比较依据 | 稳定科学掌握 |
| 提问 | 选择可验证问题、把大问题拆小 | 问题类型、是否可观察 | 独立探究能力结论 |
| 证据判断 | 选择支持某个解释的线索 | 证据选择和理由 | 标准达成证明 |
| 建模 | 用图、积木、符号或规则表示关系 | 模型是否表达关键关系 | 正式学业评价 |
| 数学表示 | 用数、图形、线段、表格表达 | 表示方式和策略 | 数学能力等级 |
| 表达沟通 | 复述、解释选择、给角色写一句话 | 句子、关键词、表达意愿 | 长期语言水平 |
| 修改迭代 | 根据反馈修正答案、模型或作品 | 修正前后差异 | 稳定自我管理结论 |
| AI/信息判断 | 比较人工判断与工具输出 | 是否检查来源和结果 | AI 素养达成 |

## 3. 对齐深度标签

| 标签 | 含义 | 适用场景 |
| --- | --- | --- |
| document_reference | 只引用标准文件或体系 | 新游戏主题立项、粗粒度依据 |
| oute_priority_seed | 使用本包 priority seeds | 通用关卡目标和能力标签 |
| existing_outcome_seed | 使用现有 58 条 outcome-level records | English/Maths 低龄相关任务 |
| road_crosswalk | broad retrieval 对齐，无 exact code | 科学主题和教材相关任务 |
| exact_outcome_crosswalk_pending | 需要未来专项抽取 | 要做正式课程对齐或评估时 |

## 4. 推荐的游戏模块映射

| 游戏模块 | 首选标准依据 | 任务例子 | 观察记录重点 |
| --- | --- | --- | --- |
| 科学探索 | China 2022 Science、IB PYP Science、NGSS/CA NGSS | 观察植物、选择证据、解释变化 | 孩子的描述、证据选择、支持程度 |
| 数学冒险 | China 2022 Math、Singapore Math、CCSS Math | 数量比较、形状旋转、测量估计、图表读取 | 表示方式、策略、错误类型 |
| 语言故事 | China 2022 Chinese、IB PYP Language、CCSS ELA | 复述故事、选关键词、给角色回应 | 口头表达、理解线索、句子质量 |
| 英文轻任务 | China 2022 English、PYP Language、CCSS ELA | 听词点选、短句回应、图文匹配 | RAZ 级别是否合适、是否愿意回应 |
| AI/计算挑战 | BC ADST、Singapore Computing、China Information Technology | 排规则、调试、真假信息判断 | 是否先观察、是否检查工具输出 |
| 艺术与身体 | PYP Arts/PSPE、BC Arts/PE、Singapore Art/PE | 节奏、动作、造型、合作规则 | 参与、表达、协作和安全边界 |

## 5. Progress 边界

游戏日志可以作为未来观察线索，但不能自动写入正式 progress ledger。要进入正式学习记录，仍需要家长提供真实观察、孩子原话、作品截图说明、支持程度和日期。
