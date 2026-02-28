import {
  Merged,
  PerspectiveCamera,
  PositionMesh,
  RenderTexture,
  Text,
  useCursor,
  useGLTF,
  type InstanceProps,
  type MergedProps,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BufferGeometry,
  Euler,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
  type EulerOrder,
  type Group,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getColorPropertyRGB } from "../../utils";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";

/*
Author: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063
Title: Old Computers
*/

// ─── Helpers ────────────────────────────────────────────────────────────────

type StaticMeshDef = {
  geometry: BufferGeometry;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

/**
 * Clone each geometry, bake its transform into the vertices, flip winding
 * order when the determinant is negative (negative uniform scale), then
 * merge everything into a single BufferGeometry → **one draw call**.
 */
function buildMergedGeometry(defs: StaticMeshDef[]): BufferGeometry | null {
  const _mat = new Matrix4();
  const _pos = new Vector3();
  const _quat = new Quaternion();
  const _scl = new Vector3();
  const _euler = new Euler();

  const clones: BufferGeometry[] = [];

  for (const def of defs) {
    const clone = def.geometry.clone();

    _pos.set(...def.position);
    _euler.set(...def.rotation);
    _quat.setFromEuler(_euler);
    _scl.setScalar(def.scale);

    _mat.compose(_pos, _quat, _scl);
    clone.applyMatrix4(_mat);

    // Negative‐determinant matrix means odd axis flips → reverse winding
    if (_mat.determinant() < 0) {
      const idx = clone.index;
      if (idx) {
        const arr = idx.array as Uint16Array | Uint32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const tmp = arr[i]!;
          arr[i] = arr[i + 2]!;
          arr[i + 2] = tmp;
        }
        idx.needsUpdate = true;
      }
    }

    clones.push(clone);
  }

  const merged = mergeGeometries(clones, false);

  // dispose intermediate clones
  for (const c of clones) c.dispose();

  return merged;
}

// ─── Instancing context ─────────────────────────────────────────────────────

const context = createContext<Record<string, React.FC<InstanceProps>> | null>(
  null,
);

