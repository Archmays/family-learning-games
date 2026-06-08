export interface EnglishWord {
  word: string;
  meaning: string;
  icon: string;
}

export interface EnglishWordCategory {
  title: string;
  words: EnglishWord[];
}

export interface PinyinCard {
  char: string;
  pinyin: string;
  meaningCn: string;
  meaningEn: string;
}

export interface HanziWheelPair {
  outer: string;
  inner: string;
  result: string;
  pinyin: string;
  words: string[];
}

export interface HanziWheelModeData {
  outerOptions: string[];
  innerOptions: string[];
  validPairs: HanziWheelPair[];
}

export interface HanziWheelSet {
  id: string;
  label: string;
  char: HanziWheelModeData;
  word: HanziWheelModeData;
}

export const englishWordCategories: EnglishWordCategory[] = [
  {
    title: "动物",
    words: [
      { word: "cat", meaning: "猫", icon: "🐱" },
      { word: "dog", meaning: "狗", icon: "🐶" },
      { word: "pig", meaning: "猪", icon: "🐷" },
      { word: "cow", meaning: "奶牛", icon: "🐮" },
      { word: "duck", meaning: "鸭子", icon: "🦆" },
      { word: "fish", meaning: "鱼", icon: "🐟" },
      { word: "bear", meaning: "熊", icon: "🐻" },
      { word: "rabbit", meaning: "兔子", icon: "🐰" },
      { word: "frog", meaning: "青蛙", icon: "🐸" },
      { word: "tiger", meaning: "老虎", icon: "🐯" },
      { word: "horse", meaning: "马", icon: "🐴" },
      { word: "bee", meaning: "蜜蜂", icon: "🐝" }
    ]
  },
  {
    title: "家庭与人物",
    words: [
      { word: "dad", meaning: "爸爸", icon: "👨" },
      { word: "mom", meaning: "妈妈", icon: "👩" },
      { word: "baby", meaning: "宝宝", icon: "👶" },
      { word: "boy", meaning: "男孩", icon: "👦" },
      { word: "girl", meaning: "女孩", icon: "👧" },
      { word: "teacher", meaning: "老师", icon: "👩‍🏫" },
      { word: "friend", meaning: "朋友", icon: "👫" },
      { word: "family", meaning: "家庭", icon: "👨‍👩‍👧" }
    ]
  },
  {
    title: "颜色与数字",
    words: [
      { word: "red", meaning: "红色", icon: "🟥" },
      { word: "blue", meaning: "蓝色", icon: "🟦" },
      { word: "green", meaning: "绿色", icon: "🟩" },
      { word: "yellow", meaning: "黄色", icon: "🟨" },
      { word: "one", meaning: "一", icon: "1" },
      { word: "two", meaning: "二", icon: "2" },
      { word: "three", meaning: "三", icon: "3" },
      { word: "ten", meaning: "十", icon: "10" }
    ]
  },
  {
    title: "食物",
    words: [
      { word: "apple", meaning: "苹果", icon: "🍎" },
      { word: "banana", meaning: "香蕉", icon: "🍌" },
      { word: "egg", meaning: "鸡蛋", icon: "🥚" },
      { word: "milk", meaning: "牛奶", icon: "🥛" },
      { word: "cake", meaning: "蛋糕", icon: "🍰" },
      { word: "water", meaning: "水", icon: "💧" },
      { word: "bread", meaning: "面包", icon: "🍞" },
      { word: "rice", meaning: "米饭", icon: "🍚" }
    ]
  },
  {
    title: "动作",
    words: [
      { word: "run", meaning: "跑", icon: "🏃" },
      { word: "jump", meaning: "跳", icon: "↗" },
      { word: "walk", meaning: "走", icon: "🚶" },
      { word: "sit", meaning: "坐", icon: "🪑" },
      { word: "sleep", meaning: "睡觉", icon: "💤" },
      { word: "eat", meaning: "吃", icon: "🍽" },
      { word: "drink", meaning: "喝", icon: "🥤" },
      { word: "sing", meaning: "唱歌", icon: "🎤" }
    ]
  }
];

export const englishWords: EnglishWord[] = englishWordCategories.flatMap((category) => category.words);

