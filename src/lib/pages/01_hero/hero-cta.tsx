import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import Button from "../../components/button";
import { cn } from "../../utils";

export default function HeroCTA({ className }: { className?: string }) {
  return (
    <div className={cn("size-full p-6 flex flex-col gap-6", className)}>
      <Button
        variant="light"
        text="Know More"
        icon={<IconArrowDown className="stroke-2 [stroke-linecap:round]" />}
        className="flex-none w-min"
      />
      <Button
        variant="dark"
        text="Let's Connect"
        icon={<IconArrowRight className="stroke-2 [stroke-linecap:round]" />}
        className="flex-none w-min"
      />

      <section className="text-sm font-thin tracking-wider flex-1 place-content-end">
        Or email me @{" "}
        <a href="" className="font-light cursor-pointer">
          dasaniket20002@gmail.com
        </a>
      </section>
    </div>
  );
}
