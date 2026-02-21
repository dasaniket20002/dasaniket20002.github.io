import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useRef } from "react";

export type PerformanceRating = "high" | "medium" | "low";

export type StaticPerformanceMetrics = {
  hardwareConcurrency: number;
  deviceMemory: number;
  browserName: string;
  browserVersion: string;
  gpuVendor: string;
  gpuRenderer: string;
};

export type BenchmarkPerformanceMetrics = {
  avgFps: number;
  maxFps: number;
  minFps: number;
  sampleFrames: number;
  duration: number;
  rating: PerformanceRating;
};

export type PerformanceMetrics = {
  staticMetrics?: StaticPerformanceMetrics;
  benchmarkMetrics?: BenchmarkPerformanceMetrics;
};

export type PerformanceMetricsContextValue = {
  findStaticMetrics: (
    gl: WebGLRenderingContext | WebGL2RenderingContext | null,
  ) => StaticPerformanceMetrics;
  setBenchmarkMetrics: (result: BenchmarkPerformanceMetrics) => void;
  performanceRating?: PerformanceRating;
} & PerformanceMetrics;

const WARMUP_DURATION = 0.1;
const BENCHMARK_DURATION = 2.9;

export const PerformanceMetricsContext =
  createContext<PerformanceMetricsContextValue | null>(null);

export function usePerformanceMetrics() {
  const ctx = useContext(PerformanceMetricsContext);
  if (!ctx) {
    throw new Error(
      "usePerformanceMetrics must be used within PerformanceMetricsProvider",
    );
  }
  return ctx;
}

export function useBenchmarkRunner() {
  const { setBenchmarkMetrics } = usePerformanceMetrics();

  const currentBenchmarkDataRef = useRef<{
    frameTimes: number[];
    elapsed: number;
    warmupElapsed: number;
    phase: "warmup" | "running" | "done";
  }>({
    frameTimes: [],
    elapsed: 0,
    warmupElapsed: 0,
    phase: "warmup",
  });

  useFrame((_, delta) => {
    const d = currentBenchmarkDataRef.current;
    if (d.phase === "done") return;

    /* ---- warmup ---- */
    if (d.phase === "warmup") {
      d.warmupElapsed += delta;
      if (d.warmupElapsed >= WARMUP_DURATION) d.phase = "running";
      return;
    }

    /* ---- running ---- */
    d.elapsed += delta;

    if (d.elapsed < BENCHMARK_DURATION) {
      // Clamp absurd deltas (tab-switch / GC pause) so they don't poison stats
      d.frameTimes.push(Math.min(delta, 0.5));
      return;
    }

    /* ---- done ---- */
    d.phase = "done";

    const ft = d.frameTimes;
    if (ft.length === 0) return;

    let totalTime = 0;
    let minDelta = Infinity;
    let maxDelta = 0;

    for (const dt of ft) {
      totalTime += dt;
      if (dt < minDelta) minDelta = dt;
      if (dt > maxDelta) maxDelta = dt;
    }

    // Harmonic-mean FPS
    const avgFps = ft.length / totalTime;
    const maxFps = 1 / minDelta;
    const minFps = 1 / maxDelta;

    let rating: BenchmarkPerformanceMetrics["rating"];
    if (avgFps >= 55) rating = "high";
    else if (avgFps >= 30) rating = "medium";
    else rating = "low";

    setBenchmarkMetrics({
      avgFps: Math.round(avgFps * 100) / 100,
      maxFps: Math.round(maxFps * 100) / 100,
      minFps: Math.round(minFps * 100) / 100,
      sampleFrames: ft.length,
      duration: Math.round(totalTime * 100) / 100,
      rating,
    });
  });
}
