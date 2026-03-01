import { useRef } from "react";
import type { BodyRegistry } from "./body-registry";
import { MAX_BALLS, MAX_LIGHTS, type CloudBallsData } from "./cloud-metaballs";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Matrix4,
  NormalBlending,
  PerspectiveCamera,
  Vector3,
  Vector4,
  type ShaderMaterial,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";

import vertexShader from "./vertex-shader.glsl?raw";
import fragmentShader from "./fragment-shader.glsl?raw";

interface CloudVisualsProps {
  registryRef: React.RefObject<BodyRegistry>;
  ballConfigs: CloudBallsData[];
  smoothness: number;
  baseColor: string;
}

export default function CloudVisuals({
  registryRef,
  ballConfigs,
  smoothness,
  baseColor,
}: CloudVisualsProps) {
  const matRef = useRef<ShaderMaterial>(null!);
  const { scene } = useThree();

  const tmpDirRef = useRef(new Vector3());
  const tmpTargetPosRef = useRef(new Vector3());

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uCamPos: { value: new Vector3() },
    uInvProj: { value: new Matrix4() },
    uCamMat: { value: new Matrix4() },
    uBalls: {
      value: Array.from({ length: MAX_BALLS }, () => new Vector4()),
    },
    uCount: { value: 0 },
    uSmooth: { value: smoothness },
    uBaseColor: { value: new Color(baseColor) },
    uAmbientColor: { value: new Color(1, 1, 1) },
    uAmbientIntensity: { value: 0.5 },
    uDirLightCount: { value: 0 },
    uDirLightDirs: {
      value: Array.from({ length: MAX_LIGHTS }, () => new Vector3()),
    },
    uDirLightColors: {
      value: Array.from({ length: MAX_LIGHTS }, () => new Color()),
    },
    uDirLightIntensities: {
      value: new Array(MAX_LIGHTS).fill(0) as number[],
    },
  });

  useFrame(({ clock, camera }) => {
    const m = matRef.current;
    if (!m) return;

    const u = m.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uCamPos.value.copy(camera.position);
    u.uInvProj.value.copy(
      (camera as PerspectiveCamera).projectionMatrixInverse,
    );
    u.uCamMat.value.copy(camera.matrixWorld);

    // Sync ball positions from physics
    const balls = u.uBalls.value as Vector4[];
    let count = 0;
    for (let i = 0; i < ballConfigs.length; i++) {
      const body = registryRef.current.get(i);
      if (body) {
        const pos = body.translation();
        balls[i].set(pos.x, pos.y, pos.z, ballConfigs[i].r);
      } else {
        balls[i].set(
          ballConfigs[i].x,
          ballConfigs[i].y,
          ballConfigs[i].z,
          ballConfigs[i].r,
        );
      }
      count++;
    }

    u.uCount.value = count;
    u.uSmooth.value = smoothness;
    u.uBaseColor.value.set(baseColor);

    // Collect scene lights directly into material uniforms
    let ambFound = false;
    let dirCount = 0;

    const dirDirs = u.uDirLightDirs.value as Vector3[];
    const dirCols = u.uDirLightColors.value as Color[];
    const dirInts = u.uDirLightIntensities.value as number[];

    scene.traverse((obj) => {
      if ((obj as AmbientLight).isAmbientLight && !ambFound) {
        const light = obj as AmbientLight;
        u.uAmbientColor.value.copy(light.color);
        u.uAmbientIntensity.value = light.intensity;
        ambFound = true;
      }
      if (
        (obj as DirectionalLight).isDirectionalLight &&
        dirCount < MAX_LIGHTS
      ) {
        const light = obj as DirectionalLight;
        tmpDirRef.current.setFromMatrixPosition(light.matrixWorld);
        tmpTargetPosRef.current.setFromMatrixPosition(light.target.matrixWorld);
        dirDirs[dirCount]
          .copy(tmpDirRef.current)
          .sub(tmpTargetPosRef.current)
          .normalize();
        dirCols[dirCount].copy(light.color);
        dirInts[dirCount] = light.intensity;
        dirCount++;
      }
    });

    u.uDirLightCount.value = dirCount;
  });

  return (
    <mesh frustumCulled={false} renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        depthWrite={false}
        depthTest={false}
        transparent={true}
        blending={NormalBlending}
      />
    </mesh>
  );
}
