import { readFileSync } from "node:fs";
import { calculate, formatCardValue } from "../games/make-target";
import { getMultiplicationGridCount, getNumberBlockCount } from "../games/multiplication-adventure";
import { getPinyinDamage, PINYIN_MONSTER_ROSTER } from "../games/pinyin-magic-battle";

describe("learning game optimizations", () => {
  it("counts multiplication visual blocks from the displayed factors", () => {
    expect(getNumberBlockCount(8)).toBe(8);
    expect(getMultiplicationGridCount(7, 9)).toBe(63);
  });

  it("keeps make-target card calculations and display values explicit", () => {
    expect(calculate(8, 1, "-")).toBe(7);
    expect(calculate(3, 8, "×")).toBe(24);
    expect(calculate(8, 2, "÷")).toBe(4);
    expect(calculate(5, 2, "÷")).toBeNull();
    expect(formatCardValue(7)).toBe("7");
  });

  it("keeps pinyin battle damage as child-friendly integers", () => {
    expect(getPinyinDamage(0)).toBe(10);
    expect(getPinyinDamage(1)).toBe(10);
    expect(getPinyinDamage(1.8)).toBe(10);
    expect(getPinyinDamage(2)).toBe(11);
    expect(getPinyinDamage(3)).toBe(12);
    expect(getPinyinDamage(11)).toBe(20);
    expect(getPinyinDamage(18)).toBe(20);
  });

  it("keeps a varied pinyin monster roster for hero trials", () => {
    const ids = new Set(PINYIN_MONSTER_ROSTER.map((monster) => monster.id));
    const names = new Set(PINYIN_MONSTER_ROSTER.map((monster) => monster.name));

    expect(PINYIN_MONSTER_ROSTER.length).toBeGreaterThanOrEqual(12);
    expect(ids.size).toBe(PINYIN_MONSTER_ROSTER.length);
    expect(names.size).toBe(PINYIN_MONSTER_ROSTER.length);
  });

  it("keeps child-mode return buttons in the migrated games", () => {
    const multiplication = readFileSync("games/multiplication-adventure/index.ts", "utf8");
    const english = readFileSync("games/english-spell-battle/index.ts", "utf8");
    const pinyin = readFileSync("games/pinyin-magic-battle/index.ts", "utf8");

    expect(multiplication).toContain("返回乘法主页");
    expect(english).toContain("返回英文魔法战");
    expect(pinyin).toContain("返回汉字魔法战");
  });

  it("keeps multiplication challenge review controlled by the next button", () => {
    const multiplication = readFileSync("games/multiplication-adventure/index.ts", "utf8");

    expect(multiplication).not.toContain("setTimeout");
    expect(multiplication).toContain("下一题");
    expect(multiplication).toContain("查看成绩");
  });

  it("keeps the restored learning feedback surfaces in source", () => {
    const clock = readFileSync("games/clock-reader/index.ts", "utf8");
    const english = readFileSync("games/english-spell-battle/index.ts", "utf8");
    const pinyin = readFileSync("games/pinyin-magic-battle/index.ts", "utf8");

    expect(clock).toContain("minute < 60");
    expect(clock).toContain("clock-face__minute-label");
    expect(english).toContain("revealWord = true");
    expect(english).toContain("900");
    expect(pinyin).toContain("revealAnswer = true");
    expect(pinyin).toContain("pinyin-monster-health");
  });

  it("keeps pinyin hero trial focused on monster battles", () => {
    const pinyin = readFileSync("games/pinyin-magic-battle/index.ts", "utf8");
    const styles = readFileSync("src/styles.css", "utf8");
    const readme = readFileSync("games/pinyin-magic-battle/README.md", "utf8");

    expect(pinyin).toContain("INITIAL_MONSTER_HP = 50");
    expect(pinyin).toContain("MONSTER_HP_STEP = 10");
    expect(pinyin).toContain("勇者试炼");
    expect(pinyin).toContain("pinyin-game--battle");
    expect(pinyin).toContain("pinyin-monster-stage");
    expect(pinyin).toContain("PINYIN_MONSTER_ROSTER");
    expect(pinyin).not.toContain("气" + "球魔法战");
    expect(pinyin).not.toContain("气" + "球魔法站");
    expect(pinyin).not.toContain("pinyin-game--" + "bal" + "loon");
    expect(pinyin).not.toContain("pinyin-" + "bal" + "loon");
    expect(styles).not.toContain("pinyin-" + "bal" + "loon");
    expect(readme).not.toContain("气" + "球");
    expect(styles).toContain("pinyin-damage-pop");
  });
});
