export interface ButtonOptions {
  className?: string;
  disabled?: boolean;
}

export {
  createFeedbackBanner,
  playFeedbackSound,
  speakText,
  type FeedbackKind,
  type FeedbackState
} from "./feedback";

export function clearElement(element: HTMLElement): void {
  element.replaceChildren();
}

export function createButton(label: string, onClick: () => void, options: ButtonOptions = {}): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = options.className ?? "ui-button";
  button.textContent = label;
  button.disabled = options.disabled ?? false;
  button.addEventListener("click", onClick);
  return button;
}

export function createPanel(className = "ui-panel"): HTMLElement {
  const panel = document.createElement("section");
  panel.className = className;
  return panel;
}

export function createStatus(label: string, value: string | number): HTMLElement {
  const status = document.createElement("div");
  status.className = "ui-status";

  const labelElement = document.createElement("span");
  labelElement.className = "ui-status__label";
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = String(value);

  status.append(labelElement, valueElement);
  return status;
}