export function Instances({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<MergedProps, "meshes" | "children">) {
  const { nodes } = useGLTF(
    "/assets/models/computers/computers_1-transformed.glb",
  );

  // Only the meshes that are actually referenced as instances.
  // Removed Object45 / 46 / 47 / 48 — they were allocated but never used.
  const instances = useMemo(
    () => ({
      Object: nodes.Object_4,
      Object1: nodes.Object_16,
      Object3: nodes.Object_52,
      Object13: nodes.Object_172,
      Object14: nodes.Object_174,
      Object23: nodes.Object_22,
      Object24: nodes.Object_26,
      Object32: nodes.Object_178,
      Object36: nodes.Object_28,
      Sphere: nodes.Sphere,
    }),
    [nodes],
  );

  return (
    <Merged meshes={instances} {...props}>
      {(instances) => (
        <context.Provider value={instances} children={children} />
      )}
    </Merged>
  );
}

// ─── Colours ────────────────────────────────────────────────────────────────

const COLOR_DARK_D = getColorPropertyRGB("dark-d");
const COLOR_DARK_L = getColorPropertyRGB("dark-l");
const COLOR_LIGHT_D = getColorPropertyRGB("light-d");
const COLOR_LIGHT_L = getColorPropertyRGB("light-l");

// ─── Computers ──────────────────────────────────────────────────────────────

export function Computers({
  position,
  rotation,
  scale,
}: {
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number, order?: EulerOrder];
  scale?: number;
}) {
  const { materials, meshes } = useGLTF(
    "/assets/models/computers/computers_1-transformed.glb",
  );
  const instances = useContext(context);
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  // ── Merge all static Texture‑material meshes into ONE geometry ──────────
  // Before: 29 separate <mesh> elements → 29 draw calls.
  // After : 1 <mesh> → 1 draw call.
  const mergedStaticGeo = useMemo(() => {
    if (!meshes) return null;

    const defs: StaticMeshDef[] = [
      {
        geometry: meshes.Object_24.geometry,
        position: [-2.42, 0.94, -2.25],
        rotation: [0, 0.14, Math.PI / 2],
        scale: -1.52,
      },
      {
        geometry: meshes.Object_18.geometry,
        position: [-0.19, 0, -2.96],
        rotation: [0, -0.06, 0],
        scale: 1.52,
      },
      // ── Mirrored side (scale -1, rotation [-π,0,0]) ──
      {
        geometry: meshes.Object_140.geometry,
        position: [5.53, 2.18, 0.17],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_142.geometry,
        position: [5.79, 0.94, 0.18],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_144.geometry,
        position: [5.74, 1.57, 0.05],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_146.geometry,
        position: [5.43, 0.32, 0.37],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_148.geometry,
        position: [5.65, 2.79, 0.11],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_150.geometry,
        position: [5.56, 4.03, 0.35],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_152.geometry,
        position: [5.46, 3.41, 0.26],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_154.geometry,
        position: [5.87, 4.66, 0.08],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_156.geometry,
        position: [4.86, 0, -2.54],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_158.geometry,
        position: [5.53, 0, -0.85],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_160.geometry,
        position: [5.06, 0, -1.6],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_162.geometry,
        position: [4.05, 0, -2.96],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_164.geometry,
        position: [2.59, 0, -4],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_166.geometry,
        position: [3.29, 0, -3.1],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_168.geometry,
        position: [1.66, 0, -4.54],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_170.geometry,
        position: [0.59, 0, -4.7],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_176.geometry,
        position: [1.33, 1.83, -3.82],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_180.geometry,
        position: [4.86, 2.14, -2.54],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_182.geometry,
        position: [5.53, 2.14, -0.85],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_184.geometry,
        position: [5.06, 2.14, -1.6],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_186.geometry,
        position: [4.05, 2.14, -2.96],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_188.geometry,
        position: [2.59, 2.14, -4],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_190.geometry,
        position: [3.3, 2.14, -3.31],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_192.geometry,
        position: [1.66, 2.14, -4.54],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_194.geometry,
        position: [0.59, 2.14, -4.7],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_200.geometry,
        position: [0.75, 3.98, -4.66],
        rotation: [-Math.PI, 0, 0],
        scale: -1,
      },
      {
        geometry: meshes.Object_204.geometry,
        position: [3.2, 4.29, -3.09],
        rotation: [-Math.PI, 0.56, 0],
        scale: -1,
      },
    ];

    return buildMergedGeometry(defs);
  }, [meshes]);

  if (!instances) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── Single merged static mesh (was 29 draw calls) ─────────────── */}
      {mergedStaticGeo && (
        <mesh
          castShadow
          receiveShadow
          geometry={mergedStaticGeo}
          material={materials.Texture}
        />
      )}

      {/* ── Instanced floating objects ────────────────────────────────── */}
      <instances.Object
        position={[0.16, 0.79, -1.97]}
        rotation={[-0.54, 0.93, -1.12]}
        scale={0.5}
        castShadow
        receiveShadow
      />
      <instances.Object
        position={[-2.79, 0.27, 1.82]}
        rotation={[-1.44, 1.22, 1.43]}
        scale={0.5}
      />
      <instances.Object
        position={[-5.6, 4.62, -0.03]}
        rotation={[-1.96, 0.16, 1.2]}
        scale={0.5}
      />
      <instances.Object
        position={[2.62, 1.98, -2.47]}
        rotation={[-0.42, -0.7, -1.85]}
        scale={0.5}
      />
      <instances.Object
        position={[4.6, 3.46, 1.19]}
        rotation={[-1.24, -0.72, 0.48]}
        scale={0.5}
      />

      {/* ── Instanced computer bodies (Object1) ──────────────────────── */}
      <instances.Object1
        position={[0.63, 0, -3]}
        rotation={[0, 0.17, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-2.36, 0.32, -2.02]}
        rotation={[0, 0.53, -Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-3.53, 0, 0.59]}
        rotation={[Math.PI, -1.09, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-3.53, 1.53, 0.59]}
        rotation={[0, 0.91, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[3.42, 0, 0]}
        rotation={[-Math.PI, 1.13, -Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[4.09, 2.18, 2.41]}
        rotation={[0, -1.55, 1.57]}
        scale={1.52}
      />
      <instances.Object1
        position={[-3.69, 0, 2.59]}
        rotation={[0, -1.57, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.36, 2.18, 0.81]}
        rotation={[0, 0.77, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.47, 2.79, 0.74]}
        rotation={[Math.PI, -1.16, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.28, 0, -2.33]}
        rotation={[0, 0.75, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.49, 0, -1.38]}
        rotation={[Math.PI, -0.99, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-3.01, 0, -3.79]}
        rotation={[0, 0.6, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-2.08, 0, -4.32]}
        rotation={[Math.PI, -0.6, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-1.02, 0, -4.49]}
        rotation={[0, 0.31, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.31, 1.83, -1.41]}
        rotation={[0, 1.06, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-4.18, 1.83, -3.06]}
        rotation={[-Math.PI, -0.46, -Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-1.76, 1.83, -3.6]}
        rotation={[0, -1.16, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-0.25, 1.83, -5.54]}
        rotation={[0, 1.55, 1.57]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.28, 2.14, -2.33]}
        rotation={[Math.PI, -0.75, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.49, 2.14, -1.38]}
        rotation={[0, 0.99, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-3.01, 2.14, -3.79]}
        rotation={[Math.PI, -0.6, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-2.08, 2.14, -4.32]}
        rotation={[0, 0.6, 0]}
        scale={1.52}
      />
      <instances.Object1
        position={[-1.02, 2.14, -4.49]}
        rotation={[Math.PI, -0.31, Math.PI]}
        scale={1.52}
      />
      <instances.Object1
        position={[-5.31, 3.98, -1.41]}
        rotation={[0, 1.06, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-4.18, 3.98, -3.06]}
        rotation={[-Math.PI, -0.46, -Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-1.17, 3.98, -4.45]}
        rotation={[0, 0.17, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object1
        position={[-0.94, 3.98, -4.66]}
        rotation={[Math.PI, 0.02, -Math.PI / 2]}
        scale={1.52}
      />

      {/* ── Instanced Object3 ─────────────────────────────────────────── */}
      <instances.Object3
        position={[4.31, 1.57, 2.34]}
        rotation={[0, -1.15, -Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object3
        position={[-3.79, 0, 1.66]}
        rotation={[Math.PI, -1.39, 0]}
        scale={-1.52}
      />
      <instances.Object3
        position={[-3.79, 1.53, 1.66]}
        rotation={[0, 1.22, -Math.PI]}
        scale={-1.52}
      />
      <instances.Object3
        position={[-5.56, 1.57, 0.69]}
        rotation={[0, 1.17, -Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object3
        position={[-5.29, 3.41, 0.89]}
        rotation={[Math.PI, -0.76, -Math.PI / 2]}
        scale={-1.52}
      />

      {/* ── Instanced Object13 / 14 / 32 ─────────────────────────────── */}
      <instances.Object13
        position={[4.89, 1.83, -1.62]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />
      <instances.Object13
        position={[4.89, 3.98, -1.62]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />
      <instances.Object14
        position={[3.75, 1.83, -3.28]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />
      <instances.Object14
        position={[3.75, 3.98, -3.28]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />
      <instances.Object32
        position={[3.77, 1.84, -2.98]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />
      <instances.Object32
        position={[3.77, 3.98, -2.98]}
        rotation={[-Math.PI, 0, 0]}
        scale={-1}
      />

      {/* ── Instanced Object23 / 24 ──────────────────────────────────── */}
      <instances.Object23
        position={[-2.29, 1.56, -2.26]}
        rotation={[0, -0.005, -Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object24
        position={[-2.19, 2.19, -1.87]}
        rotation={[0, 0.51, Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object23
        position={[-2.9, 0.3, -1.47]}
        rotation={[Math.PI, -1.35, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object23
        position={[3.22, 0, -0.8]}
        rotation={[0, -1.32, 0]}
        scale={1.52}
      />
      <instances.Object23
        position={[3.53, 1.83, 0.44]}
        rotation={[-Math.PI, 1.32, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object23
        position={[4.26, 0.94, 2.22]}
        rotation={[0, -1, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object24
        position={[3.87, 0.32, 2.35]}
        rotation={[0, -1.53, -1.57]}
        scale={-1.52}
      />
      <instances.Object23
        position={[-5.61, 0.94, 0.82]}
        rotation={[0, 1.32, 1.57]}
        scale={1.52}
      />
      <instances.Object24
        position={[-5.26, 0.32, 1.01]}
        rotation={[0, 0.79, -Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object23
        position={[-5.39, 4.03, 0.99]}
        rotation={[Math.PI, -0.61, Math.PI / 2]}
        scale={1.52}
      />
      <instances.Object24
        position={[-5.7, 4.66, 0.72]}
        rotation={[Math.PI, -1.13, -Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object23
        position={[-5.95, 0, -0.64]}
        rotation={[0, 0.95, 0]}
        scale={1.52}
      />
      <instances.Object23
        position={[-4.48, 0, -2.75]}
        rotation={[Math.PI, -0.57, Math.PI]}
        scale={1.52}
      />
      <instances.Object23
        position={[-3.72, 0, -2.89]}
        rotation={[0, 0.64, 0]}
        scale={1.52}
      />
      <instances.Object23
        position={[-0.08, 0, -5.03]}
        rotation={[Math.PI, -0.04, Math.PI]}
        scale={1.52}
      />
      <instances.Object24
        position={[-4.19, 1.84, -2.77]}
        rotation={[Math.PI, -0.66, -Math.PI / 2]}
        scale={-1.52}
      />
      <instances.Object23
        position={[-5.95, 2.14, -0.64]}
        rotation={[Math.PI, -0.95, Math.PI]}
        scale={1.52}
      />
      <instances.Object23
        position={[-4.48, 2.14, -2.75]}
        rotation={[0, 0.57, 0]}
        scale={1.52}
      />
      <instances.Object23
        position={[-3.73, 2.14, -3.1]}
        rotation={[Math.PI, -0.64, Math.PI]}
        scale={1.52}
      />
      <instances.Object23
        position={[-0.08, 2.14, -5.03]}
        rotation={[0, 0.04, 0]}
        scale={1.52}
      />
      <instances.Object24
        position={[-4.19, 3.98, -2.77]}
        rotation={[Math.PI, -0.66, -Math.PI / 2]}
        scale={-1.52}
      />

      {/* ── Instanced keyboards (Object36) ────────────────────────────── */}
      <instances.Object36
        position={[0.35, 2.35, -3.34]}
        rotation={[-0.26, 0, 0]}
      />
      <instances.Object36
        position={[0.18, 2.8, -2.85]}
        rotation={[0.09, 0.15, -0.005]}
      />
      <instances.Object36
        position={[1.89, 0, -1.94]}
        rotation={[0, -0.44, 0]}
        scale={[1.5, 1, 1.5]}
      />
      <instances.Object36
        position={[1.86, 1.61, -1.81]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <instances.Object36
        position={[3.95, 2.49, 1.61]}
        rotation={[0, -Math.PI / 3, 0]}
      />
      <instances.Object36
        position={[-1.1, 4.29, -4.43]}
        rotation={[0, 0.36, 0]}
      />
      <instances.Object36
        position={[-5.25, 4.29, -1.47]}
        rotation={[0, 1.25, 0]}
      />

      {/* ── Screens (require unique render textures — can't instance) ── */}
      <ScreenInteractive
        frame="Object_206"
        panel="Object_207"
        position={[0.27, 1.53, -2.61]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        frame="Object_209"
        panel="Object_210"
        y={5}
        position={[-1.43, 2.5, -1.8]}
        rotation={[0, 1, 0]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        invert
        frame="Object_212"
        panel="Object_213"
        x={-5}
        y={5}
        position={[-2.73, 0.63, -0.52]}
        rotation={[0, 1.09, 0]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        invert
        frame="Object_215"
        panel="Object_216"
        position={[1.84, 0.38, -1.77]}
        rotation={[0, -Math.PI / 9, 0]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        invert
        frame="Object_218"
        panel="Object_219"
        x={-5}
        position={[3.11, 2.15, -0.18]}
        rotation={[0, -0.79, 0]}
        scale={0.81}
        resolution={qualitySettings.renderTexRes}
      />
      {/* <ScreenText
        frame="Object_221"
        panel="Object_222"
        y={5}
        position={[-3.42, 3.06, 1.3]}
        rotation={[0, 1.22, 0]}
        scale={0.9}
        resolution={qualitySettings.renderTexRes}
      /> */}
      <ScreenText
        invert
        frame="Object_224"
        panel="Object_225"
        position={[-3.9, 4.29, -2.64]}
        rotation={[0, 0.54, 0]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        frame="Object_227"
        panel="Object_228"
        position={[0.96, 4.28, -4.2]}
        rotation={[0, -0.65, 0]}
        resolution={qualitySettings.renderTexRes}
      />
      <ScreenText
        frame="Object_230"
        panel="Object_231"
        position={[4.68, 4.29, -1.56]}
        rotation={[0, -Math.PI / 3, 0]}
        resolution={qualitySettings.renderTexRes}
      />

      {/* ── LEDs ──────────────────────────────────────────────────────── */}
      <Leds sphere={instances.Sphere} />
    </group>
  );
}

// ─── Screen wrapper ─────────────────────────────────────────────────────────

type Screen = {
  frame: string;
  panel: string;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number, order?: EulerOrder];
  scale?: number;
  children?: React.ReactNode;
  resolution: number;
};

function Screen({
  frame,
  panel,
  children,
  position,
  rotation,
  scale,
  resolution,
}: Screen) {
  const { meshes, materials } = useGLTF(
    "/assets/models/computers/computers_1-transformed.glb",
  );
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={meshes[frame].geometry} material={materials.Texture} />
      <mesh geometry={meshes[panel].geometry}>
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture
            width={resolution}
            height={resolution}
            attach="map"
            anisotropy={4}
            children={children}
            generateMipmaps
          />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

// ─── Screen variants ────────────────────────────────────────────────────────

type ScreenText = { invert?: boolean; x?: number; y?: number } & Screen;

function ScreenText({ invert, x = 0, y = 1.2, ...props }: ScreenText) {
  const textRef = useRef<Mesh>(null);
  const randRef = useRef(0);

  useEffect(() => {
    randRef.current = Math.random() * 10000;
  }, []);

  useFrame((state) => {
    if (!textRef.current) return;
    (textRef.current.position as Vector3).x =
      x + Math.sin(randRef.current + state.clock.elapsedTime / 4) * 8;
  });

  return (
    <Screen {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1}
        position={[0, 0, 15]}
        near={1}
        far={20}
        resolution={props.resolution}
      />
      <color attach="background" args={[invert ? "black" : COLOR_DARK_L]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text
        position={[x, y, 0]}
        ref={textRef}
        fontSize={4}
        letterSpacing={-0.1}
        color={!invert ? "black" : COLOR_DARK_L}
      >
        aniket.
      </Text>
    </Screen>
  );
}

function ScreenInteractive(props: Screen) {
  return (
    <Screen {...props}>
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1}
        position={[0, 0, 10]}
        near={1}
        far={20}
        resolution={props.resolution}
      />
      <color attach="background" args={[COLOR_DARK_D]} />
      <ambientLight intensity={Math.PI / 2} />
      <pointLight decay={0} position={[10, 10, 10]} intensity={Math.PI} />
      <pointLight decay={0} position={[-10, -10, -10]} />
      <SpinningBox position={[-3.15, 0.75, 0]} scale={0.5} />
    </Screen>
  );
}

// ─── SpinningBox ────────────────────────────────────────────────────────────

function SpinningBox({
  scale = 1,
  position,
  rotation,
}: {
  scale?: number;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number, order?: EulerOrder];
}) {
  const ref = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta;
    ref.current.rotation.x = ref.current.rotation.y;

    const target = clicked ? scale * 2.5 : scale * 1;
    const eased = MathUtils.damp(ref.current.scale.x, target, 6, delta);
    ref.current.scale.setScalar(eased);

    if (!materialRef.current) return;
    const targetColor = hovered ? COLOR_LIGHT_D : COLOR_LIGHT_L;
    materialRef.current.color.lerp(targetColor, 1 - Math.exp(-6 * delta));
  });

  return (
    <mesh
      ref={ref}
      onClick={() => click((c) => !c)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      position={position}
      rotation={rotation}
    >
      <boxGeometry />
      <meshStandardMaterial ref={materialRef} />
    </mesh>
  );
}

// ─── LEDs ───────────────────────────────────────────────────────────────────

const LED_POSITIONS: [number, number, number][] = [
  [-0.41, 1.1, -2.21],
  [0.59, 1.32, -2.22],
  [1.77, 1.91, -1.17],
  [2.44, 1.1, -0.79],
  [4.87, 3.8, -0.1],
  [1.93, 3.8, -3.69],
  [-2.35, 3.8, -3.48],
  [-4.71, 4.59, -1.81],
  [-3.03, 2.85, 1.19],
  [-1.21, 1.73, -1.49],
];

function Leds({ sphere: Sphere }: { sphere: React.FC<InstanceProps> }) {
  const ref = useRef<Group>(null);
  const frameCount = useRef(0);

  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    if (!ref.current) return;

    const elapsed = state.clock.elapsedTime;
    const children = ref.current.children;
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as PositionMesh;
      const rand = Math.abs(2 + mesh.position.x);
      const t = (1 + Math.sin(rand * 10 + elapsed * rand)) / 2;
      mesh.color.setRGB(0, t * 2.5, t);
    }
  });

  return (
    <group ref={ref}>
      {LED_POSITIONS.map((pos, i) => (
        <Sphere key={i} position={pos} scale={0.005} color={[0, 2, 1]} />
      ))}
    </group>
  );
}
