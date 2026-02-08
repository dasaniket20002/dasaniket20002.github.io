import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-min pl-6 pt-4 uppercase tracking-tight font-light text-[max(1.618rem,1.618vw)] text-dark-1 flex flex-col -space-y-3",
        className,
      )}
    >
      <p className="pb-2">I bridge the gap between</p>
      <p className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal">
        technical architecture
      </p>
      <p>
        and{" "}
        <span className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal">
          visual storytelling.
        </span>
      </p>
    </div>
  );
}
