import { lazy, Suspense, useEffect, useState } from "react";
import IconBrandThreeJS from "../../components/svg/icon-brand-threejs";
import IconGridDots from "../../components/svg/icon-grid-dots";
import { cn } from "../../utils";

const GlassScene = lazy(() => import("../../components/glass/glass-scene"));

function RandomString({
  className,
  length,
  inView,
}: {
  className?: string;
  length: number;
  inView: boolean;
}) {
  const [hex, setHex] = useState<string[]>([]);

  useEffect(() => {
    if (!inView) return;

    let timeout: number;
    let interval = 100;

    const getRandomHex = (length: number) =>
      [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16));
    const updateHex = () => {
      if (timeout) clearTimeout(timeout);

      setHex(getRandomHex(length));
      timeout = setTimeout(() => updateHex(), interval);
      interval += 5;
    };

    updateHex();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [length, inView]);

  return (
    <section
      className={cn(
        "grid grid-cols-[2ch_6rem_2ch] items-center justify-center text-center",
        className,
      )}
    >
      <span>{`[`}</span>
      <p>
        {hex.map((h, i) => (
          <span key={`${h}${i}`}>{h}</span>
        ))}
      </p>
      <span>{`]`}</span>
    </section>
  );
}

export default function FooterGraphic({
  className,
  inView,
}: {
  className?: string;
  inView: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <Suspense fallback={null}>
        <GlassScene inView={inView} />
      </Suspense>
      <div className="absolute inset-0 py-16 px-16 md:px-32 pointer-events-none text-light-d grid grid-rows-2 grid-cols-2">
        <div className="row-[1/2] col-[1/2] flex gap-3 items-center h-min">
          <IconBrandThreeJS className="stroke-1" />
          <p className="text-lg">R3F + Rapier + Vite</p>
        </div>
        <div className="row-[2/3] col-[1/2] flex items-end gap-3">
          {/* <IconBorderCornerSquare className="-rotate-90" /> */}
          <RandomString className="opacity-50" length={8} inView={inView} />
        </div>
        <div className="row-[2/3] col-[2/3] flex gap-1 justify-end items-end">
          <IconGridDots />
          <IconGridDots />
          <IconGridDots />
        </div>
      </div>
    </div>
  );
}
