import { clsx, type ClassValue } from "clsx";
import { converter, parse } from "culori";
import { twMerge } from "tailwind-merge";
import { Color } from "three";

export const PRIMARY_EMAIL = "dasaniketconnects@gmail.com";
export const PRIMARY_TEL = "+91-91238-00536";

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

export const preloadWithProgress = async (
  urls: string[],
  onProgress?: (p: number) => void,
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
        onProgress?.(Math.round((loadedBytes / totalBytes) * 100));
      }
    }),
  );
};

export const getColorPropertyValue = (
  propertyName:
    | "light-l"
    | "light-d"
    | "dark-l"
    | "dark-d"
    | "accent"
    | "success",
) => {
  const oklchString = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${propertyName}`)
    .trim();
  return parse(oklchString);
};

export const getColorPropertyRGB = (
  propertyName:
    | "light-l"
    | "light-d"
    | "dark-l"
    | "dark-d"
    | "accent"
    | "success",
) => {
  const _color = converter("rgb")(getColorPropertyValue(propertyName));
  const color = new Color().setRGB(
    _color?.r ?? 0,
    _color?.g ?? 0,
    _color?.b ?? 0,
  );
  return color;
};

export const COLOR_DARK_D = getColorPropertyRGB("dark-d");
export const COLOR_DARK_L = getColorPropertyRGB("dark-l");
export const COLOR_LIGHT_D = getColorPropertyRGB("light-d");
export const COLOR_LIGHT_L = getColorPropertyRGB("light-l");

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
