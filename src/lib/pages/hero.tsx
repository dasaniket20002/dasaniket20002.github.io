import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { useRef } from "react";
import Button from "../components/button";
import QuarterSpark from "../components/quarter-spark";
import { ScrollVelocity } from "../components/scroll-velocity";
import SVGText from "../components/svg-text";
import { cn } from "../utils";

export default function Hero({ className }: { className?: string }) {
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dragConstraintsRef}
      data-bg-theme="light"
      className={cn(
        "h-page w-full text-dark-1 -space-y-4 relative",
        "bg-light-1 place-content-center place-items-center",
        className
      )}
    >
      <div className="relative flex flex-col">
        <section className="w-full uppercase font-extralight text-4xl flex items-center justify-between px-4">
          <p>HI, I'M ANIKET DAS - </p>
          <p>A</p>
        </section>
        <section className="relative -space-x-2 flex select-none cursor-pointer">
          {["C", "RE", "A", "T", "I", "V", "E"].map((c, i) => (
            <SVGText
              key={i}
              drag
              dragConstraints={dragConstraintsRef}
              whileDrag={{ scale: 1.1 }}
              className="font-think-loved trim-text-caps text-[clamp(4rem,23cqw,16rem)] stroke-light-1 stroke-16 fill-dark-1 z-2"
            >
              {c}
            </SVGText>
          ))}
        </section>
      </div>

      <div className="w-full px-4 grid grid-cols-[1fr_20rem_1fr]">
        <p className="text-end self-center uppercase tracking-wide leading-8 font-extralight text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap">
          LET'S BUILD YOUR FIRST
          <br />
          BUSINESS WEBSITE
          <br />
          TOGETHER
        </p>
        <div className="relative aspect-3/4 w-[150vw] md:w-56 place-self-center">
          <img
            src="assets/portrait/Portrait-BG.png"
            alt="Portrait-BG"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <section className="absolute size-[50%] md:size-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 md:border-[0.25vw] border-amber-400 outline-16 md:outline-[0.5vw] outline-amber-400 outline-offset-4" />
          <img
            src="assets/portrait/Portrait-FG.png"
            alt="Portrait-FG"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <section className="text-start self-center uppercase tracking-wide leading-10 font-extralight text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap">
          <p>\ WEB DESIGN (UI/UX)</p>
          <p>\ WEB DEVELOPER</p>
          <p>\ CREATIVE DESIGN</p>
        </section>
      </div>

      <div className="relative flex flex-col gap-2">
        <QuarterSpark className="absolute origin-bottom-right -translate-x-1/2 -translate-y-1/2 -top-1 left-1 stroke-dark-1 stroke-6 size-[clamp(1rem,4vw,3rem)]" />
        <section className="relative -space-x-2 flex select-none cursor-pointer">
          {["D", "E", "V", "E", "LO", "P", "E", "R"].map((c, i) => (
            <SVGText
              key={i}
              drag
              dragConstraints={dragConstraintsRef}
              whileDrag={{ scale: 1.1 }}
              className="font-think-loved trim-text-caps text-[clamp(3rem,18cqw,14rem)] stroke-light-1 stroke-16 fill-dark-1 z-2"
            >
              {c}
            </SVGText>
          ))}
        </section>
        <div className="w-full flex justify-between items-center">
          <Button
            variant="light"
            text="Know More"
            icon={<IconArrowDown className="stroke-2 [stroke-linecap:round]" />}
          />
          <Button
            variant="dark"
            text="Let's Connect"
            icon={
              <IconArrowRight className="stroke-2 [stroke-linecap:round]" />
            }
          />
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <ScrollVelocity
          texts={[
            <span className="text-sm font-helvetica font-light px-6 py-2 space-x-12">
              <span className="tracking-wide">
                Available for collaboration at&nbsp;
                <a href="#" className="font-normal">
                  dasaniket20002@gmail.com
                </a>
              </span>
              <span>\</span>
            </span>,
            <span className="text-sm font-helvetica font-light px-6 py-2 space-x-12">
              <span className="tracking-wide">Scroll Down</span>
              <span>\</span>
            </span>,
          ]}
          velocity={60}
          numCopies={10}
        />
      </div>
    </div>
  );
}
