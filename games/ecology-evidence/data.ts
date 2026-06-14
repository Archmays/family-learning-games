interface EcologySceneData {
  id: string;
  kind: string;
  title: string;
  visual: {
    tokens: readonly {
      icon: string;
      id: string;
      text: string;
      label: string;
      tone: string;
    }[];
    arrows: readonly {
      from: string;
      to: string;
      label: string;
      tone?: string;
    }[];
    note: string;
  };
  prompt: string;
  evidence: string;
  correctId: string;
  choices: readonly {
    id: string;
    label: string;
  }[];
}

const ecologyPlaces = [
  "原始场景",
  "小花园",
  "草地边",
  "池塘边",
  "菜园里",
  "校园角落",
  "公园小路",
  "树荫下",
  "雨后草丛",
  "落叶堆旁",
  "花盆边",
  "小溪旁",
  "湿泥地",
  "枯木旁",
  "灌木丛",
  "鸟窝附近",
  "果树下",
  "苔藓石头边",
  "阳光草坪",
  "阴凉树根",
  "春天花坛",
  "夏天池边",
  "秋天落叶地",
  "冬天温室",
  "昆虫旅馆旁",
  "自然角",
  "观察盒里",
  "透明瓶里",
  "小菜苗旁",
  "豆芽盆边",
  "蘑菇木片旁",
  "堆肥桶边",
  "水培杯旁",
  "石缝旁",
  "芦苇旁",
  "蒲公英旁",
  "蚯蚓盒边",
  "鸟食台旁",
  "蝴蝶花边",
  "蜗牛叶旁",
  "青蛙池边",
  "荷叶旁",
  "松果堆边",
  "树皮下面",
  "沙土盆里",
  "湿纸巾盒里",
  "透明雨棚下",
  "早晨阳光里",
  "傍晚草丛边",
  "亲子观察点"
] as const;

export function buildEcologyScenes<T extends EcologySceneData>(seeds: readonly T[]): T[] {
  return ecologyPlaces.flatMap((place, variantIndex) =>
    seeds.map((seed) => (variantIndex === 0 ? cloneEcologyScene(seed) : buildEcologyVariant(seed, place, variantIndex)))
  );
}

function buildEcologyVariant<T extends EcologySceneData>(seed: T, place: string, variantIndex: number): T {
  return {
    ...seed,
    id: `${seed.id}-place-${String(variantIndex).padStart(2, "0")}`,
    title: `${seed.title}（${place}）`,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      arrows: seed.visual.arrows.map((arrow) => ({ ...arrow })),
      note: `${place}：${seed.visual.note}`
    },
    prompt: `${place}里，${seed.prompt}`,
    evidence: `${place}的线索是：${seed.evidence}`,
    choices: seed.choices.map((choice) => ({ ...choice }))
  };
}

function cloneEcologyScene<T extends EcologySceneData>(seed: T): T {
  return {
    ...seed,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      arrows: seed.visual.arrows.map((arrow) => ({ ...arrow })),
      note: seed.visual.note
    },
    choices: seed.choices.map((choice) => ({ ...choice }))
  };
}
