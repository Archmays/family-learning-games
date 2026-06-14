import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type EcologyKind = "energy" | "eaten" | "helper" | "population" | "producer" | "leaf" | "habitat" | "decomposer";
type EcologyIcon = "sun" | "grass" | "bug" | "bird" | "leaf" | "microbe" | "soil" | "water" | "wood";

interface EcologyChoice {
  id: string;
  label: string;
}

interface VisualToken {
  icon: EcologyIcon;
  id: string;
  text: string;
  label: string;
  tone: "sun" | "plant" | "animal" | "soil" | "danger" | "water";
}

interface VisualArrow {
  from: string;
  to: string;
  label: string;
  tone?: "energy" | "eaten" | "change";
}

interface SceneVisual {
  tokens: VisualToken[];
  arrows: VisualArrow[];
  note: string;
}

interface EcologyScene {
  kind: EcologyKind;
  title: string;
  visual: SceneVisual;
  prompt: string;
  evidence: string;
  correctId: string;
  choices: EcologyChoice[];
}

export const ecologyScenes: EcologyScene[] = [
  {
    kind: "energy",
    title: "能量箭头",
    visual: {
      tokens: [
        { icon: "sun", id: "sun", text: "太阳", label: "能量来源", tone: "sun" },
        { icon: "grass", id: "grass", text: "草", label: "用阳光长大", tone: "plant" },
        { icon: "bug", id: "bug", text: "虫", label: "吃草叶", tone: "animal" },
        { icon: "bird", id: "bird", text: "鸟", label: "吃小虫", tone: "animal" }
      ],
      arrows: [
        { from: "太阳", to: "草", label: "给能量", tone: "energy" },
        { from: "草", to: "虫", label: "被吃", tone: "eaten" },
        { from: "虫", to: "鸟", label: "被吃", tone: "eaten" }
      ],
      note: "先找黄色能量箭头，再找谁被谁吃。"
    },
    prompt: "草长大时，能量主要来自哪里？",
    evidence: "看黄色箭头：太阳给能量，草不是在吃太阳。",
    correctId: "sun",
    choices: [
      { id: "sun", label: "太阳 / sun" },
      { id: "bird", label: "小鸟 / bird" },
      { id: "grass", label: "草 / grass" }
    ]
  },
  {
    kind: "eaten",
    title: "谁被谁吃",
    visual: {
      tokens: [
        { icon: "leaf", id: "leaf", text: "叶", label: "被虫咬", tone: "plant" },
        { icon: "bug", id: "bug", text: "虫", label: "在叶上", tone: "animal" },
        { icon: "bird", id: "bird", text: "鸟", label: "准备吃虫", tone: "animal" }
      ],
      arrows: [{ from: "虫", to: "鸟", label: "虫被鸟吃", tone: "eaten" }],
      note: "被吃箭头从食物指向吃它的动物。"
    },
    prompt: "这条“被吃”箭头表示谁被小鸟吃？",
    evidence: "箭头从虫子指向小鸟，表示虫子被小鸟吃。",
    correctId: "bug",
    choices: [
      { id: "bug", label: "虫子 / bug" },
      { id: "leaf", label: "叶子 / leaf" },
      { id: "sun", label: "太阳 / sun" }
    ]
  },
  {
    kind: "helper",
    title: "看不见的小帮手",
    visual: {
      tokens: [
        { icon: "leaf", id: "leaf", text: "落叶", label: "慢慢变碎", tone: "plant" },
        { icon: "microbe", id: "microbe", text: "微生物", label: "看不见的小帮手", tone: "soil" },
        { icon: "soil", id: "soil", text: "土壤", label: "养分变多", tone: "soil" }
      ],
      arrows: [
        { from: "落叶", to: "微生物", label: "分解", tone: "change" },
        { from: "微生物", to: "土壤", label: "变养分", tone: "change" }
      ],
      note: "有些证据看不见，但能从变化结果推理。"
    },
    prompt: "落叶慢慢变成土里的养分，少不了谁？",
    evidence: "有些小帮手看不见，但它们能帮落叶分解。",
    correctId: "microbe",
    choices: [
      { id: "flower", label: "花朵 / flower" },
      { id: "microbe", label: "微生物 / microbe" },
      { id: "cloud", label: "云 / cloud" }
    ]
  },
  {
    kind: "population",
    title: "数量变化",
    visual: {
      tokens: [
        { icon: "bird", id: "birds", text: "鸟多", label: "吃虫的变多", tone: "animal" },
        { icon: "bug", id: "bugs", text: "虫少", label: "被吃的可能变少", tone: "animal" },
        { icon: "leaf", id: "leaf", text: "叶多", label: "被咬少一点", tone: "plant" }
      ],
      arrows: [{ from: "鸟多", to: "虫少", label: "数量变化", tone: "change" }],
      note: "先找谁吃它，再想数量可能怎么变。"
    },
    prompt: "如果更多小鸟来吃虫子，虫子的数量可能怎样变？",
    evidence: "吃它的变多，被吃的通常会变少。",
    correctId: "fewer",
    choices: [
      { id: "more", label: "变多 / more" },
      { id: "fewer", label: "变少 / fewer" },
      { id: "same", label: "完全不变 / same" }
    ]
  },
  {
    kind: "producer",
    title: "谁会自己制造养分",
    visual: {
      tokens: [
        { icon: "sun", id: "sun", text: "阳光", label: "照到叶片", tone: "sun" },
        { icon: "grass", id: "grass", text: "草", label: "绿色植物", tone: "plant" },
        { icon: "bug", id: "bug", text: "虫", label: "需要找食物", tone: "animal" }
      ],
      arrows: [{ from: "阳光", to: "草", label: "帮助制造养分", tone: "energy" }],
      note: "绿色植物能利用阳光，不需要追着食物跑。"
    },
    prompt: "图里谁最像“生产者”，能用阳光帮助自己长大？",
    evidence: "草是绿色植物，能利用阳光制造养分。",
    correctId: "grass",
    choices: [
      { id: "grass", label: "草 / grass" },
      { id: "bug", label: "虫 / bug" },
      { id: "bird", label: "鸟 / bird" }
    ]
  },
  {
    kind: "leaf",
    title: "叶片证据",
    visual: {
      tokens: [
        { icon: "leaf", id: "leaf", text: "洞洞叶", label: "边缘有咬痕", tone: "plant" },
        { icon: "bug", id: "bug", text: "虫", label: "会啃叶", tone: "animal" },
        { icon: "water", id: "rain", text: "雨", label: "不会啃洞", tone: "water" }
      ],
      arrows: [{ from: "虫", to: "洞洞叶", label: "留下咬痕", tone: "change" }],
      note: "证据不是答案本身，证据能帮我们判断。"
    },
    prompt: "叶子上有小洞洞，最可能是哪条证据？",
    evidence: "洞洞和咬痕提示叶子可能被虫吃过。",
    correctId: "bug-bite",
    choices: [
      { id: "bug-bite", label: "虫咬过 / bug bite" },
      { id: "sun-bite", label: "太阳咬过 / sun bite" },
      { id: "leaf-sleep", label: "叶子睡着 / leaf sleep" }
    ]
  },
  {
    kind: "habitat",
    title: "住在哪里",
    visual: {
      tokens: [
        { icon: "water", id: "pond", text: "水边", label: "有水和湿泥", tone: "water" },
        { icon: "bug", id: "frog", text: "青蛙", label: "喜欢湿地方", tone: "animal" },
        { icon: "soil", id: "dry", text: "干地", label: "水少", tone: "danger" }
      ],
      arrows: [{ from: "水边", to: "青蛙", label: "更适合生活", tone: "change" }],
      note: "栖息地要看水、食物和躲藏处。"
    },
    prompt: "如果水边变干，青蛙可能会怎样？",
    evidence: "青蛙需要湿润的地方，水少了就不太适合生活。",
    correctId: "move",
    choices: [
      { id: "move", label: "离开找水 / move" },
      { id: "more", label: "马上变多 / more" },
      { id: "sun", label: "变成太阳 / sun" }
    ]
  },
  {
    kind: "decomposer",
    title: "枯木慢慢变软",
    visual: {
      tokens: [
        { icon: "wood", id: "wood", text: "枯木", label: "变软变碎", tone: "soil" },
        { icon: "microbe", id: "microbe", text: "微生物", label: "慢慢分解", tone: "soil" },
        { icon: "soil", id: "soil", text: "土", label: "回到土里", tone: "soil" }
      ],
      arrows: [
        { from: "枯木", to: "微生物", label: "分解", tone: "change" },
        { from: "微生物", to: "土", label: "回到土里", tone: "change" }
      ],
      note: "分解常常很慢，要看长期变化证据。"
    },
    prompt: "枯木慢慢变软、变碎，哪种解释更像证据推理？",
    evidence: "看不见的小帮手会慢慢分解枯木，让它回到土里。",
    correctId: "decompose",
    choices: [
      { id: "decompose", label: "被分解 / decompose" },
      { id: "fly", label: "飞走了 / fly" },
      { id: "paint", label: "被涂色 / paint" }
    ]
  }
];

