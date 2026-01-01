import { cn } from "../utils";

export default function Work({ className }: { className?: string }) {
  return (
    <div
      data-bg-theme="dark"
      className={cn(
        "h-screen text-light-2 -space-y-4",
        "bg-dark-2 overflow-hidden place-content-center place-items-center",
        className
      )}
    ></div>
  );
}
