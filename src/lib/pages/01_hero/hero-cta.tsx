import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import Button from "../../components/button";
import { cn, PRIMARY_EMAIL } from "../../utils";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { useLenis } from "lenis/react";
import { motion } from "motion/react";

export default function HeroCTA({ className }: { className?: string }) {
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();
  return (
    <div
      className={cn(
        "h-full w-2/3 place-self-end flex flex-col gap-6 items-end px-6 py-4",
        className,
      )}
    >
      <div className="flex gap-8 items-center">
        <Button
          variant="light"
          text="Know More"
          icon={<IconArrowDown className="stroke-2" />}
          className="flex-none w-min bg-transparent"
          initial={{
            clipPath: "inset(0 0% 100% 0%)",
            scale: 1.25,
            opacity: 0.75,
          }}
          animate={{
            clipPath: "inset(0 0% 0% 0%)",
            scale: 1,
            opacity: 1,
          }}
          transition={{ duration: 0.1, delay: 1, ease: "easeOut" }}
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#about", { onComplete: unlockSnap });
          }}
        />
        <Button
          variant="dark"
          text="Let's Connect"
          icon={<IconArrowRight className="stroke-2" />}
          className="flex-none w-min"
          initial={{
            clipPath: "inset(0 0% 100% 0%)",
            scale: 1.25,
            opacity: 0.75,
          }}
          animate={{
            clipPath: "inset(0 0% 0% 0%)",
            scale: 1,
            opacity: 1,
          }}
          transition={{ duration: 0.1, delay: 1.25, ease: "easeOut" }}
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#contact", { onComplete: unlockSnap });
          }}
        />
      </div>
      <motion.section
        className="text-sm font-thin tracking-wider place-content-end text-light-2"
        initial={{ clipPath: "inset(0 0% 100% 0%)" }}
        animate={{ clipPath: "inset(0 0% 0% 0%)" }}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
      >
        Or email me @{" "}
        <a
          href={`mailto:${PRIMARY_EMAIL}`}
          className="font-light cursor-pointer text-dark-1"
        >
          {PRIMARY_EMAIL}
        </a>
      </motion.section>
    </div>
  );
}
