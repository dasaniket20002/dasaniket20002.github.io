import type { Sketch, SketchProps } from "@p5-wrapper/react";
import * as p5 from "p5";
import type { MenuItem } from "../infinite-menu-p5";

window.p5 = p5;

export type InfiniteMenuSketchProps = SketchProps & {
  items: MenuItem[];
  scale: number;
  onActiveItemChange: (index: number) => void;
  onMovementChange: (isMoving: boolean) => void;
  fragShader: string;
  vertShader: string;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getLerpFactor(rate: number, deltaTime: number): number {
  return 1 - Math.pow(1 - rate, deltaTime / 16.667);
}

// ============================================
// QUATERNION CLASS
// ============================================
class Quat {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static identity(): Quat {
    return new Quat(0, 0, 0, 1);
  }

  static fromAxisAngle(axis: Vec3, angle: number): Quat {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    return new Quat(axis.x * s, axis.y * s, axis.z * s, Math.cos(halfAngle));
  }

  multiply(q: Quat): Quat {
    return new Quat(
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
    );
  }

  normalize(): Quat {
    const len = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
    if (len > 0.00001) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
      this.w /= len;
    }
    return this;
  }

  conjugate(): Quat {
    return new Quat(-this.x, -this.y, -this.z, this.w);
  }

  slerp(target: Quat, t: number): Quat {
    // Clamp t to avoid overshooting
    t = Math.max(0, Math.min(1, t));

    let dot =
      this.x * target.x +
      this.y * target.y +
      this.z * target.z +
      this.w * target.w;

    let tx = target.x,
      ty = target.y,
      tz = target.z,
      tw = target.w;
    if (dot < 0) {
      dot = -dot;
      tx = -tx;
      ty = -ty;
      tz = -tz;
      tw = -tw;
    }

    if (dot > 0.9995) {
      return new Quat(
        this.x + t * (tx - this.x),
        this.y + t * (ty - this.y),
        this.z + t * (tz - this.z),
        this.w + t * (tw - this.w)
      ).normalize();
    }

    const theta0 = Math.acos(Math.min(1, dot));
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);

    if (sinTheta0 < 0.0001) {
      return this.clone();
    }

    const s0 = Math.cos(theta) - (dot * sinTheta) / sinTheta0;
    const s1 = sinTheta / sinTheta0;

    return new Quat(
      s0 * this.x + s1 * tx,
      s0 * this.y + s1 * ty,
      s0 * this.z + s1 * tz,
      s0 * this.w + s1 * tw
    ).normalize();
  }

  rotateVector(v: Vec3): Vec3 {
    const qv = new Quat(v.x, v.y, v.z, 0);
    const result = this.multiply(qv).multiply(this.conjugate());
    return new Vec3(result.x, result.y, result.z);
  }

  clone(): Quat {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  toAxisAngle(): { axis: Vec3; angle: number } {
    const clampedW = Math.max(-1, Math.min(1, this.w));
    const angle = 2 * Math.acos(clampedW);
    const s = Math.sin(angle / 2);
    if (s > 0.00001) {
      return {
        axis: new Vec3(this.x / s, this.y / s, this.z / s),
        angle: angle,
      };
    }
    return { axis: new Vec3(1, 0, 0), angle: 0 };
  }
}

