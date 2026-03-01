import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Vector3 } from "three";
import { BodyRegistry } from "./body-registry";
import { CLOUD_BALLS, CloudSimContext } from "./cloud-sim-context";

const CloudMetaballsPhysicsHost = lazy(
  () => import("./cloud-metaballs-physics-host"),
);

export const CloudSimProvider = ({
  children,
  ballCount = CLOUD_BALLS.length,
}: {
  children: React.ReactNode;
  ballCount?: number;
}) => {
  const registryRef = useRef(new BodyRegistry(ballCount));
  const mouseTargetRef = useRef(new Vector3(0, 0, 100));
  const mouseActiveRef = useRef(false);

  const [activeViewCount, setActiveViewCount] = useState(0);

  const registerView = useCallback((isMounting: boolean) => {
    setActiveViewCount((prev) => Math.max(0, prev + (isMounting ? 1 : -1)));
  }, []);

  return (
    <CloudSimContext.Provider
      value={{
        registryRef,
        mouseTargetRef,
        mouseActiveRef,
        activeViewCount,
        registerView,
      }}
    >
      <div className="absolute -z-50 h-dvh w-dvh opacity-0 pointer-events-none">
        <Suspense fallback={null}>
          <CloudMetaballsPhysicsHost />
        </Suspense>
      </div>

      {children}
    </CloudSimContext.Provider>
  );
};
