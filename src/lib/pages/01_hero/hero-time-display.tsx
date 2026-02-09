"use client";

import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import AnimatedTicker from "../../components/animated-ticker";
import { cn, getISTParts } from "../../utils";

export default function HeroTimeDisplay({
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

    // cleanup
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
        "select-none uppercase flex flex-col gap-1 items-end",
        className,
      )}
    >
      {/* Date */}
      <p className="text-xs font-light tracking-wider text-dark-1 opacity-25 whitespace-normal trim-text-caps">
        {shortDate ? parts.dateShort : parts.dateFull}
      </p>

      {/* Time (Animated) */}
      <div
        className="flex items-center gap-[0.25ch] text-xs text-dark-1 font-light"
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

      <p className="text-sm trim-text-caps font-light tracking-wider text-dark-1">
        IST
      </p>

      {/* Hidden machine-readable time for accessibility & microdata */}
      <time dateTime={parts.iso} className="sr-only">
        {parts.dateFull} {parts.hourStr}:{parts.minuteStr} {parts.ampm}
      </time>
    </div>
  );
}
