import { cn } from "../../utils";

export default function HeroSubtitle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-subgrid items-center text-[max(1.618rem,1.618vw)] font-thin uppercase",
        className,
      )}
    >
      <h3 className="col-[1/4] pr-6 text-end">
        Hi, I'm <span className="font-light">Aniket Das</span>
      </h3>
      <h3 className="col-[5/6] pl-6">A</h3>
    </div>
  );
}
