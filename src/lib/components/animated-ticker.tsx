import {
  AnimatePresence,
  LayoutGroup,
  useSpring,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import { cn } from "../utils";

export default function AnimatedTicker({
  value,
  className,
  showDecimals,
  fixedPlaces,
}: {
  value: number;
  className?: string;
  showDecimals?: boolean;
  fixedPlaces?: number;
}) {
  const roundedValue = parseFloat(value.toFixed(2));
  const integerPart = Math.floor(roundedValue);
  const fractionalPart = Math.round((roundedValue * 100) % 100);

  return (
    <LayoutGroup>
      <m.div layout className={cn("flex gap-px overflow-hidden", className)}>
        <AnimatePresence initial={false} mode="popLayout">
          {/* Render Integer Digits */}
          {String(integerPart)
            .padStart(fixedPlaces ?? 0, "0")
            .split("")
            .map((dig, i) => {
              // Calculate the place value for each digit (1, 10, 100, etc.)
              // const place = Math.pow(10, String(integerPart).length - 1 - i);
              return <Digit key={`int-${i}`} value={parseInt(dig)} />;
            })}
        </AnimatePresence>

        {/* 3. Conditionally render the decimal part */}
        {showDecimals && (
          <>
            {/* Static Decimal Point */}
            <m.div layout className="w-[1ch] text-center">
              .
            </m.div>

            <AnimatePresence initial={false} mode="popLayout">
              {/* Render Decimal Digit */}
              {String(fractionalPart)
                .split("")
                .map((dig, i) => {
                  // Calculate the place value for each digit (1, 10, 100, etc.)
                  // const place = Math.pow(10, String(fractionalPart).length - 1 - i);
                  return <Digit key={`int-frac-${i}`} value={parseInt(dig)} />;
                })}
            </AnimatePresence>
          </>
        )}
      </m.div>
    </LayoutGroup>
  );
}

function Digit({ value }: { value: number }) {
  const [height, setHeight] = useState<number>(16);

  const animatedValue = useSpring(value);

  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);

  return (
    <m.div
      layout
      style={{ height }}
      className="relative w-[1ch]"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0 }}
    >
      {[...Array(10).keys()].map((i) => (
        <Number
          key={`${i}-${height}`}
          mv={animatedValue}
          number={i}
          height={height}
          setHeight={setHeight}
        />
      ))}
    </m.div>
  );
}

function Number({
  mv,
  number,
  height,
  setHeight,
}: {
  mv: MotionValue;
  number: number;
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}) {
  const digitRef = useRef<HTMLSpanElement>(null);

  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  useEffect(() => {
    if (digitRef.current) {
      setHeight(digitRef.current.offsetHeight);
    }
  }, [setHeight]);

  return (
    <m.section ref={digitRef} style={{ y }} className="absolute tabular-nums">
      {number}
    </m.section>
  );
}
