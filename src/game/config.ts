import Phaser from "phaser";
import { BattleScene } from "./scenes/BattleScene";
import { BootScene } from "./scenes/BootScene";
import { HudScene } from "./scenes/HudScene";
import { MenuScene } from "./scenes/MenuScene";
import { ResultScene } from "./scenes/ResultScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-root",
  backgroundColor: "#f6f3e7",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
    min: {
      width: 320,
      height: 480
    }
  },
  input: {
    activePointers: 3
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },
  scene: [BootScene, MenuScene, BattleScene, HudScene, ResultScene]
};
