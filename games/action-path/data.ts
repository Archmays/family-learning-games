interface ActionSceneData {
  id: string;
  title: string;
  visual: {
    tokens: readonly {
      icon: string;
      text: string;
      label: string;
      tone: string;
    }[];
    pathLabel: string;
  };
  parentPrompt: string;
  correctWord: string;
  actionHint: string;
}

const actionPlaces = [
  "原始场景",
  "家门口",
  "小区门口",
  "电梯口",
  "楼道里",
  "早餐桌边",
  "客厅地垫",
  "玩具角",
  "绘本架旁",
  "洗手台边",
  "厨房门口",
  "阳台门边",
  "车站入口",
  "斑马线旁",
  "公交站台",
  "地铁闸机",
  "商场大厅",
  "超市货架旁",
  "游乐区门口",
  "滑梯下面",
  "秋千旁边",
  "公园小路",
  "草地边",
  "图书馆门口",
  "阅读区",
  "教室门口",
  "走廊转角",
  "操场边",
  "排队线前",
  "手工桌边",
  "画画区",
  "音乐角",
  "积木桌旁",
  "亲子活动室",
  "朋友家门口",
  "生日会桌边",
  "医院大厅",
  "药箱旁边",
  "服务台前",
  "停车场边",
  "车门旁边",
  "雨天门廊",
  "雪天路边",
  "夜晚路口",
  "电动车旁",
  "宠物区旁",
  "饮水机边",
  "楼梯口",
  "安静角",
  "回家路上"
] as const;

export function buildActionScenes<T extends ActionSceneData>(seeds: readonly T[]): T[] {
  return actionPlaces.flatMap((place, variantIndex) =>
    seeds.map((seed) => (variantIndex === 0 ? cloneActionScene(seed) : buildActionVariant(seed, place, variantIndex)))
  );
}

function buildActionVariant<T extends ActionSceneData>(seed: T, place: string, variantIndex: number): T {
  return {
    ...seed,
    id: `${seed.id}-place-${String(variantIndex).padStart(2, "0")}`,
    title: `${seed.title}（${place}）`,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      pathLabel: `${place}：${seed.visual.pathLabel}`
    },
    parentPrompt: `家长读：${place}，${stripParentPrompt(seed.parentPrompt)}`,
    actionHint: `${seed.actionHint} 先看场景，再说 ${seed.correctWord}。`
  };
}

function cloneActionScene<T extends ActionSceneData>(seed: T): T {
  return {
    ...seed,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      pathLabel: seed.visual.pathLabel
    }
  };
}

function stripParentPrompt(prompt: string): string {
  return prompt.replace(/^家长读：/, "");
}
