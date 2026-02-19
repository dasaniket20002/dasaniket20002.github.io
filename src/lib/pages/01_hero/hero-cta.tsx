import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { useLenis } from "lenis/react";
import Button from "../../components/button";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { cn, PRIMARY_EMAIL } from "../../utils";
import type { HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";

export default function HeroCTA({
  className,
  ...motionProps
}: { className?: string } & HTMLMotionProps<"div">) {
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();
  return (
    <m.div className={cn("flex flex-col gap-6", className)} {...motionProps}>
      <div className="flex gap-8 items-center">
        <Button
          variant="dark"
          text="Know More"
          icon={<IconArrowDown className="stroke-1 size-5" />}
          className="flex-none w-min text-base"
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#about", { onComplete: unlockSnap });
          }}
        />
        <Button
          variant="light"
          text="Let's Connect"
          icon={<IconArrowRight className="stroke-1 size-5" />}
          className="flex-none w-min text-base"
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#contact", { onComplete: unlockSnap });
          }}
        />
      </div>
      <section className="text-sm font-thin leading-relaxed tracking-widest text-light-d flex flex-col w-min">
        <p>Or email me @</p>
        <a
          href={`mailto:${PRIMARY_EMAIL}`}
          className="text-base font-light cursor-pointer text-light-l"
        >
          {PRIMARY_EMAIL}
        </a>
      </section>
    </m.div>
  );
}
