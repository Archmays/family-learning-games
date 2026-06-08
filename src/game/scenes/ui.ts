import Phaser from "phaser";

export interface ButtonOptions {
  fill?: number;
  stroke?: number;
  textColor?: string;
  disabled?: boolean;
  fontSize?: number;
}

export function getHudPanelHeight(width: number, height: number): number {
  if (width < 560) {
    return Math.min(282, Math.max(220, height * 0.34));
  }

  return Math.min(250, Math.max(224, height * 0.34));
}

export function addButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onClick: () => void,
  options: ButtonOptions = {}
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const fill = options.disabled ? 0xd8d4c7 : (options.fill ?? 0xffffff);
  const stroke = options.stroke ?? 0x25313b;

  const shadow = scene.add.graphics();
  shadow.fillStyle(0x6b4f1f, options.disabled ? 0.1 : 0.18);
  shadow.fillRoundedRect(-width / 2 + 3, -height / 2 + 5, width, height, 8);

  const background = scene.add.graphics();
  background.fillStyle(fill, 1);
  background.lineStyle(3, stroke, 1);
  background.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
  background.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

  const text = scene.add
    .text(0, 0, label, {
      color: options.textColor ?? "#25313b",
      fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
      fontSize: `${options.fontSize ?? 22}px`,
      fontStyle: "700",
      align: "center",
      wordWrap: {
        width: width - 18,
        useAdvancedWrap: true
      }
    })
    .setOrigin(0.5);

  container.add([shadow, background, text]);
  container.setSize(width, height);

  if (!options.disabled) {
    const hitZone = scene.add.rectangle(0, 0, width + 8, height + 8, 0xffffff, 0.001).setInteractive({
      useHandCursor: true
    });
    hitZone.on("pointerover", () => container.setScale(1.02));
    hitZone.on("pointerout", () => container.setScale(1));
    hitZone.on("pointerdown", onClick);
    container.add(hitZone);
  }

  return container;
}

export function addPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number,
  stroke = 0x25313b
): Phaser.GameObjects.Graphics {
  const panel = scene.add.graphics();
  panel.fillStyle(0x6b4f1f, 0.1);
  panel.fillRoundedRect(x + 4, y + 6, width, height, 8);
  panel.fillStyle(fill, 0.96);
  panel.lineStyle(3, stroke, 0.9);
  panel.fillRoundedRect(x, y, width, height, 8);
  panel.strokeRoundedRect(x, y, width, height, 8);
  return panel;
}

export function colorFromHex(hex: string): number {
  return Number.parseInt(hex.replace("#", ""), 16);
}
