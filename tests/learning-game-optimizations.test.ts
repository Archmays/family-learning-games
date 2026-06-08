import { readFileSync } from "node:fs";
import { calculate, formatCardValue } from "../games/make-target";
import { getMultiplicationGridCount, getNumberBlockCount } from "../games/multiplication-adventure";

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

  it("keeps child-mode return buttons in the migrated games", () => {
    const multiplication = readFileSync("games/multiplication-adventure/index.ts", "utf8");
    const english = readFileSync("games/english-spell-battle/index.ts", "utf8");
    const pinyin = readFileSync("games/pinyin-magic-battle/index.ts", "utf8");

    expect(multiplication).toContain("返回乘法主页");
    expect(english).toContain("返回英文魔法战");
    expect(pinyin).toContain("返回汉字魔法战");
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
    expect(pinyin).toContain("is-popped");
  });
});
