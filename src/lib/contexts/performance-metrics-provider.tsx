import { useCallback, useState } from "react";
import {
  PerformanceMetricsContext,
  type BenchmarkResult,
  type StaticPerformanceMetrics,
} from "./use-performance-metrics";

export function PerformanceMetricsProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [staticMetrics, setStaticMetrics] = useState<
    StaticPerformanceMetrics | undefined
  >();
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<
    BenchmarkResult | undefined
  >();

  const findStaticMetrics = useCallback(
    (gl: WebGLRenderingContext | WebGL2RenderingContext | null) => {
      const nAgt = navigator.userAgent;
      let browserName = navigator.appName;
      let browserVersion = "" + parseFloat(navigator.appVersion);
      let nameOffset, verOffset, ix;

      // In Opera, the true version is after "OPR" or after "Version"
      if ((verOffset = nAgt.indexOf("OPR")) != -1) {
        browserName = "Opera";
        browserVersion = nAgt.substring(verOffset + 4);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          browserVersion = nAgt.substring(verOffset + 8);
      }
      // In MS Edge, the true version is after "Edg" in userAgent
      else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
        browserName = "Microsoft Edge";
        browserVersion = nAgt.substring(verOffset + 4);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        browserVersion = nAgt.substring(verOffset + 5);
      }
      // In Chrome, the true version is after "Chrome"
      else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        browserVersion = nAgt.substring(verOffset + 7);
      }
      // In Safari, the true version is after "Safari" or after "Version"
      else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        browserVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
          browserVersion = nAgt.substring(verOffset + 8);
      }
      // In Firefox, the true version is after "Firefox"
      else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        browserVersion = nAgt.substring(verOffset + 8);
      }
      // In most other browsers, "name/version" is at the end of userAgent
      else if (
        (nameOffset = nAgt.lastIndexOf(" ") + 1) <
        (verOffset = nAgt.lastIndexOf("/"))
      ) {
        browserName = nAgt.substring(nameOffset, verOffset);
        browserVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the browserVersion string at semicolon/space if present
      if ((ix = browserVersion.indexOf(";")) != -1)
        browserVersion = browserVersion.substring(0, ix);
      if ((ix = browserVersion.indexOf(" ")) != -1)
        browserVersion = browserVersion.substring(0, ix);

      const _export: StaticPerformanceMetrics = {
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory:
          "deviceMemory" in navigator ? (navigator.deviceMemory as number) : 0,
        browserName,
        browserVersion,
        gpuVendor: "",
        gpuRenderer: "",
      };

      if (gl) {
        const debugExt = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugExt) {
          _export.gpuVendor = gl.getParameter(debugExt.UNMASKED_VENDOR_WEBGL);
          _export.gpuRenderer = gl.getParameter(
            debugExt.UNMASKED_RENDERER_WEBGL,
          );
        }
      }
      setStaticMetrics(_export);
      return _export;
    },
    [],
  );

  return (
    <PerformanceMetricsContext.Provider
      value={{
        findStaticMetrics,
        staticMetrics,
        benchmarkMetrics,
        setBenchmarkMetrics,
      }}
    >
      {children}
    </PerformanceMetricsContext.Provider>
  );
}
