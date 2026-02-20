import { useEffect, useState } from "react";
import { cn, wait } from "../../utils";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import * as m from "motion/react-m";

type DisplayMetric =
  | { key: string; type: "solo" }
  | { key: string; value: string; type: "pair" };

export default function MetricsDisplay({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<DisplayMetric[]>([]);
  const { staticMetrics, benchmarkMetrics } = usePerformanceMetrics();

  useEffect(() => {
    const addStaticMetrics = async () => {
      if (!staticMetrics) return;

      setMetrics([{ key: "Benchmarking...", type: "solo" }]);
      await wait(250);

      setMetrics((m) => [
        ...m,
        {
          key: "hardware_concurrency",
          value: `${staticMetrics.hardwareConcurrency} cores`,
          type: "pair",
        },
      ]);
      await wait(250);

      if (staticMetrics.deviceMemory) {
        setMetrics((m) => [
          ...m,
          {
            key: "usable_memory",
            value: `${staticMetrics.deviceMemory} GB`,
            type: "pair",
          },
        ]);
        await wait(250);
      }

      setMetrics((m) => [
        ...m,
        {
          key: "browser_name",
          value: `${staticMetrics.browserName} / ${staticMetrics.browserVersion}`,
          type: "pair",
        },
      ]);
      await wait(250);

      if (staticMetrics.gpuVendor) {
        setMetrics((m) => [
          ...m,
          {
            key: "gpu_vendor",
            value: `${staticMetrics.gpuVendor}`,
            type: "pair",
          },
        ]);
        await wait(250);
      }

      if (staticMetrics.gpuRenderer) {
        setMetrics((m) => [
          ...m,
          {
            key: "gpu_renderer",
            value: `${staticMetrics.gpuRenderer}`,
            type: "pair",
          },
        ]);
        await wait(250);
      }
    };
    addStaticMetrics();
  }, [staticMetrics]);

  useEffect(() => {
    const addBenchmarkMetrics = async () => {
      if (!benchmarkMetrics) return;

      setMetrics((m) => [
        ...m,
        {
          key: "avg_fps",
          value: `${benchmarkMetrics.avgFps}`,
          type: "pair",
        },
      ]);
      await wait(250);

      setMetrics((m) => [
        ...m,
        {
          key: "max_fps",
          value: `${benchmarkMetrics.maxFps}`,
          type: "pair",
        },
      ]);
      await wait(250);

      setMetrics((m) => [
        ...m,
        {
          key: "min_fps",
          value: `${benchmarkMetrics.minFps}`,
          type: "pair",
        },
      ]);
      await wait(250);

      setMetrics((m) => [
        ...m,
        {
          key: "sample_frames",
          value: `${benchmarkMetrics.sampleFrames}`,
          type: "pair",
        },
      ]);
      await wait(250);

      setMetrics((m) => [
        ...m,
        {
          key: "sys_perf",
          value: `${benchmarkMetrics.rating.toUpperCase()}`,
          type: "pair",
        },
      ]);
    };
    addBenchmarkMetrics();
  }, [benchmarkMetrics]);

  return (
    <div
      className={cn(
        "relative w-full border border-transparent border-b-light-d/25 flex flex-col justify-end gap-1 overflow-hidden mask-t-from-80%",
        className,
      )}
    >
      {metrics.map((metric) => (
        <m.span
          key={metric.key}
          layout
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-none flex gap-[0.5ch] items-center whitespace-nowrap"
        >
          <p className="text-dark-l text-sm font-medium">{`$.${metric.key}`}</p>
          {metric.type === "pair" && (
            <p
              className={cn(
                "text-dark-l text-base truncate",
                metric.key === "sys_perf" && "text-light-d",
              )}
            >
              {`> ${metric.value}`}
            </p>
          )}
        </m.span>
      ))}
    </div>
  );
}
