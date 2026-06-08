import Phaser from "phaser";
import type { HudUpdate } from "./BattleScene";
import { addButton, addPanel, colorFromHex, getHudPanelHeight } from "./ui";
import { sceneKeys } from "./sceneKeys";
import { loadSave } from "../save/saveStore";

export class HudScene extends Phaser.Scene {
  private updateState: HudUpdate | null = null;
  private previousHeartsRemaining: number | null = null;

  constructor() {
    super(sceneKeys.hud);
  }

  create(): void {
    this.game.events.on("battle:update", this.onBattleUpdate, this);
    this.scale.on("resize", this.render, this);
  }

  shutdown(): void {
    this.game.events.off("battle:update", this.onBattleUpdate, this);
    this.scale.off("resize", this.render, this);
  }

  private onBattleUpdate(update: HudUpdate): void {
    this.updateState = update;
    this.render();
  }

  private render(): void {
    this.children.removeAll();

    if (!this.updateState) {
      return;
    }

    const width = this.scale.width;
    const height = this.scale.height;
    const panelHeight = getHudPanelHeight(width, height);
    const panelTop = height - panelHeight;
    const save = loadSave();
    const panelStroke = save.accessibility.highContrast ? 0x000000 : 0x25313b;

    addPanel(this, 8, panelTop + 8, width - 16, panelHeight - 16, 0xfffbef, panelStroke);

    this.drawStatus(width, panelTop);
    this.drawActionButtons(width, height, panelTop);
    this.drawCommandButtons(width, height, panelTop);
  }

  private drawStatus(width: number, panelTop: number): void {
    if (!this.updateState) {
      return;
    }

    const hearts = "♥".repeat(this.updateState.heartsRemaining) + "♡".repeat(this.updateState.maxMistakes - this.updateState.heartsRemaining);
    const progressLabel =
      this.updateState.rescueProgressCurrent >= this.updateState.rescueProgressTotal
        ? this.updateState.sceneCopy.progressDoneLabel
        : `${this.updateState.sceneCopy.progressLabel} ${this.updateState.rescueProgressCurrent}/${this.updateState.rescueProgressTotal}`;
    const title = `${this.updateState.encounterTitle}    ${this.updateState.encounterIndex + 1}/${this.updateState.encounterTotal}    ${progressLabel}`;
    const compact = width < 560;
    const save = loadSave();
    const fontBoost = save.accessibility.largeText ? 2 : 0;
    this.add
      .text(24, panelTop + 24, title, {
        color: "#25313b",
        fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
        fontSize: `${(compact ? 17 : 19) + fontBoost}px`,
        fontStyle: "800"
      })
      .setOrigin(0, 0.5);
    const heartsText = this.add
      .text(width - 24, panelTop + 24, hearts, {
        color: "#c44949",
        fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
        fontSize: `${(compact ? 22 : 25) + fontBoost}px`,
        fontStyle: "900"
      })
      .setOrigin(1, 0.5);

    if (
      !save.accessibility.reducedMotion &&
      this.previousHeartsRemaining !== null &&
      this.updateState.heartsRemaining < this.previousHeartsRemaining
    ) {
      heartsText.setScale(1.24);
      this.tweens.add({
        targets: heartsText,
        scale: 1,
        duration: 260,
        ease: "Back.easeOut"
      });
    }
    this.previousHeartsRemaining = this.updateState.heartsRemaining;

    const message = this.updateState.hint || this.updateState.message;
    this.add
      .text(24, panelTop + 56, message, {
        color: this.updateState.hint ? "#2b6d59" : "#4d5b63",
        fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
        fontSize: `${(compact ? 15 : 17) + fontBoost}px`,
        fontStyle: "700",
        wordWrap: {
          width: width - 48,
          useAdvancedWrap: true
        }
      })
      .setOrigin(0, 0.5);
  }

