import { readFileSync, readdirSync } from "node:fs";
import { englishWords, hanziWheelSets, pinyinCards } from "../packages/data/learningGames";
import { MEMORY_CARD_PAIR_COUNT, memoryCardSets, pickMemoryCardPairs } from "../packages/data/memoryCards";

describe("game catalog", () => {
  it("registers the first batch of migrated single-file games", () => {
    const source = readFileSync("packages/data/gameCatalog.ts", "utf8");

    expect(source).toContain("hanziWheelGame");
    expect(source).toContain("multiplicationAdventureGame");
    expect(source).toContain("englishSpellBattleGame");
    expect(source).toContain("clockReaderGame");
    expect(source).toContain("makeTargetGame");
    expect(source).toContain("pinyinMagicBattleGame");
    expect(source).toContain("hanziRadicalBattleGame");
    expect(source).toContain("ecologyEvidenceGame");
    expect(source).toContain("actionPathGame");
    expect(source).toContain("timeSchedulerGame");
  });

  it("has shared learning data for the migrated games", () => {
    expect(englishWords.length).toBeGreaterThanOrEqual(30);
    expect(pinyinCards.length).toBeGreaterThanOrEqual(60);
    expect(hanziWheelSets.length).toBe(9);
    expect(hanziWheelSets.every((set) => set.char.validPairs.length > 0 && set.word.validPairs.length > 0)).toBe(true);
  });

  it("keeps every catalog game documented for the hub", () => {
    const gameDirs = readdirSync("games", { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(gameDirs).toHaveLength(12);

    for (const gameDir of gameDirs) {
      const source = readFileSync(`games/${gameDir}/index.ts`, "utf8");
      const readme = readFileSync(`games/${gameDir}/README.md`, "utf8");

      for (const field of ["id", "title", "description", "subject", "recommendedAge", "learningGoal", "status"]) {
        expect(source, `${gameDir} ${field}`).toContain(`${field}:`);
      }

      for (const heading of ["## 游戏目标", "## 适合对象", "## 玩法说明", "## 涉及知识点", "## 设备适配", "## 当前完成度", "## 后续改进建议", "## 接入方式"]) {
        expect(readme, `${gameDir} ${heading}`).toContain(heading);
      }
    }
  });

  it("keeps memory card grade sets aligned with hanzi wheel grades", () => {
    expect(memoryCardSets).toHaveLength(9);
    expect(memoryCardSets.map((set) => set.label)).toEqual(hanziWheelSets.map((set) => set.label));

    for (const set of memoryCardSets) {
      const ids = new Set(set.pairs.map((pair) => pair.id));
      const symbols = new Set(set.pairs.map((pair) => pair.symbol));
      const wheelSet = hanziWheelSets.find((item) => item.id === set.id);

      expect(set.pairs.length, set.label).toBe(wheelSet?.char.validPairs.length);
      expect(ids.size, `${set.label} ids`).toBe(set.pairs.length);
      expect(symbols.size, `${set.label} symbols`).toBe(set.pairs.length);
      expect(set.pairs.every((pair) => pair.label.trim() && pair.symbol.trim()), set.label).toBe(true);
    }
  });

  it("samples varied memory card pairs from the full grade pool", () => {
    const secondGrade = memoryCardSets.find((set) => set.label === "二年级");

    expect(secondGrade).toBeTruthy();

    const picked = pickMemoryCardPairs(secondGrade!.pairs, MEMORY_CARD_PAIR_COUNT, () => 0.99);
    const pickedSymbols = new Set(picked.map((pair) => pair.symbol));
    const pickedInnerParts = new Set(picked.map((pair) => pair.inner));

    expect(picked).toHaveLength(MEMORY_CARD_PAIR_COUNT);
    expect(pickedSymbols.size).toBe(MEMORY_CARD_PAIR_COUNT);
    expect(pickedInnerParts.size).toBeGreaterThan(1);
    expect(picked.every((pair) => pair.inner === "青")).toBe(false);
  });

  it("can reshuffle memory card pairs on restart", () => {
    const secondGrade = memoryCardSets.find((set) => set.label === "二年级");

    expect(secondGrade).toBeTruthy();

    const firstPick = pickMemoryCardPairs(secondGrade!.pairs, MEMORY_CARD_PAIR_COUNT, () => 0.99).map((pair) => pair.symbol).join("");
    const secondPick = pickMemoryCardPairs(secondGrade!.pairs, MEMORY_CARD_PAIR_COUNT, () => 0).map((pair) => pair.symbol).join("");

    expect(firstPick).not.toBe(secondPick);
  });

  it("keeps hanzi wheel options unique and referenced by every valid pair", () => {
    for (const set of hanziWheelSets) {
      expect(set.char.validPairs.length, `${set.id} char count`).toBeGreaterThanOrEqual(18);
      expect(set.word.validPairs.length, `${set.id} word count`).toBeGreaterThanOrEqual(12);

      for (const mode of [set.char, set.word]) {
        expect(new Set(mode.outerOptions).size, `${set.id} outer`).toBe(mode.outerOptions.length);
        expect(new Set(mode.innerOptions).size, `${set.id} inner`).toBe(mode.innerOptions.length);

        for (const pair of mode.validPairs) {
          expect(mode.outerOptions, `${set.id} ${pair.result} outer`).toContain(pair.outer);
          expect(mode.innerOptions, `${set.id} ${pair.result} inner`).toContain(pair.inner);
          expect(pair.outer.trim(), `${set.id} outer`).toBeTruthy();
          expect(pair.inner.trim(), `${set.id} inner`).toBeTruthy();
          expect(pair.result.length, `${set.id} result`).toBeGreaterThan(0);
          expect(pair.pinyin.trim(), `${set.id} ${pair.result} pinyin`).toBeTruthy();
          expect(pair.words.length, `${set.id} words`).toBeGreaterThan(0);
          expect(pair.words.every((word) => word.trim().length > 0), `${set.id} ${pair.result} words`).toBe(true);
        }
      }
    }
  });
});
