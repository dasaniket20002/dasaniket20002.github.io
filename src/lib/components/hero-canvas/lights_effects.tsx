import {
  Bloom,
  DepthOfField,
  EffectComposer,
  FXAA,
  SSAO,
} from "@react-three/postprocessing";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";
import { getColorPropertyRGB } from "../../utils";

const COLOR_LIGHT = getColorPropertyRGB("dark-l");

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
      <EffectComposer
        multisampling={0}
        enableNormalPass
        enabled={qualitySettings.usePostProcessing}
      >
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
          width={qualitySettings.effectRes}
          height={qualitySettings.effectRes}
        />
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.5}
          mipmapBlur
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
      </EffectComposer>
    </>
  );
}
