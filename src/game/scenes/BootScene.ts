import Phaser from "phaser";
import { sceneKeys } from "./sceneKeys";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneKeys.boot);
  }

  preload(): void {
    this.load.image("riverMeadowBg", "assets/generated/river-meadow-bg.png");
    this.load.image("stageGardenBg", "assets/generated/math-lab-stage-garden.png");
    this.load.image("stageBakeryBg", "assets/generated/math-lab-stage-bakery.png");
    this.load.image("stageRiverBg", "assets/generated/math-lab-stage-river.png");
    this.load.image("stageLibraryBg", "assets/generated/math-lab-stage-library.png");
    this.load.image("stageMarketBg", "assets/generated/math-lab-stage-market.png");
    this.load.image("targetGuardian", "assets/generated/target-guardian.png");
    this.load.image("helperTrio", "assets/generated/helper-trio.png");
    for (let index = 1; index <= 7; index += 1) {
      const suffix = String(index).padStart(2, "0");
      this.load.image(`mathLabHelper${suffix}`, `assets/generated/math-lab-helper-${suffix}.png`);
    }
    this.load.json("roles", "data/roles/roles.json");
    this.load.json("skinPack", "data/skins/placeholder-internal.json");
    this.load.json("levels", "data/levels/add-sub-mvp.json");
  }

  create(): void {
    this.scene.start(sceneKeys.menu);
  }
}
