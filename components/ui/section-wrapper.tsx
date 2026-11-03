import {
  AnimatedGroup,
  PresetType,
} from "@/components/shared/effects/animated-group";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export type OrnamentProps = {
  preset: PresetType;
  positionClasses: string;
  imageClasses?: string;
};

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  topDividerClass?: string;
  hideTopDivider?: boolean;
  hideBottomDivider?: boolean;
  ornaments?: OrnamentProps[];
}

export function SectionWrapper({
  children,
  className,
  topDividerClass = "mt-6",
  hideTopDivider = false,
  hideBottomDivider = false,
  ornaments = [],
}: SectionWrapperProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!hideTopDivider && (
        <FullWidthDivider position="top" className={topDividerClass} />
      )}

      {ornaments.map((ornament, idx) => (
        <AnimatedGroup
          key={idx}
          preset={ornament.preset}
          inView={true}
          className={cn(
            "absolute hidden min-xl:block z-0 pointer-events-none",
            ornament.positionClasses,
          )}
        >
          <div className={cn("relative", ornament.imageClasses || "w-72 h-72")}>
            <Image
              src="/assets/gajah-oling.png"
              alt="Ornamen Gajah Oling"
              fill
              className="object-contain dark:invert opacity-80"
              sizes="(max-width: 768px) 0px, 300px"
            />
          </div>
        </AnimatedGroup>
      ))}

      <div className="relative z-10">{children}</div>

      {!hideBottomDivider && <FullWidthDivider position="bottom" />}
    </div>
  );
}
