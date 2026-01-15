import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function randomRange(
  min: number,
  max: number,
  exclude: number[] = []
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
  outMax: number
): number {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
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
