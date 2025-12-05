"use client";
import React, { ReactNode, ElementType, useMemo, JSX } from "react";
import { motion, Variants, HTMLMotionProps } from "motion/react";

export type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

export type AnimatedGroupBaseProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  preset?: PresetType;
  as?: MotionTag;
  asChild?: MotionTag;
};

const defaultContainerVariants: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  fade: {},
  slide: { hidden: { y: 20 }, visible: { y: 0 } },
  scale: { hidden: { scale: 0.8 }, visible: { scale: 1 } },
  blur: { hidden: { filter: "blur(4px)" }, visible: { filter: "blur(0px)" } },
  "blur-slide": {
    hidden: { filter: "blur(4px)", y: 20 },
    visible: { filter: "blur(0px)", y: 0 },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 8 },
    },
  },
};

const addDefaultVariants = (variants: Variants): Variants => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

const motionComponents = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  nav: motion.nav,
  main: motion.main,
  aside: motion.aside,
  button: motion.button,
  a: motion.a,
  form: motion.form,
  input: motion.input,
  label: motion.label,
  img: motion.img,
} as const;

type MotionTag = keyof typeof motionComponents;

type MotionCompForTag<T extends MotionTag> = (
  props: HTMLMotionProps<T> & { children?: React.ReactNode },
) => React.ReactElement | null;

// 🧩 Generic prop type: auto-follows chosen tag
export type AnimatedGroupProps<T extends MotionTag = "div"> =
  AnimatedGroupBaseProps &
    Omit<
      HTMLMotionProps<T>,
      keyof AnimatedGroupBaseProps | "as" | "children"
    > & {
      as?: T;
      asChild?: MotionTag;
    };

function AnimatedGroup<T extends MotionTag = "div">({
  children,
  className,
  variants,
  preset,
  as = "div" as T,
  asChild = "div",
  ...props
}: AnimatedGroupProps<T>): JSX.Element {
  const MotionComponent = useMemo(
    () => motionComponents[as] as unknown as MotionCompForTag<T>,
    [as],
  );

  const MotionChild = useMemo(
    () => motionComponents[asChild] as unknown as MotionCompForTag<MotionTag>,
    [asChild],
  );

  const containerVariants =
    variants ?? addDefaultVariants(defaultContainerVariants);
  const itemVariants = addDefaultVariants(preset ? presetVariants[preset] : {});

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...(props as HTMLMotionProps<T>)}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}

export { AnimatedGroup };
