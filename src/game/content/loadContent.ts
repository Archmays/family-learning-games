import type { LevelsFile, RolesFile, SkinPack, StageDefinition } from "../domain/content/types";

export function getRolesFromCache(cache: Phaser.Cache.CacheManager): RolesFile {
  return cache.json.get("roles") as RolesFile;
}

export function getSkinPackFromCache(cache: Phaser.Cache.CacheManager): SkinPack {
  return cache.json.get("skinPack") as SkinPack;
}

export function getStagesFromCache(cache: Phaser.Cache.CacheManager): StageDefinition[] {
  const levels = cache.json.get("levels") as LevelsFile;
  return levels.stages;
}
