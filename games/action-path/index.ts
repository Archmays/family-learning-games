import { pickRoundItems, type GameDefinition, type MountGameContext, type MountedGame } from "../../packages/game-core";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound, speakText } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";
import { buildActionScenes } from "./data";

type ActionWord = "stop" | "help" | "no" | "turn";
type ActionIcon = "traffic-light" | "stop-hand" | "helper-adult" | "child" | "candy" | "hot-cup" | "queue" | "toy" | "door" | "turn-arrow";

interface ActionToken {
  icon: ActionIcon;
  text: string;
  label: string;
  tone: "road" | "safe" | "danger" | "person" | "choice";
}

interface ActionVisual {
  tokens: ActionToken[];
  pathLabel: string;
}

interface ActionScene {
  id: string;
  title: string;
  visual: ActionVisual;
  parentPrompt: string;
  correctWord: ActionWord;
  actionHint: string;
}

const actionWords: ActionWord[] = ["stop", "help", "no", "turn"];

const actionSceneSeeds: ActionScene[] = [
  {
    id: "red-light",
    title: "红灯路口",
    visual: {
      tokens: [
        { icon: "traffic-light", text: "红灯", label: "停下看灯", tone: "danger" },
        { icon: "turn-arrow", text: "脚印", label: "站在线后", tone: "road" },
        { icon: "stop-hand", text: "手掌", label: "停住动作", tone: "safe" }
      ],
      pathLabel: "看到红灯，先停住。"
    },
    parentPrompt: "家长读：红灯亮了。",
    correctWord: "stop",
    actionHint: "停住脚，手掌向前。"
  },
  {
    id: "lost",
    title: "找不到大人",
    visual: {
      tokens: [
        { icon: "child", text: "孩子", label: "站在原地", tone: "person" },
        { icon: "door", text: "服务台", label: "安全求助点", tone: "safe" },
        { icon: "helper-adult", text: "大人", label: "穿制服", tone: "person" }
      ],
      pathLabel: "找安全的大人求助。"
    },
    parentPrompt: "家长读：找不到安全的大人时，要说什么？",
    correctWord: "help",
    actionHint: "举手，找安全的大人说 help。"
  },
  {
    id: "stranger-candy",
    title: "陌生人糖果",
    visual: {
      tokens: [
        { icon: "candy", text: "糖果", label: "不确定来源", tone: "danger" },
        { icon: "stop-hand", text: "手掌", label: "拒绝", tone: "safe" },
        { icon: "helper-adult", text: "找大人", label: "回到家长旁边", tone: "person" }
      ],
      pathLabel: "不确定就先拒绝。"
    },
    parentPrompt: "家长读：陌生人给你糖果，你不想要。",
    correctWord: "no",
    actionHint: "摇头，手掌向前，说 no。"
  },
  {
    id: "uncomfortable-choice",
    title: "不舒服的选择",
    visual: {
      tokens: [
        { icon: "child", text: "不舒服", label: "身体感觉不对", tone: "danger" },
        { icon: "stop-hand", text: "说出来", label: "表达边界", tone: "safe" },
        { icon: "turn-arrow", text: "退一步", label: "保持距离", tone: "road" }
      ],
      pathLabel: "不舒服时可以拒绝。"
    },
    parentPrompt: "家长读：不想要、不安全、不舒服。",
    correctWord: "no",
    actionHint: "摇头，说 no。"
  },
  {
    id: "hot-cup",
    title: "热杯子",
    visual: {
      tokens: [
        { icon: "hot-cup", text: "热杯", label: "会烫", tone: "danger" },
        { icon: "stop-hand", text: "停止线", label: "不要伸手", tone: "road" },
        { icon: "helper-adult", text: "大人", label: "请大人拿", tone: "person" }
      ],
      pathLabel: "看到危险，先停。"
    },
    parentPrompt: "家长读：桌上有热杯子，手快碰到了。",
    correctWord: "stop",
    actionHint: "手停住，离热杯远一点。"
  },
  {
    id: "friend-falls",
    title: "朋友摔倒",
    visual: {
      tokens: [
        { icon: "child", text: "朋友", label: "摔倒了", tone: "person" },
        { icon: "stop-hand", text: "举手", label: "叫大人", tone: "safe" },
        { icon: "helper-adult", text: "医药箱", label: "需要帮助", tone: "safe" }
      ],
      pathLabel: "有人受伤，叫大人帮忙。"
    },
    parentPrompt: "家长读：朋友摔倒了，你要叫大人。",
    correctWord: "help",
    actionHint: "举手或走向安全的大人，说 help。"
  },
  {
    id: "queue-wait",
    title: "排队等待",
    visual: {
      tokens: [
        { icon: "queue", text: "队伍", label: "一个接一个", tone: "road" },
        { icon: "turn-arrow", text: "前面", label: "还没轮到", tone: "choice" },
        { icon: "child", text: "自己", label: "等一下", tone: "person" }
      ],
      pathLabel: "还没轮到，等下一个机会。"
    },
    parentPrompt: "家长读：前面还有人，现在不是你。",
    correctWord: "turn",
    actionHint: "指一指队伍，说 turn。"
  },
  {
    id: "sharing-toy",
    title: "轮流玩玩具",
    visual: {
      tokens: [
        { icon: "toy", text: "玩具", label: "大家都想玩", tone: "choice" },
        { icon: "child", text: "你", label: "玩完一轮", tone: "person" },
        { icon: "turn-arrow", text: "朋友", label: "换他试试", tone: "person" }
      ],
      pathLabel: "玩具可以轮流。"
    },
    parentPrompt: "家长读：现在换一个人来试。",
    correctWord: "turn",
    actionHint: "把玩具递过去，说 turn。"
  },
  {
    id: "door-help",
    title: "门口求助",
    visual: {
      tokens: [
        { icon: "door", text: "门口", label: "打不开", tone: "road" },
        { icon: "child", text: "孩子", label: "不硬拉", tone: "person" },
        { icon: "helper-adult", text: "大人", label: "请来帮忙", tone: "safe" }
      ],
      pathLabel: "打不开时叫大人。"
    },
    parentPrompt: "家长读：门太重，你打不开。",
    correctWord: "help",
    actionHint: "退一步，找大人说 help。"
  },
  {
    id: "next-player",
    title: "轮到下一个人",
    visual: {
      tokens: [
        { icon: "toy", text: "完成", label: "你已经试过", tone: "safe" },
        { icon: "turn-arrow", text: "箭头", label: "换下一个", tone: "road" },
        { icon: "child", text: "伙伴", label: "轮到他", tone: "person" }
      ],
      pathLabel: "完成后把机会交给下一个人。"
    },
    parentPrompt: "家长读：你玩完了，下一个人来。",
    correctWord: "turn",
    actionHint: "指向伙伴，说 turn。"
  }
];

