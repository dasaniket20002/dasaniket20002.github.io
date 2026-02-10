import { type Rgb } from "culori";
import * as THREE from "three";
import discFragShaderSource from "./infinite-menu-fs.glsl?raw";
import discVertShaderSource from "./infinite-menu-vs.glsl?raw";
import type { MenuItem } from "./infinite-menu-types";

class Face {
  public a: number;
  public b: number;
  public c: number;

  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  public position: THREE.Vector3;
  public normal: THREE.Vector3;
  public uv: THREE.Vector2;

  constructor(x: number, y: number, z: number) {
    this.position = new THREE.Vector3(x, y, z);
    this.normal = new THREE.Vector3();
    this.uv = new THREE.Vector2();
  }
}

class Geometry {
  public vertices: Vertex[];
  public faces: Face[];

  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  public addVertex(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public addFace(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public get lastVertex(): Vertex {
    return this.vertices[this.vertices.length - 1];
  }

  public subdivide(divisions = 1): this {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array<Face>(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  public spherize(radius = 1): this {
    this.vertices.forEach((vertex) => {
      // normalize position to get direction, then scale by radius
      vertex.normal.copy(vertex.position).normalize();
      vertex.position.copy(vertex.normal).multiplyScalar(radius);
    });
    return this;
  }

  public get data(): {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  } {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }

  public get vertexData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => v.position.toArray()));
  }

  public get normalData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => v.normal.toArray()));
  }

  public get uvData(): Float32Array {
    return new Float32Array(this.vertices.flatMap((v) => v.uv.toArray()));
  }

  public get indexData(): Uint16Array {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }

  public getMidPoint(
    ndxA: number,
    ndxB: number,
    cache: Record<string, number>,
  ): number {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a.x + b.x) * 0.5, (a.y + b.y) * 0.5, (a.z + b.z) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1,
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1,
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    const safeSteps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / safeSteps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv.set(0.5, 0.5);

    for (let i = 0; i < safeSteps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv.set(x * 0.5 + 0.5, y * 0.5 + 0.5);

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, safeSteps, 1);
  }
}

