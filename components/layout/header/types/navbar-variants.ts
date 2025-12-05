// components/navbar/navbar-variants.ts
export const navbarVariants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween" as const,
      ease: [0.33, 1, 0.68, 1] as const,
      duration: 0.6,
      delay: 0.1,
    },
  },
  hidden: {
    y: -20,
    opacity: 0,
    transition: {
      type: "tween" as const,
      ease: [0.55, 0.055, 0.675, 0.19] as const,
      duration: 0.4,
    },
  },
};
