import type { HTMLMotionProps } from "motion/react";
import Link from "../../components/link";
import { cn } from "../../utils";
import * as m from "motion/react-m";

export default function HeroSkillsList({
  className,
  ...motionProps
}: { className?: string } & HTMLMotionProps<"div">) {
  return (
    <m.div
      className={cn("uppercase text-3xl space-y-2 font-light", className)}
      {...motionProps}
    >
      <Link
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
        theme="light"
      >
        [ UI/UX Design ]
      </Link>
      <Link
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
        theme="light"
      >
        [ Web Development ]
      </Link>
      <Link
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
        theme="light"
      >
        [ Creative Design ]
      </Link>
    </m.div>
  );
}
