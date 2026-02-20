import { useState } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn } from "../../utils";
import DateRequest from "./date-request";
import NameRequest from "./name-request";
import SendAction from "./send-action";
import ServiceRequest from "./service-request";

export default function Contact({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();

  return (
    <SectionContainer
      id="contact"
      title="contact"
      subTitle="dg/04"
      theme="dark"
      className={className}
    >
      <section
        className={cn(
          "size-full grid grid-cols-[4rem_1fr_1fr_4rem] md:grid-cols-[8rem_1fr_1fr_8rem]",
          "grid-rows-[var(--min-section-header-height)_auto_1fr_var(--min-section-header-height)] md:grid-rows-[var(--section-header-height)_1fr_1fr_var(--section-header-height)]",
        )}
        ref={registerSection}
      >
        <div className="row-[2/3] col-[2/4] md:row-[1/2] md:col-[2/3] size-full place-content-end px-4 pt-16 md:pb-1 md:pt-0 space-y-2">
          <h1 className="text-end font-black font-width-110 uppercase text-5xl">
            <span className="text-light-2">Schedule an</span> appointment{" "}
            <span className="text-light-2">/</span>
          </h1>
          <p className="text-end text-lg font-width-110 font-medium tracking-wide pr-[3ch]">
            <span className="text-light-2">What services I can</span> help you
            with?
          </p>
        </div>
        <Form className="row-[3/4] md:row-[2/4] col-[2/4]" />
      </section>
    </SectionContainer>
  );
}

function Form({ className }: { className?: string }) {
  const [name, setName] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [date, setDate] = useState<string>("");

  return (
    <form
      className={cn(
        "pt-24 font-width-85 tracking-wide grid grid-cols-4 grid-rows-[auto_1fr] md:grid-rows-3",
        className,
      )}
    >
      <h2 className="relative text-5xl leading-relaxed col-span-full md:col-[1/4] row-[1/2] h-min">
        <span className="absolute -left-[1ch] scale-150 italic">"</span>
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
        className="col-span-full md:col-[1/4] row-[2/3]"
        name={name}
        service={service}
        date={date}
      />
    </form>
  );
}
