export interface SubjectFilterItem {
  subject: string;
}

export const ALL_SUBJECTS_FILTER = "全部";

export function getSubjectFilters(games: readonly SubjectFilterItem[]): string[] {
  return [ALL_SUBJECTS_FILTER, ...Array.from(new Set(games.map((game) => game.subject)))];
}