  private drawActionButtons(width: number, height: number, panelTop: number): void {
    if (!this.updateState) {
      return;
    }

    const operands = this.updateState.operandOptions;
    const options = this.updateState.actionOptions;
    const isCompact = width < 560;
    const save = loadSave();
    const fontBoost = save.accessibility.largeText ? 2 : 0;
    const contrastStroke = save.accessibility.highContrast ? 0x000000 : null;
    const gap = 8;
    const operandButtonWidth = isCompact ? Math.min(86, Math.max(72, (width - 44) / 4)) : 104;
    const operandColumns = Math.max(
      1,
      Math.min(operands.length, Math.floor((width - 44 + gap) / (operandButtonWidth + gap)))
    );
    const operandY = panelTop + (isCompact ? 104 : 92);

    operands.forEach((operand, index) => {
      const row = Math.floor(index / operandColumns);
      const column = index % operandColumns;
      const rowSize = Math.min(operandColumns, operands.length - row * operandColumns);
      const rowWidth = rowSize * operandButtonWidth + (rowSize - 1) * gap;
      const x = width / 2 - rowWidth / 2 + operandButtonWidth / 2 + column * (operandButtonWidth + gap);
      const y = operandY + row * 50;
      const selected =
        this.updateState?.selectedOperand?.value === operand.value &&
        this.updateState.selectedOperand.source === operand.source &&
        this.updateState.selectedOperand.valueIndex === operand.valueIndex;
      const label =
        operand.source === "material"
          ? `${this.updateState?.sceneCopy.materialLabel}\n${operand.value}`
          : `${this.updateState?.sceneCopy.bonusLabel}\n${operand.value}`;
      addButton(
        this,
        x,
        y,
        operandButtonWidth,
        isCompact ? 46 : 50,
        label,
        () => this.game.events.emit("hud:selectOperand", operand),
        {
          fill: selected ? 0xffd166 : operand.source === "material" ? 0xe9f5ff : 0xffefbf,
          stroke: contrastStroke ?? (selected ? 0x9d5b00 : operand.source === "material" ? 0x4d7f9f : 0xc78a35),
          fontSize: (isCompact ? 13 : 15) + fontBoost
        }
      );
    });

    const operationY = panelTop + (isCompact ? 162 : 144);
    const operationButtonWidth = isCompact ? Math.min(122, Math.max(104, (width - 52) / 2)) : 142;
    const operationColumns = Math.max(1, Math.min(options.length, 2));

    options.forEach((option, index) => {
      const row = Math.floor(index / operationColumns);
      const column = index % operationColumns;
      const rowSize = Math.min(operationColumns, options.length - row * operationColumns);
      const rowWidth = rowSize * operationButtonWidth + (rowSize - 1) * gap;
      const x = width / 2 - rowWidth / 2 + operationButtonWidth / 2 + column * (operationButtonWidth + gap);
      const y = operationY + row * 56;
      const selected =
        this.updateState?.selectedAction?.roleId === option.action.roleId &&
        this.updateState.selectedAction.operand === option.action.operand;
      const fill = selected ? 0xffd166 : colorFromHex(option.color);
      const stroke = contrastStroke ?? (selected ? 0x9d5b00 : 0x25313b);
      addButton(
        this,
        x,
        y,
        operationButtonWidth,
        isCompact ? 50 : 54,
        option.label,
        () => this.game.events.emit("hud:selectAction", option.action),
        {
          fill,
          stroke,
          fontSize: (isCompact ? 16 : 18) + fontBoost
        }
      );
    });

    if (operands.length === 0) {
      const material = this.updateState.materialValueIndexes
        .map((index) => `${this.updateState?.sceneCopy.materialLabel} ${index + 1}`)
        .join("、");
      const message = material
        ? `${material} 只能帮助${this.updateState.sceneCopy.sourceLabel}调整数量。`
        : `先选一张${this.updateState.sceneCopy.sourceLabel}。`;
      this.add
        .text(width / 2, operandY, message, {
          color: "#a04040",
          fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
          fontSize: isCompact ? "16px" : "18px",
          fontStyle: "800",
          align: "center",
          wordWrap: {
            width: width - 48,
            useAdvancedWrap: true
          }
        })
        .setOrigin(0.5);
    } else if (!this.updateState.selectedOperand) {
      this.add
        .text(width / 2, operationY, `先选一张${this.updateState.sceneCopy.materialLabel}或${this.updateState.sceneCopy.bonusLabel}。`, {
          color: "#4d5b63",
          fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
          fontSize: isCompact ? "15px" : "17px",
          fontStyle: "800",
          align: "center"
        })
        .setOrigin(0.5);
    } else if (options.length === 0) {
      this.add
        .text(width / 2, operationY, "这个数现在不能这样用，换一个试试。", {
          color: "#a04040",
          fontFamily: "Trebuchet MS, Microsoft YaHei, Arial",
          fontSize: isCompact ? "15px" : "17px",
          fontStyle: "800",
          align: "center",
          wordWrap: {
            width: width - 48,
            useAdvancedWrap: true
          }
        })
        .setOrigin(0.5);
    }
  }