// ============================================
// VECTOR3 CLASS
// ============================================
class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s: number): Vec3 {
    return new Vec3(this.x * s, this.y * s, this.z * s);
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vec3 {
    const len = this.length();
    if (len > 0.00001) {
      return new Vec3(this.x / len, this.y / len, this.z / len);
    }
    return new Vec3(0, 0, 0);
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
}

// ============================================
// ICOSAHEDRON GEOMETRY
// ============================================
function createIcosahedronVertices(
  radius: number = 2,
  subdivisions: number = 1
): Vec3[] {
  const t = (1 + Math.sqrt(5)) / 2;

  const vertices: Vec3[] = [
    new Vec3(-1, t, 0),
    new Vec3(1, t, 0),
    new Vec3(-1, -t, 0),
    new Vec3(1, -t, 0),
    new Vec3(0, -1, t),
    new Vec3(0, 1, t),
    new Vec3(0, -1, -t),
    new Vec3(0, 1, -t),
    new Vec3(t, 0, -1),
    new Vec3(t, 0, 1),
    new Vec3(-t, 0, -1),
    new Vec3(-t, 0, 1),
  ];

  let faces = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const midPointCache: Record<string, number> = {};

  function getMidPoint(a: number, b: number): number {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    if (midPointCache[key] !== undefined) return midPointCache[key];

    const p1 = vertices[a];
    const p2 = vertices[b];
    const mid = new Vec3(
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2,
      (p1.z + p2.z) / 2
    );
    vertices.push(mid);
    midPointCache[key] = vertices.length - 1;
    return midPointCache[key];
  }

  for (let i = 0; i < subdivisions; i++) {
    const newFaces: number[][] = [];
    for (const face of faces) {
      const a = getMidPoint(face[0], face[1]);
      const b = getMidPoint(face[1], face[2]);
      const c = getMidPoint(face[2], face[0]);

      newFaces.push([face[0], a, c]);
      newFaces.push([face[1], b, a]);
      newFaces.push([face[2], c, b]);
      newFaces.push([a, b, c]);
    }
    faces = newFaces;
  }

  return vertices.map((v) => v.normalize().scale(radius));
}

// ============================================
// ARCBALL CONTROL
// ============================================
class ArcballControl {
  private p5: p5.default;
  isPointerDown = false;
  orientation = Quat.identity();
  rotationVelocity = 0;
  rotationAxis = new Vec3(1, 0, 0);
  snapDirection = new Vec3(0, 0, -1);
  snapTargetDirection: Vec3 | null = null;

  private pointerPos = { x: 0, y: 0 };
  private previousPointerPos = { x: 0, y: 0 };

  // Smoothed values for output
  private _smoothRotationVelocity = 0;
  private _smoothRotationAxis = new Vec3(1, 0, 0);

  // Velocity tracking
  private velocityBuffer: number[] = [];
  private axisBuffer: Vec3[] = [];
  private readonly VELOCITY_BUFFER_SIZE = 5;

  constructor(p5Instance: p5.default) {
    this.p5 = p5Instance;
  }

  onPointerDown(x: number, y: number): void {
    this.pointerPos = { x, y };
    this.previousPointerPos = { x, y };
    this.isPointerDown = true;
    this.velocityBuffer = [];
    this.axisBuffer = [];
  }

  onPointerUp(): void {
    this.isPointerDown = false;
  }

  onPointerMove(x: number, y: number): void {
    if (this.isPointerDown) {
      this.pointerPos = { x, y };
    }
  }

  private project(pos: { x: number; y: number }): Vec3 {
    const r = 2;
    const w = this.p5.width;
    const h = this.p5.height;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos.x - w - 1) / s;
    const y = (2 * pos.y - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }
    return new Vec3(-x, -y, z);
  }

  private quatFromVectors(
    a: Vec3,
    b: Vec3,
    scaleFactor: number = 1
  ): { quat: Quat; axis: Vec3; angle: number } {
    const cross = a.cross(b);
    const axis = cross.normalize();
    const d = Math.max(-1, Math.min(1, a.dot(b)));
    const angle = Math.acos(d) * scaleFactor;

    if (cross.length() < 0.0001) {
      return { quat: Quat.identity(), axis: new Vec3(1, 0, 0), angle: 0 };
    }

    return {
      quat: Quat.fromAxisAngle(axis, angle),
      axis,
      angle,
    };
  }

