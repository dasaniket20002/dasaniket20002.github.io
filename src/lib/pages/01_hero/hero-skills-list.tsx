import Link from "../../components/link";
import { cn } from "../../utils";

export default function HeroSkillsList({ className }: { className?: string }) {
  return (
    <div className={cn("uppercase text-2xl space-y-1 pr-6 py-2", className)}>
      <Link href={"#services"} className="-ml-1 w-min">
        UI/UX Design
      </Link>
      <Link href={"#services"} className="-ml-1 w-min">
        Web Design
      </Link>
      <Link href={"#services"} className="-ml-1 w-min">
        Development
      </Link>
      <Link href={"#services"} className="-ml-1 w-min">
        Creative Design
      </Link>
    </div>
  );
}