export const pinyinCards: PinyinCard[] = [
  { char: "爱", pinyin: "ài", meaningCn: "喜爱", meaningEn: "love" },
  { char: "八", pinyin: "bā", meaningCn: "数字8", meaningEn: "eight" },
  { char: "爸", pinyin: "bà", meaningCn: "父亲", meaningEn: "dad" },
  { char: "杯", pinyin: "bēi", meaningCn: "杯子", meaningEn: "cup" },
  { char: "北", pinyin: "běi", meaningCn: "北方", meaningEn: "north" },
  { char: "本", pinyin: "běn", meaningCn: "书本", meaningEn: "book" },
  { char: "不", pinyin: "bù", meaningCn: "不/非", meaningEn: "no" },
  { char: "菜", pinyin: "cài", meaningCn: "菜肴", meaningEn: "dish" },
  { char: "茶", pinyin: "chá", meaningCn: "茶叶", meaningEn: "tea" },
  { char: "吃", pinyin: "chī", meaningCn: "吃饭", meaningEn: "eat" },
  { char: "大", pinyin: "dà", meaningCn: "巨大", meaningEn: "big" },
  { char: "的", pinyin: "de", meaningCn: "属于", meaningEn: "of" },
  { char: "点", pinyin: "diǎn", meaningCn: "时刻", meaningEn: "o'clock" },
  { char: "电", pinyin: "diàn", meaningCn: "电力", meaningEn: "electric" },
  { char: "读", pinyin: "dú", meaningCn: "读书", meaningEn: "read" },
  { char: "对", pinyin: "duì", meaningCn: "正确", meaningEn: "correct" },
  { char: "多", pinyin: "duō", meaningCn: "很多", meaningEn: "many" },
  { char: "儿", pinyin: "ér", meaningCn: "儿子", meaningEn: "son" },
  { char: "二", pinyin: "èr", meaningCn: "数字2", meaningEn: "two" },
  { char: "饭", pinyin: "fàn", meaningCn: "米饭", meaningEn: "rice" },
  { char: "飞", pinyin: "fēi", meaningCn: "飞行", meaningEn: "fly" },
  { char: "高", pinyin: "gāo", meaningCn: "高大", meaningEn: "high" },
  { char: "狗", pinyin: "gǒu", meaningCn: "小狗", meaningEn: "dog" },
  { char: "好", pinyin: "hǎo", meaningCn: "很好", meaningEn: "good" },
  { char: "喝", pinyin: "hē", meaningCn: "喝水", meaningEn: "drink" },
  { char: "家", pinyin: "jiā", meaningCn: "家庭", meaningEn: "home" },
  { char: "叫", pinyin: "jiào", meaningCn: "名字叫", meaningEn: "call" },
  { char: "九", pinyin: "jiǔ", meaningCn: "数字9", meaningEn: "nine" },
  { char: "开", pinyin: "kāi", meaningCn: "打开", meaningEn: "open" },
  { char: "看", pinyin: "kàn", meaningCn: "看见", meaningEn: "look" },
  { char: "来", pinyin: "lái", meaningCn: "来到", meaningEn: "come" },
  { char: "冷", pinyin: "lěng", meaningCn: "寒冷", meaningEn: "cold" },
  { char: "里", pinyin: "lǐ", meaningCn: "里面", meaningEn: "inside" },
  { char: "六", pinyin: "liù", meaningCn: "数字6", meaningEn: "six" },
  { char: "妈", pinyin: "mā", meaningCn: "母亲", meaningEn: "mom" },
  { char: "买", pinyin: "mǎi", meaningCn: "买东西", meaningEn: "buy" },
  { char: "猫", pinyin: "māo", meaningCn: "小猫", meaningEn: "cat" },
  { char: "门", pinyin: "mén", meaningCn: "大门", meaningEn: "door" },
  { char: "明", pinyin: "míng", meaningCn: "明天", meaningEn: "bright" },
  { char: "你", pinyin: "nǐ", meaningCn: "你们", meaningEn: "you" },
  { char: "七", pinyin: "qī", meaningCn: "数字7", meaningEn: "seven" },
  { char: "起", pinyin: "qǐ", meaningCn: "起床", meaningEn: "rise" },
  { char: "去", pinyin: "qù", meaningCn: "去哪", meaningEn: "go" },
  { char: "热", pinyin: "rè", meaningCn: "炎热", meaningEn: "hot" },
  { char: "人", pinyin: "rén", meaningCn: "人类", meaningEn: "person" },
  { char: "日", pinyin: "rì", meaningCn: "日子", meaningEn: "sun" },
  { char: "三", pinyin: "sān", meaningCn: "数字3", meaningEn: "three" },
  { char: "上", pinyin: "shàng", meaningCn: "上面", meaningEn: "up" },
  { char: "十", pinyin: "shí", meaningCn: "数字10", meaningEn: "ten" },
  { char: "是", pinyin: "shì", meaningCn: "是非", meaningEn: "is" },
  { char: "书", pinyin: "shū", meaningCn: "书本", meaningEn: "book" },
  { char: "水", pinyin: "shuǐ", meaningCn: "喝水", meaningEn: "water" },
  { char: "四", pinyin: "sì", meaningCn: "数字4", meaningEn: "four" },
  { char: "他", pinyin: "tā", meaningCn: "男性他", meaningEn: "he" },
  { char: "她", pinyin: "tā", meaningCn: "女性她", meaningEn: "she" },
  { char: "天", pinyin: "tiān", meaningCn: "天空", meaningEn: "sky" },
  { char: "听", pinyin: "tīng", meaningCn: "听讲", meaningEn: "listen" },
  { char: "我", pinyin: "wǒ", meaningCn: "我们", meaningEn: "me" },
  { char: "五", pinyin: "wǔ", meaningCn: "数字5", meaningEn: "five" },
  { char: "小", pinyin: "xiǎo", meaningCn: "微小", meaningEn: "small" },
  { char: "写", pinyin: "xiě", meaningCn: "写字", meaningEn: "write" },
  { char: "学", pinyin: "xué", meaningCn: "学习", meaningEn: "study" },
  { char: "一", pinyin: "yī", meaningCn: "数字1", meaningEn: "one" },
  { char: "有", pinyin: "yǒu", meaningCn: "拥有", meaningEn: "have" },
  { char: "月", pinyin: "yuè", meaningCn: "月亮", meaningEn: "moon" },
  { char: "在", pinyin: "zài", meaningCn: "正在", meaningEn: "at" },
  { char: "这", pinyin: "zhè", meaningCn: "这里", meaningEn: "this" },
  { char: "中", pinyin: "zhōng", meaningCn: "中国", meaningEn: "middle" },
  { char: "字", pinyin: "zì", meaningCn: "汉字", meaningEn: "word" },
  { char: "做", pinyin: "zuò", meaningCn: "做事", meaningEn: "do" },
  { char: "坐", pinyin: "zuò", meaningCn: "坐下", meaningEn: "sit" }
];

