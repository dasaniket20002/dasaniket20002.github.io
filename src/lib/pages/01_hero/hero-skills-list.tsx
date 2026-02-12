import Link from "../../components/link";
import { cn } from "../../utils";

export default function HeroSkillsList({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "uppercase text-4xl md:text-2xl space-y-1 pr-6 py-2",
        className,
      )}
    >
      <Link href={"#services"} className="-ml-1 w-min" underlineThickness={1}>
        UI/UX Design
      </Link>
      <Link href={"#services"} className="-ml-1 w-min" underlineThickness={1}>
        Web Design
      </Link>
      <Link href={"#services"} className="-ml-1 w-min" underlineThickness={1}>
        Development
      </Link>
      <Link href={"#services"} className="-ml-1 w-min" underlineThickness={1}>
        Creative Design
      </Link>
    </div>
  );
}