export const ecologyEvidenceGame: GameDefinition = {
  id: "ecology-evidence",
  title: "生态证据侦探",
  description: "看生态图，圈证据，分清“被吃”和“能量来自哪里”。",
  subject: "科学",
  recommendedAge: "6-8 岁",
  learningGoal: "练习依据图像证据解释食物链、能量来源、分解者、栖息地和数量变化。",
  status: "可玩",
  playLabel: "查证据",
  mount(context: MountGameContext): MountedGame {
    return mountEcologyEvidence(context);
  }
};

function mountEcologyEvidence(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game ecology-game";
  context.container.append(root);

  let sceneIndex = 0;
  let score = 0;
  let answered = false;
  let completed = false;
  let feedback: FeedbackState = { kind: "info", text: "先看图，再点你能用证据说明的答案。" };

  const render = (): void => {
    const scene = ecologyScenes[sceneIndex];
    clearElement(root);
    root.append(createHeader("生态证据侦探", "亲子共玩：孩子先说图上证据，再点答案。"));

    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("题目", `${sceneIndex + 1}/${ecologyScenes.length}`), createStatus("证据星", score));

    if (completed) {
      root.append(stats, createCompletionCard(getEcologyCompletionSummary(score), score, ecologyScenes.length, restart, context.onExit));
      return;
    }

    const card = document.createElement("section");
    card.className = "learning-game__result ecology-card";
    const title = document.createElement("h3");
    title.textContent = scene.title;
    const prompt = document.createElement("p");
    prompt.textContent = scene.prompt;
    const evidence = document.createElement("p");
    evidence.className = "ecology-card__evidence";
    evidence.textContent = scene.evidence;
    card.append(title, createEcologyVisual(scene.visual), prompt, evidence);

    const choices = document.createElement("div");
    choices.className = "learning-game__actions learning-game__actions--wide";
    for (const choice of scene.choices) {
      choices.append(createButton(choice.label, () => choose(choice.id), { disabled: answered }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton(sceneIndex === ecologyScenes.length - 1 ? "完成本轮" : "下一题", nextScene, {
        className: "ui-button ui-button--secondary",
        disabled: !answered
      })
    );

    root.append(stats, card, choices, actions, createFeedbackBanner(feedback));
  };

  const choose = (choiceId: string): void => {
    if (answered) {
      return;
    }
    const scene = ecologyScenes[sceneIndex];
    answered = true;
    if (choiceId === scene.correctId) {
      score += 1;
      feedback = { kind: "success", text: getEcologyEvidenceFeedback(scene.kind, choiceId) };
      playFeedbackSound("success");
    } else {
      feedback = { kind: "error", text: `${getEcologyEvidenceFeedback(scene.kind, choiceId)} 再看证据：${scene.evidence}` };
      playFeedbackSound("error");
    }
    render();
  };

  const nextScene = (): void => {
    if (sceneIndex === ecologyScenes.length - 1) {
      completed = true;
      render();
      return;
    } else {
      sceneIndex += 1;
    }
    answered = false;
    feedback = { kind: "info", text: "先看图，再点你能用证据说明的答案。" };
    render();
  };

  const restart = (): void => {
    sceneIndex = 0;
    score = 0;
    answered = false;
    completed = false;
    feedback = { kind: "info", text: "先看图，再点你能用证据说明的答案。" };
    render();
  };

  render();

  return {
    destroy(): void {
      root.remove();
    }
  };
}

export function getEcologyCompletionSummary(score: number): string {
  return `完成 ${ecologyScenes.length} 个证据任务，证据星 ${score}/${ecologyScenes.length}。和孩子一起复盘：先看哪条证据，再点“重新开始”再玩一轮。`;
}

function createCompletionCard(summary: string, score: number, total: number, onRestart: () => void, onExit: () => void): HTMLElement {
  const card = document.createElement("section");
  card.className = "learning-game__result learning-game__completion";
  const title = document.createElement("h3");
  title.textContent = "本轮完成";
  const summaryText = document.createElement("p");
  summaryText.textContent = summary;
  const scoreLine = document.createElement("strong");
  scoreLine.className = "learning-game__completion-score";
  scoreLine.textContent = `证据星 ${score}/${total}`;
  const actions = document.createElement("div");
  actions.className = "learning-game__actions";
  actions.append(
    createButton("重新开始", onRestart),
    createButton("返回大厅", onExit, { className: "ui-button ui-button--secondary" })
  );
  card.append(title, summaryText, scoreLine, actions);
  return card;
}

function createHeader(titleText: string, introText: string): HTMLElement {
  const header = document.createElement("header");
  header.className = "learning-game__header";
  const title = document.createElement("h2");
  title.textContent = titleText;
  const intro = document.createElement("p");
  intro.textContent = introText;
  header.append(title, intro);
  return header;
}

function createEcologyVisual(visual: SceneVisual): HTMLElement {
  const board = document.createElement("div");
  board.className = "scene-board scene-board--ecology";

  const tokens = document.createElement("div");
  tokens.className = "scene-board__tokens";
  for (const token of visual.tokens) {
    const item = document.createElement("div");
    item.className = `scene-token scene-token--${token.tone}`;
    item.append(createEcologyIcon(token.icon));
    const text = document.createElement("strong");
    text.textContent = token.text;
    const label = document.createElement("span");
    label.textContent = token.label;
    item.append(text, label);
    tokens.append(item);
  }

  const arrows = document.createElement("div");
  arrows.className = "scene-board__arrows";
  for (const arrow of visual.arrows) {
    const item = document.createElement("span");
    item.className = `scene-arrow scene-arrow--${arrow.tone ?? "change"}`;
    item.textContent = `${arrow.from} -> ${arrow.to}: ${arrow.label}`;
    arrows.append(item);
  }

  const note = document.createElement("p");
  note.className = "scene-board__note";
  note.textContent = visual.note;
  board.append(tokens, arrows, note);
  return board;
}

function createEcologyIcon(icon: EcologyIcon): SVGSVGElement {
  const svg = createSvg();
  if (icon === "sun") {
    appendSvg(svg, "circle", { cx: "48", cy: "48", r: "18", fill: "#ffd84d", stroke: "#25313b", "stroke-width": "4" });
    for (const [x1, y1, x2, y2] of [
      [48, 10, 48, 0],
      [48, 96, 48, 86],
      [10, 48, 0, 48],
      [96, 48, 86, 48],
      [20, 20, 12, 12],
      [76, 20, 84, 12],
      [20, 76, 12, 84],
      [76, 76, 84, 84]
    ]) {
      appendSvg(svg, "line", { x1: `${x1}`, y1: `${y1}`, x2: `${x2}`, y2: `${y2}`, stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    }
    return svg;
  }
  if (icon === "grass") {
    appendSvg(svg, "rect", { x: "12", y: "70", width: "72", height: "10", rx: "5", fill: "#6bbf59", stroke: "#25313b", "stroke-width": "3" });
    for (const x of [24, 36, 48, 60, 72]) {
      appendSvg(svg, "path", { d: `M${x} 70 C${x - 10} 48 ${x - 8} 30 ${x + 2} 18 C${x + 6} 40 ${x + 8} 54 ${x} 70Z`, fill: "#8bd16f", stroke: "#25313b", "stroke-width": "3" });
    }
    return svg;
  }
  if (icon === "bug") {
    appendSvg(svg, "ellipse", { cx: "48", cy: "54", rx: "20", ry: "24", fill: "#8bd16f", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "48", cy: "26", r: "13", fill: "#a98be8", stroke: "#25313b", "stroke-width": "4" });
    for (const y of [44, 55, 66]) {
      appendSvg(svg, "line", { x1: "30", y1: `${y}`, x2: "16", y2: `${y - 8}`, stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
      appendSvg(svg, "line", { x1: "66", y1: `${y}`, x2: "80", y2: `${y - 8}`, stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    }
    appendSvg(svg, "circle", { cx: "43", cy: "24", r: "2.5", fill: "#25313b" });
    appendSvg(svg, "circle", { cx: "53", cy: "24", r: "2.5", fill: "#25313b" });
    return svg;
  }
  if (icon === "bird") {
    appendSvg(svg, "ellipse", { cx: "50", cy: "54", rx: "25", ry: "20", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "32", cy: "38", r: "13", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M66 48 C82 34 88 54 68 62", fill: "#cfe8ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M20 38 L6 32 L18 48Z", fill: "#ffd84d", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "circle", { cx: "29", cy: "35", r: "2.5", fill: "#25313b" });
    appendSvg(svg, "line", { x1: "48", y1: "74", x2: "42", y2: "86", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "58", y1: "74", x2: "64", y2: "86", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "leaf") {
    appendSvg(svg, "path", { d: "M16 54 C28 18 68 12 82 34 C66 68 34 78 16 54Z", fill: "#7fca66", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M22 56 C40 48 58 40 76 28", fill: "none", stroke: "#25313b", "stroke-width": "3", "stroke-linecap": "round" });
    appendSvg(svg, "circle", { cx: "54", cy: "38", r: "5", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "2" });
    appendSvg(svg, "circle", { cx: "42", cy: "54", r: "4", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "2" });
    return svg;
  }
  if (icon === "microbe") {
    const microbes: Array<[number, number, number, string]> = [
      [34, 38, 14, "#d9c8ff"],
      [58, 52, 18, "#c9efd2"],
      [44, 68, 12, "#ffe37a"]
    ];
    for (const [cx, cy, r, fill] of microbes) {
      appendSvg(svg, "circle", { cx: `${cx}`, cy: `${cy}`, r: `${r}`, fill, stroke: "#25313b", "stroke-width": "4" });
    }
    appendSvg(svg, "circle", { cx: "54", cy: "48", r: "3", fill: "#25313b" });
    appendSvg(svg, "circle", { cx: "64", cy: "56", r: "3", fill: "#25313b" });
    return svg;
  }
  if (icon === "water") {
    appendSvg(svg, "path", { d: "M14 58 C24 48 34 48 44 58 C54 68 64 68 82 52", fill: "none", stroke: "#2f78b8", "stroke-width": "7", "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M18 74 C30 64 42 64 54 74 C62 82 72 80 84 70", fill: "none", stroke: "#8fc7ff", "stroke-width": "7", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "wood") {
    appendSvg(svg, "rect", { x: "16", y: "34", width: "64", height: "34", rx: "16", fill: "#c99b63", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "27", cy: "51", r: "12", fill: "#ead3aa", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "circle", { cx: "27", cy: "51", r: "5", fill: "none", stroke: "#25313b", "stroke-width": "2" });
    appendSvg(svg, "line", { x1: "44", y1: "46", x2: "70", y2: "46", stroke: "#6b3f15", "stroke-width": "3", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "42", y1: "58", x2: "62", y2: "58", stroke: "#6b3f15", "stroke-width": "3", "stroke-linecap": "round" });
    return svg;
  }
  appendSvg(svg, "path", { d: "M10 76 C24 58 36 58 48 76 C60 58 72 58 86 76Z", fill: "#b98958", stroke: "#25313b", "stroke-width": "4" });
  appendSvg(svg, "circle", { cx: "32", cy: "68", r: "4", fill: "#6b3f15" });
  appendSvg(svg, "circle", { cx: "58", cy: "68", r: "5", fill: "#6b3f15" });
  return svg;
}

function createSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 96 96");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("scene-icon");
  return svg;
}

function appendSvg(parent: SVGElement, tag: string, attrs: Record<string, string>): SVGElement {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  parent.append(node);
  return node;
}

export function getEcologyEvidenceFeedback(kind: EcologyKind, answerId: string): string {
  if (kind === "energy") {
    return answerId === "sun" ? "能量来自太阳，草用阳光长大。" : "太阳不是被吃掉；这里要找能量来自哪里。";
  }
  if (kind === "eaten") {
    return answerId === "sun" ? "太阳不是被吃掉；先找“谁被谁吃”的箭头。" : "沿着箭头说：虫子被小鸟吃。";
  }
  if (kind === "helper") {
    return answerId === "microbe" ? "找到了看不见的小帮手：微生物会帮落叶分解。" : "再找看不见的小帮手，不只看明显的花和云。";
  }
  if (kind === "population") {
    return answerId === "fewer" ? "吃它的变多，被吃的虫子可能变少。" : "先想谁吃它，再判断数量会变多还是变少。";
  }
  if (kind === "producer") {
    return answerId === "grass" ? "草是绿色植物，能利用阳光帮助自己长大。" : "再找绿色植物，它最像生产者。";
  }
  if (kind === "leaf") {
    return answerId === "bug-bite" ? "洞洞和咬痕是证据，说明叶子可能被虫吃过。" : "再看叶片边缘的洞洞和咬痕。";
  }
  if (kind === "habitat") {
    return answerId === "move" ? "水少了，青蛙可能离开去找更湿的地方。" : "先看青蛙需要的栖息地证据：水和湿泥。";
  }
  return answerId === "decompose" ? "枯木慢慢变软，是被分解的长期证据。" : "再看慢慢变软、变碎、回到土里的证据。";
}
