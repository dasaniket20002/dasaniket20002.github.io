import {
  Bloom,
  DepthOfField,
  EffectComposer,
  FXAA,
  SSAO,
} from "@react-three/postprocessing";
import { converter } from "culori";
import { Color } from "three";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";
import { getColorPropertyValue } from "../../utils";

const _COLOR_LIGHT = converter("rgb")(getColorPropertyValue("dark-l"));
const COLOR_LIGHT = new Color().setRGB(
  _COLOR_LIGHT?.r ?? 0,
  _COLOR_LIGHT?.g ?? 0,
  _COLOR_LIGHT?.b ?? 0,
);

export default function LightsAndEffects() {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 10, -10]}
        intensity={1}
        color={COLOR_LIGHT}
        castShadow
        shadow-mapSize={qualitySettings.shadowMapRes}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10, 1, 24]}
        />
      </directionalLight>
      {qualitySettings.usePostProcessing && (
        <EffectComposer multisampling={0} enableNormalPass>
          <FXAA />
          {qualitySettings.useSSAO ? (
            <SSAO
              samples={8}
              radius={0.1}
              intensity={20}
              luminanceInfluence={0.6}
            />
          ) : (
            <></>
          )}
          <DepthOfField
            focusDistance={53}
            focalLength={12}
            bokehScale={4}
            height={qualitySettings.effectRes}
          />
          <Bloom
            luminanceThreshold={0.25}
            luminanceSmoothing={0.5}
            height={qualitySettings.effectRes}
          />
        </EffectComposer>
      )}
    </>
  );
}
