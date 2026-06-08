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
      { outer: "一", inner: "火", result: "灭", pinyin: "miè", words: ["灭火", "消灭", "灭亡"] },
      { outer: "田", inner: "力", result: "男", pinyin: "nán", words: ["男生", "男人", "男女"] },
      { outer: "手", inner: "目", result: "看", pinyin: "kàn", words: ["看见", "看书", "好看"] },
      { outer: "不", inner: "正", result: "歪", pinyin: "wāi", words: ["歪斜", "歪理"] },
      { outer: "木", inner: "木", result: "林", pinyin: "lín", words: ["树林", "森林"] },
      { outer: "人", inner: "人", result: "从", pinyin: "cóng", words: ["从前", "跟从", "从简"] },
      { outer: "口", inner: "十", result: "古", pinyin: "gǔ", words: ["古诗", "古代", "古老"] },
      { outer: "门", inner: "口", result: "问", pinyin: "wèn", words: ["提问", "问题", "学问"] },
      { outer: "父", inner: "巴", result: "爸", pinyin: "bà", words: ["爸爸"] },
      { outer: "女", inner: "马", result: "妈", pinyin: "mā", words: ["妈妈"] },
      { outer: "门", inner: "日", result: "间", pinyin: "jiān", words: ["中间", "时间"] },
      { outer: "禾", inner: "口", result: "和", pinyin: "hé", words: ["和平", "和气"] },
      { outer: "木", inner: "子", result: "李", pinyin: "lǐ", words: ["李子", "行李"] },
      { outer: "亻", inner: "尔", result: "你", pinyin: "nǐ", words: ["你好", "你们"] },
      { outer: "女", inner: "子", result: "好", pinyin: "hǎo", words: ["好人", "友好"] },
      { outer: "宀", inner: "子", result: "字", pinyin: "zì", words: ["写字", "汉字"] }
    ]),
    word: createHanziWheelMode([
      { outer: "天", inner: "地", result: "天地", pinyin: "tiān dì", words: ["天南地北", "开天辟地"] },
      { outer: "大", inner: "小", result: "大小", pinyin: "dà xiǎo", words: ["这个苹果大小正好"] },
      { outer: "上", inner: "下", result: "上下", pinyin: "shàng xià", words: ["上山下山", "七上八下"] },
      { outer: "人", inner: "口", result: "人口", pinyin: "rén kǒu", words: ["中国人口众多"] },
      { outer: "花", inner: "草", result: "花草", pinyin: "huā cǎo", words: ["花草树木"] },
      { outer: "山", inner: "水", result: "山水", pinyin: "shān shuǐ", words: ["山水画", "桂林山水"] },
      { outer: "读", inner: "书", result: "读书", pinyin: "dú shū", words: ["读书写字"] },
      { outer: "写", inner: "字", result: "写字", pinyin: "xiě zì", words: ["认真写字"] },
      { outer: "大", inner: "雨", result: "大雨", pinyin: "dà yǔ", words: ["大雨倾盆"] },
      { outer: "白", inner: "云", result: "白云", pinyin: "bái yún", words: ["蓝天白云"] },
      { outer: "大", inner: "手", result: "大手", pinyin: "dà shǒu", words: ["大手拉小手"] },
      { outer: "火", inner: "山", result: "火山", pinyin: "huǒ shān", words: ["火山爆发"] }
    ])
  },
  {
    id: "p2",
    label: "二年级",
    char: createHanziWheelMode([
      { outer: "氵", inner: "青", result: "清", pinyin: "qīng", words: ["清水", "清洁", "清澈"] },
      { outer: "日", inner: "青", result: "晴", pinyin: "qíng", words: ["晴天", "晴朗"] },
      { outer: "目", inner: "青", result: "睛", pinyin: "jīng", words: ["眼睛", "目不转睛"] },
      { outer: "讠", inner: "青", result: "请", pinyin: "qǐng", words: ["请客", "请求"] },
      { outer: "忄", inner: "青", result: "情", pinyin: "qíng", words: ["心情", "事情", "友情"] },
      { outer: "虫", inner: "青", result: "蜻", pinyin: "qīng", words: ["蜻蜓"] },
      { outer: "氵", inner: "包", result: "泡", pinyin: "pào", words: ["气泡", "泡沫"] },
      { outer: "火", inner: "包", result: "炮", pinyin: "pào", words: ["鞭炮", "大炮"] },
      { outer: "足", inner: "包", result: "跑", pinyin: "pǎo", words: ["跑步", "逃跑"] },
      { outer: "扌", inner: "包", result: "抱", pinyin: "bào", words: ["拥抱", "抱歉"] },
      { outer: "饣", inner: "包", result: "饱", pinyin: "bǎo", words: ["吃饱", "饱满"] },
      { outer: "木", inner: "公", result: "松", pinyin: "sōng", words: ["松树", "轻松"] },
      { outer: "木", inner: "白", result: "柏", pinyin: "bǎi", words: ["柏树", "柏油"] },
      { outer: "亻", inner: "白", result: "伯", pinyin: "bó", words: ["伯伯", "大伯"] },
      { outer: "氵", inner: "工", result: "江", pinyin: "jiāng", words: ["江河", "长江"] },
      { outer: "氵", inner: "可", result: "河", pinyin: "hé", words: ["河水", "小河"] },
      { outer: "氵", inner: "每", result: "海", pinyin: "hǎi", words: ["大海", "海洋"] },
      { outer: "辶", inner: "井", result: "进", pinyin: "jìn", words: ["进步", "前进"] }
    ]),
    word: createHanziWheelMode([
      { outer: "森", inner: "林", result: "森林", pinyin: "sēn lín", words: ["茂密的森林"] },
      { outer: "美", inner: "丽", result: "美丽", pinyin: "měi lì", words: ["美丽的风景"] },
      { outer: "辛", inner: "苦", result: "辛苦", pinyin: "xīn kǔ", words: ["辛勤劳动很辛苦"] },
      { outer: "世", inner: "界", result: "世界", pinyin: "shì jiè", words: ["世界地图", "新世界"] },
      { outer: "朋", inner: "友", result: "朋友", pinyin: "péng you", words: ["好朋友"] },
      { outer: "仔", inner: "细", result: "仔细", pinyin: "zǐ xì", words: ["仔细观察"] },
      { outer: "欢", inner: "乐", result: "欢乐", pinyin: "huān lè", words: ["欢乐的海洋"] },
      { outer: "发", inner: "现", result: "发现", pinyin: "fā xiàn", words: ["发现新大陆"] },
      { outer: "城", inner: "市", result: "城市", pinyin: "chéng shì", words: ["现代城市"] },
      { outer: "故", inner: "事", result: "故事", pinyin: "gù shi", words: ["讲故事"] },
      { outer: "劳", inner: "动", result: "劳动", pinyin: "láo dòng", words: ["热爱劳动"] },
      { outer: "温", inner: "暖", result: "温暖", pinyin: "wēn nuǎn", words: ["温暖的阳光"] }
    ])
  },
  {
    id: "p3",
    label: "三年级",
    char: createHanziWheelMode([
      { outer: "月", inner: "胆", result: "胆", pinyin: "dǎn", words: ["胆量"] },
      { outer: "月", inner: "巴", result: "肥", pinyin: "féi", words: ["肥胖"] },
      { outer: "月", inner: "要", result: "腰", pinyin: "yāo", words: ["腰带"] },
      { outer: "犭", inner: "王", result: "狂", pinyin: "kuáng", words: ["疯狂"] },
      { outer: "犭", inner: "苗", result: "猫", pinyin: "māo", words: ["花猫"] },
      { outer: "犭", inner: "青", result: "猜", pinyin: "cāi", words: ["猜想"] },
      { outer: "艹", inner: "化", result: "花", pinyin: "huā", words: ["花朵"] },
      { outer: "艹", inner: "早", result: "草", pinyin: "cǎo", words: ["草原"] },
      { outer: "宝盖", inner: "宁", result: "宁", pinyin: "níng", words: ["安宁"] },
      { outer: "穴", inner: "工", result: "空", pinyin: "kōng", words: ["天空"] },
      { outer: "雨", inner: "务", result: "雾", pinyin: "wù", words: ["雾气"] },
      { outer: "雨", inner: "包", result: "雹", pinyin: "báo", words: ["冰雹"] },
      { outer: "宀", inner: "玉", result: "宝", pinyin: "bǎo", words: ["宝贝", "宝贵"] },
      { outer: "宀", inner: "女", result: "安", pinyin: "ān", words: ["安全", "安静"] },
      { outer: "⺮", inner: "毛", result: "笔", pinyin: "bǐ", words: ["铅笔", "毛笔"] },
      { outer: "田", inner: "心", result: "思", pinyin: "sī", words: ["思考", "思想"] },
      { outer: "相", inner: "心", result: "想", pinyin: "xiǎng", words: ["想法", "理想"] },
      { outer: "雨", inner: "田", result: "雷", pinyin: "léi", words: ["雷声", "打雷"] }
    ]),
    word: createHanziWheelMode([
      { outer: "继", inner: "续", result: "继续", pinyin: "jì xù", words: ["继续努力"] },
      { outer: "整", inner: "理", result: "整理", pinyin: "zhěng lǐ", words: ["整理房间"] },
      { outer: "骄", inner: "傲", result: "骄傲", pinyin: "jiāo ào", words: ["虚心使人进步"] },
      { outer: "谦", inner: "虚", result: "谦虚", pinyin: "qiān xū", words: ["谦虚谨慎"] },
      { outer: "懦", inner: "弱", result: "懦弱", pinyin: "nuò ruò", words: ["性格懦弱"] },
      { outer: "荒", inner: "凉", result: "荒凉", pinyin: "huāng liáng", words: ["一片荒凉"] },
      { outer: "朴", inner: "素", result: "朴素", pinyin: "pǔ sù", words: ["衣着朴素"] },
      { outer: "价", inner: "值", result: "价值", pinyin: "jià zhí", words: ["很有价值"] },
      { outer: "观", inner: "赏", result: "观赏", pinyin: "guān shǎng", words: ["观赏花卉"] },
      { outer: "突", inner: "然", result: "突然", pinyin: "tū rán", words: ["突然下雨"] },
      { outer: "愿", inner: "意", result: "愿意", pinyin: "yuàn yì", words: ["我愿意帮忙"] },
      { outer: "准", inner: "备", result: "准备", pinyin: "zhǔn bèi", words: ["准备上课"] }
    ])
  },
  {
    id: "p4",
    label: "四年级",
    char: createHanziWheelMode([
      { outer: "氵", inner: "朝", result: "潮", pinyin: "cháo", words: ["潮湿"] },
      { outer: "堤", inner: "土", result: "堤", pinyin: "dī", words: ["堤坝"] },
      { outer: "阔", inner: "门", result: "阔", pinyin: "kuò", words: ["宽阔"] },
      { outer: "盼", inner: "目", result: "盼", pinyin: "pàn", words: ["盼望"] },
      { outer: "滚", inner: "水", result: "滚", pinyin: "gǔn", words: ["滚动"] },
      { outer: "顿", inner: "页", result: "顿", pinyin: "dùn", words: ["停顿"] },
      { outer: "逐", inner: "豖", result: "逐", pinyin: "zhú", words: ["逐渐"] },
      { outer: "渐", inner: "水", result: "渐", pinyin: "jiàn", words: ["渐渐"] },
      { outer: "犹", inner: "犭", result: "犹", pinyin: "yóu", words: ["犹如"] },
      { outer: "崩", inner: "山", result: "崩", pinyin: "bēng", words: ["崩溃"] },
      { outer: "氵", inner: "羊", result: "洋", pinyin: "yáng", words: ["海洋", "洋溢"] },
      { outer: "氵", inner: "炎", result: "淡", pinyin: "dàn", words: ["淡水", "平淡"] },
      { outer: "氵", inner: "主", result: "注", pinyin: "zhù", words: ["注意", "注视"] },
      { outer: "亻", inner: "故", result: "做", pinyin: "zuò", words: ["做事", "做法"] },
      { outer: "亻", inner: "乍", result: "作", pinyin: "zuò", words: ["作文", "作业"] },
      { outer: "扌", inner: "旨", result: "指", pinyin: "zhǐ", words: ["手指", "指导"] },
      { outer: "讠", inner: "寸", result: "讨", pinyin: "tǎo", words: ["讨论", "讨教"] },
      { outer: "门", inner: "耳", result: "闻", pinyin: "wén", words: ["新闻", "闻名"] }
    ]),
    word: createHanziWheelMode([
      { outer: "笼", inner: "罩", result: "笼罩", pinyin: "lǒng zhào", words: ["薄雾笼罩"] },
      { outer: "沸", inner: "腾", result: "沸腾", pinyin: "fèi téng", words: ["人声鼎沸"] },
      { outer: "奔", inner: "腾", result: "奔腾", pinyin: "bēn téng", words: ["万马奔腾"] },
      { outer: "恢", inner: "复", result: "恢复", pinyin: "huī fù", words: ["恢复健康"] },
      { outer: "灿", inner: "烂", result: "灿烂", pinyin: "càn làn", words: ["阳光灿烂"] },
      { outer: "规", inner: "律", result: "规律", pinyin: "guī lǜ", words: ["自然规律"] },
      { outer: "缝", inner: "隙", result: "缝隙", pinyin: "fèng xì", words: ["从缝隙中穿过"] },
      { outer: "照", inner: "耀", result: "照耀", pinyin: "zhào yào", words: ["光芒照耀"] },
      { outer: "静", inner: "寂", result: "静寂", pinyin: "jìng jì", words: ["静寂的夜晚"] },
      { outer: "浩", inner: "荡", result: "浩荡", pinyin: "hào dàng", words: ["浩浩荡荡"] },
      { outer: "屹", inner: "立", result: "屹立", pinyin: "yì lì", words: ["屹立不倒"] },
      { outer: "霎", inner: "时", result: "霎时", pinyin: "shà shí", words: ["霎时安静"] }
    ])
  },
  {
    id: "p5",
    label: "五年级",
    char: createHanziWheelMode([
      { outer: "路", inner: "鸟", result: "鹭", pinyin: "lù", words: ["白鹭"] },
      { outer: "口", inner: "耆", result: "嗜", pinyin: "shì", words: ["嗜好"] },
      { outer: "匚", inner: "甲", result: "匣", pinyin: "xiá", words: ["镜匣"] },
      { outer: "口", inner: "肖", result: "哨", pinyin: "shào", words: ["哨兵"] },
      { outer: "因", inner: "心", result: "恩", pinyin: "ēn", words: ["恩惠"] },
      { outer: "音", inner: "匀", result: "韵", pinyin: "yùn", words: ["韵味"] },
      { outer: "亡", inner: "目", result: "盲", pinyin: "máng", words: ["盲人"] },
      { outer: "厶", inner: "牛", result: "牟", pinyin: "móu", words: ["牟取"] },
      { outer: "艹", inner: "央", result: "英", pinyin: "yīng", words: ["英雄", "英语"] },
      { outer: "艹", inner: "分", result: "芬", pinyin: "fēn", words: ["芬芳"] },
      { outer: "艹", inner: "方", result: "芳", pinyin: "fāng", words: ["芳香", "芳草"] },
      { outer: "宀", inner: "谷", result: "容", pinyin: "róng", words: ["容易", "容貌"] },
      { outer: "宀", inner: "各", result: "客", pinyin: "kè", words: ["客人", "客观"] },
      { outer: "⺮", inner: "官", result: "管", pinyin: "guǎn", words: ["管理", "水管"] },
      { outer: "⺮", inner: "合", result: "答", pinyin: "dá", words: ["回答", "答案"] },
      { outer: "音", inner: "心", result: "意", pinyin: "yì", words: ["意思", "意义"] },
      { outer: "口", inner: "贝", result: "员", pinyin: "yuán", words: ["队员", "成员"] },
      { outer: "化", inner: "贝", result: "货", pinyin: "huò", words: ["货物", "百货"] }
    ]),
    word: createHanziWheelMode([
      { outer: "精", inner: "致", result: "精致", pinyin: "jīng zhì", words: ["做工精致"] },
      { outer: "配", inner: "合", result: "配合", pinyin: "pèi hé", words: ["互相配合"] },
      { outer: "适", inner: "宜", result: "适宜", pinyin: "shì yí", words: ["气候适宜"] },
      { outer: "播", inner: "种", result: "播种", pinyin: "bō zhòng", words: ["播种希望"] },
      { outer: "浇", inner: "水", result: "浇水", pinyin: "jiāo shuǐ", words: ["给花浇水"] },
      { outer: "吩", inner: "咐", result: "吩咐", pinyin: "fēn fù", words: ["听从吩咐"] },
      { outer: "爱", inner: "慕", result: "爱慕", pinyin: "ài mù", words: ["爱慕虚荣"] },
      { outer: "体", inner: "面", result: "体面", pinyin: "tǐ miàn", words: ["工作体面"] },
      { outer: "糕", inner: "饼", result: "糕饼", pinyin: "gāo bǐng", words: ["美味的糕饼"] },
      { outer: "依", inner: "恋", result: "依恋", pinyin: "yī liàn", words: ["依恋故乡"] },
      { outer: "嫌", inner: "弃", result: "嫌弃", pinyin: "xián qì", words: ["不应嫌弃"] },
      { outer: "分", inner: "辨", result: "分辨", pinyin: "fēn biàn", words: ["分辨方向"] }
    ])
  },
  {
    id: "p6",
    label: "六年级",
    char: createHanziWheelMode([
      { outer: "毛", inner: "炎", result: "毯", pinyin: "tǎn", words: ["地毯"] },
      { outer: "阝", inner: "东", result: "陈", pinyin: "chén", words: ["陈列"] },
      { outer: "尚", inner: "衣", result: "裳", pinyin: "shang", words: ["衣裳"] },
      { outer: "虫", inner: "工", result: "虹", pinyin: "hóng", words: ["彩虹"] },
      { outer: "足", inner: "帝", result: "蹄", pinyin: "tí", words: ["马蹄"] },
      { outer: "府", inner: "肉", result: "腐", pinyin: "fǔ", words: ["豆腐"] },
      { outer: "羊", inner: "丑", result: "羞", pinyin: "xiū", words: ["害羞"] },
      { outer: "日", inner: "暴", result: "曝", pinyin: "pù", words: ["曝晒"] },
      { outer: "讠", inner: "普", result: "谱", pinyin: "pǔ", words: ["乐谱"] },
      { outer: "雨", inner: "相", result: "霜", pinyin: "shuāng", words: ["霜降", "冰霜"] },
      { outer: "雨", inner: "令", result: "零", pinyin: "líng", words: ["零星", "零件"] },
      { outer: "穴", inner: "牙", result: "穿", pinyin: "chuān", words: ["穿过", "穿衣"] },
      { outer: "穴", inner: "九", result: "究", pinyin: "jiū", words: ["研究", "追究"] },
      { outer: "分", inner: "皿", result: "盆", pinyin: "pén", words: ["花盆", "脸盆"] },
      { outer: "舟", inner: "皿", result: "盘", pinyin: "pán", words: ["盘子", "棋盘"] },
      { outer: "辶", inner: "米", result: "迷", pinyin: "mí", words: ["迷路", "迷人"] },
      { outer: "辶", inner: "首", result: "道", pinyin: "dào", words: ["道路", "道理"] },
      { outer: "广", inner: "廷", result: "庭", pinyin: "tíng", words: ["家庭", "庭院"] }
    ]),
    word: createHanziWheelMode([
      { outer: "渲", inner: "染", result: "渲染", pinyin: "xuàn rǎn", words: ["渲染气氛"] },
      { outer: "勾", inner: "勒", result: "勾勒", pinyin: "gōu lè", words: ["勾勒轮廓"] },
      { outer: "惊", inner: "叹", result: "惊叹", pinyin: "jīng tàn", words: ["令人惊叹"] },
      { outer: "回", inner: "味", result: "回味", pinyin: "huí wèi", words: ["回味无穷"] },
      { outer: "乐", inner: "趣", result: "乐趣", pinyin: "lè qù", words: ["享受乐趣"] },
      { outer: "洒", inner: "脱", result: "洒脱", pinyin: "sǎ tuō", words: ["举止洒脱"] },
      { outer: "迂", inner: "回", result: "迂回", pinyin: "yū huí", words: ["迂回战术"] },
      { outer: "拘", inner: "束", result: "拘束", pinyin: "jū shù", words: ["显得很拘束"] },
      { outer: "幽", inner: "雅", result: "幽雅", pinyin: "yōu yǎ", words: ["环境幽雅"] },
      { outer: "咆", inner: "哮", result: "咆哮", pinyin: "páo xiào", words: ["河水咆哮"] },
      { outer: "澎", inner: "湃", result: "澎湃", pinyin: "péng pài", words: ["心潮澎湃"] },
      { outer: "瘦", inner: "削", result: "瘦削", pinyin: "shòu xuē", words: ["脸庞瘦削"] }
    ])
  },
  {
    id: "j1",
    label: "初一",
    char: createHanziWheelMode([
      { outer: "酉", inner: "云", result: "酝", pinyin: "yùn", words: ["酝酿"] },
      { outer: "酉", inner: "良", result: "酿", pinyin: "niàng", words: ["酿造"] },
      { outer: "穴", inner: "果", result: "窠", pinyin: "kē", words: ["窠巢"] },
      { outer: "口", inner: "侯", result: "喉", pinyin: "hóu", words: ["喉咙"] },
      { outer: "口", inner: "龙", result: "咙", pinyin: "lóng", words: ["喉咙"] },
      { outer: "艹", inner: "位", result: "莅", pinyin: "lì", words: ["莅临"] },
      { outer: "文", inner: "口", result: "吝", pinyin: "lìn", words: ["吝啬"] },
      { outer: "良", inner: "月", result: "朗", pinyin: "lǎng", words: ["朗润"] },
      { outer: "氵", inner: "析", result: "淅", pinyin: "xī", words: ["淅沥"] },
      { outer: "氵", inner: "力", result: "沥", pinyin: "lì", words: ["沥青"] },
      { outer: "木", inner: "风", result: "枫", pinyin: "fēng", words: ["枫叶"] },
      { outer: "木", inner: "艮", result: "根", pinyin: "gēn", words: ["根系", "根本"] },
      { outer: "亻", inner: "亭", result: "停", pinyin: "tíng", words: ["停止", "停留"] },
      { outer: "亻", inner: "象", result: "像", pinyin: "xiàng", words: ["画像", "好像"] },
      { outer: "讠", inner: "射", result: "谢", pinyin: "xiè", words: ["感谢", "道谢"] },
      { outer: "疒", inner: "丙", result: "病", pinyin: "bìng", words: ["疾病", "病痛"] },
      { outer: "疒", inner: "甬", result: "痛", pinyin: "tòng", words: ["疼痛", "痛快"] },
      { outer: "尸", inner: "古", result: "居", pinyin: "jū", words: ["居住", "邻居"] }
    ]),
    word: createHanziWheelMode([
      { outer: "酝", inner: "酿", result: "酝酿", pinyin: "yùn niàng", words: ["酝酿已久"] },
      { outer: "卖", inner: "弄", result: "卖弄", pinyin: "mài nong", words: ["卖弄才华"] },
      { outer: "嘹", inner: "亮", result: "嘹亮", pinyin: "liáo liàng", words: ["歌声嘹亮"] },
      { outer: "黄", inner: "晕", result: "黄晕", pinyin: "huáng yùn", words: ["灯光黄晕"] },
      { outer: "烘", inner: "托", result: "烘托", pinyin: "hōng tuō", words: ["烘托氛围"] },
      { outer: "静", inner: "默", result: "静默", pinyin: "jìng mò", words: ["全场静默"] },
      { outer: "风", inner: "筝", result: "风筝", pinyin: "fēng zheng", words: ["放风筝"] },
      { outer: "抖", inner: "擞", result: "抖擞", pinyin: "dǒu sǒu", words: ["精神抖擞"] },
      { outer: "健", inner: "壮", result: "健壮", pinyin: "jiàn zhuàng", words: ["身体健壮"] },
      { outer: "朗", inner: "润", result: "朗润", pinyin: "lǎng rùn", words: ["山色朗润"] },
      { outer: "贮", inner: "蓄", result: "贮蓄", pinyin: "zhù xù", words: ["贮蓄水分"] },
      { outer: "澄", inner: "清", result: "澄清", pinyin: "chéng qīng", words: ["湖水澄清"] }
    ])
  },
  {
    id: "j2",
    label: "初二",
    char: createHanziWheelMode([
      { outer: "氵", inner: "贵", result: "溃", pinyin: "kuì", words: ["溃退"] },
      { outer: "氵", inner: "世", result: "泄", pinyin: "xiè", words: ["泄气"] },
      { outer: "叔", inner: "目", result: "督", pinyin: "dū", words: ["督战"] },
      { outer: "尧", inner: "羽", result: "翘", pinyin: "qiáo", words: ["翘首"] },
      { outer: "酉", inner: "告", result: "酷", pinyin: "kù", words: ["酷似"] },
      { outer: "忄", inner: "肖", result: "悄", pinyin: "qiǎo", words: ["悄然"] },
      { outer: "女", inner: "闲", result: "娴", pinyin: "xián", words: ["娴熟"] },
      { outer: "忄", inner: "解", result: "懈", pinyin: "xiè", words: ["松懈"] },
      { outer: "火", inner: "喿", result: "燥", pinyin: "zào", words: ["燥热"] },
      { outer: "歹", inner: "单", result: "殚", pinyin: "dān", words: ["殚精竭虑"] },
      { outer: "广", inner: "隶", result: "康", pinyin: "kāng", words: ["健康", "康复"] },
      { outer: "广", inner: "郎", result: "廊", pinyin: "láng", words: ["走廊", "长廊"] },
      { outer: "疒", inner: "正", result: "症", pinyin: "zhèng", words: ["病症", "症状"] },
      { outer: "疒", inner: "风", result: "疯", pinyin: "fēng", words: ["疯狂", "发疯"] },
      { outer: "尸", inner: "至", result: "屋", pinyin: "wū", words: ["屋子", "房屋"] },
      { outer: "尸", inner: "云", result: "层", pinyin: "céng", words: ["层次", "云层"] },
      { outer: "走", inner: "召", result: "超", pinyin: "chāo", words: ["超过", "超越"] },
      { outer: "走", inner: "取", result: "趣", pinyin: "qù", words: ["兴趣", "乐趣"] }
    ]),
    word: createHanziWheelMode([
      { outer: "摧", inner: "枯", result: "摧枯", pinyin: "cuī kū", words: ["摧枯拉朽"] },
      { outer: "拉", inner: "朽", result: "拉朽", pinyin: "lā xiǔ", words: ["摧枯拉朽"] },
      { outer: "锐", inner: "不", result: "锐不", pinyin: "ruì bù", words: ["锐不可当"] },
      { outer: "可", inner: "当", result: "可当", pinyin: "kě dāng", words: ["锐不可当"] },
      { outer: "娴", inner: "熟", result: "娴熟", pinyin: "xián shú", words: ["技艺娴熟"] },
      { outer: "一", inner: "丝", result: "一丝", pinyin: "yī sī", words: ["一丝不苟"] },
      { outer: "不", inner: "苟", result: "不苟", pinyin: "bù gǒu", words: ["一丝不苟"] },
      { outer: "惊", inner: "心", result: "惊心", pinyin: "jīng xīn", words: ["惊心动魄"] },
      { outer: "动", inner: "魄", result: "动魄", pinyin: "dòng pò", words: ["惊心动魄"] },
      { outer: "浩", inner: "瀚", result: "浩瀚", pinyin: "hào hàn", words: ["浩瀚星空"] },
      { outer: "黝", inner: "黑", result: "黝黑", pinyin: "yǒu hēi", words: ["皮肤黝黑"] },
      { outer: "滞", inner: "留", result: "滞留", pinyin: "zhì liú", words: ["车辆滞留"] }
    ])
  },
  {
    id: "j3",
    label: "初三",
    char: createHanziWheelMode([
      { outer: "女", inner: "夭", result: "妖", pinyin: "yāo", words: ["妖娆"] },
      { outer: "女", inner: "尧", result: "娆", pinyin: "ráo", words: ["妖娆"] },
      { outer: "扌", inner: "斤", result: "折", pinyin: "zhé", words: ["折腰"] },
      { outer: "氵", inner: "干", result: "汗", pinyin: "hán", words: ["可汗"] },
      { outer: "钅", inner: "帛", result: "锦", pinyin: "jǐn", words: ["锦绣"] },
      { outer: "女", inner: "单", result: "婵", pinyin: "chán", words: ["婵娟"] },
      { outer: "口", inner: "亚", result: "哑", pinyin: "yǎ", words: ["哑巴"] },
      { outer: "囗", inner: "甫", result: "圃", pinyin: "pǔ", words: ["苗圃"] },
      { outer: "钅", inner: "固", result: "锢", pinyin: "gù", words: ["禁锢"] },
      { outer: "囗", inner: "卷", result: "圈", pinyin: "quān", words: ["圆圈", "圈点"] },
      { outer: "囗", inner: "员", result: "圆", pinyin: "yuán", words: ["圆满", "圆形"] },
      { outer: "辶", inner: "兆", result: "逃", pinyin: "táo", words: ["逃跑", "逃离"] },
      { outer: "辶", inner: "亦", result: "迹", pinyin: "jì", words: ["足迹", "痕迹"] },
      { outer: "门", inner: "兑", result: "阅", pinyin: "yuè", words: ["阅读", "阅历"] },
      { outer: "门", inner: "心", result: "闷", pinyin: "mèn", words: ["苦闷", "闷热"] },
      { outer: "广", inner: "发", result: "废", pinyin: "fèi", words: ["废弃", "作废"] },
      { outer: "走", inner: "戉", result: "越", pinyin: "yuè", words: ["越过", "超越"] },
      { outer: "匚", inner: "矢", result: "医", pinyin: "yī", words: ["医生", "医治"] }
    ]),
    word: createHanziWheelMode([
      { outer: "妖", inner: "娆", result: "妖娆", pinyin: "yāo ráo", words: ["分外妖娆"] },
      { outer: "风", inner: "骚", result: "风骚", pinyin: "fēng sāo", words: ["略输风骚"] },
      { outer: "天", inner: "骄", result: "天骄", pinyin: "tiān jiāo", words: ["一代天骄"] },
      { outer: "风", inner: "流", result: "风流", pinyin: "fēng liú", words: ["数风流人物"] },
      { outer: "禁", inner: "锢", result: "禁锢", pinyin: "jìn gù", words: ["思想禁锢"] },
      { outer: "静", inner: "谧", result: "静谧", pinyin: "jìng mì", words: ["环境静谧"] },
      { outer: "喧", inner: "嚷", result: "喧嚷", pinyin: "xuān rǎng", words: ["大声喧嚷"] },
      { outer: "颤", inner: "动", result: "颤动", pinyin: "chàn dòng", words: ["微微颤动"] },
      { outer: "深", inner: "邃", result: "深邃", pinyin: "shēn suì", words: ["目光深邃"] },
      { outer: "娉", inner: "婷", result: "娉婷", pinyin: "pīng tíng", words: ["姿态娉婷"] },
      { outer: "忧", inner: "戚", result: "忧戚", pinyin: "yōu qī", words: ["心中忧戚"] },
      { outer: "飘", inner: "逸", result: "飘逸", pinyin: "piāo yì", words: ["姿态飘逸"] }
    ])
  }
];
