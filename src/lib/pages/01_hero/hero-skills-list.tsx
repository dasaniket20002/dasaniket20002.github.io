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
      className={cn("uppercase text-3xl space-y-2", className)}
      {...motionProps}
    >
      <Link
        theme="dark"
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
      >
        UI/UX Design
      </Link>
      <Link
        theme="dark"
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
      >
        Web Design
      </Link>
      <Link
        theme="dark"
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
      >
        Development
      </Link>
      <Link
        theme="dark"
        href={"#services"}
        className="-ml-1 w-min"
        underlineThickness={1}
      >
        Creative Design
      </Link>
    </m.div>
  );
}
