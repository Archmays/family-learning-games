export interface MemoryCardPair {
  id: string;
  label: string;
  symbol: string;
}

export const memoryCardPairs: MemoryCardPair[] = [
  { id: "sun", label: "太阳", symbol: "日" },
  { id: "moon", label: "月亮", symbol: "月" },
  { id: "tree", label: "小树", symbol: "木" },
  { id: "water", label: "水滴", symbol: "水" }
];