export const ACTION_PATH_ROUND_SIZE = 10;
export const actionScenes: ActionScene[] = buildActionScenes(actionSceneSeeds);

export function pickActionPathRound(random: () => number = Math.random): ActionScene[] {
  return pickRoundItems(actionScenes, ACTION_PATH_ROUND_SIZE, random);
}

export const actionPathGame: GameDefinition = {
  id: "action-path",
  title: "Stop/Help 动作小路",
  description: "把 stop、help、no、turn 绑定到生活场景和身体动作。",
  subject: "英语",
  recommendedAge: "3-5 岁",
  learningGoal: "在成人口令和场景支持下练习安全动作词和轮流规则。",
  status: "可玩",
  playLabel: "走小路",
  mount(context: MountGameContext): MountedGame {
    return mountActionPath(context);
  }
};

function mountActionPath(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game action-path-game";
  context.container.append(root);

  let sceneIndex = 0;
  let stars = 0;
  let answered = false;
  let completed = false;
  let roundScenes = pickActionPathRound();
  let feedback: FeedbackState = { kind: "info", text: "家长读场景，孩子点英文词，也可以先做动作。" };

  const render = (): void => {
    const scene = roundScenes[sceneIndex];
    clearElement(root);
    root.append(createHeader("Stop/Help 动作小路", "RAZ aa：只用单词、短句和成人口头输入。"));

    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("场景", `${sceneIndex + 1}/${roundScenes.length}`), createStatus("星星", stars));

    if (completed) {
      root.append(stats, createCompletionCard(getActionPathCompletionSummary(stars, roundScenes.length), stars, roundScenes.length, restart, context.onExit));
      return;
    }

    const card = document.createElement("section");
    card.className = "learning-game__result action-path-card";
    const title = document.createElement("h3");
    title.textContent = scene.title;
    const parentPrompt = document.createElement("p");
    parentPrompt.textContent = scene.parentPrompt;
    const actionHint = document.createElement("p");
    actionHint.className = "action-path-card__hint";
    actionHint.textContent = scene.actionHint;
    card.append(title, createActionVisual(scene.visual), parentPrompt, actionHint);

    const choices = document.createElement("div");
    choices.className = "learning-game__actions learning-game__actions--wide";
    for (const word of actionWords) {
      choices.append(createButton(word, () => choose(word), { disabled: answered }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton("听英文", () => speakText(scene.correctWord, "en-US", 0.75), { className: "ui-button ui-button--secondary" }),
      createButton(sceneIndex === roundScenes.length - 1 ? "完成本轮" : "下一站", nextScene, {
        className: "ui-button ui-button--secondary",
        disabled: !answered
      })
    );

    root.append(stats, card, choices, actions, createFeedbackBanner(feedback));
  };

  const choose = (word: ActionWord): void => {
    if (answered) {
      return;
    }
    const scene = roundScenes[sceneIndex];
    answered = true;
    if (word === scene.correctWord) {
      stars += 1;
      feedback = { kind: "success", text: getActionPathFeedback(word, scene.id) };
      playFeedbackSound("success");
      speakText(word, "en-US", 0.75);
    } else {
      feedback = { kind: "error", text: `${getActionPathFeedback(scene.correctWord, scene.id)} 这次场景更适合 ${scene.correctWord}。` };
      playFeedbackSound("error");
    }
    render();
  };

  const nextScene = (): void => {
    if (sceneIndex === roundScenes.length - 1) {
      completed = true;
      render();
      return;
    } else {
      sceneIndex += 1;
    }
    answered = false;
    feedback = { kind: "info", text: "家长读场景，孩子点英文词，也可以先做动作。" };
    render();
  };

  const restart = (): void => {
    roundScenes = pickActionPathRound();
    sceneIndex = 0;
    stars = 0;
    answered = false;
    completed = false;
    feedback = { kind: "info", text: "家长读场景，孩子点英文词，也可以先做动作。" };
    render();
  };

  render();

  return {
    destroy(): void {
      window.speechSynthesis?.cancel();
      root.remove();
    }
  };
}

export function getActionPathCompletionSummary(stars: number, total: number = actionScenes.length): string {
  return `完成 ${total} 个动作场景，星星 ${stars}/${total}。请孩子复述 stop、help、no、turn，再点“重新开始”再走一轮。`;
}

function createCompletionCard(summary: string, stars: number, total: number, onRestart: () => void, onExit: () => void): HTMLElement {
  const card = document.createElement("section");
  card.className = "learning-game__result learning-game__completion";
  const title = document.createElement("h3");
  title.textContent = "小路走完";
  const summaryText = document.createElement("p");
  summaryText.textContent = summary;
  const scoreLine = document.createElement("strong");
  scoreLine.className = "learning-game__completion-score";
  scoreLine.textContent = `星星 ${stars}/${total}`;
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

function createActionVisual(visual: ActionVisual): HTMLElement {
  const board = document.createElement("div");
  board.className = "scene-board scene-board--action";
  const path = document.createElement("div");
  path.className = "scene-path";
  path.textContent = visual.pathLabel;

  const tokens = document.createElement("div");
  tokens.className = "scene-board__tokens";
  for (const token of visual.tokens) {
    const item = document.createElement("div");
    item.className = `scene-token scene-token--${token.tone}`;
    item.append(createActionIcon(token.icon));
    const text = document.createElement("strong");
    text.textContent = token.text;
    const label = document.createElement("span");
    label.textContent = token.label;
    item.append(text, label);
    tokens.append(item);
  }

  board.append(path, tokens);
  return board;
}

function createActionIcon(icon: ActionIcon): SVGSVGElement {
  const svg = createSvg();
  if (icon === "traffic-light") {
    appendSvg(svg, "rect", { x: "34", y: "10", width: "28", height: "70", rx: "12", fill: "#25313b" });
    appendSvg(svg, "circle", { cx: "48", cy: "26", r: "8", fill: "#e84d3c" });
    appendSvg(svg, "circle", { cx: "48", cy: "46", r: "8", fill: "#ffd84d" });
    appendSvg(svg, "circle", { cx: "48", cy: "66", r: "8", fill: "#6bbf59" });
    appendSvg(svg, "line", { x1: "48", y1: "80", x2: "48", y2: "92", stroke: "#25313b", "stroke-width": "5", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "stop-hand") {
    appendSvg(svg, "path", { d: "M28 74 V36 C28 28 40 28 40 36 V58 V24 C40 16 52 16 52 24 V56 V30 C52 22 64 22 64 30 V60 V40 C64 32 76 34 76 44 V64 C76 80 64 88 50 88 H44 C34 88 28 82 28 74Z", fill: "#ffd3c7", stroke: "#25313b", "stroke-width": "4", "stroke-linejoin": "round" });
    appendSvg(svg, "line", { x1: "18", y1: "18", x2: "78", y2: "78", stroke: "#c23b22", "stroke-width": "7", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "helper-adult") {
    appendSvg(svg, "circle", { cx: "48", cy: "24", r: "13", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M24 82 C28 54 68 54 72 82Z", fill: "#d9c8ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "rect", { x: "36", y: "46", width: "24", height: "12", rx: "4", fill: "#fffdf6", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "text", { x: "48", y: "56", "text-anchor": "middle", "font-size": "10", "font-weight": "900", fill: "#25313b" }).textContent = "HELP";
    return svg;
  }
  if (icon === "child") {
    appendSvg(svg, "circle", { cx: "48", cy: "26", r: "12", fill: "#ffe37a", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M32 82 L38 46 H58 L64 82Z", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "4", "stroke-linejoin": "round" });
    appendSvg(svg, "line", { x1: "38", y1: "52", x2: "22", y2: "66", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    appendSvg(svg, "line", { x1: "58", y1: "52", x2: "74", y2: "66", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "candy") {
    appendSvg(svg, "polygon", { points: "18,48 34,36 34,60", fill: "#ffd84d", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "rect", { x: "34", y: "34", width: "28", height: "28", rx: "8", fill: "#ff9db2", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "polygon", { points: "62,36 80,48 62,60", fill: "#ffd84d", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "line", { x1: "40", y1: "60", x2: "56", y2: "34", stroke: "#fffdf6", "stroke-width": "5", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "hot-cup") {
    appendSvg(svg, "path", { d: "M26 40 H62 V68 C62 78 54 84 44 84 C34 84 26 78 26 68Z", fill: "#ffe37a", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "path", { d: "M62 48 H76 C82 48 82 64 62 64", fill: "none", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    for (const x of [34, 48, 62]) {
      appendSvg(svg, "path", { d: `M${x} 30 C${x - 6} 22 ${x + 6} 18 ${x} 10`, fill: "none", stroke: "#c23b22", "stroke-width": "4", "stroke-linecap": "round" });
    }
    return svg;
  }
  if (icon === "queue") {
    const people: Array<[number, string]> = [
      [28, "#ffe37a"],
      [48, "#8fc7ff"],
      [68, "#d9c8ff"]
    ];
    for (const [cx, fill] of people) {
      appendSvg(svg, "circle", { cx: `${cx}`, cy: "30", r: "9", fill, stroke: "#25313b", "stroke-width": "3" });
      appendSvg(svg, "path", { d: `M${cx - 10} 72 C${cx - 8} 48 ${cx + 8} 48 ${cx + 10} 72Z`, fill, stroke: "#25313b", "stroke-width": "3" });
    }
    appendSvg(svg, "line", { x1: "18", y1: "82", x2: "78", y2: "82", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "toy") {
    appendSvg(svg, "rect", { x: "24", y: "34", width: "48", height: "36", rx: "10", fill: "#d9c8ff", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "38", cy: "52", r: "6", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "circle", { cx: "58", cy: "52", r: "6", fill: "#ff9db2", stroke: "#25313b", "stroke-width": "3" });
    appendSvg(svg, "line", { x1: "48", y1: "34", x2: "48", y2: "18", stroke: "#25313b", "stroke-width": "4", "stroke-linecap": "round" });
    return svg;
  }
  if (icon === "door") {
    appendSvg(svg, "rect", { x: "30", y: "14", width: "38", height: "68", rx: "4", fill: "#ead3aa", stroke: "#25313b", "stroke-width": "4" });
    appendSvg(svg, "circle", { cx: "58", cy: "50", r: "4", fill: "#25313b" });
    appendSvg(svg, "rect", { x: "24", y: "82", width: "52", height: "8", rx: "4", fill: "#8fc7ff", stroke: "#25313b", "stroke-width": "3" });
    return svg;
  }
  appendSvg(svg, "path", { d: "M18 52 H66", fill: "none", stroke: "#25313b", "stroke-width": "7", "stroke-linecap": "round" });
  appendSvg(svg, "path", { d: "M54 34 L74 52 L54 70", fill: "none", stroke: "#25313b", "stroke-width": "7", "stroke-linecap": "round", "stroke-linejoin": "round" });
  appendSvg(svg, "circle", { cx: "26", cy: "52", r: "10", fill: "#fff1b8", stroke: "#25313b", "stroke-width": "4" });
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

export function getActionPathFeedback(word: ActionWord, sceneId: string): string {
  if (word === "stop") {
    return sceneId === "red-light" ? "红灯场景要停下：stop。" : "stop 是停下来的动作词。";
  }
  if (word === "help") {
    return sceneId === "lost" ? "找不到大人时，找安全的大人说 help。" : "help 是需要帮助时说的词。";
  }
  if (word === "no") {
    return "不舒服、不安全、不想要时，可以说 no。";
  }
  return "轮流时说 turn，把机会交给下一个人。";
}
