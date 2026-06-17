import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  calculateHanziRadicalDamage,
  countValidHanziRadicalCombos,
  drawHanziRadicalCards,
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
import { HANZI_RADICAL_FORMULA_AUDIT_ENTRIES } from "../games/hanzi-radical-battle/formula-audit";
import {
  HANZI_RADICAL_VISUAL_HINTS,
  getHanziRadicalVisualHint
} from "../games/hanzi-radical-battle/visual-hints";

function getPublicAssetPath(imageSrc: string): string {
  const publicPath = imageSrc.replace(/^\.?\//, "");
  return join("public", ...publicPath.split("/").filter(Boolean));
}

describe("hanzi radical battle data", () => {
  it("keeps the migrated heroes, monsters, deck, and combination data", () => {
    expect(HANZI_RADICAL_HEROES).toHaveLength(3);
    expect(HANZI_RADICAL_MONSTERS).toHaveLength(4);
    expect(HANZI_RADICAL_DECK.length).toBeGreaterThanOrEqual(220);
    expect(HANZI_RADICAL_COMBINATION_ENTRIES.length).toBeGreaterThanOrEqual(382);
    expect(Object.keys(HANZI_RADICAL_COMBINATION_DB).length).toBeGreaterThanOrEqual(370);
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

  it("keeps all non-null combination parts drawable from the deck", () => {
    const deckParts = new Set(HANZI_RADICAL_DECK);

    for (const entry of HANZI_RADICAL_COMBINATION_ENTRIES) {
      if (!entry.result) {
        continue;
      }

      for (const part of entry.parts) {
        expect(deckParts.has(part), `${entry.parts.join("+")}=${entry.result.char}`).toBe(true);
      }
    }
  });

  it("preserves old object overwrite behavior for duplicate and null keys", () => {
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["口", "木"])]?.char).toBe("呆");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["几", "木"])]?.char).toBe("朵");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["心", "相"])]?.char).toBe("想");
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["艹", "节"])]).toBeNull();
    expect(HANZI_RADICAL_COMBINATION_DB[combinationKey(["宀", "宅"])]).toBeNull();
  });

  it("keeps unordered duplicate combination groups limited to known intentional cases", () => {
    const groups = new Map<string, number>();
    for (const entry of HANZI_RADICAL_COMBINATION_ENTRIES) {
      const key = combinationKey(entry.parts);
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }

    const duplicateKeys = [...groups.entries()]
      .filter(([, count]) => count > 1)
      .map(([key]) => key)
      .sort();

    expect(duplicateKeys).toEqual([
      combinationKey(["几", "木"]),
      combinationKey(["口", "木"]),
      combinationKey(["心", "相"])
    ].sort());
  });
});

