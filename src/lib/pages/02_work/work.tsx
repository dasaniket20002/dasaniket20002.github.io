import { cn } from "../../utils";
import Experience from "./experience";
import Hobby from "./hobby";

export default function Work({ className }: { className?: string }) {
  return (
    <div
      data-bg-theme="dark"
      id="work"
      className={cn("w-full relative space-y-16", className)}
    >
      <Experience />
      <Hobby />
    </div>
  );
}
