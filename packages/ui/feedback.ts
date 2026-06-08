export type FeedbackKind = "success" | "error" | "info";

export interface FeedbackState {
  kind: FeedbackKind;
  text: string;
}

let audioContext: AudioContext | null = null;

export function createFeedbackBanner(feedback: FeedbackState): HTMLElement {
  const banner = document.createElement("div");
  banner.className = `learning-feedback learning-feedback--${feedback.kind}`;
  banner.setAttribute("role", feedback.kind === "error" ? "alert" : "status");
  banner.textContent = feedback.text;
  return banner;
}

export function playFeedbackSound(kind: FeedbackKind): void {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  if (kind === "success") {
    playTone(context, 523, 0, 0.1);
    playTone(context, 659, 0.08, 0.1);
    playTone(context, 784, 0.16, 0.14);
  } else if (kind === "error") {
    playTone(context, 220, 0, 0.12);
    playTone(context, 165, 0.1, 0.16);
  } else {
    playTone(context, 440, 0, 0.08);
  }
}

export function speakText(text: string, lang: string, rate = 0.9): void {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function getAudioContext(): AudioContext | null {
  const audioWindow = window as Window & {
    webkitAudioContext?: typeof AudioContext;
  };

  const nativeAudioContext = typeof AudioContext === "undefined" ? undefined : AudioContext;

  if (!nativeAudioContext && !audioWindow.webkitAudioContext) {
    return null;
  }

  if (!audioContext) {
    const AudioContextCtor = nativeAudioContext ?? audioWindow.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }
    audioContext = new AudioContextCtor();
  }

  return audioContext;
}

function playTone(context: AudioContext, frequency: number, delay: number, duration: number): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}
