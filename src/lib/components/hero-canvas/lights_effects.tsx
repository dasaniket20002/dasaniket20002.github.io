import {
  Bloom,
  DepthOfField,
  EffectComposer,
  FXAA,
  SSAO,
} from "@react-three/postprocessing";
import { converter } from "culori";
import { useMemo } from "react";
import { Color } from "three";
import { getColorPropertyValue } from "../../utils";

export default function LightsAndEffects() {
  const lightColor = useMemo(() => {
    const col = getColorPropertyValue("light-l");
    const rgb = converter("rgb")(col);
    const color_rep = new Color().setRGB(rgb?.r ?? 0, rgb?.g ?? 0, rgb?.b ?? 0);
    return color_rep;
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, -10]}
        intensity={1}
        color={lightColor}
        castShadow
        shadow-mapSize={1024}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10, 1, 128]}
        />
      </directionalLight>
      <EffectComposer multisampling={0} enableNormalPass>
        <FXAA />
        <SSAO
          samples={8}
          radius={0.1}
          intensity={20}
          luminanceInfluence={0.6}
        />
        <DepthOfField
          focusDistance={53}
          focalLength={12}
          bokehScale={4}
          height={720}
        />
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.5}
          height={360}
        />
      </EffectComposer>
    </>
  );
}
