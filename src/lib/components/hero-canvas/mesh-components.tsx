import { Instance, Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  animate,
  useMotionValue,
  type AnimationPlaybackControlsWithThen,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { FrontSide, Group, Mesh, MeshPhysicalMaterial } from "three";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";
import { getColorPropertyRGB } from "../../utils";

const COLOR_DARK = getColorPropertyRGB("dark-d");
const COLOR_LIGHT = getColorPropertyRGB("light-l");

const MESH_BODY_MAT = new MeshPhysicalMaterial({
  side: FrontSide,
  color: COLOR_DARK,
  roughness: 0.75,
  metalness: 0.25,
  reflectivity: 0.25,
  iridescence: 0.7,
  iridescenceIOR: 1,
});

const MESH_LETTER_MAT = new MeshPhysicalMaterial({
  side: FrontSide,
  color: COLOR_LIGHT,
  roughness: 0.1,
  metalness: 0.5,
  reflectivity: 0.75,
  iridescence: 0.7,
  iridescenceIOR: 1,
});

const MESH_SURROUND_MAT = new MeshPhysicalMaterial({
  side: FrontSide,
  color: COLOR_DARK,
  roughness: 0.75,
  metalness: 0.25,
  reflectivity: 0.25,
  iridescence: 0.7,
  iridescenceIOR: 1,
});

export default function MeshComponents() {
  const { meshes } = useGLTF("/assets/models/logo-model/logo-model.gltf");
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  const poiRef = useRef<Group>(null);
  const poiY = useMotionValue(0);

  const surrmesh1Ref = useRef<Mesh>(null);
  const surrmesh2Ref = useRef<Mesh>(null);
  const surrmesh3Ref = useRef<Mesh>(null);
  const surrmesh4Ref = useRef<Mesh>(null);
  const surrmesh5Ref = useRef<Mesh>(null);

  const surrmesh1 = useMotionValue(0);
  const surrmesh2 = useMotionValue(0);
  const surrmesh3 = useMotionValue(0);
  const surroundValues = useMemo(
    () => [surrmesh1, surrmesh2, surrmesh3],
    [surrmesh1, surrmesh2, surrmesh3],
  );

  /* ---- Animations ---- */

  useEffect(() => {
    const poiSeq = async () => {
      await animate(poiY, [-4, -0.25], {
        duration: 3,
        delay: 0.75,
        ease: "easeInOut",
      });

      if (qualitySettings.loopPoiAnimation) {
        animate(poiY, [-0.25, 0, -0.25], {
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        });
      }
    };

    poiSeq();
  }, [poiY, qualitySettings.loopPoiAnimation]);

  useEffect(() => {
    if (!qualitySettings.surroundAnimations) {
      if (surrmesh1Ref.current) surrmesh1Ref.current.position.x = -4;
      if (surrmesh2Ref.current) surrmesh2Ref.current.position.y = -8;
      if (surrmesh3Ref.current) surrmesh3Ref.current.position.z = -8;
      return;
    }

    const controls: Promise<AnimationPlaybackControlsWithThen>[] =
      qualitySettings.surroundAnimations.map(async (cfg, i) => {
        await animate(surroundValues[i], cfg.initial, {
          duration: 3,
          delay: 0.5,
          ease: "easeInOut",
        });
        return animate(surroundValues[i], cfg.loop, {
          duration: cfg.loopDuration,
          ease: "easeInOut",
          repeat: Infinity,
        });
      });

    return () => {
      controls.forEach((ctrl) => ctrl.then((c) => c.stop()));
    };
  }, [
    surroundValues,
    qualitySettings.surroundAnimations,
    surrmesh1,
    surrmesh2,
    surrmesh3,
  ]);

  /* ---- Per-frame updates ---- */

  useFrame(() => {
    if (poiRef.current) poiRef.current.position.y = poiY.get();

    if (!qualitySettings.surroundAnimations) return;

    if (surrmesh1Ref.current) surrmesh1Ref.current.position.x = surrmesh1.get();
    if (surrmesh2Ref.current) surrmesh2Ref.current.position.y = surrmesh2.get();
    if (surrmesh3Ref.current) surrmesh3Ref.current.position.z = surrmesh3.get();
  });

  /* ---- Scene graph ---- */

  return (
    <group>
      <group ref={poiRef} scale={4} position={[0, -4, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={meshes["logo_exp_base"].geometry}
          material={MESH_BODY_MAT}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={meshes["logo_exp_top"].geometry}
          material={MESH_BODY_MAT}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={meshes["logo_exp_letters"].geometry}
          material={MESH_LETTER_MAT}
        />
      </group>

      <Instances limit={5} material={MESH_SURROUND_MAT}>
        <boxGeometry />
        <Instance
          ref={surrmesh1Ref}
          scale={8}
          position={[-8, -4, 8]}
          receiveShadow
          castShadow
        />
        <Instance
          ref={surrmesh2Ref}
          position={[8, -16, 8]}
          scale={[8, 8, 16]}
          receiveShadow
          castShadow
        />
        <Instance
          ref={surrmesh3Ref}
          position={[16, 0, -10]}
          scale={[8, 16, 8]}
          receiveShadow
          castShadow
        />
        <Instance
          ref={surrmesh4Ref}
          position={[-8, -8, -8]}
          scale={8}
          receiveShadow
          castShadow
        />
        <Instance
          ref={surrmesh5Ref}
          position={[0, -8, 0]}
          scale={8}
          receiveShadow
          castShadow
        />
      </Instances>
    </group>
  );
}
