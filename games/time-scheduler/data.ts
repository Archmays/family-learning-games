interface ScheduleTaskData {
  id: string;
  title: string;
  prompt: string;
  correctSlot: string;
  reason: string;
  visual: {
    tokens: readonly {
      icon: string;
      text: string;
      label: string;
      tone: string;
    }[];
    note: string;
  };
}

interface ElapsedChoiceData {
  id: string;
  label: string;
  hours: number;
  minutes: number;
}

interface ElapsedChallengeData {
  id: string;
  start: string;
  end: string;
  prompt: string;
  visual: {
    icon: string;
    segments: readonly string[];
  };
  choices: readonly ElapsedChoiceData[];
}

const taskContexts = [
  "原始任务",
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周末上午",
  "雨天",
  "晴天",
  "出游前",
  "上学日",
  "阅读日",
  "运动日",
  "手工日",
  "图书馆日",
  "公园日",
  "亲子活动日",
  "家务练习日",
  "复习日",
  "早睡日",
  "访客来之前",
  "去超市前",
  "坐公交前",
  "午休前",
  "午休后",
  "晚饭前",
  "晚饭后",
  "睡前半小时",
  "练字日",
  "英语日",
  "科学观察日",
  "整理日",
  "换季日",
  "洗澡前",
  "洗澡后",
  "看医生前",
  "朋友来玩前",
  "朋友离开后",
  "做点心前",
  "收玩具时",
  "准备书包时",
  "检查清单时",
  "安静练习时",
  "家庭会议前",
  "家庭会议后",
  "外出回家后",
  "周末傍晚",
  "节日前",
  "假期练习日",
  "亲子复盘时"
] as const;

const elapsedStarts = [
  "08:40",
  "07:20",
  "07:35",
  "07:50",
  "08:05",
  "08:20",
  "08:35",
  "08:50",
  "09:05",
  "09:20",
  "09:35",
  "09:50",
  "10:05",
  "10:20",
  "10:35",
  "10:50",
  "11:05",
  "11:20",
  "11:35",
  "11:50",
  "12:05",
  "12:20",
  "12:35",
  "12:50",
  "13:05",
  "13:20",
  "13:35",
  "13:50",
  "14:05",
  "14:20",
  "14:35",
  "14:50",
  "15:05",
  "15:20",
  "15:35",
  "15:50",
  "16:05",
  "16:20",
  "16:35",
  "16:50",
  "17:05",
  "17:20",
  "17:35",
  "17:50",
  "18:05",
  "18:20",
  "18:35",
  "18:50",
  "19:05",
  "19:20"
] as const;

export function buildScheduleTasks<T extends ScheduleTaskData>(seeds: readonly T[]): T[] {
  return taskContexts.flatMap((context, variantIndex) =>
    seeds.map((seed) => (variantIndex === 0 ? cloneScheduleTask(seed) : buildScheduleVariant(seed, context, variantIndex)))
  );
}

export function buildElapsedChallenges<T extends ElapsedChallengeData>(seeds: readonly T[]): T[] {
  return elapsedStarts.flatMap((start, variantIndex) =>
    seeds.map((seed, seedIndex) => (variantIndex === 0 ? cloneElapsedChallenge(seed) : buildElapsedVariant(seed, start, variantIndex, seedIndex)))
  );
}

function buildScheduleVariant<T extends ScheduleTaskData>(seed: T, context: string, variantIndex: number): T {
  return {
    ...seed,
    id: `${seed.id}-context-${String(variantIndex).padStart(2, "0")}`,
    title: `${seed.title}（${context}）`,
    prompt: `${context}：${seed.prompt}`,
    reason: `${context}也一样，${seed.reason}`,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      note: `${context}：${seed.visual.note}`
    }
  };
}

function buildElapsedVariant<T extends ElapsedChallengeData>(seed: T, start: string, variantIndex: number, seedIndex: number): T {
  const duration = getDurationMinutes(seed);
  const shiftedStart = addMinutes(start, seedIndex * 5);
  const end = addMinutes(shiftedStart, duration);
  return {
    ...seed,
    id: `${seed.id}-start-${String(variantIndex).padStart(2, "0")}`,
    start: shiftedStart,
    end,
    prompt: `${shiftedStart} 到 ${end} 经过多久？`,
    visual: {
      icon: seed.visual.icon,
      segments: buildElapsedSegments(shiftedStart, duration)
    },
    choices: buildElapsedChoices(duration)
  };
}

function cloneScheduleTask<T extends ScheduleTaskData>(seed: T): T {
  return {
    ...seed,
    visual: {
      tokens: seed.visual.tokens.map((token) => ({ ...token })),
      note: seed.visual.note
    }
  };
}

function cloneElapsedChallenge<T extends ElapsedChallengeData>(seed: T): T {
  return {
    ...seed,
    visual: {
      icon: seed.visual.icon,
      segments: [...seed.visual.segments]
    },
    choices: seed.choices.map((choice) => ({ ...choice }))
  };
}

function getDurationMinutes(challenge: ElapsedChallengeData): number {
  return parseClockTime(challenge.end) - parseClockTime(challenge.start);
}

function buildElapsedSegments(start: string, duration: number): string[] {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const afterHours = addMinutes(start, hours * 60);
    return [`${start} -> ${afterHours} 是 ${hours} 小时`, `${afterHours} -> ${addMinutes(afterHours, minutes)} 是 ${minutes} 分`];
  }

  const firstStep = Math.max(10, Math.floor(duration / 10) * 10);
  const afterFirstStep = addMinutes(start, firstStep);
  return [`${start} -> ${afterFirstStep} 是 ${firstStep} 分`, `${afterFirstStep} -> ${addMinutes(afterFirstStep, duration - firstStep)} 是 ${duration - firstStep} 分`];
}

function buildElapsedChoices(duration: number): ElapsedChoiceData[] {
  const shorter = Math.max(5, duration - 10);
  const longer = duration + 30;
  return [
    { id: "short", label: formatDuration(shorter), ...toElapsedChoice(shorter) },
    { id: "correct", label: formatDuration(duration), ...toElapsedChoice(duration) },
    { id: "long", label: formatDuration(longer), ...toElapsedChoice(longer) }
  ];
}

function toElapsedChoice(totalMinutes: number): Pick<ElapsedChoiceData, "hours" | "minutes"> {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} 分`;
  }
  if (minutes === 0) {
    return `${hours} 小时`;
  }
  return `${hours} 小时 ${minutes} 分`;
}

function addMinutes(clock: string, minutes: number): string {
  return formatClock(parseClockTime(clock) + minutes);
}

function parseClockTime(value: string): number {
  const [hourText, minuteText] = value.split(":");
  return Number(hourText) * 60 + Number(minuteText);
}

function formatClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
