import { cn } from "../../utils";
import Experience from "./experience";

export default function Work({ className }: { className?: string }) {
  return (
    <div
      data-bg-theme="dark"
      id="work"
      className={cn(
        "min-h-dvh h-full w-full relative grid gap-y-12 md:gap-y-0",
        "grid-cols-[4rem_1fr_4rem] grid-rows-[4rem_auto_1fr]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <Experience />
    </div>
  );
}
