import {
  calculateHanziRadicalDamage,
  countValidHanziRadicalCombos,
  findFirstValidHanziRadicalCombo,
  getHanziRadicalRarity
} from "../games/hanzi-radical-battle";
import {
  HANZI_RADICAL_COMBINATION_DB,
  HANZI_RADICAL_COMBINATION_ENTRIES,
  HANZI_RADICAL_DECK,
  HANZI_RADICAL_HEROES,
  HANZI_RADICAL_MONSTERS,
  combinationKey,
  getHanziRadicalCombination
} from "../games/hanzi-radical-battle/game-data";

describe("hanzi radical battle data", () => {
  it("keeps the migrated heroes, monsters, deck, and combination data", () => {
    expect(HANZI_RADICAL_HEROES).toHaveLength(3);
    expect(HANZI_RADICAL_MONSTERS).toHaveLength(4);
    expect(HANZI_RADICAL_DECK.length).toBeGreaterThanOrEqual(220);
    expect(HANZI_RADICAL_COMBINATION_ENTRIES.length).toBe(313);
    expect(Object.keys(HANZI_RADICAL_COMBINATION_DB)).toHaveLength(310);
  });

  it("keeps combination entries well formed", () => {
    const validStructures = new Set(["lr", "tb", "sur", "tri"]);

    for (const entry of HANZI_RADICAL_COMBINATION_ENTRIES) {
      expect(entry.parts.length).toBeGreaterThanOrEqual(2);
      expect(entry.parts.length).toBeLessThanOrEqual(3);
      expect(entry.parts.every((part) => part.trim().length > 0), entry.parts.join("+")).toBe(true);

      if (!entry.result) {
        continue;
      }

      expect(entry.result.char.trim(), entry.parts.join("+")).toBeTruthy();
      expect(entry.result.desc.trim(), entry.result.char).toBeTruthy();
      expect(entry.result.power, entry.result.char).toBeGreaterThan(0);
      expect(validStructures.has(entry.result.struct), entry.result.char).toBe(true);
    }
  });

  it("preserves old object overwrite behavior for duplicate and null keys", () => {
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["口", "木"])]?.char).toBe("呆");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["几", "木"])]?.char).toBe("朵");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["心", "相"])]?.char).toBe("想");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["艹", "节"])]).toBeNull();
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["宀", "宅"])]).toBeNull();
  });
});

describe("hanzi radical battle rules", () => {
  it("finds combinations regardless of selected part order", () => {
    expect(getHanziRadicalCombination(["工", "氵"])?.char).toBe("江");
    expect(getHanziRadicalCombination(["氵", "工"])?.char).toBe("江");
  });

  it("finds two-card and three-card hint combinations", () => {
    expect(findFirstValidHanziRadicalCombo([{ char: "氵" }, { char: "工" }, { char: "木" }])).toEqual([0, 1]);
    expect(findFirstValidHanziRadicalCombo([{ char: "又" }, { char: "女" }, { char: "心" }])).toEqual([0, 1, 2]);
  });

  it("counts valid two-card combos like the original draw logic", () => {
    expect(countValidHanziRadicalCombos([{ char: "氵" }, { char: "工" }, { char: "木" }, { char: "寸" }])).toBe(2);
  });

  it("calculates hero bonus and weakness damage", () => {
    const combo = getHanziRadicalCombination(["氵", "工"]);
    expect(combo).toBeTruthy();
    expect(calculateHanziRadicalDamage(combo!, HANZI_RADICAL_HEROES[0], HANZI_RADICAL_MONSTERS[0])).toBe(30);
    expect(calculateHanziRadicalDamage(combo!, HANZI_RADICAL_HEROES[2], HANZI_RADICAL_MONSTERS[3])).toBe(13);
  });

  it("keeps rarity labels aligned with migrated combo types", () => {
    expect(getHanziRadicalRarity("normal")).toBe("normal");
    expect(getHanziRadicalRarity("water")).toBe("rare");
    expect(getHanziRadicalRarity("epic")).toBe("epic");
  });
});