  private drawCommandButtons(width: number, height: number, panelTop: number): void {
    if (!this.updateState) {
      return;
    }

    const compact = width < 560;
    const save = loadSave();
    const fontBoost = save.accessibility.largeText ? 2 : 0;
    const contrastStroke = save.accessibility.highContrast ? 0x000000 : null;
    const y = height - 38;
    const applyLabel = this.updateState.preview?.isHit ? this.updateState.sceneCopy.applyHitLabel : this.updateState.sceneCopy.applyLabel;
    const sideWidth = compact ? Math.min(88, Math.max(76, (width - 158) / 2)) : 104;
    const applyWidth = compact ? Math.min(130, width - sideWidth * 2 - 24) : 138;
    const gap = compact ? 8 : 32;
    const rowWidth = sideWidth * 2 + applyWidth + gap * 2;
    const startX = width / 2 - rowWidth / 2;
    const hintX = compact
      ? startX + (save.accessibility.leftHanded ? sideWidth + gap + applyWidth + gap + sideWidth / 2 : sideWidth / 2)
      : width / 2 + (save.accessibility.leftHanded ? 136 : -136);
    const applyX = compact ? startX + sideWidth + gap + applyWidth / 2 : width / 2;
    const retryX = compact
      ? startX + (save.accessibility.leftHanded ? sideWidth / 2 : sideWidth + gap + applyWidth + gap + sideWidth / 2)
      : width / 2 + (save.accessibility.leftHanded ? -136 : 136);

    addButton(this, hintX, y, sideWidth, 56, `提示 ${this.updateState.hintLevel}/3`, () => this.game.events.emit("hud:hint"), {
      fill: 0xe9f5ff,
      stroke: contrastStroke ?? 0x4d7f9f,
      disabled: this.updateState.hintLevel >= 3,
      fontSize: (compact ? 15 : 17) + fontBoost
    });

    addButton(this, applyX, y, applyWidth, 56, applyLabel, () => this.game.events.emit("hud:applyAction"), {
      fill: 0x8bd39e,
      stroke: contrastStroke ?? 0x227a4f,
      disabled: !this.updateState.canApply || this.updateState.isResolving,
      fontSize: (compact ? 17 : 19) + fontBoost
    });

    addButton(this, retryX, y, sideWidth, 56, "重试", () => this.game.events.emit("hud:resetEncounter"), {
      fill: 0xffffff,
      stroke: contrastStroke ?? 0x728089,
      fontSize: (compact ? 16 : 18) + fontBoost
    });

    addButton(this, width - (compact ? 44 : 56), panelTop + (compact ? 58 : 58), compact ? 64 : 72, 44, "菜单", () => this.game.events.emit("hud:menu"), {
      fill: 0xffffff,
      stroke: contrastStroke ?? 0x728089,
      fontSize: (compact ? 15 : 16) + fontBoost
    });
  }
}
