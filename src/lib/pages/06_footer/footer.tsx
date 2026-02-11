import { cn } from "../../utils";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("h-[50dvh] w-full bg-dark-1", className)}></footer>
  );
}
