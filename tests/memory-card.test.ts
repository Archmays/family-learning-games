import { getMemoryRevealTileStates } from "../games/memory-card";

describe("memory card reveal progress", () => {
  it("marks no reveal tiles visible before any pairs are matched", () => {
    expect(getMemoryRevealTileStates(0, 6)).toEqual([false, false, false, false, false, false]);
  });

  it("reveals one tile for each matched pair", () => {
    expect(getMemoryRevealTileStates(3, 6)).toEqual([true, true, true, false, false, false]);
  });

  it("reveals all tiles when all pairs are matched", () => {
    expect(getMemoryRevealTileStates(6, 6)).toEqual([true, true, true, true, true, true]);
  });

  it("clamps reveal progress to the playable pair count", () => {
    expect(getMemoryRevealTileStates(-2, 3)).toEqual([false, false, false]);
    expect(getMemoryRevealTileStates(5, 3)).toEqual([true, true, true]);
    expect(getMemoryRevealTileStates(2, 0)).toEqual([]);
  });
});
