import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import Button from "../../components/button";
import { cn } from "../../utils";
import { motion } from "motion/react";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { useLenis } from "lenis/react";

export default function HeroCTA({ className }: { className?: string }) {
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();
  return (
    <div className={cn("size-full p-6 flex flex-col gap-6", className)}>
      <Button
        variant="light"
        text="Know More"
        icon={<IconArrowDown className="stroke-2" />}
        className="flex-none w-min"
        initial={{
          clipPath: "inset(0 0% 100% 0%)",
          scale: 1.25,
          opacity: 0.75,
        }}
        animate={{ clipPath: "inset(0 0% 0% 0%)", scale: 1, opacity: 1 }}
        transition={{ duration: 0.1, delay: 1, ease: "easeOut" }}
        onClick={(e) => {
          e.preventDefault();
          lockSnap();
          lenis?.scrollTo("#about", { onComplete: unlockSnap });
        }}
        data-screen-shakable={true}
        data-return-to-origin={true}
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
        animate={{ clipPath: "inset(0 0% 0% 0%)", scale: 1, opacity: 1 }}
        transition={{ duration: 0.1, delay: 1.25, ease: "easeOut" }}
        onClick={(e) => {
          e.preventDefault();
          lockSnap();
          lenis?.scrollTo("#contact", { onComplete: unlockSnap });
        }}
        data-screen-shakable={true}
        data-return-to-origin={true}
      />

      <motion.section
        className="text-sm font-thin tracking-wider flex-1 place-content-end"
        initial={{ clipPath: "inset(0 0% 100% 0%)" }}
        animate={{ clipPath: "inset(0 0% 0% 0%)" }}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
        data-screen-shakable={true}
        data-return-to-origin={true}
      >
        Or email me @{" "}
        <a
          href="mailto:dasaniket20002@gmail.com"
          className="font-light cursor-pointer"
        >
          dasaniket20002@gmail.com
        </a>
      </motion.section>
    </div>
  );
}
