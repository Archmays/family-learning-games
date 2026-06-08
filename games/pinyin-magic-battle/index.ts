import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { pinyinCards, type PinyinCard } from "../../packages/data/learningGames";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound, speakText } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type PinyinView = "menu" | "study" | "quiz" | "done";
type MonsterShape = "round" | "pudding" | "mushroom" | "block" | "flame" | "crystal" | "moon" | "shield" | "bolt" | "gem" | "note" | "book";
type MonsterEyes = "dot" | "sleepy" | "square" | "sparkle";
type MonsterMouth = "smile" | "fang" | "o" | "zigzag";
type MonsterDecoration =
  | "stone-horns"
  | "star-hat"
  | "leaf-ears"
  | "square-glasses"
  | "spark-tail"
  | "ice-crown"
  | "moon-wand"
  | "shield-badge"
  | "lightning-hair"
  | "gem-cheeks"
  | "music-teeth"
  | "book-cape";
type MonsterPattern = "dots" | "stars" | "leaf-veins" | "checker" | "sparks" | "cracks" | "moons" | "stripes" | "bolts" | "facets" | "notes" | "pages";

interface PinyinSave {
  bestQuizScore: number;
}

interface PinyinMonsterDefinition {
  id: string;
  name: string;
  bodyColor: string;
  bellyColor: string;
  accentColor: string;
  detailColor: string;
  shape: MonsterShape;
  eyes: MonsterEyes;
  mouth: MonsterMouth;
  decoration: MonsterDecoration;
  pattern: MonsterPattern;
}

const QUIZ_ROUNDS = 10;
const BASE_DAMAGE = 10;
const INITIAL_MONSTER_HP = 50;
const MONSTER_HP_STEP = 10;
const MAX_DAMAGE = 20;
const SVG_NS = "http://www.w3.org/2000/svg";

export const PINYIN_MONSTER_ROSTER: readonly PinyinMonsterDefinition[] = [
  {
    id: "stone-horn-gulu",
    name: "石角咕噜",
    bodyColor: "#f07f62",
    bellyColor: "#ffe7dd",
    accentColor: "#ffcf6a",
    detailColor: "#7a5a24",
    shape: "round",
    eyes: "dot",
    mouth: "smile",
    decoration: "stone-horns",
    pattern: "dots"
  },
  {
    id: "star-hat-pudding",
    name: "星帽布丁",
    bodyColor: "#f2b45f",
    bellyColor: "#fff7d7",
    accentColor: "#7b3fb2",
    detailColor: "#6b3f15",
    shape: "pudding",
    eyes: "sleepy",
    mouth: "o",
    decoration: "star-hat",
    pattern: "stars"
  },
  {
    id: "leaf-ear-momo",
    name: "叶耳蘑蘑",
    bodyColor: "#8bd39e",
    bellyColor: "#e8f8df",
    accentColor: "#227a4f",
    detailColor: "#476b2b",
    shape: "mushroom",
    eyes: "sparkle",
    mouth: "smile",
    decoration: "leaf-ears",
    pattern: "leaf-veins"
  },
  {
    id: "block-sunglasses",
    name: "方块墨镜",
    bodyColor: "#7aa6d8",
    bellyColor: "#e8f6ff",
    accentColor: "#25313b",
    detailColor: "#1f5fa8",
    shape: "block",
    eyes: "square",
    mouth: "zigzag",
    decoration: "square-glasses",
    pattern: "checker"
  },
  {
    id: "spark-tail-ya",
    name: "火花尾牙",
    bodyColor: "#ff7f4f",
    bellyColor: "#fff0d1",
    accentColor: "#c23b22",
    detailColor: "#7a2d17",
    shape: "flame",
    eyes: "dot",
    mouth: "fang",
    decoration: "spark-tail",
    pattern: "sparks"
  },
  {
    id: "blue-crystal-tuantuan",
    name: "蓝晶团团",
    bodyColor: "#7fd0e8",
    bellyColor: "#e8f6ff",
    accentColor: "#1f5fa8",
    detailColor: "#2f78b8",
    shape: "crystal",
    eyes: "sleepy",
    mouth: "smile",
    decoration: "ice-crown",
    pattern: "cracks"
  },
  {
    id: "moon-little-mage",
    name: "月牙小法师",
    bodyColor: "#b898e8",
    bellyColor: "#f4e8ff",
    accentColor: "#ffcf6a",
    detailColor: "#7b3fb2",
    shape: "moon",
    eyes: "sparkle",
    mouth: "o",
    decoration: "moon-wand",
    pattern: "moons"
  },
  {
    id: "shield-belly-pangpang",
    name: "盾肚胖胖",
    bodyColor: "#e1a05e",
    bellyColor: "#fff7d7",
    accentColor: "#2f78b8",
    detailColor: "#6b3f15",
    shape: "shield",
    eyes: "dot",
    mouth: "smile",
    decoration: "shield-badge",
    pattern: "stripes"
  },
  {
    id: "lightning-hair-fafa",
    name: "闪电发发",
    bodyColor: "#f5d04c",
    bellyColor: "#fffbe6",
    accentColor: "#c23b22",
    detailColor: "#7a5a24",
    shape: "bolt",
    eyes: "square",
    mouth: "zigzag",
    decoration: "lightning-hair",
    pattern: "bolts"
  },
  {
    id: "gem-face-lianlian",
    name: "宝石脸脸",
    bodyColor: "#7bc6b6",
    bellyColor: "#e3fff5",
    accentColor: "#7b3fb2",
    detailColor: "#227a4f",
    shape: "gem",
    eyes: "sparkle",
    mouth: "smile",
    decoration: "gem-cheeks",
    pattern: "facets"
  },
  {
    id: "music-tooth-yaya",
    name: "音符牙牙",
    bodyColor: "#95a7ff",
    bellyColor: "#eef0ff",
    accentColor: "#1f5fa8",
    detailColor: "#25313b",
    shape: "note",
    eyes: "dot",
    mouth: "fang",
    decoration: "music-teeth",
    pattern: "notes"
  },
  {
    id: "book-cape",
    name: "书斗篷",
    bodyColor: "#c99a68",
    bellyColor: "#fffdf6",
    accentColor: "#c23b22",
    detailColor: "#6b3f15",
    shape: "book",
    eyes: "sleepy",
    mouth: "smile",
    decoration: "book-cape",
    pattern: "pages"
  }
];