function createHanziWheelMode(validPairs: HanziWheelPair[]): HanziWheelModeData {
  return {
    outerOptions: unique(validPairs.map((pair) => pair.outer)),
    innerOptions: unique(validPairs.map((pair) => pair.inner)),
    validPairs
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

export const hanziWheelSets: HanziWheelSet[] = [
  {
    id: "p1",
    label: "一年级",
    char: createHanziWheelMode([
      { outer: "日", inner: "月", result: "明", pinyin: "míng", words: ["明天", "光明", "明白"] },
      { outer: "小", inner: "大", result: "尖", pinyin: "jiān", words: ["笔尖", "尖刀", "眼尖"] },
      { outer: "一", inner: "火", result: "灭", pinyin: "miè", words: ["灭火", "消灭"] },
      { outer: "田", inner: "力", result: "男", pinyin: "nán", words: ["男生", "男人"] },
      { outer: "手", inner: "目", result: "看", pinyin: "kàn", words: ["看见", "看书"] },
      { outer: "木", inner: "木", result: "林", pinyin: "lín", words: ["树林", "森林"] },
      { outer: "口", inner: "十", result: "古", pinyin: "gǔ", words: ["古诗", "古代"] },
      { outer: "门", inner: "口", result: "问", pinyin: "wèn", words: ["提问", "问题"] },
      { outer: "父", inner: "巴", result: "爸", pinyin: "bà", words: ["爸爸"] },
      { outer: "女", inner: "马", result: "妈", pinyin: "mā", words: ["妈妈"] }
    ]),
    word: createHanziWheelMode([
      { outer: "天", inner: "地", result: "天地", pinyin: "tiān dì", words: ["天南地北", "开天辟地"] },
      { outer: "大", inner: "小", result: "大小", pinyin: "dà xiǎo", words: ["这个苹果大小正好"] },
      { outer: "上", inner: "下", result: "上下", pinyin: "shàng xià", words: ["上山下山", "七上八下"] },
      { outer: "花", inner: "草", result: "花草", pinyin: "huā cǎo", words: ["花草树木"] },
      { outer: "山", inner: "水", result: "山水", pinyin: "shān shuǐ", words: ["山水画", "桂林山水"] },
      { outer: "读", inner: "书", result: "读书", pinyin: "dú shū", words: ["读书写字"] }
    ])
  },
  {
    id: "p2",
    label: "二年级",
    char: createHanziWheelMode([
      { outer: "氵", inner: "青", result: "清", pinyin: "qīng", words: ["清水", "清洁"] },
      { outer: "日", inner: "青", result: "晴", pinyin: "qíng", words: ["晴天", "晴朗"] },
      { outer: "目", inner: "青", result: "睛", pinyin: "jīng", words: ["眼睛"] },
      { outer: "讠", inner: "青", result: "请", pinyin: "qǐng", words: ["请客", "请求"] },
      { outer: "忄", inner: "青", result: "情", pinyin: "qíng", words: ["心情", "事情"] },
      { outer: "虫", inner: "青", result: "蜻", pinyin: "qīng", words: ["蜻蜓"] },
      { outer: "氵", inner: "包", result: "泡", pinyin: "pào", words: ["气泡", "泡沫"] },
      { outer: "扌", inner: "包", result: "抱", pinyin: "bào", words: ["拥抱", "抱歉"] },
      { outer: "饣", inner: "包", result: "饱", pinyin: "bǎo", words: ["吃饱", "饱满"] },
      { outer: "木", inner: "公", result: "松", pinyin: "sōng", words: ["松树", "轻松"] }
    ]),
    word: createHanziWheelMode([
      { outer: "森", inner: "林", result: "森林", pinyin: "sēn lín", words: ["茂密的森林"] },
      { outer: "美", inner: "丽", result: "美丽", pinyin: "měi lì", words: ["美丽的风景"] },
      { outer: "朋", inner: "友", result: "朋友", pinyin: "péng you", words: ["好朋友"] },
      { outer: "仔", inner: "细", result: "仔细", pinyin: "zǐ xì", words: ["仔细观察"] },
      { outer: "欢", inner: "乐", result: "欢乐", pinyin: "huān lè", words: ["欢乐的海洋"] },
      { outer: "故", inner: "事", result: "故事", pinyin: "gù shi", words: ["讲故事"] }
    ])
  },
  {
    id: "p3",
    label: "三年级",
    char: createHanziWheelMode([
      { outer: "月", inner: "巴", result: "肥", pinyin: "féi", words: ["肥胖"] },
      { outer: "月", inner: "要", result: "腰", pinyin: "yāo", words: ["腰带"] },
      { outer: "犭", inner: "王", result: "狂", pinyin: "kuáng", words: ["疯狂"] },
      { outer: "犭", inner: "苗", result: "猫", pinyin: "māo", words: ["花猫"] },
      { outer: "犭", inner: "青", result: "猜", pinyin: "cāi", words: ["猜想"] },
      { outer: "艹", inner: "化", result: "花", pinyin: "huā", words: ["花朵"] },
      { outer: "艹", inner: "早", result: "草", pinyin: "cǎo", words: ["草原"] },
      { outer: "穴", inner: "工", result: "空", pinyin: "kōng", words: ["天空"] }
    ]),
    word: createHanziWheelMode([
      { outer: "继", inner: "续", result: "继续", pinyin: "jì xù", words: ["继续努力"] },
      { outer: "整", inner: "理", result: "整理", pinyin: "zhěng lǐ", words: ["整理房间"] },
      { outer: "谦", inner: "虚", result: "谦虚", pinyin: "qiān xū", words: ["谦虚谨慎"] },
      { outer: "朴", inner: "素", result: "朴素", pinyin: "pǔ sù", words: ["衣着朴素"] },
      { outer: "价", inner: "值", result: "价值", pinyin: "jià zhí", words: ["很有价值"] },
      { outer: "观", inner: "赏", result: "观赏", pinyin: "guān shǎng", words: ["观赏花卉"] }
    ])
  }
];
