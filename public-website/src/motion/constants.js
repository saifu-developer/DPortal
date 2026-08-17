export const EASE_OUT = [0.25, 0.46, 0.45, 0.94];

export const DURATION = {
  fast: 0.5,
  normal: 0.6,
  slow: 0.8,
};

export const VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -60px 0px',
};

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
};

export const staggerContainer = (stagger = 0.12, delay = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(148 163 184 / 0.15)',
  },
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: '0 20px 40px -12px rgb(13 148 136 / 0.15)',
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

export const buttonTap = {
  whileHover: {
    scale: 1.05,
    boxShadow: '0 8px 24px -4px rgb(13 148 136 / 0.35)',
    filter: 'brightness(1.05)',
  },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.3, ease: EASE_OUT },
};

export const shakeKeyframes = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};
