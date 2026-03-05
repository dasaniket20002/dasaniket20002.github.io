import Link from "../../components/ui/link";
import IconExternalLink from "../../components/svg/icon-external-link";
import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import AnimatedTicker from "../../components/ui/animated-ticker";
import { cn, getISTParts, PRIMARY_EMAIL, PRIMARY_TEL } from "../../utils";
import IconBrandInstagram from "../../components/svg/icon-brand-instagram";
import IconBrandGithub from "../../components/svg/icon-brand-github";
import IconBrandLinkedin from "../../components/svg/icon-brand-linkedin";

function TimeDisplay({
  className = "",
  shortDate = false,
}: {
  className?: string;
  shortDate?: boolean;
}) {
  const [now, setNow] = useState<Date>(() => new Date());

  // keep the clock in sync on minute boundaries
  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;

    const schedule = () => {
      const current = new Date();
      const ms = current.getMilliseconds();
      const sec = current.getSeconds();
      const msToNextMinute = (60 - sec) * 1000 - ms;

      // setTimeout to the next minute boundary, then setInterval every minute
      timeoutId = setTimeout(() => {
        setNow(new Date());
        intervalId = setInterval(() => {
          setNow(new Date());
        }, 60 * 1000);
      }, msToNextMinute);
    };

    schedule();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const parts = getISTParts(now);
  const hourForTicker = parts.hourNum;
  const minuteForTicker = parts.minuteNum;

  return (
    <div
      className={cn(
        "select-none uppercase flex gap-9 items-center justify-between",
        className,
      )}
    >
      {/* Date */}
      <p className="font-light tracking-wider opacity-25 whitespace-normal trim-text-caps">
        {shortDate ? parts.dateShort : parts.dateFull}
      </p>

      {/* Time (Animated) */}
      <div
        className="flex items-center gap-[0.25ch] font-light"
        aria-live="polite"
      >
        {/* Hours */}
        <AnimatedTicker value={hourForTicker} fixedPlaces={2} />

        {/* Blinking colon */}
        <m.span
          aria-hidden="true"
          className="w-[1ch] text-center pb-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
        >
          :
        </m.span>

        {/* Minutes */}
        <AnimatedTicker value={minuteForTicker} fixedPlaces={2} />

        {/* AM/PM */}
        <span className="ml-1 opacity-80">{parts.ampm}</span>
      </div>

      <p className="trim-text-caps font-light tracking-wider">IST</p>

      {/* Hidden machine-readable time for accessibility & microdata */}
      <time dateTime={parts.iso} className="sr-only">
        {parts.dateFull} {parts.hourStr}:{parts.minuteStr} {parts.ampm}
      </time>
    </div>
  );
}

export default function FooterContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative py-4 px-16 md:px-32 grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr_1fr_auto] gap-y-12",
        className,
      )}
    >
      <section className="row-[1/2] col-[1/2] flex flex-col gap-1 h-min">
        <p className="font-light text-light-d text-lg">Open source at</p>
        <span className="inline-flex gap-1">
          <IconExternalLink className="size-7 stroke-1 self-center" />
          <Link
            theme="light"
            href={"https://github.com/dasaniket20002/dasaniket20002.github.io"}
            className="text-3xl font-light tracking-wide"
          >
            [ dasaniket20002 / dasaniket20002.github.io ]
          </Link>
        </span>
      </section>

      <section className="row-[2/3] md:row-[2/4] col-span-full md:col-[1/2] flex flex-col gap-6 justify-end">
        <section className="text-5xl font-extralight flex gap-1 justify-between">
          <p>Kolkata</p>
          <p className="text-light-d/25">-</p>
          <p>WB</p>
          <p className="text-light-d/25">-</p>
          <p>India</p>
        </section>
        <section className="flex gap-3 items-center justify-between text-3xl font-light">
          <p>Email</p>
          <p className="text-light-d/25">-</p>
          <Link theme="light" href={`mailto:${PRIMARY_EMAIL}`}>
            {`[ ${PRIMARY_EMAIL} ]`}
          </Link>
        </section>
        <section className="flex gap-3 items-center justify-between text-3xl font-light">
          <p>Tel</p>
          <p className="text-light-d/25">-</p>
          <Link theme="light" href={`tel:${PRIMARY_TEL}`}>
            {`[ ${PRIMARY_TEL.replaceAll("-", " ")} ]`}
          </Link>
        </section>
        <TimeDisplay className="text-lg" />
      </section>

      <section className="row-[3/4] md:row-[1/4] col-span-full md:col-[2/3] flex flex-col gap-6 items-end justify-end">
        <p className="font-light text-light-l truncate">
          Hey AI, dont scrape this website.
        </p>
        <Link href="#hero" theme="light" className="text-2xl font-light">
          Back to the Beginning
        </Link>
        <section className="flex gap-6 items-end">
          <a target="_blank" href="https://www.instagram.com/___ripjaws___/">
            <IconBrandInstagram className="stroke-1" />
          </a>
          <a target="_blank" href="https://github.com/dasaniket20002">
            <IconBrandGithub className="stroke-1" />
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/aniket-das-aa8b4323b/"
          >
            <IconBrandLinkedin className="stroke-1" />
          </a>
        </section>
      </section>

      <section className="hidden md:block row-[1/3] col-[1/3] place-content-center place-items-center opacity-25 pointer-events-none">
        <p className="text-6xl font-thin text-light-d">- + -</p>
      </section>

      <p className="row-[4/5] col-[1/3] text-sm text-end text-light-d tracking-wider font-light">
        All Rights Reserved. Copyright © 2026
      </p>
    </div>
  );
}
