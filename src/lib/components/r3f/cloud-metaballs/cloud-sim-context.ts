import type { Vector3 } from "three";
import type { BodyRegistry } from "./body-registry";
import { createContext, useContext } from "react";

export const SPRING_STIFFNESS = 8.0;
export const SPRING_DAMPING = 3.0;

export interface CloudBallsData {
  x: number;
  y: number;
  z: number;
  r: number;
}

export const CLOUD_BALLS: CloudBallsData[] = [
  { x: 0, y: 0, z: 0, r: 0.55 },
  { x: 0.6, y: 0.05, z: 0, r: 0.5 },
  { x: -0.6, y: 0.05, z: 0, r: 0.48 },
  { x: 1.2, y: -0.05, z: 0, r: 0.42 },
  { x: -1.2, y: -0.05, z: 0, r: 0.4 },
  { x: -0.3, y: 0.45, z: 0, r: 0.44 },
  { x: 0.35, y: 0.5, z: 0, r: 0.48 },
  { x: -0.8, y: 0.3, z: 0, r: 0.38 },
  { x: 0.9, y: 0.3, z: 0, r: 0.36 },
  { x: 0.0, y: 0.7, z: 0, r: 0.35 },
  { x: 0.3, y: -0.25, z: 0.1, r: 0.38 },
  { x: -0.5, y: -0.22, z: -0.1, r: 0.36 },
];

export interface CloudSimContextValue {
  registryRef: React.RefObject<BodyRegistry>;
  mouseTargetRef: React.RefObject<Vector3>;
  mouseActiveRef: React.RefObject<boolean>;
  activeViewCount: number;
  registerView: (increment: boolean) => void;
}

export const CloudSimContext = createContext<CloudSimContextValue | null>(null);

export const useCloudSimContext = () => {
  const ctx = useContext(CloudSimContext);
  if (!ctx)
    throw new Error("useCloudSimContext must be used within CloudSimProvider");
  return ctx;
};