// --- WebGL Boilerplate ---

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: [string, string],
  transformFeedbackVaryings?: string[] | null,
  attribLocations?: Record<string, number>,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });
  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(
      program,
      transformFeedbackVaryings,
      gl.SEPARATE_ATTRIBS,
    );
  }
  if (attribLocations) {
    for (const attrib in attribLocations) {
      gl.bindAttribLocation(program, attribLocations[attrib], attrib);
    }
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: Array<[WebGLBuffer, number, number]>,
  indices?: Uint16Array,
): WebGLVertexArrayObject | null {
  const va = gl.createVertexArray();
  if (!va) return null;
  gl.bindVertexArray(va);
  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }
  if (indices) {
    const indexBuffer = gl.createBuffer();
    if (indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
  }
  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData: number | ArrayBufferView,
  usage: number,
): WebGLBuffer {
  const buf = gl.createBuffer();
  if (!buf) throw new Error("Failed to create WebGL buffer.");
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  if (typeof sizeOrData === "number") {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number,
): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Failed to create WebGL texture.");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

type UpdateCallback = (deltaTime: number) => void;

class ArcballControl {
  private canvas: HTMLCanvasElement;
  private updateCallback: UpdateCallback;

  public isPointerDown = false;
  public orientation = new THREE.Quaternion();
  public pointerRotation = new THREE.Quaternion();
  public rotationVelocity = 0;
  public rotationAxis = new THREE.Vector3(1, 0, 0);

  public snapDirection = new THREE.Vector3(0, 0, -1);
  public snapTargetDirection: THREE.Vector3 | null = null;

  private pointerPos = new THREE.Vector2();
  private previousPointerPos = new THREE.Vector2();
  private _rotationVelocity = 0;
  private _combinedQuat = new THREE.Quaternion();

  private readonly EPSILON = 0.1;
  private readonly IDENTITY_QUAT = new THREE.Quaternion();

  constructor(canvas: HTMLCanvasElement, updateCallback?: UpdateCallback) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => undefined);

    canvas.addEventListener("pointerdown", (e: PointerEvent) => {
      this.pointerPos.set(e.clientX, e.clientY);
      this.previousPointerPos.copy(this.pointerPos);
      this.isPointerDown = true;
    });
    canvas.addEventListener("pointerup", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointerleave", () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener("pointermove", (e: PointerEvent) => {
      if (this.isPointerDown) {
        this.pointerPos.set(e.clientX, e.clientY);
      }
    });
    canvas.style.touchAction = "none";
  }

  public update(deltaTime: number, targetFrameDuration = 16): void {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = new THREE.Quaternion();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;
      const midPointerPos = new THREE.Vector2()
        .copy(this.pointerPos)
        .sub(this.previousPointerPos)
        .multiplyScalar(INTENSITY);

      if (midPointerPos.lengthSq() > this.EPSILON) {
        // Add previous to mid to simulate drag path
        const temp = new THREE.Vector2()
          .copy(this.previousPointerPos)
          .add(midPointerPos);

        const p = this.project(temp);
        const q = this.project(this.previousPointerPos);
        const a = p.normalize();
        const b = q.normalize();

        this.previousPointerPos.copy(temp);

        angleFactor *= ANGLE_AMPLIFICATION;
        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        this.pointerRotation.slerp(this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      this.pointerRotation.slerp(this.IDENTITY_QUAT, INTENSITY);

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = a.distanceToSquared(b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = new THREE.Quaternion()
      .copy(snapRotation)
      .multiply(this.pointerRotation);

    this.orientation.premultiply(combinedQuat).normalize();

    const RA_INTENSITY = 0.8 * timeScale;
    this._combinedQuat.slerp(combinedQuat, RA_INTENSITY).normalize();

    const rad = 2 * Math.acos(this._combinedQuat.w);
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis.set(
        this._combinedQuat.x / s,
        this._combinedQuat.y / s,
        this._combinedQuat.z / s,
      );
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  private quatFromVectors(
    a: THREE.Vector3,
    b: THREE.Vector3,
    out: THREE.Quaternion,
    angleFactor = 1,
  ): { q: THREE.Quaternion; axis: THREE.Vector3; angle: number } {
    const axis = new THREE.Vector3().crossVectors(a, b).normalize();
    const d = Math.max(-1, Math.min(1, a.dot(b)));
    const angle = Math.acos(d) * angleFactor;
    out.setFromAxisAngle(axis, angle);
    return { q: out, axis, angle };
  }

  private project(pos: THREE.Vector2): THREE.Vector3 {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
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
    return new THREE.Vector3(-x, y, z);
  }
}

type ActiveItemCallback = (index: number) => void;
type MovementChangeCallback = (isMoving: boolean) => void;
type InitCallback = (instance: InfiniteGridMenu) => void;

interface Camera {
  matrix: THREE.Matrix4;
  near: number;
  far: number;
  fov: number;
  aspect: number;
  position: THREE.Vector3;
  up: THREE.Vector3;
  matrices: {
    view: THREE.Matrix4;
    projection: THREE.Matrix4;
    inversProjection: THREE.Matrix4;
  };
}

class InfiniteGridMenu {
  private gl: WebGL2RenderingContext | null = null;
  private discProgram: WebGLProgram | null = null;
  private discVAO: WebGLVertexArrayObject | null = null;
  private discBuffers!: {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  };
  private icoGeo!: IcosahedronGeometry;
  private discGeo!: DiscGeometry;
  private worldMatrix = new THREE.Matrix4();
  private tex: WebGLTexture | null = null;
  private control!: ArcballControl;

  private discLocations!: {
    aModelPosition: number;
    aModelUvs: number;
    aInstanceMatrix: number;
    uWorldMatrix: WebGLUniformLocation | null;
    uViewMatrix: WebGLUniformLocation | null;
    uProjectionMatrix: WebGLUniformLocation | null;
    uCameraPosition: WebGLUniformLocation | null;
    uScaleFactor: WebGLUniformLocation | null;
    uRotationAxisVelocity: WebGLUniformLocation | null;
    uTex: WebGLUniformLocation | null;
    uFrames: WebGLUniformLocation | null;
    uItemCount: WebGLUniformLocation | null;
    uAtlasSize: WebGLUniformLocation | null;
  };

  private viewportSize = new THREE.Vector2();
  private drawBufferSize = new THREE.Vector2();

  private discInstances!: {
    matricesArray: Float32Array;
    matrices: Float32Array[];
    buffer: WebGLBuffer | null;
  };

  private instancePositions: THREE.Vector3[] = [];
  private DISC_INSTANCE_COUNT = 0;
  private atlasSize = 1;

  private _time = 0;
  private _deltaTime = 0;
  private _deltaFrames = 0;
  private _frames = 0;

  private movementActive = false;

  private TARGET_FRAME_DURATION = 1000 / 60;
  private SPHERE_RADIUS = 2;

  public camera: Camera = {
    matrix: new THREE.Matrix4(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: new THREE.Vector3(0, 0, 3),
    up: new THREE.Vector3(0, 1, 0),
    matrices: {
      view: new THREE.Matrix4(),
      projection: new THREE.Matrix4(),
      inversProjection: new THREE.Matrix4(),
    },
  };

  public smoothRotationVelocity = 0;
  public scaleFactor = 1.0;

  private canvas: HTMLCanvasElement;
  private items: MenuItem[];
  private onActiveItemChange: ActiveItemCallback;
  private onMovementChange: MovementChangeCallback;
  private clearColor: Rgb;

  private _rafId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    items: MenuItem[],
    onActiveItemChange: ActiveItemCallback,
    onMovementChange: MovementChangeCallback,
    onInit?: InitCallback,
    scale: number = 1.0,
    clearColor: Rgb = { r: 0, g: 0, b: 0, mode: "rgb" },
  ) {
    this.canvas = canvas;
    this.items = items;
    this.onActiveItemChange = onActiveItemChange;
    this.onMovementChange = onMovementChange;
    this.clearColor = clearColor;

    this.scaleFactor = scale;
    this.camera.position.z = 3 * scale;
    this.init(onInit);
  }

  public resize(): void {
    const needsResize = resizeCanvasToDisplaySize(this.canvas);
    if (!this.gl) return;
    if (needsResize) {
      this.gl.viewport(
        0,
        0,
        this.gl.drawingBufferWidth,
        this.gl.drawingBufferHeight,
      );
    }
    this.updateProjectionMatrix();
  }

  public run(time = 0): void {
    this._deltaTime = Math.min(32, time - this._time);
    this._time = time;
    this._deltaFrames = this._deltaTime / this.TARGET_FRAME_DURATION;
    this._frames += this._deltaFrames;

    this.animate(this._deltaTime);
    this.render();

    this._rafId = requestAnimationFrame((t) => this.run(t));
  }

  public start(): void {
    if (this._rafId !== null) return; // already running
    this._rafId = requestAnimationFrame((t) => {
      this._time = t; // reset time base to avoid a huge delta spike
      this.run(t);
    });
  }

  public stop(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  private init(onInit?: InitCallback): void {
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
    });
    if (!gl) throw new Error("No WebGL 2 context!");
    this.gl = gl;

    this.viewportSize.set(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize.copy(this.viewportSize);

    this.discProgram = createProgram(
      gl,
      [discVertShaderSource, discFragShaderSource],
      null,
      {
        aModelPosition: 0,
        aModelNormal: 1,
        aModelUvs: 2,
        aInstanceMatrix: 3,
      },
    );

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram!, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram!, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(
        this.discProgram!,
        "aInstanceMatrix",
      ),
      uWorldMatrix: gl.getUniformLocation(this.discProgram!, "uWorldMatrix"),
      uViewMatrix: gl.getUniformLocation(this.discProgram!, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(
        this.discProgram!,
        "uProjectionMatrix",
      ),
      uCameraPosition: gl.getUniformLocation(
        this.discProgram!,
        "uCameraPosition",
      ),
      uScaleFactor: gl.getUniformLocation(this.discProgram!, "uScaleFactor"),
      uRotationAxisVelocity: gl.getUniformLocation(
        this.discProgram!,
        "uRotationAxisVelocity",
      ),
      uTex: gl.getUniformLocation(this.discProgram!, "uTex"),
      uFrames: gl.getUniformLocation(this.discProgram!, "uFrames"),
      uItemCount: gl.getUniformLocation(this.discProgram!, "uItemCount"),
      uAtlasSize: gl.getUniformLocation(this.discProgram!, "uAtlasSize"),
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [
          makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW),
          this.discLocations.aModelPosition,
          3,
        ],
        [
          makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW),
          this.discLocations.aModelUvs,
          2,
        ],
      ],
      this.discBuffers.indices,
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.initDiscInstances(this.DISC_INSTANCE_COUNT);
    this.initTexture();
    this.control = new ArcballControl(this.canvas, (deltaTime) =>
      this.onControlUpdate(deltaTime),
    );

    this.updateCameraMatrix();
    this.updateProjectionMatrix();

    this.resize();

    if (onInit) {
      onInit(this);
    }
  }

  private initTexture(): void {
    if (!this.gl) return;
    const gl = this.gl;
    this.tex = createAndSetupTexture(
      gl,
      gl.LINEAR,
      gl.LINEAR,
      gl.CLAMP_TO_EDGE,
      gl.CLAMP_TO_EDGE,
    );

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const cellSize = 512;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(
      this.items.map(
        (item) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.src = item.image;
          }),
      ),
    ).then((images) => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        ctx.drawImage(img, x, y, cellSize, cellSize);
      });

      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        canvas,
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  private initDiscInstances(count: number): void {
    if (!this.gl || !this.discVAO) return;
    const gl = this.gl;

    const matricesArray = new Float32Array(count * 16);
    const matrices: Float32Array[] = [];
    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(
        matricesArray.buffer,
        i * 16 * 4,
        16,
      );
      const identity = new THREE.Matrix4();
      instanceMatrixArray.set(identity.elements);
      matrices.push(instanceMatrixArray);
    }

    this.discInstances = {
      matricesArray,
      matrices,
      buffer: gl.createBuffer(),
    };

    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this.discInstances.matricesArray.byteLength,
      gl.DYNAMIC_DRAW,
    );

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,
        4,
        gl.FLOAT,
        false,
        bytesPerMatrix,
        j * 4 * 4,
      );
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  private animate(deltaTime: number): void {
    if (!this.gl) return;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

    const positions = this.instancePositions.map((p) =>
      p.clone().applyQuaternion(this.control.orientation),
    );
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;

    const tempMat = new THREE.Matrix4();

    positions.forEach((p, ndx) => {
      const s =
        (Math.abs(p.z) / this.SPHERE_RADIUS) * SCALE_INTENSITY +
        (1 - SCALE_INTENSITY);
      const finalScale = s * scale;

      // Matrix construction: T * R * S
      // Translation -p
      tempMat.makeTranslation(-p.x, -p.y, -p.z);

      const m1 = new THREE.Matrix4().makeTranslation(-p.x, -p.y, -p.z);
      const m2 = new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        p,
        new THREE.Vector3(0, 1, 0),
      );
      const m3 = new THREE.Matrix4().makeScale(
        finalScale,
        finalScale,
        finalScale,
      );
      const m4 = new THREE.Matrix4().makeTranslation(0, 0, -this.SPHERE_RADIUS);

      // Combine: m1 * m2 * m3 * m4
      tempMat.copy(m1).multiply(m2).multiply(m3).multiply(m4);

      this.discInstances.matrices[ndx].set(tempMat.elements);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discInstances.buffer);
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      0,
      this.discInstances.matricesArray,
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  private render(): void {
    if (!this.gl || !this.discProgram) return;
    const gl = this.gl;

    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(
      this.clearColor.r,
      this.clearColor.g,
      this.clearColor.b,
      this.clearColor.alpha ?? 1,
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(
      this.discLocations.uWorldMatrix,
      false,
      this.worldMatrix.elements,
    );
    gl.uniformMatrix4fv(
      this.discLocations.uViewMatrix,
      false,
      this.camera.matrices.view.elements,
    );
    gl.uniformMatrix4fv(
      this.discLocations.uProjectionMatrix,
      false,
      this.camera.matrices.projection.elements,
    );
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis.x,
      this.control.rotationAxis.y,
      this.control.rotationAxis.z,
      this.smoothRotationVelocity * 1.1,
    );

    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);
    gl.uniform1f(this.discLocations.uFrames, this._frames);
    gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);

    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT,
    );
    gl.bindVertexArray(null);
  }

  private updateCameraMatrix(): void {
    this.camera.matrix.lookAt(
      this.camera.position,
      new THREE.Vector3(0, 0, 0),
      this.camera.up,
    );
    this.camera.matrix.setPosition(this.camera.position);

    this.camera.matrices.view.copy(this.camera.matrix).invert();
  }

  private updateProjectionMatrix(): void {
    if (!this.gl) return;
    const canvasEl = this.gl.canvas as HTMLCanvasElement;
    this.camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;

    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position.z;

    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
    }

    const top = this.camera.near * Math.tan(this.camera.fov * 0.5);
    const bottom = -top;
    const right = top * this.camera.aspect;
    const left = -right;

    this.camera.matrices.projection.makePerspective(
      left,
      right,
      top,
      bottom,
      this.camera.near,
      this.camera.far,
    );
    this.camera.matrices.inversProjection
      .copy(this.camera.matrices.projection)
      .invert();
  }

  private onControlUpdate(deltaTime: number): void {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;

    const isMoving =
      this.control.isPointerDown ||
      Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);

      const snapDirection =
        this.getVertexWorldPosition(nearestVertexIndex).normalize();
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position.z +=
      (cameraTargetZ - this.camera.position.z) / damping;
    this.updateCameraMatrix();
  }

  private findNearestVertexIndex(): number {
    const n = this.control.snapDirection;
    const inverseOrientation = this.control.orientation.clone().conjugate();
    const nt = n.clone().applyQuaternion(inverseOrientation);

    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = nt.dot(this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  private getVertexWorldPosition(index: number): THREE.Vector3 {
    const nearestVertexPos = this.instancePositions[index];
    return nearestVertexPos.clone().applyQuaternion(this.control.orientation);
  }
}

export default InfiniteGridMenu;