export const pinyinMagicBattleGame: GameDefinition = {
  id: "pinyin-magic-battle",
  title: "汉字魔法战-拼音",
  description: "看汉字、读拼音，再进入勇者试炼打败拼音怪兽。",
  subject: "识字",
  recommendedAge: "6-8 岁",
  playLabel: "练拼音",
  mount(context: MountGameContext): MountedGame {
    return mountPinyinMagicBattle(context);
  }
};

function mountPinyinMagicBattle(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game pinyin-game";
  context.container.append(root);

  let view: PinyinView = "menu";
  let studyIndex = 0;
  let target = pinyinCards[0];
  let options: PinyinCard[] = [];
  let round = 0;
  let score = 0;
  let attempts = 0;
  let streak = 0;
  let monstersDefeated = 0;
  let monsterMaxHp = INITIAL_MONSTER_HP;
  let monsterHp = INITIAL_MONSTER_HP;
  let monsterDefeated = false;
  let activeMonster: PinyinMonsterDefinition = PINYIN_MONSTER_ROSTER[0];
  let monsterOrder: PinyinMonsterDefinition[] = [...PINYIN_MONSTER_ROSTER];
  let lastDamage = 0;
  let locked = false;
  let revealAnswer = false;
  let timer: number | undefined;
  let feedback: FeedbackState = { kind: "info", text: "选择一种练习方式。" };
  const save = context.storage.get<PinyinSave>("progress", { bestQuizScore: 0 });

  const render = (): void => {
    root.className = getRootClass(view);
    clearElement(root);
    if (view === "menu") {
      renderMenu();
    } else if (view === "study") {
      renderStudy();
    } else if (view === "quiz") {
      renderQuiz();
    } else {
      renderDone();
    }
  };

  const renderMenu = (): void => {
    root.append(createHeader("汉字魔法战", "认一认汉字，听一听读音，再进入勇者试炼。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("最佳测验", save.bestQuizScore));

    const actions = document.createElement("div");
    actions.className = "learning-game__actions learning-game__actions--wide";
    actions.append(
      createButton("魔法图鉴", () => {
        view = "study";
        render();
      }, { className: "ui-button pinyin-menu-button pinyin-menu-button--study" }),
      createButton("勇者试炼", startQuiz, { className: "ui-button pinyin-menu-button pinyin-menu-button--battle" })
    );
    root.append(stats, actions);
  };

  const renderStudy = (): void => {
    const card = pinyinCards[studyIndex];
    root.append(createHeader("魔法图鉴", "每张卡片看汉字、拼音和意思。"));
    const panel = document.createElement("section");
    panel.className = "pinyin-study-card";
    const char = document.createElement("div");
    char.className = "pinyin-study-card__char";
    char.textContent = card.char;
    const pinyin = document.createElement("div");
    pinyin.className = `pinyin-study-card__pinyin ${getToneClass(card.pinyin)}`;
    pinyin.textContent = card.pinyin;
    const meaning = document.createElement("p");
    meaning.textContent = `${card.meaningCn} / ${card.meaningEn}`;
    panel.append(char, pinyin, meaning, createButton("听读音", () => speakChinese(card.char), { className: "ui-button ui-button--secondary" }));

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(
      createButton("上一个", () => {
        studyIndex = (studyIndex - 1 + pinyinCards.length) % pinyinCards.length;
        render();
      }, { className: "ui-button ui-button--secondary" }),
      createButton("下一个", () => {
        studyIndex = (studyIndex + 1) % pinyinCards.length;
        render();
      }),
      createButton("返回汉字魔法战", returnToMenu, { className: "ui-button ui-button--secondary" })
    );
    root.append(panel, actions);
  };

  const renderQuiz = (): void => {
    root.append(createHeader("勇者试炼", "选对拼音释放魔法，打败拼音怪兽。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("题目", `${round}/${QUIZ_ROUNDS}`),
      createStatus("得分", score),
      createStatus("击败", monstersDefeated),
      createStatus("连对", streak),
      createStatus("本次伤害", getPinyinDamage(streak + 1)),
      createStatus("正确率", attempts === 0 ? "暂无" : `${Math.round((score / attempts) * 100)}%`)
    );
    const prompt = createPromptCard(target, revealAnswer);
    prompt.classList.add("pinyin-prompt-card--battle");
    const monster = createMonsterStage(
      activeMonster,
      monsterDefeated ? monstersDefeated : monstersDefeated + 1,
      monsterHp,
      monsterMaxHp,
      lastDamage,
      monsterDefeated
    );
    const grid = document.createElement("div");
    grid.className = "pinyin-option-grid pinyin-option-grid--battle";
    for (const option of options) {
      grid.append(createButton(option.pinyin, () => answerQuiz(option), {
        className: `ui-button pinyin-option pinyin-option--spell ${getToneClass(option.pinyin)}${revealAnswer && option.pinyin === target.pinyin ? " is-correct" : ""}`,
        disabled: locked
      }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回汉字魔法战", returnToMenu, { className: "ui-button ui-button--secondary" }));
    root.append(stats, monster, prompt, grid, actions, createFeedbackBanner(feedback));
  };

  const renderDone = (): void => {
    root.append(createHeader("挑战结束", feedback.text));
    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("再玩一次", startQuiz), createButton("返回汉字魔法战", returnToMenu, {
      className: "ui-button ui-button--secondary"
    }));
    root.append(actions);
  };

  const returnToMenu = (): void => {
    window.clearTimeout(timer);
    locked = false;
    revealAnswer = false;
    lastDamage = 0;
    monsterDefeated = false;
    view = "menu";
    feedback = { kind: "info", text: "选择一种练习方式。" };
    render();
  };

  const resetMonster = (): void => {
    monsterMaxHp = getMonsterMaxHp(monstersDefeated);
    monsterHp = monsterMaxHp;
    monsterDefeated = false;
    activeMonster = monsterOrder[monstersDefeated % monsterOrder.length] ?? PINYIN_MONSTER_ROSTER[0];
    lastDamage = 0;
  };

  const startQuiz = (): void => {
    window.clearTimeout(timer);
    view = "quiz";
    round = 0;
    score = 0;
    attempts = 0;
    streak = 0;
    monstersDefeated = 0;
    monsterOrder = shuffle([...PINYIN_MONSTER_ROSTER]);
    resetMonster();
    feedback = { kind: "info", text: "仔细看声调，用拼音魔法攻击怪兽。" };
    nextQuizQuestion();
  };

  const nextQuizQuestion = (): void => {
    if (monsterDefeated) {
      resetMonster();
    }
    round += 1;
    target = randomCard();
    options = makeOptions(target, 4);
    locked = false;
    revealAnswer = false;
    lastDamage = 0;
    render();
  };

  const answerQuiz = (option: PinyinCard): void => {
    if (locked) {
      return;
    }
    attempts += 1;
    revealAnswer = true;

    if (option.pinyin === target.pinyin) {
      score += 1;
      streak += 1;
      lastDamage = getPinyinDamage(streak);
      monsterHp = Math.max(0, monsterHp - lastDamage);
      monsterDefeated = monsterHp === 0;
      if (monsterDefeated) {
        monstersDefeated += 1;
      }
      locked = true;
      feedback = monsterDefeated
        ? { kind: "success", text: `${target.char} 读 ${target.pinyin}，造成 ${lastDamage} 点伤害，击败 ${activeMonster.name}！` }
        : { kind: "success", text: `${target.char} 读 ${target.pinyin}，造成 ${lastDamage} 点伤害。` };
      playFeedbackSound("success");
      speakChinese(target.char);
      render();
      timer = window.setTimeout(() => {
        if (round >= QUIZ_ROUNDS) {
          finishQuiz();
          return;
        }
        nextQuizQuestion();
      }, monsterDefeated ? 1100 : 850);
      return;
    }

    streak = 0;
    lastDamage = 0;
    feedback = { kind: "error", text: `${target.char} 的正确读音是 ${target.pinyin}，伤害回到 10，请看清声调后再选一次。` };
    playFeedbackSound("error");
    render();
  };

  const finishQuiz = (): void => {
    save.bestQuizScore = Math.max(save.bestQuizScore, score);
    context.storage.set("progress", save);
    view = "done";
    feedback = { kind: "success", text: `测验完成：${score} / ${QUIZ_ROUNDS}，击败 ${monstersDefeated} 只拼音怪兽。` };
    render();
  };

  render();

  return {
    destroy(): void {
      window.clearTimeout(timer);
      window.speechSynthesis?.cancel();
      root.remove();
    }
  };
}

export function getPinyinDamage(streakAfterCorrect: number): number {
  const wholeStreak = Math.max(0, Math.floor(streakAfterCorrect));
  const bonus = Math.max(0, Math.min(wholeStreak - 1, MAX_DAMAGE - BASE_DAMAGE));
  return BASE_DAMAGE + bonus;
}

function getRootClass(view: PinyinView): string {
  if (view === "quiz" || view === "done") {
    return "learning-game pinyin-game pinyin-game--battle";
  }
  return `learning-game pinyin-game pinyin-game--${view}`;
}

function getMonsterMaxHp(monstersDefeated: number): number {
  return INITIAL_MONSTER_HP + monstersDefeated * MONSTER_HP_STEP;
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

function createMonsterStage(
  monsterDefinition: PinyinMonsterDefinition,
  monsterNumber: number,
  monsterHp: number,
  monsterMaxHp: number,
  lastDamage: number,
  defeated: boolean
): HTMLElement {
  const stage = document.createElement("section");
  stage.className = defeated ? "pinyin-monster-stage is-defeated" : "pinyin-monster-stage";
  stage.style.setProperty("--monster-hp-percent", `${Math.round((monsterHp / monsterMaxHp) * 100)}%`);

  const monster = document.createElement("div");
  monster.className = "pinyin-monster";
  monster.setAttribute("aria-hidden", "true");
  monster.append(createMonsterSvg(monsterDefinition));

  const shadow = document.createElement("div");
  shadow.className = "pinyin-monster__shadow";
  monster.append(shadow);

  const panel = document.createElement("div");
  panel.className = "pinyin-monster-panel";

  const title = document.createElement("strong");
  title.textContent = `${monsterDefinition.name} 第 ${monsterNumber} 只`;

  const health = document.createElement("div");
  health.className = "pinyin-monster-health";
  health.setAttribute("aria-label", `怪兽生命 ${monsterHp} / ${monsterMaxHp}`);

  const fill = document.createElement("div");
  fill.className = "pinyin-monster-health__fill";
  health.append(fill);

  const healthText = document.createElement("span");
  healthText.textContent = `生命 ${monsterHp} / ${monsterMaxHp}`;

  panel.append(title, health, healthText);

  if (lastDamage > 0) {
    const damage = document.createElement("em");
    damage.className = "pinyin-damage-pop";
    damage.textContent = `-${lastDamage}`;
    stage.append(damage);
  }

  stage.append(monster, panel);
  return stage;
}

function createMonsterSvg(monster: PinyinMonsterDefinition): SVGSVGElement {
  const svg = svgElement("svg", {
    class: "pinyin-monster-art",
    viewBox: "0 0 160 160",
    role: "img",
    "aria-label": monster.name
  });

  appendMonsterBody(svg, monster);
  appendMonsterPattern(svg, monster);
  appendMonsterEyes(svg, monster);
  appendMonsterMouth(svg, monster);
  appendMonsterDecoration(svg, monster);
  return svg;
}

function appendMonsterBody(svg: SVGSVGElement, monster: PinyinMonsterDefinition): void {
  const common = {
    fill: monster.bodyColor,
    stroke: "#25313b",
    "stroke-width": 5,
    "stroke-linejoin": "round",
    "stroke-linecap": "round"
  };

  if (monster.shape === "round") {
    appendSvg(svg, "path", { ...common, d: "M80 26 C112 26 134 50 132 84 C130 119 108 141 78 140 C47 139 27 116 28 82 C29 50 50 27 80 26 Z" });
  } else if (monster.shape === "pudding") {
    appendSvg(svg, "path", { ...common, d: "M37 69 C38 37 57 24 82 24 C109 24 127 42 128 70 L128 105 C128 127 108 140 80 140 C51 140 34 126 34 104 Z" });
  } else if (monster.shape === "mushroom") {
    appendSvg(svg, "path", { ...common, d: "M29 78 C34 45 55 27 84 27 C113 27 136 47 140 78 C126 92 102 95 81 91 C58 95 42 91 29 78 Z" });
    appendSvg(svg, "path", { ...common, fill: monster.bellyColor, d: "M55 82 C63 72 102 72 112 82 L116 117 C112 134 96 143 80 143 C64 143 49 134 45 117 Z" });
  } else if (monster.shape === "block") {
    appendSvg(svg, "rect", { ...common, x: 34, y: 35, width: 94, height: 100, rx: 12 });
  } else if (monster.shape === "flame") {
    appendSvg(svg, "path", { ...common, d: "M80 18 C104 46 132 55 122 95 C115 126 98 144 75 141 C50 138 33 119 35 91 C37 65 58 57 60 35 C66 45 75 43 80 18 Z" });
  } else if (monster.shape === "crystal") {
    appendSvg(svg, "polygon", { ...common, points: "80,20 124,48 136,104 104,142 57,139 28,101 38,47" });
  } else if (monster.shape === "moon") {
    appendSvg(svg, "path", { ...common, d: "M111 29 C91 38 79 58 82 83 C86 113 107 130 132 131 C119 141 103 145 84 141 C51 134 30 107 34 76 C39 43 70 22 111 29 Z" });
  } else if (monster.shape === "shield") {
    appendSvg(svg, "path", { ...common, d: "M80 23 L128 42 L124 93 C121 120 103 137 80 144 C57 137 39 120 36 93 L32 42 Z" });
  } else if (monster.shape === "bolt") {
    appendSvg(svg, "path", { ...common, d: "M92 18 L47 84 L78 84 L62 142 L120 70 L89 70 Z" });
  } else if (monster.shape === "gem") {
    appendSvg(svg, "polygon", { ...common, points: "48,34 112,34 136,70 80,144 24,70" });
  } else if (monster.shape === "note") {
    appendSvg(svg, "path", { ...common, d: "M56 37 L109 25 L109 103 C109 124 94 141 72 141 C48 141 32 126 33 104 C34 83 51 68 77 70 L77 54 L56 58 Z" });
  } else {
    appendSvg(svg, "path", { ...common, d: "M39 35 L101 28 L126 47 L126 130 L64 140 L38 121 Z" });
  }

  if (monster.shape !== "mushroom") {
    appendSvg(svg, "ellipse", {
      fill: monster.bellyColor,
      stroke: "#25313b",
      "stroke-width": 3,
      cx: 80,
      cy: 101,
      rx: 34,
      ry: 27
    });
  }
}

function appendMonsterPattern(svg: SVGSVGElement, monster: PinyinMonsterDefinition): void {
  const detail = monster.detailColor;
  if (monster.pattern === "dots") {
    appendSvg(svg, "circle", { fill: monster.accentColor, cx: 52, cy: 66, r: 8, opacity: 0.8 });
    appendSvg(svg, "circle", { fill: monster.accentColor, cx: 108, cy: 86, r: 6, opacity: 0.65 });
  } else if (monster.pattern === "stars") {
    appendStar(svg, 54, 83, 10, monster.accentColor);
    appendStar(svg, 112, 72, 7, monster.accentColor);
  } else if (monster.pattern === "leaf-veins") {
    appendSvg(svg, "path", { d: "M52 100 C72 88 94 88 112 101", fill: "none", stroke: detail, "stroke-width": 4, "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M66 91 L58 78 M91 90 L99 77", fill: "none", stroke: detail, "stroke-width": 3, "stroke-linecap": "round" });
  } else if (monster.pattern === "checker") {
    appendSvg(svg, "rect", { fill: monster.bellyColor, x: 49, y: 92, width: 18, height: 18, opacity: 0.86 });
    appendSvg(svg, "rect", { fill: monster.accentColor, x: 67, y: 110, width: 18, height: 18, opacity: 0.7 });
    appendSvg(svg, "rect", { fill: monster.bellyColor, x: 85, y: 92, width: 18, height: 18, opacity: 0.86 });
  } else if (monster.pattern === "sparks") {
    appendSvg(svg, "path", { d: "M47 91 L58 84 L54 99 L66 94", fill: "none", stroke: monster.accentColor, "stroke-width": 4, "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M104 82 L114 75 L112 90 L123 85", fill: "none", stroke: monster.accentColor, "stroke-width": 4, "stroke-linecap": "round" });
  } else if (monster.pattern === "cracks") {
    appendSvg(svg, "path", { d: "M73 45 L65 69 L78 80 L68 111", fill: "none", stroke: detail, "stroke-width": 4, "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M101 52 L91 82 L106 99", fill: "none", stroke: detail, "stroke-width": 3, "stroke-linecap": "round" });
  } else if (monster.pattern === "moons") {
    appendSvg(svg, "path", { d: "M55 94 C63 84 76 86 82 96 C72 91 62 95 57 106 Z", fill: monster.accentColor });
  } else if (monster.pattern === "stripes") {
    appendSvg(svg, "path", { d: "M49 91 H111 M53 109 H107", fill: "none", stroke: monster.accentColor, "stroke-width": 5, "stroke-linecap": "round" });
  } else if (monster.pattern === "bolts") {
    appendSvg(svg, "polyline", { points: "63,95 80,95 72,120 96,88", fill: "none", stroke: detail, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" });
  } else if (monster.pattern === "facets") {
    appendSvg(svg, "path", { d: "M48 70 L80 143 L112 70 M48 70 L80 34 L112 70", fill: "none", stroke: detail, "stroke-width": 3, opacity: 0.8 });
  } else if (monster.pattern === "notes") {
    appendSvg(svg, "path", { d: "M58 101 V78 L78 74 V95", fill: "none", stroke: detail, "stroke-width": 4, "stroke-linecap": "round" });
    appendSvg(svg, "circle", { fill: detail, cx: 57, cy: 105, r: 7 });
    appendSvg(svg, "circle", { fill: detail, cx: 78, cy: 98, r: 7 });
  } else {
    appendSvg(svg, "path", { d: "M64 45 V134 M101 30 V127 M50 65 L118 55 M49 94 L120 84", fill: "none", stroke: detail, "stroke-width": 3, "stroke-linecap": "round" });
  }
}

function appendMonsterEyes(svg: SVGSVGElement, monster: PinyinMonsterDefinition): void {
  if (monster.eyes === "sleepy") {
    appendSvg(svg, "path", { d: "M55 72 Q65 78 75 72 M93 72 Q103 78 113 72", fill: "none", stroke: "#25313b", "stroke-width": 5, "stroke-linecap": "round" });
  } else if (monster.eyes === "square") {
    appendSvg(svg, "rect", { fill: "#25313b", x: 53, y: 67, width: 17, height: 17, rx: 3 });
    appendSvg(svg, "rect", { fill: "#25313b", x: 94, y: 67, width: 17, height: 17, rx: 3 });
  } else if (monster.eyes === "sparkle") {
    appendStar(svg, 61, 73, 9, "#25313b");
    appendStar(svg, 104, 73, 9, "#25313b");
  } else {
    appendSvg(svg, "circle", { fill: "#25313b", cx: 62, cy: 73, r: 8 });
    appendSvg(svg, "circle", { fill: "#25313b", cx: 102, cy: 73, r: 8 });
  }
}

function appendMonsterMouth(svg: SVGSVGElement, monster: PinyinMonsterDefinition): void {
  if (monster.mouth === "fang") {
    appendSvg(svg, "path", { d: "M63 105 Q80 116 99 105", fill: "none", stroke: "#25313b", "stroke-width": 5, "stroke-linecap": "round" });
    appendSvg(svg, "path", { d: "M74 108 L79 121 L84 108", fill: "#fffdf6", stroke: "#25313b", "stroke-width": 3, "stroke-linejoin": "round" });
  } else if (monster.mouth === "o") {
    appendSvg(svg, "ellipse", { fill: "#25313b", cx: 82, cy: 105, rx: 10, ry: 12 });
  } else if (monster.mouth === "zigzag") {
    appendSvg(svg, "polyline", { points: "62,104 72,111 82,104 92,111 102,104", fill: "none", stroke: "#25313b", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" });
  } else {
    appendSvg(svg, "path", { d: "M63 102 Q80 116 100 102", fill: "none", stroke: "#25313b", "stroke-width": 5, "stroke-linecap": "round" });
  }
}

function appendMonsterDecoration(svg: SVGSVGElement, monster: PinyinMonsterDefinition): void {
  const common = { fill: monster.accentColor, stroke: "#25313b", "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" };
  if (monster.decoration === "stone-horns") {
    appendSvg(svg, "circle", { ...common, cx: 48, cy: 34, r: 16 });
    appendSvg(svg, "circle", { ...common, cx: 110, cy: 34, r: 16 });
  } else if (monster.decoration === "star-hat") {
    appendStar(svg, 82, 28, 18, monster.accentColor, true);
    appendSvg(svg, "rect", { ...common, x: 61, y: 43, width: 42, height: 10, rx: 5 });
  } else if (monster.decoration === "leaf-ears") {
    appendSvg(svg, "path", { ...common, d: "M38 56 C18 40 20 24 45 31 C51 43 50 51 38 56 Z" });
    appendSvg(svg, "path", { ...common, d: "M121 56 C141 40 138 24 115 31 C109 43 110 51 121 56 Z" });
  } else if (monster.decoration === "square-glasses") {
    appendSvg(svg, "rect", { fill: "none", stroke: monster.accentColor, "stroke-width": 6, x: 45, y: 61, width: 31, height: 23, rx: 4 });
    appendSvg(svg, "rect", { fill: "none", stroke: monster.accentColor, "stroke-width": 6, x: 88, y: 61, width: 31, height: 23, rx: 4 });
    appendSvg(svg, "line", { stroke: monster.accentColor, "stroke-width": 6, x1: 76, y1: 72, x2: 88, y2: 72 });
  } else if (monster.decoration === "spark-tail") {
    appendSvg(svg, "path", { ...common, d: "M117 105 C143 108 148 91 134 80 C135 98 124 89 117 105 Z" });
  } else if (monster.decoration === "ice-crown") {
    appendSvg(svg, "polygon", { ...common, points: "52,40 64,18 80,42 98,18 110,42" });
  } else if (monster.decoration === "moon-wand") {
    appendSvg(svg, "line", { stroke: monster.detailColor, "stroke-width": 5, x1: 119, y1: 45, x2: 139, y2: 20 });
    appendSvg(svg, "path", { ...common, d: "M137 13 C128 20 128 31 137 38 C126 36 119 28 121 18 C123 9 130 5 137 13 Z" });
  } else if (monster.decoration === "shield-badge") {
    appendSvg(svg, "path", { ...common, d: "M69 40 L82 35 L96 40 L93 57 C91 65 86 70 82 72 C76 69 70 64 69 57 Z" });
  } else if (monster.decoration === "lightning-hair") {
    appendSvg(svg, "polyline", { ...common, fill: "none", points: "50,42 67,18 75,44 93,18 101,45 121,28" });
  } else if (monster.decoration === "gem-cheeks") {
    appendSvg(svg, "polygon", { ...common, points: "43,91 54,82 66,91 55,101" });
    appendSvg(svg, "polygon", { ...common, points: "100,91 111,82 123,91 112,101" });
  } else if (monster.decoration === "music-teeth") {
    appendSvg(svg, "path", { d: "M111 42 V22 L130 19 V35", fill: "none", stroke: monster.accentColor, "stroke-width": 5, "stroke-linecap": "round" });
    appendSvg(svg, "circle", { fill: monster.accentColor, stroke: "#25313b", "stroke-width": 3, cx: 111, cy: 45, r: 8 });
  } else {
    appendSvg(svg, "path", { ...common, d: "M33 44 C51 22 88 18 116 31 C104 42 95 48 82 48 C64 48 51 53 33 44 Z" });
  }
}

function appendStar(svg: SVGSVGElement, cx: number, cy: number, radius: number, fill: string, withStroke = false): void {
  const points: string[] = [];
  for (let index = 0; index < 10; index += 1) {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const currentRadius = index % 2 === 0 ? radius : radius * 0.45;
    points.push(`${cx + Math.cos(angle) * currentRadius},${cy + Math.sin(angle) * currentRadius}`);
  }
  appendSvg(svg, "polygon", {
    points: points.join(" "),
    fill,
    stroke: withStroke ? "#25313b" : fill,
    "stroke-width": withStroke ? 4 : 0,
    "stroke-linejoin": "round"
  });
}

function svgElement<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string | number>): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function appendSvg<K extends keyof SVGElementTagNameMap>(
  parent: SVGElement,
  tag: K,
  attributes: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const element = svgElement(tag, attributes);
  parent.append(element);
  return element;
}

function createPromptCard(card: PinyinCard, revealAnswer: boolean): HTMLElement {
  const prompt = document.createElement("section");
  prompt.className = revealAnswer ? "pinyin-prompt-card is-revealed" : "pinyin-prompt-card";
  const char = document.createElement("strong");
  char.textContent = card.char;
  const meaning = document.createElement("span");
  meaning.textContent = `${card.meaningCn} / ${card.meaningEn}`;
  prompt.append(char, meaning);

  if (revealAnswer) {
    const pinyin = document.createElement("em");
    pinyin.className = getToneClass(card.pinyin);
    pinyin.textContent = card.pinyin;
    prompt.append(pinyin);
  }

  return prompt;
}

function makeOptions(target: PinyinCard, count: number): PinyinCard[] {
  const options = [target];
  for (const candidate of shuffle(pinyinCards)) {
    if (options.length >= count) {
      break;
    }
    if (!options.some((option) => option.pinyin === candidate.pinyin)) {
      options.push(candidate);
    }
  }
  return shuffle(options);
}

function randomCard(): PinyinCard {
  return pinyinCards[Math.floor(Math.random() * pinyinCards.length)];
}

function getToneClass(pinyin: string): string {
  if (/[āēīōūǖ]/.test(pinyin)) {
    return "tone-1";
  }
  if (/[áéíóúǘ]/.test(pinyin)) {
    return "tone-2";
  }
  if (/[ǎěǐǒǔǚ]/.test(pinyin)) {
    return "tone-3";
  }
  if (/[àèìòùǜ]/.test(pinyin)) {
    return "tone-4";
  }
  return "tone-0";
}

function speakChinese(text: string): void {
  speakText(text, "zh-CN", 0.85);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
