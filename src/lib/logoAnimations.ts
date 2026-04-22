export interface LogoAnimation {
  id: string;
  name: string;
  description: string;
  className: string;
  durationMs: number;
}

export const LOGO_ANIMATIONS: LogoAnimation[] = [
  { id: "tornado", name: "Tornado", description: "360° hortum dönüşü, zoom ve esneme", className: "animate-logo-tornado", durationMs: 7000 },
  { id: "ballerina", name: "Balerin", description: "Yerinde balerin gibi 360° dönüş", className: "animate-logo-ballerina", durationMs: 4000 },
  { id: "heartbeat", name: "Kalp Atışı", description: "Çift atımlı pulse efekti", className: "animate-logo-heartbeat", durationMs: 1800 },
  { id: "flip3d", name: "3D Flip", description: "Dikey eksende 3D çevirme", className: "animate-logo-flip3d", durationMs: 2200 },
  { id: "pulse-glow", name: "Pulse Glow", description: "Parlama ile büyüyüp küçülme", className: "animate-logo-pulse-glow", durationMs: 2500 },
  { id: "spin-slow", name: "Yavaş Dönüş", description: "Sürekli yumuşak dönüş", className: "animate-logo-spin-slow", durationMs: 8000 },
  { id: "wobble", name: "Sallanma", description: "Sağa-sola sallanma", className: "animate-logo-wobble", durationMs: 1500 },
  { id: "shake", name: "Titreme", description: "Hızlı titreme efekti", className: "animate-logo-shake", durationMs: 800 },
  { id: "zoom-pop", name: "Zoom Pop", description: "Zıplayarak büyüme", className: "animate-logo-zoom-pop", durationMs: 1200 },
  { id: "rotate-y", name: "Y Eksen Dönüş", description: "Yatay eksen 360°", className: "animate-logo-rotate-y", durationMs: 2000 },
  { id: "swing", name: "Salıncak", description: "Asılı sallanma", className: "animate-logo-swing", durationMs: 1500 },
  { id: "rubber-band", name: "Lastik", description: "Esneme ve geri dönme", className: "animate-logo-rubber-band", durationMs: 1200 },
  { id: "jello", name: "Jöle", description: "Jöle gibi titreşim", className: "animate-logo-jello", durationMs: 1500 },
  { id: "tada", name: "Tada", description: "Dikkat çekici giriş", className: "animate-logo-tada", durationMs: 1200 },
  { id: "flash", name: "Flash", description: "Yanıp sönme", className: "animate-logo-flash", durationMs: 1000 },
  { id: "roll-in", name: "Yuvarlanma", description: "Dönerek içeri girme", className: "animate-logo-roll-in", durationMs: 1500 },
  { id: "bounce-in", name: "Zıplayarak Giriş", description: "Yukarıdan zıplayarak", className: "animate-logo-bounce-in", durationMs: 1500 },
  { id: "light-speed", name: "Işık Hızı", description: "Yandan ışık hızında", className: "animate-logo-light-speed", durationMs: 1200 },
  { id: "hinge", name: "Menteşe", description: "Menteşeden sallanma", className: "animate-logo-hinge", durationMs: 2200 },
  { id: "magnetic-float", name: "Manyetik Süzülme", description: "Yumuşak yukarı-aşağı süzülme", className: "animate-logo-magnetic-float", durationMs: 4000 },
];

export const DEFAULT_ANIMATION_ID = "ballerina";

export const getAnimationById = (id: string): LogoAnimation =>
  LOGO_ANIMATIONS.find((a) => a.id === id) ?? LOGO_ANIMATIONS.find((a) => a.id === DEFAULT_ANIMATION_ID)!;
