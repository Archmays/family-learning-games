import type { GameDefinition, MountGameContext, MountedGame } from "../../packages/game-core";
import { pinyinCards, type PinyinCard } from "../../packages/data/learningGames";
import { clearElement, createButton, createFeedbackBanner, createStatus, playFeedbackSound, speakText } from "../../packages/ui";
import type { FeedbackState } from "../../packages/ui";

type PinyinView = "menu" | "study" | "quiz" | "balloon" | "done";

interface PinyinSave {
  bestQuizScore: number;
  balloonPops: number;
}

export const pinyinMagicBattleGame: GameDefinition = {
  id: "pinyin-magic-battle",
  title: "汉字魔法战-拼音",
  description: "看汉字、读拼音，再用选择题和气球挑战巩固声调。",
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
  let lives = 3;
  let locked = false;
  let revealAnswer = false;
  let poppedPinyin = "";
  let doneMode: "quiz" | "balloon" = "quiz";
  let timer: number | undefined;
  let feedback: FeedbackState = { kind: "info", text: "选择一种练习方式。" };
  const quizRounds = 10;
  const save = context.storage.get<PinyinSave>("progress", { bestQuizScore: 0, balloonPops: 0 });

  const render = (): void => {
    clearElement(root);
    if (view === "menu") {
      renderMenu();
    } else if (view === "study") {
      renderStudy();
    } else if (view === "quiz") {
      renderQuiz();
    } else if (view === "balloon") {
      renderBalloon();
    } else {
      renderDone();
    }
  };

  const renderMenu = (): void => {
    root.append(createHeader("汉字魔法战", "认一认汉字，听一听读音，再进入挑战。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(createStatus("最佳测验", save.bestQuizScore), createStatus("气球命中", save.balloonPops));

    const actions = document.createElement("div");
    actions.className = "learning-game__actions learning-game__actions--wide";
    actions.append(
      createButton("魔法图鉴", () => {
        view = "study";
        render();
      }),
      createButton("试炼挑战", startQuiz),
      createButton("气球魔法战", startBalloon)
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
      createButton("返回汉字魔法战", () => {
        view = "menu";
        render();
      }, { className: "ui-button ui-button--secondary" })
    );
    root.append(panel, actions);
  };

  const renderQuiz = (): void => {
    root.append(createHeader("试炼挑战", "为汉字选出正确拼音。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("题目", `${round}/${quizRounds}`),
      createStatus("得分", score),
      createStatus("连对", streak),
      createStatus("正确率", attempts === 0 ? "暂无" : `${Math.round((score / attempts) * 100)}%`)
    );
    const prompt = createPromptCard(target, revealAnswer);
    const grid = document.createElement("div");
    grid.className = "pinyin-option-grid";
    for (const option of options) {
      grid.append(createButton(option.pinyin, () => answerQuiz(option), {
        className: `ui-button pinyin-option ${getToneClass(option.pinyin)}${revealAnswer && option.pinyin === target.pinyin ? " is-correct" : ""}`,
        disabled: locked
      }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回汉字魔法战", returnToMenu, { className: "ui-button ui-button--secondary" }));
    root.append(stats, prompt, grid, actions, createFeedbackBanner(feedback));
  };

  const renderBalloon = (): void => {
    root.append(createHeader("气球魔法战", "看目标汉字，点中正确拼音气球。"));
    const stats = document.createElement("div");
    stats.className = "learning-game__stats";
    stats.append(
      createStatus("命中", score),
      createStatus("机会", lives),
      createStatus("连对", streak),
      createStatus("正确率", attempts === 0 ? "暂无" : `${Math.round((score / attempts) * 100)}%`)
    );
    const prompt = createPromptCard(target, revealAnswer);
    const balloons = document.createElement("div");
    balloons.className = "pinyin-balloons";
    for (const option of options) {
      const stateClass = poppedPinyin === option.pinyin ? " is-popped" : "";
      balloons.append(createButton(option.pinyin, () => answerBalloon(option), {
        className: `pinyin-balloon ${getToneClass(option.pinyin)}${stateClass}${revealAnswer && option.pinyin === target.pinyin ? " is-correct" : ""}`,
        disabled: locked
      }));
    }

    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("返回汉字魔法战", returnToMenu, { className: "ui-button ui-button--secondary" }));
    root.append(stats, prompt, balloons, actions, createFeedbackBanner(feedback));
  };

  const renderDone = (): void => {
    root.append(createHeader("挑战结束", feedback.text));
    const actions = document.createElement("div");
    actions.className = "learning-game__actions";
    actions.append(createButton("再玩一次", doneMode === "balloon" ? startBalloon : startQuiz), createButton("返回汉字魔法战", returnToMenu, {
      className: "ui-button ui-button--secondary"
    }));
    root.append(actions);
  };

  const returnToMenu = (): void => {
    window.clearTimeout(timer);
    locked = false;
    revealAnswer = false;
    poppedPinyin = "";
    view = "menu";
    feedback = { kind: "info", text: "选择一种练习方式。" };
    render();
  };

  const startQuiz = (): void => {
    view = "quiz";
    round = 0;
    score = 0;
    attempts = 0;
    streak = 0;
    feedback = { kind: "info", text: "仔细看声调。" };
    nextQuizQuestion();
  };

  const nextQuizQuestion = (): void => {
    round += 1;
    target = randomCard();
    options = makeOptions(target, 4);
    locked = false;
    revealAnswer = false;
    poppedPinyin = "";
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
      locked = true;
      feedback = { kind: "success", text: `${target.char} 读 ${target.pinyin}，答对了。` };
      playFeedbackSound("success");
      speakChinese(target.char);
      render();
      timer = window.setTimeout(() => {
        if (round >= quizRounds) {
          finishQuiz();
          return;
        }
        nextQuizQuestion();
      }, 850);
      return;
    }

    streak = 0;
    feedback = { kind: "error", text: `${target.char} 的正确读音是 ${target.pinyin}，看清声调后再选一次。` };
    playFeedbackSound("error");
    render();
  };

  const finishQuiz = (): void => {
    save.bestQuizScore = Math.max(save.bestQuizScore, score);
    context.storage.set("progress", save);
    doneMode = "quiz";
    view = "done";
    feedback = { kind: "success", text: `测验完成：${score} / ${quizRounds}。` };
    render();
  };

  const startBalloon = (): void => {
    view = "balloon";
    score = 0;
    attempts = 0;
    streak = 0;
    lives = 3;
    feedback = { kind: "info", text: "点中正确拼音。" };
    nextBalloonQuestion();
  };

  const nextBalloonQuestion = (): void => {
    target = randomCard();
    options = makeOptions(target, 6);
    locked = false;
    revealAnswer = false;
    poppedPinyin = "";
    render();
  };

  const answerBalloon = (option: PinyinCard): void => {
    if (locked) {
      return;
    }
    attempts += 1;
    revealAnswer = true;

    if (option.pinyin === target.pinyin) {
      score += 1;
      streak += 1;
      poppedPinyin = option.pinyin;
      locked = true;
      save.balloonPops += 1;
      context.storage.set("progress", save);
      feedback = { kind: "success", text: `命中：${target.char} 读 ${target.pinyin}。` };
      playFeedbackSound("success");
      speakChinese(target.char);
      render();
      timer = window.setTimeout(nextBalloonQuestion, 800);
      return;
    }

    lives -= 1;
    streak = 0;
    feedback = { kind: "error", text: `${target.char} 读 ${target.pinyin}，请看准声调再点。` };
    playFeedbackSound("error");
    if (lives <= 0) {
      doneMode = "balloon";
      view = "done";
      feedback = { kind: "error", text: `气球挑战结束：命中 ${score} 个。` };
    }
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
