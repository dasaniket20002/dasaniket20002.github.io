import { converter } from "culori";
import { Color, FrontSide, Group, Mesh, MeshPhysicalMaterial } from "three";
import { getColorPropertyValue } from "../../utils";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { animate, MotionValue, useMotionValue } from "motion/react";
import { useFrame } from "@react-three/fiber";

const _COLOR_DARK = converter("rgb")(getColorPropertyValue("dark-d"));
const COLOR_DARK = new Color().setRGB(
  _COLOR_DARK?.r ?? 0,
  _COLOR_DARK?.g ?? 0,
  _COLOR_DARK?.b ?? 0,
);

const _COLOR_LIGHT = converter("rgb")(getColorPropertyValue("dark-d"));
const COLOR_LIGHT = new Color().setRGB(
  _COLOR_LIGHT?.r ?? 0,
  _COLOR_LIGHT?.g ?? 0,
  _COLOR_LIGHT?.b ?? 0,
);

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

  useEffect(() => {
    const poiSeq = async () => {
      await animate(poiY, [-4, -0.25], {
        duration: 1,
        delay: 0.75,
        ease: "easeInOut",
      });
      animate(poiY, [-0.25, 0, -0.25], {
        duration: 6,
        ease: "easeInOut",
        repeatType: "loop",
        repeat: Infinity,
      });
    };

    const surrSeq = async (
      value: MotionValue<number>,
      initialKeyframes: number[],
      animateKeyframes: number[],
      animateDuration: number,
    ) => {
      await animate(value, initialKeyframes, {
        duration: 1,
        delay: 0.5,
        ease: "easeInOut",
      });
      animate(value, animateKeyframes, {
        duration: animateDuration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      });
    };

    surrSeq(surrmesh1, [-8, -4], [-4, -4.5, -4], 12);
    surrSeq(surrmesh2, [-16, -8], [-8, -9, -8], 16);
    surrSeq(surrmesh3, [-10, -8], [-8, -8.5, -8], 24);
    poiSeq();
  }, [poiY, surrmesh1, surrmesh2, surrmesh3]);

  useFrame(() => {
    if (poiRef.current) {
      poiRef.current.position.set(
        poiRef.current.position.x,
        poiY.get(),
        poiRef.current.position.z,
      );
    }

    if (surrmesh1Ref.current) {
      surrmesh1Ref.current.position.set(
        surrmesh1.get(),
        surrmesh1Ref.current.position.y,
        surrmesh1Ref.current.position.z,
      );
    }
    if (surrmesh2Ref.current) {
      surrmesh2Ref.current.position.set(
        surrmesh2Ref.current.position.x,
        surrmesh2.get(),
        surrmesh2Ref.current.position.z,
      );
    }
    if (surrmesh3Ref.current) {
      surrmesh3Ref.current.position.set(
        surrmesh3Ref.current.position.x,
        surrmesh3Ref.current.position.y,
        surrmesh3.get(),
      );
    }
  });

  return (
    <group>
      <group ref={poiRef} scale={4}>
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

      <mesh
        ref={surrmesh1Ref}
        position={[-4, -4, 8]}
        scale={4}
        material={MESH_SURROUND_MAT}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      <mesh
        ref={surrmesh2Ref}
        position={[8, -8, 8]}
        scale={4}
        material={MESH_SURROUND_MAT}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 6]} />
      </mesh>
      <mesh
        ref={surrmesh3Ref}
        position={[16, 0, -8]}
        scale={4}
        material={MESH_SURROUND_MAT}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 4, 2]} />
      </mesh>
      <mesh
        ref={surrmesh4Ref}
        position={[-8, -8, -8]}
        scale={4}
        material={MESH_SURROUND_MAT}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      <mesh
        ref={surrmesh5Ref}
        position={[0, -8, 0]}
        scale={4}
        material={MESH_SURROUND_MAT}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
    </group>
  );
}
