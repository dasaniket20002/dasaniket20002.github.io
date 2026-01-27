import { IconLoader2 } from "@tabler/icons-react";

export default function LoadingSketch() {
  return (
    <section className="w-1/3 h-96 place-content-center place-items-center flex-none">
      <IconLoader2 className="animate-spin stroke-2 size-4 stroke-light-2" />
    </section>
  );
}
