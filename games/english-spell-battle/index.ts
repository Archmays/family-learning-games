import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { englishWordCategories, englishWords, type EnglishWord } from "../../packages/data/learningGames";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound, speakText } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type EnglishView = "menu" | "study" | "battle" | "done";

interface LetterTile {
  id: string;
  letter: string;
  used: boolean;
}

interface EnglishSave {
  bestScore: number;
  wins: number;
}

export const englishSpellBattleGame: GameDefinition = {
  id: "english-spell-battle",
  title: "英文魔法战",
  description: "看图听词，从首字母到完整拼写逐步练习 Raz aa-A 词汇。",
  subject: "英语",
  recommendedAge: "5-9 岁",
  learningGoal: "通过图像、发音和拼写练习常见英语词汇。",
  status: "可玩",
  playLabel: "开始拼写",
  mount(context: MountGameContext): MountedGame {
    return mountEnglishSpellBattle(context);
  }
};

function mountEnglishSpellBattle(context: MountGameContext): MountedGame {
  const root = document.createElement("section");
  root.className = "learning-game english-spell-game";
  context.container.append(root);

  let view: EnglishView = "menu";
  let level = 1;
  let queue: EnglishWord[] = [];
  let current: EnglishWord = englishWords[0];
  let tiles: LetterTile[] = [];
  let input = "";
  let round = 0;
  let score = 0;
  let attempts = 0;
  let streak = 0;
  let revealWord = false;
  let locked = false;
  let feedback: FeedbackState = { kind: "info", text: "选择一个关卡开始。" };
  let timer: number | undefined;
  const roundsPerGame = 8;
  const save = context.storage.get<EnglishSave>("progress", { bestScore: 0, wins: 0 });

  const render = (): void => {
    clearElement(root);
    if (view === "menu") {
      renderMenu();
    } else if (view === "study") {
      renderStudy();
    } else if (view === "battle") {
      renderBattle();
    } else {
      renderDone();
    }
  };

  const renderMenu = (): void => {
    root.append(createHeader("英文魔法战", "先看图鉴，再选择适合的拼写挑战。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("最佳", save.bestScore), createStatus("通关", save.wins));

    const actions = document.createElement("div");
    actions.className = "learning-game__actions learning-game__actions--wide";
    actions.append(
      createButton("魔法图鉴", () => {
        view = "study";
        render();
      }),
      createButton("Level 1 首字母", () => startBattle(1)),
      createButton("Level 2 乱序拼写", () => startBattle(2)),
      createButton("Level 3 完整拼写", () => startBattle(3))
    );
    root.append(stats, actions);
  };

  const renderStudy = (): void => {
    root.append(createHeader("魔法图鉴", "点单词可以听一听，也可以直接进入挑战。"));
    const list = document.createElement("div");
    list.className = "english-study-list";
    for (const category of englishWordCategories) {
      const group = document.createElement("section");
      group.className = "english-study-group";
      const title = document.createElement("h3");
      title.textContent = category.title;
      const grid = document.createElement("div");
      grid.className = "english-word-grid";
      for (const word of category.words) {
        const card = createButton(`${word.icon} ${word.word}`, () => speakEnglish(word.word), {
          className: "english-word-card"
        });
        const meaning = document.createElement("span");
        meaning.textContent = word.meaning;
        card.append(meaning);
        grid.append(card);
      }
      group.append(title, grid);
      list.append(group);
    }
    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回英文魔法战", () => {
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }));
    root.append(list, actions);
  };

  const renderBattle = (): void => {
    root.append(createHeader(getLevelTitle(level), getLevelDescription(level)));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("回合", `${round}/${roundsPerGame}`),
      createStatus("得分", score),
      createStatus("连对", streak),
      createStatus("正确率", attempts === 0 ? "暂无" : `${Math.round((score / attempts) * 100)}%`)
    );

    const target = document.createElement("section");
    target.className = "english-target";
    const icon = document.createElement("div");
    icon.className = "english-target__icon";
    icon.textContent = current.icon;
    const word = document.createElement("div");
    word.className = "english-target__word";
    word.textContent = revealWord
      ? current.word
      : level === 1
        ? `${"_"}${current.word.slice(1)}`
        : input.padEnd(current.word.length, "_").split("").join(" ");
    const meaning = document.createElement("p");
    meaning.textContent = current.meaning;
    target.append(icon, word, meaning, createButton("听单词", () => speakEnglish(current.word), { className: "ui-button ui-button--secondary" }));

    const letters = document.createElement("div");
    letters.className = "letter-bank";
    for (const tile of tiles) {
      letters.append(createButton(tile.letter, () => chooseLetter(tile), {
        className: tile.used ? "ui-button letter-tile is-used" : "ui-button letter-tile",
        disabled: tile.used || locked
      }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    if (level > 1) {
      actions.append(createButton("撤销", () => {
        undoLetter();
        render();
      }, { className: "ui-button ui-button--secondary", disabled: locked }), createButton("提交", checkWord, { disabled: locked }));
    }
    actions.append(createButton("返回英文魔法战", () => {
      window.clearTimeout(timer);
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }));

    root.append(stats, target, letters, actions, createFeedbackBanner(feedback));
  };

  const renderDone = (): void => {
    root.append(createHeader("魔法完成", `这次得分 ${score} / ${roundsPerGame}。`));
    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("再玩一次", () => startBattle(level)), createButton("返回英文魔法战", () => {
      view = "menu";
      render();
    }, { className: "ui-button ui-button--secondary" }));
    root.append(actions);
  };

  const startBattle = (nextLevel: number): void => {
    level = nextLevel;
    queue = shuffle(englishWords).slice(0, roundsPerGame);
    score = 0;
    round = 0;
    attempts = 0;
    streak = 0;
    revealWord = false;
    locked = false;
    feedback = { kind: "info", text: "看图，听词，再选择字母。" };
    view = "battle";
    nextRound();
  };

  const nextRound = (): void => {
    const next = queue.shift();
    if (!next) {
      save.bestScore = Math.max(save.bestScore, score);
      if (score >= roundsPerGame - 1) {
        save.wins += 1;
      }
      context.storage.set("progress", save);
      view = "done";
      render();
      return;
    }

    current = next;
    round += 1;
    input = "";
    revealWord = false;
    locked = false;
    tiles = createTiles(current.word, level);
    render();
  };

  const chooseLetter = (tile: LetterTile): void => {
    if (tile.used) {
      return;
    }
    tile.used = true;
    input += tile.letter;

    if (level === 1) {
      attempts += 1;
      if (tile.letter === current.word[0]) {
        completeCurrentWord("首字母正确。");
      } else {
        streak = 0;
        revealWord = true;
        input = "";
        tiles = createTiles(current.word, level);
        feedback = { kind: "error", text: `正确首字母是 ${current.word[0]}，完整单词是 ${current.word}。` };
        playFeedbackSound("error");
        render();
      }
      return;
    }

    render();
  };

  const undoLetter = (): void => {
    if (!input) {
      return;
    }
    const last = input[input.length - 1];
    input = input.slice(0, -1);
    const tile = [...tiles].reverse().find((item) => item.letter === last && item.used);
    if (tile) {
      tile.used = false;
    }
  };

  const checkWord = (): void => {
    if (input === current.word) {
      attempts += 1;
      completeCurrentWord("拼对了。");
      return;
    }
    attempts += 1;
    streak = 0;
    revealWord = true;
    feedback = { kind: "error", text: `再看一眼：${current.word}，然后重新拼。` };
    playFeedbackSound("error");
    tiles = createTiles(current.word, level);
    input = "";
    render();
  };

  const completeCurrentWord = (text: string): void => {
    score += 1;
    streak += 1;
    revealWord = true;
    locked = true;
    feedback = { kind: "success", text: `${text} ${current.word} = ${current.meaning}` };
    playFeedbackSound("success");
    speakEnglish(current.word);
    render();

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      nextRound();
    }, 900);
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

function getLevelTitle(level: number): string {
  return level === 1 ? "Level 1 符文修复" : level === 2 ? "Level 2 乱序拼写" : "Level 3 魔龙挑战";
}

function getLevelDescription(level: number): string {
  return level === 1 ? "根据图片和中文，选出缺失的首字母。" : level === 2 ? "把打乱的字母点成正确单词。" : "独立拼完整单词。";
}

function createTiles(word: string, level: number): LetterTile[] {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const required = level === 1 ? [word[0]] : word.split("");
  const distractors = shuffle(alphabet.filter((letter) => !required.includes(letter))).slice(0, level === 1 ? 5 : 4);
  return shuffle([...required, ...distractors]).map((letter, index) => ({
    id: `${letter}-${index}`,
    letter,
    used: false
  }));
}

function speakEnglish(word: string): void {
  speakText(word, "en-US", 0.85);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
