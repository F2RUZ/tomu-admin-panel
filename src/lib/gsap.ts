import { gsap } from "gsap";

// ─── Page enter animation ───────────────────────────────────────────────────
export const pageEnter = (element: HTMLElement | null) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
  );
};

// ─── Stagger children animation ─────────────────────────────────────────────
export const staggerChildren = (
  parent: HTMLElement | null,
  childSelector: string = ".anim-item",
) => {
  if (!parent) return;
  gsap.fromTo(
    parent.querySelectorAll(childSelector),
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
      delay: 0.1,
    },
  );
};

// ─── Stat card count-up ─────────────────────────────────────────────────────
export const countUp = (
  element: HTMLElement | null,
  endValue: number,
  prefix: string = "",
  suffix: string = "",
  duration: number = 1.2,
) => {
  if (!element) return;
  const obj = { value: 0 };
  gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
    },
  });
};

// ─── Sidebar slide-in ───────────────────────────────────────────────────────
export const sidebarEnter = (element: HTMLElement | null) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { x: -20, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
  );
};

// ─── Snackbar slide + fade in ───────────────────────────────────────────────
export const snackbarEnter = (element: HTMLElement | null) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { x: 60, opacity: 0, scale: 0.96 },
    { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)" },
  );
};

// ─── Snackbar slide + fade out ──────────────────────────────────────────────
export const snackbarExit = (
  element: HTMLElement | null,
  onComplete?: () => void,
) => {
  if (!element) return;
  gsap.to(element, {
    x: 60,
    opacity: 0,
    scale: 0.96,
    duration: 0.25,
    ease: "power2.in",
    onComplete,
  });
};

// ─── Modal scale-in ─────────────────────────────────────────────────────────
export const modalEnter = (element: HTMLElement | null) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { scale: 0.94, opacity: 0, y: 10 },
    { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" },
  );
};

// ─── Skeleton shimmer setup ──────────────────────────────────────────────────
export const shimmerEffect = (elements: NodeListOf<Element> | null) => {
  if (!elements || elements.length === 0) return;
  gsap.to(elements, {
    backgroundPosition: "200% 0",
    duration: 1.5,
    ease: "none",
    repeat: -1,
  });
};

// ─── Hover lift effect ───────────────────────────────────────────────────────
export const hoverLift = (element: HTMLElement | null) => {
  if (!element) return;
  const enter = () =>
    gsap.to(element, { y: -3, duration: 0.2, ease: "power2.out" });
  const leave = () =>
    gsap.to(element, { y: 0, duration: 0.2, ease: "power2.out" });

  element.addEventListener("mouseenter", enter);
  element.addEventListener("mouseleave", leave);

  return () => {
    element.removeEventListener("mouseenter", enter);
    element.removeEventListener("mouseleave", leave);
  };
};

export { gsap };
