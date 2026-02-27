import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn } from "../../utils";
import NameRequest from "./name-request";
import ServiceRequest from "./service-request";
import DateRequest from "./date-request";
import SendAction from "./send-action";

export default function ContactContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  // Reveal animation — always covers exactly 25vh of scrolling, regardless of container height
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.75"], // top of container: viewport bottom → 25% into viewport
  });

  // Exit animation — fixed viewport distance for the blur-out
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"], // bottom of container: viewport bottom → viewport top (1vh)
  });

  const titleRevealY = useTransform(revealProgress, [0, 1], ["100%", "0%"]);

  // Combine entry blur and exit blur
  const _revealBlur = useTransform(revealProgress, [0, 1], [3, 0]);
  const _exitBlur = useTransform(exitProgress, [0.8, 1], [0, 3]);
  const _titleBlur = useTransform([_revealBlur, _exitBlur], ([reveal, exit]) =>
    Math.max(reveal as number, exit as number),
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleBlur}px)`;

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      id="contact"
      ref={containerRef}
      className="h-[50dvh] w-full px-16 md:px-32 pt-16 flex flex-col gap-8"
    >
      <div className="sticky top-16 md:relative md:top-0 z-1 flex-none mix-blend-difference">
        <div className="mask-b-from-80%">
          <m.h3
            style={{ y: titleRevealY, filter: titleRevealBlur }}
            className="text-4xl font-width-125 font-light tracking-wide uppercase"
          >
            CONNECT WITH ME
          </m.h3>
        </div>
        <div className="mask-b-from-80%">
          <m.p
            style={{ y: titleRevealY, filter: titleRevealBlur }}
            className="text-xl font-width-120 font-extralight tracking-wide uppercase"
          >
            Fill the form below
          </m.p>
        </div>
      </div>
      <Form className="flex-1" />
    </div>
  );
}

function Form({ className }: { className?: string }) {
  const [name, setName] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<string>("");

  return (
    <m.form
      initial={{ filter: "blur(3px)", opacity: 0.5 }}
      whileInView={{ filter: "blur(0px)", opacity: 1 }}
      viewport={{ margin: "-128px" }}
      className={cn(
        "font-width-85 tracking-wide grid grid-cols-3 grid-rows-[1fr_auto] gap-y-8",
        className,
      )}
    >
      <h2 className="relative text-5xl leading-relaxed col-span-full md:col-[2/4] row-[1/2] h-min self-end">
        <span className="italic">"</span>
        Hey, my name is
        <NameRequest inputValue={name} setInputValue={setName} />
        and I'm <br className="hidden md:block" />
        looking for
        <ServiceRequest inputValue={service} setInputValue={setService} />
        services. <br />
        Are you available on
        <DateRequest inputValue={date} setInputValue={setDate} /> for a chat?
        <span className="italic">"</span>
      </h2>
      <SendAction
        className="col-span-full md:col-[2/4] row-[2/3] self-start"
        name={name}
        service={service}
        date={date}
      />
    </m.form>
  );
}
