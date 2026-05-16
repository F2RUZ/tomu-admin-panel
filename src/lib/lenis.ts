"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// ─── Type ────────────────────────────────────────────────────────────────────
interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
}

let lenisInstance: LenisInstance | null = null;

// ─── Init Lenis (dynamic import — SSR safe) ───────────────────────────────────
export const initLenis = async (): Promise<void> => {
  try {
    const { default: Lenis } = await import("lenis");

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      eventsTarget: document.documentElement,
    }) as LenisInstance;

    lenisInstance = lenis;

    // GSAP ticker bilan sync
    gsap.ticker.add((time: number) => {
      lenisInstance?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } catch (err) {
    console.warn("Lenis load failed:", err);
  }
};

// ─── Stop / Start ────────────────────────────────────────────────────────────
export const stopLenis = (): void => {
  if (lenisInstance) {
    (lenisInstance as any).options = {
      ...(lenisInstance as any).options,
      smoothWheel: false,
    };
    (lenisInstance as any).stop();
  }
};
export const startLenis = (): void => {
  if (lenisInstance) {
    (lenisInstance as any).start();
  }
};
// ─── Destroy ─────────────────────────────────────────────────────────────────
export const destroyLenis = (): void => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

// ─── React Hook ──────────────────────────────────────────────────────────────
export const useLenis = (): void => {
  useEffect(() => {
    // Faqat client side
    if (typeof window === "undefined") return;

    initLenis();

    return () => {
      destroyLenis();
    };
  }, []);
};
