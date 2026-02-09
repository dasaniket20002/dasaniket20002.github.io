import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { useLenis } from "lenis/react";
import Button from "../../components/button";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { cn, PRIMARY_EMAIL } from "../../utils";

export default function HeroCTA({ className }: { className?: string }) {
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();
  return (
    <div
      className={cn(
        "h-full flex flex-col gap-6 items-end px-6 py-4",
        className,
      )}
    >
      <div className="flex gap-8 items-center">
        <Button
          variant="light"
          text="Know More"
          icon={<IconArrowDown className="stroke-2" />}
          className="flex-none w-min bg-transparent"
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
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#contact", { onComplete: unlockSnap });
          }}
        />
      </div>
      <section className="text-sm font-thin tracking-wider place-content-end text-light-2 flex flex-col items-end">
        <p>Or email me @</p>
        <a
          href={`mailto:${PRIMARY_EMAIL}`}
          className="font-light cursor-pointer text-dark-1"
        >
          {PRIMARY_EMAIL}
        </a>
      </section>
    </div>
  );
}
