import { readFileSync } from "node:fs";
import { englishWords, hanziWheelSets, pinyinCards } from "../packages/data/learningGames";

describe("game catalog", () => {
  it("registers the first batch of migrated single-file games", () => {
    const source = readFileSync("packages/data/gameCatalog.ts", "utf8");

    expect(source).toContain("hanziWheelGame");
    expect(source).toContain("multiplicationAdventureGame");
    expect(source).toContain("englishSpellBattleGame");
    expect(source).toContain("clockReaderGame");
    expect(source).toContain("makeTargetGame");
    expect(source).toContain("pinyinMagicBattleGame");
  });

  it("has shared learning data for the migrated games", () => {
    expect(englishWords.length).toBeGreaterThanOrEqual(30);
    expect(pinyinCards.length).toBeGreaterThanOrEqual(60);
    expect(hanziWheelSets.length).toBeGreaterThanOrEqual(3);
    expect(hanziWheelSets.every((set) => set.char.validPairs.length > 0 && set.word.validPairs.length > 0)).toBe(true);
  });

  it("keeps hanzi wheel options unique and referenced by every valid pair", () => {
    for (const set of hanziWheelSets) {
      for (const mode of [set.char, set.word]) {
        expect(new Set(mode.outerOptions).size, `${set.id} outer`).toBe(mode.outerOptions.length);
        expect(new Set(mode.innerOptions).size, `${set.id} inner`).toBe(mode.innerOptions.length);

        for (const pair of mode.validPairs) {
          expect(mode.outerOptions, `${set.id} ${pair.result} outer`).toContain(pair.outer);
          expect(mode.innerOptions, `${set.id} ${pair.result} inner`).toContain(pair.inner);
          expect(pair.result.length, `${set.id} result`).toBeGreaterThan(0);
          expect(pair.words.length, `${set.id} words`).toBeGreaterThan(0);
        }
      }
    }
  });
});
