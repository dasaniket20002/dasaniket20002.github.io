import { clsx, type ClassValue } from "clsx";
import { parse, type Hsv } from "culori";
import { twMerge } from "tailwind-merge";

export const PRIMARY_EMAIL = "aniket.das.cse24@heritageit.edu.in";

export const colorPalettes: Hsv[][] = [
  [
    { mode: "hsv", h: 161, s: 55, v: 50 },
    { mode: "hsv", h: 55, s: 82, v: 87 },
    { mode: "hsv", h: 31, s: 90, v: 97 },
    { mode: "hsv", h: 17, s: 47, v: 49 },
    { mode: "hsv", h: 95, s: 86, v: 35 },
  ],
  [
    { mode: "hsv", h: 30, s: 58, v: 90 },
    { mode: "hsv", h: 67, s: 102, v: 51 },
    { mode: "hsv", h: 32, s: 98, v: 91 },
    { mode: "hsv", h: 339, s: 100, v: 70 },
    { mode: "hsv", h: 311, s: 86, v: 49 },
  ],
  [
    { mode: "hsv", h: 39, s: 45, v: 89 },
    { mode: "hsv", h: 27, s: 120, v: 99 },
    { mode: "hsv", h: 180, s: 120, v: 56 },
    { mode: "hsv", h: 39, s: 120, v: 76 },
    { mode: "hsv", h: 350, s: 100, v: 76 },
  ],
  [
    { mode: "hsv", h: 175, s: 30, v: 65 },
    { mode: "hsv", h: 215, s: 68, v: 68 },
    { mode: "hsv", h: 15, s: 92, v: 98 },
    { mode: "hsv", h: 356, s: 84, v: 90 },
    { mode: "hsv", h: 38, s: 92, v: 98 },
  ],
  [
    { mode: "hsv", h: 150, s: 65, v: 60 },
    { mode: "hsv", h: 55, s: 92, v: 97 },
    { mode: "hsv", h: 23, s: 43, v: 47 },
    { mode: "hsv", h: 180, s: 86, v: 60 },
    { mode: "hsv", h: 120, s: 86, v: 40 },
  ],
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function randomRange(
  min: number,
  max: number,
  exclude: number[] = [],
): number {
  const excluded = new Set(exclude);

  const rangeSize = max - min + 1;

  if (excluded.size >= rangeSize) {
    throw new Error("No valid numbers left in range");
  }

  let value: number;

  do {
    value = Math.floor(Math.random() * rangeSize) + min;
  } while (excluded.has(value));

  return value;
}

export function mapRangeClamped(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export const yieldToMain = (): Promise<void> => {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => resolve(), { timeout: 16 });
    } else {
      setTimeout(resolve, 0);
    }
  });
};

export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

export const findOptimalSquareTiling = (width: number, height: number) => {
  if (
    width <= 0 ||
    height <= 0 ||
    !Number.isInteger(width) ||
    !Number.isInteger(height)
  )
    return;

  const size = gcd(width, height);
  const columns = width / size;
  const rows = height / size;

  return {
    size,
    columns,
    rows,
    totalSquares: columns * rows,
  };
};

export const preloadWithProgress = async (
  urls: string[],
  onProgress: (p: number) => void,
) => {
  let loadedBytes = 0;
  let totalBytes = 0;

  const sizes = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url, { method: "HEAD" });
      return Number(res.headers.get("Content-Length")) || 0;
    }),
  );

  totalBytes = sizes.reduce((a, b) => a + b, 0);

  await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      const reader = res.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        loadedBytes += value.length;
        onProgress(Math.round((loadedBytes / totalBytes) * 100));
      }
    }),
  );
};

export const getColorPropertyValue = (
  propertyName: "light-1" | "light-2" | "dark-1" | "dark-2" | "success",
) => {
  const oklchString = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${propertyName}`)
    .trim();
  return parse(oklchString);
};

export const getISTParts = (date = new Date()) => {
  // time parts (hour, minute, dayPeriod)
  const timeFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const parts = timeFormatter.formatToParts(date);
  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "12";
  const minutePart = parts.find((p) => p.type === "minute")?.value ?? "00";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "AM";

  // date string (08 February 2026) or short (08 Feb 2026)
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    hourStr: hourPart,
    minuteStr: minutePart,
    hourNum: parseInt(hourPart, 10),
    minuteNum: parseInt(minutePart, 10),
    ampm: dayPeriod,
    dateFull: dateFormatter.format(date),
    dateShort: shortDateFormatter.format(date),
    iso: date.toISOString(),
  };
};
