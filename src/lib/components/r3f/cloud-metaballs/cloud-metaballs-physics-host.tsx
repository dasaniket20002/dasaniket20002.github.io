import { Canvas } from "@react-three/fiber";
import { CLOUD_BALLS, useCloudSimContext } from "./cloud-sim-context";
import { CloudPhysicsHost } from "./cloud-scene-logic";

export default function CloudMetaballsPhysicsHost() {
  const { activeViewCount } = useCloudSimContext();
  return (
    <Canvas frameloop={activeViewCount > 0 ? "always" : "never"}>
      <CloudPhysicsHost balls={CLOUD_BALLS} />
    </Canvas>
  );
}
