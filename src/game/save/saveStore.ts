import {
  applyStageCompletion,
  type SkillOutcome,
  type CompletionProgressResult,
  type StageCompletionMetadata
} from "../domain/progression/progression";
import type { SkillTag } from "../domain/content/types";

export interface StageSave {
  stars: number;
  completedAt: string;
  hintsUsed: number;
  mistakes: number;
  completions: number;
  bestHintsUsed: number;
  bestMistakes: number;
}

export interface AchievementSave {
  id: string;
  earnedAt: string;
}

export interface DailyProgressSave {
  date: string;
  completedStages: number;
  hintsUsed: number;
  mistakes: number;
  starsEarned: number;
}

export interface SkillAttemptSave {
  outcome: SkillOutcome;
  maxHintLevel: number;
  mistakes: number;
  wrongType: string | null;
  completedAt: string;
}

export interface SkillProgressSave {
  tag: SkillTag;
  attempts: number;
  independentCompletions: number;
  hintedCompletions: number;
  recoveredCompletions: number;
  lastOutcome: SkillOutcome | null;
  lastHintLevel: number;
  lastMistakes: number;
  lastWrongType: string | null;
  updatedAt: string;
  recentAttempts: SkillAttemptSave[];
}

export interface SkillReviewSave {
  tag: SkillTag;
  nextReviewDate: string;
  stepIndex: number;
  dueCount: number;
}

export interface AccessibilitySettingsSave {
  largeText: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  leftHanded: boolean;
}

export interface SaveData {
  stages: Record<string, StageSave>;
  totalHintsUsed: number;
  totalMistakes: number;
  wrongByType: Record<string, number>;
  achievements: Record<string, AchievementSave>;
  earnedStickerIds: string[];
  dailyProgress: Record<string, DailyProgressSave>;
  skills: Partial<Record<SkillTag, SkillProgressSave>>;
  reviewSchedule: Partial<Record<SkillTag, SkillReviewSave>>;
  accessibility: AccessibilitySettingsSave;
  currentStreak: number;
  lastPlayDate: string | null;
}

const saveKey = "math-battle-web/save-v1";

export function loadSave(): SaveData {
  if (!canUseLocalStorage()) {
    return emptySave();
  }

  const raw = localStorage.getItem(saveKey);
  if (!raw) {
    return emptySave();
  }

  try {
    return normalizeSave(JSON.parse(raw) as Partial<SaveData>);
  } catch {
    return emptySave();
  }
}

export function saveStageCompletion(
  stageId: string,
  stars: number,
  hintsUsed: number,
  mistakes: number,
  wrongType: string,
  metadata: StageCompletionMetadata = {
    usedCombo: false,
    usedSubtraction: false,
    wrongTypes: {}
  }
): CompletionProgressResult {
  const save = loadSave();
  const result = applyStageCompletion(save, stageId, stars, hintsUsed, mistakes, wrongType, metadata);

  if (canUseLocalStorage()) {
    localStorage.setItem(saveKey, JSON.stringify(result.save));
  }

  return result;
}

export function resetSave(): void {
  if (canUseLocalStorage()) {
    localStorage.removeItem(saveKey);
  }
}

export function updateAccessibilitySettings(settings: Partial<AccessibilitySettingsSave>): SaveData {
  const save = loadSave();
  save.accessibility = {
    ...save.accessibility,
    ...settings
  };

  if (canUseLocalStorage()) {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  return save;
}

function emptySave(): SaveData {
  return {
    stages: {},
    totalHintsUsed: 0,
    totalMistakes: 0,
    wrongByType: {},
    achievements: {},
    earnedStickerIds: [],
    dailyProgress: {},
    skills: {},
    reviewSchedule: {},
    accessibility: {
      largeText: false,
      reducedMotion: false,
      highContrast: false,
      leftHanded: false
    },
    currentStreak: 0,
    lastPlayDate: null
  };
}

function normalizeSave(raw: Partial<SaveData>): SaveData {
  const base = emptySave();
  const stages = raw.stages ?? {};

  return {
    ...base,
    ...raw,
    stages: Object.fromEntries(
      Object.entries(stages).map(([stageId, stage]) => [
        stageId,
        {
          stars: stage.stars ?? 0,
          completedAt: stage.completedAt ?? "",
          hintsUsed: stage.hintsUsed ?? 0,
          mistakes: stage.mistakes ?? 0,
          completions: stage.completions ?? 1,
          bestHintsUsed: stage.bestHintsUsed ?? stage.hintsUsed ?? 0,
          bestMistakes: stage.bestMistakes ?? stage.mistakes ?? 0
        }
      ])
    ),
    wrongByType: raw.wrongByType ?? {},
    achievements: raw.achievements ?? {},
    earnedStickerIds: raw.earnedStickerIds ?? [],
    dailyProgress: raw.dailyProgress ?? {},
    skills: normalizeSkills(raw.skills ?? {}),
    reviewSchedule: normalizeReviewSchedule(raw.reviewSchedule ?? {}),
    accessibility: {
      ...base.accessibility,
      ...(raw.accessibility ?? {})
    },
    currentStreak: raw.currentStreak ?? 0,
    lastPlayDate: raw.lastPlayDate ?? null
  };
}

function normalizeSkills(skills: SaveData["skills"]): SaveData["skills"] {
  return Object.fromEntries(
    Object.entries(skills).map(([skillTag, skill]) => [
      skillTag,
      {
        tag: (skill?.tag ?? skillTag) as SkillTag,
        attempts: skill?.attempts ?? 0,
        independentCompletions: skill?.independentCompletions ?? 0,
        hintedCompletions: skill?.hintedCompletions ?? 0,
        recoveredCompletions: skill?.recoveredCompletions ?? 0,
        lastOutcome: skill?.lastOutcome ?? null,
        lastHintLevel: skill?.lastHintLevel ?? 0,
        lastMistakes: skill?.lastMistakes ?? 0,
        lastWrongType: skill?.lastWrongType ?? null,
        updatedAt: skill?.updatedAt ?? "",
        recentAttempts: skill?.recentAttempts ?? []
      }
    ])
  ) as SaveData["skills"];
}

function normalizeReviewSchedule(reviewSchedule: SaveData["reviewSchedule"]): SaveData["reviewSchedule"] {
  return Object.fromEntries(
    Object.entries(reviewSchedule).map(([skillTag, review]) => [
      skillTag,
      {
        tag: (review?.tag ?? skillTag) as SkillTag,
        nextReviewDate: review?.nextReviewDate ?? "",
        stepIndex: review?.stepIndex ?? 0,
        dueCount: review?.dueCount ?? 0
      }
    ])
  ) as SaveData["reviewSchedule"];
}

function canUseLocalStorage(): boolean {
  try {
    const testKey = `${saveKey}/test`;
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