  update(deltaTime: number): void {
    const dt = Math.min(deltaTime || 16, 50);

    let rotationThisFrame = Quat.identity();
    let currentAxis = this.rotationAxis.clone();
    let currentVelocity = 0;

    if (this.isPointerDown) {
      const dx = this.pointerPos.x - this.previousPointerPos.x;
      const dy = this.pointerPos.y - this.previousPointerPos.y;
      const movementMagnitude = Math.sqrt(dx * dx + dy * dy);

      if (movementMagnitude > 0.5) {
        // Use interpolated position for smoother rotation
        const lerpFactor = getLerpFactor(0.4, dt);
        const interpPos = {
          x: this.previousPointerPos.x + dx * lerpFactor,
          y: this.previousPointerPos.y + dy * lerpFactor,
        };

        const current = this.project(interpPos).normalize();
        const previous = this.project(this.previousPointerPos).normalize();

        const { quat, axis, angle } = this.quatFromVectors(
          current,
          previous,
          2.5
        );

        if (angle > 0.0001) {
          rotationThisFrame = quat;
          currentAxis = axis;
          currentVelocity = angle / (dt / 1000);

          // Update previous position smoothly
          this.previousPointerPos = { ...interpPos };
        }
      } else {
        // Smooth transition when nearly stationary
        const lerpFactor = getLerpFactor(0.15, dt);
        this.previousPointerPos = {
          x:
            this.previousPointerPos.x +
            (this.pointerPos.x - this.previousPointerPos.x) * lerpFactor,
          y:
            this.previousPointerPos.y +
            (this.pointerPos.y - this.previousPointerPos.y) * lerpFactor,
        };
      }

      // Add to velocity buffer for smoothing
      this.velocityBuffer.push(currentVelocity);
      this.axisBuffer.push(currentAxis);
      if (this.velocityBuffer.length > this.VELOCITY_BUFFER_SIZE) {
        this.velocityBuffer.shift();
        this.axisBuffer.shift();
      }
    } else {
      // Apply snap rotation when not dragging
      if (this.snapTargetDirection) {
        const snapLerpFactor = getLerpFactor(0.12, dt);
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = a.sub(b).length() ** 2;

        // Stronger snap when closer
        const distanceFactor = Math.max(0.05, 1 - sqrDist * 8);
        const { quat, axis, angle } = this.quatFromVectors(
          a,
          b,
          snapLerpFactor * distanceFactor
        );

        if (angle > 0.0001) {
          rotationThisFrame = quat;
          currentAxis = axis;
          currentVelocity = (angle / (dt / 1000)) * 0.1;
        }
      }
    }

    // Apply rotation
    this.orientation = rotationThisFrame.multiply(this.orientation).normalize();

    // Smooth the rotation velocity output (frame-rate independent)
    const velocityLerpFactor = getLerpFactor(0.25, dt);

    // Average velocity from buffer when dragging
    let targetVelocity = currentVelocity;
    if (this.isPointerDown && this.velocityBuffer.length > 0) {
      targetVelocity =
        this.velocityBuffer.reduce((a, b) => a + b, 0) /
        this.velocityBuffer.length;
    }

    this._smoothRotationVelocity +=
      (targetVelocity - this._smoothRotationVelocity) * velocityLerpFactor;

    // Decay velocity when not moving
    if (!this.isPointerDown) {
      this._smoothRotationVelocity *= Math.pow(0.95, dt / 16.667);
    }

    // Smooth rotation axis
    const axisLerpFactor = getLerpFactor(0.3, dt);
    this._smoothRotationAxis = new Vec3(
      this._smoothRotationAxis.x +
        (currentAxis.x - this._smoothRotationAxis.x) * axisLerpFactor,
      this._smoothRotationAxis.y +
        (currentAxis.y - this._smoothRotationAxis.y) * axisLerpFactor,
      this._smoothRotationAxis.z +
        (currentAxis.z - this._smoothRotationAxis.z) * axisLerpFactor
    ).normalize();

    // Output smoothed values
    this.rotationVelocity = Math.min(this._smoothRotationVelocity * 0.015, 0.5);
    this.rotationAxis = this._smoothRotationAxis;
  }
}