describe("hanzi radical battle rules", () => {
  it("finds combinations regardless of selected part order", () => {
    expect(getHanziRadicalCombination(["工", "氵"])?.char).toBe("江");
    expect(getHanziRadicalCombination(["氵", "工"])?.char).toBe("江");
  });

  it("uses selected order when the same parts can make different characters", () => {
    expect(getHanziRadicalCombination(["木", "几"])?.char).toBe("机");
    expect(getHanziRadicalCombination(["几", "木"])?.char).toBe("朵");
    expect(getHanziRadicalCombination(["木", "口"])?.char).toBe("杏");
    expect(getHanziRadicalCombination(["口", "木"])?.char).toBe("呆");
  });

  it("finds two-card and three-card hint combinations", () => {
    expect(findFirstValidHanziRadicalCombo([{ char: "氵" }, { char: "工" }, { char: "木" }])).toEqual([0, 1]);
    expect(findFirstValidHanziRadicalCombo([{ char: "又" }, { char: "女" }, { char: "心" }])).toEqual([0, 1, 2]);
  });

  it("counts valid two-card combos like the original draw logic", () => {
    expect(countValidHanziRadicalCombos([{ char: "氵" }, { char: "工" }, { char: "木" }, { char: "寸" }])).toBe(2);
  });

  it("counts valid three-card combos in hand quality checks", () => {
    expect(countValidHanziRadicalCombos([{ char: "又" }, { char: "女" }, { char: "心" }])).toBe(1);
  });

  it("guarantees fallback cards from real combination entries", () => {
    const originalRandom = Math.random;
    let id = 0;

    Math.random = () => 0;
    try {
      const cards = drawHanziRadicalCards([], 2, () => `card-${id += 1}`);
      expect(cards).toHaveLength(2);
      expect(getHanziRadicalCombination(cards.map((card) => card.char))).toBeTruthy();
    } finally {
      Math.random = originalRandom;
    }
  });

  it("includes wheel-sourced expansion combinations", () => {
    expect(getHanziRadicalCombination(["日", "月"])?.char).toBe("明");
    expect(getHanziRadicalCombination(["忄", "青"])?.char).toBe("情");
    expect(getHanziRadicalCombination(["钅", "帛"])?.char).toBe("锦");
  });

  it("includes small missing drawable combination fixes", () => {
    expect(getHanziRadicalCombination(["氵", "分"])?.char).toBe("汾");
    expect(getHanziRadicalCombination(["氵", "肖"])?.char).toBe("消");
    expect(getHanziRadicalCombination(["米", "分"])?.char).toBe("粉");
    expect(getHanziRadicalCombination(["扌", "召"])?.char).toBe("招");
    expect(getHanziRadicalCombination(["日", "召"])?.char).toBe("昭");
    expect(getHanziRadicalCombination(["木", "兆"])?.char).toBe("桃");
    expect(getHanziRadicalCombination(["口", "包"])?.char).toBe("咆");
    expect(getHanziRadicalCombination(["木", "肖"])?.char).toBe("梢");
  });

  it("includes 讠 + 乍 = 诈 in the playable formula table", () => {
    const combo = getHanziRadicalCombination(["讠", "乍"]);

    expect(combo?.char).toBe("诈");
    expect(combo?.desc).toContain("假话");
  });

  it("includes 𥫗 + 生 = 笙 in the playable formula table", () => {
    const combo = getHanziRadicalCombination(["𥫗", "生"]);

    expect(combo?.char).toBe("笙");
    expect(combo?.desc).toBe("乐器");
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

  it("uses a generated image asset for 屎", () => {
    const combo = getHanziRadicalCombination(["尸", "米"]);
    expect(combo?.char).toBe("屎");

    const hint = getHanziRadicalVisualHint(combo!, ["尸", "米"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["尸", "米", "屎"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u5c4e.png");
    expect(hint.label).toBe("屎：排泄物");
    expect(hint.imageAlt).toContain("排泄物");
  });

  it("uses a generated image asset for 明", () => {
    const combo = getHanziRadicalCombination(["日", "月"]);
    expect(combo?.char).toBe("明");

    const hint = getHanziRadicalVisualHint(combo!, ["日", "月"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["日", "月", "明"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u660e.png");
    expect(hint.label).toBe("明：明亮");
  });

  it("uses a generated image asset for 讨", () => {
    const combo = getHanziRadicalCombination(["讠", "寸"]);
    expect(combo?.char).toBe("讨");

    const hint = getHanziRadicalVisualHint(combo!, ["讠", "寸"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["讠", "寸", "讨"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u8ba8.png");
    expect(hint.label).toBe("讨：讨论");
    expect(hint.imageAlt).toMatch(/讨论|商量/);
  });

  it("uses a generated image asset for 诈", () => {
    const combo = getHanziRadicalCombination(["讠", "乍"]);
    expect(combo?.char).toBe("诈");

    const hint = getHanziRadicalVisualHint(combo!, ["讠", "乍"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["讠", "乍", "诈"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u8bc8.png");
    expect(hint.label).toBe("诈：识破假话");
    expect(hint.imageAlt).toContain("假话");
  });

  it("uses a generated image asset for 松", () => {
    const combo = getHanziRadicalCombination(["木", "公"]);
    expect(combo?.char).toBe("松");

    const hint = getHanziRadicalVisualHint(combo!, ["木", "公"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["木", "公", "松"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u677e.png");
    expect(hint.label).toBe("松：松树");
    expect(hint.imageAlt).toContain("松树");
  });

  it("uses a concrete generated image asset for 迁", () => {
    const combo = getHanziRadicalCombination(["辶", "千"]);
    expect(combo?.char).toBe("迁");

    const hint = getHanziRadicalVisualHint(combo!, ["辶", "千"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["辶", "千", "迁"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u8fc1.png");
    expect(hint.label).toBe("迁：迁移");
    expect(`${hint.formulaNote} ${hint.label} ${hint.imageAlt}`).not.toMatch(/用|图形提示|动作线|闪光/);
  });

  it("uses an explicit generated image asset for 江 instead of the fallback", () => {
    const combo = getHanziRadicalCombination(["氵", "工"]);
    expect(combo?.char).toBe("江");

    const hint = getHanziRadicalVisualHint(combo!, ["氵", "工"]);

    expect(hint.source).toBe("custom");
    expect(hint.formula).toEqual(["氵", "工", "江"]);
    expect(hint.imageSrc).toBe("./assets/hanzi-radical-battle/visuals/u6c5f.png");
    expect(hint.label).toBe("江：江水");
    expect(hint.imageAlt).toContain("江水");
  });

  it("provides a generated image asset for every drawable non-null combination", () => {
    for (const entry of HANZI_RADICAL_COMBINATION_ENTRIES) {
      if (!entry.result) {
        continue;
      }

      const char = entry.result.char.split("/")[0];
      const hint = getHanziRadicalVisualHint(entry.result, entry.parts);

      expect(HANZI_RADICAL_VISUAL_HINTS[char], entry.result.char).toBeTruthy();
      expect(hint.source, entry.result.char).toBe("custom");
      expect(hint.imageSrc, entry.result.char).toMatch(/^\.\/assets\/hanzi-radical-battle\/visuals\/u[0-9a-f]+\.png$/);
      expect(existsSync(getPublicAssetPath(hint.imageSrc)), entry.result.char).toBe(true);
      expect(hint.formula, entry.result.char).toEqual([...entry.parts, char]);
      expect(hint.formulaNote.trim(), entry.result.char).toBeTruthy();
      expect(hint.label.trim(), entry.result.char).toBeTruthy();
      expect(hint.imageAlt.trim(), entry.result.char).toBeTruthy();
    }
  });

  it("does not expose implementation-copy in visual hints", () => {
    const planTerms = ["先看偏旁", "方案", "结构，再", "图形提示", "动作线", "闪光"];

    for (const entry of HANZI_RADICAL_COMBINATION_ENTRIES) {
      if (!entry.result) {
        continue;
      }

      const hint = getHanziRadicalVisualHint(entry.result, entry.parts);
      const visibleCopy = `${hint.formulaNote} ${hint.label} ${hint.imageAlt}`;

      for (const term of planTerms) {
        expect(visibleCopy, entry.result.char).not.toContain(term);
      }
    }
  });

  it("keeps accepted formula-audit entries present in the game table", () => {
    const deckParts = new Set(HANZI_RADICAL_DECK);

    expect(HANZI_RADICAL_FORMULA_AUDIT_ENTRIES.some((entry) => (
      entry.status === "accepted" &&
      combinationKey(entry.parts) === combinationKey(["讠", "乍"]) &&
      entry.result.char === "诈"
    ))).toBe(true);

    for (const entry of HANZI_RADICAL_FORMULA_AUDIT_ENTRIES) {
      if (entry.status !== "accepted") {
        continue;
      }

      for (const part of entry.parts) {
        expect(deckParts.has(part), `${entry.parts.join("+")}=${entry.result.char}`).toBe(true);
      }

      const combo = getHanziRadicalCombination(entry.parts);
      expect(combo?.char, entry.parts.join("+")).toBe(entry.result.char);
    }
  });
});