// ============================================
// SKETCH FUNCTION
// ============================================
export const infiniteMenuSketch: Sketch<InfiniteMenuSketchProps> = (p5) => {
  // State
  let control: ArcballControl;
  let instancePositions: Vec3[] = [];
  let atlasTexture: p5.default.Graphics | null = null;
  let atlasSize = 1;
  let discShader: p5.default.Shader;
  let activeItemIndex = 0;
  let isMoving = false;
  let cameraZ = 4;
  let targetCameraZ = 4;
  let items: MenuItem[] = [];
  let scaleFactor = 1.0;
  let fragShader = "";
  let vertShader = "";

  // Callbacks
  let onActiveItemChange: ((index: number) => void) | null = null;
  let onMovementChange: ((isMoving: boolean) => void) | null = null;

  const SPHERE_RADIUS = 2;
  const DISC_SCALE = 0.25;

  // Load texture atlas
  const loadTextureAtlas = (menuItems: MenuItem[]) => {
    if (menuItems.length === 0) return;

    atlasSize = Math.ceil(Math.sqrt(menuItems.length));
    const cellSize = 512;

    atlasTexture = p5.createGraphics(
      atlasSize * cellSize,
      atlasSize * cellSize,
      p5.WEBGL
    );
    atlasTexture.background(68);

    menuItems.forEach((item, i) => {
      p5.loadImage(
        item.image,
        (img) => {
          if (!atlasTexture) return;
          const x = (i % atlasSize) * cellSize - atlasTexture.width / 2;
          const y =
            Math.floor(i / atlasSize) * cellSize - atlasTexture.height / 2;
          atlasTexture.image(img, x, y, cellSize, cellSize);
        },
        () => {
          console.warn("Failed to load image:", item.image);
        }
      );
    });
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.pixelDensity(Math.min(2, p5.pixelDensity()));
    p5.setAttributes({ antialias: true });

    // Initialize control
    control = new ArcballControl(p5);

    // Generate icosahedron vertices
    instancePositions = createIcosahedronVertices(SPHERE_RADIUS, 1);

    // Create shader
    discShader = p5.createShader(vertShader, fragShader);

    // Setup touch events
    (p5.canvas as HTMLCanvasElement).style.touchAction = "none";
  };

  p5.updateWithProps = (props: InfiniteMenuSketchProps) => {
    if (props.items && props.items !== items) {
      items = props.items;
      loadTextureAtlas(items);
    }

    if (props.scale) {
      scaleFactor = props.scale;
    }

    if (props.onActiveItemChange) {
      onActiveItemChange = props.onActiveItemChange;
    }

    if (props.onMovementChange) {
      onMovementChange = props.onMovementChange;
    }

    if (props.vertShader && props.fragShader) {
      vertShader = props.vertShader;
      fragShader = props.fragShader;
    }
  };

  p5.mousePressed = () => {
    if (
      p5.mouseX >= 0 &&
      p5.mouseX <= p5.width &&
      p5.mouseY >= 0 &&
      p5.mouseY <= p5.height
    ) {
      control.onPointerDown(p5.mouseX, p5.mouseY);
    }
  };

  p5.mouseReleased = () => {
    control.onPointerUp();
  };

  p5.mouseDragged = () => {
    control.onPointerMove(p5.mouseX, p5.mouseY);
  };

  p5.touchStarted = () => {
    if (p5.touches.length > 0) {
      const touch = p5.touches[0] as { x: number; y: number };
      control.onPointerDown(touch.x, touch.y);
    }
    return false;
  };

  p5.touchEnded = () => {
    control.onPointerUp();
    return false;
  };

  p5.touchMoved = () => {
    if (p5.touches.length > 0) {
      const touch = p5.touches[0] as { x: number; y: number };
      control.onPointerMove(touch.x, touch.y);
    }
    return false;
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  p5.draw = () => {
    const dt = Math.min(p5.deltaTime || 16.667, 50);

    // Update control
    control.update(dt);

    // Find nearest vertex and set snap target
    const snapDir = new Vec3(0, 0, -1);
    const inverseOrientation = control.orientation.conjugate();
    const transformedSnapDir = inverseOrientation.rotateVector(snapDir);

    let maxDot = -Infinity;
    let nearestIndex = 0;
    instancePositions.forEach((pos, i) => {
      const d =
        pos.x * transformedSnapDir.x +
        pos.y * transformedSnapDir.y +
        pos.z * transformedSnapDir.z;
      if (d > maxDot) {
        maxDot = d;
        nearestIndex = i;
      }
    });

    if (!control.isPointerDown) {
      const nearestPos = instancePositions[nearestIndex];
      const worldPos = control.orientation.rotateVector(nearestPos);
      control.snapTargetDirection = new Vec3(
        worldPos.x,
        worldPos.y,
        worldPos.z
      ).normalize();

      const itemIndex = items.length > 0 ? nearestIndex % items.length : 0;
      if (itemIndex !== activeItemIndex) {
        activeItemIndex = itemIndex;
        if (onActiveItemChange) {
          onActiveItemChange(activeItemIndex);
        }
      }
    }

    // Update movement state
    const currentlyMoving =
      control.isPointerDown || Math.abs(control.rotationVelocity) > 0.005;
    if (currentlyMoving !== isMoving) {
      isMoving = currentlyMoving;
      if (onMovementChange) {
        onMovementChange(isMoving);
      }
    }

    // Camera animation with proper delta time
    targetCameraZ = 4 * scaleFactor;
    if (control.isPointerDown) {
      targetCameraZ += control.rotationVelocity * 80 + 2.5;
    }

    // Frame-rate independent camera smoothing
    const cameraLerpFactor = getLerpFactor(
      control.isPointerDown ? 0.12 : 0.08,
      dt
    );
    cameraZ += (targetCameraZ - cameraZ) * cameraLerpFactor;

    // Render
    p5.background(0, 0, 0, 0);

    // Set camera
    p5.perspective(p5.PI / 4, p5.width / p5.height, 0.1, 100);
    p5.camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);

    // Enable blending
    p5.blendMode(p5.BLEND);

    if (!atlasTexture) return;

    // Sort instances by depth for proper transparency
    const transformedPositions = instancePositions.map((pos, i) => {
      const rotated = control.orientation.rotateVector(pos);
      return {
        index: i,
        pos: new Vec3(rotated.x, rotated.y, rotated.z),
        z: rotated.z,
      };
    });
    transformedPositions.sort((a, b) => a.z - b.z);

    // Draw each disc
    p5.shader(discShader);
    discShader.setUniform("uTexture", atlasTexture);
    discShader.setUniform("uAtlasSize", atlasSize);
    discShader.setUniform("uItemCount", items.length);
    discShader.setUniform("uSphereRadius", SPHERE_RADIUS);
    discShader.setUniform("uRotationAxis", [
      control.rotationAxis.x,
      control.rotationAxis.y,
      control.rotationAxis.z,
    ]);
    discShader.setUniform("uRotationVelocity", control.rotationVelocity);

    for (const item of transformedPositions) {
      const SCALE_INTENSITY = 0.6;
      const depthFactor = Math.abs(item.pos.z) / SPHERE_RADIUS;
      const s = depthFactor * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * DISC_SCALE;

      discShader.setUniform("uDiscPosition", [
        item.pos.x,
        item.pos.y,
        item.pos.z,
      ]);
      discShader.setUniform("uDiscScale", finalScale);
      discShader.setUniform("uItemIndex", item.index);

      p5.push();
      p5.noStroke();
      p5.plane(2, 2);
      p5.pop();
    }

    p5.resetShader();
  };
};
